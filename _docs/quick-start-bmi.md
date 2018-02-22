---
title: "Develop microservice application in minutes"
lang: en
ref: quick-start-bmi
permalink: /docs/quick-start-bmi/
excerpt: "Introduce how to develop a microservice application using ServiceComb in minutes through the BMI sample"
last_modified_at: 2017-09-06T00:50:00-55:00
---

{% include toc %}
## Before you begin
Walk through the instructions in the [Quick Start](/docs/quick-start/).

## Develop BMI microservice application in minutes
The workflow of BMI application have been introduced in [Quick start](/docs/quick-start/). It contains two separate microservices:

- **BMI calculator service**：provides computing services.

- **Web service**：provides both user interface and gateway service.

Before we start, we need to add some common dependencies in the parent project of the services'.
```java
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.apache.servicecomb</groupId>
        <artifactId>java-chassis-dependencies</artifactId>
        <version>0.6.0-SNAPSHOT</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.hibernate</groupId>
      <artifactId>hibernate-validator</artifactId>
    </dependency>
  </dependencies>
```
**Notice**: The `java-chassis-dependencies` is imported as pom to unify version management of dependencies.

Now we will introduce the detailed implementation of these two microservices. The full code is on [github](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/bmi).
### Implementation of calculator
The calculator service provides capability of calculating BMI. It contains three parts:

* Detailed calculation implementation

* Service endpoint definition

* Service startup entry

#### Detailed calculation implementation
Implement detailed calculation according to the formula \\(BMI=\frac{weight}{height^2}\\).

```java
public interface CalculatorService {
  double calculate(double height, double weight);
}

@Service
public class CalculatorServiceImpl implements CalculatorService {
  @Override
  public double calculate(double height, double weight) {
    if (height <= 0 || weight <= 0) {
      throw new IllegalArgumentException("Arguments must be above 0");
    }
    double heightInMeter = height / 100;
    return weight / (heightInMeter * heightInMeter);
  }
}
```

#### Service endpoint definition
Service endpoint is defined to generate service contact. First of all, define the endpoint interface:
```java
public interface CalculatorEndpoint {
  double calculate(double height, double weight);
}
```
Introduce ServiceComb dependency:
```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>spring-boot-starter-provider</artifactId>
    </dependency>
```
Expose calculator service's restful endpoint:
```java
@RestSchema(schemaId = "calculatorRestEndpoint")
@RequestMapping("/")
public class CalculatorRestEndpoint implements CalculatorEndpoint {

  private final CalculatorService calculatorService;

  @Autowired
  public CalculatorRestEndpoint(CalculatorService calculatorService) {
    this.calculatorService = calculatorService;
  }

  @Override
  @GetMapping("/bmi")
  public double calculate(double height, double weight) {
    return calculatorService.calculate(height, weight);
  }
}
```

ServiceComb supports SpringMvc simplified annotations, e.g. `GetMapping`, since version 0.3.0.
{: .notice--info}

Note that ServiceComb can auto-generate service contract when annotating endpoints with `@RestSchema`. Then configure the endpoint in  `microservice.yaml` as follows to register the contact and microservice to service center.
```yaml
APPLICATION_ID: bmi
service_description:
  name: calculator
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:30100
  rest:
    address: 0.0.0.0:7777
```

#### Service startup entry
Enable *ServiceComb* microservice framework by adding `@EnableServiceComb` annotation.
```java
@SpringBootApplication
@EnableServiceComb
public class CalculatorApplication {
  public static void main(String[] args) {
    SpringApplication.run(CalculatorApplication.class, args);
  }
}
```

### Implementation of webapp service
The web service provides both the user interface and gateway service. It contains three parts:

* User interface

* Gateway and routing rules

* Service startup entry

The user interface was developed using [Bootstrap](http://getbootstrap.com/).

#### Gateway and routing rules
The gateway service was implemented using the [Netflix Zuul](https://github.com/Netflix/zuul/wiki).

Introduce ServiceComb dependency:
```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>spring-boot-starter-discovery</artifactId>
    </dependency>
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>spring-boot-starter-servicecomb</artifactId>
    </dependency>
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>spring-cloud-zuul</artifactId>
    </dependency>
```

ServiceComb added `spring-cloud-zuul` module to provide better compatibility with zuul since version 0.4.0-SNAPSHOT.
{: .notice--info}

Configure routing rules and service endpoint in `application.yaml`.
```yaml
zuul:
  routes:
    calculator: /calculator/**

# disable netflix eurkea since it's not used for service discovery
ribbon:
  eureka:
    enabled: false

server:
  port: 8889
```
Enable service discovery with zuul by putting the application information and service center address in `microservice.yaml`.
```yaml
APPLICATION_ID: bmi
service_description:
  name: gateway
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:30100
```
#### Service startup entry
Add annotations to enable `ServiceComb` and `Zuul`:
```java
@SpringBootApplication
@EnableZuulProxy
@EnableServiceComb
public class GatewayApplication {
  public static void main(String[] args) {
    SpringApplication.run(GatewayApplication.class, args);
  }
}
```

Now you can refer to [quick start](/docs/quick-start/#Run microservice application) to verify the services.

## What's next

* Learn [advance microservice development](/docs/quick-start-advance/)

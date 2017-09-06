---
title: "Develop BMI Microservice Application"
lang: en
ref: quick-start-bmi
permalink: /docs/quick-start-bmi/
excerpt: "Introduce how to speedy develop a micro-service application with ServiceComb by the BMI sample"
last_modified_at: 2017-09-06T00:50:00-55:00
---

{% include toc %}
## Before you begin
Read the instructions in the [Quick start](/docs/quick-start/).

## Speedy develop microservices
The architecture of BMI have been introduced in [Quick start](/docs/quick-start/), it is composed by two separate microservices. 

- **BMI calculator service**：A microservice to calculate BMI.
- **webapp service**：A microservice to provide front-end page and gateway service.

The process of develop these two microservices whose code is on [github](https://github.com/ServiceComb/ServiceComb-Java-Chassis/tree/master/samples/bmi) is showed as following.
### Implementation of calculator
The calculator service which concludes three parts as following provides capability of calculating BMI.
* Calculating implementation
* Service endpoint definition
* Entry of service startup

#### Calculating implementation
Implement calculating according to the formula of \\(BMI=\frac{mass}{height^2}\\).

```java
public interface CalculatorService {
  double calculate(double height, double weight);
}

@Service
public class CalculatorServiceImpl implements CalculatorService {
  @Override
  public double calculate(double height, double weight) {
    double heightInMeter = height / 100;
    return weight / (heightInMeter * heightInMeter);
  }
}
```

#### Service endpoint definition
Service endpoint is defined as following to create service contact, thus to realize communication between services.       

```java
public interface CalculatorEndpoint {
  double calculate(double height, double weight);
}
```
Introduce dependence of ServiceComb:
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>spring-boot-starter-provider</artifactId>
    </dependency>
```
Expose restful endpoint of calculator service:
```java
@RestSchema(schemaId = "calculatorRestEndpoint")
@RequestMapping("/")
@Controller
public class CalculatorRestEndpoint implements CalculatorEndpoint {

  private final CalculatorService calculatorService;

  @Autowired
  public CalculatorRestEndpoint(CalculatorService calculatorService) {
    this.calculatorService = calculatorService;
  }

  @Override
  @RequestMapping(value = "/bmi", method = RequestMethod.GET)
  @ResponseBody
  public double calculate(double height, double weight) {
    return calculatorService.calculate(height, weight);
  }
}
```
Note that ServiceComb can create service contract automatically by using  `@RestSchema` to annotate endpoint. Thus we can config the endpoint in  `microservice.yaml` as following to registry the contact and service to service center.
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

#### Entry of service startup
Add annotation of `@EnableServiceComb` to enable *ServiceComb* framework:
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
The webapp service which conclude three parts as following provides capability of frond-end page and gateway service.
* Front-end page
* Gateway and routing rules
* Entry of startup service

Note that we using [Bootstrap](http://getbootstrap.com/) to develop front-end page here.

#### Gateway and routing rules
[Netflix Zuul](https://github.com/Netflix/zuul/wiki) is used to realize gateway service here.

Introduce the dependence:
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>spring-boot-starter-discovery</artifactId>
    </dependency>
```
Config routing rules and service endpoint in `application.yaml` :
```yaml
zuul:
  routes:
    calculator:
      serviceId: calculator

# disable netflix eurkea since it's not used for service discovery
ribbon:
  eureka:
    enabled: false

server:
  port: 8888
```
Add configuration of gateway and address of service center to enable service discovery in  `microservice.yaml` :
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
#### Entry of service startup
Add annotations to enable `ServiceComb` and `Zuul` :
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

Now, everything is done, reference to [quick start](/docs/quick-start/#Start Micro-service Application) to verify services.

## What's next
* Get more from [**Introduction of ServiceComb** ](/users/user-guide/)
* Lean more about how to develop microservices by [Company application](/docs/linuxcon-workshop-demo/)

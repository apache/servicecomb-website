---
title: "Develop BMI Microservice Application"
lang: en
ref: quick-start-bmi
permalink: /docs/quick-start-bmi/
excerpt: "以体质指数应用为例介绍如何基于Java Chassis快速开发微服务应用"
last_modified_at: 2017-09-04T10:01:43-04:00
---

{% include toc %}
## 前言
在您进一步阅读之前，请确保您已阅读了[快速入门指南](/cn/docs/quick-start/)，并已成功运行**体质指数**微服务。接下来将进入**体质指数**微服务应用的开发之旅。

## 快速开发微服务应用
在[快速入门指南](/cn/docs/quick-start/)中已对**体质指数**微服务的架构进行了说明，其主要由两个微服务组成：
* **体质指数计算器**：负责处理运算事务。
* **体质指数界面**：提供用户界面及网关服务。

下面将对这两个微服务的实现进行介绍，其代码已托管于[github](https://github.com/ServiceComb/ServiceComb-Java-Chassis/tree/master/samples/bmi)上。
### 体质指数计算器实现
体质指数计算器提供运算服务，其实现分为三部分：
* 具体运算实现
* 服务端点定义
* 服务启动入口

#### 具体运算实现
本模块负责计算体质指数，根据公式 \\(体质指数=\frac{体重}{身高^2}\\) 进行实现，代码如下：
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

#### 服务端点定义
服务端点用于生成服务契约，使得服务间能无缝进行通信。首先定义端点接口：
```java
public interface CalculatorEndpoint {
  double calculate(double height, double weight);
}
```
引入 **ServiceComb** 依赖：
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>spring-boot-starter-provider</artifactId>
    </dependency>
```
暴露运算服务的Restful端点：
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
这里用`@RestSchema`注释端点后， **ServiceComb** 微服务框架会自动生成对应的服务端点契约，并根据
如下的 `microservice.yaml` 文件中的定义来配置端点端口，将契约和服务一起注册到服务注册中心。
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

#### 服务启动入口
服务启动入口中只需添加 `@EnableServiceComb` 的注解即可启用 *ServiceComb* 微服务框架，代码如下：
```java
@SpringBootApplication
@EnableServiceComb
public class CalculatorApplication {
  public static void main(String[] args) {
    SpringApplication.run(CalculatorApplication.class, args);
  }
}
```

### 体质指数界面实现
本模块负责提供用户界面及网关服务。其实现主要分为三部分：
* 前端界面
* 网关及路由规则
* 服务启动入口

其中，前端界面的组件使用了[Bootstrap](http://getbootstrap.com/)来开发。

#### 网关及路由规则
网关服务主要用到了业界有名的[Netflix Zuul](https://github.com/Netflix/zuul/wiki)来实现。

引入依赖：
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>spring-boot-starter-discovery</artifactId>
    </dependency>
```
在 `application.yaml` 文件中配置路由规则及服务端口信息：
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
在 `microservice.yaml` 文件中配置网关服务的信息和服务注册中心的地址。
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
此处将服务注册中心和Zuul相结合使能服务发现。

#### 服务启动入口
服务启动入口也只需要声明启用 `ServiceComb` 和 `Zuul` 即可。
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

至此，**体质指数**应用已开发完毕，您可以通过[快速入门指南](/cn/docs/quick-start/#运行微服务应用)中的步骤对其进行验证。

## 下一步
* 认识 [**ServiceComb** 微服务开发框架](/cn/users/user-guide/)
* 通过[Company应用](/cn/docs/linuxcon-workshop-demo/)更深入地了解微服务开发

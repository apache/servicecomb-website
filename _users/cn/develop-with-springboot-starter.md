---
title: "用Spring Boot Starter开发微服务"
lang: cn
ref: develop-with-spring-boot-starter
permalink: /cn/users/develop-with-spring-boot-starter/
excerpt: "用Spring Boot Starter开发微服务"
last_modified_at: 2018-04-23T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述
### SpringBoot框架
Spring Boot是由Pivotal团队提供的全新框架，其设计目的是用来简化新Spring应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。从最根本上来讲，Spring Boot就是一些库的集合，它能够被任意项目的构建系统所使用。Boot的功能是模块化的，通过导入Boot所谓的"starter"模块，可以将许多的依赖添加到工程中。

### 在ServiceComb中集成SpringBoot
使用原生的ServiceComb框架开发微服务应用，如若需要使用ServiceComb框架提供的各项功能服务，需要在微服务项目工程pom文件中添加相应的依赖包，例如需要使用ServiceComb框架提供的负载均衡服务，需要添加handler-loadbalance包依赖。这样可以把ServiceComb提供的能力以starter的方式插入Spring Boot中，同时使用Spring Boot中提供的其他开箱即用的starter（例如SpringCloud）一起构建微服务。

## 开发示例
* **步骤 1** 添加依赖。

   在Maven的pom.xml中添加所需的依赖：
   
    ```xml
    <dependencyManagement>
        <dependencies>
          <dependency>
            <groupId>org.apache.servicecomb</groupId>
            <artifactId>java-chassis-dependencies</artifactId>
            <version>1.0.0-m1</version>
            <type>pom</type>
            <scope>import</scope>
          </dependency>
        </dependencies>
    </dependencyManagement>
    <dependencies>
        <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <!--spring-boot-starter-provider中已经包含transport-rest-vertx和transport-highway-->
        <dependency>
          <groupId>org.apache.servicecomb</groupId>
          <artifactId>spring-boot-starter-provider</artifactId>
        </dependency>
        <dependency>
          <groupId>org.hibernate</groupId>
          <artifactId>hibernate-validator</artifactId>
        </dependency>
    </dependencies>
    ```

* **步骤 2** 实现服务。

   使用Spring MVC注解开发业务代码，Hello的服务实现如下：

   ```java
   import javax.ws.rs.core.MediaType;
   import org.springframework.web.bind.annotation.RequestBody;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.bind.annotation.RequestParam;
   import org.apache.servicecomb.samples.common.schema.models.Person;
   
   @RequestMapping(path = "/springmvchello", produces = MediaType.APPLICATION_JSON)
   public class SpringmvcHelloImpl {
     @RequestMapping(path = "/sayhi", method = RequestMethod.POST)
     public String sayHi(@RequestParam(name = "name") String name) {
   　  return "Hello " + name;
     }

     @RequestMapping(path = "/sayhello", method = RequestMethod.POST)
     public String sayHello(@RequestBody Person person) {
   　  return "Hello person " + person.getName();
   　}
   }
   ```
   
   **注意：请一定在服务的实现类（本文档例子为SpringmvcHelloImpl）上标记@RequestMapping，否则接口发布的Path和Method将会不正确！**
         
   本例sayHi的访问Path为`/springmvchello/sayhi`，sayHello的访问Path为`/springmvchello/sayhello`，如果希望他们的访问路径为`/sayhi`和`/sayhello`，直接设置SpringmvcHelloImpl上的`@RequestMapping`为`@RequestMapping(path = "/")`。

* **步骤 3** 发布服务

   在服务的实现类上打上注解@RestSchema，指定schemaId，表示该实现作为当前微服务的一个schema发布，代码如下：

   ```java
   import org.apache.servicecomb.provider.rest.common.RestSchema;
   // other code omitted
   @RestSchema(schemaId = "springmvcHello")
   public class SpringmvcHelloImpl {
     // other code omitted
   }
   ```

   然后在`resources/META-INF/spring`目录下创建`springmvcHello.bean.xml`文件，命名规则为`\*.bean.xml`，配置spring进行服务扫描的base-package，文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xsi:schemaLocation="http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd
          http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd">
   
       <context:component-scan base-package="org.apache.servicecomb.samples.springmvc.provider"/>
   </beans>
   ```

> **说明**：
Spring Boot已经包含了默认的Bean扫描策略，如果能够保证Spring Boot能够找到我们的`SpringmvcHelloImpl`，那么无需定义`springmvcHello.bean.xml`。

* **步骤 4** 添加服务定义。

   在resources目录中添加[microservice.yaml](http://servicecomb.incubator.apache.org/cn/users/service-definition/)。
   
* **步骤 5** 添加Main启动类

   ```java
    import org.apache.servicecomb.springboot.starter.provider.EnableServiceComb;
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;

    @SpringBootApplication
    //EnableServiceComb注解用于在Spring Boot程序内拉起ServiceComb
    @EnableServiceComb
    public class Application {
      public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
      }
    }
   ```

## 涉及API

用Spring Boot Starter开发微服务同样使用Spring MVC开发模式，当前支持org.springframework.web.bind.annotation包下的如下注解，所有注解的使用方法参考[Spring MVC官方文档](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html)。

| 注解 | 位置 | 描述 |
| :--- | :--- | :--- |
| RequestMapping | schema/operation | 支持标注path/method/produces三种数据，operation默认继承schema上的produces |
| GetMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| PutMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| PostMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| DeleteMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| PatchMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| PathVariable | parameter | 从path中获取参数 |
| RequestParam | parameter | 从query中获取参数 |
| RequestHeader | parameter | 从header中获取参数 |
| RequestBody | parameter | 从body中获取参数，每个operation只能有一个body参数 |

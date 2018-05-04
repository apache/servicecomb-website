---
title: "Develop Microservice with Spring Boot Starter"
lang: en
ref: develop-with-spring-boot-starter
permalink: /users/develop-with-spring-boot-starter/
excerpt: "Develop Microservice with Spring Boot Starter"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description
### **Spring Boot framework**
Spring Boot is a new framework provided by the Pivotal team. It is designed to simplify the initial establishment and development of new Spring applications. The framework is configured in a specific manner so that developers do not need to define the sample configuration. Spring Boot is a collection of some databases and can be used by the construction system of any projects. The Boot function is modularized. By importing the starter module of Spring Boot, you can add many dependencies to a project.
### **Integrating Spring Boot into ServicComb**
You need to use the native Java Chassis framework to develop microservice applications. To use the functions provided by the Java Chassis framework, add dependency packages to the POM file of microservice project. For example, to use the load balancing service provided by the Java Chassis framework, add the dependency package of the handler-loadbalance package. In this way, functions provided by ServiceComb can be inserted into Spring Boot in the manner of starter, and the microservice can be built together with the starter (such as Spring Cloud) provided by Spring Boot.
## Development Example

* **Step 1** Import dependencies into your maven project:

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
       <!--spring-boot-starter-provider had included transport-rest-vertx and transport-highway-->
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

* **Step 2** Implement the services. Spring MVC is used to describe the development of service code. The implementation of the Hello service is as follow:

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
   
   **Note: PLEASE MAKE SURE TO MARK @Path ON YOUR PRODUCER(SpringmvcHelloImpl), OR THE PATH AND METHOD OF PUBLISHED WILL BE INCORRECT!**
   
   In this sample the Path of sayHi is `/springmvchello/sayhi`, and the Path of sayHello is `/springmvchello/sayhello`, if you wish them `/sayhi` and `/sayhello`, please change the setting of `@Path` on the SpringmvcHelloImpl to `@Path("/")`.

* **Step 3** Release the service. Add @RestSchema as the annotation of the service implementation class and specify schemaId, which indicates that the implementation is released as a schema of the current microservice. The code is as follows:

   ```java
   import org.apache.servicecomb.provider.rest.common.RestSchema;
   // other code omitted
   @RestSchema(schemaId = "springmvcHello")
   public class SpringmvcHelloImpl {
     // other code omitted
   }
   ```

   Create the ```springmvcHello.bean.xml```  file(the file name format is *.bean.xml) in the ``` resources/META-INF/spring``` directory and configure base-package that performs scanning. The content of the file is as follows:

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

> **NOTE**：
Spring Boot had include a default Bean discovery policy, if Spring Boot can found our `SpringmvcHelloImpl`, `springmvcHello.bean.xml` is not necessary.

* **Step 4** Add service definition file:

   Add [microservice.yaml](http://servicecomb.incubator.apache.org/cn/users/service-definition/) file into resources folder of your project.

* **Step 5** Add Main class:

   ```java
    import org.apache.servicecomb.springboot.starter.provider.EnableServiceComb;
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;

    @SpringBootApplication
    //EnableServiceComb annotation is used to init ServiceComb in Spring Boot
    @EnableServiceComb
    public class Application {
      public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
      }
    }
   ```

## Involved APIs

Spring Boot Starter also use the Spring MVC development mode, supports the following annotations in the org.springframework.web.bind.annotation package. For details about how to use the annotations, see [Spring MVC official documentation](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html)。

| Remarks        | Location         | Description                              |
| :------------- | :--------------- | :--------------------------------------- |
| RequestMapping | schema/operation | Data of path, method or produces is allowed. By default, an operation inherits produces from a schema. |
| GetMapping     | schema/operation | Data of path or produces is allowed. By default, an operation inherits produces from a schema. |
| PutMapping     | schema/operation | Data of path or produces is allowed, an operation inherits produces from a schema. |
| PostMapping    | schema/operation | Data of path or produces is allowed, an operation inherits produces from a schema. |
| DeleteMapping  | schema/operation | Data of path or produces is allowed, an operation inherits produces from a schema. |
| PatchMapping   | schema/operation | Data of path or produces is allowed, an operation inherits produces from a schema. |
| PathVariable   | parameter        | Obtain parameters from path.             |
| RequestParam   | parameter        | Obtain parameters from query.            |
| RequestHeader  | parameter        | Obtain parameters from header.           |
| RequestBody    | parameter        | Obtain parameters from body. Each operation can have only one body parameter. |

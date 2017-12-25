---
title: "Development Style-Spring MVC"
lang: en
ref: develop-with-springmvc
permalink: /users/develop-with-springmvc/
excerpt: "Development Style-Spring MVC"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description

ServiceComb supports Spring MVC remark and allows you to develop microservices in Spring MVC mode.

## Development Example

* **Step 1** Define a service API., Compile the Java API definition based on the API definition defined before development. The code is as follow:

   ```java
   public interface Hello {
     String sayHi(String name);
     String sayHello(Person person);
   }
   ```

   The location of the API must be the same as the path specified by x-java-interface in the API definition.

* **Step 2** Implement the services. Spring MVC is used to describe the development of service code. The implementation of the Hello service is as follow:

   ```java
   import javax.ws.rs.core.MediaType;
   import org.springframework.web.bind.annotation.RequestBody;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.bind.annotation.RequestParam;
   import io.servicecomb.samples.common.schema.Hello;
   import io.servicecomb.samples.common.schema.models.Person;

   @RequestMapping(path = "/springmvchello", produces = MediaType.APPLICATION_JSON)
   public class SpringmvcHelloImpl implements Hello {
     @Override
     @RequestMapping(path = "/sayhi", method = RequestMethod.POST)
     public String sayHi(@RequestParam(name = "name") String name) {
   　  return "Hello " + name;
     }

     @Override
     @RequestMapping(path = "/sayhello", method = RequestMethod.POST)
     public String sayHello(@RequestBody Person person) {
   　  return "Hello person " + person.getName();
   　}
   }
   ```

* **Step 3** Release the service. Add @RestSchema as the annotation of the service implementation class and specify schemaId, which indicates that the implementation is released as a schema of the current microservice. The code is as follows:

   ```java
   import io.servicecomb.provider.rest.common.RestSchema;
   // other code omitted
   @RestSchema(schemaId = "springmvcHello")
   public class SpringmvcHelloImpl implements Hello {
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

       <context:component-scan base-package="io.servicecomb.samples.springmvc.provider"/>
   </beans>
   ```

## Involved APIs

Currently, the Spring MVC development mode supports the following annotations in the org.springframework.web.bind.annotation package. For details about how to use the annotations, see [Spring MVC official documentation](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html)。

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

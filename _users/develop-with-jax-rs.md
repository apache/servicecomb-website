---
title: "Develop Microservice with JAX-RS"
lang: en
ref: develop-with-jax-rs
permalink: /users/develop-with-jax-rs/
excerpt: "Develop Microservice with JAX-RS"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}

## Concept Description

ServiceComb supports developers in developing services in JAX-RS mode by using JAX-RS.

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
      <!--transport can optional import through endpoint setting in microservice.yaml, we import both rest and highway as example-->
      <dependency>
        <groupId>org.apache.servicecomb</groupId>
        <artifactId>transport-rest-vertx</artifactId>
      </dependency>
      <dependency>
        <groupId>org.apache.servicecomb</groupId>
        <artifactId>transport-highway</artifactId>
      </dependency>
      <dependency>
        <groupId>org.apache.servicecomb</groupId>
        <artifactId>provider-jaxrs</artifactId>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
      </dependency>
    </dependencies>
   ```

* **Step 2** Implement the service. JAX-RS is used to describe the development of service code. The implementation of the Hello service is as follows:

   ```java
   import javax.ws.rs.POST;
   import javax.ws.rs.Path;
   import javax.ws.rs.Produces;
   import javax.ws.rs.core.MediaType;
   import org.apache.servicecomb.samples.common.schema.models.Person;

   @Path("/jaxrshello")
   @Produces(MediaType.APPLICATION_JSON)
   public class JaxrsHelloImpl {
     @Path("/sayhi")
     @POST
     public String sayHi(String name) {
     　return "Hello " + name;
     }

     @Path("/sayhello")
     @POST
     public String sayHello(Person person) {
       return "Hello person " + person.getName();
     }
   }
   ```
   
   **Note: PLEASE MAKE SURE TO MARK @Path ON YOUR PRODUCER(JaxrsHelloImpl), OR THE PATH AND METHOD OF PUBLISHED WILL BE INCORRECT!**
   
   In this sample the Path of sayHi is `/jaxrshello/sayhi`, and the Path of sayHello is `/jaxrshello/sayhello`, if you wish them `/sayhi` and `/sayhello`, please change the setting of `@Path` on the JaxrsHelloImpl to `@Path("/")`.

* **Step 3** Release the service. Add ```@RestSchema``` as the annotation of the service implementation class and specify schemaID, which indicates that the implementation is released as a schema of the current microservice. The code is as follows:

   ```java
   import org.apache.servicecomb.provider.rest.common.RestSchema;
   // other code omitted
   @RestSchema(schemaId = "jaxrsHello")
   public class JaxrsHelloImpl implements Hello {
     // other code omitted
   }
   ```

   Create the jaxrsHello.bean.xml file in the resources/META-INF/spring directory and configure base-package that performs scanning. The content of the file is as follows:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:p="http://www.springframework.org/schema/p" xmlns:util="http://www.springframework.org/schema/util"
          xmlns:cse="http://www.huawei.com/schema/paas/cse/rpc"
          xmlns:context="http://www.springframework.org/schema/context"
          xsi:schemaLocation="http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">

       <context:component-scan base-package="org.apache.servicecomb.samples.jaxrs.provider"/>
   </beans>
   ```

* **Step 4** Add service definition file:

   Add [microservice.yaml](http://servicecomb.incubator.apache.org/cn/users/service-definition/) file into resources folder of your project.

* **Step 5** Add Main class:

   ```java
   import org.apache.servicecomb.foundation.common.utils.BeanUtils;
   import org.apache.servicecomb.foundation.common.utils.Log4jUtils;

   public class Application {
     public static void main(String[] args) throws Exception {
        //initializing log, loading bean(including its parameters), and registering service, more detail can be found here :  http://servicecomb.incubator.apache.org/users/application-boot-process/
        Log4jUtils.init();
        BeanUtils.init();
     }
   }
   ```

## Involved APIs

Currently, the JAX-RS development mode supports the following annotation. For details about how to use JAX-RS, see [JAX-RS official documentation](https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html)。

| Remarks                 | Location         | Description                              |
| :---------------------- | :--------------- | :--------------------------------------- |
| javax.ws.rs.Path        | schema/operation | URL path                                 |
| javax.ws.rs.Produces    | schema/operation | Coding/decoding capability supported by the method |
| javax.ws.rs.DELETE      | operation        | http method                              |
| javax.ws.rs.GET         | operation        | http method                              |
| javax.ws.rs.POST        | operation        | http method                              |
| javax.ws.rs.PUT         | operation        | http method                              |
| javax.ws.rs.QueryParam  | parameter        | Obtain parameters from query string      |
| javax.ws.rs.PathParam   | parameter        | Obtain parameters from path, This parameter must be defined in path. |
| javax.ws.rs.HeaderParam | parameter        | Obtain parameters from header.           |
| javax.ws.rs.CookieParam | parameter        | Obtain parameters from cookie.           |

> **NOTE**：
- When the method parameter has no annotation and is not an HttpServletRequest parameter, the parameter is of the body type by default. One method supports a maximum of one body-typed parameter.
- You are advised to explicitly define the value of the parameter. Otherwise, the parameter name in the API definition is used, such as `@QueryParam\("name"\) String name` String name instead of `@QueryParam String name`.

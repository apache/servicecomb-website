---
title: "Using Zuul for Edge Service"
lang: en
ref: edging-service-zuul
permalink: /users/edging-service/zuul/
excerpt: "Using Zuul for Edge Service"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description

### API Gateway：

An API Gateway is a server and the only node through which you can access the system. API Gateway encapsulates the internal system architecture and provides APIs for clients.

### Zuul

Zuul is a JVM-based router and server load balancer of Netflix. You can use Zuul to perform the following operations:

* Certification
* Insight
* Stress test
* Canary test
* Dynamic route
* Service migration
* Offload
* Security
* Static phase response processing
* Proactive/passive traffic management

This section describes how to use Zuul as the API Gateway in the Spring Boot application. For details about Zuul, see [Router and Filter: Zuul](https://springcloud.cc/spring-cloud-dalston.html#_router_and_filter_zuul).

## Scenario

Use Zuul as the API Gateway, that is, establishes a Zuul Proxy application. In this proxy application, a unified access of all the microservices is defined, and each microservice is distinguished using a prefix (stipped). This section establishes the ZuulProxy Spring Boot application to demonstrate the API Gateway function.

## Precautions

In this section, demos, such as ZuulProxy and ZuulServer, are based on Spring Boot and the Java Chassis framework. For detals, see [Integrating Spring Boot into Java Chassis](/users/use-servicecomb-in-spring-boot/).

## Starting Zuul Proxy

This topic describes how to start a ZuulProxy application as the API Gateway. Perform the following steps:

* **Step 1** Add the following dependency to the POM file.

   ```xml
   <dependency> 
     <groupId>org.springframework.cloud</groupId>  
     <artifactId>spring-cloud-starter-zuul</artifactId> 
   </dependency>
   <dependency> 
     <groupId>org.springframework.cloud</groupId>  
     <artifactId>spring-cloud-starter-ribbon</artifactId> 
   </dependency><dependency> 
     <groupId>org.springframework.cloud</groupId>  
     <artifactId>spring-cloud-starter-hystrix</artifactId> 
   </dependency>
   <dependency> 
     <groupId>io.servicecomb</groupId>  
     <artifactId>spring-boot-starter-discovery</artifactId> 
   </dependency>
   ```

* **Step 2** Add annotations to the main Spring Boot category:

   ```java
   @SpringBootApplication
   @EnableServiceComb
   @EnableZuulProxy//new Annotation
   public class ZuulMain{
   public static void main(String[] args) throws Exception{
       SpringApplication.run(ZuulMain.class, args);
     }
   }
   ```

* **Step 3** Define a routing policy in the application.yaml file

   ```yaml
   server:
     port: 8754 #api gateway service port number
   zuul:
     routes: #Routing policy
       discoveryServer: /myServer/** #Routing rule
   ```

   The configuration item in ted indicates that the configuration can be performed based on the actual development environment. For details about the rules for defining routing policies of zuul.routers, see：[Router and Fillter: Zuul](https://springcloud.cc/spring-cloud-dalston.html#_router_and_filter_zuul) to control routes in a finer granularity.

* **Step 4** Define the microservice attributes in the microservice.yaml fiel.

   ```yaml
   APPLICATION_ID: discoverytest #Service ID
   service_description:
     name: discoveryGateway #Service Name
     version: 0.0.2 #Service Version
   cse:
     service:
       registry:
         address: http://127.0.0.1:30100  #Service Center registration
     rest:
       address: 0.0.0.0:8082 #(Optional) microservice port number
   ```

All the services used in this section use the local service center. For details, see [Starting the Local Service Center](/users/setup-environment/#运行service-center)。

* **Step 5　** Run ZuulMain Application

## Using Zuul Proxy

Before using the API Gateway provided by Zuul, start the microservice provider defined in zuul.routers.

Pay attention to the following points in the microservice.yaml file:

* APPLICATION\_ID must be the same as that defined in ZuulProxy.

* The value of service\_description.name must be the same as that of zuul.routers

An example is as follows:

```yaml
APPLICATION_ID: discoverytest #same as ZuulProxy
  service_description:
    name: discoveryServer #Service name, which corresponds to that of zuul.routers
    version: 0.0.2
cse:
  service:
    registry:
      address: http://127.0.0.1:30100 #Service Center registration
  rest:
    address: 0.0.0.0:8080
```

The portal for API Gateway is: [http://127.0.0.1:8754](http://127.0.0.1:8754). All services defined in zuul.routers can be accessed through this portal. The access rule are as follows:

http://127.0.0.1:8754/myServer/\*\*\*](http://127.0.0.1:8754/myServer/***)

This indicates that HTTP calls [http://127.0.0.1:8754/myServer/\*\*\* to switch to the discoveryServer service. For example: "/myServer/101" switches to "/101" of discoveryServer service.

> If multiple discoveryServer service (in different versions) exist in the Service Center, Zuul uses the Ribbon policy to transfer the request by default.

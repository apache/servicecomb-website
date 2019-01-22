---
title: "[Milestone] Apache ServiceComb (incubating) Release Version 1.0.0"
lang: en
ref: release-note-1-0-0
permalink: /docs/release-note-1-0-0/
excerpt: "Apache ServiceComb (incubating) enters new stage"
last_modified_at: 2018-06-14T10:26:28+08:00
author: Wang Kirin
tags: [microservice, version, release]
redirect_from:
  - /theme-setup/
---


​	Recently,  the Apache Foundation Incubation Project - Apache ServiceComb (incubating) officially released its  1.0.0 version  through community voting. The release this time includes Apache ServiceComb Java-Chassis (hereinafter referred to as Java-chassis) and Apache ServiceComb ServiceCenter (hereinafter referred to as ServiceCenter). 

​	ServiceComb has entered the Apache Foundation since December 2017, and version 1.0.0-m1 released in March 2018  , 1.0.0-m2 in  June 2018 . Now in August 2018, the milestone of release -1.0.0  was completed.

​	 At present, 10+ companies have used ServiceComb for commercial use, the ServiceComb team has already participated in 10+ Meetups to give a speech. Besides, the ServiceComb community also  held 3 Meetups. The release of version 1.0.0 this time means that the ServiceComb version has officially entered a stable state on the premise of meeting the requirements of the Apache Software Foundation. The main new features and enhancements of ServiceComb Java-chassis and Service-center after entering the Apache Foundation incubation are as follows:


## Java-chassis

- New Metrics module; Added a large number of monitoring indicators; Support Prometheus integration 
- Re-org the configuration center, support docking Ctrip Apollo as a configuration center, and easily extend the docking of other three-party configuration centers 
- The POJO programming model allows users to use CompletableFuture asynchronous programming 
- The POJO programming model allows users to use Object and Generic types as invoke parameters 
- Upgrade Zipkin to Zipkin2, and support both v1 and v2 versions of Zipkin server 
- Micro-service communication provides file stream capability and supports multimedia scenes such as music and pictures 
-  Added support for API level QPS control based on service level QPS control;
  - Now we support using `servicecomb.flowcontrol.Consumer.qps.limit.[ServiceName].[Schema].[operation]` to config the API level QPS control 
- Added  `scaffold` and [start.servicecomb.io](http://start.servicecomb.io) to allow users quickly build projects and provide complete out-of-the-box capabilities
  -  Now create a ServiceComb microservice can be quickly built by Apache Maven Archetype. For more details, please refer to [ServiceComb Java Chassis Archetypes](https://github.com/apache/incubator-servicecomb-java-chassis/blob/master/archetypes/README.md) , or you can directly access [start.servicecomb.io](http://start.servicecomb.io)  to use the  `SPRING INITIALIZR UI` intergated by ServiceComb .

- Added a demonstration of how to build a ServiceComb project using `Gradle`
    - We added the Gradle configuration to the [BMI](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/bmi) project

- Asynchronous programming model supports `AsycRestTemplate`

- Added support for the `http/2` protocol

- Implemented error injection interface that allows constructing an exception scenario by intercepting a service request. For example, setting the delay and error of a request to a specified microservice and its triggering probability

- Added service Dev running mode, support contract dynamic modification when Dev mode is enabled

- Implemented graceful downtime, anti-registration when the service is closed, ensuring that the accepted request is completed and the resources are fully released

- Extend the micro-service public-private key authentication mechanism and add the  blacklist and whitelist function

  - ServiceCenter has already support control the registration of microservices through blacklist and whitelist. However, since microservices are directly connected to each other, the microservices themselves need to have independent blacklist and whitelist authentication.

- Support Cross-Origin Resource Sharing (CORS);

    -  For example, Ajax can directly access microservices.

- Expanded the Access Log mechanism of Rest Endpoint

  - Previously users could only set the Access Log's Pattern. Now users can further customize the Access Log Item.

- The SpringMVC programming model now also supports class objects as arguments

  - Users can use class objects as parameters, for example：

  ```java
  @RequestMapping("/address")
  public String address(Address address) { ... }
  public class Address {
  	String country;
  	String city;
  }
  ```

     will be automatically converted to`/address?city={city}&country={country}`

- Microservices deployed in web containers such as Tomcat, now support access path request services in conjunction with context path and servlet pattern

  - For example,if  the calling path is`cse://service/a/b...`，can also  access via `cse://service/{context path}/{servlet pattern}/a/b...` after deployed in web containers such as Tomcat

- Automatically scan the package of the `main` function to simplify user configuration

- Provides a client ping mechanism that can detect if a client cache instance is available through ping extension. This feature is enabled by default, and the instance isolation function is used to isolate instances that fail to detect

- When the microservices are downgraded or the instance is isolated, the corresponding event will be triggered, which facilitates third-party integration (reporting)



## Service-center

- In total 3 releases has been done till date after incubation of Service-Center in Apache.
- With every release there has been a significant addition of features and improvements.(like PACT Broker, Async Rest Template, Log Rotation, ipv6 support, Backend Store extension, Schema Testing, Self Discovery from Consumer )
- With each release the stability of the Service-Center increased as more and more bugs were fixed.
- Performance has increased significantly as lot of API's were optimized related to Service Discovery.
- Optimizations were done for Restful Clients and Plugin loaders.
- Seamless integration of metrics & tracing were added in to improve the monitoring capabilities.
- Security was improved in terms of Service Discovery based on rules, default TLS Cipher Suites were added.
- Event driven mechanisms were adopted for Service-Dependency management.
- Better management of data was implemented in case of recovery management.
- Efforts were made to make the ETCD connection resilient and self healing.
- Support for Async rest template and ipv6 supports were added.
- Concrete License Management has been done to give full credits to the authors of third party dependencies used in the project.
- Support for deployement of Service-Centere in multiple infrastructures has been added.
- The Web Management Console was completely re-designed to provide better functionalities and user friendly.

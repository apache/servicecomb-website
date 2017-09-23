---
title: "Distributed Tracing"
lang: en
ref: quick-start-distributed-tracing
permalink: /docs/quick-start-advance/distributed-tracing/
excerpt: "Introduce how to use distributed tracing with ServiceComb in the BMI application"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
Distributed handler chain tracing is used to monitor the network latencies and visualize the flow of requests through microservices. This guide shows how to use distributed tracing with **ServiceComb** in the BMI application.

## Before you start

Walk through [Develop microservice application in minutes](/docs/quick-start-bmi/) and have **BMI application** running. 

## Enable

1. Add distributed tracing dependency in `pom.xml` of *BMI calculator service*:

   ```xml
       <dependency>
         <groupId>io.servicecomb</groupId>
         <artifactId>handler-tracing-zipkin</artifactId>
       </dependency>
   ```

2. Add handler chain of distributed tracing in `microservice.yaml` of *BMI calculator service*:

   ```yaml
   cse:
     handler:
       chain:
         Provider:
           default: tracing-provider
   ```

3. Add distributed tracing dependency in `pom.xml` of *BMI web service*:

   ```xml
       <dependency>
         <groupId>io.servicecomb</groupId>
         <artifactId>handler-tracing-zipkin</artifactId>
       </dependency>
       <dependency>
         <groupId>io.servicecomb</groupId>
         <artifactId>spring-cloud-zuul-zipkin</artifactId>
       </dependency>
   ```

The above configurations have already set up in the code. All you need to do is as follows:

1. Run *Zipkin* distributed service inside Docker.

   ```bash
   docker run -d -p 9411:9411 openzipkin/zipkin
   ```

2. Restart *BMI calculator service* with the following command:

   ```bash
   mvn spring-boot:run -Ptracing -Drun.jvmArguments="-Dcse.handler.chain.Provider.default=tracing-provider"
   ```
   
3. Restart *BMI web service* with the following command:

   ```bash
   mvn spring-boot:run -Ptracing
   ```

## Verification

1. Visit <a>http://localhost:8888</a> . Input a positive height and weight and then click *Submit* button.

2. Visit <a>http://localhost:9411</a> to checkout the status of distributed tracing and get the following figure.

![Distributed tracing result](/assets/images/distributed-tracing-result.png){: .align-center}

## What's next

* Learn more about [Distributed Tracing](/users/distributed-tracing/)

* Read [Distributed Tracing with ServiceComb and Zipkin](/docs/tracing-with-servicecomb/)

* See [ServiceComb User Guide](/users/)

* Learn more from [the Company application](/docs/linuxcon-workshop-demo/) for a more complete example of microservice applications integrated with ServiceComb

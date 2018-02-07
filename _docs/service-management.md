---
title: "Service Management"
lang: en
ref: quick-start-service-management
permalink: /docs/quick-start-advance/service-management/
excerpt: "Introduce how to use service management with ServiceComb in the BMI application"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
Service management is mainly used to solve or ease avalanche effect of microservices. Abnormal microservices will be isolated and stop cascading failure to reduce unnecessary resource. This guide shows how to use service management with **ServiceComb** in the BMI application.

## Before you start

Walk through [Develop microservice application in minutes](/docs/quick-start-bmi/) and have **BMI application** running. 

## Enable

1. Add service management dependency in `pom.xml` of *BMI calculator service*:

   ```xml
       <dependency>
         <groupId>org.apache.servicecomb</groupId>
         <artifactId>handler-bizkeeper</artifactId>
       </dependency>
   ```

2. Configure handler chain of service management and fallback strategy:

   ```yaml
   cse:
     handler:
       chain:
         Provider:
           default: bizkeeper-provider
     circuitBreaker:
       Provider:
         calculator:
           requestVolumeThreshold: 3
     fallbackpolicy:
       Provider:
         policy: returnnull
   ```

The above configurations have already set up in the code. All you need to do is to restart the *BMI calculator services* with the following command:

```bash
mvn spring-boot:run -Drun.jvmArguments="-Dcse.handler.chain.Provider.default=bizkeeper-provider -Dcse.circuitBreaker.Provider.calculator.requestVolumeThreshold=3 -Dcse.fallbackpolicy.Provider.policy=returnnull"
```

## Verification

1. Circuit-break microservices. Visit <a>http://localhost:8889</a>, enter a negative height or weight and click the *Submit* button three times or more continuously. Then the web page should look like the left one in fig-1.

2. Verify serivces are in circuit-break status. Enter a positive height and weight, then click *Submit* button. The web page still looks like the left one in fig-1. In the meanwhile, no exceptions show in the log of *BMI calculator service*. Instead it shows lines contain "fallback called". 

3. Verify the service back online again. Wait for about 15 seconds, enter a positive height and weight, then click *Submit* button. You will see the service works fine again like the right one in fig-1.

![Service management result](/assets/images/service-management-result.png){: .align-center}
fig-1 Service management result
{: .figure-caption}

## What's next

* See quick start for [Distributed Tracing](/docs/quick-start-advance/distributed-tracing/)

* Learn more about [Service Management](/users/service-configurations/)

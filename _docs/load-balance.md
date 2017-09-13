---
title: "Load Balance"
lang: en
ref: quick-start-load-balance
permalink: /docs/quick-start-advance/load-balance/
excerpt: "Introduce how to use load balance with ServiceComb in the BMI application"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
When we scale up *BMI calculator service*, requests from *BMI web service* need to distribute equally to each *BMI calculator service*. This guide shows how to use load balance with **ServiceComb** in the BMI application. 

## Before you start

Walk through [Develop microservice application in minutes](/docs/quick-start-bmi/) and have **BMI application** running. 

## Enable

1. Add load balance dependency in `pom.xml` of *BMI web service*:

   ```xml
   <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>handler-loadbalance</artifactId>
    </dependency>
   ```
   
2. Add handler chain of load balance in `microservice.yaml` of *BMI web service*:

   ```yaml
   cse:
     handler:
       chain:
         Consumer:
           default: loadbalance
   ```

The above configurations have already set up in the code. All you need to do is restart the **BMI web services** with the following command:

```bash
mvn spring-boot:run -Ploadbalance -Drun.jvmArguments="-Dcse.handler.chain.Provider.default=loadbalance"
```

## Verification

Run one more *BMI calculator service* with the following command: 
```bash
mvn spring-boot:run -Drun.profiles=v2 -Drun.jvmArguments="-Dcse.rest.address=0.0.0.0:7778"
```

To better visualize the result, we use another version of *BMI calculator service* which calculates half of the BMI, namely v2. Besides, a different service port is needed to avoid port conflict.

Now you can see the following figures shows up alternately by clicking the *Submit* button.

![Load balance result](/assets/images/load-balance-result.png){: .align-center}

## What's next

* See quick start for [Flow Control](/docs/quick-start-advance/flow-control/)

* Learn more about [Load Balance](/users/load-balance/)

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

The simple embedded load balancer will be used by default. No extra configurations needed.

## Verification

Run one more *BMI calculator service* with the following command: 
```bash
#spring-boot-maven-plugin 1.x
mvn spring-boot:run -Drun.jvmArguments="-Dcse.rest.address=0.0.0.0:7778"
```
or 
```bash
#spring-boot-maven-plugin 2.x
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dcse.rest.address=0.0.0.0:7778"
```

To better distinguish different running instances, we added a new interface that returns instance id in the implementation of BMI calculator, details can refer to [the implementation of BMI calculator](https://github.com/apache/servicecomb-samples/tree/1.3.0/java-chassis-samples/bmi/calculator). Besides, a different service port is needed to avoid port conflict.

Now you can see the instance id in the following figures shows up alternately by clicking the *Submit* button.

![Load balance result](/assets/images/load-balance-result.png){: .align-center}

## What's next

* See quick start for [Flow Control](/docs/quick-start-advance/flow-control/)

* Learn more about [Load Balance](/users/service-configurations/#负载均衡策略)

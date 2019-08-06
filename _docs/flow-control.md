---
title: "Flow Control"
lang: en
ref: quick-start-flow-control
permalink: /docs/quick-start-advance/flow-control/
excerpt: "Introduce how to use flow control with ServiceComb in the BMI application"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
Flow control mechanism controls the transmission speed to avoid microservices being overloaded. This guide shows how to use flow control with **ServiceComb** in the BMI application. 

## Before you start

Walk through [Develop microservice application in minutes](/docs/quick-start-bmi/) and have **BMI application** running. 

## Enable

1. Add flow control dependency in `pom.xml` of *BMI calculator service*:

   ```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>handler-flowcontrol-qps</artifactId>
    </dependency>
   ```

2. Add handler chain and configurations of flow control in `microservice.yaml` of *BMI calculator service*:

   ```yaml
   servicecomb:
     handler:
       chain:
         Provider:
           default: qps-flowcontrol-provider
     flowcontrol:
       Provider:
         qps:
           limit:
             gateway: 1
   ```

The above configurations have already set up in the code. All you need to do is to stop all **BMI calculator services** and then start a new one with the following command:

```bash
#spring-boot-maven-plugin 1.x
mvn spring-boot:run -Drun.jvmArguments="-Dcse.handler.chain.Provider.default=qps-flowcontrol-provider -Dcse.flowcontrol.Provider.qps.limit.gateway=1"
```
or
```bash
#spring-boot-maven-plugin 2.x
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dcse.handler.chain.Provider.default=qps-flowcontrol-provider -Dcse.flowcontrol.Provider.qps.limit.gateway=1"
```

## Verification

Visit <a>http://localhost:8889</a>. Input a positive height and weight and then click *Submit* button twice or more in less than one second. You will see the web page change from the left one to the right one.

![Flow control result](/assets/images/flow-control-result.png){: .align-center}

## What's next

* See quick start for [Service Management](/docs/quick-start-advance/service-management/)

* Learn more about [Flow Control](/users/service-configurations/#限流策略)

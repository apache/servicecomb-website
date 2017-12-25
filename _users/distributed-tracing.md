---
title: "Distributed Tracing"
lang: en
ref: distributed-tracing
permalink: /users/distributed-tracing/
excerpt: "Distributed Tracing"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description

The microservice architecture addresses many problems of single applications but has several drawbacks, for example, network instability may lead to latency.

In a single application, all the modules are running in the same process without interworking. However, in the microservice architecture, services are communicated through network, and we have to address network problems, such as latency, timeout, and segmentation.

As services expand, we can hardly monitor how data is transferred in the complex service architecture. How do we efficiently monitor network latency and visualize the data flows of services?

The distributed tracing system efficiently monitor network latency of the microservice and visualize data flow during the service.

## Zipkin

> [Zipkin](http://zipkin.io/) is a distributed tracing system. It helps gather timing data needed to troubleshoot latency problems in microservice architectures. It manages both the collection and lookup of this data. Zipkin's design is based on Google [Dapper paper](http://research.google.com/pubs/pub36356.html)。

ServiceComb integrates the automatic call tracing function provided by Zipkin, so that users can focus on service demands.

## Procedure

### Add dependency

For microservice based on ServiceComb Java Chassis, add the following content to pom.xml

```xml
<dependency>   
    <groupId>io.servicecomb</groupId>
    <artifactId>handler-tracing-zipkin</artifactId>
</dependency>
```

If the microservice is based on the API of Spring Cloud Zuul, such as the manager service of the workshop demo, add the following dependency:

```xml
<dependency>    
    <groupId>io.servicecomb</groupId>
    <artifactId>spring-cloud-zuul-zipkin</artifactId>
</dependency>
```

### Configure tracing and data collection

Set addresses for the tracing processor and data collection in the microservice.yaml file.

```yaml
cse: 
  handler: 
    chain: 
      Consumer: 
        default: tracing-consumer
      Provider: 
        default: tracing-provider
servicecomb: 
  tracing: 
    collector: 
      address: http://zipkin.servicecomb.io:9411
```

In this way, we enable the Zipkin-and-Java-based chassis distributed tracing system without changing any code.

**NOTE:** If other dependencies introduce the Zipkin system, such as Spring Cloud, running errors may occur due to version inconsistency. In this case, you need to specify the Zipkin version in the pom project.
{: .notice--warning}

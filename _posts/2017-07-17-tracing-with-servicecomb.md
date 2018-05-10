---
title: "Distributed Tracing with ServiceComb and Zipkin"
lang: en
ref: tracing-with-servicecomb
permalink: /docs/tracing-with-servicecomb/
excerpt: "A introduction of how to set up distributed tracing with ServiceComb and Zipkin"
last_modified_at: 2017-07-17T09:18:43+08:00
author: Sean Yin
tags: [distributed tracing, zipkin]
redirect_from:
  - /theme-setup/
---

Microservice architecture solves many problems of monolithic applications, but it also comes with costs. Request latencies
due to network instability is one of the prices we have to pay.

In monolithic applications, modules are all running in one process and there\'s no such thing as communication issues among 
modules. However, with microservice architecture, services are communicating through a network and we have to deal with all 
network related issues, such as delays, timeouts, and partition. 

In addition, given more and more services deployed, we can easily lose the sight on how requests flow through
the web of microservices in our applications. How can we monitor the network latencies and flow of requests through our system?

## Zipkin
> [Zipkin](http://zipkin.io/) is a distributed tracing system. It helps gather timing data needed to troubleshoot latency 
problems in microservice architectures. It manages both the collection and lookup of this data. Zipkin’s design is based 
on the Google [Dapper paper](http://research.google.com/pubs/pub36356.html).[1]

ServiceComb integrates with Zipkin to provide automatic tracing, so that users can focus on fulfilling their business requirements. 

## Instructions
We will use the [workshop demo](https://github.com/ServiceComb/LinuxCon-Beijing-WorkShop) as an example to illustrate how
to apply distributed tracing with Zipkin.

### Adding Dependencies
A microservice written with ServiceComb Java Chassis just need to add one dependency below to its pom.xml.
```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>handler-tracing-zipkin</artifactId>
    </dependency>

```

If the microservice is an API gateway with Spring Cloud + Zuul like manager service in the workshop demo, an additional 
dependency has to be included.
```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>spring-cloud-zuul-zipkin</artifactId>
    </dependency>
```

### Configuring Tracing Handlers And Collector
In the configuration file `microservice.yaml` , apply tracing handlers and add tracing collector address. 
```yaml
servicecomb:
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

That\'s all! After two configuration additions and no change to a single line of code, distributed tracing with Zipkin is 
enabled for microservices written with Java chassis.

**Note** If other dependencies in your project also include zipkin (e.g. Spring Cloud), it may cause runtime error due to
conflict of incompatible zipkin versions. In such a case, you may need to explicitly declare the compatible zipkin version
in your pom.

## A Quick Demo
After enabled tracing in the workshop demo, we are able to showcase the tracing capability locally with docker.
1. Build all docker images of services in the workshop demo with command `mvn package -DskipTests -Pdocker` or `mvn package -DskipTests -Pdocker -Pdocker-machine`
if you are using [Docker Toolbox](https://www.docker.com/products/docker-toolbox)

2. Run `docker-compose up` under workshop demo folder

3. Send requests to the demo application like what we did in the video below

4. Open Zipkin website in a browser, which is hosted in a docker container started at step 2, eg. http://docker.container.ip:9411

{% include video id="XMjg1NzQ3NzUzNg" provider="youku" %}

Now we should be able to see Zipkin homepage with a few traced services.
![zipkin homepage]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.1.png){: .align-center}

If we choose manager and click Find Traces button, some traces will be displayed. Please don\'t mind the system performance
being not very good, since we are running so many services in docker on a laptop manufactured in 2012.
![traces of manager service]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.2.png){: .align-center}

We are also able to see the spans of an individual trace by clicking on it.
![trace spans of manager service]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.3.png){: .align-center}

A more detailed timing information will be displayed if we click on any span in the trace.
![span details of manager service]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.4.png){: .align-center}

Dependency graph of services can be helpful to gain insight on request flow, if we click on the Dependencies menu.
![service dependencies]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.5.png){: .align-center}

## Summary
As we can see, adding distributed tracing capability to microservices using ServiceComb is as easy as following 2 simple 
steps as shown in the instruction section above. Doing so, we leverage the powerful features provided by Zipkin, such as
analyzing timing data to troubleshoot network latencies among our microservices and gaining insight on our service dependencies.

## References
* [1] [Zipkin](http://zipkin.io/)

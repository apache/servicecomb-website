---
title: "Quick Start"
lang: en
ref: quick-start
permalink: /docs/quick-start/
excerpt: "Introduce how to speedy start micro-service application on ServiceComb"
last_modified_at: 2017-09-06T00:50:43-55:00
---

{% include toc %}
## Install java development environment
* Install JDK 1.8+, Reference to [JDK Installing Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) to get details.
* Install Maven 3.x, Reference to [Maven Installing Guide](https://maven.apache.org/install.html) to get details.

## Start Service Center
Service Center which provides capability of service registry and discovery in ServiceComb can be started within docker container directly.

```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```

## Create first micro-service application
The sample named BMI(Body Mass Index) deploys a simple application which will be used to demonstrate how to speedy start a micro-service application with ServiceComb. The [BMI](https://en.wikipedia.org/wiki/Body_mass_index) application conclude two separate microservices:

* **BMI calculator service**：A microservice to calculate BMI.
* **webapp service**：A microservice to provide front-end page and gateway service.

The end-to-end architecture of the application is showed as following:  
![E2E architecture](/assets/images/quick-start-sample-workflow.png){: .align-center}

Note that the dotted lines indicate the process of service registry and discovery.

## Start micro-service application
1.  Get codes of BMI.
```bash
git clone https://github.com/ServiceComb/ServiceComb-Java-Chassis.git
cd ServiceComb-Java-Chassis/samples/bmi
```
2.  Start microservices.
```bash
cd calculator; mvn spring-boot:run
cd webapp; mvn spring-boot:run
```
3.  Verify the application.

    Visit <a>http://localhost:8888</a> in browser, get web page as following, then input your information of Height and weight to get your BMI.

![website of BMI](/assets/images/bmi-interface.png){: .align-center}



## What's next

Start speedy coding with ServiceComb by [Develop BMI](/docs/quick-start-bmi/).

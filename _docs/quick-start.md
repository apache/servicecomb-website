---
title: "Quick Start"
lang: en
ref: quick-start
permalink: /docs/quick-start/
excerpt: "Introduce how to run microservice applications using ServiceComb"
last_modified_at: 2017-09-06T00:50:43-55:00
---

{% include toc %}
## Install Java development environment
* Install JDK 1.8+, details can refer to [JDK Installing Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html).
* Install Maven 3.x, details can refer to [Maven Installing Guide](https://maven.apache.org/install.html).
* Install ServiceComb Java Chassis(SDK) by executing the following commands.
```bash
git clone https://github.com/ServiceComb/ServiceComb-Java-Chassis.git
cd ServiceComb-Java-Chassis
mvn clean install -DskipTests -DskipITs
```

## Run Service Center
**Service Center** enables capabilities of service registration and service discovery in **ServiceComb**. It can run inside docker.
```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```

## Create your first microservice application
Let\'s start the journey of microservice with a simple **Body Mass Index(BMI)** application. The [BMI](https://en.wikipedia.org/wiki/Body_mass_index){:target="_blank"} is an attempt to quantify the amount of tissue mass in an individual. This application contains two separate microservices:

* **BMI calculator service**：A microservice provides calculation of BMI.
* **Web service**：A microservice provides both user interface and gateway service.

The workflow of the application is shown as follows:  
![workflow of BMI](/assets/images/quick-start-sample-workflow-en.png){: .align-center}

Note that the dotted lines indicate the process of service registration and discovery.

## Run microservice application
1. Enter BMI codes directory.
```bash
cd samples/bmi
```
2. Run microservices.
```bash
cd calculator; mvn spring-boot:run
cd webapp; mvn spring-boot:run
```
3. Verify the application. Visit <a>http://localhost:8888</a> in browser. Then input your height and weight to verify.
![BMI user interface](/assets/images/bmi-interface.png){: .align-center}

## What's next
Learn how to [develop microservice application in minutes](/docs/quick-start-bmi/).

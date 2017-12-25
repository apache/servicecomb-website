---
title: "Java Chassis Architecture"
lang: en
ref: servicecomb-introduction
permalink: /users/
excerpt: "Java Chassis Architecture"
last_modified_at: 2017-06-14T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Basic Framework
![ServiceComb Model](/assets/images/servicecomb_mode_en.png){: .align-center}

## Purpose

1.To decouple the programming and communication models, so that a programming model can be combined with any communication models as needed. Application developers only need to focus on APIs during development and can flexibly switch communication models during deployment. Services can also be switched over to a legacy system. The developers simply need to modify the configuration file(or annotation) released by the service.

Currently, applications can be developed in Spring MVC, JAX-RS, or transparent RPC mode.

2.To introduce the code-first approach. This allows cross-language communication through API definition-based microservice development and supports the development of software tool chains(such as code generated based on API definitions and API definitions generated based on code) to build a complete development ecosystem.

3.To define common microservice running model, encapsulating fault tolerance methods of microservices used from discovery to interaction, The running model can be customized or extended.

## Modules

| Type                   | artifact id            | Available or NOT | Function                                 |
| :--------------------- | :--------------------- | :--------------- | :--------------------------------------- |
| Programming model      | provider-pojo          | Yes              | Provides the RPC development mode.       |
| Programming model      | provider-jaxrs         | Yes              | Provides the JAX-RS development mode.    |
| Programming model      | provider-springmvc     | Yes              | Provides the Spring MVC development mode. |
| Communication on model | transport-rest-vertx   | Yes              | A development framework running over HTTP, it does not depend on Web containers. Applications are packaged as executable .jar files. |
| Communication on model | transport-rest-servlet | Yes              | A development framework running on Web container. Applications are packaged as WAR files. |
| Communication on model | transport-highway      | Yes              | Provides high-performance private communication protocols for Java communication. |
| Running model          | handler-loadbalance    | Yes              | A load balancing module that provides various routing policies and configurations. It is usually used for clients. |
| Running model          | handler-bizkeeper      | Yes              | Provides service governance functions, such as isolation, fallbreak, and fault tolerance. |
| Running model          | handler-tracing        | Yes              | Provides the capability of developing and managing TCC transactions. |

---
title: "Java Chassis Architecture"
lang: en
ref: servicecomb-introduction
permalink: /docs/users/
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

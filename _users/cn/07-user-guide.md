---
title: "用户手册"
lang: cn
ref: user-guide
permalink: /cn/users/user-guide/
excerpt: "用户手册."
last_modified_at: 2017-06-14T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 框架概述
![ServiceComb Model](/assets/images/servicecomb-models.png){: .align-center}

微服务开发框架包括编程模型、运行模型、通信模型和服务契约。编程模型支持透明RPC（POJO）、Spring MVC和JAX-RS三种编程模型。运行模型包括服务发现、熔断、负载均衡、配置及跟踪。通信模型支持序列化传输，包括Rest和Highway两个通道。通过服务契约的定义实现编程模型、运行模型、通信模型的灵活组合。如图1所示。

微服务开发框架具有如下特点。

- 编程模型和通信模型分离，不同的编程模型可以灵活组合不同的通信模型。应用开发者在开发阶段只关注接口开发，部署阶段灵活切换通信方式；支持legacy系统的切换，legacy系统只需要修改服务发布的配置文件（或者annotation），而不需要修改代码。
- 通过定义契约实现模块分离，实现跨语言的通信，并支持配套的软件工具链（契约生成代码、代码生成契约等）开发，构建完整的开发生态。


## SDK组件组成

Java Chassis微服务开发框架组件组成如表所示:

|类型|Artifact ID|是否可选|功能说明|
|:--------:|:--------------:|:------:|:--------------------:|
|编程模型|provider-pojo|是| 提供RPC开发模式。|
|编程模型|provider-jaxrs|是| 提供JAX RS开发模式。|
|编程模型|provider-springmvc|是| 提供Spring MVC开发模式。|
|通信模型|transport-rest-vertx|是| 运行于HTTP之上的开发框架，不依赖WEB容器，应用打包为可执行jar。|
|通信模型|ransport-rest-servlet|是| 运行于WEB容器的开发框架，应用打包为war包。|
|通信模型|transport-highway|是| 提供高性能的私有通信协议，仅用于java之间互通。|
|运行模型|handler-loadbalance|是| 负载均衡模块。提供各种路由策略和配置方法。一般客户端使用。|
|运行模型|handler-bizkeeper|是| 服务治理相关的功能，比如隔离、熔断、容错。|
|运行模型|handler-tracing|是| 调用链跟踪模块，对接监控系统，吐出打点数据。|

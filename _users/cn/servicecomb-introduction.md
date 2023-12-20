---
title: "Java Chassis系统架构"
lang: cn
ref: servicecomb-introduction
permalink: /cn/docs/users/
excerpt: "Java Chassis系统架构"
last_modified_at: 2017-06-14T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 框架概述
![ServiceComb Model](/assets/images/servicecomb-models.png){: .align-center}

## 主要设计意图

1.编程模型和通信模型分离，不同的编程模型可以灵活组合不同的通信模型。应用开发者在开发阶段只关注接口开发，部署阶段灵活切换通信方式；支持legacy系统的切换，legacy系统只需要修改服务发布的配置文件（或者annotation），而不需要修改代码。

现阶段支持SpringMVC、JAX-RS和透明RPC三种开发方式。

2.内建API-first支持。通过契约规范化微服务开发，实现跨语言的通信，并支持配套的软件工具链（契约生成代码、代码生成契约等）开发，构建完整的开发生态。

3.定义了常用的微服务运行模型，将微服务从发现到交互过程中的各种容错手段都封装起来。该运行模型支持自定义和扩展。

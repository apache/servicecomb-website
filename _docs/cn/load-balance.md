---
title: "负载均衡"
lang: cn
ref: quick-start-load-balance
permalink: /cn/docs/quick-start-advance/load-balance/
excerpt: "介绍如何在体质指数应用中使用ServiceComb框架提供的负载均衡能力"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
当对体质指数计算器进行水平扩展时，需要将请求均衡地分发到多个体质指数计算器上。本指南将展示如何在 *体质指数* 应用中使用 **ServiceComb** 提供的负载均衡能力。

## 前言

在您进一步阅读之前，请确保您已阅读了[微服务应用快速开发指南](/cn/docs/quick-start-bmi/)，并已成功运行体质指数微服务。

## 开启

1. 在 *体质指数界面* 的 `pom.xml` 文件中添加依赖项：

   ```xml
   <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>handler-loadbalance</artifactId>
    </dependency>
   ```

体质指数应用中已配置好了上述配置项，您只需通过以下指令重启体质指数界面微服务即可：

```bash
mvn spring-boot:run -Ploadbalance 
```

## 验证

对 *体质指数计算器* 微服务进行水平扩展，使其运行实例数为2，即新增一个运行实例：

```bash
mvn spring-boot:run -Drun.profiles=v2 -Drun.jvmArguments="-Dcse.rest.address=0.0.0.0:7778"
```

为了使效果更明显，在此使用了v2版本的 *体质指数计算器* ，即仅计算体质指数的一半。而为了避免端口冲突，新的实例在另一个端口上运行。

此时点击 *Submit* 按钮就可以看到如下两个界面交替出现。

![负载均衡效果](/assets/images/load-balance-result.png){: .align-center}

## 下一步

* 阅读[流量控制快速入门](/cn/docs/quick-start-advance/flow-control/)

* 了解更多[负载均衡](/cn/users/service-configurations/#负载均衡策略)的使用方式

---
title: "分布式调用链追踪"
lang: cn
ref: quick-start-distributed-tracing
permalink: /cn/docs/quick-start-advance/distributed-tracing/
excerpt: "介绍如何在体质指数应用中使用ServiceComb提供的分布式追踪能力"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
分布式调用链追踪用于有效地监控微服务的网络延时并可视化微服务中的数据流转。本指南将展示如何在 *体质指数* 应用中使用 **ServiceComb** 提供的分布式调用链追踪能力。

## 前言

在您进一步阅读之前，请确保您已阅读了[微服务应用快速开发指南](/cn/docs/quick-start-bmi/)，并已成功运行体质指数微服务。

## 启用

1. 在 *体质指数计算器* 的 `pom.xml` 文件中添加依赖项：

   ```xml
       <dependency>
         <groupId>io.servicecomb</groupId>
         <artifactId>handler-tracing-zipkin</artifactId>
       </dependency>
   ```

2. 在 *体质指数计算器* 的 `microservice.yaml` 文件中添加分布式追踪的处理链：

   ```yaml
   cse:
     handler:
       chain:
         Provider:
           default: tracing-provider
   ```

3. 在 *体质指数界面* 的 `pom.xml` 文件中添加依赖项：

   ```xml
       <dependency>
         <groupId>io.servicecomb</groupId>
         <artifactId>spring-cloud-zuul-zipkin</artifactId>
       </dependency>
   ```

体质指数应用中已配置好了上述配置项，您只需执行以下几步即可：

1. 使用 Docker 运行 *Zipkin* 分布式追踪服务：

   ```bash
   docker run -d -p 9411:9411 openzipkin/zipkin
   ```

2. 重启 *体质指数计算器* 微服务：

   ```bash
   mvn spring-boot:run -Drun.jvmArguments="-Dcse.handler.chain.Provider.default=tracing-provider"
   ```
   
3. 重启 *体质指数界面* 微服务：

   ```bash
   mvn spring-boot:run -Drun.jvmArguments="-Dservicecomb.tracing.enabled=true"
   ```

## 验证

1. 访问 <a>http://localhost:8888</a> ，在身高和体重栏处输入正数，并点击 *Submit* 按钮。

2. 访问 <a>http://localhost:9411</a> ，查看分布式调用追踪情况，可得下方界面。

![分布式追踪效果](/assets/images/distributed-tracing-result.png){: .align-center}

## 下一步

* 了解更多[分布式调用链追踪](/cn/users/distributed-tracing/)

* 阅读[基于 ServiceComb 和 Zipkin 的分布式调用链追踪](/cn/docs/tracing-with-servicecomb/)来进一步了解分布式追踪 

* 认识 [**ServiceComb** 微服务开发框架](/cn/users/)

* 通过 [Company应用](/cn/docs/linuxcon-workshop-demo/) 更深入地了解微服务开发

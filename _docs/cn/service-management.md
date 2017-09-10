---
title: "服务治理"
lang: cn
ref: quick-start-service-management
permalink: /cn/docs/quick-start-advance/service-management/
excerpt: "介绍如何在体质指数应用中使用ServiceComb提供的服务治理能力"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
服务治理主要用于解决或缓解服务雪崩的情况，即个别微服务表现异常时，系统能对其进行容错处理，从而避免资源的耗尽。本指南将会展示如何在 *体质指数* 应用中使用 **ServiceComb** 提供的服务治理能力。

## 前言

在您进一步阅读之前，请确保您已阅读了[微服务应用快速开发指南](/cn/docs/quick-start-bmi/)，并已成功运行体质指数微服务。

## 启用

1. 在 *体质指数计算器* 的 `pom.xml` 文件中添加依赖项：

   ```xml
       <dependency>
         <groupId>io.servicecomb</groupId>
         <artifactId>handler-bizkeeper</artifactId>
       </dependency>
   ```

2. 在 *体质指数计算器* 的 `microservice.yaml` 文件中指明使用服务治理的处理链及指定熔断和容错策略：

   ```yaml
     handler:
       chain:
         Provider:
           default: bizkeeper-provider
     circuitBreaker:
       Provider:
         calculator:
           requestVolumeThreshold: 3        
     fallbackpolicy:
       Provider:
         policy: returnnull
   ```

修改后需要先关闭之前运行的 *体质指数计算器* 微服务，并再次启动一个 *体质指数计算器* 微服务。

## 验证

1. 使服务进入熔断状态。访问 <a>http://localhost:8888</a>，在身高或体重的输入框中输入一个负数，连续点击三次或以上 *Submit* 按钮，此时在网页下方能看到类似左图的界面。
2. 验证服务处于熔断状态。在身高和体重的输入框中输入正数，再次点击 *Submit* 按钮，此时看到的界面依然是类似左图的界面。同时在 *体质指数计算器* 运行日志也能看到调用不再抛出异常，而是出现类似 `fallback called` 的日志。
3. 验证服务恢复正常。约15秒后，在身高和体重的输入框中输入正数，点击 *Submit* 按钮，此时界面显示正常。


![服务治理效果](/assets/images/service-management-result.png){: .align-center}

## 下一步

* 阅读[分布式追踪快速入门指南](/cn/docs/quick-start-advance/distributed-tracing/)
* 了解更多[服务治理](/cn/users/service-management/)的使用方式

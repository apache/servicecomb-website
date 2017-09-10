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

在 *体质指数界面* 的 `microservice.yaml` 文件中添加以下内容即可开启负载均衡的能力：

```yaml
  handler:
    chain:
      Consumer:
        default: loadbalance
```

修改后需要重启体质指数界面微服务。

## 验证

对 *体质指数计算器* 微服务进行水平扩展，使其运行实例数为2，即新增一个运行实例。在体质指数计算器的源代码作出如下修改：

1. 修改服务运行端口，避免端口冲突

   修改 `microservice.yaml` 文件，将 `cse.rest.address` 由原来的 `0.0.0.0:7777` 修改为 `0.0.0.0:7778` 。

2. 修改 `CalculatorServiceImpl.java` 文件，使体质指数计算结果减半（方便观察效果）

   在 `calculate` 方法中，将返回的体质指数值减半：

   ```java
       double bmi = weight / (heightInMeter * heightInMeter) / 2;
   ```

启动服务，此时点击 *Submit* 按钮就可以看到如下两个界面交替出现。

![负载均衡效果](/assets/images/load-balance-result.png){: .align-center}

## 下一步

* 阅读[服务治理快速入门](/cn/docs/quick-start-advance/service-management/)
* 了解更多[负载均衡](/cn/users/load-balance/)的使用方式

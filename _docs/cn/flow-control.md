---
title: "流量控制"
lang: cn
ref: quick-start-flow-control
permalink: /cn/docs/quick-start-advance/flow-control/
excerpt: "介绍如何在体质指数应用中使用ServiceComb框架提供的流量控制能力"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
流量控制机制通过控制数据传输速率来避免微服务过载运行。本指南将展示如何在 *体质指数* 应用中使用 **ServiceComb** 提供的流量控制能力。

## 前言

在您进一步阅读之前，请确保您已阅读了[微服务应用快速开发指南](/cn/docs/quick-start-bmi/)，并已成功运行体质指数微服务。

## 开启

1. 在 *体质指数计算器* 的 `pom.xml` 文件中添加依赖项：

   ```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>handler-flowcontrol-qps</artifactId>
    </dependency>
   ```

2. 在 *体质指数计算器* 的 `microservice.yaml` 文件中指明使用流量控制的处理链及指定流控策略：

   ```yaml
   servicecomb:
     handler:
       chain:
         Provider:
           default: qps-flowcontrol-provider
     flowcontrol:
       Provider:
         qps:
           limit:
             gateway: 1
   ```

体质指数应用中已配置好了上述配置项，您只需关闭之前运行的 **体质指数计算器**，然后再用以下指令重新运行即可：

```bash
mvn spring-boot:run -Drun.jvmArguments="-Dcse.handler.chain.Provider.default=qps-flowcontrol-provider -Dcse.flowcontrol.Provider.qps.limit.gateway=1"
```

## 验证 

访问 <a>http://localhost:8889</a>，在身高和体重的输入框中输入正数，尝试在1秒内多次点击 *Submit* 按钮，此时就能看到网页由左侧的正常的界面变成了右侧提示由于流控受限而请求被拒的界面。

![流量控制效果图](/assets/images/flow-control-result.png){: .align-center}

## 下一步

* 阅读[服务治理快速入门](/cn/docs/quick-start-advance/service-management/)

* 了解更多[流量控制](/cn/users/service-configurations/#限流策略)的使用方式

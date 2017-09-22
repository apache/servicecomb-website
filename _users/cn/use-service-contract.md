---
title: "使用服务契约"
lang: cn
ref: use-service-contract
permalink: /cn/users/use-service-contract/
excerpt: "使用服务契约"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 场景描述

当服务消费者调用服务提供者的服务时，需要注册服务契约。消费者有两种方式获取提供者的服务契约，一种是从服务的提供方离线获取契约文件，手工配置到项目中；另一种是从服务中心自动下载契约。

## 配置说明

> 说明：服务契约的获取方式与服务消费者的开发方式是无关的，用户可以任意组合使用。

### 配置依赖服务

服务消费者需要在microservice.yaml文件中配置依赖的provider，示例配置如下：

```yaml
cse:
  # other configurations omitted
  references:
    springmvc:
      version-rule: 0.0.1
```

### 手工配置服务契约

服务消费者的开发者在线下拿到服务提供者的契约，配置到消费者工程的特定目录下。服务契约在项目中的存放目录与[服务契约](/cn/users/service-contract/)的配置说明部分相同。

microservice目录下的每一个目录代表一个微服务，微服务目录下的每一个yaml文件代表一个schema契约，文件名就是schemaId。applications目录下存放需要指明appId的服务契约，用于跨app调用等场景。目录结构如下所示：
```txt
resources
  - microservices
      - serviceName            # 微服务名
          - schemaId.yaml      # schema接口的契约
  - applications
      - appId                  # 应用ID
          - serviceName        # 微服务名
              - schemaId.yaml  # schema接口的契约
```

### 从服务中心自动下载契约

服务消费者也可以不用显式地将契约存放在项目目录中，当程序启动时，ServiceComb框架会自动根据microservice.yaml文件中配置的服务提供者的微服务名称和版本号，从服务中心自动下载契约信息。

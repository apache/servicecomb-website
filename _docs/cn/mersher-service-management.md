---
title: 服务治理
lang: cn
ref: mesher-service-management
permalink: /cn/docs/mesher-quick-start-advance/mesher-service-management/
excerpt: 介绍如何在体质指数应用中使用ServiceComb提供的服务治理能力
last_modified_at: 2019-08-08T14:01:43.000Z
---

- 服务治理主要用于对分布式系统中大量微服务进行有效控制管理。本指南将会展示如何使用 **mesher** 提供的服务治理能力。

# 前言

- 在您进一步阅读之前，请确保您已阅读了[mesher快速入门](/cn/docs/mesher-quick-start/)和[mesher负载均衡](/cn/docs/quick-start-advance/load-balance/)，并已成功运行mesher用例服务。

# 灰度发布

## 配置

- 1、更新版本号： 分别更改两个**mesher_calculator**实例的配置文件**microservice.yaml**，更新**version**字段分别为**1.1.1**和**1.1.2**，重启mesher服务，可以看到服务版本号发生了变更。如图中所示：

  ![灰度发布版本图](/assets/images/mesher/mesher-ser-manage-ver.png)

- 2、配置路由信息，更改mesher_webapp的配置文件router.yaml，按实例版本更新权重信息，并重启服务：

  ```yaml
  routeRule:
    calculator:        #service name
      - precedence: 2    #precedence of route rule
        route:           #route rule list
        - tags:
            version: 1.1.1
          weight: 70     #weight of 20%
        - tags:
            version: 1.1.2
          weight: 30     #weight of 20%
  ```

## 验证

- 此时大量点击 _Submit_ 按钮就可以看到BMI Instance ID按配置的比例交替出现。

# 服务熔断及恢复

## 配置

- 1、 更改断流器配置，更改mesher_webapp的配置文件chassis.yaml，设置其中的断流器配置为：

  ```yaml
  isolation:
    Consumer:
      timeout:
        enabled: true
      timeoutInMilliseconds: 1000            #超时时间
      maxConcurrentRequests: 1
  circuitBreaker:
    Consumer:
      enabled: true
      forceOpen: false
      forceClosed: false
      sleepWindowInMilliseconds: 10000    #熔断恢复时间10秒
      requestVolumeThreshold: 1          #请求量限制
      errorThresholdPercentage: 1
  fallback:
    Consumer:
      enabled: true
      maxConcurrentRequests: 1
  fallbackpolicy:
    Consumer:
      policy: returnnull
  ```

- 2、 关闭test_balance目录下的服务实例；

## 验证

- 1、传入负数参数，响应超时，mesher_webapp断流器生效，下图一是mesher_webapp日志截图，表明断流器启用，下图二是传入负数参数触发断流器时的返回值，下图三表示断流器生效后对所有请求都按配置返回nil；

  ![断流器生效日志图](/assets/images/mesher/mesher-circuitbreaker.png)

  ![断流器生效日志图](/assets/images/mesher/mesher-circuitbreaker-ret.png)

  ![断流器生效日志图](/assets/images/mesher/mesher-circuitbreaker-ret-nil.png)

- 2、根据配置参数sleepWindowInMilliseconds，过10秒后服务自动恢复

# 下一步

- 阅读[分布式追踪快速入门指南](/cn/docs/mesher-quick-start-advance/mesher-distributed-tracing/)

- 了解更多[服务治理](/cn/users/service-configurations/)的使用方式

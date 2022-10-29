---
title: "服务配置"
lang: cn
ref: service-configurations
permalink: /cn/docs/users/service-configurations/
excerpt: "服务配置"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}

## 限流策略
### 场景描述

用户在provider端使用限流策略，可以限制指定微服务向其发送请求的频率，达到限制每秒钟最大请求数量的效果。

### 注意事项

1. 限流策略的控制并不是绝对精确的，可能会有少量误差。
2. provider端的流量控制是业务层面的功能，不是安全意义上的流量控制，如需防止DDoS攻击，需要结合其他的一系列措施。
3. 流量控制是微服务级的，不是进程级的。

### 配置说明

　　限流策略配置在microservice.yaml文件中，相关配置项见表2。要开启服务提供者端的限流策略，还需要在处理链中配置服务端限流handler，并添加pom依赖。

　　microservice.yaml配置示例如下：

```yaml
servicecomb:
  handler:
    chain:
      Provider:
        default: qps-flowcontrol-provider
```

　　添加handler-flowcontrol-qps的pom依赖：

```xml
<dependency>
    <groupId>org.apache.servicecomb</groupId>
    <artifactId>handler-flowcontrol-qps</artifactId>
    <version>1.0.0-m1</version>
</dependency>
```

　　**表2 QPS流控配置项说明**

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| servicecomb.flowcontrol.Provider.qps.enabled | true | true/false | 否 | 是否启用Provider流控 | - |
| servicecomb.flowcontrol.Provider.qps.limit.\[ServiceName\] | 2147483647（max int） | \(0,2147483647\]，整形 | 否 | 每秒钟允许的请求数 | 仅支持microservice一个级别的配置 |
| servicecomb.flowcontrol.Provider.qps.global.limit | 2147483647（max int） | (0,2147483647\]，整形 | 否 | provider接受请求流量的全局配置 | 没有具体到微服务的配置时，此配置生效 |

## 降级策略
### 概念阐述

降级策略是当服务请求异常时，微服务所采用的异常处理策略。降级策略有三个相关的技术概念：“隔离”、“熔断”、“容错”：

降级策略有三个相关的技术概念：“隔离”、“熔断”、“容错”：
* “隔离”是一种异常检测机制，常用的检测方法是请求超时、并发量过大等。一般的设置参数包括超时时间、同时并发请求个数等。
* “熔断”是一种异常反应机制，“熔断”依赖于“隔离”。熔断通常基于错误率来实现。一般的设置参数包括统计请求的个数、错误率等。
* “容错”是一种异常处理机制，“容错”依赖于“熔断”。熔断以后，会调用“容错”的方法。一般的设置参数包括调用容错方法的次数等。

把这些概念联系起来：当"隔离"措施检测到N次请求中共有M次错误的时候，"熔断"不再发送后续请求，调用"容错"处理函数。这个技术上的定义，是和Netflix Hystrix一致的，通过这个定义，非常容易理解它提供的配置项，参考：[https://github.com/Netflix/Hystrix/wiki/Configuration](https://github.com/Netflix/Hystrix/wiki/Configuration)。当前ServiceComb提供两种容错方式，分别为返回null值和抛出异常。

### 场景描述

用户通过配置降级策略，可以设置微服务的异常处理策略。

### 配置说明

　　配置项如表所示。

　　**表3 降级策略相关配置项说明**

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| servicecomb.isolation.timeout.enabled | FALSE | - | 否 | 是否启用超时检测 |  |
| servicecomb.isolation.timeoutInMilliseconds | 30000 | - | 否 | 超时时间阈值 |  |
| servicecomb.isolation.maxConcurrentRequests | 10 | - | 否 | 最大并发数阈值 |  |
| servicecomb.circuitBreaker.enabled | TRUE | - | 否 | 是否启用熔断措施 |  |
| servicecomb.circuitBreaker.forceOpen | FALSE | - | 否 | 不管失败次数，都进行熔断 |  |
| servicecomb.circuitBreaker.forceClosed | FALSE | - | 否 | 任何时候都不熔断 | 当与forceOpen同时配置时，forceOpen优先。 |
| servicecomb.circuitBreaker.sleepWindowInMilliseconds | 15000 | - | 否 | 熔断后，多长时间恢复 | 恢复后，会重新计算失败情况。注意：如果恢复后的调用立即失败，那么会立即重新进入熔断。 |
| servicecomb.circuitBreaker.requestVolumeThreshold | 20 | - | 否 | 10s内统计错误发生次数阈值，超过阈值则触发熔断 | 由于10秒还会被划分为10个1秒的统计周期，经过1s中后才会开始计算错误率，因此从调用开始至少经过1s，才会发生熔断。 |
| servicecomb.circuitBreaker.errorThresholdPercentage | 50 | - | 否 | 错误率阈值，达到阈值则触发熔断 |  |
| servicecomb.fallback.enabled | TRUE | - | 否 | 是否启用出错后的故障处理措施 |  |
| servicecomb.fallback.maxConcurrentRequests | 10 | - | 否 | 并发调用容错处理措施（servicecomb.fallbackpolicy.policy）的请求数，超过这个值则不再调用处理措施，直接返回异常 |  |
| servicecomb.fallbackpolicy.policy | throwexception | returnnulll \| throwexception | 否 | 出错后的处理策略 |  |

**注意：** 谨慎使用servicecomb.isolation.timeout.enabled=true。因为系统处理链都是异步执行，中间处理链的返回，会导致后面处理链的逻辑处理效果丢失。尽可能将servicecomb.isolation.timeout.enabled保持默认值false，并且正确设置网络层超时时间servicecomb.request.timeout=30000。
{: .notice--warning}

## 示例代码

```yaml
servicecomb:
  handler:
    chain:
      Consumer:
        default: bizkeeper-consumer
  isolation:
    Consumer:
      timeout:
        enabled: true
      timeoutInMilliseconds: 30000
  circuitBreaker:
    Consumer:
      sleepWindowInMilliseconds: 15000
      requestVolumeThreshold: 20
  fallback:
    Consumer:
      enabled: true
  fallbackpolicy:
    Consumer:
      policy: throwexception
```

> **说明：**
> 
> 降级策略需要启用服务治理能力，对应的服务提供者的handler是`bizkeeper-provider`，服务消费者的handler是`bizkeeper-consumer`。如果省略了`Consumer:`/`Provider:`，策略将无法配置成功，此时服务治理将以默认配置生效。

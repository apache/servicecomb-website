---
title: "调用控制"
lang: cn
ref: invoke-control
permalink: /cn/docs/users/invoke-control/
excerpt: "调用控制"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 实例级故障隔离

### 场景描述

实例级故障隔离功能允许在微服务的部分实例调用失败时，停止向故障实例发送请求，从而达到隔离故障实例的功能。

### 配置说明

实例级故障隔离功能集成在负载均衡功能中, 与实例级故障隔离相关的配置项见下表。

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| servicecomb.loadbalance.isolation.enabled | false | Boolean | 否 | 是否开启故障实例隔离功能 | - |
| servicecomb.loadbalance.isolation.enableRequestThreshold | 20 | Integer | 否 | 当实例的调用总次数达到该值时开始进入隔离逻辑门槛 | - |
| servicecomb.loadbalance.isolation.errorThresholdPercentage | 20 | Integer，区间为\(0,100\] | 否 | 实例故障隔离错误百分比 | - |
| servicecomb.loadbalance.isolation.singleTestTime | 10000 | Integer | 否 | 故障实例单点测试时间 |  |

## 熔断策略
### 场景描述

熔断策略是对ServiceComb熔断功能的设置，用户通过配置熔断策略可以指定在何种条件下ServiceComb框架将终止发送请求。

### 配置说明

熔断作为异常反应机制是降级策略的一部分，相关概念还有隔离和容错。三者的关系以及配置方式参见[降级策略](/cn/users/service-configurations/#降级策略)。

## 限流策略
### 场景描述

用户在consumer端使用限流策略，可以限制发往指定微服务的请求的频率。

### 注意事项

参考服务提供者处[限流策略注意事项](/cn/users/service-configurations/#限流策略)。

### 配置说明

限流策略配置在microservice.yaml文件中，相关配置项见下表。要开启服务消费者端的限流策略，还需要在处理链中配置消费端限流handler，配置示例如下：

```yaml
servicecomb:
  handler:
    chain:
      Consumer:
        default: qps-flowcontrol-consumer
```

QPS流控配置项说明

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| servicecomb.flowcontrol.Consumer.qps.enabled | true | Boolean | 否 | 是否启用Consumer流控 | - |
| servicecomb.flowcontrol.Consumer.qps.limit.[ServiceName].[Schema].[operation] | 2147483647  (max int) | (0,2147483647]，整形 | 否 | 每秒钟允许的请求数 | 支持microservice、schema、operation三个级别的配置 |

---
title: "服务治理"
permalink: /docs/service-management/
excerpt: "服务治理."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}

## 概念介绍
服务治理主要涉及“隔离”、“熔断”、“容错”、“负载均衡”等技术措施，这些技术措施共同完成了服务治理的能力。为了让开发者能够正确配置服务治理的参数，我们提供了一种技术措施上的定义。

- “隔离”是一种异常检测机制，常用的检测方法是请求超时、流量过大等。一般的设置参数包括超时时间、同时并发请求个数等。
- “熔断”是一种异常反应机制，“熔断”依赖于“隔离”。熔断通常基于错误率来实现。一般的设置参数包括统计请求的个数、错误率等。
- “容错”是一种异常处理机制，“容错”依赖于“熔断”。熔断以后，会调用“容错”的方法。一般的设置参数包括调用容错方法的次数等。
把这些概念联系起来（配置参考)： 当"隔离"措施检测到N次请求中共有M次错误的时候，"熔断"不再发送后续请求，调用"容错"处理函数。

这个技术上的定义，是和Netflix Hystrix一致的，通过这个定义，非常容易理解它提供的配置项，参考：https://github.com/Netflix/Hystrix/wiki/Configuration。

**Note:**SDK开发指南里面描述的都是技术概念，最终用户并不会用到这里的概念。系统提供的治理功能请参考治理中心的文档说明。
{: .notice--warning}

1. JDK 1.8
2. Maven 3.5.0 


## 配置项生效范围

- 按照类型(type)：配置项能够针对Provider, Consumer进行配置。
- 按照范围(scope)：配置项能够针对MicroService进行配置, 也可以针对【x-schema-id + operationId】进行配置。

cse.[namespace].[type].[MicroServiceName].[接口名称].[property name]

**Note:**1. type指Provider或者Consumser。
2. 对于全局配置，不需要指定MicroServiceName。针对特定的微服务的配置，需要增加MicroServiceName。
3. 对于适用于接口配置的，需要指定接口名称，接口名称由【x-schema-id + operationId】组成。
{: .notice--warning}

隔离示例如下。

cse.isolation.Consumer.enabled
cse.isolation.Consumer.DemoService.enabled
cse.isolation.Consumer.DemoService.hello.sayHello.enabled
cse.isolation.Provider.enabled
cse.isolation.Provider.DemoService.enabled
cse.isolation.Provider.DemoService.hello.sayHello.enabled

## 配置项列表

配置项列表如下所示：

|类|配置项|默认配置值参考|说明|
|:----:|:----:|:----:|:-----:|
|隔离||cse.isolation.timeout.enabled|FALSE|是否启用超时检测。|
|隔离|cse.isolation.timeoutInMilliseconds|30000|超时时间，超过时间，记录一次错误。|
|隔离|cse.isolation.maxConcurrentRequests|10|通过并发数检测错误。配置最大并发数。|
|熔断|cse.circuitBreaker.enabled|TRUE|是否启用熔断措施。|
|熔断|cse.circuitBreaker.forceOpen|FALSE|不管失败次数，都进行熔断。|
|熔断|cse.circuitBreaker.forceClosed|FALSE|任何时候都不熔断，forceOpen优先。|
|熔断|cse.circuitBreaker.sleepWindowInMilliseconds|15000|熔断后，多长时间恢复。恢复后，会重新计算失败情况。注意：如果恢复后的调用立即失败，那么会立即重新进入熔断。
|熔断|cse.circuitBreaker.requestVolumeThreshold|20|10s内统计的请求个数，10s内统计的请求必须大于这个值，并且错误率达到阈值的时候才熔断。由于10秒还会被划分为10个1秒的统计周期，经过1s中后才会开始计算错误率，因此从调用开始至少经过1s，才会发生熔断。|
|熔断|cse.circuitBreaker.errorThresholdPercentage|50|错误率，达到错误率的时候熔断。|
|容错|cse.fallback.enabled|TRUE|是否启用出错后的故障处理措施。支持返回null和抛出Exception两种处理措施。|
|容错|cse.fallback.maxConcurrentRequests|10|并发调用容错处理措施（cse.fallbackpolicy.policy）的请求数。超过这个值，不再调用处理措施，直接返回异常。|
|容错|cse.fallbackpolicy.policy|throwexception|出错后的处理策略，默认抛出异常。可选值有：returnnull，throwexception|
 
**Note:**在表格里，全部省略type和MicroServiceName。未特殊说明，配置项都支持Provider和Consumer。例如：对于服务消费者，需要配置为：cse.isolation.Consumer.enabled，对于服务提供者，需要配置为：cse.isolation.Provider.enabled。
{: .notice--warning}

 谨慎使用cse.isolation.timeout.enabled=true。因为系统处理链都是异步执行，中间处理链的返回，会导致后面处理链的逻辑处理效果丢失。尽可能将cse.isolation.timeout.enabled保持默认值false，并且正确设置网络层超时时间cse.request.timeout=30000。
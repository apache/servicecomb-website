---
title: "服务配置"
lang: cn
ref: service-configurations
permalink: /cn/users/service-configurations/
excerpt: "服务配置"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 负载均衡策略
### 场景描述

　　ServiceComb提供了基于Ribbon的负载均衡方案，用户可以通过配置文件配置负载均衡策略，当前支持随机、顺序、基于响应时间的权值等多种负载均衡路由策略。

### 配置说明

　　负载均衡策略在microservice.yaml文件中配置，配置项为`cse.loadbalance.[MicroServiceName].[property name]`，其中若省略MicroServiceName，则为全局配置；若指定MicroServiceName，则为针对特定微服务的配置。

　　**表1 配置项说明**

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| cse.loadbalance.NFLoadBalancerRuleClassName | com.netflix.loadbalancer.RoundRobinRule | com.netflix.loadbalancer.RoundRobinRule（轮询）com.netflix.loadbalancer.RandomRule（随机）com.netflix.loadbalancer.WeightedResponseTimeRule（服务器响应时间权值）org.apache.servicecomb.loadbalance.SessionStickinessRule（会话保持） | 否 | 负载均衡路由策略 | - |
| cse.loadbalance.SessionStickinessRule.sessionTimeoutInSeconds | 30 | Integer | 否 | 客户端闲置时间，超过限制后选择后面的服务器。 | 暂不支持微服务配置。e.g. cse.loadbalance.SessionStickinessRule.sessionTimeoutInSeconds，不能配置为cse.loadbalance.DemoService.SessionStickinessRule.sessionTimeoutInSeconds |
| cse.loadbalance.SessionStickinessRule.successiveFailedTimes | 5 | Integer | 否 | 客户端失败次数，超过后会切换服务器 | 暂不支持微服务配置 |
| cse.loadbalance.retryEnabled | FALSE | Boolean | 否 | 负载均衡捕获到服务调用异常，是否进行重试 | - |
| cse.loadbalance.retryOnNext | 0 | Integer | 否 | 尝试新的服务器的次数 | - |
| cse.loadbalance.retryOnSame | 0 | Integer | 否 | 同一个服务器尝试的次数 | - |
| cse.loadbalance.isolation.enabled | FALSE | Boolean | 否 | 是否开启故障实例隔离功能 | - |
| cse.loadbalance.isolation.enableRequestThreshold | 20 | Integer | 否 | 当实例的调用总次数达到该值时开始进入隔离逻辑门槛 | - |
| cse.loadbalance.isolation.errorThresholdPercentage | 20 | Integer，区间为\(0,100\] | 否 | 实例故障隔离错误百分比 | - |
| cse.loadbalance.isolation.singleTestTime | 10000 | Integer | 否 | 故障实例单点测试时间 | 单位为ms |
| cse.loadbalance.transactionControl.policy | org.apache.servicecomb.loadbalance.filter.SimpleTransactionControlFilter | - | 否 | 动态路由分流策略 | 框架提供了简单的分流机制，开发者也可以实现自定义的分流过滤策略 |
| cse.loadbalance.transactionControl.options | - | key/value pairs | 否 | 针对SimpleTransactionControlFilter分流策略的配置项，可添加任意项过滤标签 | - |

### 示例代码

　　负载均衡策略配置在src/main/resources/microservice.yaml文件中。

　　配置处理链：

```yaml
cse:
  # other configurations omitted
  handler:
    chain:
      Consumer:
        default: loadbalance
  # other configurations omitted
```

　　增加路由策略：

```yaml
cse：
  # other configurations omitted
  loadbalance:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RoundRobinRule
  # other configurations omitted
```

## 自定义路由策略

　　用户可以在ServiceComb提供的路由策略框架下根据业务需要，通过编程的方式来开发路由策略。实施步骤如下：

* 实现接口`com.netflix.loadbalancer.IRule`中定义的接口方法。
路由选择逻辑在public Server choose\(Object key\)方法中实现。LoadBalancerStats是一个封装了负载均衡器当前运行状态的一个结构。通过获取stats中各个实例的运行指标，在choose方法中，判定将当前请求路由到哪个实例上进行处理。处理风格可以参照`org.apache.servicecomb.loadbalance.SessionStickinessRule`。

* 编译开发的策略，保证生成的class在classpath下。

* 通过SDK配置该路由策略，假如是`AbcRule`。则配置如下：       `cse.loadbalance.NFLoadBalancerRuleClassName=org.apache.servicecomb.ribbon.rule.AbcRule`
   
## 限流策略
### 场景描述

用户在provider端使用限流策略，可以限制指定微服务向其发送请求的频率，达到限制每秒钟最大请求数量的效果。

### 注意事项

1. 限流策略的控制并不是绝对精确的，可能会有少量误差。
2. provider端的流量控制是业务层面的功能，不是安全意义上的流量控制，如需防止DDoS攻击，需要结合其他的一系列措施。
3. 流量控制是微服务级的，不是进程级的。

### 配置说明

　　限流策略配置在microservice.yaml文件中，相关配置项见下表。要开启服务提供者端的限流策略，还需要在处理链中配置服务端限流handler，配置示例如下：

```yaml
cse:
  handler:
    chain:
      Consumer:
        default: qps-flowcontrol-provider
```

　　**表2 QPS流控配置项说明**

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| cse.flowcontrol.Provider.qps.enabled | true | true/false | 否 | 是否启用Provider流控 | - |
| cse.flowcontrol.Provider.qps.limit.\[ServiceName\] | 2147483647（max int） | \(0,2147483647\]，整形 | 否 | 每秒钟允许的请求数 | 仅支持microservice一个级别的配置 |
| cse.flowcontrol.Provider.qps.global.limit | 2147483647（max int） | (0,2147483647\]，整形 | 否 | provider接受请求流量的全局配置 | 没有具体到微服务的配置时，此配置生效 |

## 降级策略
### 概念阐述

降级策略是当服务请求异常时，微服务所采用的异常处理策略。降级策略有三个相关的技术概念：“隔离”、“熔断”、“容错”：

降级策略有三个相关的技术概念：“隔离”、“熔断”、“容错”：
* “隔离”是一种异常检测机制，常用的检测方法是请求超时、流量过大等。一般的设置参数包括超时时间、同时并发请求个数等。
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
| cse.isolation.timeout.enabled | FALSE | - | 否 | 是否启用超时检测 |  |
| cse.isolation.timeoutInMilliseconds | 30000 | - | 否 | 超时时间阈值 |  |
| cse.isolation.maxConcurrentRequests | 10 | - | 否 | 最大并发数阈值 |  |
| cse.circuitBreaker.enabled | TRUE | - | 否 | 是否启用熔断措施 |  |
| cse.circuitBreaker.forceOpen | FALSE | - | 否 | 不管失败次数，都进行熔断 |  |
| cse.circuitBreaker.forceClosed | FALSE | - | 否 | 任何时候都不熔断 | 当与forceOpen同时配置时，forceOpen优先。 |
| cse.circuitBreaker.sleepWindowInMilliseconds | 15000 | - | 否 | 熔断后，多长时间恢复 | 恢复后，会重新计算失败情况。注意：如果恢复后的调用立即失败，那么会立即重新进入熔断。 |
| cse.circuitBreaker.requestVolumeThreshold | 20 | - | 否 | 10s内统计错误发生次数阈值，超过阈值则触发熔断 | 由于10秒还会被划分为10个1秒的统计周期，经过1s中后才会开始计算错误率，因此从调用开始至少经过1s，才会发生熔断。 |
| cse.circuitBreaker.errorThresholdPercentage | 50 | - | 否 | 错误率阈值，达到阈值则触发熔断 |  |
| cse.fallback.enabled | TRUE | - | 否 | 是否启用出错后的故障处理措施 |  |
| cse.fallback.maxConcurrentRequests | 10 | - | 否 | 并发调用容错处理措施（cse.fallbackpolicy.policy）的请求数，超过这个值则不再调用处理措施，直接返回异常 |  |
| cse.fallbackpolicy.policy | throwexception | returnnulll \| throwexception | 否 | 出错后的处理策略 |  |

**注意：** 谨慎使用cse.isolation.timeout.enabled=true。因为系统处理链都是异步执行，中间处理链的返回，会导致后面处理链的逻辑处理效果丢失。尽可能将cse.isolation.timeout.enabled保持默认值false，并且正确设置网络层超时时间cse.request.timeout=30000。
{: .notice--warning}

## 示例代码

```yaml
cse:
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
    sleepWindowInMilliseconds: 15000
    requestVolumeThreshold: 20
  fallback:
    enabled: true
    policy: throwexception
```

> **说明：**
> 降级策略需要启用服务治理能力，对应的服务提供者的handler是`bizkeeper-provider`，服务消费者的handler是`bizkeeper-consumer`。

---
title: "负载均衡"
lang: en
ref: load-balance
permalink: /docs/load-balance/
excerpt: "负载均衡"
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---


{% include toc %}

## 场景介绍

当应用访问一个集群部署的服务时，会涉及到路由负载均衡。 当前提供的基于Ribbon的方案，可以通过配置文件配置负载均衡策略，当前支持随机，顺序，基于响应时间的权值等多种负载均衡路由策略。这些策略可以根据用户的场景进行修改配置。

## 配置说明

命名规范如下：

cse.loadbalance.[MicroServiceName].[property name]

- 只能配置客户端。
- 对于全局配置，不需要指定MicroServiceName。针对特定的微服务的配置，需要增加MicroServiceName。
负载均衡示例如下：

cse.loadbalance.NFLoadBalancerRuleClassName
cse.loadbalance.DemoService.NFLoadBalancerRuleClassName

## 配置项

负载均衡配置项如表1所示。

|配置项|配置值参考|说明|
|:----:|:-----:|:------:|
|cse.loadbalance.NFLoadBalancerRuleClassName|com.netflix.loadbalancer.RoundRobinRule|基于轮询的路由选择策略。|
|cse.loadbalance.NFLoadBalancerRuleClassName|com.netflix.loadbalancer.RandomRule|基于随机的路由选择策略。|
|cse.loadbalance.NFLoadBalancerRuleClassName|com.netflix.loadbalancer.WeightedResponseTimeRule|基于服务器响应时间的路由选择策略。|
|cse.loadbalance.NFLoadBalancerRuleClassName|com.huawei.paas.cse.loadbalance.SessionStickinessRule|会话保持路由选择策略。|
|cse.loadbalance.SessionStickinessRule.sessionTimeoutInSeconds|30|客户端闲置时间，超过限制后选择后面的服务器。（说明：暂不支持微服务配置。e.g. cse.loadbalance.SessionStickinessRule.sessionTimeoutInSeconds，不能配置为cse.loadbalance.DemoService.SessionStickinessRule.sessionTimeoutInSeconds）。|
|cse.loadbalance.SessionStickinessRule.successiveFailedTimes|5|客户端失败次数，超过后会切换服务器（暂不支持微服务配置）。|
|cse.loadbalance.retryEnabled|FALSE|负载均衡捕获到服务调用异常，是否进行重试。|
|cse.loadbalance.retryOnNext|0|尝试新的服务器的次数。|
|cse.loadbalance.retryOnSame|0|同一个服务器尝试的次数。|
|cse.loadbalance.isolation.enabled|FALSE|是否开启故障实例隔离功能。|
|cse.loadbalance.isolation.enableRequestThreshold|20|当实例的调用总次数达到该值时开始进入隔离逻辑门槛，需为整数，默认值为20。|
|cse.loadbalance.isolation.errorThresholdPercentage|20|实例故障隔离错误百分比，需为(0,100]区间整数，默认值为20，大于该值时该实例被隔离。|
|cse.loadbalance.isolation.singleTestTime|10000|故障实例单点测试时间，单位为ms，默认值为10000，当前时间与该实例上次被调用到的时间差大于该值时该实例有机会被调用到。|
|cse.loadbalance.transactionControl.policy|io.servicecomb.loadbalance.filter.SimpleTransactionControlFilter|动态路由分流策略，框架提供了简单的分流机制，开发者也可以实现自定义的分流过滤策略。|
|cse.loadbalance.transactionControl.options|key/value pairs|针对SimpleTransactionControlFilter分流策略的配置项，可添加任意项过滤标签。|

## 实施指导

配置文件路径：src\main\resources\microservice.yaml。

## 实施负载均衡

实施负载均衡的步骤如下。

- 在处理链配置项当中增加负载均衡一项，代码如下。
```yaml
cse:
  ......
  handler:
    chain:
      Consumer:
       default: loadbalance
  ......
```
- 增加路由策略，代码如下。
```yaml
cse：
  ......
  loadbalance:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RoundRobinRule
  ......   
``` 

**Note:**路由策略默认配置为com.netflix.loadbalancer.RoundRobinRule。
其中 NFLoadBalancerRuleClassName为具体的路由策略，通过配置不同的实现类的路径来实现不同的路由策略，通常的路由策略配置如下：
轮询： com.netflix.loadbalancer.RoundRobinRule
随机：com.netflix.loadbalancer.RandomRule
权值：com.netflix.loadbalancer.WeightedResponseTimeRule
会话保持：com.huawei.paas.cse.loadbalance.SessionStickinessRule
{: .notice--warning}

## 通过服务version路由分流

在灰度发布的情况下，Consumer可以通过下面的方式指定访问的服务版本号。

```yaml
cse:
  references:
    microserviceName:
      version-rule: latest       # 支持模糊匹配，如1.0+
```

**Note:** 默认情况下，只能够访问最新版本的服务，业务可以指定具体版本号。 version-rule的详细规则请参考“服务中心契约”的描述。
{: .notice--warning}

## 通过实例properties路由分流


- 配置分流策略
  可为每个微服务配置路由分流策略，通过配置中心动态更新，如下:

```yaml
cse:
  loadbalance:
    microserviceName:             # 如果为跨app访问，则配置为appId:serviceName
      transactionControl:
        policy: io.servicecomb.loadbalance.filter.SimpleTransactionControlFilter
        options:
          tag0: value0
```

**Note:** 这里的SimpleTransactionControlFilter是由框架提供的简单路由分流策略，选中的实例的properties必须包含options中的所有tags。
{: .notice--warning}

- 自定义分流策略
  业务可根据自己的需求实现自定义的分流策略，代码如下:

```java
import io.servicecomb.loadbalance.filter.TransactionControlFilter;
import com.netflix.loadbalancer.Server;

public class MyFilter extends TransactionControlFilter {

    @Override
    public List<Server> getFilteredListOfServers(List<Server> servers) {
        ......
        for (Server server : servers) {
          CseServer cseServer = (CseServer) server;
          Map<String, String> propertiesMap = cseServer.getInstance().getProperties();
          ......
        }
        ......
        return null;
    }
}
```

自定义的分流策略必须继承自框架提供的io.servicecomb.loadbalance.filter.TransactionControlFilter抽象类，配置到特定的微服务。

```yaml
cse:
  loadbalance:
    microserviceName:
      transactionControl:
        policy: com.path.to.class.MyFilter
```

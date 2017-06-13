---
title: "QPS流控"
permalink: /docs/qps/
excerpt: "QPS流控"
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

QPS流控用于限制每秒钟最大的请求数量。在consumer端，用于限制发往某个微服务的请求频率；在provider端，用于限制某个微服务过来的请求频率。consumer端和provider端的流控有些不同，请注意区分。provider端的流控不是安全意义上的流量控制，而是业务层面的功能。为了防止DOS攻击，需要结合其他的一些列措施。

**Note:**QPS流控不是绝对精确的，可能会有少量误差。
{: .notice--warning}

{% include toc %}

## QPS配置项参考

QPS配置项表如下所示。

|配置项|默认值|说明|
|:-----:|:------:|:-----:|
|cse.flowcontrol.Consumer.qps.enabled|TRUE|是否启用Consumer流控。|
|cse.flowcontrol.Provider.qps.enabled|TRUE|是否启用Provider流控。|
|cse.flowcontrol.Consumer.qps.limit.[ServiceName].[Schema].[operation]|2147483647 （max int）|每秒钟允许的QPS数，支持microservice、schema、operation三个级别的配置。|
|cse.flowcontrol.Provider.qps.limit.[ServiceName]|2147483647 （max int）|每秒钟允许的QPS数，仅支持microservice一个级别的配置。|

## Consumer流控

流控是微服务级的，不是进程级的。

假设调用目标微服务：ms，目标schema：s1，目标operation：op。

启用流控后，如果不配置limit，QPS最高允许为2147483647。如果配置cse.flowcontrol.Consumer.qps.limit.ms为10000。调用ms，QPS最高允许为10000。

启用流控后，如果配置cse.flowcontrol.Consumer.qps.limit.ms为10000，cse.flowcontrol.Consumer.qps.limit.ms.s1为20000。调用ms.s1，QPS最高允许为20000，除ms.s1以外的，对ms的调用，QPS最高允许为10000。

启用流控后，如果配置cse.flowcontrol.Consumer.qps.limit.ms为10000，cse.flowcontrol.Conusmer.qps.limit.ms.s1为20000，cse.flowcontrol.Consumer.qps.limit.ms.s1.op为30000。调用ms.s1.op，QPS最高允许为30000。除ms.s1.op以外的，对ms.s1的调用，QPS最高允许为20000。除ms.s1以外的，对ms的调用，QPS最高允许为10000。

## Provider流控

Provider流控配置比较简单， cse.flowcontrol.Provider.qps.limit.ms=1000，表示允许来自于微服务ms的请求每秒最大为1000。
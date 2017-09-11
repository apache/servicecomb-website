---
title: "处理链概述"
lang: en
ref: handler-summary
permalink: /users/handler-summary/
excerpt: "处理链概述."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}

## 平台默认提供的处理链

平台默认提供的处理链如表1所示。

|名称|模块|适用范围|说明|
|:-----:|:-----:|:------:|:-----:|
|loadbalance|handler-loadbalance|Consumer|提供客户端路由发现、负载均衡。|
|bizkeeper-consumer|handler-bizkeeper|Consumer|客户端服务治理能力。|
|bizkeeper-provider|handler-bizkeeper|Provider|服务端服务治理能力。|
|qps-flowcontroll-consumer|handler-flowcontrol-qps|Consumer|客户端做qps限流。|
|qps-flowcontroll-provider|handler-flowcontrol-qps|Provider|服务端做qps限流。|

## 使用处理链


可以通过如下配置控制Provider和Consumer使用的处理链。

- Provider: cse.handler.chain.Provider.default= bizkeeper-provider
- Consumer: cse.handler.chain.Consumer.default=loadbalance,bizkeeper-consumer
给不同的微服务指定不一样的处理链。

- cse.handler.chain.Consumer.service.[MicroServiceName]=loadbalance,bizkeeper-consumer

## 处理链的顺序
处理链的顺序不同，系统工作行为也不同。 下面列举一下常见问题。

- loadbalance和bizkeeper-consumer 这两个顺序可以随机组合。但是行为是不一样的。 当loadbalance在前面的时候，那么loadbalance提供的重试功能会在bizkeeper-consumer抛出异常时发生，比如超时等。如果已经做了fallbackpolicy配置，比如returnnull，那么loadbalance则不会重试。 如果loadbalance在后面，那么loadbalance的重试会延长超时时间，即使重试成功，如果bizkeeper-consumer设置的超时时间不够，那么最终的调用结果也是失败。
- 建议的顺序

  Consumer: loadbalance,bizkeeper-consumer

  Provider: bizkeeper-provider

  这种顺序能够满足大多数场景，并且不容易出现不可理解的错误。


## 处理链扩展

可以通过实现AbstractHandler来扩展处理链。 具体包含如下几个步骤：
- 实现AbstractHandler
```java
public class MyHandler extends AbstractHandler {
    @Override
    public void handle(Invocation invocation, AsyncResponse asyncResp) throws Exception {
        // code before

        invocation.next(response -> {
            // code after
            asyncResp.handle(response);
        });
    }
}
```

- 给处理链增加一个名字 增加config/cse.handler.xml文件，内容如下。

```xml
<config>
  <handler id="myhandler" class="xxx.xxx.xxx.MyHandler" />
</config>
```

- 在microservices.ymal文件指定需要使用该处理链。

```yaml
cse:
  handler:
    chain:
      Provider:
      default: bizkeeper-provider,myhandler
```

处理链的顺序和上面定义的顺序有关，注意加到一个合适的位置。

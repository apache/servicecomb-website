---
title: "highway通信"
lang: en
ref: highway-transport
permalink: /docs/highway-transport/
excerpt: "highway通信."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

Highway通道是高性能私有协议通道，在有特殊性能需求场景时可选用。

{% include toc %}

## Highway通道对应的依赖包

Highway通道对应的依赖包如下：

```xml
<dependency>
    <groupId>io.servicecomb</groupId>
    <artifactId>transport-highway</artifactId>
</dependency>
```

## Highway通道需要的配置项

Highway通道需要的配置项如下：


|分类|配置项|配置值参考|说明|
|:-----:|:-----:|:-----:|:-----:|
|highway + tcp|cse.highway.address|0.0.0.0:7070|服务监听的地址|
|highway + tcp|cse.highway.server.thread-count|1（缺省值）|服务端网络线程个数|
|highway + tcp|cse.highway.client.thread-count|1（缺省值）|客户端网络线程个数|
|highway + tcp|cse.highway.client.connection-pool-per-thread|1（缺省值）|客户端每个网络线程的连接池个数|

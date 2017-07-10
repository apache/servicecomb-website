---
title: "Rest通信"
lang: cn
ref: rest-transport
permalink: /cn/docs/rest-transport/
excerpt: "rest通信."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

Rest网络通道将服务以标准RESTful的形式向外发布，调用端兼容直接使用http client使用标准RESTful形式进行调用。

Rest网络通道提供了两种模式：vertx和servlet，分别对应两种部署运行模式，用户可根据自己的运行模式来选择Rest网络通道。

{% include toc %}

## Rest on Vertx

Rest on Vertx网络通道对应的依赖包如下：

```xml
<dependency>
    <groupId>io.servicecomb</groupId>
    <artifactId>transport-rest-vertx</artifactId>
</dependency>
```

使用Rest on Vertx通道需要如下配置项：

|分类|配置项|配置值参考|说明|
|:-----:|:------:|:-----:|:-------:|
|REST + Vertx|cse.rest.address|0.0.0.0:8080|服务监听的地址|
|REST + Vertx|cse.rest.server.thread-count|1|服务端线程个数|
|REST + Vertx|cse.rest.client.thread-count|1|客户端网络线程个数|
|REST + Vertx|cse.rest.client.connection-pool-per-thread|1|客户端每个网络线程中的连接池个数|

服务供给端进程需要配置cse.rest.address，向外暴露服务。服务消费端进程如果仅仅作为消费端则可不配置cse.rest.address项。



## Rest on Servlet

Rest on Servlet网络通道对应的依赖包如下：

```xml
<dependency>
    <groupId>io.servicecomb</groupId>
    <artifactId>transport-rest-servlet</artifactId>
</dependency>
```



|分类|配置项|配置值参考|说明|
|:-----:|:------:|:-----:|:-------:|
|REST + Servlet|cse.rest.address|0.0.0.0:8080|transport监听地址|
|REST + Servlet|cse.rest.server.timeout|3000|超时时间|


## 序列化

- **参数**
当前Rest通道的body参数只支持application/json序列化方式。 如果需要向服务端发送form类型参数，那么需要在调用端构造好application/json格式的body数据，如{"a": 3, "b": 4}，不能直接通过multipart/form-data格式传递form类型参数，服务端无法解析。

- **返回值**
当前Rest通道的返回值支持application/json和text/plain两种序列化方式。服务供给端通过produces声明可提供的序列化能力，调用端通过请求的Accept头指明返回值序列化方式，默认返回application/json格式数据。

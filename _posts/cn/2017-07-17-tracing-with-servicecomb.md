---
title: "基于 ServiceComb 和 Zipkin 的分布式调用链追踪"
lang: cn
ref: tracing-with-servicecomb
permalink: /cn/docs/tracing-with-servicecomb/
excerpt: "本篇将介绍如何使用 ServiceComb 和 Zipkin 实现分布式调用链追踪"
last_modified_at: 2017-07-17T09:18:43+08:00
author: Sean Yin
redirect_from:
  - /theme-setup/
---

微服务架构解决了很多单体应用带来的问题，但同时也需要我们付出额外的代价。由于网络的不稳定性带来的请求处理延迟就是代价之一。

在单体应用中，所有模块都在同一个进程中运行，所以并没有模块间互通的问题。但微服务架构中，服务间通过网络沟通，因此我们不得不处理和网络有关的
问题，例如：延迟、超时、网络分区等。

另外，随着业务的扩展服务增多，我们很难洞察数据如何在蛛网般复杂的服务结构中流转。我们如何才能有效的监控网络延迟并且可视化服务中的数据流转呢？

## Zipkin
> [Zipkin](http://zipkin.io/) 是一个分布式调用链追踪系统。 它能帮助用户收集时序数据用以定位微服务中的延迟问题，它同时管理追踪数据的收集
和查询。Zipkin 的设计基于 Google [Dapper paper](http://research.google.com/pubs/pub36356.html)。[1]

ServiceComb 集成了 Zipkin 提供自动调用链追踪能力，如此一来用户只需要专注实现其业务需求。 

## 使用步骤
我们将以 [workshop demo](https://github.com/ServiceComb/LinuxCon-Beijing-WorkShop) 为例演示如何用 Zipkin 实施调用链追踪。

### 添加依赖
基于 ServiceComb Java Chassis 的微服务只需要添加如下依赖到 pom.xml。
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>handler-tracing-zipkin</artifactId>
    </dependency>

```

如果微服务是基于 Spring Cloud + Zuul 的 API 网关，例如 workshop demo 中的 manager service ，我们还需要加入如下的额外依赖。
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>spring-cloud-zuul-zipkin</artifactId>
    </dependency>
```

### 配置追踪处理和数据收集
在微服务的 `microservice.yaml` 配置文件中，设置追踪处理器和数据收集服务地址。
```yaml
cse:
  handler:
    chain:
      Consumer:
        default: tracing-consumer
      Provider:
        default: tracing-provider

servicecomb:
  tracing:
    collector:
      address: http://zipkin.servicecomb.io:9411
```

就这样，在加了两个配置项，没改动一行代码的情况下，我们启动了基于 Zipkin 和 Java chassis 的分布式调用链追踪的功能。

## 快速演示
在 workshop demo 中启动追踪后，我们接下来在 docker 环境中演示一下调用链追踪功能。
1. 在 workshop demo 目录下，使用命令 `mvn package -DskipTests -Pdocker` 或 `mvn package -DskipTests -Pdocker -Pdocker-machine`
（如果你使用 [Docker Toolbox](https://www.docker.com/products/docker-toolbox)），创建所有服务的 docker 镜像  

2. 运行 `docker-compose up`

3. 按照下面视频中的操作步骤，给运行在 docker 容器中的服务发送请求

4. 用浏览器打开运行在 docker 容器中的 Zipkin 网站，地址应为 docker 容器IP：`http://docker.container.ip:9411`

{% include video id="XMjg1NzQ3NzUzNg" provider="youku" %}

现在我们应该可以看到 Zipkin 首页上显示的几个被追踪的服务。
![zipkin homepage]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.1.png){: .align-center}

如果我们选择 manager 并点击 Find Traces 按钮，就能看到一些调用链数据。请别介意服务性能可能不太好，因为我们是在一台2012年产的笔记本上
运行这么多服务。
![traces of manager service]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.2.png){: .align-center}

如果点击某一个调用链，我们能看到对应的所有时间跨度信息。
![trace spans of manager service]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.3.png){: .align-center}

点击某个时间跨度，可以获取更详细的调用时间信息。
![span details of manager service]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.4.png){: .align-center}

同时我们也可以点击 Dependencies 按钮，查看服务的依赖关系图。
![service dependencies]({{ site.url }}{{ site.baseurl }}/assets/images/tracing.5.png){: .align-center}

## 总结
从以上的示例可以看出，通过 ServiceComb 实现分布式调用链追踪功能只需简单的两步配置，但我们却基于 Zipkin 展示了强大的功能，如分析服务间
调用的时间数据以定位网络延迟，并提供可视化界面以洞察服务间的调用链和依赖关系。

## 参考
* [1] [Zipkin](http://zipkin.io/)

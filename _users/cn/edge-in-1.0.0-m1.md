---
title: "使用内置Edge模块实现边缘服务"
lang: cn
ref: edge
permalink: /cn/users/edge-in-1.0.0-m1/
excerpt: "使用内置Edge模块实现边缘服务"
last_modified_at: 2018-4-3T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架从1.0.0-m1版本开始提供内置Edge模块，请通过查看用户手册和Release Note获取更多信息，我们也会继续追加新特性新功能，欢迎订阅ServiceComb邮件列表(dev-subscribe@servicecomb.incubator.apache.org)参与讨论。

## Edge特性
### 与微服务松耦合
Edge Service仅仅转发微服务请求，与目标微服务之间没有任何依赖关系。

### 自动匹配版本
默认情况下，Edge Service会自动匹配版本操作，例如微服务：
- 在1.0.0版本中提供了Operation1
- 在1.1.0版本中提供了Operation1和Operation2

Edge Service转发Operation1的请求将允许1.0.0版本和1.1.0版本的微服务实例，转发Operation2时，只会选择1.1.0版本的微服务实例。

### 支持Consumer治理
支持所有Java Chassis Consumer治理Handler，也支持用户扩展Handler。

### 默认使用Reactive工作模式
由于Edge Service转发所有API调用，对性能有较高要求，所以默认使用Reactive模式工作，请不要在转发流程代码中增加阻塞操作，例如：
- 数据库查询、远程调用等；
- sleep、wait等；
- 大循环或耗时操作等。

## 开发Edge Service
### 引入依赖
只需要引入edge-core依赖即可：
```xml
<dependency>
  <groupId>org.apache.servicecomb</groupId>
  <artifactId>edge-core</artifactId>
  <version>1.0.0-m1</version>
</dependency>
```

### 开发Dispatcher
要实现Edge Service转发功能，需要开发Dispatcher并继承接口org.apache.servicecomb.transport.rest.vertx.VertxHttpDispatcher或org.apache.servicecomb.transport.rest.vertx.AbstractVertxHttpDispatcher，重写其中的三个方法：
#### getOrder方法
Dispatcher向Vertx注入路由规则时的优先顺序，值越小优先级越高。

#### init方法
初始化Dispatcher的路由规则，使用的是[Vertx路由规则](https://vertx.io/docs/vertx-web/java/#_routing_by_exact_path)，例如我们添加两条匹配策略：
```java
public void init(Router router) {
  String regex = "/([^\\\\/]+)/([^\\\\/]+)/(.*)";
  router.routeWithRegex(regex).handler(CookieHandler.create());
  router.routeWithRegex(regex).handler(createBodyHandler());
  router.routeWithRegex(regex).failureHandler(this::onFailure).handler(this::onRequest);

  regex = "/([^\\\\/]+)/(.*)";
  router.routeWithRegex(regex).handler(CookieHandler.create());
  router.routeWithRegex(regex).handler(createBodyHandler());
  router.routeWithRegex(regex).failureHandler(this::onFailure).handler(this::onRequest);
}
```

1. /([^\\/]+)/([^\\/]+)/(.*) : 这条策略我们希望匹配带版本的微服务请求，例如/user-service/v0/validate；
2. /([^\\/]+)/(.*) : 这条策略用于匹配不带版本的微服务请求，例如/user-service/validate。

#### onRequest方法
转发策略，方法原型为：
```java
void onRequest(RoutingContext context)
```

从context中可以获取到请求目标微服务名，path等信息，之后创建EdgeInvocation并初始化，完成调用：
```java
EdgeInvocation edgeInvocation = new EdgeInvocation();
edgeInvocation.setVersionRule(versionRule);
edgeInvocation.init(serviceName, context, path, httpServerFilters);
edgeInvocation.edgeInvoke();
```

### 加载Dispatcher
Edge Service使用SPI机制加载用户自定义的VertxHttpDispatcher，我们在resources文件夹下创建META-INF/services文件夹，之后添加org.apache.servicecomb.transport.rest.vertx.VertxHttpDispatcher文件，在文件中，添加写好的Dispatcher即可：
```text
{your-package-path}.XXXDispatcher
```

### 扩展Handler（可选）
由于Edge Service需要承载统一认证、集中监控等功能，我们推荐扩展Handler的方式实现，在demo-edge中的edge-service中有AuthHandler的示例。
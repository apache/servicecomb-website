---
title: "轻松微服务系列：开发高性能边缘服务"
lang: cn
ref: easy-build-microservice-system-part-III
permalink: /cn/docs/easy-build-microservice-system-part-III/
excerpt: "轻松微服务系列：开发高性能边缘服务"
last_modified_at: 2018-06-07T19:00:00+08:00
author: Yangyong Zheng
tags: [Edge Service,API Gateway,Zuul]
redirect_from:
  - /theme-setup/
---

## 轻松微服务系列：开发高性能边缘服务
在前一篇博文[《轻松微服务系列：快速实现客户关系管理系统的用户服务》](http://servicecomb.incubator.apache.org/cn/docs/easy-build-microservice-system-part-II/)，我们已经详细演示了从Archetype创建微服务后如何填充业务逻辑，快速构建包含JWT认证的用户服务。这篇博文我们将目光聚焦在Edge服务上，介绍如何构建高性能边缘服务应对高吞吐API网关的挑战。

### 什么是边缘服务（Edge Service）
边缘服务也是一个微服务，微服务化系统通常使用边缘服务（Edge Service）作为所有其它微服务的统一入口，因此它也常常会被称为API Gateway，使用边缘服务的好处有如下几点：
* 动态路由：动态配置URL地址与微服务之间的对应关系，便于扩展，以及实现版本灰度发布等；
* 统一认证：在入口处进行访问认证，避免需要在所有的微服务中都承载重复的认证机制；
* 集中监控：与统一认证类似，在边缘服务对入口调用进行监控，容易统计流量信息。

### 边缘服务的作用和原理
我们先来看不使用边缘服务，UI直接调用用户服务的场景：

![DirectInvoke](/assets/images/scaffold/DirectInvoke.png)

可以看出这种调用方式，UI缺乏一定的灵活性，体现在：
* UI的实现绑定了Chassis的编程语言Java，无法使用PHP等其它前端技术开发；
* UI访问微服务的路径无法动态配置，如果作为后端的微服务系统发生调整，则UI很可能需要修改；
* UI很容易混入复合（编排）调用的逻辑，使得结构变得复杂难以维护。

我们再看引入边缘服务后，UI如何通过边缘服务调用用户服务：

![InvokeViaEdge](/assets/images/scaffold/InvokeViaEdge.png)

Edge服务将在`9090`端口上接受http rest调用，我们设计了下面的转发规则：

```text
http://{edge-host-name}:9090/{ServiceComb微服务Name}/{服务路径&参数}
```

用户微服务名（`service_description.name`）是`user-service`，因此login调用URL：*cse://user-service/login*可以通过：*http://{edge-host-name}:9090/user-service/login* 访问。

如此一来，微服务名成为了路径的一部分，http协议的`hostname`和`port`将固定指向Edge服务保持不变，灵活性大大增加了。

到此我们还可以再做一点点改进，引入一个自定义配置`edge.routing-short-path.{简称}`，映射微服务名：

```
edge:
  routing-short-path:
    user: user-service
```

上面的配置代表：*http://{edge-host-name}:9090/user/login* 等效于：*http://{edge-host-name}:9090/user-service/login* ，如此一来：
1. URL能够更加简洁；
2. 当微服务名发生变化，只需要调整对应的配置，不需要更改前端UI路径代码。

### 实现边缘服务
#### 第一步：引入Edge Core依赖
```xml
<dependency>
  <groupId>org.apache.servicecomb</groupId>
  <artifactId>edge-core</artifactId>
</dependency>
```

#### 第二步：编写调度器Dispatcher
Edge服务的核心就是调度器Dispatcher，ServiceComb Edge Core中的Dispatcher基于高性能的Vertx Reactive，轻松应对百万量级API请求的挑战；只需要继承AbstractEdgeDispatcher抽象类，添加对应的逻辑即可：

```java
public class EdgeDispatcher extends AbstractEdgeDispatcher {
  private static final Logger LOGGER = LoggerFactory.getLogger(EdgeDispatcher.class);

  //此Dispatcher的优先级，Order级越小，路由策略优先级越高
  public int getOrder() {
    return 10000;
  }

  //初始化Dispatcher的路由策略
  public void init(Router router) {
    ///捕获 {ServiceComb微服务Name}/{服务路径&参数} 的URL
    String regex = "/([^\\\\/]+)/(.*)";
    router.routeWithRegex(regex).handler(CookieHandler.create());
    router.routeWithRegex(regex).handler(createBodyHandler());
    router.routeWithRegex(regex).failureHandler(this::onFailure).handler(this::onRequest);
  }

  //处理请求，请注意
  private void onRequest(RoutingContext context) {
    Map<String, String> pathParams = context.pathParams();
    //从匹配的param0拿到{ServiceComb微服务Name}
    final String service = pathParams.get("param0");
    //从匹配的param1拿到{服务路径&参数}
    String path = "/" + pathParams.get("param1");

    //还记得我们之前说的做出一点点改进吗？引入一个自定义配置edge.routing-short-path.{简称}，映射微服务名；如果简称没有配置，那么就认为直接是微服务的名
    final String serviceName = DynamicPropertyFactory.getInstance()
        .getStringProperty("edge.routing-short-path." + service, service).get();

    //创建一个Edge转发
    EdgeInvocation edgeInvocation = new EdgeInvocation();
    //允许接受任意版本的微服务实例作为Provider，未来我们会使用此（设置版本）能力实现灰度发布
    edgeInvocation.setVersionRule(DefinitionConst.VERSION_RULE_ALL);
    edgeInvocation.init(serviceName, context, path, httpServerFilters);
    edgeInvocation.edgeInvoke();
  }
}
```

#### 第三步：加载调度器Dispatcher
ServiceComb Edge使用SPI（Service Provider Interface）的方式加载已经编写好的调度器Dispatcher，在resources目录下创建`META-INF.services/org.apache.servicecomb.transport.rest.vertx.VertxHttpDispatcher`配置文件，写入上一步EdgeDispatcher的类全名：

```text
{EdgeDispatcher的包名}.EdgeDispatcher
```

#### 第四步：配置microservice.yaml
边缘服务本身也是一个微服务，同样需要配置microservice.yaml：

```yaml
APPLICATION_ID: scaffold
service_description:
  name: edge-service
  version: 0.0.1
servicecomb:
  service:
    registry:
      #配置ServiceCenter使得Edge能够发现其他微服务
      address: http://127.0.0.1:30100
  #配置Rest Endpoint
  rest:
    address: 0.0.0.0:9090

#自定义的简称机制配置（这是我们自行扩展实现的）
edge:
  routing-short-path:
    user: user-service
```

>提示：
>1. 除了配置Rest Endpoint，我们也支持配置Highway Endpoint，但Highway Endpoint只支持ServiceComb开发的微服务调用；
>2. microservice.yaml中没有配置Handler，Edge支持所有Consumer端Handler，不支持Producer端Handler，调用链原理如下：
>
>![EdgeOnlySupportConsumerHandler](/assets/images/scaffold/EdgeOnlySupportConsumerHandler.png)
>

### 验证边缘服务
启动用户微服务和Edge服务，使用[Postman](https://www.getpostman.com/)注册一个用户：

![LogonViaEdge](/assets/images/scaffold/LogonViaEdge.png)

成功，现在我们使用新注册的用户名`ldg`登录：

![LoginViaEdge](/assets/images/scaffold/LoginViaEdge.png)

同样成功，并在Response中已经包含了正确的`AUTHORIZATION`Header。

### 性能比拼
ServiceComb Java Chassis同样支持集成Netflix Zuul作为网关服务，因此我们做了一次性能比较。

场景以及部署如下：

![PerformanceTestDeploy](/assets/images/scaffold/PerformanceTestDeploy.png)

第一次启动Edge作为网关，测试5分钟，之后停止Edge，启动Zuul，测试5分钟，测试结果如下：

|     | CPU使用率  | TPS（吞吐能力）  |
| :------- | :-------- | :--------- |
| Zuul    | ≈1000%  | ≈20000  |
| Edge    | ≈1000%  | ≈55000  |

可以看出在接近的资源使用情况下，Edge相比Zuul有更优秀的吞吐能力。

>提示：
>1. 性能测试项目源代码在[这里](https://github.com/zhengyangyong/gateway-perf)；
>2. 两台物理机使用万兆内网直连，两者的时延（Latency）均在1ms以内。
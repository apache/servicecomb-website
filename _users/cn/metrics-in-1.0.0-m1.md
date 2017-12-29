---
title: "1.0.0-m1版本中的监控"
lang: cn
ref: metrics
permalink: /cn/users/metrics-in-1.0.0-m1/
excerpt: "1.0.0-m1版本中的监控"
last_modified_at: 2017-12-30T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架从0.5.0版本开始支持监控功能Metrics，1.0.0-m1版本正式发布，我们会继续追加新特性新功能，订阅ServiceComb邮件列表(dev-subscribe@servicecomb.incubator.apache.org)以持续获取最新信息。

## 背景
将系统微服务化是技术潮流和趋势，但是它解决了很多问题的同时也带来了新的问题。

![MonolithicArch](/assets/images/MonolithicArch.png)

这是传统单体系统架构图，对运维人员友好，但是对开发人员不友好，系统维护升级困难。

![MicroserviceArch](/assets/images/MicroserviceArch.png)

这是微服务化后的系统架构图，经过功能切分，开发人员得到解脱，拥有了极致的CI/CD，但是运维人员却需要维护海量的微服务实例，所以如果不进行性能监控，就无法定位时延高的微服务，也无法制定弹性伸缩策略。

## 1.0.00-m1版本原理
在0.5.0版本的实现介绍[0.5.0版本中的监控](/cn/users/metrics-in-0.5.0/)中，存在一些问题：
1.metrics在foundation-metrics模块中实现，并且包含了一些具体的定制代码；  
2.使用ThreadLocal变量收集和汇总数据，虽然性能很高，但是存在内存泄漏的风险；  
3.Metrics的输出为固定的文本，而不是独立的数值，数据使用起来很不方便；  
4.没有提供通用数据发布接口，难以和更多的第三方监控系统做集成；  
5.由于foundation-metrics模块过于底层，用户无法以可选的方式决定是否启用；  

因此，从0.5.0版本升级到1.0.0-m1版本，我们进行了一次全面的重构，重构后的Metrics将分为三个模块  
| Module名             | 描述                              |
| :------------------ | :------------------------------ |
| metrics-core        | Metric核心模块，引入后即启用Metrics数据收集功能  |
| metrics-common      | Metric通用模块，主要包含Metric DTO用于数据发布 |
| metrics-extension   | 包含Metric的一些扩展功能                 |
| metrics-integration | 包含Metric与其它三方系统集成               |
| metrics-sample      | 包含Metric的一些示例                   |

它们的依赖关系如下图所示：
![MetricsDependency.png](/assets/images/MetricsDependency.png)

### 数据采集不再依赖Hystrix（handler-bizkeeper），使用事件埋点收集与调用相关的所有数据
1.0.0-m1版本不再从Hystrix获取调用的TPS和Latency，避免了不配置Java Chassis Bizkeeper Handler就不会输出这两项数据的问题；使用foundation-common中的EventBus作为事件总线，metrics-core中的DefaultEventListenerManager初始化后会立即注入三个事件监听处理类：  
| 事件监听处理类名                               | 功能                        |
| :------------------------------------- | :------------------------ |
| InvocationStartedEventListener         | Consumer调用或Producer接收开始   |
| InvocationStartProcessingEventListener | Producer从队列中取出调用开始处理      |
| InvocationFinishedEventListener        | Consumer调用返回或Producer处理完毕 |

*特别说明，Java Chassis的Reactor框架基于Vertx，微服务Producer端收到Invocation后，并不会马上同步处理请求，而是将它放入一个处理队列中，Invocation在队列中的时间称为LifeTimeInQueue，队列的长度称为waitInQueue，这是衡量微服务压力的两个重要指标，可以参考操作系统磁盘读写队列的概念；Consumer端并不会有队列，因此永远不会触发InvocationStartProcessingEvent。

事件触发的代码广泛分布在Java Chassis的RestInvocation、HighwayServerInvoke、HighwayClient和VertxHttpMethod中，如果微服务没有启用Metrics，EventBus中不会注入事件监听处理类，因此对性能的影响微乎其微。

### 使用Netflix Servo作为Metric的计数器
Netflix Servo具有性能极高的计数器（Monitor），我们使用了四种：  
| Monitor名     | 描述            |
| :----------- | :------------ |
| BasicCounter | 基本累积计数器（永续累加） |
| StepCounter  | 周期累加计数器       |
| MinGauge     | 周期最小值计数器      |
| MaxGauge     | 周期最大值计数器      |
*依赖的Servo版本为0.10.1

### 周期设置
总所周知，Metric可以分为两大类：  
1.时间无关型：诸如调用总次数、资源使用状况等等，Consumer无论何时获取Metric，总返回当前最新值；
2.时间相关型：只有经过一个固定的周期时间才能够获取结果值，例如最大、最小、平均值等等，固定周期一般可以称为“统计时间窗”，在Servo中，这个时间被称为[“Polling Intervals”](https://github.com/Netflix/servo/wiki/Getting-Started)。  
从1.0.0-m1开始，通过servicecomb.metrics.window_time设置周期，效果与servo.pollers一致。


## Metric列表
从1.0.0-m1开始，支持微服务Operation级别的Metric输出，列表如下：  

| Group       | Level                    | Catalog  | Metrics         | Item           |
| ----------- | ------------------------ | -------- | --------------- | -------------- |
| servicecomb | instance                 | system   | cpu             | load           |
| servicecomb | instance                 | system   | cpu             | runningThreads |
| servicecomb | instance                 | system   | heap            | init           |
| servicecomb | instance                 | system   | heap            | max            |
| servicecomb | instance                 | system   | heap            | commit         |
| servicecomb | instance                 | system   | heap            | used           |
| servicecomb | instance                 | system   | nonHeap         | init           |
| servicecomb | instance                 | system   | nonHeap         | max            |
| servicecomb | instance                 | system   | nonHeap         | commit         |
| servicecomb | instance                 | system   | nonHeap         | used           |
| servicecomb | instance/<operationName> | producer | waitInQueue     | count          |
| servicecomb | instance/<operationName> | producer | lifeTimeInQueue | average        |
| servicecomb | instance/<operationName> | producer | lifeTimeInQueue | max            |
| servicecomb | instance/<operationName> | producer | lifeTimeInQueue | min            |
| servicecomb | instance/<operationName> | producer | executionTime   | average        |
| servicecomb | instance/<operationName> | producer | executionTime   | max            |
| servicecomb | instance/<operationName> | producer | executionTime   | min            |
| servicecomb | instance/<operationName> | producer | producerLatency | average        |
| servicecomb | instance/<operationName> | producer | producerLatency | max            |
| servicecomb | instance/<operationName> | producer | producerLatency | min            |
| servicecomb | instance/<operationName> | producer | producerCall    | total          |
| servicecomb | instance/<operationName> | producer | producerCall    | tps            |
| servicecomb | instance/<operationName> | consumer | consumerLatency | average        |
| servicecomb | instance/<operationName> | consumer | consumerLatency | max            |
| servicecomb | instance/<operationName> | consumer | consumerLatency | min            |
| servicecomb | instance/<operationName> | consumer | consumerCall    | total          |
| servicecomb | instance/<operationName> | consumer | consumerCall    | tps            |
*<operationName>代表微服务Operation的全名，使用的是Java Chassis MicroserviceQualifiedName，它是微服务名.SchemaID.操作方法名的组合。

## 如何配置
### 全局配置
请在microservice.yaml中添加如下配置项：  
```yaml 
APPLICATION_ID: demo
service_description:
  name: demoService
  version: 0.0.1

servicecomb:
  metrics:
    #时间窗间隔，与servo.pollers设置效果一致，单位毫秒
    #支持多个时间窗间隔，使用逗号（,）将多个分隔开，例如5000,10000，代表设置两个时间窗，第一个时间窗5000的windowTimeIndex为0，第二个时间窗10000的windowTimeIndex为1，依此类推
    window_time: 5000
```
*时间窗设置对于统计结果获取的影响，附上代码中包含的一段注释如下：  
![TimeWindowComment.png](/assets/images/TimeWindowComment.png)

### 依赖配置
只需要添加metrics-core依赖即可：  
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-core</artifactId>
      <version>1.0.0-m1</version>
    </dependency>
```

## 数据发布
配置好Metrics后，你可以通过如下两种方式获取Metrics数据：  
### 内置的发布接口
当微服务启动后，metrics-core会自动以Springmvc的方式发布服务：  
```java
@RestSchema(schemaId = "metricsEndpoint")
@RequestMapping(path = "/metrics")
public class DefaultMetricsPublisher implements MetricsPublisher {

  private final DataSource dataSource;

  @Autowired
  public DefaultMetricsPublisher(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @RequestMapping(path = "/", method = RequestMethod.GET)
  @Override
  public RegistryMetric metrics() {
    return dataSource.getRegistryMetric();
  }

  @RequestMapping(path = "/{windowTimeIndex}", method = RequestMethod.GET)
  @Override
  public RegistryMetric metricsWithWindowTimeIndex(@PathVariable(name = "windowTimeIndex") int windowTimeIndex) {
    return dataSource.getRegistryMetric(windowTimeIndex);
  }
}
```
因此，如果你在microservice.yaml中配置了rest provider，例如：  
```yaml
cse:
  service:
    registry:
      address: http://127.0.0.1:30100
  rest:
    address: 0.0.0.0:8080
```
你就可以通过http://localhost:8080/metrics 直接获取到数据，打开浏览器输入此URL就可以看到返回结果。
### 直接代码获取
从上面的代码可以看到，数据提供Bean接口是io.servicecomb.metrics.core.publish.DataSource，因此如果你希望自己开发数据发布程序，只需要注入它即可。
```java
@Autowired
private DataSource dataSource;
```
*我们已经开发完成了两个使用场景可以作为参考：
1.metrics-wirte-file：将Metrics数据写入文件，代码在metrics-extension中
2.metrics-prometheus：将Metrics发布为prometheus Producer


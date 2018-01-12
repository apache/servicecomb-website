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
微服务框架从0.5.0版本开始支持监控功能Metrics，1.0.0-m1版本正式发布，请通过查看用户手册和[Release Note](https://github.com/apache/incubator-servicecomb-java-chassis/releases)获取更多信息，我们也会继续追加新特性新功能，欢迎订阅ServiceComb邮件列表(dev-subscribe@servicecomb.incubator.apache.org)参与讨论。

## 背景
将系统微服务化是技术潮流和趋势，但是它解决了很多问题的同时也带来了新的问题。

![MonolithicArch](/assets/images/MonolithicArch.png)

这是传统单体系统架构图，对运维人员友好，但是对开发人员不友好，系统维护升级困难。

![MicroserviceArch](/assets/images/MicroserviceArch.png)

这是微服务化后的系统架构图，经过功能切分，开发人员获得了架构独立、快速迭代等诸多微服务带来的好处，但是运维人员却需要维护海量的微服务实例，所以如果不进行性能监控，当系统出现故障或用户体验下降时，就无法快速定位问题，也无法制定策略（例如弹性伸缩）来预防。

## 1.0.00-m1版本原理
在0.5.0版本的实现介绍[0.5.0版本中的监控](/cn/users/metrics-in-0.5.0/)中，存在一些问题：
1. metrics在foundation-metrics模块中实现，并且包含了一些具体的定制代码；  
2. 使用ThreadLocal变量收集和汇总数据，虽然性能很高，但是存在内存泄漏的风险；  
3. Metrics的输出为固定的文本，而不是独立的数值，数据使用起来很不方便；  
4. 没有提供通用数据发布接口，难以和更多的第三方监控系统做集成；  
5. 由于foundation-metrics模块过于底层，用户无法以可选的方式决定是否启用；  

因此，从0.5.0版本升级到1.0.0-m1版本，我们进行了一次全面的重构，重构后的Metrics将分为如下几个模块  

| Module名             | 描述                               |
| :------------------ | :------------------------------- |
| metrics-core        | Metrics核心模块，引入后即启用Metrics数据收集功能  |
| metrics-common      | Metrics通用模块，主要包含Metric DTO用于数据发布 |
| metrics-extension   | 包含Metrics的一些扩展功能                 |
| metrics-integration | 包含Metrics与其它三方系统集成               |

它们的依赖关系如下图所示：
![MetricsDependency.png](/assets/images/MetricsDependency.png)

### 数据采集不再依赖Hystrix（handler-bizkeeper），使用事件埋点收集与调用相关的所有数据
1.0.0-m1版本不再从Hystrix获取调用的TPS和Latency，避免了不配置Java Chassis Bizkeeper Handler就不会输出这两项数据的问题；使用foundation-common中的EventBus作为事件总线，metrics-core中的DefaultEventListenerManager初始化后会立即注册三个事件监听处理类：

| 事件监听处理类名                               | 功能                        |
| :------------------------------------- | :------------------------ |
| InvocationStartedEventListener         | Consumer调用或Producer接收开始   |
| InvocationStartProcessingEventListener | Producer从队列中取出调用开始处理      |
| InvocationFinishedEventListener        | Consumer调用返回或Producer处理完毕 |

*特别说明，Java Chassis的Reactor框架基于[Vertx](http://vertx.io/)，在同步调用模式下，微服务Producer端收到Invocation后，并不会马上同步处理请求，而是将它放入一个处理队列中，Invocation在队列中的时间称为**LifeTimeInQueue**，队列的长度称为**waitInQueue**，这是衡量微服务压力的两个重要指标，可以参考操作系统磁盘读写队列的概念；Consumer端并不会有队列，因此永远不会触发InvocationStartProcessingEvent。*

事件触发的代码分布在Java Chassis的RestInvocation、HighwayServerInvoke和InvokerUtils中，如果微服务没有启用Metrics，EventBus中就不会注册Metrics事件监听处理器，因此对性能的影响微乎其微。

### 使用Netflix Servo作为Metric的计数器
[Netflix Servo](https://github.com/Netflix/servo)具有性能极高的计数器（Monitor），我们使用了四种：  

| Monitor名     | 描述                               |
| :----------- | :------------------------------- |
| BasicCounter | 基本累积计数器（永续累加）                    |
| StepCounter  | 周期累加计数器（以前曾经称为ResettableCounter） |
| MinGauge     | 周期最小值计数器                         |
| MaxGauge     | 周期最大值计数器                         |

*依赖的Servo版本为0.10.1*

### 周期设置
Metrics有很多种分类方式，在技术实现上我们偏向以取值方式区分为两种：  
1. 直接取值
  任何时候都能够立刻获取到最新值，例如资源使用率，包括CPU使用率，线程数，Heap使用数据等等，还有调用累加次数，当前队列长度等等。
2. 统计取值
  经过一个特定的时间周期才能够统计出值，这个时间间隔我们可以称为窗口周期（Window Time）或统计周期，例如：  
  a) 多值取其一的，比如Max、Min、Median（中位值）;    
  b) 与时间相关的，比如TPS（transaction per second）；    
  c) 与个数相关的，比如累加平均值、方差等等；    
  获取此类Metrics的值，返回的是上一个周期的统计结果，具有一定的延后性。在Servo中，这个时间被称为[“Polling Intervals”](https://github.com/Netflix/servo/wiki/Getting-Started)。    
  从1.0.0-m1开始，可以通过microservice.yaml中的servicecomb.metrics.window_time配置设置周期，效果与servo.pollers一致。  
## Metric列表
从1.0.0-m1开始，支持微服务Operation级别的Metric输出，列表如下：  

| Group       | Level                  | Catalog  | Metrics         | Item           |
| :---------- | :--------------------- | :------- | :-------------- | :------------- |
| servicecomb | instance               | system   | cpu             | load           |
| servicecomb | instance               | system   | cpu             | runningThreads |
| servicecomb | instance               | system   | heap            | init           |
| servicecomb | instance               | system   | heap            | max            |
| servicecomb | instance               | system   | heap            | commit         |
| servicecomb | instance               | system   | heap            | used           |
| servicecomb | instance               | system   | nonHeap         | init           |
| servicecomb | instance               | system   | nonHeap         | max            |
| servicecomb | instance               | system   | nonHeap         | commit         |
| servicecomb | instance               | system   | nonHeap         | used           |
| servicecomb | instance &#124; operationName | producer | waitInQueue     | count          |
| servicecomb | instance &#124; operationName | producer | lifeTimeInQueue | average        |
| servicecomb | instance &#124; operationName | producer | lifeTimeInQueue | max            |
| servicecomb | instance &#124; operationName | producer | lifeTimeInQueue | min            |
| servicecomb | instance &#124; operationName | producer | executionTime   | average        |
| servicecomb | instance &#124; operationName | producer | executionTime   | max            |
| servicecomb | instance &#124; operationName | producer | executionTime   | min            |
| servicecomb | instance &#124; operationName | producer | producerLatency | average        |
| servicecomb | instance &#124; operationName | producer | producerLatency | max            |
| servicecomb | instance &#124; operationName | producer | producerLatency | min            |
| servicecomb | instance &#124; operationName | producer | producerCall    | total          |
| servicecomb | instance &#124; operationName | producer | producerCall    | tps            |
| servicecomb | instance &#124; operationName | consumer | consumerLatency | average        |
| servicecomb | instance &#124; operationName | consumer | consumerLatency | max            |
| servicecomb | instance &#124; operationName | consumer | consumerLatency | min            |
| servicecomb | instance &#124; operationName | consumer | consumerCall    | total          |
| servicecomb | instance &#124; operationName | consumer | consumerCall    | tps            |

**当Level的值是“instance”的时候，代表微服务实例级别的Metric，否则代表微服务具体Operation的Metric，operationName使用的是Java Chassis MicroserviceQualifiedName，它是微服务名.SchemaID.操作方法名的组合。**

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
    #支持多个时间窗间隔，使用逗号（,）将多个分隔开，例如5000,10000，代表设置两个时间窗
    window_time: 5000,10000
```
*时间窗设置对于统计结果获取的影响，附上代码中包含的一段注释如下：*  

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

  public DefaultMetricsPublisher(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @RequestMapping(path = "/appliedWindowTime", method = RequestMethod.GET)
  @CrossOrigin
  @Override
  public List<Long> getAppliedWindowTime() {
    return dataSource.getAppliedWindowTime();
  }

  @RequestMapping(path = "/", method = RequestMethod.GET)
  @CrossOrigin
  @Override
  public RegistryMetric metrics() {
    return dataSource.getRegistryMetric();
  }

  @ApiResponses({
      @ApiResponse(code = 400, response = String.class, message = "illegal request content"),
  })
  @RequestMapping(path = "/{windowTime}", method = RequestMethod.GET)
  @CrossOrigin
  @Override
  public RegistryMetric metricsWithWindowTime(@PathVariable(name = "windowTime") long windowTime) {
    return dataSource.getRegistryMetric(windowTime);
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

## 参考示例
我们已经开发完成了两个使用场景可以作为参考：  
1. metrics-wirte-file：将Metrics数据写入文件，代码在metrics-extension中；  
2. metrics-prometheus：将Metrics发布为prometheus Producer。  

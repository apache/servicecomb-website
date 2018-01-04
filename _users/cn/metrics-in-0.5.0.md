---
title: "0.5.0版本中的监控"
lang: cn
ref: metrics
permalink: /cn/users/metrics-in-0.5.0/
excerpt: "0.5.0版本中的监控"
last_modified_at: 2017-12-29T14:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架从0.5.0版本开始支持监控功能Metrics，请注意这个功能还处于开发（Preview）阶段，并且我们未来会做较大的调整，更多讨论请订阅ServiceComb邮件列表(dev-subscribe@servicecomb.incubator.apache.org)。

## 背景
将系统微服务化是技术潮流和趋势，但是它解决了很多问题的同时也带来了新的问题。

![MonolithicArch](/assets/images/MonolithicArch.png)

这是传统单体系统架构图，对运维人员友好，但是对开发人员不友好，系统维护升级困难。

![MicroserviceArch](/assets/images/MicroserviceArch.png)

这是微服务化后的系统架构图，经过功能切分，开发人员得到解脱，拥有了极致的CI/CD，但是运维人员却需要维护海量的微服务实例，所以如果不进行性能监控，就无法定位时延高的微服务，也无法制定弹性伸缩策略。

## 原理
0.5.0版本的Metrics会在Java Chassis的Invocation中埋入计数器，也会使用Hystrix收集TPS和Latency，同时收集微服务实例的CPU使用率和内存使用量，最终通过输出日志的方式输出收集到的Metrics数据。  
输入日志使用的是SLF4J作为日志框架，未与任何具体的日志框架绑定，我们会通过定向Logger名输出的方式将不同的Metrics输出为一个个独立的文件，因此需要在你的日志配置中添加对应的配置项，[这篇文章](https://stackoverflow.com/questions/9652032/how-can-i-create-2-separate-log-files-with-one-log4j-config-file)详细说明了如果使用Log4j作为日志实现如何配置，而[这篇文章](https://stackoverflow.com/questions/36643692/log4j2-multiple-appenders-the-same-output-is-written-to-multiple-files)则详细介绍了如果使用Log4j2作为日志需要如何配置。  
Logger名指的是LoggerFactory.getLogger后的第一个参数：
```java
static final Logger log = LoggerFactory.getLogger("${Logger名}");
log.trace("${Metric数据}");
```
**为不影响调试，log的输出级别为trace**

以下是我们的定向Logger名以及输出的Metrics含义：   

| Logger名                                  | Metric含义              |
| :--------------------------------------- | :-------------------- |
| averageServiceExecutionTime              | Producer端调用平均执行时间     |
| averageTimeInQueue                       | Producer端调用在队列中的平均时间  |
| countInQueue                             | Producer端在队列中等待的调用的数量 |
| cpuLoad                                  | 实例CPU使用率              |
| cpuRunningThreads                        | 实例运行线程数量              |
| heapCommit，heapInit，heapMax，heapUsed     | 内存Heap使用状况            |
| nonHeapCommit，nonHeapInit，nonHeapMax，nonHeapUsed | 内存NonHeap使用状况         |
| latency                                  | 调用平均时延                |
| tps                                      | 每秒调用数（Transaction per seconds）  |
| maxLifeTimeInQueue                       | Producer端调用在队列中最大等待时间 |
| minLifeTimeInQueue                       | Producer端调用在队列中最小等待时间 |
| totalRequestsPerProvider                 | Producer总请求数          |
| totalRequestsPerConsumer                 | Consumer总请求数          |
| totalFailedRequestsPerProvider           | Producer失败总请求数        |
| totalFailRequestsPerConsumer             | Consumer失败总请求数        |

## 如何配置
请在microservice.yaml中添加如下配置项：
```yaml 
APPLICATION_ID: demo
service_description:
  name: demoService
  version: 0.0.1

servicecomb:
  metrics:
    #metrics数据采集时间（同样是写文件间隔），单位秒
    polltime: 5
    #如果metric是浮点数，输出结果保留几位小数，默认为1
    round_places: 1
    file:
      #是否启用文件输出
      enabled: true
      #会体现为输出内容中的plugin_id
      name_prefix: bmi.calculator
```

## 注意事项
**需要在provider治理链中添加bizkeeper-provider，否则TPS和Latency无数据**
```yaml
APPLICATION_ID: demo
service_description:
 name: demoService
 version: 0.0.1
cse:
 handler:
   chain:
     Provider:
       default: bizkeeper-provider
```

## 配置示例

以设置averageServiceExecutionTime为例，如果是Log4j，配置如下：
```properties
#指定Logger名为averageServiceExecutionTime
log4j.category.averageServiceExecutionTime=TRACE, averageServiceExecutionTimeLogger
#定向日志，不扩散到别的Logger中
log4j.additivity.averageServiceExecutionTime=false
#使用RollingFileAppender
log4j.appender.averageServiceExecutionTimeLogger=org.apache.log4j.RollingFileAppender
log4j.appender.averageServiceExecutionTimeLogger.File=/target/averageServiceExecutionTime.log
log4j.appender.averageServiceExecutionTimeLogger.MaxFileSize=10MB
log4j.appender.averageServiceExecutionTimeLogger.MaxBackupIndex=10
log4j.appender.averageServiceExecutionTimeLogger.layout=org.apache.log4j.PatternLayout
log4j.appender.averageServiceExecutionTimeLogger.layout.ConversionPattern=%m%n
log4j.appender.averageServiceExecutionTimeLogger.append=true
```

如果是Log4j2，配置如下：
```xml
<!--Log4j2配置支持全局配置-->
<Properties>
  <Property name="maxFileSize">10MB</Property>
  <Property name="maxFileCount">10</Property>
  <Property name="filePath">/target</Property>
  <Property name="filePrefix">bmi.calculator</Property>
</Properties>

<Appenders>
  <RollingFile name="averageServiceExecutionTime" fileName="${filePath}${filePrefix}.averageServiceExecutionTime.dat"
    filePattern="${filePath}${filePrefix}.averageServiceExecutionTime-%i.dat">
    <PatternLayout pattern="%m%n"/>
    <SizeBasedTriggeringPolicy size="${maxFileSize}"/>
    <DefaultRolloverStrategy max="${maxFileCount}"/>
  </RollingFile>
</Appenders>

<Loggers>
  <Logger name="averageServiceExecutionTime" level="trace" additivity="false">
    <AppenderRef ref="averageServiceExecutionTime"/>
  </Logger>
</Loggers>
```

剩余Metric（参见原理章节中的表格）按照上面的例子重复替换即可。

## 输出效果
每一个文件就是一个微服务示例级别的metrics数据输出，0.5.0版本还不支持Operation级别的Metrics输出：

![Metrics图片](/assets/images/metrics-output.png)

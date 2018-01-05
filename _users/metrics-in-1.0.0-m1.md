---
title: "Metrics in 1.0.0-m1"
lang: en
ref: metrics
permalink: /users/metrics-in-1.0.0-m1/
excerpt: "Metrics in 1.0.0-m1"
last_modified_at: 2017-12-30T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
Metrics had supported from Java chassis version 0.5.0,in version 1.0.0-m1,we had reconstruction it and add some more features,please subscribe ServiceComb mail-list(dev-subscribe@servicecomb.incubator.apache.org) in order to get latest news.

## Background
Microservice is trend of technology,it resolve many problems also follows new problem. 

![MonolithicArch](/assets/images/MonolithicArch.png)

This is traditional software architecture always called 'Monolithic',it's difficult for developer maintain the code or add new feature because of tight coupling,but it's easy for operation engineer deploy and maintenance(only one system process).

![MicroserviceArch](/assets/images/MicroserviceArch.png)

This is microservice system architecture,after split 'Monolithic' into many small services,developer can action with CI/CD in order to keep more agility,but operation engineer need to maintenance a whole lot of microservice instances.If don't import metrics,when system  is abnormal or user experience getting worse,it's very difficult to dentifying where the problem is and make some strategy in order to prevent it.

## 1.0.00-m1 Principles
In previous version(0.5.0)，implementation of metrics had some imperfections:
1. Metrics code written in foundation-metrics module,it's a low level module,and include some customized function; 
2. Use ThreadLocal variable collect and statistics data,performance hight but has memory leak risk;
3. Output data of metrics is joined text not dependent number,difficult to reuse;
4. Not support publish,unable integration with other monitor system;
5. Because foundation-metrics is a low level module and certainly be loaded,user can't exclude it if unnecessary.

So,upgrading from 0.5.0 to 1.0.0-m1,we had done a fully reconstruction,now it's include this modules:   

| Module Name         | Description                              |
| :------------------ | :--------------------------------------- |
| metrics-core        | Metrics core module,work immediately after imported |
| metrics-common      | Metrics common module,include DTO classes |
| metrics-extension   | Include some metrics extension module    |
| metrics-integration | Include metrics Integration with other monitor system |
| metrics-sample      | Include some samples develop with metrics |

The dependency of this modules is:
![MetricsDependency.png](/assets/images/MetricsDependency.png)

### Use event collect invocation data,not from Hystrix(handler-bizkeeper)any more
From 1.0.0-m1 invocation data such as TPS and latency are collected from invocation event,not from Hystrix（handler-bizkeeper） any more,so you don't need add Java Chassis Bizkeeper Handler only for metrics.we use EventBus in foundation-common,when DefaultEventListenerManager in metrics-core had initialized,three event listener class will be auto registered:

| Event Listener Name                    | Description                              |
| :------------------------------------- | :--------------------------------------- |
| InvocationStartedEventListener         | Trigger when consumer or producer called |
| InvocationStartProcessingEventListener | Trigger when producer fetch invocation from queue and start process |
| InvocationFinishedEventListener        | Trigger when consumer call returned or producer process finished |

*ServiceComb java chassis had used [Vertx](http://vertx.io/) as Reactor framework,so when producer received invocation from consumer,it won't start process immediately but put it into a queue,this queue called invocation queue(like disk queue in operation system),time waiting in the queue called **LifeTimeInQueue**,the length of the queue called **waitInQueue**,this two metrics are very important for measure stress of the microservice;consumer not has this queue,so InvocationStartProcessingEvent will never be triggered at consumer side.*

The code for trigger event write in RestInvocation,HighwayServerInvoke and InvokerUtils,if microservice don't import metrics,event listener of metrics won't be registered,the impact on performance is little.

### Use Netflix Servo as Monitor of Metric
Netflix Servo had implement a collection of high performance monitor,we had used four of them:

| Monitor Name | Description                       |
| :----------- | :-------------------------------- |
| BasicCounter | As name of it,always increment    |
| StepCounter  | Called 'ResettableCounter' before |
| MinGauge     | Mark min value in step            |
| MaxGauge     | Mark max value in step            |

*The version of Servo we used is 0.10.1*

### Window Time(also may called 'Polling Interval' or 'Step Cycle')
Metrics had many classifications,we can divided them into two major types by how get value:   
1. Direct get  
  You can direct get newest value anytime,such as system resource usage include cpu load rate,running thread count,heap size and call count,queue length,etc.
2. From statistics  
  After a 'certain time' passed can counting the value,this time we called 'Window Time',include:  
  a) Take one from many,like Max、Min、Median;   
  b) Time-related,like TPS(transaction per second);    
  c) Count-related,like average,variance.    
  If get value of this type,the result returned is the last 'Step Cycle' counted.in Servo,this time called ['Polling Intervals'](https://github.com/Netflix/servo/wiki/Getting-Started).
  From 1.0.0-m1,can set **servicecomb.metrics.window_time** in microservice.yaml,it has same effect as set **servo.pollers**.   

## Metric List
From 1.0.0-m1,start support output metrics of operation level:   

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
| servicecomb | instance/operationName | producer | waitInQueue     | count          |
| servicecomb | instance/operationName | producer | lifeTimeInQueue | average        |
| servicecomb | instance/operationName | producer | lifeTimeInQueue | max            |
| servicecomb | instance/operationName | producer | lifeTimeInQueue | min            |
| servicecomb | instance/operationName | producer | executionTime   | average        |
| servicecomb | instance/operationName | producer | executionTime   | max            |
| servicecomb | instance/operationName | producer | executionTime   | min            |
| servicecomb | instance/operationName | producer | producerLatency | average        |
| servicecomb | instance/operationName | producer | producerLatency | max            |
| servicecomb | instance/operationName | producer | producerLatency | min            |
| servicecomb | instance/operationName | producer | producerCall    | total          |
| servicecomb | instance/operationName | producer | producerCall    | tps            |
| servicecomb | instance/operationName | consumer | consumerLatency | average        |
| servicecomb | instance/operationName | consumer | consumerLatency | max            |
| servicecomb | instance/operationName | consumer | consumerLatency | min            |
| servicecomb | instance/operationName | consumer | consumerCall    | total          |
| servicecomb | instance/operationName | consumer | consumerCall    | tps            |

*operationName is full name of the operation,same as Java Chassis MicroserviceQualifiedName,it's joined with microservice appId.SchemaID.methodName.*

## How Configuration
### Global Configuration
Please add window time config in microservice.yaml:  
```yaml 
APPLICATION_ID: demo
service_description:
  name: demoService
  version: 0.0.1

servicecomb:
  metrics:
    #window time,same as servo.pollers,unit is millisecond
    #support multi window time and use ',' split them,like 5000,10000
    window_time: 5000,10000
```

*The setting of window time is very important to getting value of metrics,here is a comment show how it effect*

![TimeWindowComment.png](/assets/images/TimeWindowComment.png)

### Maven Configuration
We just only need add metrics-core dependency:  
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-core</artifactId>
      <version>1.0.0-m1</version>
    </dependency>
```

## Metrics Publish
After configuration completed,you can get collected metrics data via this method:   
### Embedded publish interface
When microservice start-up,metrics-core will auto publish data service using Springmvc provider:  
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
So,if you had config rest provider in microservice.yaml,like:  
```yaml
cse:
  service:
    registry:
      address: http://127.0.0.1:30100
  rest:
    address: 0.0.0.0:8080
```
You can open a browser and input http://localhost:8080/metrics direct get metrics data.  
### Direct programming get
From above code you can known,the interface of data provider bean is io.servicecomb.metrics.core.publish.DataSource,so if you want develop your own metrics publisher,autowired it is enough.
```java
@Autowired
private DataSource dataSource;
```

## Other Reference 
We had developed two use case for reference:  
1. metrics-wirte-file:ouput metrics data into files,code is at metrics-extension;  
2. metrics-prometheus:integration with prometheus,publish metrics as prometheus producer.
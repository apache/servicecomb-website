---
title: "1.0.0-m1版本写文件扩展和示例"
lang: cn
ref: metrics
permalink: /cn/docs/users/metrics-write-file-extension-and-sample-in-1.0.0-m1/
excerpt: "1.0.0-m1版本写文件扩展和示例"
last_modified_at: 2017-12-29T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架从0.5.0版本开始支持监控功能Metrics，1.0.0-m1版本正式发布，请通过查看用户手册和[Release Note](https://github.com/apache/servicecomb-java-chassis/releases)获取更多信息，我们也会继续追加新特性新功能，欢迎订阅ServiceComb邮件列表(dev-subscribe@servicecomb.apache.org)参与讨论。

## 背景
0.5.0版本的foundation-metrics实现了将采集到的Metrics数据写入文件，在1.0.0-m1中，此功能以Sample的形式移动到了samples/metrics-write-file-sample中；  
从1.0.0-m1版本开始支持输出Operation级别的Metric，因此无法通过固定配置的方式配置日志输出，将采用代码的方式在运行时为每一个Metric自动创建专用的RollingFileAppender。
示例代码包含如下三个模块：  

| Module名                                  | 描述                              |
| :--------------------------------------- | :------------------------------ |
| metrics-write-file                       | 定期获取Metrics数据写入文件主模块            |
| metrics-write-file-config-log4j-springboot | 使用Log4j的RollingFileAppender写文件  |
| metrics-write-file-config-log4j2-springboot | 使用Log4j2的RollingFileAppender写文件 |

*暂未提供logback的示例，参考Log4j和Log4j2的例子可以很容易实现*

## 全局配置
与0.5.0类似，需要在microservice.yaml中添加如下配置项：
```yaml 
APPLICATION_ID: demo
service_description:
  name: demoService
  version: 0.0.1

servicecomb:
  metrics:
    #1.0.0-m1日志输出间隔配置项，单位毫秒
    window_time: 5000
    #如果metric是浮点数，输出结果保留几位小数，默认为1
    round_places: 1
    file:
      #日志根目录
      root_path: ./log/metric/
      rolling:
        #最大保留文件数
        max_file_count: 10
        #文件最大大小，单位可以是KB，MB和GB
        max_file_size : 10MB
```
与0.5.0版本配置的比较：
1. 旧版本使用servicecomb.metrics.polltime(单位秒)配置文件输出间隔，1.0.0-m1版本中旧版本功能仍然存在；  
2. 新版本添加依赖即启用，因此没有老版本类似servicecomb.metrics.file.enabled开关，这个开关可以用于关闭老版本输出（老版本预定在下一个版本1.0.0-m2中彻底移除）；  
3. 新版本无需配置servicecomb.metrics.filename_prefix，默认为微服务的appId.serviceName；  
4. 新版本增加了对rolling file的设置，这些配置在老版本是配置在日志的xml或properties文件里的。  

## 依赖和代码使用
1. 首先需要引入metrics-write-file模块，这个模块包含了获取Metrics数据并转化为指定格式后写文件的逻辑：  
```xml
    <dependency>
      <groupId>org.apache.servicecomb.samples</groupId>
      <artifactId>metrics-write-file</artifactId>
    </dependency>
```
*也可以参考其中的实现修改代码或复制代码到项目中。*    
2. metrics-write-file模块不包含动态生成写文件RollingFileAppender的代码，根据项目实际使用的日志实现，如果是log4j，拷贝metrics-write-file-log4j-springboot模块中的Log4JMetricsFileWriter，如果是log4j2，拷贝metrics-write-file-log4j2-springboot模块中的Log4J2MetricsFileWriter。    
*也可以参考其中的实现修改代码或自己实现FileWriter。*   

## 使用Spring Boot Starter开发注意事项
Java Chassis集成了Spring Boot Starter，如果使用Spring Boot Starter启动微服务同时又使用Log4j作为日志实现，则需要处理依赖问题，请参考samples/metrics-write-file-sample/metrics-write-file-log4j-springboot项目：
```xml
    <!--need exclusion log4j-over-slf4j-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter</artifactId>
      <exclusions>
        <exclusion>
          <groupId>org.slf4j</groupId>
          <artifactId>log4j-over-slf4j</artifactId>
        </exclusion>
      </exclusions>
    </dependency>

    <!--servicecomb spring boot starter-->
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>spring-boot-starter-provider</artifactId>
    </dependency>
```
Spring Boot Starter中包含了log4j-over-slf4j，这个Log Bridge并没有完全实现log4j的所有接口，包括RollingFileAppender，所以我们需要排除它让slf4j直接调用log4j而不是这个Log Bridge，请确定这种排除对你的系统不会有影响，关于log4j-over-slf4j的更多信息可以参考[这篇文章](https://www.slf4j.org/legacy.html#log4j-over-slf4j)。

## 运行示例
metrics-write-file-config-log4j-springboot和metrics-write-file-config-log4j2-springboot都是可以直接运行的示例项目，使用ServiceApplication启动完成后，观察输出目录target/metric/下会生成很多Metrics文件，如果在浏览器中刷新几下http://localhost:8080/f 请求，则可以看到对应的Operation的Metrics文件也会在目录下自动生成。    
![MetricsWriteFileResult](/assets/images/MetricsWriteFileResult.png)

## Q & A
1. 在新的1.0.0-m1版本里，我是否还需要在日志配置文件（例如log4j2.xml） 中追加任何修改吗？  
  不需要，会在运行态自动为metric生成对应的RollingFileAppender，并且这个Appender与你日志配置的Appenders没有任何关系。

2. 我发现Log4J2MetricsFileWriter中创建RollingFileAppender是使用一个标记为过期的createAppender方法，为什么不使用新的的newBuilder ... build模式？  
  开发的时候发现newBuilder ... build与微服务框架存在某种冲突导致不可用，另外，官方文档的[示例代码](https://logging.apache.org/log4j/2.x/manual/customconfig.html)仍然使用的是createAppender，缺乏资料也给定位问题造成了一定的麻烦；我们未来会去改进，已标记TODO。

3. 集成后出现RollingFileAppender抛ClassNotFoundException之类的错误？  
  众所周知，Java开发主流都使用slf4j或jcl做为日志框架，然后桥接具体的日志实现，例如log4j、log4j2和logback，通过配置文件初始化日志组件，达到随意更换弱绑定的效果，并不推荐编码方式创建日志组件。
  但由于1.0.0-m1版本开始支持Operation级别的Metric输出，不同的微服务Operation不同，并且单Operation会有15+以上的Metric，因此手动配置已不具备可操作性，必须通过Coding的方式动态生成RollingFileAppender。
  如果你的项目中包含类似log4j-over-slf4j这样的Bridging依赖，就很可能会出现这样的问题，请使用mvn dependency:tree检查。
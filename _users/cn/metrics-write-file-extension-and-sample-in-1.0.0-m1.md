---
title: "1.0.0-m1版本写文件扩展和示例"
lang: cn
ref: metrics
permalink: /cn/users/metrics-write-file-extension-and-sample-in-1.0.0-m1/
excerpt: "1.0.0-m1版本写文件扩展和示例"
last_modified_at: 2017-12-29T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架从0.5.0版本开始支持监控功能Metrics，1.0.0-m1版本正式发布，我们会继续追加新特性新功能，订阅ServiceComb邮件列表(dev-subscribe@servicecomb.incubator.apache.org)以持续获取最新信息。

## 背景
0.5.0版本的foundation-metrics实现了将采集到的Metrics数据写入文件，在1.0.0-m1中，此功能移动到metrics-extension中；  
从1.0.0-m1版本开始支持输出Operation级别的Metric，因此无法通过固定配置的方式配置日志输出，将采用代码的方式在运行时为每一个Metric自动创建专用的RollingFileAppender。
功能包含如下模块：  

| Module名                         | 描述                              |
| :------------------------------- | :------------------------------   |
| metrics-write-file               | 定期获取Metrics数据写入文件主模块            |
| metrics-write-file-config        | 写文件方式配置模块                        |
| metrics-write-file-config-log4j  | 使用Log4j的RollingFileAppender写文件     |
| metrics-write-file-config-log4j2 | 使用Log4j2的RollingFileAppender写文件      |

*暂未提供logback的metrics-write-file-config，参考Log4j和log4j2的例子可以很容易实现metrics-write-file-config-logback

## 配置
### 全局配置
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
*与0.5.0版本配置的比较：  
1.旧版本使用servicecomb.metrics.polltime(单位秒)配置文件输出间隔，1.0.0-m1版本中旧版本功能仍然存在；  

2.新版本添加依赖即启用，因此没有老版本类似servicecomb.metrics.file.enabled开关，这个开关可以用于关闭老版本输出（老版本预定在下一个版本1.0.0-m2中彻底移除）；  

3.新版本无需配置servicecomb.metrics.filename_prefix，默认为微服务的appId.serviceName；    

4.新版本增加了对rolling file的设置，这些配置在老版本是配置在日志的xml或properties文件里的。    

### 依赖配置
Java Chassis支持直接启动和Spring Boot Starter启动两种模式，两种模式下的配置详细描述如下：
#### 直接启动（不使用Spring Boot）依赖配置
##### 项目使用log4j作为日志实现
请参考samples/metrics-write-file-sample/metrics-write-file-log4j项目：
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file-config</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file-config-log4j</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file</artifactId>
    </dependency>
```
依赖的log4j的版本为1.2.17。
##### 项目使用log4j2作为日志实现
请参考samples/metrics-write-file-sample/metrics-write-file-log4j2项目：
```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file-config</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file-config-log4j2</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file</artifactId>
    </dependency>
```
可以看到，与使用log4j唯一不同的是将metrics-write-file-config-log4j更换为metrics-write-file-config-log4j2，依赖的log4j2的版本为2.8.2。
#### Spring Boot Starter启动依赖配置
##### 项目使用log4j作为日志实现
请参考samples/metrics-write-file-sample/metrics-write-file-log4j-springboot项目：
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
      <groupId>io.servicecomb</groupId>
      <artifactId>spring-boot-starter-provider</artifactId>
    </dependency>
    
    <!--metrics dependency-->
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file-config</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file-config-log4j2</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file</artifactId>
    </dependency>
```
spring boot starter中包含了log4j-over-slf4j，这个依赖会在运行态屏蔽掉log4j的RollingFileAppender，使我们无法动态创建它，请确定这种排除对你的系统不会有影响，关于log4j-over-slf4j的更多信息可以参考[这篇文章](https://www.slf4j.org/legacy.html)。
##### 项目使用log4j2作为日志实现
请参考samples/metrics-write-file-sample/metrics-write-file-log4j2-springboot项目：
```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!--servicecomb spring boot starter-->
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>spring-boot-starter-provider</artifactId>
    </dependency>
    
    <!--metrics dependency-->
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file-config</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file-config-log4j2</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>metrics-write-file</artifactId>
    </dependency>
```
可以看到，spring boot starter默认使用的是log4j作为日志实现，无论你是否排除log4j的相关依赖，并不会对log4j2 write file造成任何影响，两者并存，因此依赖方面与直接启动是相同的。

## Q & A
1.在新的1.0.0-m1版本里，我是否还需要在日志配置文件（例如log4j2.xml） 中追加任何修改吗？  

不需要，metrics-write-file-config-xxx会在运行态自动为metric生成对应的RollingFileAppender，并且这个Appender与你日志配置的Appenders没有任何关系。

2.我发现metrics-write-file-config-log4j2中创建RollingFileAppender是使用一个标记为过期的createAppender方法，为什么不使用新的的newBuilder ... build模式？  

开发的时候发现newBuilder ... build与微服务框架存在某种冲突导致不可用，另外，官方文档的[示例代码](https://logging.apache.org/log4j/2.x/manual/customconfig.html)仍然使用的是createAppender，缺乏资料也给定位问题造成了一定的麻烦；我们将在下一个版本1.0.0-m2中去修复，已标记TODO。

3.集成后出现RollingFileAppender抛ClassNotFoundException之类的错误？  

众所周知，Java开发主流都使用slf4j或jcl做为日志框架，然后桥接具体的日志实现，例如log4j、log4j2和logback，通过配置文件初始化日志组件，达到随意更换弱绑定的效果，并不推荐编码方式创建日志组件。
但由于1.0.0-m1版本开始支持Operation级别的Metric输出，不同的微服务Operation不同，并且单Operation会有15+以上的Metric，因此手动配置已不具备可操作性，必须通过Coding的方式动态生成RollingFileAppender。
如果你的项目中包含类似log4j-over-slf4j这样的Bridging依赖，就很可能会出现这样的问题，请使用mvn dependency:tree检查。
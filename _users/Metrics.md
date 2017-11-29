---
title: "Metrics Monitor"
lang: en
ref: metrics
permalink: /users/metrics/
excerpt: "Metrics Monitor"
last_modified_at: 2017-11-29T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架从0.4.1版本开始支持监控功能Metrics，请注意这个功能还处于开发（Preview）阶段，请不要部署到生产环境，并且我们未来会做较大的调整，更多讨论会持续发布在[Google Group](https://groups.google.com/forum/#!forum/servicecomb-developers)中。
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
      #输出文件的根目录
      root_path: D:/Temp
      #metrics文件的前缀
      name_prefix: demo.demoService
      #metrics文件Rolling最大大小，默认10MB，例如10KB，10MB，10GB
      max_rolling_size: 10MB
      #metrics文件Rolling文件保存数量，默认10个
      max_rolling_count: 10
```

## 注意事项
* 如果使用ServiceComb Spring Boot Start快速构建项目，需要排除log4j-over-slf4j依赖
   ```xml
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter</artifactId>
     <!--Metric使用log4j输出，屏蔽掉spring-boot-starter中的log4j-over-slf4j-->
     <exclusions>
       <exclusion>
         <groupId>org.slf4j</groupId>
         <artifactId>log4j-over-slf4j</artifactId>
       </exclusion>
     </exclusions>
   </dependency>
   ```

* 需要在provider治理链中添加bizkeeper-provider，否则TPS和Latency无数据
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

## 文件输出
每一个文件就是一个微服务示例级别的metrics数据输出：

![Metrics图片](/assets/images/metrics-output.png)

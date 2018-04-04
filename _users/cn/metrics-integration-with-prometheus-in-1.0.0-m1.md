---
title: "1.0.0-m1版本中的监控如何集成prometheus"
lang: cn
ref: metrics
permalink: /cn/users/metrics-integration-with-prometheus-in-1.0.0-m1/
excerpt: "1.0.0-m1版本中的监控如何集成prometheus"
last_modified_at: 2018-1-2T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架从0.5.0版本开始支持监控功能Metrics，1.0.0-m1版本正式发布，请通过查看用户手册和[Release Note](https://github.com/apache/incubator-servicecomb-java-chassis/releases)获取更多信息，我们也会继续追加新特性新功能，欢迎订阅ServiceComb邮件列表(dev-subscribe@servicecomb.incubator.apache.org)参与讨论。

## 背景
[prometheus](http://www.prometheus.io/)是相似于Google Borgmon的一个开源监控系统，也是[CNCF](https://www.cncf.io/)的成员之一，目前社区非常活跃，Java Chassis Metrics在1.0.0-m1中支持对接prometheus，并进一步实现使用[Grafana](https://grafana.com/)查询Metrics数据。

## 对接原理
由于Java Chassis由Java语言开发，我们使用[prometheus java client](https://github.com/prometheus/client_java)中的Simple Client作为对接SDK，版本为0.1.0。  
Prometheus推荐Pull模式拉取Metrics数据，被监控微服务作为Producer发布数据provider接口，我们采用Simple HTTP Server发布微服务采集到的Metrics数据。  
作为一个集成（可选）模块，代码在metrics-integration/metrics-prometheus中，你可以看到它依赖：
```xml
  <dependency>
    <groupId>io.prometheus</groupId>
    <artifactId>simpleclient</artifactId>
  </dependency>
  <dependency>
    <groupId>io.prometheus</groupId>
    <artifactId>simpleclient_httpserver</artifactId>
  </dependency>

  <dependency>
    <groupId>org.apache.servicecomb</groupId>
    <artifactId>metrics-core</artifactId>
  </dependency>
```
因此一旦集成Prometheus引入了metrics-prometheus依赖后，不再需要添加metrics-core的依赖。

## 如何配置
开启对接prometheus非常简单：
### 全局配置
microservice.yaml中有如下配置项：  
```yaml 
APPLICATION_ID: demo
service_description:
  name: demoService
  version: 0.0.1

servicecomb:
  metrics:
    prometheus:
      #prometheus provider的端口
      port: 9696
```
*如果不做配置，默认端口为9696*  
### 依赖配置
只需要添加metrics-prometheus依赖即可：  
```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>metrics-prometheus</artifactId>
      <version>1.0.0-m1</version>
    </dependency>
```
### 配置Prometheus的prometheus.yml
你需要在prometheus.yml中配置数据采集job，例如
```yaml 
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'servicecomb'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ['localhost:9696']
```
其中job_name: 'servicecomb'即自定义的job配置，目标是本地微服务localhost:9696，关于prometheus.yml的配置更多信息可以参考[这篇文章](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)。

### 验证输出
Prometheus Simple HTTP Server使用/metrics作为默认URL，metrics-prometheus会使用9696作为默认端口，微服务启动后你可以使用http://localhost:9696/metrics 访问它。
使用Prometheus Simple HTTP Server接口发布的数据是Prometheus采集的标准格式：
```text
# HELP ServiceComb Metrics ServiceComb Metrics
# TYPE ServiceComb Metrics untyped
jvm{name="cpuRunningThreads",statistic="gauge",} 45.0
jvm{name="heapMax",statistic="gauge",} 3.786407936E9
jvm{name="heapCommit",statistic="gauge",} 6.12892672E8
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="total",statistic="max",status="200",unit="MILLISECONDS",} 1.0
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="total",statistic="tps",status="200",} 0.4
jvm{name="nonHeapCommit",statistic="gauge",} 6.1104128E7
jvm{name="nonHeapInit",statistic="gauge",} 2555904.0
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="execution",statistic="max",status="200",unit="MILLISECONDS",} 0.0
jvm{name="heapUsed",statistic="gauge",} 2.82814088E8
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="total",statistic="latency",status="200",unit="MILLISECONDS",} 1.0
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="execution",statistic="latency",status="200",unit="MILLISECONDS",} 0.0
jvm{name="heapInit",statistic="gauge",} 2.66338304E8
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="queue",statistic="waitInQueue",} 0.0
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="total",statistic="count",status="200",} 39.0
jvm{name="nonHeapUsed",statistic="gauge",} 5.9361032E7
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="queue",statistic="latency",status="200",unit="MILLISECONDS",} 0.0
servicecomb_invocation_calculator_calculatorRestEndpoint_calculate{role="producer",stage="queue",statistic="max",status="200",unit="MILLISECONDS",} 0.0
```

### 配置Grafana（可选）
如何在Grafana中添加Prometheus作为数据源请参考[这篇文章](https://prometheus.io/docs/visualization/grafana/)。
## 运行效果
配置好Prometheus并启动了微服务之后，就可以打开Prometheus Web界面（默认地址是http://localhost:9090/ ），在Metrics列表中看到ServiceComb开头的Java Chassis Metrics，如下图所示：
![MetricsInPrometheus](/assets/images/MetricsInPrometheus.png)  

为了能够达到更好的查询效果，在Grafana中添加Prometheus作为数据源，通过Grafana查询数据如下图示：

![MetricsInGrafana](/assets/images/MetricsInGrafana.png)  
---
title: "Metrics how integration with prometheus in 1.0.0-m1"
lang: en
ref: metrics
permalink: /users/metrics-integration-with-prometheus-in-1.0.0-m1/
excerpt: "Metrics how integration with prometheus in 1.0.0-m1"
last_modified_at: 2018-1-2T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
Metrics had supported from Java chassis version 0.5.0,in version 1.0.0-m1,we had reconstruction it and add some more features,please checkout the user guide and [release note](https://github.com/apache/incubator-servicecomb-java-chassis/releases) for more information.Also subscribe ServiceComb mail-list(dev-subscribe@servicecomb.incubator.apache.org) and join discussion is welcome.

## Background
[Prometheus](http://www.prometheus.io/) is a opensource open-source monitoring solution like Google Borgmon,also member of [CNCF](https://www.cncf.io/),community is very active.Java chassis metrics support integration with prometheus in 1.0.0-m1,and can use [Grafana](https://grafana.com/) to query metrics data further.

## Integration Principles
We known Java chassis developed by Java,so we use Simple Client in  [prometheus java client](https://github.com/prometheus/client_java) as SDK,the version we use is 0.1.0.  
Prometheus use pull mode collect metrics data,microservice act as producer,we use Simple HTTP Server(also in client java SDK) publish them;  
As an integration(optional) module,the implementation code is in metrics-integration/metrics-prometheus,you can get it's dependency:  
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
So if we import metrics-prometheus,no longer need to add metrics-core dependence.
### Relation between metrics-core Publish
[Metrics in 1.0.0-m1](/users/metrics-in-1.0.0-m1/) had already been mentioned,metrics-core will auto start up a embedded publish interface,so if you had configured rest provider in microservice.yaml like:
```yaml
cse:
  service:
    registry:
      address: http://127.0.0.1:30100
  rest:
    address: 0.0.0.0:8080
```
You can direct get metrics data at http://localhost:8080/metrics ,it will return a entity of org.apache.servicecomb.metrics.common.RegistryMetric,the output is:  
```json
{"instanceMetric":{
"systemMetric":{"cpuLoad":10.0,"cpuRunningThreads":39,"heapInit":266338304,"heapMax":3786407936,"heapCommit":626524160,"heapUsed":338280024,"nonHeapInit":2555904,"nonHeapMax":-1,"nonHeapCommit":60342272,"nonHeapUsed":58673152},
"consumerMetric":{"operationName":"instance","prefix":"servicecomb.instance.consumer","consumerLatency":{"total":0,"count":0,"min":0,"max":0,"average":0.0},"consumerCall":{"total":0,"tps":0.0}},
"producerMetric":{"operationName":"instance","prefix":"servicecomb.instance.producer","waitInQueue":0,"lifeTimeInQueue":{"total":0,"count":0,"min":0,"max":0,"average":0.0},"executionTime":{"total":0,"count":0,"min":0,"max":0,"average":0.0},"producerLatency":{"total":0,"count":0,"min":0,"max":0,"average":0.0},"producerCall":{"total":1,"tps":0.0}}},
"consumerMetrics":{},
"producerMetrics":{"calculator.metricsEndpoint.metrics":{"operationName":"calculator.metricsEndpoint.metrics","prefix":"servicecomb.calculator.metricsEndpoint.metrics.producer","waitInQueue":0,"lifeTimeInQueue":{"total":0,"count":0,"min":0,"max":0,"average":0.0},"executionTime":{"total":0,"count":0,"min":0,"max":0,"average":0.0},"producerLatency":{"total":0,"count":0,"min":0,"max":0,"average":0.0},"producerCall":{"total":1,"tps":0.0}}
}}
```
But use Prometheus Simple HTTP Server provider interface will publish the standard format which prometheus needed:
```text
# HELP Instance Level Instance Level Metrics
# TYPE Instance Level untyped
servicecomb_instance_producer_producerLatency_average 0.0
servicecomb_instance_producer_producerLatency_total 0.0
servicecomb_instance_consumer_producerLatency_count 0.0
...
servicecomb_instance_producer_producerLatency_min 0.0
servicecomb_instance_producer_lifeTimeInQueue_average 0.0
servicecomb_instance_producer_lifeTimeInQueue_count 0.0
servicecomb_instance_system_heap_init 2.66338304E8
# HELP calculator.metricsEndpoint.metrics Producer Side calculator.metricsEndpoint.metrics Producer Side Metrics
# TYPE calculator.metricsEndpoint.metrics Producer Side untyped
servicecomb_calculator_metricsEndpoint_metrics_producer_lifeTimeInQueue_average 0.0
...
servicecomb_calculator_metricsEndpoint_metrics_producer_executionTime_total 0.0
servicecomb_calculator_metricsEndpoint_metrics_producer_waitInQueue_count 0.0
servicecomb_calculator_metricsEndpoint_metrics_producer_lifeTimeInQueue_count 0.0
```
So they are two independent,different for use.   

*Prometheus Simple HTTP Server also use /metrics as default URL,metrics-prometheus will use 9696 as default port,after microservice start up you can get metrics data at http://localhost:9696/metrics .*    
The metrics name in prometheus we replace all dot with underline,because we must follow its [naming rules](https://prometheus.io/docs/practices/naming/).    

## How Configuration
Enable prometheus integration is very easy:
### Global Configuration
Please add prometheus port config in microservice.yaml:  
```yaml 
APPLICATION_ID: demo
service_description:
  name: demoService
  version: 0.0.1

servicecomb:
  metrics:
    prometheus:
      #prometheus provider port
      port: 9696
```
*If do not config,default value is 9696*
### Maven Configuration
We just only need add metrics-prometheus dependency:   
```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>metrics-prometheus</artifactId>
      <version>1.0.0-m1</version>
    </dependency>
```
### Config prometheus.yml in Prometheus
You need add job in prometheus.yml,like:
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
The job_name: 'servicecomb' is our custom job,it will collect metrics data from local microservice localhost:9696,more information about configuration of prometheus can found [here](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).  

### Config Grafana(optional)
How add prometheus as a datasource in grafana can found [here](https://prometheus.io/docs/visualization/grafana/).  
## Effect Show
After complete prometheus config and start up microservice,we can open prometheus web site(default address is http://localhost:9090/),in metrics list java chassis metrics with prefix 'servicecomb' can be seen:
![MetricsInPrometheus](/assets/images/MetricsInPrometheus.png)  

For get more better data query experience,add prometheus as a datasource in grafana then query metrics data by it:  
![MetricsInGrafana](/assets/images/MetricsInGrafana.png)  
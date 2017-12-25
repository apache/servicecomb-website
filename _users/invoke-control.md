---
title: "Invoke Control"
lang: en
ref: invoke-control
permalink: /users/invoke-control/
excerpt: "Invoke Control"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Instance-Level Fault Isolation

### Scenario

In the scenario where some instances fail to be called, the instance-level fault isolation function stops the ServiceComb framework from sending requests to the faulty instance.

### Configuration

This instance-level fault isolation function is integrated into the load balancing function. For configuration of the load balancing policy, see  [Service Configurations](/users/service-configurations/#负载均衡策略). For parameters associated with instance-level fault isolation in the load balancing policy, see table below:

| Configuration Item                       | Default Value | Value Range        | Mandatory | Description                              | Remark |
| :--------------------------------------- | :------------ | :----------------- | :-------- | :--------------------------------------- | :----- |
| cse.loadbalance.isolation.enabled        | false         | Boolean            | No        | Specifies whether to enable faulty instance isolation. | -      |
| cse.loadbalance.isolation.enableRequestThreshold | 20            | Integer            | No        | Specifies the threshold number of instance calls. If this value is reached, isolation is enabled. | -      |
| cse.loadbalance.isolation.errorThresholdPercentage | 20            | Integer, \(0,100\] | No        | Specifies the error percentage. Instance fault isolation is enabled when the set value is reached. | -      |
| cse.loadbalance.isolation.singleTestTime | 10000         | Integer            | No        | Specifies the duration of a faulty instance test on a single node. |        |

## Circuit Break Policy
### Scenario

Circuit brake policy can configure ServiceComb fallback capability, you can configure conditions under which service will stop send request after circuit break policy configured.

### Configuration

Circuit break is part of fallback policy when a service request is abnormal, relevant concept such as isolation and fault tolerance please refer to [fallback policy](/users/service-configurations/#降级策略)。

## Flow Control Policy
### Scenario

You can limit the frequency of request send to specific microservice when flow control was enables in consumer service. 

### Precaution

See detail info at [Service Configurations](/users/service-configurations/#限流策略)。

### Configuration

Flow control policy configuration is in microservice.yaml file. You need to configure consumer handler in chain of service. See example blow:

```yaml
cse:
  handler:
    chain:
      Consumer:
        default: qps-flowcontrol-consumer
```

Configuration items of QPS:

| Configuration Item                       | Default Value         | Value Range             | Mandatory | Description                              | Remark                                   |
| :--------------------------------------- | :-------------------- | :---------------------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| cse.flowcontrol.Consumer.qps.enabled     | true                  | Boolean                 | No        | Specifies whether consumers flowcontrol enables. | -                                        |
| cse.flowcontrol.Consumer.qps.limit.[ServiceName].[Schema].[operation] | 2147483647  (max int) | (0,2147483647], Integer | No        | Specifies number of requests per second. | Support three level configurations: microservice、schema、operation. |


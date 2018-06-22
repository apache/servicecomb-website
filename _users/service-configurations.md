---
title: "Service Configurations"
lang: en
ref: service-configurations
permalink: /users/service-configurations/
excerpt: "Service Configurations"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Load Balancing Policy
### Scenario

　　ServiceComb provides a Ribbon-based load balancing solution. You can configure a load balancing policy in the configuration file. Currently, a load balancing routing policy can be random, sequential, or based on response time weight.

### Configuration

　　Load balancing policies are configured by setting the parameter `servicecomb.loadbalance.[MicroServiceName].[property name]` in the microservice.yaml fiel. If MicroServiceName is not set, the configuration is set for all microservices. Otherwise, the configuration is set for a specific microservice.

　　**Table 1 Configuration items of load balancing policy**

| Configuration Items                      | Default Value                            | Value Range                              | Mandatory | Description                              | Remarks                                  |
| :--------------------------------------- | :--------------------------------------- | :--------------------------------------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| servicecomb.loadbalance.NFLoadBalancerRuleClassName | com.netflix.loadbalancer.RoundRobinRule  | com.netflix.loadbalancer.RoundRobinRule（polling）com.netflix.loadbalancer.RandomRule（random）com.netflix.loadbalancer.WeightedResponseTimeRule（server response time weight）org.apache.servicecomb.loadbalance.SessionStickinessRule（session stickiness） | No        | Specifiles the load balancing policy     | -                                        |
| servicecomb.loadbalance.SessionStickinessRule.sessionTimeoutInSeconds | 30                                       | Integer                                  | No        | Specifies the idle time of a client. If the idle time exceeds the set value, ServiceComb will select another server. | Currently, this parameter cannot be set for a certain microservice. For example, servicecomb.loadbalance.SessionStickinessRule.sessionTimeoutInSeconds cannot be set to servicecomb.loadbalance.DemoService.SessionStickinessRule.sessionTimeoutInSeconds |
| servicecomb.loadbalance.SessionStickinessRule.successiveFailedTimes | 5                                        | Integer                                  | No        | Specifies the number of failed requests from the client. If the number exceeds the set value, ServiceComb will switch to another server | Currently, this parameter cannot be set for a certain microservice. |
| servicecomb.loadbalance.retryEnabled             | FALSE                                    | Boolean                                  | No        | Specifies whether to call a service again when a exception is captured by the load balance. | -                                        |
| servicecomb.loadbalance.retryOnNext              | 0                                        | Integer                                  | No        | Specifies the number of attempts to connect to another server. | -                                        |
| servicecomb.loadbalance.retryOnSame              | 0                                        | Integer                                  | No        | Specifies the number of attempts to connect to the same server. | -                                        |
| servicecomb.loadbalance.isolation.enabled        | FALSE                                    | Boolean                                  | No        | Specifies whether to enable faulty instance isolation. | -                                        |
| servicecomb.loadbalance.isolation.enableRequestThreshold | 20                                       | Integer                                  | No        | Specifies the threshold number of instance calls. If this value is reached, isolation is enabled. | -                                        |
| servicecomb.loadbalance.isolation.errorThresholdPercentage | 20                                       | Integer，\(0,100\]                        | No        | Specifies the error percentage. Instance fault isolation is enabled when the set value is reached. | -                                        |
| servicecomb.loadbalance.isolation.singleTestTime | 10000                                    | Integer                                  | No        | Specifies the duration of a faulty instance test on a single node. | This unit is ms.                         |
| servicecomb.loadbalance.transactionControl.policy | org.apache.servicecomb.loadbalance.filter.SimpleTransactionControlFilter | -                                        | No        | Specifies the offload policies for dynamic routing. | The framework provides simple offload mechanisms. You can also customize offload policies. |
| servicecomb.loadbalance.transactionControl.options | -                                        | key/value pairs                          | No        | Specifies the parameter configured for the SimpleTransactionControlFilter offload policy. You can add any filtration tag for this item. | -                                        |

### Sample Code

　　in the src/main/resources/microservice.yaml file, configure a load balancing policy.

　　Configure a processing link：

```yaml
servicecomb:
  # other configurations omitted
  handler:
    chain:
      Consumer:
        default: loadbalance
  # other configurations omitted
```

　　Add a routing policy:

```yaml
servicecomb：
  # other configurations omitted
  loadbalance:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RoundRobinRule
  # other configurations omitted
```

## Customizing Routing Policies

　　Based on the routing policy framework provided by ServiceComb, you can program to customize routing policies as required. Perform the following steps:

* Encode using the API method defined in the `com.netflix.loadbalancer.IRule` API. Encode in the public Server  choose(Object key) method. LoadBalancerStats is a structure that encapsulates the running state of the load balancer. Determine on which instance the current routing request will be processed based on the running indexes of each instance by using the Server choose(Object key) method. Use method `org.apache.servicecomb.loadbalance.SessionStickinessRule`for instance processing.

* Compile the developed policy and ensure that the generated class is under classpath.

* Use the software development kit(SDK) to configure the routing policy. Use AbcRule as a routing policy example. The configuration is as follows:        `servicecomb.loadbalance.NFLoadBalancerRuleClassName=org.apache.servicecomb.ribbon.rule.AbcRule`

## Rate Limiting Policy
### Scenario

Users at the provider end can use the rate limiting policy to limit the maximum number of requests sent from a specified microservice per second. 

### Precautions

1. There may be a small different between the rate limit and actual traffic.
2. The rate limit function at the provider end is for service rather than security purpose. To prevent distributed denial of service(DDos) attacks, you need to take other measures.
3. Traffic control is a microservice-level rather than process-level function.

### Configuration

　　Rate limiting policies are configured in the microservice.yaml file. For related configuration items, see Table 2. To enable the rate limiting policy at the provider end, you also need to configure the rate limiting handler on the server in the processing chain and add dependencies in the pom.xml file. An example of microservice.yaml file configuration is as follows:

```yaml
servicecomb:
  handler:
    chain:
      Consumer:
        default: qps-flowcontrol-provider
```

　　**Table2 Configuration items of the QPS rate limit**

| Configuration Item                       | Default Value       | Value Range              | Mandatory | Description                              | Remarks                                  |
| :--------------------------------------- | :------------------ | :----------------------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| servicecomb.flowcontrol.Provider.qps.enabled     | true                | true/false               | No        | Specifies whether to enable traffic control  at the provider end. | -                                        |
| servicecomb.flowcontrol.Provider.qps.limit.\[ServiceName\] | 2147483647（max int） | \(0,2147483647\]，Integer | No        | Specifies the number of requests allowed per second. | This parameter can only be configured for microservice |
| servicecomb.flowcontrol.Provider.qps.global.limit | 2147483647（max int） | (0,2147483647\]，Integer  | No        | Specifies the total number of requests allowed per second at the provider end | If no configuration is set for any specific microservices, this parameter takes effect |

## 
## Fallback Policy

### Concept Description

A fallback policy is used when a service request is abnormal.

There are three key concepts in fallback: isolation, fallbreak, and fault tolerance:

* Isolation is an exception detection mechanism. Two common items that need to be detected are timeout duration and the number of concurrent requests.
* Fallbreak is an exception response mechanism, and it depends on isolation. Fallbreak is triggered based on the error rate. Two common items need to set are the number of requests to collect and error rate.
* Fault tolerance is an exception handling mechanism that depends on fallbreak. Fault tolerance is called after a fallbreak. For fault tolerance, you need to set the number of fault tolerance call items.

During fallback, if M(the threshold) errors are detected in N requests, the consumer will no longer send requests  and the fault tolerance mechanism will be enabled. The preceding fallback process is accepted in Netflix Hystrix and helps you configure the parameters. Obtain information about the parameter configuration at [https://github.com/Netflix/Hystrix/wiki/Configuration](https://github.com/Netflix/Hystrix/wiki/Configuration). Currently, ServiceComb provides two types of fault tolerance modes: returning null values and throwing exceptions.

### Scenario

By configuring a fallback policy, you can handler microservice exceptions.

### Configuration

　　Configuration items of fallback policies are as follows:

　　**Table 3 Configuration items of the fallback policy**

| Configuration Item                       | Default value  | Value Range                   | Mandatory | Description                              | Remarks                                  |
| :--------------------------------------- | :------------- | :---------------------------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| servicecomb.isolation.timeout.enabled            | FALSE          | -                             | No        | Specifies whether to enable timeout detection. |                                          |
| servicecomb.isolation.timeoutInMilliseconds      | 30000          | -                             | No        | Specifies the timeout duration threshold. |                                          |
| servicecomb.isolation.maxConcurrentRequests      | 10             | -                             | No        | Specifies the maximum number of concurrent requests. |                                          |
| servicecomb.circuitBreaker.enabled               | TRUE           | -                             | No        | Specifies whether to enable fallbreak.   |                                          |
| servicecomb.circuitBreaker.forceOpen             | FALSE          | -                             | No        | Specifies that fallbreak is enable regardless of the number of failed requests or the error rate. |                                          |
| servicecomb.circuitBreaker.forceClosed           | FALSE          | -                             | No        | Specifies that fallbreak can be implemented at any time. | If this parameter and servicecomb.circuitBreaker.forceOpen both need to be configured, servicecomb.circuitBreaker.forceOpen has priority. |
| servicecomb.circuitBreaker.sleepWindowInMilliseconds | 15000          | -                             | No        | Specifies the duration needed to recover from fallbreak. | After the recovery, the number of failed requests will be recalculated. Not: If the consumer fails to send a request to the provider after the recovery, fallbreak is enabled again. |
| servicecomb.circuitBreaker.requestVolumeThreshold | 20             | -                             | No        | Specifies the threshold of failed requests sent within 10 seconds. If the threshold is reached, fallbreak is triggered. | Ten seconds will be divided into ten 1 seconds, and the error rate is calculated 1 second later after an error occurred. Therefore, fallbreak can be implemented at least 1 second after the call. |
| servicecomb.circuitBreaker.errorThresholdPercentage | 50             | -                             | No        | Specifies the threshold of error rate. If the threshold is reached, fallbreak is triggered. |                                          |
| servicecomb.fallback.enabled                     | TRUE           | -                             | No        | Specifies whether to enable troubleshooting measures after an error occurred. |                                          |
| servicecomb.fallback.maxConcurrentRequests       | 10             | -                             | No        | Specifies the number of fault tolerance(servicecomb.fallbackpolicy.policy) requests concurrently called. If the value exceeds 10, the measures will no longer be called, and exception are returned. |                                          |
| servicecomb.fallbackpolicy.policy                | throwexception | returnnulll \| throwexception | No        | Specifies the error handling policies after an error occurred. |                                          |

**Caution:** Be cautious when setting servicecomb.isolation.timeout.enabled to TRUE, All processes are asynchronously processed in the system, and any error value returned by an intermediate process because the set timeout duration is reached can cause failure of the follow-up processes. Therefore, you are advised to keep the default value FALSE for servicecomb.isolation.timeout.enabled. For timeout duration from the network aspect, you are advised to set servicecomb.request.timeout=30000.
{: .notice--warning}

## Sample Code

```yaml
servicecomb:
  handler:
    chain:
      Consumer:
        default: bizkeeper-consumer
  isolation:
    Consumer:
      timeout:
        enabled: true
      timeoutInMilliseconds: 30000
  circuitBreaker:
    Consumer:
      sleepWindowInMilliseconds: 15000
      requestVolumeThreshold: 20
  fallback:
    Consumer:
      enabled: true
  fallbackpolicy:
    Consumer:
      policy: throwexception
```

> **NOTE:**
>
> You need to enable service governance for fallback, The provider handler is `bizkeeper-provider`, and the consumer handler is `bizkeeper-consumer`. If `Consumer:`/`Provider:` was omitted, your configuration would not work, and service governance would be enabled with default configuration. 

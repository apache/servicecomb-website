---
title: Mersher Service Management
lang: en
ref: mersher-service-management
permalink: /docs/mersher-quick-start-advance/mersher-service-management/
excerpt: Describe how to use the service management capabilities provided by mersher
last_modified_at: 2019-08-08T14:01:43.000Z
---

- Service management is mainly used to effectively control and manage a large number of microservices in distributed systems. This guide will show you how to use the service management capabilities provided by **mersher**.

# Before you start

- Walk through [mersher-quick-start](/docs/mersher-quick-start/) and have **mersher display programs** running.

# Grayscale release

## Configuration

- 1、Change the version number respectively in conf **microservice.yaml** of **mersher-a** and **mersher-b**. Change the **version** field to **1.1.1** and **1.1.2** respectively.Restart the mersher service and you can see that the service version number has changed in servicecenter.

  ![mersher-ser-manage-ver](/assets/images/mersher/mersher-ser-manage-ver.png)

- 2、Change weight options in configuration files router.yaml of mersher-g. Then restart service.

  ```yaml
  routeRule:
  mersher-provider:        #service name
  - precedence: 2        #precedence of route rule
    route:               #route rule list
    - tags:
        version: 1.1.1
      weight: 80        #weight of 80%
    - tags:
        version: 1.1.2
      weight: 20        #weight of 20%
  ```

## Verification

- Click the _Submit_ button repeatedly and you can see that the BMI Instance ID keep changing according to the weight configuration.

# Circuit breaker

## Configuration

- Change the circuit breaker configuration in chassis.yaml of mersher-g.

  ```yaml
  isolation:
    Consumer:
      timeout:
        enabled: true
      timeoutInMilliseconds: 1000            
      maxConcurrentRequests: 1
  circuitBreaker:
    Consumer:
      enabled: true
      forceOpen: false
      forceClosed: false
      sleepWindowInMilliseconds: 10000    
      requestVolumeThreshold: 1          
      errorThresholdPercentage: 1
  fallback:
    Consumer:
      enabled: true
      maxConcurrentRequests: 1
  fallbackpolicy:
    Consumer:
      policy: returnnull
  ```

## Verification

- 1 The circuit breaker of mersher-g takes effect when a negative parameter is passed in.

  ![mersher-circuitbreaker](/assets/images/mersher/mersher-circuitbreaker.png)

  ![mersher-circuitbreaker-ret](/assets/images/mersher/mersher-circuitbreaker-ret.png)

- 2 The service is automatically restored after 10 seconds because of the configuration parameter 'sleepWindowInMilliseconds' take effect.

# What's next

- Read[mersher distributed tracing](/docs/mersher-quick-start-advance/mersher-distributed-tracing/)

- More about [service management](/users/service-configurations/)

---
title: mesher Service Management
lang: en
ref: mesher-service-management
permalink: /docs/mesher-quick-start-advance/mesher-service-management/
excerpt: Describe how to use the service management capabilities provided by mesher
last_modified_at: 2019-08-08T14:01:43.000Z
---

- Service management is mainly used to effectively control and manage a large number of microservices in distributed systems. This guide will show you how to use the service management capabilities provided by **mesher**.

# Before you start

- Walk through [mesher-quick-start](/docs/mesher-quick-start/), [mesher-load-balance](/docs/quick-start-advance/load-balance/) and have **mesher display programs** running.

# Grayscale release

## Configuration

- 1 Change the version number to **1.1.1** and **1.1.2** respectively in conf **microservice.yaml** of two **mesher_calculator** instances. Restart the mesher service and you can see that the service version number has changed in **servicecenter**.

  ![mesher-ser-manage-ver](/assets/images/mesher/mesher-ser-manage-ver.png)

- 2 Change weight options in configuration file router.yaml of mesher_webapp. Then restart service.

  ```yaml
  routeRule:
    calculator:        #service name
      - precedence: 2    #precedence of route rule
        route:           #route rule list
        - tags:
            version: 1.1.1
          weight: 70     #weight of 20%
        - tags:
            version: 1.1.2
          weight: 30     #weight of 20%
  ```

## Verification

- Click the _Submit_ button repeatedly and you can see that the BMI Instance ID keep changing according to the weight configuration.

# Circuit breaker

## Configuration

- 1 Change the circuit breaker configuration in conf chassis.yaml of mesher_webapp.

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

- 2 Stop the service instances in directory test_balance.

## Verification

- 1 The circuit breaker of mesher_webapp takes effect when a negative parameter is passed in. The first picture is the log of **mesher_webapp**. The second picture is the return value when inputing negative parameter. The third picture is the return value when the circuit breaker of mesher_webapp takes effect.

  ![mesher-circuitbreaker](/assets/images/mesher/mesher-circuitbreaker.png)

  ![mesher-circuitbreaker-ret](/assets/images/mesher/mesher-circuitbreaker-ret.png)

  ![mesher-circuitbreaker-ret-nil](/assets/images/mesher/mesher-circuitbreaker-ret-nil.png)

- 2 The service is automatically restored after 10 seconds because of the conf parameter **sleepWindowInMilliseconds**.

# What's next

- Read [mesher distributed tracing](/docs/mesher-quick-start-advance/mesher-distributed-tracing/)

- More about [service management](/users/service-configurations/)

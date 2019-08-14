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

- Walk through [mersher-quick-start](/docs/mersher-quick-start/), [mersher-load-balance](/docs/quick-start-advance/load-balance/) and have **mersher display programs** running.

# Grayscale release

## Configuration

- 1 Change the version number to **1.1.1** and **1.1.2** respectively in conf **microservice.yaml** of two **mersher_calculator** instances. Restart the mersher service and you can see that the service version number has changed in **servicecenter**.

  ![mersher-ser-manage-ver](/assets/images/mersher/mersher-ser-manage-ver.png)

- 2 Change weight options in configuration file router.yaml of mersher_webapp. Then restart service.

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

- 1 Change the circuit breaker configuration in conf chassis.yaml of mersher_webapp.

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

- 1 The circuit breaker of mersher_webapp takes effect when a negative parameter is passed in. The first picture is the log of **mersher_webapp**. The second picture is the return value when inputing negative parameter. The third picture is the return value when the circuit breaker of mersher_webapp takes effect.

  ![mersher-circuitbreaker](/assets/images/mersher/mersher-circuitbreaker.png)

  ![mersher-circuitbreaker-ret](/assets/images/mersher/mersher-circuitbreaker-ret.png)

  ![mersher-circuitbreaker-ret-nil](/assets/images/mersher/mersher-circuitbreaker-ret-nil.png)

- 2 The service is automatically restored after 10 seconds because of the conf parameter **sleepWindowInMilliseconds**.

# What's next

- Read [mersher distributed tracing](/docs/mersher-quick-start-advance/mersher-distributed-tracing/)

- More about [service management](/users/service-configurations/)

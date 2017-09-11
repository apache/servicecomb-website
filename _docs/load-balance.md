---
title: "Load Balance"
lang: en
ref: quick-start-load-balance
permalink: /docs/quick-start-advance/load-balance/
excerpt: "Introduce how to use load balance with ServiceComb in the BMI application"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
When we scale up *BMI calculator service*, requests from *BMI web service* need to distribute equally to each *BMI calculator service*. This guide shows how to use load balance with **ServiceComb** in the BMI application. 

## Before you start

Walk through [Develop microservice application in minutes](/docs/quick-start-bmi/) and have **BMI application** running. 

## Enable

To enable load balance, add the following configurtations in *BMI web service*\'s `microservice.yaml` file:

```yaml
  handler:
    chain:
      Consumer:
        default: loadbalance
```

Restart *BMI web service* .

## Verification

Run one more *BMI calculator service*. Before that, do some changes in *BMI calculator service*\'s source code.

1. Change the service port to avoid port conflict.

   Change `cse.rest.address` from `0.0.0.0:7777` to `0.0.0.0:7778` in `microservice.yaml`.

2. Divide the result of BMI calculation by 2 in `CalculatorServiceImpl.java` for a more obvious result.

   ```java
       double bmi = weight / (heightInMeter * heightInMeter) / 2;
   ```


Run the new *BMI calculator service* . Now you can see the following figures shows up alternately by clicking the *Submit* button.

![Load balance result](/assets/images/load-balance-result.png){: .align-center}

## What's next

* See quick start for [Flow Control](/docs/quick-start-advance/flow-control/)
* Learn more about [Load Balance](/users/load-balance/)

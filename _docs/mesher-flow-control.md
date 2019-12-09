---
title: mesher Flow Control
lang: en
ref: mesher-flow-control
permalink: /docs/mesher-quick-start-advance/mesher-flow-control/
excerpt: Describe how to use the flow control capabilities provided by mesher
last_modified_at: 2019-08-08T14:01:43.000Z
---

- Flow control avoids microservice overload operations by controlling the data transfer rate. This guide will show you how to use the flow control capabilities provided by **mesher**

# Before you start

- Walk through [mesher-quick-start](/docs/mesher-quick-start/) and have **mesher display programs** running.

# Enable

- Change the configuration file **chassis.yaml** of **mesher_calculator**. Add a flow control configuration in **chassis.yaml** as follows. Restart the service.

  ```yaml
  flowcontrol:
   Provider:
     qps:
       enabled: true                 # enable rate limiting or not
       global:
         limit: 0                    # default limit of provider
       limit:
         Server: 0                  # rate limit for request from a provider
  ```

  The frequency limit configuration make the request accepted per second is 0 which means no service is provided.

# Verification

- Click the _Submit_ button and you can see that the request was rejected due to the flow control of mesher. Now the request can not reach real httpserver.

![flow-control-req](/assets/images/mesher/mesher-flow-control-fail.png)

![flow-control-log](/assets/images/mesher/mesher-flow-control-log.png)

# What's next

- See quick start for [Service Management](/docs/mesher-quick-start-advance/mesher-service-management/)

- Learn more about [Flow Control](/users/service-configurations/#限流策略)

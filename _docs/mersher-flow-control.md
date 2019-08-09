---
title: Mersher Flow Control
lang: en
ref: mersher-flow-control
permalink: /docs/mersher-quick-start-advance/mersher-flow-control/
excerpt: Describe how to use the flow control capabilities provided by mersher
last_modified_at: 2019-08-08T14:01:43.000Z
---

- Flow control avoids microservice overload operations by controlling the data transfer rate. This guide will show you how to use the flow control capabilities provided by **mersher**

# Before you start

- Walk through [mersher-quick-start](/docs/mersher-quick-start/) and have **mersher display programs** running.

# Enable

- Change the **mersher-a's** configuration file **chassis.yaml**. Add a flow control configuration in **chassis.yaml** as follows. Restart the service.

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

- Click the _Submit_ button and you can see that the request was rejected due to the flow control of mersher. Now the request can't reach real httpserver.

![flow-control-req](/assets/images/mersher/mersher-flow-control-fail.png)

![flow-control-log](/assets/images/mersher/mersher-flow-control-log.png)

# What's next

- See quick start for [Service Management](/docs/mersher-quick-start-advance/mersher-service-management/)

- Learn more about [Flow Control](/users/service-configurations/#限流策略)

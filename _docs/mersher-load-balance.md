---
title: Mersher Load Balance
lang: en
ref: mersher-load-balance
permalink: /docs/mersher-quick-start-advance/mersher-load-balance/
excerpt: Describe how to use the load balancing capabilities provided by Mersher
last_modified_at: 2019-08-08T14:01:43.000Z
---

- Mersher supports flexible load balancing algorithms. This guide will show you how to use the load balancing capabilities provided by **mersher**.

# Foreword

- Walk through [mersher-quick-start](/docs/mersher-quick-start/) and have **mersher display programs** running.

# Enable

- The **Roundbin** load balancing algorithm is used by default and the **Random**, SessionStickiness load balancing algorithms are also supported. We configure the load balancing method **Random** by modifing **mersher-g's** configuration file chassis.yaml.

  ```yaml
  loadbalance:
    strategy:
      name: Random
  ```

# Verification

- Multiple clicks the _Submit_ button and we can see that the BMI Instance ID in the following two interfaces appear randomly.

  ![mersher-test-httpgo](/assets/images/mersher/mersher-testgohttp.png)<br>

  ![mersher-test-httppy](/assets/images/mersher/mersher-testpythonhttp.png)

## What's next

- See quick start for [Flow Control](/docs/mersher-quick-start-advance/mersher-flow-control/)

- Learn more about [Load Balance](/users/service-configurations/#负载均衡策略)

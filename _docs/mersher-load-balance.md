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

- You can start a new **mersher_calculator** and **httpserver_calculator** instance for load balancing testing by using the program in example directory [test_balance](https://github.com/apache/servicecomb-mesher/tree/master/examples/quick_start/test_balance)

- 1 Change the **service name** in file **microservice.yaml** to **calculator**. Change the listening address and port in file **chassis.yaml** to avoid conflicts.

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40102
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30108
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30109
  ```

- 2 Start running mersher_calculator by cmd:

  ```bash
  export SPECIFIC_ADDR=127.0.0.1:4537
  ./mersher
  ```

- 3 The **Roundbin** load balancing algorithm is used by default and the Random, SessionStickiness load balancing algorithms are also supported. We configure the load balancing method **Random** by modifing configuration file chassis.yaml of **mersher_webapp**.

  ```yaml
  loadbalance:
    strategy:
      name: Random
  ```

- 4 Run a new services instance of **httpserver_calculator** which is listenning on port 4537.

# Verification

- Multiple clicks the _Submit_ button and we can see that the BMI Instance ID in the following two interfaces appear randomly.

  ![mersher-test-httppy1](/assets/images/mersher/mersher-testpythonhttp.png)<br>

  ![mersher-test-httppy2](/assets/images/mersher/mersher-testpythonhttp2.png)

## What's next

- See quick start for [Flow Control](/docs/mersher-quick-start-advance/mersher-flow-control/)

- Learn more about [Load Balance](/users/service-configurations/#负载均衡策略)

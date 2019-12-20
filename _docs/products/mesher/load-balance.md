---
title: Load Balance
lang: en
ref: load-balance
permalink: /docs/products/mesher/load-balance/
excerpt: Describe how to use the load balancing capabilities provided by mesher
last_modified_at: 2019-08-08T14:01:43.000Z
---

- mesher supports flexible load balancing algorithms. This guide will show you how to use the load balancing capabilities provided by **mesher**.

# Foreword

- Walk through [mesher-quick-start](/docs/products/mesher/quick-start/) and have **mesher display programs** running.

# Enable

- You can start a new **mesher_calculator** and **httpserver_calculator** instance for load balancing testing by using the program in example directory [test_balance](https://github.com/apache/servicecomb-mesher/tree/master/examples/quick_start/test_balance)

- 1 Change the **service name** in file **microservice.yaml** to **calculator**. Change the listening address and port in file **chassis.yaml** to avoid conflicts.

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40102
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30108
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30109
  ```

- 2 Start running mesher_calculator by cmd:

  ```bash
  export SPECIFIC_ADDR=127.0.0.1:4537
  ./mesher
  ```

- 3 The **Roundbin** load balancing algorithm is used by default and the Random, SessionStickiness load balancing algorithms are also supported. We configure the load balancing method **Random** by modifing configuration file chassis.yaml of **mesher_webapp**.

  ```yaml
  loadbalance:
    strategy:
      name: Random
  ```

- 4 Run a new services instance of **httpserver_calculator** which is listenning on port 4537.

# Verification

- Multiple clicks the _Submit_ button and we can see that the BMI Instance ID in the following two interfaces appear randomly.

  ![mesher-test-httppy1](/assets/images/mesher/mesher-testpythonhttp.png)<br>

  ![mesher-test-httppy2](/assets/images/mesher/mesher-testpythonhttp2.png)

## What's next

- See quick start for [Flow Control](/docs/products/mesher/flow-control/)

- Learn more about [Load Balance](/docs/users/service-configurations/#load-balancing-policy)

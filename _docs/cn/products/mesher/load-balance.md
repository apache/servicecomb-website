---
title: 负载均衡
lang: cn
ref: load-balance
permalink: /cn/docs/products/mesher/load-balance/
excerpt: 介绍如何在体质指数应用中使用mesher提供的负载均衡能力
last_modified_at: 2019-08-08T14:01:43.000Z
---

- mesher支持灵活的负载均衡算法。本指南将展示如何使用 **mesher** 提供的负载均衡能力。

# 前言

- 在您进一步阅读之前，请确保您已阅读了[mesher快速入门](/cn/docs/products/mesher/quick-start/)，并已成功运行用例服务。

# 负载均衡算法

- 启动一个新的**mesher_calculator**和**httpserver_calculator**实例用于负载均衡测试，可以使用例子目录[test_balance](https://github.com/apache/servicecomb-mesher/tree/master/examples/quick_start/test_balance)下的服务：
- 1、修改mesher_calculator配置文件**microservice.yaml**中的服务name为**calculator**；<br>
  更改配置**chassis.yaml**监听的地址和端口避免冲突：

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40102
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30108
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30109
  ```

- 2、 启动**mesher_calculator**，需要设置mesher_calculator的**SPECIFIC_ADDR**地址，该地址用于将mesher和http服务绑定起来；

  ```bash
    export SPECIFIC_ADDR=127.0.0.1:4537
    ./mesher
  ```

- 3、 默认情况下会使用roundbin（轮询）负载均衡算法，另外还支持Random和SessionStickiness负载均衡算法。 我们修改mesher_webapp的配置文件chassis.yaml，将负载均衡方法配置为Random：

  ```bash
  loadbalance:
    strategy:
      name: Random
  ```

- 4、 开启httpserver_calculator服务新实例，监听4537端口；

- 5、 此时点击 _Submit_ 按钮就可以看到如下两个界面中的BMI Instance ID随机出现。

  ![bmi测试初始化图1](/assets/images/mesher/mesher-testpythonhttp.png)<br>

  ![bmi测试初始化图2](/assets/images/mesher/mesher-testpythonhttp2.png)

# 下一步

- 阅读[流量控制快速入门](/cn/docs/products/mesher/flow-control/)

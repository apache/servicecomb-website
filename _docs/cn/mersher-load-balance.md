---
title: 负载均衡
lang: cn
ref: mersher-load-balance
permalink: /cn/docs/mersher-quick-start-advance/mersher-load-balance/
excerpt: 介绍如何在体质指数应用中使用mersher提供的负载均衡能力
last_modified_at: 2017-09-03T14:01:43.000Z
---

- mersher支持灵活的负载均衡算法。本指南将展示如何使用 **mersher** 提供的负载均衡能力。

# 前言

- 在您进一步阅读之前，请确保您已阅读了[mersher快速入门](/cn/docs/mersher-quick-start/)，并已成功运行用例服务。

# 负载均衡算法

- 1、默认情况下会使用roundbin（轮询）负载均衡算法，另外还支持Random和SessionStickiness负载均衡算法。 我们将负载均衡方法配置为Random，修改mersher-g的配置文件chassis.yaml：

  ```bash
  loadbalance:
    strategy:
      name: Random
  ```

- 2、此时点击 _Submit_ 按钮就可以看到如下两个界面中的BMI Instance ID随机出现。

  ![bmi测试初始化图](/assets/images/mersher/mersher-testgohttp.png)<br>

  ![bmi测试初始化图](/assets/images/mersher/mersher-testpythonhttp.png)

# 下一步

- 阅读[流量控制快速入门](/cn/docs/mersher-quick-start-advance/mersher-flow-control/)

- 了解更多[负载均衡](/cn/users/service-configurations/#负载均衡策略)的使用方式

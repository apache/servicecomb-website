---
title: 流量控制
lang: cn
ref: mersher-flow-control
permalink: /cn/docs/mersher-quick-start-advance/mersher-flow-control/
excerpt: 介绍如何在体质指数应用中使用ServiceComb框架提供的流量控制能力
last_modified_at: 2017-09-03T14:01:43.000Z
---

- 流量控制通过控制数据传输速率来避免微服务过载运行。本指南将展示如何使用 **mersher** 提供的流量控制能力。

# 前言

- 在您进一步阅读之前，请确保您已阅读了[mersher快速入门](/cn/docs/mersher-quick-start/)，并已成功运行用例服务。

# 开启

- 添加流量控制配置，重启服务，更改**mersher-a**配置文件**chassis.yaml**，其中流量控制包含下列选项：

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

  该频率限制标识每秒接受的请求为0，即不提供服务。

# 验证

- 点击 _Submit_ 按钮，此时能看到由于流控受限而请求被拒的界面，请求已经无法到达httpserver。

  ![流量控制效果图](/assets/images/mersher/mersher-flow-control-fail.png)

  ![流量控制效果图](/assets/images/mersher/mersher-flow-control-log.png)

# 下一步

- 阅读[服务治理快速入门](/cn/docs/mersher-quick-start-advance/mersher-service-management/)

- 了解更多[流量控制](/cn/users/service-configurations/#限流策略)的使用方式

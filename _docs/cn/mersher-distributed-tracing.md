---
title: 分布式调用链追踪
lang: cn
ref: mesher-distributed-tracing
permalink: /cn/docs/mesher-quick-start-advance/mesher-distributed-tracing/
excerpt: 介绍如何在体质指数应用中使用ServiceComb提供的分布式追踪能力
last_modified_at: 2019-08-08T14:01:43.000Z
---

- 分布式调用链追踪提供追溯微服务调用关系和调用处理时延的能力，便于用户检查分布式环境中微服务的健康状态。本指南将展示如何使用 **mesher** 提供的分布式调用链追踪能力。

# 前言

- 在您进一步阅读之前，请确保您已阅读了[mesher快速入门](/cn/docs/mesher-quick-start/)，并已成功运行用例服务。

# 启用

- 1、mesher main文件中添加对zipkin库依赖：

  ```bash
  _ "github.com/go-chassis/go-chassis-plugins/tracing/zipkin"
  ```

- 2、启发器bootstrap.go中添加默认处理函数，如图中箭头所示：

  ![流量控制效果图](/assets/images/mesher/mesher-tracing-func.png)

- 3、重新编译，分别替换**mesher_webapp**和**mesher_calculator**的可执行文件，启动mesher服务；

- 4、使用**Docker**运行[Zipkin分布式追踪服务](http://servicecomb.apache.org/cn/docs/quick-start-advance/distributed-tracing/)

  ```bash
  docker run -d -p 9411:9411 openzipkin/zipkin
  ```

- 5、多次点击 _Submit_ 按钮发起服务调用；

- 6、打开 <http://192.168.88.64:9411>可查看分布式追踪结果如图，可以通过host地址判断调用路径：

  ![分布式追踪效果图](/assets/images/mesher/mesher-tracing-30111.png)

# 下一步

- 了解更多[分布式调用链追踪](/cn/users/distributed-tracing/)

- 阅读[基于 ServiceComb 和 Zipkin 的分布式调用链追踪](/cn/docs/tracing-with-servicecomb/)来进一步了解分布式追踪

- 认识 [**ServiceComb** 微服务开发框架](/cn/users/)

- 通过 [Company应用](/cn/docs/linuxcon-workshop-demo/) 更深入地了解微服务开发

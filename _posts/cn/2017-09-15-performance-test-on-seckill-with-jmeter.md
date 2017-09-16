---
title: "使用JMeter对秒杀示例进行性能测试"
lang: cn
ref: performance-test-on-seckill-with-jmeter
permalink: /cn/docs/performance-test-on-seckill-with-jmeter/
excerpt: "介绍如何使用JMeter进行性能测试以及获取秒杀示例的性能基线"
last_modified_at: 2017-09-15T09:00:00+08:00
author: Yangyong Zheng
redirect_from:
  - /theme-setup/
---

## 背景
　　[秒杀](https://github.com/ServiceComb/seckill)是我们ServiceComb开源团队以领域驱动设计（[DDD](https://en.wikipedia.org/wiki/Domain-driven_design)）为背景，从零开始构建一个微服务架构的示例项目；在《秒杀开发历程》系列博文中提到它作为一个高并发压力场景的应用，采用了[CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)模式构建，因此我们将使用[JMeter](http://jmeter.apache.org/)来对其进行性能评估。

## 制定用户行为模型
　　因为秒杀的场景在现实生活中非常常见，所以用户行为模型非常容易设计：  
1. 客户不停的刷秒杀活动，直到刷出一个正在进行的秒杀活动；  
2. 刷出了秒杀活动后，马上请求秒杀优惠券；  
3. 无论是否成功，客户会稍后查询一次自己已经拥有的优惠券确定优惠券是否进入自己的账号。

　　我们还需要一个管理员用户，隔一段时间就创建发布秒杀活动，当然活动包含的优惠券数量将会远少于客户的数量。
　　
　　用户行为模型在JMeter中体现为脚本逻辑，完成的脚本逻辑如下：

![图1 脚本模型](/assets/images/performance-test-on-seckill-with-jmeter-script.png){: .align-center}

　　脚本文件已经托管至秒杀项目中，可直接获取：

```bash
git clone https://github.com/ServiceComb/seckill
cd seckill/performance-test/script
```

## 性能测试环境
　　我们调来了两台云服务器进行性能测试，角色和配置如下：
### 秒杀服务器配置
　　承载秒杀示例所有的微服务和中间件，包括四个微服务（Admin、Command、Event和Query）、两个数据库（ReadDB和WriteDB）和一个Message Broker（ActiveMQ）。

| 配置项  | 配置值                            |
| ---- | ------------------------------ |
| CPU  | Intel Xeon E5-2690 3.0GHz * 16 |
| MEM  | 64GB                           |
| OS   | Ubuntu 16.04.2 LTS             |

　　为了能够便于配置和启动示例系统，我们采用《秒杀开发历程（三）》中的一键启动模式拉起所有的服务，因此Docker升级为当前最新版17.06.2-ce，能够支持配置Container使用CPU和内存的大小限制，以Admin微服务为例：
　　
```yaml
  admin-service:
    mem_limit: 4096m
    cpu_count: 4
    cpu_percent: 50
    image: "seckill-admin-service:0.2.0-SNAPSHOT"
    hostname: admin-service
    links:
      - "mysql-write-db:write_db.servicecomb.io"
    environment:
      - JAVA_OPTS=-Dspring.profiles.active=prd -Dendpoints.shutdown.enabled=true
    ports:
      - "8081:8081"
```

### 加压机配置
　　加压机与秒杀服务器处于同一网络环境中，配置如下：
　　
| 配置项  | 配置值                            |
| ---- | ------------------------------ |
| CPU  | Intel Xeon E5-2690 3.0GHz * 16 |
| MEM  | 32GB                           |
| OS   | Ubuntu 16.04.2 LTS             |

## 启动测试
　　我们设定测试场景为200客户，每隔1秒启动一个新客户；1个管理员每隔10秒发布1个秒杀活动，一共发布160次，每个秒杀活动包含50张优惠券，即一共投放8000张优惠券。整个测试持续半个小时。
　　
　　现在，我们切换到性能测试脚本目录下，执行下面的命令启动测试：
　　
```bash
jmeter -n -t seckill.jmx -l log.jtl
```

## 测试结果
　　测试完毕后通过下面的命令分析测试结果日志数据，请将<report folder>替换为你的本地目录：

```bash
jmeter -g log.jtl -o <report folder>
```

　　我们需要先验证测试结果的正确性，查看数据统计图：

![图2 事务统计](/assets/images/performance-test-on-seckill-with-jmeter-statistics.png){: .align-center}

　　其中秒杀的失败率在96.45%，原因是Query对于活动的秒杀活动采用的是0.5秒刷新缓存的策略，在活动中的优惠券被秒杀一空下架前，短暂的时间内仍然能够查询到这个活动；架构中采用的[CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)模式只能保证最终一致性，并不能保证实时一致性。
　　
　　成功秒杀的次数为225264 - 217264 = 8000，正好等于我们设定的优惠券投放量，其他事务的失败率均为0%，因此测试结果正确。

### 吞吐能力
　　秒杀整体吞吐能力如下图：

![图3 整体吞吐能力](/assets/images/performance-test-on-seckill-with-jmeter-tps-all.png){: .align-center}

　　可以看到查询活跃的秒杀活动（刷券）事务处理量最高，稳定在4000左右，其他因为业务比例的原因较低，去掉查询活跃的秒杀活动事务后如下图：

![图4 秒杀和优惠券查询](/assets/images/performance-test-on-seckill-with-jmeter-tps-less.png){: .align-center}

　　秒杀和优惠券查询之间的差值是由于存在秒杀失败造成的，我们的用户行为模型是无论秒杀成功与否都会进行一次优惠券查询。

### 响应时间
　　事务的响应时间我们可以看下面两个图：

![图5 响应时间](/assets/images/performance-test-on-seckill-with-jmeter-latencies.png){: .align-center}

![图6 响应时间分布](/assets/images/performance-test-on-seckill-with-jmeter-time-percentiles.png){: .align-center}

　　75%的事务处理时间都在10ms以下，整体平均响应时间处于50ms以下。

## 瓶颈分析
　　依据执行过程中对于测试资源的观察，加压机CPU使用率基本已满（200线程并发），服务器CPU使用率低于20%，其他资源使用率很低。

## 总结
　　通过这次性能测试，我们得知秒杀示例在使用一台普通服务器配置能够达到总体5000以上的TPS还能够保持较低的资源使用率，表现出良好的性能；未来我们会将秒杀示例部署在K8S群集中并配置弹性伸缩进行压力测试，您可以阅读我们[《在Kubernetes集群中使用JMeter对Company示例进行压力测试》](http://servicecomb.io/cn/docs/stress-test-on-company-with-jmeter-in-k8s/)这篇文章展望。
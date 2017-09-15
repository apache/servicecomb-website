---
title: "秒杀开发历程（三）"
lang: cn
ref: seckill-develop-course-part-III
permalink: /cn/docs/seckill-develop-course-part-III/
excerpt: "介绍如何使用敏捷开发模式一步一步构建秒杀项目的过程"
last_modified_at: 2017-09-13T09:00:00+08:00
author: Yangyong Zheng
redirect_from:
  - /theme-setup/
---

　　[上文]({{ site.url }}{{ site.baseurl }}/cn/docs/seckill-develop-course-part-II/) 中我们已经构建了一个完整功能的秒杀系统，版本定为0.1.0-RELEASE；您应该发现，数据的持久化集中在单一的数据库上，秒杀作为一个高并发压力的场景，这种架构很难适应可扩展的要求，并且正如我们一开始就提到的，微服务推荐拥有独立的存储，所以本篇开始我们将配合Event Sourcing实现CQRS模式，以增强应对大规模并发压力的能力。

## CQRS
　　[CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs) 的含义是命令查询职责分离（Command Query Responsibility Segregation），是一种常用的程序设计模式，常常与Event Sourcing一起使用，关于CQRS有一张科普的图，来源于Microsoft MSDN：

![图1 CQRS](/assets/images/seckill-develop-course-part-III-cqrs.png){: .align-center}


## 改进设计
　　[CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)是读写分离以及消息驱动的最佳实践，现在我们把目光聚焦在原来的MySQL数据库上：  
1. 数据库应该被拆分为ReadDB和WriteDB，分别承载读密集的Query微服务和写密集的Command微服务；  
2. ReadDB和WriteDB之间采用Event Message驱动方式完成数据同步，因此我们还需要引进一个新的微服务，我们将它命名为Event（Processor）微服务；  
3. Message Broker目前有很多非常棒的方案，例如RabbitMQ、Kafka等，由于我们的秒杀系统基于ServiceComb和Spring Boot，为了能够快速构建这个新特性，我们选用内置的ActiveMQ，它支持内存队列模式，非常容易构建测试，符合我们敏捷开发的方式。  
    改进完成后的架构如下图：

![图2 改进架构](/assets/images/seckill-develop-course-part-III-arch.png){: .align-center}

## 功能实现
### 数据库拆分
#### WriteDB
　　Admin微服务维护Promotion实体；  
　　Command微服务写入Event值对象，当恢复Promotion的时候，Relapy Event。  
#### ReadDB
　　Event微服务写入ActivePromotion值对象和Coupon值对象；  
　　Query微服务查询ActivePromotion值对象和Coupon值对象。

### Command微服务Message Publisher组件
　　之前的版本由于没有引入Event Sourcing，Event实体只需要直接写入数据库即可，现在需要将Event发布给Message Broker，为了支持云服务（[华为云](http://www.hwclouds.com/)）提供的分布式消息服务，我们定义了通用消息发布接口：

```java
public interface SecKillMessagePublisher {
  void publishMessage(String messageContent);
}
```

### Event微服务的实现
　　Event微服务订阅Message Broker获取Event Message，然后根据不同的Event类型，转化为对ReadDB中的值对象操作或Coupon值对象操作：  
* Promotion Start Message：创建ActivePromotion值对象；  
* Promotion Finish Message：删除对应PromotionId的ActivePromotion值对象；  
* Coupon Grabbed Message：创建Coupon值对象；

　　同样，为了支持云服务（[华为云](http://www.hwclouds.com/)）提供的分布式消息服务，我们定义了通用消息订阅接口：

```java
public interface SecKillMessageSubscriber {
  void subscribeMessage(String messageContent);
}
```

### Query微服务的重构
　　经过了读写分离的改造，现在所有活跃的Promotion都保存在ActivePromotion值对象表中，而客户成功秒杀的Coupon都保存在Coupon值对象表中，因此直接查询即可，不再需要Replay Event。

## 一键启动
　　现在，我们完成了完整的Event Sourcing架构改造，为了能够方便启动，我们提供了编排好的脚本，使用Docker Compose将所有服务一条指令全部拉起来，具体的操作请参见[SecKill](https://github.com/ServiceComb/seckill)。

### 在Docker ToolBox中启动的SecKill

![图3 SecKill All-in-One](/assets/images/seckill-develop-course-part-III-seckill-all-in-one.png){: .align-center}

## 参考资料
https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs  
https://msdn.microsoft.com/en-us/library/jj591559.aspx  
https://martinfowler.com/eaaDev/EventSourcing.html  

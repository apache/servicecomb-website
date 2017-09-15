---
title: "秒杀开发历程（一）"
lang: cn
ref: seckill-develop-course-part-I
permalink: /cn/docs/seckill-develop-course-part-I/
excerpt: "介绍如何使用敏捷开发模式一步一步构建秒杀项目的过程"
last_modified_at: 2017-09-13T09:00:00+08:00
author: Yangyong Zheng
redirect_from:
  - /theme-setup/
---

## 概述
　　秒杀是我们ServiceComb开源团队以领域驱动设计（[DDD](https://en.wikipedia.org/wiki/Domain-driven_design)）为背景，如何从零开始构建一个微服务架构的示例项目。在这个过程中，您可以学习到微服务架构区别于传统单体程序架构的诸多特点，同时我们还将使用敏捷开发的模式快速构建它。

## 背景
　　秒杀的需求起源于互联网常见的促销方式——支付订单的时候，我们可以支持使用优惠券获得一些折扣，由于优惠券的数量是非常有限的，所以我们必须提供一个平台，让每一位希望得到它的人公平竞争，这样的场景我相信在平日的生活中随处可见。

　　由于秒杀是一个示例项目，所以我们不希望它太复杂，真实的秒杀活动需要考虑的细节要远远超过我们的想象；我们也不希望它太过于具体在特定的形式，例如优惠券、满减、抢购码，等等，这样总会让部分读者难以理解；最后，我们使用了先到先得这种最原始的策略，如果您想尝试其他策略，可以下载代码自行修改，我相信也不会太困难。

## 初次设计
　　首先我们分析客户核心业务述求：  

1. 客户可以请求秒杀一张优惠券，系统返回获取优惠券成功或失败（已经被秒光了）；  
2. 客户可以查询自己目前有多少张优惠券；  

　　那么我们开始吧，等等，您说这个描述也太简单了？客户还没有登录系统呢，秒杀活动又是怎么来的，怎么开始的？客户是请求哪个活动的优惠券呀？折扣是不是不一样？还有…… 

　　确实，我们习惯于在一开始就思考很多，一些较大的系统，可能设计阶段就要几个月，但是这次可以不用考虑太多，因为我认为：  
1. 设计太多并不能保证构建完毕后就一定能完全符合需求，唯一不变的就是需求总是变化，所以不要过度设计；  
2. 微服务架构的原则是组件（服务）提供较为单一的功能，所以每个组件所需要实现的功能范围比较小，不必先将所有的功能都设计出来；  
3. 应该尽快切入主题，也就是立刻去解决核心域的问题。

　　现在，我们需要使用正确的“姿势”完成设计过程——遵循领域驱动设计（[DDD](https://en.wikipedia.org/wiki/Domain-driven_design)）的诸多原则，设计过程的核心就是识别出实体、值对象和服务等元素，进一步寻找聚合；由于我们的需求非常简单，所以很容易就能将它们找出来：  
*  实体：促销秒杀（Promotion）  
*  值对象：优惠券（Coupon），促销秒杀事件（PromotionEvent）  
*  领域服务：秒杀活动（SecKill）

　　之后我们分析他们之间的聚合，分出两个微服务，为了能快速达到目的，它们之间直接使用MySQL共享数据（微服务推荐使用独立的存储，我们未来去改造）：  
1. Command：SecKill领域服务；  
2. Query： Coupon值对象查询

![图1 初次架构](/assets/images/seckill-develop-course-part-I-arth.png){: .align-center}

## 功能实现
　　秒杀的代码托管在[Github](https://github.com/ServiceComb/seckill)，欢迎Watch和Star。

### Command微服务的实现
　　我们设计了SecKillCommandService和SecKillPersistentRunner两个类分别完成秒杀处理和结果持久化，考虑到持久化速度慢，我们使用BlockQueue做缓存；另外设计了SecKillCommandRestController作为客户请求的Endpoint；ServiceComb支持多种编程模型和通信模型，我们使用目前较较为流行的Spring Boot Rest作为基础框架，如果您的程序也使用了它，那么只需要稍加调整即可无缝上云。

![图2 Command微服务组件](/assets/images/seckill-develop-course-part-I-command.png){: .align-center}

## Query微服务的实现
　　查询逻辑较简单，因为PromotionEvent是值对象，我们使用了PromotionEvent推导Coupon，各位看官读读代码就明白了。

## 构建支撑域
　　Promotion是实体，诚然，就像一开始提到的，我们需要在另外一个领域去管理（构建）它才能开始后面的秒杀活动，由于我们直接切入核心域展开工作，支撑域和普通域部分目前我们通过Spring注入固定对象来完成，例如：

![图3 支撑域注入](/assets/images/seckill-develop-course-part-I-spring.png){: .align-center}

## 功能验证
　　最后，我们使用PostMan体验完成的功能，请注意Body的填写使用JSON格式，并且类型选择JSON(application/json)：
### 请求秒杀

![图4 请求秒杀](/assets/images/seckill-develop-course-part-I-request-seckill.png){: .align-center}

### 查询拥有的优惠券

![图5 查询拥有的优惠券](/assets/images/seckill-develop-course-part-I-query-coupons.png){: .align-center}
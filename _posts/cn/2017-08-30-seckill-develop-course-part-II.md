---
title: "秒杀开发历程（二）"
lang: cn
ref: seckill-development-journey-part-II
permalink: /cn/docs/seckill-development-journey-part-II/
excerpt: "介绍如何一步一步构建秒杀项目的过程"
last_modified_at: 2017-09-13T09:00:00+08:00
author: Yangyong Zheng
redirect_from:
  - /theme-setup/
---

　　[上文]({{ site.url }}{{ site.baseurl }}/cn/docs/seckill-development-journey-part-I/) 中我们构建了一个仅具有核心功能的秒杀框架，本篇中我们会逐步完善一些功能，使得它具备完整的基础功能。

## 问题点（完善范围）
　　回顾设计和参照已完成的部分，我们可以发现：  
1. 没有提供Promotion实体的服务（Promotion是固定通过Spring注入的）；  
2. 缺乏一些基本的业务检查和功能，包括：  
 * 同一个客户在同一个Promotion中只能秒杀一次（不允许重复）  
 * 同时可以有多个Promotion进行（折扣不同，数量也不同）  
3. 如果Command微服务故障，再次恢复后，需要恢复未完成正在进行中的秒杀活动。  

　　也许您会说，客户管理和客户登录为什么没有罗列出来？的确，客户在我们的场景中是不可或缺的，但是我们为了简化设计，没有包含登录以及请求认证的内容，如果对这方面感兴趣您可以移步到ServiceComb的Company示例实现了一个简单基于token的认证方式，地址在[Company](https://github.com/ServiceComb/ServiceComb-Company-WorkShop)。

## 再次设计
　　对于实体，领域驱动设计（[DDD](https://en.wikipedia.org/wiki/Domain-driven_design)）推荐使用独立接口，因此我们设计一个新的Admin微服务来提供服务：

![图1 增加了Admin微服务后的架构](/assets/images/seckill-develop-course-part-II-arth.png){: .align-center}

## 功能实现
### Admin微服务的实现
　　Admin微服务紧紧围绕Promotion实体提供服务，我们完全可以映射到对应的REST方式，即：
* 新增Promotion对应Post；　　
* 修改Promotion对应Put；　　
* 查询Promotion对应Get；　　
* 删除Promotion对应Delete。　　

　　满足当前的需求只需要完成Post和Put就可以了，另外，考虑到已经开始的秒杀活动不应该能修改，我们增加了对应的检查逻辑。

### 检查和功能的实现
　　通过增加一个HashSet检查客户是否重复秒杀成功；  
　　构建SecKillPromotionBootstrap作为Promotion启动的管理器用于支持多个Promotion同时进行，将SecKillCommandService和SecKillPersistentRunner使用集合管理。

### Command微服务故障恢复的实现
　　构建SecKillRecoveryService处理Promotion恢复检查，未完成的Promotion无论是未开始的还是进行中的，都需要它完成检查返回正确的恢复信息，信息包括剩余券数、已秒杀成功的客户列表等。

## 功能验证
　　最后，我们使用PostMan体验完成的功能，请注意Body的填写使用JSON格式，并且类型选择JSON(application/json)：
### 创建秒杀活动

![图2 创建秒杀活动](/assets/images/seckill-develop-course-part-II-create-promotion.png){: .align-center}

### 查询正在进行的秒杀活动

![图3 查询正在进行的秒杀活动](/assets/images/seckill-develop-course-part-II-query-active-promotion.png){: .align-center}

### 拒绝重复秒杀

![图4 拒绝重复秒杀](/assets/images/seckill-develop-course-part-II-reject-duplicate-grab.png){: .align-center}

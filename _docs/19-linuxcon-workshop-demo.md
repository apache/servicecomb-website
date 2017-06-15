---
title: "Linux Con Workshop Demo"
permalink: /docs/linuxcon-workshop-demo/
excerpt: "A step by step guide on how to use ServiceComb to develop a complete project"
last_modified_at: 2017-06-15T09:38:43+08:00
redirect_from:
  - /theme-setup/
---

为了读者能更容易了解ServiceComb的功能以及如何用其快速开发微服务，所以提供大家耳熟能详的例子，降低学习曲线的同时，增加趣味性，加深理解。

假如我们成立了一家科研公司，处理复杂的数学运算，以及尖端生物科技研究，并为用户提供如下服务：
* 黄金分割数列计算
* 蜜蜂繁殖规律 (计算每只雄蜂/雌蜂的祖先数量)

但是我们如何将公司的这些强大运算能力提供给我们的消费者呢？

{% include toc %}

## 业务场景
让我们先对业务场景进行总结
1. 为了公司持续发展，我们需要对用户消费的运算能力收费，所以我们聘用了*门卫*认证用户，避免不法分子混入
1. 为了提供足够的黄金分割数量运算能力，我们需要雇佣相应的*技工*
1. 为了持续研究蜜蜂繁殖规律，公司建立了自己的蜂场，需要相应的*养蜂人*进行管理研究
1. 为了平衡*技工*、*养蜂人*、和*门卫*的工作量和时间，我们建立了*告示栏*机制，让当前有闲暇的人员发布自己的联系方式，以便我们能及时联系技能匹配的人员以服务到来的用户
1. 因为运算能力成本高昂，我们将运算项目进行了*归档*，以便未来有相同请求时，我们能直接查询*项目归档*，节省公司运算成本
1. 面对上述复杂的场景，我们又聘用了*部门经理*来管理公司成员和设施
1. 最后，当公司日益壮大，用户数量暴涨时，我们还需要招聘更多*技工*、*养蜂人*、和*门卫*，所以增加了*人力资源*部门

## 公司结构 (系统架构)
到现在业务场景已经比较清晰，我们把上述职务部门和设施画成公司组织结构图。
![company structure]({{ site.url }}{{ site.baseurl }}/assets/images/workshop-company-structure.png){: .align-center}

现在公司组织结构已经完整，让我们着手搭建相应部门。

## 前期准备
在这个演示项目中，我们会用到 `Spring Boot` 框架搭建应用基础
* 打开 `Spring Boot` [官方网页](http://start.spring.io/)
* 在 `Group` 栏输入 `io.servicecomb.workshop.demo`
* 在 `Artifact` 栏输入 `company`
* 选择版本 `1.4.7`
* 点击 Generate Project 按钮

![spring boot]({{ site.url }}{{ site.baseurl }}/assets/images/workshop-spring-starter.png){: .align-center}

## 技工 (Worker)
因为技工最为简单，对其他部门人员依赖最少，我们首先搭建这个部门。

首先打开之前下载的 `Spring Boot` 项目

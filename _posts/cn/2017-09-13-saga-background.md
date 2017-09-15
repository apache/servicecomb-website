---
title: "ServiceComb中的数据最终一致性方案 - part 1"
lang: cn
ref: distributed_saga_1
permalink: /cn/docs/distributed_saga_1/
excerpt: "在微服务场景下的数据一致性问题背景"
last_modified_at: 2017-09-13T18:33:43+08:00
author: Sean Yin
redirect_from:
  - /theme-setup/
---

数据一致性是许多系统的关键方面，特别是在微服务和云的环境下。我们最近在ServiceComb下发布了[Saga](https://github.com/ServiceComb/saga)项目
（首个基于[论文Sagas][1]的开源项目），以解决数据一致性问题。但为什么数据一致性如此重要？什么又是Saga？

## 单体应用的数据一致性
想象一下如果我们经营着一家大型企业，下属有航空公司、租车公司、和连锁酒店。我们为客户提供一站式的旅游行程规划服务，这样客户只需要提供出行目的地，
我们帮助客户预订机票、租车、以及预订酒店。从业务的角度，我们必须保证**上述三个服务的预订都完成才能满足一个成功的旅游行程，否则不能成行**。

我们的单体应用要满足这个需求非常简单，只需将这个三个服务请求放到同一个数据库事务中，数据库会帮我们保证全部成功或者全部回滚。

![单体应用]({{ site.url }}{{ site.baseurl }}/assets/images/saga.monolithic.png){: .align-center}

当这个功能上线以后，公司非常满意，客户也非常高兴。

## 微服务场景下的数据一致性
这几年中，我们的行程规划服务非常成功，企业蒸蒸日上，用户量也翻了数十倍。企业的下属航空公司、租车公司、和连锁酒店也相继推出了更多服务以满足客户需求，
我们的应用和开发团队也因此日渐庞大。如今我们的单体应用已变得如此复杂，以至于没人了解整个应用是怎么运作的。更糟的是新功能的上线现在需要所有研发团队合作，
日夜奋战数周才能完成。看着市场占有率每况愈下，公司高层对研发部门越来越不满意。

经过数轮讨论，我们最终决定将庞大的单体应用一分为四：机票预订服务、租车服务、酒店预订服务、和支付服务。服务各自使用自己的数据库，并通过HTTP协议通信。
负责各服务的团队根据市场需求按照自己的开发节奏发版上线。如今我们面临新的挑战：如何保证最初**三个服务的预订都完成才能满足一个成功的旅游行程，
否则不能成行**的业务规则？现在服务有各自的边界，而且数据库选型也不尽相同，通过数据库保证数据一致性的方案已不可行。

![服务边界]({{ site.url }}{{ site.baseurl }}/assets/images/saga.service.boundary.png){: .align-center}

## Sagas
幸运的是我们在互联网找到一篇精彩的[论文][1]，文中提出的数据一致性解决方案*Saga*恰好满足我们的业务要求。

>Saga是一个长活事务，可被分解成可以交错运行的子事务集合。其中每个子事务都是一个保持数据库一致性的真实事务。[[1]]

在我们的业务场景下，一个行程规划的事务就是一个Saga，其中包含四个子事务：机票预订、租车、酒店预订、和支付。

![事务]({{ site.url }}{{ site.baseurl }}/assets/images/saga.transactions.png){: .align-center}

[Chris Richardson](http://www.chrisrichardson.net/)在他的文章[Pattern: Saga](http://microservices.io/patterns/data/saga.html)中对Saga有所描述。
Caitie McCaffrey也在她的[演讲](https://www.youtube.com/watch?v=xDuwrtwYHu8)中提到如何在微软的[光晕 4](https://en.wikipedia.org/wiki/Halo_4)游戏中如何应用saga解决数据一致性问题。

### Saga的运行原理
>Saga中的事务相互关联，应作为（非原子）单位执行。任何未完全执行的Saga是不满足要求的，如果发生，必须得到补偿。要修正未完全执行的部分，
每个saga子交易T<sub>1</sub>应提供对应补偿事务C<sub>1</sub>[[1]]

我们根据上述规则定义以下事务及其相应的事务补偿：

| 服务 | 事务 | 补偿 |
|:---:|:---:|:---:|
| 机票预订 | 预订机票 | 取消预订 |
| 租车 | 租车 | 取消预订 |
| 酒店预订 | 预订房间 | 取消预订 |
| 支付 | 支付 | 退款 |

>当每个saga子事务 T<sub>1</sub>, T<sub>2</sub>, ..., T<sub>n</sub> 都有对应的补偿定义 C<sub>1</sub>, C<sub>2</sub>, ..., C<sub>n-1</sub>, 
>那么saga系统可以保证 [[1]]
>* 子事务序列 T<sub>1</sub>, T<sub>2</sub>, ..., T<sub>n</sub>得以完成 (最佳情况) 
>* 或者序列 T<sub>1</sub>, T<sub>2</sub>, ..., T<sub>j</sub>, C<sub>j</sub>, ..., C<sub>2</sub>, C<sub>1</sub>, 0 < j < n, 得以完成 

换句话说，通过上述定义的事务/补偿，saga保证满足以下业务规则：
* 所有的预订都被执行成功，如果任何一个失败，都会被取消
* 如果最后一步付款失败，所有预订也将被取消

### Saga的恢复方式
[原论文][1]中描述了两种类型的Saga恢复方式：
* **向后恢复** *补偿*所有已完成的事务，如果任一子事务失败
* **向前恢复** *重试*失败的事务，假设每个子事务最终都会成功

显然，向前恢复没有必要提供补偿事务，如果你的业务中，子事务（最终）总会成功，或补偿事务难以定义或不可能，向前恢复更符合你的需求。

理论上补偿事务永不失败，然而，在分布式世界中，服务器可能会宕机，网络可能会失败，甚至数据中心也可能会停电。在这种情况下我们能做些什么？
最后的手段是提供回退措施，比如人工干预。

### 使用Saga的条件
Saga看起来很有希望满足我们的需求。所有长活事务都可以这样做吗？这里有一些限制：
* Saga只允许两个层次的嵌套，顶级的Saga和简单子事务 [[1]]
* 在外层，全原子性不能得到满足。也就是说，sagas可能会看到其他sagas的部分结果 [[1]] 
* 每个子事务应该是独立的原子行为 [2]

在我们的业务场景下，航班预订、租车、酒店预订和付款是自然独立的行为，而且每个事务都可以用对应服务的数据库保证原子操作。

我们在行程规划事务层面也不需要原子性。一个用户可以预订最后一张机票，而后由于信用卡余额不足而被取消。同时另一个用户可能开始会看到已无余票，
接着由于前者预订被取消，最后一张机票被释放，而抢到最后一个座位并完成行程规划。

补偿也有需考虑的事项：
>补偿事务从语义角度撤消了事务T<sub>i</sub>的行为，但未必能将数据库返回到执行T<sub>i</sub>时的状态。（例如，如果事务触发导弹发射，
则可能无法撤消此操作）[[1]]

但这对我们的业务来说不是问题。其实难以撤消的行为也有可能被补偿。例如，发送电邮的事务可以通过发送解释问题的另一封电邮来补偿。 

## 总结
现在我们有了通过Saga来解决数据一致性问题的方案。它允许我们成功地执行所有事务，或在任何事务失败的情况下，补偿已成功的事务。
虽然Saga不提供[ACID](https://en.wikipedia.org/wiki/ACID)保证，但仍适用于许多数据最终一致性的场景。那我们如何设计一个Saga系统？
让我们在下一篇博文来回答这个问题。

## 参考
1. [Original Paper on Sagas][1] by By Hector Garcia-Molina & Kenneth Salem
2. Gifford, David K and James E Donahue, “Coordinating Independent Atomic Actions”, Proceedings of IEEE COMPCON, San Francisco, CA, February, 1985
3. Chris Richardson: http://www.chrisrichardson.net/
4. ServiceComb Saga Project: https://github.com/ServiceComb/saga

[1]:https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf

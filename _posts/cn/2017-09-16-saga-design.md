---
title: "ServiceComb中的数据最终一致性方案 - part 2"
lang: cn
ref: distributed_saga_2
permalink: /cn/docs/distributed_saga_2/
excerpt: "ServiceComb中的分布式Saga设计"
last_modified_at: 2017-09-16T19:05:00+08:00
author: Sean Yin
tags: [事务一致性]
redirect_from:
  - /theme-setup/
---

在我的前一篇[文章]({{ site.baseurl }}{% link _posts/cn/2017-09-13-saga-background.md %})，我谈到怎么用[Saga][1]解决行程规划应用的数据一致性问题。
现在让我们尝试设计实现Saga。

## Saga Log
Saga保证所有的子事务都得以完成或补偿，但Saga系统本身也可能会崩溃。Saga崩溃时可能处于以下几个状态：
* Saga收到事务请求，但尚未开始。因子事务对应的微服务状态未被Saga修改，我们什么也不需要做。
* 一些子事务已经完成。重启后，Saga必须接着上次完成的事务恢复。
* 子事务已开始，但尚未完成。由于远程服务可能已完成事务，也可能事务失败，甚至服务请求超时，saga只能重新发起之前未确认完成的子事务。这意味着子事务必须幂等。
* 子事务失败，其补偿事务尚未开始。Saga必须在重启后执行对应补偿事务。
* 补偿事务已开始但尚未完成。解决方案与上一个相同。这意味着补偿事务也必须是幂等的。
* 所有子事务或补偿事务均已完成，与第一种情况相同。

为了恢复到上述状态，我们必须追踪子事务及补偿事务的每一步。我们决定通过事件的方式达到以上要求，并将以下事件保存在名为saga log的持久存储中：
* **Saga started event** 保存整个saga请求，其中包括多个事务/补偿请求
* **Transaction started event** 保存对应事务请求
* **Transaction ended event** 保存对应事务请求及其回复
* **Transaction aborted event** 保存对应事务请求和失败的原因
* **Transaction compensated event** 保存对应补偿请求及其回复
* **Saga ended event** 标志着saga事务请求的结束，不需要保存任何内容

![Events]({{ site.url }}{{ site.baseurl }}/assets/images/saga.events.png){: .align-center}

通过将这些事件持久化在saga log中，我们可以将saga恢复到上述任何状态。

由于Saga只需要做事件的持久化，而事件内容以JSON的形式存储，Saga log的实现非常灵活，数据库（SQL或NoSQL），持久消息队列，甚至普通文件可以用作事件存储，
当然有些能更快得帮saga恢复状态。

## Saga请求的数据结构
在我们的业务场景下，航班预订、租车、和酒店预订没有依赖关系，可以并行处理，但对于我们的客户来说，只在所有预订成功后一次付费更加友好。
那么这四个服务的事务关系可以用下图表示：

![Transactions]({{ site.url }}{{ site.baseurl }}/assets/images/saga.transactions.png){: .align-center}

将行程规划请求的数据结构实现为[有向非循环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph)恰好合适。
图的根是saga启动任务，叶是saga结束任务。

![Request Graph]({{ site.url }}{{ site.baseurl }}/assets/images/saga.graph.png){: .align-center}

## Parallel Saga
如上所述，航班预订，租车和酒店预订可以并行处理。但是这样做会造成另一个问题：如果航班预订失败，而租车正在处理怎么办？我们不能一直等待租车服务回应，
因为不知道需要等多久。

最好的办法是再次发送租车请求，获得回应，以便我们能够继续补偿操作。但如果租车服务永不回应，我们可能需要采取回退措施，比如手动干预。

超时的预订请求可能最后仍被租车服务收到，这时服务已经处理了相同的预订和取消请求。

![Network Latency]({{ site.url }}{{ site.baseurl }}/assets/images/saga.commutative.png){: .align-center}

因此，服务的实现必须保证补偿请求执行以后，再次收到的对应事务请求无效。
Caitie McCaffrey在她的演讲[Distributed Sagas: A Protocol for Coordinating Microservices](https://www.youtube.com/watch?v=1H6tounpnG8)中把这个称为**可交换的补偿请求 (commutative compensating request)** 。

## ACID and Saga
[ACID](https://en.wikipedia.org/wiki/ACID)是具有以下属性的一致性模型:
* 原子性（Atomicity）
* 一致性（Consistency）
* 隔离性（Isolation）
* 持久性（Durability）

Saga不提供ACID保证，因为原子性和隔离性不能得到满足。原[论文][1]描述如下： 
>full atomicity is not provided. That is, sagas may view the partial results of other sagas [[1]]

通过saga log，saga可以保证一致性和持久性。

## Saga 架构
最后，我们的Saga架构如下

![Saga Architecture]({{ site.url }}{{ site.baseurl }}/assets/images/saga.design.png){: .align-center}

* Saga Execution Component解析请求JSON并构建请求图
* TaskRunner 用任务队列确保请求的执行顺序
* TaskConsumer 处理Saga任务，将事件写入saga log，并将请求发送到远程服务

## 总结
本文讨论了如何实现saga，通过saga log来保存事务和补偿事件。也提到如何从saga log中持久化的事件恢复崩溃的saga系统。
为了满足saga的一致性保证，微服务的设计有以下几个要求：
* 事务和赔偿请求必须幂等
* 补偿请求必须可交换（commutative）

## References
1. [Original Paper on Sagas][1] by By Hector Garcia-Molina & Kenneth Salem

[1]:https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf

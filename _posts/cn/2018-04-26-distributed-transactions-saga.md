---
title: "Saga分布式事务解决方案与实践"
lang: cn
ref: distributed-transactions-saga-implementation
permalink: /cn/docs/distributed-transactions-saga-implementation/
excerpt: "2018年QConBeijing Saga分布式事务解决方案与实践演讲实录"
last_modified_at: 2018-04-26T17:18:43+08:00
author: Willem Jiang
tags: [Saga, QCon]
redirect_from:
  - /theme-setup/
---
## Saga分布式事务解决方案与实践

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.001.jpeg)

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.002.jpeg)
我先介绍一下我自己，我叫姜宁，来自于华为开源研究中心，现在负责的是ServiceComb这个开源项目。ServiceComb这个项目已经进到Apache孵化，应该是去年11月份时进到Apache孵化的，这个月刚发了1.0M1版，但对于SAGA来说我们属于探索的阶段，我们就发了0.1.0。我参与过Apache一些项目，我也是Apache的 Member，是Apache CXF, Apache Camel 还有的PMC。还有一件事情，前一段时间帮阿里同学孵化 RocketMQ，我是以导师的身份参与的，属于见习的Mentor，这回带着ServiceComb这个项目，我感觉我把很多角色都玩了一遍。后面如果大家有兴趣，Apache孵化的事情也可以找到。还有，我之前在红帽软件、IONA、航信待过，说不定会有一些前同事，也可以找我叙旧。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.003.jpeg)

今天的议题围绕几个方面来展开，一个是微服务事务一致性的问题，然后讲一讲业界的SAGA解决方案，我们在ServiceComb里也提供了SAGA的实现。另外一件事情，我项目这边也在招新，欢迎广大感兴趣的同学一会儿加我微信。我们现在项目其实架子也都搭得不错了，就是等着大家跳到碗里面，一起来解决微服务事务一致性问题。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.004.jpeg)

微服务架构强调的服务能够独立开发，独立演进，独立部署， 独立团队。

那微服务相关的数据是采用什么方式进行存储的呢？

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.005.jpeg)

传统的单体应用一般采用的是数据库提供的事务一致性，通过数据库提供的提交以及回滚机制来保证相关操作的ACID，这些操作要么同时成功，要么同时失败。各个服务看到数据库中的数据是一致的，同时数据库的操作也是相互隔离的，最后数据也是在数据库中持久存储的。这样的架构不具备横向扩展能力，服务之间的耦合程度也比较高，会存在单点故障。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.006.jpeg)

在微服务架构中， 有一个database per service的模式， 这个模式就是每一个服务一个数据库。 这样可以保证微服务独立开发，独立演进，独立部署， 独立团队。

由于一个应用是由一组相互协作的微服务所组成，在分布式环境下由于各个服务访问的数据是相互分离的， 服务之间不能靠数据库来保证事务一致性。   这就需要在应用层面提供一个协调机制，来保证一组事务执行要么成功，要么失败。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.007.jpeg)

两阶段提交其实比较简单，这边有两个资源提供准备和提交两个接口。

由于隔离性互斥的要求，在事务执行过程中，所有的资源都是被锁定的，这种情况只适合执行时间确定的短事务。  但是为了保证分布式事务的一致性，大都是采用串行化的隔离级别来保证事务一致性，这样会降低系统的吞吐。

但因为2PC的协议成本比较好，又有全局锁的问题，性能会比较差。 因此现在大家基本上不会采用这种强一致解决方案。我们需要做一下酸碱平衡。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.008.jpeg)

这里先简单介绍一下酸碱平衡中的酸 ACID。 原子性 事务作为整体来执行，要么全部执行，要么都不执行。一致性 事务应确保数据从一个一致的状态转变为另一个一致的状态。隔离性 多个事务并发执行时，一个事务的执行不应影响其他事务的执行。持久性 已提交的事务修改数据会被持久保持

酸碱平衡中的碱 BASE。 基本可用 可以保证分布式事务参与方不一定同时在线。柔性状态 允许系统状态更新有一定的延时，这个延时对客户来说不一定能察觉。最终一致性 通常是通过消息可达的方式保证系统的最终一致性。

这是分布式事务的一些基础理论数据库以及分布式的两阶段提交都提供了ACID的保证。 由于隔离性互斥的要求，在事务执行过程中，所有的资源都是被锁定的，这种情况只适合执行时间确定的短事务。后续大家开始通过业务逻辑将互斥锁操作从资源层面上移到业务层面，这并不是完全放弃了ACID，而是通过放宽一致性要求，借助本地事务来实现最终分布式事务一致性的同时也保证系统的吞吐。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.009.jpeg)

TCC名字的由来是其中包含了 try, confirm, cancel三个操作。

与两阶段提交相比，TCC位于业务服务层， 没有单独的准备阶段，Try操作可以灵活选择业务资源锁的粒度。TCC是通过最终一致性来解决系统性能问题的这个设计，对我们设计抉择有很大的启发。 有些时候一些系统的技术问题是可以通过业务建模的方式来解决的。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.010.jpeg)

​     回顾之前的酸碱平衡的示例，我们得到的启发我们可以通过业务模型的改进提升系统性能。有关领域建模，这里给大家推荐两本书，一个是《领域驱动设计》，还有一个是《实现领域驱动设计》。微服务设计目标高内聚低耦合，领域驱动设计能帮助构建一致的业务模型和系统实现模型，通过领域驱动设计可以明确微服务的界限上下文。通过在业务层面上把它们之间的强耦合关系拆开之后，带来最大的好处是，它们自身可以借助传统的数据库所提供的功能来实现一致性，只不过是在微服务与微服务之间，它们需要通过前面提到的这种柔性事务方式来做这件事情。



![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.011.jpeg)

微服务架构是一个在限定界限上下文内的松耦合的服务架构。微服务事务一致性的建议是什么呢？就是内刚外柔。在限定上下文内容借助数据库提供事务一致性来做强一致。在限定上下文之间依靠最终一致性方案来解决服务间协同问题。

对于柔性事务来常见的实现方式有TCC，和Saga，今天我们主要向大家介绍Saga的实现。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.012.jpeg)

Saga其实是30年前的一篇数据库论文里提到的一个概念。在论文中一个Saga事务是由多个本地事务所组成， 每个本地事务有相应的执行模块和补偿模块，当saga事务中的任意一个本地事务出错了， 可以通过调用相关的补充方法恢复之前的事务，达到事务的最终一致性。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.013.jpeg)

Saga概念虽然提出来快30年了， 随着微服务的复杂，引出了分布式Saga问题近些年也逐步受到大家的关注。

我们在实现Saga模型的时候，主要是参考了Caitie McCaffrey 在分布式Saga论文，以及Chris Richardson的研究。 大家可以通过下面的链接获取相关的信息。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.016.jpeg)

在分布式系统中由于网络请求可能的延时，在Caitie的论文中对被Saga调用的服务提出两点要求，我们需要Saga调用的服务支持幂等。 在服务请求的过程中，可能会出现超时重试的情况，我们需要通过幂等来避免多次请求所带来的问题。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.017.jpeg)

前面提到了超时重试的机制，现在我们再来看看重试取消的情况。补偿可交换原则是指Saga并行处理的过程中，如果发生了超时重试事件之后，并进行了补偿的操作，那么补偿操作是直接生效的。

为了保证这个要求，需要我们在设计系统的过程中保留所有的事务数据。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.018.jpeg)

由此我们可以知道Saga模型只支持ACD，不提供隔离性的保证。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.019.jpeg)

因为saga事务没有准备阶段，事务没有隔离，如果两个saga事务同时操作同一资源就会遇到我们操作多线程临界资源的的情况。因此会产生更新丢失，脏数据读取等问题。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.020.jpeg)

为了解决隔离性带来的问题，我们可以参考一下TCC的解决方案，从业务层面入手加入一Session以及锁的机制来保证能够串行化操作资源。或者是在业务层面通过预先冻结资金的方式隔离这部分资源。 最后在业务操作的过程中可以通过及时读取当前状态的方式获取到最新的贡献。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.021.jpeg)

目前业界提供了两类Saga的实现方式。 一个是集中式协调器的实现方式，一个分布式的实现方式。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.022.1.jpeg)

集中式的Saga实现一般是通过一个Saga对象来追踪所有的Saga子任务的调用情况， 根据调用情况来决定是否需要调用对应的补偿方面，协调器和调用方是在一个进程中的。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.022.2.jpeg)

这里附上的是Camel最近实现的Saga EIP， 通过这个DSL可以很方便地实现执行操作和取消操作。
集中式的Saga实现方式比较直观并且容易控制，问题是业务耦合程度会比较高。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.023.jpeg)

布式的Saga 一般是采用事件驱动方式让参与的服务方进行相关的交互。相关的业务方只需要订阅相关的领域事件即可。 Chirs提供了基于事件溯源的实现，同时axonframework也提供了相关的实现。

分布式saga实现的好处： 采用事件源的方式降低系统复杂程度，提升系统扩展性， 处理模块通过订阅事件的方式降低系统的耦合程度。当然这也的实现也有一些问题： saga系统会涉及大量的业务事件，对编码和调试会带来一些问题；因为处理是基于事件，相关事件处理模块可能会循环依赖的问题。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.024.jpeg)

前面理论铺垫已经做完了，现在讲一讲我们的实现。 ServiceComb是去年5月份华为开源的微服务框架，它是华为云微服务框架引擎很重要的一个组成部分。大家可以通过下面链接来访问ServiceComb官网以及相关的代码库。

目前ServiceComb主要有三个项目组成：第一个是ServiceCenter做服务发现的，这是go语言在etcd
基础实现的服务注册中心，另外是java的一个微服务框架，这块是基于vertx的基础上实现了全异步操作接口，框架有比较好的性能。 SAGA其实就是我们针对前面刚刚提到Saga模式的实现。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.025.jpeg)

集中式的Saga协调器构建过程参考了Caitie的论文，实现了一个集中式Saga调用协调器。 后续我们在开发的过程中，发现如果不提供DSL的话，让用户定义Saga事件很困难，受到Zipkin的启发，我们实现了一个分布式的Saga协调器。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.026.jpeg)

集中式的协调器，包含了Saga调用请求接收，分析，以及执行和结果查询这部分的内容。任务代理模块需要预先知道Saga事务调用关系图。执行模块根据生成的调用图产生调用任务，调用相关微服务服务接口。如果服务调用执行出错，会调用服务的相关的补偿方法回滚。

下面是我们实现的两个不同的调度模型。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.027.jpeg)

这里Saga执行模块通过分析请求的Json数据，构建一个调用关系图，这里我们是通过JSon来描述Saga事务串行调用子事务或者并行调用子事务。关系调用图被Saga实现中的任务运行模块分解成为一个一个执行任务，执行任务由任务消费者获取并生成相关的调用 （这里同时支持串行和并行调用）。

Saga任务会根据执行的情况向Saga log中记录对应的Saga事务的关键事件，同时我们的事件查看器查看到Saga事务相关的执行情况。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.028.jpeg)

后续我们采用了Actor模型对任务的调度模块进行了重构，在不进行调优的情况下，系统性能提升一倍。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.029.jpeg)

集中式Saga的实现的好处是易于监控和协调， 但是坏处就是需要依赖工具对Saga调用进行相关的描述。那我们有没有一个好的方式自动获取Saga事务的定义呢？ 为了解决这一问题，我们对内部的Saga实现进行新的改进。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.030.jpeg)

正如前面提到的，Zipkin通过在服务调用双方传递上下文的方式可以构建出完整的调用链， 这个调用链和我们需要的Saga子事务调用信息很类似。 因此我们借助Zipkin实现了一套Saga调用关系追踪的模块。

为了实现这个事务追踪模型，就需要我们在应用端部署相关的监控模块，同时监控模块需要和后台进行协同交互，于是我们设计了Pack狼群架构。  

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.031.jpeg)

狼群架构有两个参与者， 一个是Alpha， 一个是Omega。Alpha是狼群首领，负责协调事务执行情况，Omega是狼群成员，负责收集事务，向狼群首领上报情况，并执行相关指令。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.032.jpeg)

Omega会以切面编程的方式向应用程序注入相关的处理模块，这里有拦截请求的模块， 用来帮助我们构建分布式事务调用的上下文。 同时在事务处理初始阶段处理事务的相关准备的操作，例如创建Saga 起始事件，以及相关的子起始事件， 根据事务的执行的成功或者失败生产相关的事务终止或者失败事件。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.033.jpeg)

Omega会与Alpha进行链接会把这些事件通知给Alpha。 Alpha可以在后台进行分析，根据Saga事务执行的情况给Omega下达相关的指令进行相关的回滚恢复。

 这样设计的好处是Saga实现代码与用户的代码分离， 用户只需要添加几个annotation，Saga实现就能Saga事件的执行情况并进行相关的处理。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.034.jpeg)

这是Omega和Alpha之间的正常业务逻辑的交互图，这里Omega通过分析调用上下文决定是否发生Saga事务的起始事件到Alpha，后续ServiceA在调用ServiceB，会将相关的调用上下文传递给ServiceB。ServiceB的Omega模块会截取这个调用上下文生成相关子事务事件信息。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.035.jpeg)

 如果服务调用的过程中抛出异常，Omega会将终止事件发送到Alpha端， Alpha的后台进程会定时做扫描，扫描过程中会发现有需要恢复的事件。Alpha会向Omega发消息调用相关的恢复操作，来保证整个Saga事务的原子性。目前Omega也开始提供重试功能，也就是事务调用如果失败了， Omega会根据设置进行重试尝试。
![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.036.jpeg)

未来的开发计划，第一个就是Alpha这边会做多租，因为这边我们可以提供线上的服务，还有为了保证系统的可达性，我们可能会用消息队列的方式的方式来做。还有就是刚刚给大家提到的TCC协调器的方式。还有就是Omega，我们要实现幂等也比较费劲，在Omega端也可以实现幂等操作。另外根据Saga的执行这个情况，也要做一些可视化的事情，这块其实也是前端，大家如果有做前端技能的话，可以跟我联系一下。最后我们要解决多线程共享调用的问题。我们问题都列在下面的JIRA上面，大家可以来找一下相关的任务。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.037.jpeg)

简单小节一下，我们对事务一致性做了简单的回顾，业界的SAGA解决方案也提了一下，简单介绍一下ServiceComb的Saga实现，以及我们后续的开发计划。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.038.jpeg)

这个最关键了，大家扫码，上面是ServiceComb小助手，可以帮你拉到微信群里，如果大家有兴趣想加入到我们SAGA项目开发可以与ServiceComb小助手联系。

![]({{ site.url }}{{ site.baseurl }}/assets/images/saga/Saga.039.jpeg)

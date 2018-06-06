---
title: "如何从一名开源小白成长为Apache Committer"
lang: cn
ref: how-to-grow-up-to-be-an-apache-committer
permalink: /cn/docs/how-to-grow-up-to-be-an-apache-committer/
excerpt: "如何从一名开源小白成长为Apache Committer"
last_modified_at: 2018-06-06T11:00:00+08:00
author: Yangyong Zheng
tags: [Committer, Apache Way]
redirect_from:
  - /theme-setup/
---

## 如何从一名开源小白成长为Apache Committer
今天收到了来自Apache Vote我成为Committer的邮件，代表自己的贡献得到了充分的肯定；除了感谢团队的给力支持，我更希望将自己的成长经历——如何践行Apache Way的心得介绍给大家，让大家爱上Apache开源社区，也能和我一样成长为自己喜爱项目的Committer。

### 根据个人贡献获得价值（Government By Merit）
回忆我刚参与ServiceComb项目，面对上万行的存量代码，总觉得无从下手，甚至认为开源社区高手如云，如果没有深厚且对口的技术功底，还是不要来掺和了。

在这个困难而关键的时候，社区导师给了我明确的指导——**不要怕，从小事做起，不要“善小而不为”**。于是我静下心来，在Jira上寻找最简单的任务，主动请缨的[第一个任务](https://github.com/apache/incubator-servicecomb-java-chassis/pull/91)是支持配置兼容，具体需求是`cse.xxx`配置项和`servicecomb.xxx`配置项要具备等同效果，经过一番努力，成功Merge PR ；之后我又接下另一个简单任务，增加一个Annotation用于支持Json String作为请求参数……

Apache Way非常看重个人贡献，没有贡献，一切无从谈起，**与开源软件同行，不仅看你获得了多少，更要坚持长期贡献**，这是它与商业软件最大的不同。贡献并不区分大小，无论是增加重大特性，还是小小的改进、Bug Fix和修订文档错误，这些同样是项目茁壮成长的关键。

**实际上大多数开源爱好者都是从修订文档错误开始的**，例如改正错别字、格式不正确以及订正描述等等，我对ServiceComb的理解也绝大多数来自[这方面的工作](https://github.com/apache/incubator-servicecomb-website/pulls?q=is%3Apr+is%3Aclosed+author%3Azhengyangyong)；这样不但能够在阅读文档的过程中更快的了解技术细节，也比较容易入手做出贡献。

总之坚持下来，个人积累的贡献慢慢变厚，获得Apache的认可自然水到渠成。

### 社区驱动（Community）
参与社区是技术成长最快的方式之一，Follow Apache社区的方式有订阅[邮件列表](http://servicecomb.incubator.apache.org/cn/developers/subscribe-mail-list/)和加入[Gitter](http://servicecomb.incubator.apache.org/cn/developers/use-gitter/)聊天室；从看大家讨论（讨论邮件一般会使用[Discussion]开头），到回答大家的问题（回复邮件和发送Gitter聊天），相信用不了多久你就能收获颇丰，并冒出自己的想法，迈出第一步提交第一个PR也就不难了。

[ServiceComb](http://servicecomb.incubator.apache.org/)作为一个微服务一站式解决方案，融合侵入式、非侵入式场景并支持多语言，解放开发者，帮助用户和开发者将企业应用轻松微服务化和上云；大家在这里讨论的话题、发起的投票、以及提交的代码，无不与微服务密切相关。在这个社区中我不但学习到了知识，完成了开源（也包含微服务）小白的蜕变，还进一步接受了开源的洗礼——**前辈指导我进步，我将所学传递给新人**；这个过程中我结识了很多新朋友，大家互通有无，不但极大的开阔了视野，也提高了自己的社交能力。

Apache开发者来自全球，社区大多都是用英文来交流。通过阅读[英文资料](http://servicecomb.incubator.apache.org/users/)，使用英文在[Gitter](http://servicecomb.incubator.apache.org/cn/developers/use-gitter/)上与开发人员直接交流，通过英文邮件来探讨问题，在不知不觉中自己的英文水平也大大提高了。

### 协作开发（Collaborative Development） 
这也是我极力推荐参与开源社区开发的重要原因之一，**当你提交PR后，无论代码有多么烂，你总能收获宝贵的Comments**，不花钱获得编程大师的指点——教你怎么写出优秀的代码，这是多么合算的买卖！

我在参与ServiceComb社区前，只知道Java基本语法，IDE不熟练（之前一直是用VS写C#，不使用Eclipse和IntelliJ IDEA），不会Git，不懂Maven，还能有更糟糕的起点吗：）

不用担心，社区会指导你。我前文提到的第一个简单的任务，花费了将近一周时间，被打回来了四五次后才被Merge；一个PR收获60+ Comments也是家常便饭。这个过程中我的Java水平成长得飞快，不久后就能独立承担新特性的设计和开发——[Metrics](http://servicecomb.incubator.apache.org/cn/users/metrics-in-1.0.0-m1/)，当然，完成这个新特性的过程中Committer和其他开发者给予了很多支持，所以，请大胆的提交你的第一个PR，成为一名Contributor吧。

### 民主，开放和透明（Consensus, Open and Transparency）
在Apache社区里投票至关重要，你可以感受到你的建议将被充分重视，我很喜欢这种参与感；大家的讨论和建议也完全公开透明，并且能够长时间通过邮件列表查询到，沟通效率非常高。所以大家多多参与，一定能收获惊喜，从万能的社区里寻找自己想要的答案，请记住，**当你对某个问题产生困惑，即使是强大的StackOverflow也不会有原作者的答复更为准确**。

写在最后，我想说从一名开源小白成长为Apache Committer并不是无比艰难又遥不可及的事情，**只需要日积月累的在社区中投入一点业余时间，就能梦想成真**。当然最好找到自己感兴趣的社区，这会让这段旅途更加愉快，也能交到更多志同道合的的朋友。

>广告：我所在的Apache ServiceComb正[持续招募贡献者](http://servicecomb.incubator.apache.org/cn/developers/contributing)，非常欢迎大家加入，让我们一起构建更好的微服务框架。
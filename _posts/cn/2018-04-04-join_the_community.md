---
title: "如何加入ServiceComb社区"
lang: cn
ref: join_the_community
permalink: /cn/docs/join_the_community/
excerpt: "如何加入ServiceComb社区"
last_modified_at: 2017-09-16T19:05:00+08:00
author: Li Bo
tags: [加入社区]
redirect_from:
  - /theme-setup/
---

近期，热衷开源和微服务的伙伴们非常关注如何加入到ServiceComb社区。ServiceComb作为开源的Apache 孵化项目，加入方式和常规的加入开源社区的方式大体一致，一般为三个阶段：1. 订阅并关注社区动态；2. 开始在开源社区提交第一份代码；3. 深度加入社区讨论并贡献，以下将详细向大家讲述如何一步步加入ServiceComb社区。

### Step 1 订阅并关注ServiceComb社区动态

订阅和关注社区动态的途径有：即时通讯工具（社区微信群、gitter）、社区公众号、开发者邮件列表、门户网站。

**即时通讯工具** 

扫描下方二维码或搜索`ServiceComb小助手`加入微信群，加入后可以在微信群中咨询和求助，会有热心的伙伴和committer 及时的响应回复。

![](/assets/images/jira/assist.png){: .align-center}



也可使用Github账号登录gitter（地址 https://gitter.im/ServiceCombUsers/Lobby）进行在线讨论，国内的伙伴们更习惯于使用微信群进行在线交流，但为了更方便后来加入的人可以检索并查阅前期的讨论内容存档，所以ServiceComb社区推荐使用gitter。

**社区公众号**

扫描下方二维码关注公众号或微信公众号中搜索`ServiceComb`进行关注，公众号会定期的发布和推送ServiceComb近期相应资讯（干货资料、学习资源、线上活动、线下活动等）。

![](/assets/images/jira/public.png){: .align-center}

**邮件列表**

通过订阅开发者邮件可以及时获取到社区开发者的邮件讨论内容，可发起讨论，也可通过回复感兴趣的讨论题目参与到讨论中（邮件内容均使用英文），另外邮件的存档功能可以方便开发者查阅历史问题的讨论过程。

订阅邮件方式：

- 发送任意内容到`dev-subscribe@servicecomb.incubator.apache.org`
- 收到来自`dev-help@servicecomb.apache.org`的确认邮件后，再回复dev-help任意内容来确认订阅邮件列表即可。

邮件存档内容可通过https://www.mail-archive.com/搜索`ServiceComb`获取。

**门户网站**

ServiceComb门户网站是社区的官方入口，包括快速入门指南、用户手册、开发者手册、常见问题和开发博文等。

网站地址: http://servicecomb.incubator.apache.org/cn/

### Step 2 在 ServiceComb 社区提交第一份代码（PR）

当关注社区并尝试调试使用后，会发现一些简单的bug（如文档或代码格式问题等），可以通过fix简单的bug来熟悉ServiceComb社区的开发流程。

**发现问题并提交Issue：**

由于ServiceComb的任务管理是在Apache JIRA上进行的，所以需要先注册并登录到JIRA。关于JIRA详细使用方法请参考JIRA使用帮助：http://servicecomb.incubator.apache.org/cn/developers/use-jira/

* 注册并登陆到 https://issues.apache.org/jira/projects/SCB，点击左侧Kanban可以看到当前待处理、处理中和已经完成的任务列表。

  ![kanabn](/assets/images/jira/jira-kanban.png){: .align-center}

* 点击**新建**创建新的issue或者task进行问题或任务跟踪，选择相应的模块并添加描述信息。

  ![create](/assets/images/jira/create-issue.png){: .align-center}

任务提交到JIRA后，需要在本地进行代码开发，进行第一份代码的提交。

**提交第一份代码（PR）**

开发者在GitHub上fork仓库后clone到本地进行代码修改，修改完成并测试通过后可以创建PR提交代码，提交PR后系统会自动运行CI进行代码测试。测试通过后会有其他开发者或者maintainer进行review，没有问题后会被approve并merge到主干分支。具体可参考门户网站上开发者手册中的代码提交指南：

http://servicecomb.incubator.apache.org/cn/developers/submit-codes/

需要**注意**的是，创建PR的时候，PR的title要以JIRA中对应的问题编号开头，如下图中 [SCB-327]，这样系统就会自动关联本次提交到相应JIRA任务下，方便进度跟踪。

![](/assets/images/jira/pr.png){: .align-center}

刚才提交的代码经过committer的review后，如果有问题committer会进行comment，继续修改后push最新代码即可。如果没有问题会approve并merge。

至此，您已经熟悉了ServiceComb社区的初级的开发流程，也是常规的社区开发方法（不同的社区承载体会有细微差异，如kubernetes的问题跟踪是直接承载github的issue上）。下一步就可以深度参与到ServiceComb的讨论并进行贡献。

### Step 3 深度参与到ServiceComb讨论并贡献

由于开源社区强调开放性，当开发者想在社区里做一些较大或中长期的特性时，则需在ServiceComb社区发起特性的讨论。

#### 如何发起特性讨论

通过邮件发Proposal到社区进行讨论，Proposal中有贴图或附加文档时可先创建好文件链接，将链接贴到邮件里即可，创建文件可以有一下两种方式：

* 在JIRA上创建一个对应的特性任务，并将Proposal文档添加到该任务的附件中，拷贝链接。

* 通过github向servicecomb.io网站以blog的形式提交文件，将该blog地址拷贝到邮件中。

  文档附件可参考：

  http://servicecomb.incubator.apache.org/docs/service-registry-refactor-proposal/

  Proposal邮件参考：

  ![proposal-pack](/assets/images/jira/proposal-pack.png){: .align-center}

当在邮件中讨论清楚特性设计后，就可以开始对应的代码开发，或对于部分小的任务（如代码bug修复、文档完善、网站优化等），其本身不需要过多讨论，则可参考上一步骤 Step 2 中的开发流程进行代码贡献。

遇到其他本文章未解决的问题（如用户业务准备进行微服务技术选型或ServiceComb的概念性问题等）时，建议直接到微信群或者gitter里进行咨询并寻求帮助。



社区鼓励多劳多得和技术沉淀，坚持贡献社区可以收获来自社区的礼品激励惊喜，坚持长期使用和参与社区项目的伙伴，将可能被选举成 Apache committer 或者取得更高的荣誉，希望本文能对热衷开源及ServiceComb社区的伙伴们有所帮助，也欢迎积极参加ServiceComb的线上及线下活动。


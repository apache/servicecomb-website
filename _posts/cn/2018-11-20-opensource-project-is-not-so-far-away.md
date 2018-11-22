---
title: "开源项目没有那么遥远"
lang: cn
ref: opensource-project-is-not-so-far-away
permalink: /cn/docs/opensource-project-is-not-so-far-away/
excerpt: "开源项目没有那么遥远"
last_modified_at: 2018-11-20T12:00:00+08:00
author: Haishi Yao
tags: [Committer, Apache Way]
redirect_from:
  - /theme-setup/
---

## 开源项目没有那么遥远

> 前几天收到了Apache ServiceComb PMC的邀请邮件，这意味着我成为了一名Apache ServiceComb项目的Committer。喜悦之余，我想留下一篇博客作为自己工作的一个阶段性总结，同时也希望这篇文章能够给其他想要加入到开源社区的同学一点参考。

### 初次接触ServiceComb

最开始接触到“开源”的概念是在大学的计算机课程上，当时对于开源项目的印象就是：开源项目是由一群大牛程序员开发和维护的，作为小白的我只需要拿来用就好了。

毕业之后参加工作，我被分到了一个跟开源项目相关的工作组，需要向[Apache ServiceComb项目][ServiceComb官网]提交代码。当时的心情真是既新奇又紧张，毕竟以前只是单纯地使用过开源软件，而现在自己终于要向开源软件项目提交代码了。这种能够在一个开源项目中提交自己代码的兴奋感，相信很多学软件专业的同学应该能够理解。但是自己又是刚开始工作的小白，担心自己写的代码太差了拿不出手，因此又紧张不已。而事实上我第一次提交代码的经过并没有预想中的那么多波折，作为一个开源小白，提上去的pull request有瑕疵是很正常的事情，根据检视者的意见修改好了就行——毕竟高手不一定高冷，社区的开发者们都是很热心的。

有了第一次提交PR的经历后，后面的工作就慢慢变得轻车熟路了。平常我在开源社区主要做的就是领一些新特性或者修复bug的[issue][Apache issues]处理，提交代码或文档的修改。

### 参与的方式不仅仅是写代码……

如前文所提到的，最初我参与Apache ServiceComb开源项目的内容是由工作驱动的。因为有一些新特性要完成，或者因为有一些bug要修复，所以我需要提交代码和更新相关文档。而在代码和文档之外的其他事务我并没有参与多少。

其实从我开始向ServiceComb提交代码时，我就订阅了[Apache ServiceComb的邮件列表][订阅邮件列表]，也加入了[Gitter聊天室][使用Gitter]。不过由于对自己的技术没什么自信，也受限于内向的性格，我在这些沟通渠道内长期保持着旁观的状态。当时的想法是，讨论ServiceComb设计和发展的事情我又参与不了，看看大佬们讨论就可以，到时候我再捞几个issue来做就好了。然而这种想法是不对的，对于我们自身在开源社区中的发展也没有好处。要参与开源社区的事务，仅仅只是埋头提交代码是不够的，积极参与社区的讨论、沟通，保持自己在社区中的活跃度，也是评判自己在社区工作好坏的一项标准。这也符合Apache之道中“社区胜于代码”的理念。此外，把将要进行的事情放到邮件中讨论，也是一个文档归档的过程。后续想要回溯某个特性为什么会被加进来，或者某个bug是如何触发的时候，搜索相关的邮件就可以了。如果有新的贡献者想要参与到社区开发工作中来，他们也可以通过查阅邮件来了解很多信息。这在无形中节省了很多后续的维护和沟通成本。

参与社区讨论的活跃程度也是评判一个开发者能否成为committer的重要标准。听先前已经进入ServiceComb社区的同事说，其实按照我的代码提交量来看，在之前我就可以成为committer了，然而由于我在社区沟通中的活跃度实在是太低了，所以才一直没有受到ServiceComb PMC的committer邀请……所以说，同学们一定不要被自己的腼腆性格坑了啊，要参与社区事务，就需要更积极地加入到讨论中来。

### 给有意者的一些建议

参与一个开源项目，对于自己阅读文档、分析源码、开发和沟通的能力都有很大的益处。这和开发一个业务系统是两种完全不同的体验，对于拓展个人的视野和经验很有帮助。如果进一步成为Apache committer，还有一些额外的福利哦，例如：
- 合入PR的权限：普通的贡献者只能等待其他committer来检视代码和帮你合入PR。如果你自己就是一名committer的话，那么你就有了合入PR的权限了；而且在你提交PR的时候，不用再像以前一样被动等待其他人来检视，你可以在Github的PR页面主动选择要求其他committer帮你检视代码，被你at到的committer会收到提醒检视的邮件，这样更快捷。
- JetBrains开源license：如果你是一名Java开发人员，相信你应该听说过JetBrains的Intellij IDEA吧？IDEA有社区版和商业版之分，商业版的功能更丰富，不过需要付费使用。如果你成为了一个Apache项目的committer，那么你就可以申请Open Source License，免费使用商业版的IDEA，或者其他工具（如Goland）了。
- 技术水平的认可：成为Apache Committer本身就是一件可以证明你的技术能力的事情。在[Apache Committer 列表][ApacheIDList]页面，你可以看到所有的Apache Committer，表格的第三列显示了各个committer所参与的项目。当你参与的项目足够多时，还能成为Apache member，帮助大家孵化开源项目，这个层次相当于比普通committer更进一步了。

如果想要参与到一个开源项目中，可以首先了解一下如何使用这个项目。给开源社区做贡献的方式不仅仅限于提交代码，[修复文档问题][ServiceComb-docs]可能是一个更好的切入点。通过阅读和修复文档问题，我们可以了解到一个项目的主要特性，这对于我们进一步了解项目源码也是很有帮助的。

同时，[订阅邮件列表]和[使用Gitter]也很有必要。通过这些，我们不仅可以了解到项目的最新动态，也能够参与到社区的讨论中来。如果还不了解如何发起一场讨论的话，可以先看看社区里的开发者是怎么做的，参与到其他人的邮件讨论中去。碰到其他的使用者提问也可以上去帮助解答，这同样是一种参与贡献的方式。上文已经提到过了，参与讨论沟通是社区活动的重要内容。不用感到不好意思，开源社区本身就是开放的，我们欢迎更多的人能够参与到项目的建设中来。

正所谓临渊羡鱼，不如退而结网。与其羡慕已经成功参与到开源项目中的同学，不如从现在开始行动，选择一个开源项目参与进去 ; )

文章的最后，我想向给与我帮助和鼓励的社区团队成员致以感谢，谢谢大家热心的帮助和指导，让我从一名小白成长为Apache committer。

> ps：在这里小小地安利一下，[Apache ServiceComb项目][ServiceComb官网]已经从Apache孵化器毕业，正式成为Apache顶级项目，这也是业界首个微服务项目在Apache孵化并毕业成为顶级项目。ServiceComb包含的几个子项目都处于如火如荼的发展势头中，欢迎大家参与到ServiceComb社区建设中来~

## 附：committer权限设置步骤

当你收到Apache ServiceComb PMC的邀请邮件，这就意味着你的努力已经获得了PMC的认可，你可以选择成为committer了！建议你仔细阅读一遍邀请邮件，按照上面的指导来进行操作。这里我简要介绍一下我的操作步骤。

1. 签署iCLA  
在成为committer之前，你需要先确保自己已经[签署iCLA][ContributorLicenseAgreements]。如果没有的话，可以先去[下载一份iCLA pdf文件][下载ICLA文件]，注意`(optional) Public name`一栏填写自己的github id。注意这份PDF文件需要签名，签名内容是`Full Name`那一栏的你填的内容。  
将签署好了的iCLA文件按照[iCLA文件提交说明]发送给`secretary@apache.org`，等待回信即可完成签署流程。  
2. 回复PMC的邀请邮件  
完成iCLA的签署后，就可以在Apache PMC的邀请邮件上回复了，回复邮件发给`private@servicecomb.apache.org`，你需要说明自己接受邀请，并且告诉PMC你所想要使用的Apache id。已经被人申请了的Apache ID在[这里][ApacheIDList]都可以查到，选择的时候需要选一个还没有被人使用的id。  
3. 初始化Apache帐户密码  
当收到Apache帐户创建成功的邮件（标题为`Welcome to the Apache Software Foundation (ASF)!`）时，你的Apache帐号就创建成功了，记得按照邮件中的提示，去设置一下自己的密码。重置密码的过程中需要使用你在签署iCLA时填写的邮箱地址。  
4. 设置committer权限  
committer账号设置完成后，你还需要设置对Github上托管的Apache ServiceComb项目的仓库权限进行设置，设置流程可以参考[这篇博客][Committer权限设置]。需要补充的一点是，在对Github账号授权时，需要开启[双因子认证][Github双因子认证介绍]，国内的同学只能选择使用双因子认证APP来做认证了。除了Github介绍页面上推荐的Authy、1Password和LastPass Authenticator，也可以使用Google的身份验证器，在APP store能够搜到，图标如下：
![2FA APP]({{ site.url }}{{ site.baseurl }}/assets/images/becoming_committer/2FA_APP.png){: .align-center}

[ServiceComb官网]: https://servicecomb.apache.org/cn/ "ServiceComb官网"
[Apache issues]: https://issues.apache.org/jira/projects/SCB/issues "Apache issues"
[订阅邮件列表]: https://servicecomb.apache.org/cn/developers/subscribe-mail-list/ "订阅邮件"
[使用Gitter]: https://servicecomb.apache.org/cn/developers/use-gitter/ "使用Gitter"
[ServiceComb-docs]: https://github.com/apache/servicecomb-docs "ServiceComb文档项目"
[ContributorLicenseAgreements]: http://www.apache.org/licenses/#clas "Contributor License Agreements"
[下载iCLA文件]: http://www.apache.org/licenses/icla.pdf "下载ICLA文件"
[iCLA文件提交说明]: http://www.apache.org/licenses/#submitting "提交iCLA文件"
[ApacheIDList]: http://people.apache.org/committer-index.html "Apache committer index"
[Committer权限设置]: https://servicecomb.apache.org/cn/developers/setup-committer-rights/ "Committer权限设置"
[Github双因子认证介绍]: https://github.com/settings/two_factor_authentication/intro "Github双因子认证"

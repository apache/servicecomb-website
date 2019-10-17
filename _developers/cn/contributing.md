---
title: "如何做贡献"
lang: cn
ref: ServiceComb-contributing
permalink: /cn/developers/contributing
excerpt: "如何做贡献"
last_modified_at: 2018-05-20T19:18:43+08:00
---
{% include toc %}
## 为Apache ServiceComb做贡献
您可以通过很多方式帮助ServiceComb成长为更优秀的微服务框架——非常欢迎伸出援手！

* 浏览文档，这样可以加深您对ServiceComb的了解，学习到知识，一旦发现文档写得不清晰或逻辑混乱的地方，请通知我们；
* 下载代码，试一试我们介绍的功能，看看它是否与您预想的一样工作；
* 分析源代码，如果希望了解更多技术细节，请在[Gitter](http://servicecomb.apache.org/cn/developers/use-gitter/)上提问，大家会尽快解答；
* 希望炫一把黑科技体现您的实力？看看我们的 [issue tracker](https://issues.apache.org/jira/browse/SCB) 吧，欢迎您承接Open状态的Issues和未完成的特性，提交[PR](http://servicecomb.apache.org/cn/developers/submit-codes/)，成为贡献者之一；
* 如果您接触 ServiceComb不久并且很希望帮助我们，您可以先从[简单的任务](https://issues.apache.org/jira/browse/SCB-333?jql=project%20%3D%20SCB%20AND%20status%20%3D%20Open%20AND%20fixVersion%20in%20(EMPTY%2C%20java-chassis-1.0.0-m2)%20AND%20labels%20%3D%20newbie)入手，循序渐进，甚至成长为Committer；
* 如果在使用ServiceComb的过程中发现有功能无法满足您的需求或出现问题，请在Issues中记录，并Watch项目，这样一旦这个问题有进展，都会第一时间通知到您。

## 初次接触
有下面的方式加入ServcieComb社区：

- 订阅我们的[邮件列表](http://servicecomb.apache.org/cn/developers/subscribe-mail-list)，并为您关注的话题发表意见；
- 来[Gitter](https://gitter.im/ServiceCombUsers/Lobby)和大家打个招呼吧！

## 改进文档
文档是用户了解Apache ServiceComb最主要的方式，也是我们最需要帮助的地方！

因此如果您对改进文档的质量感兴趣，不论是修订一个页面的地址、更正一个链接、以及写一篇更优秀的入门文档，我们都非常欢迎！

我们的文档大多数是使用markdown格式编写的，您需要同步我们的[Website](https://github.com/apache/servicecomb-website)项目，直接在 github上编辑后提交PR即可。

## 如果发现了一个Bug或问题

请提交一个新的Issue在我们的[issue tracker](https://issues.apache.org/jira/browse/SCB)上，如果您能够提供一个JUnit测试用例来复现这个问题，那么我们就能够更快的解决它，例如已经有的[例子](https://github.com/apache/servicecomb-pack/tree/master/alpha/alpha-core/src/test/java/org/apache/servicecomb/pack/alpha/core)，并且我们还能够持续的确认这个问题不会再次出现在未来的版本中。

## 编写代码

ServiceComb的所有项目都在 [Github](https://github.com/search?q=org%3Aapache+servicecomb)上，包含下面几个子项目：

| 项目名                                                                        | 项目简介                   | 编程语言 |
|-------------------------------------------------------------------------------|----------------------------|----------|
| [servicecomb-java-chassis](https://github.com/apache/servicecomb-java-chassis)       | Java微服务框架（SDK）      | Java     |
| [servicecomb-service-center](https://github.com/apache/servicecomb-service-center)               | 服务中心（服务注册及发现） | Golang       |
| [servicecomb-pack](https://github.com/apache/servicecomb-pack)                                   | 支持Saga/TCC等多协议的分布式事务方案   | Java     |
| [servicecomb-mesher](https://github.com/apache/servicecomb-Mesher)       | 微服务网格      | Golang    |
| [servicecomb-kie](https://github.com/apache/servicecomb-kie)                                   |  微服务配置管理中心  | Golang    |
| [servicecomb-toolkit](https://github.com/apache/servicecomb-toolkit)               | 基于契约的微服务开发工具 | Java       |
| [servicecomb-samples](https://github.com/apache/servicecomb-samples)                                   | 提供了微服务示例   | Java     |
| [servicecomb-fence](https://github.com/apache/servicecomb-fence)               | ServiceComb Java-chassis安全认证解决方案 | Java       |
| [servicecomb-docs](https://github.com/apache/servicecomb-docs) | ServiceComb用户手册            | CSS |
| [servicecomb-website](https://github.com/apache/servicecomb-website) | ServiceComb网站            | HTML |
| [servicecomb-saga-actuator](https://github.com/apache/servicecomb-saga-actuator)                                   | 集中式Saga事务协调器 （归档）   | Java     |

如果希望给ServiceComb提交代码，您需要从github上fork对应的项目至您的项目空间下，为您提交的代码创建一个新的分支，添加源项目为upstream，并提交PR，更详细的步骤可以参考[这篇文档](http://servicecomb.apache.org/cn/developers/submit-codes/)。

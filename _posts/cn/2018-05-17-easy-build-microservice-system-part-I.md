---
title: "轻松微服务系列：使用脚手架功能一键构建微服务"
lang: cn
ref: easy-build-microservice-system-part-I
permalink: /cn/docs/easy-build-microservice-system-part-I/
excerpt: "轻松微服务系列：使用脚手架功能一键构建微服务"
last_modified_at: 2018-05-17T19:05:00+08:00
author: Yangyong Zheng
tags: [Archetypes, Scaffold]
redirect_from:
  - /theme-setup/
---

## 轻松微服务系列：使用脚手架功能一键构建微服务
提到微服务，相信“程序猿”们已经不再陌生，估计大家都多少尝试过微服务框架，也遇到了不少“坑”直呼坑爹吧？实际上微服务的初衷正是为了“解放”开发者，使得系统构建的过程更加轻松愉快，所以我们开了这个“轻松微服务系列”，和大家一起愉快的走一遭！废话不多说，上菜：

### 牛刀小试
打开命令行，输入下面的命令：
```bash
mvn org.apache.maven.plugins:maven-archetype-plugin:2.4:generate -DarchetypeGroupId=org.apache.servicecomb.archetypes -DarchetypeArtifactId=business-service-jaxrs-archetype -DarchetypeVersion=1.0.0-m2-SNAPSHOT -DarchetypeRepository=https://repository.apache.org/content/groups/snapshots-group
```

>提示：由于ServiceComb Archetypes还处于SNAPSHOT阶段，Repository托管在Apache Snapshots库中，所以下载速度会稍慢。

之后按提示指定微服务的`groupId`，`artifactId`，`version`，`package`等信息，回车，一个新的微服务就创建好了：

![Archetypes创建](/assets/images/scaffold/ArchetypesCreate.png)

运行它也很简单，使用IDE打开项目，DEBUG -> Application.java，或在命令行：

```bash
#编译打包
mvn package
#切换到输出目录
cd target
#启动可执行jar包
java -jar xxxx.jar
```

稍等微服务就启动好了，打开浏览器输入`http://localhost:8080/hello`验证一下：

![输出hello](/assets/images/scaffold/OutputHello.png)

是不是非常轻松呢？这份轻松来源我们使用Archetypes优化了构建过程，它是脚手架的基础。

### 脚手架
在建筑领域，脚手架是施工现场为方便工人操作并解决垂直和水平运输而搭设的各种支架以及平台。

![scaffold](/assets/images/scaffold/Scaffold.jpg)

在软件开发领域，它引申为预提供一些基础框架代码加速开发过程，避免从零开始构建项目。用户只需要依据需求场景选择合适的脚手架，然后填充定制的业务逻辑即可，不必再去处理一些基础功能，例如数据库连接、日志实现、RPC传输等。

微服务框架一般都会提供脚手架功能，例如Spring，提供了Spring initializr：

![SpringInitializr](/assets/images/scaffold/SpringInitializr.png)

它集成了Spring Boot和Spring Cloud丰富的组件，不过比较遗憾的是它基本没有提供代码级别的示例，更像是一个**“POM组合器”**。

相比之下，微服务框架ServiceComb Java Chassis支持多种编程模型，每一种编程模型都提供了对应的[Archetypes项目](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/archetypes)，包括SpringMVC、JAXRS、POJO和Spring Boot Starter，并且未来还会提供**Edge Server**、**Authcation Server**等更贴近业务的脚手架项目，让用户能快速构建体系完整的微服务系统。

什么叫一个完整的微服务系统呢？我们可以拿一个具体的场景做例子，会更有感觉：

### 地产CRM
您经营着一家房地产开发商，销售房产，迫切需要一套销售系统，考虑到微服务的优势，您决定使用微服务的方式构建系统；主要的业务流程也非常简单：用户前来购买购买产品（房产），首先需要登记用户信息，并缴纳一定数量的定金，待交易当日，挑选心仪的产品（房产），支付尾款，完成交易。

微服务的的拆分是一门非常有讲究的学问，即DDD（Domain-Driven Design），不在本文的阐述内，直接上成果：

![system-components](/assets/images/scaffold/SystemComponents.png)

拆分出来的微服务功能介绍如下：
1. 前端UI服务：用户交互界面；
2. Edge服务：很多时候也被称为API网关（API Gateway），负责集中认证、动态路由等等；
3. 用户服务：提供用户信息管理服务，这里保存这用户的账号和密码，负责登录和认证；同时由于房产是非常昂贵的产品，交易前需要收取一定的定金，因此每一个用户都会保存已缴纳的定金金额；
4. 产品（资源）服务：提供产品管理服务，保存着房产的信息诸如价格、是否已售出等信息；
5. 支付服务：提供交易时支付服务，模拟对接银行支付购房尾款；
6. 交易服务：提供产品交易服务，它通过编排调用将整个交易流程串起来,交易服务中有两个流程：
  6.1. 定金支付
  Step1：通过用户服务验证用户身份；
  Step2：通过支付服务请求银行扣款；
  Step3：通过用户服务增加用户账号内的定金。
  后面两个步骤需要保证事务一致性。  
  6.2. 购房交易
  Step1 ：通过用户服务验证用户身份；
  Step2 ：通过资源服务确定用户希望购买的资源（房产）尚未售出；
  Step3 ：通过资源服务标记目标资源（房产）已售出；
  Step4 ：通过用户服务从用户账号中扣除定金；
  Step5 ：通过支付服务请求银行扣剩下的尾款；
  最后三个步骤需要保证事务一致性。  


从下一篇文章开始，我们将和您一起轻松愉快的开启构建之旅，敬请期待！
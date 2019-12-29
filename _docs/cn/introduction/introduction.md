---
title: "项目介绍"
lang: cn
ref: introduction
permalink: /cn/docs/introduction/
excerpt: "ServiceComb项目介绍"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}

## Apache ServiceComb

Apache ServiceComb 提供了融合开源生态的一站式微服务开源解决方案，致力于帮助企业、用户和开发者将应用轻松微服务化上云，实现对微服务应用的高效运维管理。

### ServiceComb架构

ServiceComb作为一个微服务解决方案，其包含多个产品，通过不同产品的组合，可以轻松应对微服务化的不同场景，为用户微服务化上云提供便利。

![1](/assets/images/docs/servicecomb/servicecomb.jpg)

### 服务中心（Service Center）:

Service Center 是一个服务注册中心，和其他注册中心一样，其主要作用在于解决服务的注册与发现，即动态路由的问题；同时为了更好的解决跨团队协作的问题，其增加了对契约（基于OpenAPI规范）服务的支持，与契约工具（[Tookit](aaa)）以及Java 微服务开发框架（[Java Chassis](bbb)）配合使用，可以使服务之间的通讯接口变得透明，从而使用户专注于业务开发。

了解更多：[用户手册](/cn/docs/products/service-center/install/)

### 配置中心（Kie）

Kie 是一个语义型的分布式系统配置中心，其专为云原生的分布式系统设计，旨在为用户提供动态配置下发的能力，同时将 key 的规则由传统的拼接型（a.b.timeout=10s）重新设计为通俗易懂的语义型（timeout(service=a,version=b)=10s），方便运维人员理解数据和入口，管理复杂的分布式系统配置。

了解更多：[用户手册](http://servicecomb.apache.org/docs/kie/0.1.0/index.html)

### 分布式事务（Pack）

Pack 是用于微服务应用程序的数据最终一致性解决方案。其有以下特性：

- 高可用性。协调器是无状态的，因此可以具有多个实例。
- 高可靠性。所有交易事件都永久存储在数据库中。
- 高性能。事务事件通过gRPC报告给协调器，事务负载由Kyro序列化/反序列化。
- 低入侵。您需要做的就是添加2-3个注释和相应的补偿方法。
- 易于部署。所有组件均可通过docker启动。
- 支持正向（重试）和反向（补偿）恢复。
- 易于扩展基于Pack的其他协调协议，现在我们可以直接使用Saga和TCC支持。

了解更多：[用户手册](https://docs.servicecomb.io/saga/zh_CN/)

### Java 微服务开发框架（Java Chassis）

Java Chassis 是基于Java的微服务开发框架，除提供服务注册发现、REST和高性能RPC通信、服务治理的常见功能外，其还具备以下五方面的特点：

- 分层解耦：整个框架分为编程模型、运行模型、通信模型，业务层只关心编程模型和契约定义，而运行模型、通信模型对业务透明。这样通过对统一契约的加持，可以做到在通信模型变化的时候，代码可以零改动，只需通过简单的配置即可，同时各个层都可分别扩展。
- 内置API-First支持：框架内部使用OpenAPI（Swagger）作为统一的契约描述方式，微服务开发时需使用契约描述的接口进行通信。对于不习惯先进行契约开发的用户，同时提供Code-First的开发模式，先写接口代码，微服务在启动时框架会自动生成契约并保存在服务管理中心。
- 多种开发方式：ServiceComb支持用户以SpringMVC、JAX-RS或透明RPC的方式开发微服务，可以进一步降低使用和学习的门槛。
- 开放性：支持Spring Boot和Spring Cloud，可以在Spring Boot上使用ServiceComb的组件，和其他Spring Cloud的相关组件一起工作。
- 高性能：整个框架内部全部采用reactive方式实现，内部处理全程无阻塞点，大幅提升处理性能。同时对外提供同步的开发接口，方便上层业务逻辑地开发。

了解更多：[快速入门](/cn/docs/products/java-chassis/quick-start/)  [用户手册](https://docs.servicecomb.io/java-chassis/en_US/index.html)

### 多语言运行环境 （Mesher）

Mesher 是 Apache servicecomb 的服务网格项目，它支持任意运行环境中的任意开发语言的应用快速接入ServiceComb 微服务体系。Mesher使用 go 语言基于 go-chassis 开源框架实现，以插件的形式支持负载均衡、流量控制、调用链追踪、熔断降级、服务治理、动态配置管理等微服务能力。Mesher目前支持sidecar和edgeservice两种运行模式。支持服务间使用http、grpc协议通信，有良好的可扩展性，用户可自行扩展自己的协议。Mesher以调用链的形式处理请求，可以根据配置自由裁剪处理函数。在控制面Mesher天然能够接入apache servicecomb微服务体系。并对当前主流的service-mesh具有兼容性，支持kubernetes，可接入Istio。

了解更多：[快速入门](/cn/docs/products/mesher/quick-start/)  [用户手册](http://servicecomb.apache.org/docs/mesher/1.6.3/index.html)

### 认证鉴权框架（Fence）

Apache ServiceComb-fence 总体思路是结合 OAuth 2 和 OpenID Connect 协议，提供满足用户多样性认证鉴权的需求。重点是保证系统内部的认证鉴权（包括使用第三方的认证能力）。OAuth 2 和 OpenID connect 协议最早是为“给第三方提供认证能力”而设计的，Apache ServiceComb-fence 在方案设计上和能力开放方面，符合协议的标准。协议设计是为生态构建型企业而生，Apache ServiceComb-fence 则是将这些能力更好的应用到生态参与型企业，帮助参与生态，也为未来构建生态。

了解更多：[用户手册](https://github.com/apache/servicecomb-fence/blob/master/README_ZH.md)

### 一键式微服务开发工具（Toolkit）

Apache ServiceComb Toolkit 是基于契约的微服务开发工具套件。提供契约、代码、文档相互转换及校验的能力，帮助用户一键式快速构建基于流行微服务框架和流行编程模型的微服务工程，降低微服务入门成本，使用户聚焦业务开发，提升遗留系统重构、开发效率。

特性：

- 遗留应用提取契约文件

  在基于SpringMVC/POJO/JAX-RS模型开发的应用中，一键提取符合OpenAPI规范的服务契约文件。

- 契约文件生成微服务工程

  输入符合OpenAPI规范的服务契约，一键生成以ServiceComb/SpringCloud/Swagger为底座，以及以SpringMVC/POJO/JAX-RS或SpringBoot为开发模型的微服务项目。

- 契约与代码一致性校验

  校验应用的实际实现（如数据和服务API）是否与样本服务契约描述一致。

- 契约的风格校验和兼容性校验

  风格校验检查契约是否符合[OAS 3.0.2规范][openapi-3.0.2]以及自定义的规则; 兼容性校验检查新旧两个版本的OAS的兼容性

- 契约/代码生成文档

  输入符合OpenAPI规范的服务契约，一键生成html格式的文档。

了解更多：[快速入门](/cn/docs/products/toolkit/quick-start/)

### 多服务中心同步工具（Syncer）

Syncer是一个多服务中心的同步工具，专为大型微服务架构设计。用于在网络互通的情况下，异构服务中心、跨区域的实例同步，未来将对跨网络、跨云等场景提供支持。Syncer以服务中心的伴生系统的形式而存在，主要负责从当前服务中心发现实例，并向网络其他成员进行广播；接收其他成员的广播，并拉取实例信息向当前服务中心进行注册。Syncer有如下特点：

- 业务架构零侵入，Syncer 以透明的形式为服务中心同步实例信息，不参与原业务流程，服务无需感知其存在。
- 不绑定服务中心，兼容生态，支持不同技术栈服务中心的接入。
- 基于Serf（gossip   协议的实现）构建无中心的对等网络，成员的自由加入与退出，对 Syncer 网络、服务中心均无影响。
- 以统一的数据结构在网络中进行传递，数据结构的转换被分散到各个 Syncer 中，其只需要处理当前服务中心数据结构与 SyncData 之间的转换，即可做到数据的最大兼容。
- 以 golang 插件的形式对服务中心提供支持，用户可自由的扩展需要接入的服务中心。新的服务中心加入，只需在其伴生的 Syncer 进行向 SyncerData 的转换，数据即可在   Syncer 网络中进行同步，无需其他成员配合。
- 服务的配置、部署、升级、维护等仍在单服务中心内完成，没有额外的业务维护成本增加。

了解更多：[快速入门](/cn/docs/products/syncer/quick-start/)


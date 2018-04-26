---
title: "如何设计一个优质的微服务框架：Apache ServiceComb 的开放性设计"    
lang: cn    
ref: open-design   
permalink: /cn/docs/open-design/   
excerpt: "本文讲述了整个 开源微服务框架 Apache ServiceComb 设计形成的前因后果，尝试从理念、思想和实践结合的维度剖析一个优质的微服务框架应该具备哪些要素，包括但不限于 对开发者友好、高性能、内外部扩展性>等。"   
author: Zen Lin, Bao Liu
tags: [设计, 开放，扩展]
redirect_from:   
  - /theme-setup/   
---

【摘要】 一个优质的微服务框架需要考虑的要素众多，在满足微服务设计理念的前提下，也是一个不断实践优化的过程。    
本文讲述了整个 开源微服务框架 Apache ServiceComb 设计形成的前因后果，尝试从理念、思想和实践结合的维度剖析一个优质的微服务框架应该具备哪些要素，包括但不限于 对开发者友好、高性能、内外部扩展性等。    
阅读本文有利于加深对微服务理念和框架的理解，给予微服务用户或开发者以帮助，这也是 Apache ServiceComb 的前身华为云微服务引擎的智慧结晶，从细节处承载了华为云自身多年云化转型的经验。       

<!-- more -->      

## 写在前面

[开源微服务框架 Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 的前身为华为云的 [微服务引擎 CSE (Cloud Service Engine) 云服务](https://support.huaweicloud.com/usermanual-servicestage/zh-cn_topic_0053812706.html),  ServiceComb 的早期版本和多数第一批做微服务或分布式框架先贤一样，为了追求高性能，做过非常多如 改善编码效率 和改进通信协议等尝试。然而，随着业务规模的递增，需求也逐渐呈现多样化，单方面通过传统手段追求高性能导致在面对多样化需求时遇到了各种挑战，遗留系统的通信、接入各种不同的终端、协议健壮性、防攻击等各种挑战迎面而来。

Apache ServiceComb，愿景是帮助企业快速构建云原生应用，通过一系列解决方案帮助用户快速开发微服务应用的同时实现对这些微服务应用的高效运维管理，保持中立性以避免厂商LockIn成为了关键任务。对于此， Apache ServiceComb 需要有友好的机制能够对接各微服务主流技术栈技术 或 开发框架。

在系列挑战的驱动下， Aapche ServiceComb 设计团队逐步形成了 “全面开放，使用标准协议，架构易于拆分和扩展，对开发人员友好，可以与业界其他主流框架互通集成” 的共识， 本文将着重分享这些共识是如何体现在Apache ServiceComb 的设计中的。   

## 开放和标准

开放和标准应用到设计的不同的层面。一方面是连接组织和开发人员，一方面是连接异构系统。组织和开发人员的复杂性来源于技能的多样性，大家使用不同的开发语言，同一种开发语言存在多样的开发习惯；系统的多样性来源于系统之间的通信协议，为了实现与异构系统的通信，必须具备良好的适配不同通信协议的能力。

### 连接组织和开发人员

#### 编程风格

每位技术人员都或多或少拥有自己的 Coding 习惯或爱好的技术， 使用个人熟练的方式从事技术工作往往更加高效和舒适。

[开源微服务框架 Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 的早期版本实现了 gRPC 协议，然而在项目演进过程中我们发现大量技术人员并不熟悉书写 IDL ， 对 IDL 具体支持哪些特性也不清楚。 大多数情况下，用户每碰到一个场景就需要翻开协议规范看一遍， 而 IDL 缺少配套的编辑或语法检查等工具也导致了开发效率的降低。

于是 Apache ServiceComb 设计团队开始思考是否有方法能够在确保保持用户开发习惯的前提下支持 gRPC 。

设计团队结合自己的 Java 编程史，分析当下主流框架，并听取社区用户的反馈找到了一些共性：

- 使用 RPC 方式描述对外接口。gRPC 、Corba 、WebService 等技术人员谙于此道。 
- 使用 JAX-RS 或 Spring MVC 风格开发 REST 接口。REST 风格开发随着微服务架构兴起，JAX-RS 和 Spring MVC 已然成为 Java REST 的开发事实标准， Spring 的拥抱者都比较熟悉。 

Apache ServiceComb 很快在社区设计层面达成了一致，通过缺省支持以上共性来拥抱90%的开发者， 让大多数的 Java 开发者们能够快速开始工作。

除以上共识外，Apache ServiceComb 还额外做了进一步的优化，以保证不同编程风格的兼容性，使用户或开发者倍感灵活及舒适。

在下面的例子中，展示了 Provider和Consumer 代码的各种实现，在同一个微服务中，这些编程方式可以同时出现；同一段 Consumer 代码中可以访问各种不同的编程风格的 Provider 实现。

**RPC 方式的 Provider**

```java
@RpcSchema(schemaId="hello")
public class HelloImpl implements Hello{
  @Override
  public String sayHi(String name){
    return"Hello"+name;
  }

  @Override
  public String sayHello(Person person){
    return"Helloperson"+person.getName();
  }
}
```

**JAX-RS 方式的 Provider**

*代码片段来自于 [Apache ServiceComb JAX-RS sample](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/jaxrs-sample)*

```java
@RestSchema(schemaId="jaxrsHello")
@Path("/jaxrshello")
@Produces(MediaType.APPLICATION_JSON)
public class JaxrsHelloImpl implements Hello{

  @Path("/sayhi")
  @POST
  @Override
  public String sayHi(String name){
    return"Hello"+name;
  }

  @Path("/sayhello")
  @POST
  @Override
  public String sayHello(Person person){
    return"Helloperson"+person.getName();
  }
}
```

**Spring MVC 方式的 Provider**

*代码片段来自于 [Apache ServiceComb Spring MVC sample](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/springmvc-sample)*

```java
@RestSchema(schemaId="springmvcHello")
@RequestMapping(path="/springmvchello",produces=MediaType.APPLICATION_JSON)
public class SpringmvcHelloImpl implements Hello{

  @Override
  @RequestMapping(path="/sayhi",method=RequestMethod.POST)
  public String sayHi(@RequestParam(name="name")String name){
    return"Hello"+name;
  }

  @Override
  @RequestMapping(path="/sayhello",method=RequestMethod.POST)
  public String sayHello(@RequestBody Person person){
    return"Helloperson"+person.getName();
  }
}
```

**RPC 方式访问上述三种服务的 Consumer**

```java
@RpcReference(microserviceName="hello",schemaId="hello")
private Hello hello;
System.out.println(hello.sayHi("JavaChassis"));
```

*以上代码片段全部出自 [Apache ServiceComb Samples](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/)，有兴趣者可阅读了解或贡献更多的智慧。*

直至此处，或许开发者会产生疑问，既然 Consumer 可以通过一致的 API 方式访问不同的Provider，为何还需要额外的 JAX-RS 和 Spring MVC 标签？

原因是，这里的设计依据是 [Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/)的 Consumer考虑的不仅限于 类SDK 的 Consumer，还有浏览器等非 SDK 类的 Consumer，浏览器的 Conumer 识别的是 Http 形式的消息。 通过定义和使用这些标签， 我们可以更加精细的指定浏览器如何访问后台接口。 类似于 Web Service 的 WSDL 描述语言， Apache ServiceComb 称之为[服务契约](http://servicecomb.incubator.apache.org/cn/users/service-contract/)。

服务的契约会在服务运行时通过代码定义自动生成，并注册到[服务中心](https://github.com/apache/incubator-servicecomb-service-center)。契约也可在运行时用于独立的服务治理逻辑开发，生成 Consumer 代码。此外，也可作为 API 文档对外发布，供非 SDK 的 Consumer 参考。

#### **[服务契约](http://servicecomb.incubator.apache.org/cn/users/service-contract/)**

微服务强调服务自治，对外体现的功能全部以松耦合的接口方式提供，并且只能以通信的方式实现相互访问。此原则给团队协作带来了根本性的变革。

微服务的一个开发团队通常由5~6个人的全功能团队组成，端到端的完成 场景需求分析、架构功能设计、开发和运维，团队组织结构和业务系统的架构相匹配。团队建立后的核心问题就是团队之间如何进行高效的协作沟通，以决定不同微服务之间的协作通信。

[Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 通过确保让开发人员保持自己的固有编程习惯及设计上的松耦合灵活性，让微服务团队之间可以进行高效协作，以避免在不同的微服务团队讨论编程风格受限于历史旧账而浪费宝贵的精力和时间。

在 RPC 的世界里，有 Corda IDL，WSDL，ProtoBuffer 等可以参考的优秀实践， REST 风格的接口让团队之间可以通过 HTTP 语义进行沟通，但却不能像 IDL 一样描述跨语言的数据格式。Open API 的出现很好地解决了这个问题。

Open API 首先是一个不断发展壮大中的开放的标准。Open API 能兼顾 RPC 、REST 等不同的开发方式，并且吸收了大量的跨语言经验，能够在不同的语言之间进行解析。

 对于 Java 开发者，下面的代码片段是日常所打交道的：

```yaml
User:
  type:object
  properties:
age:
  type:integer
```

如果开发人员有丰富的跨语言开发经验，可以看出 Swagger 在解决跨语言编程方面API定义冲突的努力， 如 Swagger 通过 format 来定义数据类型的存储格式，以解决不同的语言在数据类型表示上的差异：

```yaml
User:
  type:object
  properties:
age:
  type:integer
  format:int32
```

[开源微服务框架 Apache SerivceComb](http://servicecomb.incubator.apache.org/cn/) 既遵循常规开发规范也特别关注开发效率。开发者可以先写接口定义后写代码， 也可直接通过自己熟悉的方式编写写代码， 两种方式都会生成 [服务契约](http://servicecomb.incubator.apache.org/cn/users/service-contract/)（Open API 描述文件），并且将内容注册到[服务中心](https://github.com/apache/incubator-servicecomb-service-center)。使用者可以从服务中心下载相关的服务契约进行开发。 Apache ServiceComb 的各种治理结构也是基于契约的，可以让开发者独立于业务实现对系统进行统一的管控治理。

### 连接异构系统

[开源微服务框架 Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 早期版本提供了gRPC、REST、SOAP等多种协议，当前主要[支持 REST 和Highway 高性能私有 RPC 两种协议](http://servicecomb.incubator.apache.org/cn/users/communicate-protocol/)。

#### [Highway 高性能私有 RPC 协议](http://servicecomb.incubator.apache.org/cn/users/communicate-protocol/#highway-rpc%E5%8D%8F%E8%AE%AE)

gRPC 相对于 REST 的最显著优点就是性能，它采用长连接、高效的二进制序列化方式，提供多种语言支持， 提供了 IDL 语言约束开发者按照标准的方式工作， 一切看起来是那么的完美。

实际上，[Apache ServiceComb ](http://servicecomb.incubator.apache.org/cn/)的第一轮重构，首选也是 gRPC 。历史第一次在[华为云 微服务引擎 CSE](https://support.huaweicloud.com/usermanual-servicestage/zh-cn_topic_0053812706.html) 上线以后，面对了来自网关压力挑战。

网关作为业务接入端，必须高效的管理连接和保证公平，长连接容易导致拒绝服务。gRPC 程序开发完成后，开发人员无法利用系统提供的各种工具进行测试，网络包分析也变得困难，给生产环境上的开发联调造成了困难。随着业务规模的增长，gRPC 面临了诸如“其他三方系统如何与之直接通信？ 如何跨网关与它间接通信？”等更严峻的挑战。

解决这些问题，将需要我们扩展和改善老的协议和程序，提供 gRPC 客户端支持，开发者需自行提供一个额外的表示层用于业务接口的逻辑转换，造成大量的重复代码。同时由于 gRPC 依赖于接口定义，并根据定义生成代码，一套代码只能跑在 gRPC 协议上，如果用户希望业务应用可以使用如 REST等其他更加灵活的方式， 就需自行重新实现一套新的代码逻辑。据以上的血泪史， gRPC 最终被 Apache ServiceComb 设计团队定义为只能在中小型系统内部之间使用，并通过协议网关与外部系统进行通信。并实现了 [高性能私有协议 Highway](http://servicecomb.incubator.apache.org/cn/users/communicate-protocol/#highway-rpc%E5%8D%8F%E8%AE%AE) 作为RPC首选默认协议。

#### [REST 通信协议](http://servicecomb.incubator.apache.org/cn/users/communicate-protocol/)

REST 相较 gRPC ，最大的痛点是性能。

多数技术人员脑海里一个不成文的根深蒂固的观点：”二进制编码效率远高于文本协议，采用二进制编码的系统的性能远高于采用文本的 HTTP ”。该观点甚至会让多数决策止步于理论，多数人甚至不愿尝试去优化 REST。

可喜的是 [开源微服务框架 Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 迈出了重构 REST 底层通信实现的第一步，基于 Netty 的异步框架来替换 Tomcat 实现，实践的效果大大超出预期，部分基准测试数据结果显示比 gRPC 还好， gRPC最终输在了HTTP2 协议上的额外报文。

优化后的 REST 和业界开源的其他基于二进制的 RPC 实现的性能基本持平。在一个简单的提供数据库查询的代码逻辑中，优化后的REST通信框架处理时间，占比总处理时间远小于千分之一，这意味着再继续在框架层面进行大量优化也抵不上业务应用层面最简单的一个操作带来的消耗，Apache ServiceComb对 REST 的优化已经满足要求，最终也选择了 [REST](http://servicecomb.incubator.apache.org/cn/users/communicate-protocol/) 作为首选和缺省协议(HTTP + json)。

我们并没有就此止步。

需要迁移到 [华为云 微服务引擎 CSE](https://support.huaweicloud.com/usermanual-servicestage/zh-cn_topic_0053812706.html)  的业务日益增长，部分历史遗留系统也需进行对接。通信协议对应不同的开发者接口，每每增加通信协议，则需要对业务代码进行大量的重复构建，造成大量无谓消耗。这是当时的华为云化转型以及当下很多云化转型企业或者云原生企业必将面临的痛点。

于是乎，通信协议层被剥离了出来，和业务代码隔离，系统运行基于契约，[开源微服务框架 Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 实现通信协议扩展机制。通信协议扩展机制，帮助用户解决与 gRPC 框架、自定义二进制框架等许多遗留系统的对接通信问题。

在 Apache ServiceComb 框架中，[切换协议](http://servicecomb.incubator.apache.org/cn/users/communicate-protocol/)非常简单，不需要修改一行业务代码。多个协议共存也是允许的。

```yaml
ServiceComb:
  rest:
    address:0.0.0.0:8084
  highway:
    address:0.0.0.0:8094
```



## 扩展性

扩展性是系统进一步发展的基石。[开源微服务框架 Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 创造性地将扩展性拓展到 Provider 和 Consumer，让开发者拥有一致的开发体验。

### 内部系统结构

连接开发者和通信协议层面已经让系统具备了很大的扩展性。微服务化给系统解耦、团队自治带来了很大的灵活性，加快了开发生产效率，但同时带来了服务管控的复杂性，在微服务领域，不得不考虑雪崩效应、调用跟踪、性能监控与分析等实际管控治理问题。

基于服务契约，[开源微服务框架 Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 提供了[动态插拔扩展的处理链机制](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/handlers)，并且为这些管控治理能力提供了默认实现，用户可以灵活插拔这些处理模块，或调整它们的顺序以应对不同的处理场景，或自行实现以增加新的处理模块。Provider 和 Consumer 都会经过该处理链，这给客户端治理功能开发带来了极大的便利性。Apache ServiceComb 的运行结构如下：

![running-arch]({{ site.url }}{{ site.baseurl }}/assets/images/open-design-running-arch.png){: .align-center}    
图1 Apache ServiceComb 运行时架构      
{: .figure-caption}

Apache ServiceComb 同时支持同步和异步两种编程接口，并在通信实现上采用了纯异步方式，对于运行模型的扩展，也是基于异步回调接口的。该方式提供了比同步模式（比如 Filter）更加优雅灵活的扩展方式。

在Apache ServiceComb 结构中，几个核心的扩展机制均在 [core 模块](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/core/src/main/java/org/apache/servicecomb/core) 进行定义：

**[Producer Provider](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/core/src/main/java/org/apache/servicecomb/core/provider/producer)**

Provider 编程模型的扩展，通过实现这个接口，可以适配不同的 Provider编 程风格；默认支持 RPC、Spring MVC 和 JAX-RS 三种风格。

**[Consumer Provider](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/core/src/main/java/org/apache/servicecomb/core/provider/consumer)**

Consumer 编程模型的扩展，通过实现这个接口，可以适配不同的 Consumer 编程风格；默认支持 RPC和RestTemplate 两种风格。RestTemplate 是 Spring MVC 提供的 REST 编程接口，可以在服务层解除接口依赖，只依赖数据模型。

**[Handler](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/core/src/main/java/org/apache/servicecomb/core/handler)**

处理链的接口，通过扩展该接口，可以在处理过程中插入任意的逻辑。默认已经支持[负载均衡](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/handlers/handler-loadbalance)、[错误注入](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/handlers/handler-fault-injection)、[流量控制](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/handlers/handler-flowcontrol-qps)和[调用链跟踪](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/handlers/handler-tracing-zipkin)等多个处理链。开发者可以针对 Consumer 和 Provider 定义不同的处理链，并且为访问不同的微服务定制不同的处理链。

**[Transport](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/transports)**

通信协议扩展，默认支持[REST over Vertx、Rest over Servlet、Highway](http://servicecomb.incubator.apache.org/cn/users/communicate-protocol/)协议。

**Invocation**

中立的对象。所有的运行模型都面向这个中立的对象进行编程，当定义好服务接口后，对服务的治理和服务业务逻辑的开发可并行进行。在编程模型和通信模型里面，也面向这个对象进行编解码。

### 对接外部系统

[Apache ServiceComb Java-chassis](https://github.com/apache/incubator-servicecomb-java-chassis) 预留了对接外部系统的接口，以让开发者或用户可以灵活快速切换使用第三方提供的服务，这里所指的外部系统包括但不限于：服务注册发现的服务中心、配置管控和治理的配置中心、运行监控和运维的治理中心等。

下图展示了不同的开发框架支持和运行的第三方系统情况，这些基础服务都给开发者预留了可以进行支持接入的接口。

![third-party-plugin]({{ site.url }}{{ site.baseurl }}/assets/images/open-design-third-party-plugin.png){: .align-center}     
图2 Apache ServiceComb 外部扩展接入       
{: .figure-caption}

重要的扩展：

**[ServiceRegistryClient](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/service-registry/src/main/java/org/apache/servicecomb/serviceregistry/client):**

实现这个接口以对接不同的注册服务。

**[ConfigCenterConfigurationSource](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/foundations/foundation-config)**

 实现这个接口以对接不同的配置服务。

此外，ServiceComb还提供了对接[Zipkin](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/tracing/tracing-zipkin)、Servo等开源系统的功能，这些可以从[github代码](https://github.com/apache/incubator-servicecomb-java-chassis/)中查找到对应的例子。

### 运行环境集成

一个完整的业务系统不是使用RPC框架就算完成了，它们还需要其他的计算资源。对于一般的业务系统都需要访问数据库，或者基于 J2EE 的设施进行工作。

[开源微服务框架 Apache ServiceComb](http://servicecomb.incubator.apache.org/cn/) 可以以轻量级的方式运行，也可集成到其他系统框架。下面的示意图说明了 Apache ServiceComb 的一些工作环境。

![integrate-with-running-environment]({{ site.url }}{{ site.baseurl }}/assets/images/open-design-integrate-with-running-environment.png){: .align-center}     
图3 Apache ServiceComb 运行环境集成      
{: .figure-caption}

- 若业务只需 REST 接口，可以轻量级的方式运行 Apache ServiceComb 。所有的REST接口运行于ServiceComb 提供的 Netty HTTP 之上。
- 若业务是基于 J2EE 来构建，那么 Apache ServiceComb 可以作为一个 Servlet ，运行于 Web 容器里面（如 Tomcat、Jetty 等）。
- 若业务基于 Spring Boot 生态构建，Apache ServiceComb 可作为一个starter对外提供 REST 服务，开发者可以自由使用其他基于 Spring Boot 的功能。

由于 Apache ServiceComb 使用了Spring，因此天然继承了Spring的原有优势，可和很多通用的组件很好的集成，如 mybatis、JPA 等。各种集成方式，都可以从[ServiceComb官网](http://servicecomb.incubator.apache.org/cn/)或者[ServiceComb 示例库](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/demo)找到对应的例子。

## 写在最后

开源微服务框架 Apache ServiceComb 的主体代码是由华为云微服务引擎捐赠给 Apache 软件基金会的，愿景是帮助企业快速构建云原生应用，通过一系列解决方案帮助用户快速开发微服务应用的同时实现对这些微服务应用的高效运维管理。本次设计团队将开放性设计部分细节点点滴滴分享出来也是为了能够解放开发者和用户。

当前越来越多的贡献者已加入到 社区行列，Apache ServiceComb 会和这些志愿者们一起一如既往坚持这个理念，争取给业界带来更多好的技术和分享。也期望有更多有志者一起行动。

[**如何加入Apache ServiceComb 社区**](http://servicecomb.incubator.apache.org/cn/docs/join_the_community/)

**致谢原稿作者： 刘宝**

**参考文献**

[1] 开源微服务框架 Apache ServiceComb 官网

[http://servicecomb.incubator.apache.org/cn/](http://servicecomb.incubator.apache.org/cn/)

[2] 开源微服务框架 Apache ServiceComb 代码

[https://github.com/apache/incubator-servicecomb-java-chassis](https://github.com/apache/incubator-servicecomb-java-chassis)

[https://github.com/apache/incubator-servicecomb-service-center](https://github.com/apache/incubator-servicecomb-service-center)

[https://github.com/apache/incubator-servicecomb-saga](https://github.com/apache/incubator-servicecomb-saga)

[3] 华为云微服务引擎 CSE（Cloud Service Engine）

入口 [https://www.huaweicloud.com/product/cse.html](https://www.huaweicloud.com/product/cse.html)

资料 [http://support.huaweicloud.com/cse_dld/index.html](http://support.huaweicloud.com/cse_dld/index.html)



 

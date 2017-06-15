---
title: "Linux Con Workshop Demo"
permalink: /docs/linuxcon-workshop-demo/
excerpt: "A step by step guide on how to use ServiceComb to develop a complete project"
last_modified_at: 2017-06-15T09:38:43+08:00
author: Sean Yin
redirect_from:
  - /theme-setup/
---

为了读者能更容易了解ServiceComb的功能以及如何用其快速开发微服务，所以提供大家耳熟能详的例子，降低学习曲线的同时，增加趣味性，加深理解。

本文中假设我们成立了一家科研公司，处理复杂的数学运算，以及尖端生物科技研究，并为用户提供如下服务：
* 黄金分割数列计算
* 蜜蜂繁殖规律 (计算每只雄蜂/雌蜂的祖先数量)

但是我们如何将公司的这些强大运算能力提供给我们的消费者呢？

{% include toc %}

## 业务场景
让我们先对业务场景进行总结分析
1. 为了公司持续发展，我们需要对用户消费的运算能力收费，所以我们聘用了**门卫**认证用户，避免不法分子混入
1. 为了提供足够的黄金分割数量运算能力，我们需要雇佣相应的**技工**
1. 为了持续研究蜜蜂繁殖规律，公司建立了自己的蜂场，需要相应的**养蜂人**进行管理研究
1. 为了平衡**技工**、**养蜂人**、和**门卫**的工作量和时间，我们建立了**告示栏**机制，让当前有闲暇的人员发布自己的联系方式，以便我们能及时联系技能匹配的人员以服务到来的用户
1. 因为运算能力成本高昂，我们将运算项目进行了**归档**，以便未来有相同请求时，我们能直接查询**项目归档**，节省公司运算成本
1. 面对上述复杂的场景，我们又聘用了**部门经理**来管理公司成员和设施
1. 最后，当公司日益壮大，用户数量暴涨时，我们还需要招聘更多**技工**、**养蜂人**、和**门卫**，所以增加了**人力资源**部门

## 公司结构 (系统架构)
到现在业务场景已经比较清晰，我们把上述职务部门和设施画成公司组织结构图。
![company structure]({{ site.url }}{{ site.baseurl }}/assets/images/workshop-company-structure.png){: .align-center}

现在公司组织结构已经完整，让我们着手搭建相应部门。

## 前期准备
在这个演示项目中，我们会用到 `Spring Boot` 框架搭建应用基础，请先到 `Spring Boot` [官方网页](http://start.spring.io/) 下载基础项目。

![spring boot]({{ site.url }}{{ site.baseurl }}/assets/images/workshop-spring-starter.png){: .align-center}

## 技工 (Worker)
因为技工最为简单，对其他部门人员依赖最少，我们首先搭建这个部门。

### 黄金分割运算服务
技工的主要工作时提供黄金分割数列计算服务，当用户需要知道第n个黄金分割数时，技工以最快的速度计算出数值并返回给用户。
我们可以把这个工作简化为如下数学方程:

    value = fibo(n)

在暂时不考虑性能的情况下，我们可以迅速实现黄金分割数列的计算。
```java
interface FibonacciService {
  long term(int n);
}

@Service
class FibonacciServiceImpl implements FibonacciService {
  @Override
  public long term(int n) {
    if (n == 0) {
      return 0;
    } else if (n == 1) {
      return 1;
    }

    return term(n - 1) + term(n - 2);
  }
}
```

### 技工服务端点
黄金分割数量运算已经实现，现在我们需要将服务提供给用户，首先我们定义端点接口：

```java
public interface FibonacciEndpoint {
  long term(int n);
}
```

引入 `ServiceComb` 依赖：

```xml
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>spring-boot-starter-provider</artifactId>
    </dependency>

```

接下来我们同时暴露黄金分割运算服务的**Restful**和**RPC**端点：

```java
@RestSchema(schemaId = "fibonacciRestEndpoint")
@RequestMapping("/fibonacci")
@Controller
public class FibonacciRestEndpoint implements FibonacciEndpoint {

  private final FibonacciService fibonacciService;

  @Autowired
  FibonacciRestEndpoint(FibonacciService fibonacciService) {
    this.fibonacciService = fibonacciService;
  }

  @Override
  @RequestMapping(value = "/term", method = RequestMethod.GET)
  @ResponseBody
  public long term(int n) {
    return fibonacciService.term(n);
  }
}

@RpcSchema(schemaId = "fibonacciRpcEndpoint")
public class FibonacciRpcEndpoint implements FibonacciEndpoint {

  private final FibonacciService fibonacciService;

  @Autowired
  public FibonacciRpcEndpoint(FibonacciService fibonacciService) {
    this.fibonacciService = fibonacciService;
  }

  @Override
  public long term(int n) {
    return fibonacciService.term(n);
  }
}
```

这里用 `@RestSchema` 和 `@RpcSchema` 注释两个端点后，`ServiceComb` 会自动生成对应的服务端点契约，根据如下 
`microsevice.yaml` 配置端点端口，并将契约和服务一起注册到[Service Center](https://github.com/ServiceComb/service-center)：

```yaml
# all interconnected microservices must belong to an application wth the same ID
APPLICATION_ID: company
service_description:
# name of the declaring microservice
  name: worker
  version: 0.0.1
# service center address
cse:
  service:
    registry:
      address: http://sc.servicecomb.io:9980
  highway:
    address: 0.0.0.0:7070
  rest:
    address: 0.0.0.0:8080
```

最后，提供技工服务应用启动入口，并加上 `@EnableServiceComb` 注释启用 `ServiceComb` ：

```java
@SpringBootApplication
@EnableServiceComb
public class WorkerApplication {

  public static void main(String[] args) {
    SpringApplication.run(WorkerApplication.class, args);
  }
}
```

## 告示栏 (Bulletin Board)
**告示栏**提供为**门卫**、**技工**和**养蜂人**注册联系方式的设施，同时**经理**和**养蜂人**可通过此设施查询注册方的联系方式，以方便匹配能力的提供和消费。

`Service Center` 提供契约和服务注册、发现功能，而且校验服务提供方和消费方的契约是否匹配，我们可以[下载](https://github.com/ServiceComb/service-center/releases)编译好的版本直接运行。

## 养蜂人 (Beekeeper)
**养蜂人**研究蜜蜂繁殖规律，计算每只蜜蜂 (雄蜂/雌蜂) 的祖先数量。因为蜜蜂繁殖规律和黄金分割数列相关，所以**养蜂人**同时消费**技工**提供的计算服务。

[研究](http://www.dave-cushman.net/bee/fibonacci.html)表明，雄蜂(Drone)由未受精卵孵化而生，只有母亲；而雌蜂(Queen)由受精卵孵化而生，既有母又有父。

<figure class="align-center">
  <img src="{{ site.url }}{{ site.baseurl }}/assets/images/fibonaccitree.gif" alt="bee ancestors">
  <figcaption>Credit: [Dave Cushman's website](http://www.dave-cushman.net)</figcaption>
</figure> 

参考上图，蜜蜂的某一代祖先数量符合黄金分割数列的模型，由此我们可以很快实现服务功能。

### 蜜蜂繁殖规律研究服务
首先我们定义黄金数列运算接口：

```java
public interface FibonacciCalculator {

  long term(int n);
}
```

接下来定义并实现蜜蜂繁殖规律研究服务:
```java
interface BeekeeperService {
  long ancestorsOfDroneAt(int generation);

  long ancestorsOfQueenAt(int generation);
}

class BeekeeperServiceImpl implements BeekeeperService {

  private final FibonacciCalculator fibonacciCalculator;

  BeekeeperServiceImpl(FibonacciCalculator fibonacciCalculator) {
    this.fibonacciCalculator = fibonacciCalculator;
  }

  @Override
  public long ancestorsOfDroneAt(int generation) {
    if (generation <= 0) {
      return 0;
    }
    return fibonacciCalculator.term(generation + 1);
  }

  @Override
  public long ancestorsOfQueenAt(int generation) {
    if (generation <= 0) {
      return 0;
    }
    return fibonacciCalculator.term(generation + 2);
  }
}
```

这里我们用到之前定义的 `FibonacciCalculator` 接口，并希望通过这个接口远程调用**技工**服务端点。`@RpcReference` 
注释能帮助我们自动从[Service Center](https://github.com/ServiceComb/service-center)中获取 
`microserviceName = "worker", schemaId = "fibonacciRpcEndpoint"` ， 即服务名为 `worker` 已经schema ID为 
`fibonacciRpcEndpoint`的端点：

```java
@Configuration
class BeekeeperConfig {

  @RpcReference(microserviceName = "worker", schemaId = "fibonacciRpcEndpoint")
  private FibonacciCalculator fibonacciCalculator;

  @Bean
  BeekeeperService beekeeperService() {
    return new BeekeeperServiceImpl(fibonacciCalculator);
  }
}
```

我们在**技工**一节已定义好对应的服务名和schema ID端点，通过上面的配置，`ServiceComb` 会自动将远程**技工**服务
实例和 `FibonacciCalculator` 绑定在一起。

### 养蜂人服务端点
与上一节**技工**服务相似，我们在这里也需要提供养蜂人服务端点，让用户可以进行调用：

```java
@RestSchema(schemaId = "beekeeperRestEndpoint")
@RequestMapping("/rest")
@Controller
public class BeekeeperController {

  private static final Logger logger = LoggerFactory.getLogger(BeekeeperController.class);

  private final BeekeeperService beekeeperService;

  @Autowired
  BeekeeperController(BeekeeperService beekeeperService) {
    this.beekeeperService = beekeeperService;
  }

  @RequestMapping(value = "/drone/ancestors/{generation}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
  @ResponseBody
  public Ancestor ancestorsOfDrone(@PathVariable int generation) {
    logger.info(
        "Received request to find the number of ancestors of drone at generation {}",
        generation);

    return new Ancestor(beekeeperService.ancestorsOfDroneAt(generation));
  }

  @RequestMapping(value = "/queen/ancestors/{generation}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
  @ResponseBody
  public Ancestor ancestorsOfQueen(@PathVariable int generation) {
    logger.info(
        "Received request to find the number of ancestors of queen at generation {}",
        generation);

    return new Ancestor(beekeeperService.ancestorsOfQueenAt(generation));
  }
}

class Ancestor {
  private long ancestors;

  Ancestor() {
  }

  Ancestor(long ancestors) {
    this.ancestors = ancestors;
  }

  public long getAncestors() {
    return ancestors;
  }
}
```

因为**养蜂人**需要消费**技工**提供的服务，所以其 `microservice.yaml` 配置稍有不同：

```yaml
# all interconnected microservices must belong to an application wth the same ID
APPLICATION_ID: company
service_description:
# name of the declaring microservice
  name: beekeeper
  version: 0.0.1
cse:
  service:
    registry:
      address: http://sc.servicecomb.io:9980
  rest:
    address: 0.0.0.0:8090
  handler:
    chain:
      Consumer:
        default: bizkeeper-consumer,loadbalance
  references:
#  this one below must refer to the microservice name it communicates with
    worker:
      version-rule: 0.0.1
```

这里我们需要定义 `cse.references.worker.version-rule` ，让配置名称中指向**技工**服务名 `worker` ，并匹配其版本号。

最后定义养蜂人服务应用入口：

```java
@SpringBootApplication
@EnableServiceComb
public class BeekeeperApplication {

  public static void main(String[] args) {
    SpringApplication.run(BeekeeperApplication.class, args);
  }
}
```


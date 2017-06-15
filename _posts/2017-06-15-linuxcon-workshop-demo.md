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

假如我们成立了一家科研公司，处理复杂的数学运算，以及尖端生物科技研究，并为用户提供如下服务：
* 黄金分割数列计算
* 蜜蜂繁殖规律 (计算每只雄蜂/雌蜂的祖先数量)

但是我们如何将公司的这些强大运算能力提供给我们的消费者呢？

{% include toc %}

## 业务场景
让我们先对业务场景进行总结
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
`microsevice.yaml` 配置端点端口，并将契约和服务一起注册到[服务中心](https://github.com/ServiceComb/service-center)：

```yaml
# all interconnected microservices must belong to an application wth the same ID
APPLICATION_ID: company
service_description:
# name of the declaring microservice
  name: worker
  version: 0.0.1
cse:
  service:
    registry:
      address: http://sc.servicecomb.io:9980
  grpc:
    address: 0.0.0.0:9090
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

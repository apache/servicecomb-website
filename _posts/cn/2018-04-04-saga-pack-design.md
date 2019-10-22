---
title: "ServiceComb数据一致性解决方案Saga演进介绍"
lang: cn
ref: saga_pack_design
permalink: /cn/docs/saga_pack_design/
excerpt: "Saga演进介绍"
last_modified_at: 2018-04-04T09:18:43+08:00
author: Eric Lee
tags: [saga]
redirect_from:
  - /theme-setup/
---

传统的单体应用的微服务化改造过程中大多会面临数据库拆分，故而原来由数据库保证的数据一致性也一定面临重新设计和实现，此时需要引入分布式数据一致性方案来解决。常见的解决方案主要有2PC，TCC，事件驱动等，而在微服务开源项目 ServiceComb中提出并实现了使用Saga[[1]](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf)来解决微服务的数据一致性难题，不同方案的对比可参考《ServiceComb中的数据最终一致性方案》[[2]](http://blog.csdn.net/fl63zv9zou86950w/article/details/78393439)一文。Saga是一个数据最终一致性的解决方案，它允许我们成功地执行所有事务，或在任何事务失败的情况下，补偿已成功的事务，并提供了ACID[[3]](https://en.wikipedia.org/wiki/ACID)中ACD的保证（由于事务是交错执行的，可能会看到其他事务的部分结果，因此不能满足隔离性要求）。因此，Saga适用于以下跨服务的事务场景：

- **嵌套调用**。如网上购物时，会依次经过下单、支付服务和第三方支付这几个子事务，其中，下单依赖于支付服务的返回状态，而支付服务也包含了多种可选的支付方式，并依赖于具体支付方式返回的结果。通过Saga，可以清晰地看到一个完整事务中各个服务之间的关系，在异常时也能快速定位出现问题的子事务。
- **高并发**。如秒杀场景下，在成功扣除库存和完成支付后方可认为秒杀成功，若成功扣除库存但支付失败则自动进行补偿（即恢复库存）。鉴于Saga只有提交和补偿两种状态，成功场景下只需对每个子事务进行一次调用即可，因此可以在高并发下保持高性能。
- **调用时间长**。如线上购买电影票，选好座位后一般会有15分钟的支付时间。Saga仅在子事务的提交阶段对资源进行短暂的锁定，且通过超时机制确保事务超时后能自动补偿，即在规定时间内没有支付成功的话就自动释放锁定的座位，极大地简化了业务出现异常时的处理逻辑。

## Saga新版本演进

新年新气象，Apache ServiceComb(incubating) Saga[[4]](https://github.com/apache/incubator-servicecomb-saga)（以下简称Saga）进行了演进。相对于上一版[[2]](http://blog.csdn.net/fl63zv9zou86950w/article/details/78393439)，新演进的设计主要有以下优势：

- **极大提升易用性**。开发者只需使用2-3个注解（即启用事务服务：EnableOmega、全局事务标记：SagaStart和子事务标记：Compensable）。
- **更方便扩展**。对微服务框架的支持更友好。
- **数据一致性与业务逻辑解耦**。在演进后的设计中，通过服务侧omega的引入，saga协调器的职责更为单一（只需负责协调事务的完整性），与具体业务无关，因此，开发人员可以聚焦在具体业务的开发。

Saga演进后的架构，如下图所示，主要包含两个组件，即alpha和omega，其中：

- alpha充当协调者的角色，主要负责对事务的事件进行持久化存储以及协调子事务的状态，使其最终得以与全局事务的状态保持一致，即保证事务中的子事务要么全执行，要么全不执行。
- omega是微服务中内嵌的一个agent，负责对网络请求进行拦截并向alpha上报事务事件，并在异常情况下根据alpha下发的指令执行相应的补偿或重试操作。

![](/assets/images/pack/pack.png)


## omega内部运行机制

omega是微服务中内嵌的一个agent，负责向alpha上报事务状态并与其它omega直接传递事务上下文信息。其中，每个服务的事务上下文包括：

- 全局事务id(Global Tx Id)：用于唯一标识全局事务，一般在全局事务入口生成，并在整个事务过程中传递。
- 本地事务id(Local Tx Id)：用于唯一标识本地事务，一般由本地事务生成。
- 父事务id(Parent Tx Id)：用于构建子事务间的关系，可由请求上下文中构建。

如下图所示，分布式事务与用于分布式调用链追踪的zipkin[[5]](https://github.com/openzipkin/zipkin)的处理流程很类似，在服务提供方，omega会将请求拦截并从中提取请求信息中的全局事务id作为其自身的全局事务id（即Saga事件id），并将请求中的本地事务id作为其父事务id，且使用新生成的id作为本地事务id；在服务消费方，omega会将请求拦截并往其中添加当前的全局事务id和本地事务id。通过服务提供方和服务消费方的这种协作处理，子事务能连接起来形成一个完整的全局事务。

![](/assets/images/pack/id_flow.png)

omega在预处理阶段会先向alpha发送事务开始的事件，在后处理阶段会再向alpha发送事务结束的事件。alpha在收到事件后会进行持久化的存储。因此，每个成功的子事务都有一一对应的开始及结束事件。

![](/assets/images/pack/omega_internal.png)

在omega启动时会向alpha注册，使得异常或者超时场景下，alpha能通过回调向omega发送重试或补偿的命令和相应的调用参数，从而确保全局事务的一致性。

## 具体处理流程

### 成功场景

全局事务开始前omega会先向alpha发送全局事务开始的事件，并在所有子事务完成时向alpha发送全局事务结束的事件。而每个子事务在执行前也会向alpha发送事务开始的事件，在成功执行后，会向alpha发送事务结束的事件。子事务间通过全局事务id连接在一起，但也因本地事务id而有所区分。因此，在成功场景下，每个开始的事件都会有对应的结束事件。

![](/assets/images/pack/successful_scenario.png)

### 异常场景

在子事务执行期间抛出异常时，omega会向alpha上报aborted事件，然后alpha会向该全局事务的其它已完成的子事务发送补偿指令，确保最终同一全局事务下的所有子事务要么都成功，要么都回滚。由于事务中没有明确指定全局事务中的参与者，因此，alpha的扫描器会定期查询事件表并找出已完成所有补偿子事务的全局事务，然后对这些全局事务添加全局事务结束事件以保证事务的完整性。

![](/assets/images/pack/exception_scenario.png)

### 超时场景

alpha的扫描器会定期扫描正在处理的事件状态，若发现事件超时，则会记录相应的aborted事件，然后alpha会向该全局事务的其它已完成的子事务发送补偿指令来恢复至事务开始前的状态。

![](/assets/images/pack/timeout_scenario.png)

## 如何使用？

Saga的使用主要涵盖两方面，alpha的启动及omega的使用。

### alpha的启动

alpha启动前需要先运行数据库PostgreSQL：

```bash
docker run -d -e "POSTGRES_DB=saga" -e "POSTGRES_USER=saga" -e "POSTGRES_PASSWORD=password" -p 5432:5432 postgres
```
   
在确保数据库正常启动后，即可运行alpha：

```bash
docker run -d -p 8090:8090 \
  -e "JAVA_OPTS=-Dspring.profiles.active=prd" \
  -e "spring.datasource.url=jdbc:postgresql://{docker.host.address}:5432/saga?useSSL=false" \
  alpha-server:0.1.0
```

### omega的使用

omega的使用很简单，以一个简化的转账业务为例，同一笔转账要么转入和转出都成功，要么都失败。在这样一个业务中引入Saga，只需简单几步即可：

1. 引入依赖
   ```xml
   <dependency>
     <groupId>org.apache.servicecomb.pack</groupId>
     <artifactId>omega-spring-starter</artifactId>
     <version>0.1.0</version>
   </dependency>
   <dependency>
     <groupId>org.apache.servicecomb.pack</groupId>
     <artifactId>omega-transport-resttemplate</artifactId>
     <version>0.1.0</version>
   </dependency>
   ```

2. 添加Saga的注解及相应的补偿方法
   2.1 在应用入口添加 `@EnableOmega` 的注解来初始化omega的配置并与alpha建立连接。
    ```java
    @SpringBootApplication
    @EnableOmega
    public class Application {
      public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
      }
    }
    ```
   2.2 在全局事务的起点添加 `@SagaStart` 的注解。
    ```java
    @SagaStart(timeout=10)
    public boolean transferMoney(String from, String to, int amount) {
      transferOut(from, amount);
      transferIn(to, amount);
    }
    ```
   2.3 在子事务处添加 `@Compensable` 的注解并指明其对应的补偿方法。其中，补偿方法的形参列表需与子事务方法的形参列表保持一致。
    ```java
    @Compensable(timeout=5, compensationMethod="cancel")
    public boolean transferOut(String from, int amount) {
      repo.reduceBalanceByUsername(from, amount);
    }
    
    public boolean cancel(String from, int amount) {
      repo.addBalanceByUsername(from, amount);
    }
    ```
   2.4 对转入服务重复第2.3步即可。

   2.5 在每个服务的application.yaml中添加配置项，指明服务信息和alpha的地址信息：
    ```yaml
    spring:
      application:
        name: {application.name}
    alpha:
      cluster:
        address: {alpha.cluster.addresses}
    ```

目前Saga的实现还存在着很多有意思且有挑战性的课题，如alpha的协调调度实现、幂等的实现及自动补偿的实现等，欢迎有志之士与我们携手一起解决数据一致性的难题，共同为完善微服务生态贡献自己的力量。

## 参考文献

[1] Sagas, Hector Garcia-Molina & Kenneth Salem, [https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf)

[2] ServiceComb中的数据最终一致性方案，殷湘，[http://blog.csdn.net/fl63zv9zou86950w/article/details/78393439](http://blog.csdn.net/fl63zv9zou86950w/article/details/78393439)

[3] ACID, Wikipedia, [https://en.wikipedia.org/wiki/ACID](https://en.wikipedia.org/wiki/ACID)

[4] Apache ServiceComb(incubating) Saga, Apache, [https://github.com/apache/incubator-servicecomb-saga](https://github.com/apache/incubator-servicecomb-saga)

[5] zipkin, zipkin, [https://github.com/openzipkin/zipkin](https://github.com/openzipkin/zipkin)

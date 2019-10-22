---
title: "ServiceComb Saga使用Cucumber做验收测试源码分析"
lang: cn
ref: saga_with_cucumber
permalink: /cn/docs/saga_with_cucumber/
excerpt: "ServiceComb Saga使用Cucumber做验收测试源码分析"
last_modified_at: 2018-04-27T19:05:00+08:00
author: Li Bo
tags: [Saga, Cucumber]
redirect_from:
  - /theme-setup/
---


### ServiceComb Saga使用Cucumber做验收测试源码分析

#### Cucumber 简介

Cucumber 是一个能够理解用普通语言描述的测试用例的自动化测试工具，可以让人们用近似自然的语言去描述特性Feature和场景Scenario，根据Feature驱动开发，用作软件技术人员和非技术之间验收测试的桥梁。它是一个命令行工具，运行后会执行features中的内容，feature中的step会调用step definitions 可以用标签来组织场景支持40多种语言包括 Java, Ruby 等。

![](/assets/images/cucumber.jpg)

Cucumber开发过程：

* 创建feature文件，feature文件中描述了测试用例集（Features），测试用例(Scenarios)，创建测试所需环境(Given)，触发被测试事件(When)和结果验证(Then)
* 创建step_definitions，此代码根据上面创建的feature文件，映射feature中的Gherkin Step为按步骤执行的代码，类似胶水的作用。
* 执行cucumber执行指令，格式化输出

更多关于Cucumber的介绍请参考[官网文档[2]](https://cucumber.io/)。

#### Saga 使用 Cucumber

Saga项目对其下行程预定demo做了验收测试，我们对照Cucumber的开发过程分别分析成功执行完所有事务和出现异常时的自动化测试开发，在行程预定的demo中，全局事务`booking`有两个子事务分别是预定酒店服务`Hotel`和包车服务`Car`，只有酒店服务和包车服务全部成功行程预定服务才算成功，否则全部失败并回滚补偿。demo中假定了房源紧张，每个用户最多只能预定2间，关于此行程规划demo细节请参考[文档[3]](https://github.com/apache/incubator-servicecomb-saga/tree/master/saga-demo/booking)。

* 成功完成所有事务

  1. 创建feature文件`pack_success_scenario.feature`，定义Feature，并在feature中定义step

     ```shell
     Feature: Alpha records transaction events

       Scenario: Everything is normal
         Given Car Service is up and running
         And Hotel Service is up and running
         And Booking Service is up and running
         And Alpha is up and running

         When User Sean requests to book 2 cars and 1 rooms

         Then Alpha records the following events
           | serviceName  | type             |
           | pack-booking | SagaStartedEvent |
           | pack-car     | TxStartedEvent   |
           | pack-car     | TxEndedEvent     |
           | pack-hotel   | TxStartedEvent   |
           | pack-hotel   | TxEndedEvent     |
           | pack-booking | SagaEndedEvent   |

         And Car Service contains the following booking orders
           | name | amount | confirmed | cancelled |
           | Sean | 2      | true      | false     |

         And Hotel Service contains the following booking orders
           | name | amount | confirmed | cancelled |
           | Sean | 1      | true      | false     |
     ```

     `Given` 定义了测试用例`Everything is normal`所需的4个条件分别是4个服务运行正常，`When`定义了触发用户`Sean`发起预定2辆车和1间房子的被测事件。`Then`中则指定了验证结果是`Alpha`记录的各子事务及子事务发生顺序，`Car`服务和`Hotel`服务则记录预定结果。

  2. 创建step_definitions `PackStepdefs.java`

     在step_definition中使用正则的方式对应feature中定义的的测试条件，触发测试并验证结果。如：

     ```java
         Given("^Car Service is up and running$", () -> {
           probe(System.getProperty(CAR_SERVICE_ADDRESS));
         });
     ```

     上面代码对应feature中第一个测试前提条件`Given car service is up and running`，`probe`函数式方位`Car`服务的一个Rest接口验证返回状态码来判断`Car`是否正常启动运行。接下来四个`Given`与此类似。

     ```java
     When("^User ([A-Za-z]+) requests to book ([0-9]+) cars and ([0-9]+) rooms$", (username, cars, rooms) -> {
           log.info("Received request from user {} to book {} cars and {} rooms", username, cars, rooms);

           given()
               .pathParam("name", username)
               .pathParam("rooms", rooms)
               .pathParam("cars", cars)
               .when()
               .post(System.getProperty("booking.service.address") + "/booking/{name}/{rooms}/{cars}");
         });
     ```

     此段代码解析feature中定义的`When User Sean requests to book 2 cars and 1 rooms`事件，解析出用户、预定车辆和房间数量参数并向`Booking`服务发出`POST`方法的请求，然后在下面代码的`Then`中验证结果：

     ```java
     Then("^Alpha records the following events$", (DataTable dataTable) -> {
           Consumer<Map<String, String>[]> columnStrippingConsumer = dataMap -> {
             for (Map<String, String> map : dataMap)
               map.keySet().retainAll(dataTable.topCells());
           };
           dataMatches(System.getProperty(ALPHA_REST_ADDRESS) + "/events", dataTable, columnStrippingConsumer);
         });

      And("^Car Service contains the following booking orders$", (DataTable dataTable) -> {
           dataMatches(System.getProperty(CAR_SERVICE_ADDRESS) + "/bookings", dataTable, NO_OP_CONSUMER);
         });

         And("^Hotel Service contains the following booking orders$", (DataTable dataTable) -> {
           dataMatches(System.getProperty(HOTEL_SERVICE_ADDRESS) + "/bookings", dataTable, NO_OP_CONSUMER);
         });
     ```

     上面代码对应feature中`Then`结果从三方面验证预定事件是否符合预期：`Alpha`服务中记录的事件顺序、`Car`服务的预定结果和 `Hotel`服务中的预定结果。`DataTable`解析了feature中定义的事件结果和顺序，`dataMatches`将此结果与各服务中查询到的结果进行比较验证是不是符合预期。

  3. 执行Command `RunCucumberIT.java`

     `@Runwith(Cucumber.class)`指定使用Cucumber测试框架入口，并在`@CucumberOptions`中指定feature目录和输出格式。

* 有子事务出现异常测试

  由于房源紧张，限制每个用户最多预订2间房，当用户预订超过2间时会抛出异常：

  ```java
  @Compensable(compensationMethod = "cancel")
    void order(HotelBooking booking) {
      if (booking.getAmount() > 2) {
        throw new IllegalArgumentException("can not order the rooms large than two");
      }
      booking.confirm();
      bookings.put(booking.getId(), booking);
    }
  ```

  在此异常测试中我们预订事件中预订3间房，由于订房间失败，整个行程事务没有成功，对已经成功执行的订车子事务进行补偿保证原子性。

  1. 创建feature文件`pack_compensation_scenario.feature`

     与成功的行程规划测试中不同的只有触发的预定事件和最终的结果，前提条件都是4个服务启动并运行，所以feature只要修改`When`和`Then`内容即可（Features和Scenarios名也要对应修改）

     ```yaml
         When User Sean requests to book 5 cars and 3 rooms

         Then Alpha records the following events
           | serviceName  | type               |
           | pack-booking | SagaStartedEvent   |
           | pack-car     | TxStartedEvent     |
           | pack-car     | TxEndedEvent       |
           | pack-hotel   | TxStartedEvent     |
           | pack-hotel   | TxAbortedEvent     |
           | pack-car     | TxCompensatedEvent |
           | pack-car     | SagaEndedEvent     |

         Then Car Service contains the following booking orders
           | name | amount | confirmed | cancelled |
           | Sean | 5      | false     | true      |

         Then Hotel Service contains the following booking orders
           | name | amount | confirmed | cancelled |
     ```

  2. step_definition和Command与之前一样，不需要任何修改，触发预定超过3个房间的操作后，`Alpha`会记录Hotel服务的`TxAbortedEvent`和Car服务的`TxCompensatedEvent`时间，此外Car服务的预定记录中会有取消为`true`的记录。

  通过以上两个例子分析，Cucumber开发只需要在feature中定义好测试所需条件，触发事件和结果验证信息，然后在step_definition中进行解析验证即可。

#### Byteman 规则注入

`Byteman`可以在代码的任意位置注入代码，并可以在注入的代码中访问当前方法中变量，包括方法参数、局部变量、调用其他函数的参数值、返回值等。更多关于Byteman的介绍请参考[官方文档[4]](http://byteman.jboss.org/docs.html)。

Byteman开发过程：

* 创建规则脚本.btm文件

  根据byteman语法创建规则，包括规则名，目标类，目标方法，注入位置，注入内容等，下面是一个在`main`函数入口注入打印语句的规则文件例子

  ```yaml
  RULE trace main entry
  CLASS AppMain
  METHOD main
  AT ENTRY
  IF true
  DO traceln("entering main")
  ENDRULE
  ```

  在安装了byteman环境的机器上用javaagent参数指定加载规则文件运行AppMain即可在main函数入口处打印出`entering main`。例子[源码请参考[5]](https://github.com/adinn/byteman-tutorial1)

* 加载规则并运行

  除了上面例子中通过命令行指定javaagent指定byteman 规则文件的加载方式外，还可以通过Java代码的方式加载，如下

  ```java
  Submit bm = new Submit(address, port);
  bm.addRulesFromFiles(rules);
  ```

  `org.jboss.byteman.agent.submit.Submit`提供的加载规则的方法有通过文件加载`addRulesFromFiles`和`addRulesFromResources`

  同样，byteman提供了移除规则的方法`deleteRulesFromFiles`，`deleteRulesFromResources`和`deleteAllRules`。

#### Saga 使用 Cucumber 集成 Byteman

Saga在Cucumber中集成了byteman注入一个超时异常，测试Saga对超时处理是否符合预期。

1. 创建byteman规则文件：`booking_timeout.btm`

   ```yaml
   RULE set the saga timeout to 5s
   INTERFACE org.apache.servicecomb.pack.omega.context.annotations.SagaStart
   METHOD timeout
   AT EXIT
   IF TRUE
   DO RETURN 5
   ENDRULE

   RULE sleep when postBooking until timeout happens
   CLASS org.apache.servicecomb.pack.demo.pack.booking.BookingController
   METHOD postBooking
   AT ENTRY
   IF TRUE
   DO debug("delay 10s until the booking timeout"),
      Thread.sleep(10000)
   ENDRULE
   ```

   这里定义了两个规则，第一个规则`set the saga timeout to 5s`在注解`@SagaStart`的`timeout`方法中返回5表示设置超时时间值为5秒。第二个规则`sleep when postBooking until timeout happens`在类`BookingController`的`postBooking`方法中注入`Thread.sleep(10000)`，让`postBooking`方法阻塞10秒，原来的`postBooking`方法是一个空方法，注入byteman的阻塞方法后会触发预定行程服务的超时异常。

2. 创建feature文件：`pack_timeout_scenario.feature`

   ```yaml
    	Given Install the byteman script booking_timeout.btm to Booking Service

       When User Sean requests to book 1 cars and 1 rooms

       Then Alpha records the following events
         | serviceName  | type               |
         | pack-booking | SagaStartedEvent   |
         | pack-car     | TxStartedEvent     |
         | pack-car     | TxEndedEvent       |
         | pack-hotel   | TxStartedEvent     |
         | pack-hotel   | TxEndedEvent       |
         | pack-booking | TxAbortedEvent     |
         | pack-hotel   | TxCompensatedEvent |
         | pack-car     | TxCompensatedEvent |
         | pack-booking | SagaEndedEvent     |

       Then Car Service contains the following booking orders
         | name | amount | confirmed | cancelled |
         | Sean | 1      | false     | true      |

       Then Hotel Service contains the following booking orders
         | name | amount | confirmed | cancelled |
         | Sean | 1      | false     | true      |
   ```

   在行程预定的例子中仍然以4个服务启动并运行为前提，然后加载上面创建的byteman规则文件和目标服务：`Booking`。然后触发预定一辆车和一间房的操作。

3. step_definition解析

   ```java
       Given("^Install the byteman script ([A-Za-z0-9_\\.]+) to ([A-Za-z]+) Service$", (String script, String service) -> {
         log.info("Install the byteman script {} to {} service", script, service);
         List<String> rules = new ArrayList<>();
         rules.add("target/test-classes/" + script);
         Submit bm = getBytemanSubmit(service);
         bm.addRulesFromFiles(rules);
       });
   ```

   在Cucumber解析文件中用正则方法获取目标规则和服务名，`getBytemanSubmit`根据服务名`service`参数来获取目标服务的地址和byteman监听端口，并将本地规则注入到目标服务中，注入原理是`Booking`启动时是带着byteman参数启动的：

   ```shell
   -Dorg.jboss.byteman.debug=true -Dorg.jboss.byteman.verbose=tru
   -javaagent:/maven/saga/byteman.jar=port:9091,address:0.0.0.0,listener:true
   ```

   执行`bm.addRulesFromFiles(rules);`时就可以把本地规则通过Socket发送到`Booking`服务，并由Byteman完成字节替换。

4. 结果验证

   注入规则后触发预定车辆和房间服务时预定服务会出现超时，Saga会对已经完成的订车和订房间子事务进行补偿，Alpha中记录了一些列事件以及他们发生的顺序，另外Car服务和Hotel服务的取消标记`cancelled`也为`true`。

代码中使用Cucumber和Byteman要先通过pom引入相关依赖

```xml
	<dependency>
      <groupId>io.cucumber</groupId>
      <artifactId>cucumber-java8</artifactId>
      <version>${cucumber.version}</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>io.cucumber</groupId>
      <artifactId>cucumber-junit</artifactId>
      <version>${cucumber.version}</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.jboss.byteman</groupId>
      <artifactId>byteman-submit</artifactId>
      <version>${byteman.version}</version>
    </dependency>
```

本地运行调试需要在启动的时候使用javaagent启动byteman，建议通过修改docker-compose.yaml文件，指定可执行jar的启动参数，并修改stepdef解析文件中各个服务地址，个服务启动运行后在IDEA中运行相应的feature文件即可进行调试测试。运行调试版代码可参考[个人分支代码[6]](https://github.com/lijasonvip/incubator-servicecomb-saga/tree/debug-cucumber-byteman)



欢迎开发者朋友们加入ServiceComb社区，一起做些有意思的事情。[加入社区方法[7]](http://servicecomb.incubator.apache.org/cn/docs/join_the_community/)

#### 参考资料

[1] ServiceComb Saga  https://github.com/apache/incubator-servicecomb-saga

[2] Cucumber  https://cucumber.io/

[3] Saga booking demo  https://github.com/apache/incubator-servicecomb-saga/tree/master/saga-demo/booking

[4] Byteman  http://byteman.jboss.org/docs.html

[5] Byteman demo https://github.com/adinn/byteman-tutorial1

[6] debug 分支 https://github.com/lijasonvip/incubator-servicecomb-saga/tree/debug-cucumber-byteman

[7] 加入ServiceComb 社区  http://servicecomb.incubator.apache.org/cn/docs/join_the_community/

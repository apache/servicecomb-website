---
title: "如何给微服务架构的项目做验收测试？"
lang: cn
ref: how-to-do-microservice-accept-test
permalink: /cn/docs/how-to-do-microservice-accept-test/
excerpt: "本文将介绍如何给微服务架构的项目做验收测试"
last_modified_at: 2019-07-04T10:37:43+08:00
author: Daniel Qian
tags: [微服务]
redirect_from:
  - /theme-setup/
---

### 如何给微服务架构的项目做验收测试？

基于微服务架构的应用相对于单体架构的应用而言在验收测试阶段具有以下挑战：

1. 复数的服务增加了测试环境搭建的难度
2. 各种异常情况的模拟变得困难，基于Mock的测试方式无法对整个调用链路作异常模拟，进而使得对整体架构的健壮性测试变得困难
3. 基于成本和效率的原因，测试工作已经不适合通过人工完成

我们认为对基于微服务架构的应用的验收测试应该具有以下特征：

1. 自动化、可重复、易于和CI工具集成
3. 能够在测试运行时修改服务的行为

下面将就一个Demo来介绍如何利用 [Docker [1]](https://www.docker.com/)、[Cucumber [2]](https://cucumber.io/)、[Byteman [3]](https://byteman.jboss.org/)、[Fabric8 docker-maven-plugin [4]](https://dmp.fabric8.io/)、[Spotify dockerfile-maven-plugin [5]](https://github.com/spotify/dockerfile-maven)达成以上目标。

### Demo介绍

一共有两个服务Product Service（商品服务）和Product Price Service（商品价格服务），Product Service提供了一个查询接口用于获得商品信息及其价格信息的组合结果，这相当于跨服务的SQL JOIN。

下面是Product的Schema：

```json
{
  "id": "<string>",
  "name": "<string>",
  "description": "<string>"
}
```

下面是ProductPrice的Schema：

```json
{
  "id": "<string>",
  "price": "<number>"
}
```

Product Service返回的Schema则是：

```json
{
  "products": [
    {
      "id": "<string>",
      "name": "<string>",
      "description": "<string>",
      "price": <number>
    }
  ]
}
```

该接口的实现逻辑是：

1. Product Service本地查询得到Product List
2. Product Service调用Product Price Service接口得到ProductPrice List
3. 拼装结果


此外还有一个要求，当Product Price Service出现异常时，Product Service依然要能够返回结果，只不过`price`字段为`null`，即无论如何Product Service都要能够返回结果。

### 实现步骤

#### 构建Docker Image

为了能够便利地搭建测试环境，我们需要先为Product Servcie和Product Price Service构建Docker Image。利用[Spotify dockerfile-maven-plugin [5]](https://github.com/spotify/dockerfile-maven)可以很方便地做到这一点，它没有引入额外的概念，只要你会写[Dockerfile [6]](https://docs.docker.com/engine/reference/builder/)就行。我们在Product Service和Producer Price Service的`pom.xml`中添加类似以下的配置：

```xml
<plugin>
  <groupId>com.spotify</groupId>
  <artifactId>dockerfile-maven-plugin</artifactId>
  <version>${dockerfile-maven-plugin.version}</version>
  <configuration>
    <repository>msat-${project.artifactId}</repository>
    <tag>${project.version}</tag>
    <buildArgs>
      <JAR_FILE>${project.build.finalName}-exec.${project.packaging}</JAR_FILE>
    </buildArgs>
  </configuration>
  <executions>
    <execution>
      <id>build</id>
      <phase>package</phase>
      <goals>
        <goal>build</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

并且提供了Dockerfile：

```txt
FROM openjdk:8-jre-alpine
ARG JAR_FILE
ENV JAR_FILE=${JAR_FILE}
RUN mkdir /maven
COPY target/${JAR_FILE} /maven
COPY target/lib/byteman.jar /maven
ENTRYPOINT java $JAVA_OPTS -jar /maven/$JAR_FILE
EXPOSE 8080
```

注意我们在Image中添加了byteman.jar，利用它我们可以在运行时修改程序的行为。

#### 编写验收测试脚本

我们新建一个验收测试的Maven项目，然后使用[Cucumber [2]](https://cucumber.io/)编写了以下两个场景的验收测试脚本：

正常情况：

```txt
Feature: List product information with price

  Scenario: Everything is good
    Given Product Service is up and running
    And Product Price Service is up and running

    When User query product list

    Then Get following products

      | id       | name | description            | price |
      | animal-1 | dog  | woof woof              | 1000  |
      | animal-2 | duck | quack quack            | 40    |
      | animal-3 | fox  | what does the fox say? | 5000  |
```

这个脚本的大致意思是在Product Service和Product Price Service都启动的情况下，当用户查询Product信息时，我们会得到上述表格中的结果。

Product Price Service异常情况：

```txt
Feature: List product information with price

  Scenario: Product Price Service throws exception when being queried
    Given Product Service is up and running
    And Product Price Service is up and running

    Given Install the byteman script product_price_exception.btm to Product Price Service

    When User query product list

    Then Get following products

      | id       | name | description            | price |
      | animal-1 | dog  | woof woof              |       |
      | animal-2 | duck | quack quack            |       |
      | animal-3 | fox  | what does the fox say? |       |
```

注意到我们在这里使用了[Byteman [3]](https://byteman.jboss.org/)注入了异常情况给Product Price Service：

```txt
Given Install the byteman script product_price_exception.btm to Product Price Service
```

`product_price_exception.btm`的内容是这样的：

```txt
RULE throw exception
CLASS me.chanjar.msat.productprice.FakeProductPriceRepository
METHOD listAll
AT ENTRY
IF TRUE
DO debug("throw RuntimeException here"),
   throw new RuntimeException("Product Repository Error!")
ENDRULE
```

意思是在调用`FakeProductPriceRepository.listAll`方法时抛出异常，注意这样做并没有修改Product Price Service的源码，而是在运行时修改了它的逻辑。

接下来我们为上面的验收测试脚本实现逻辑（下面代码与实际上有所不同，这是为了尽量使得代码篇幅精简）：

```java
public class Stepdefs {

  private List<Map<String, String>> answer;

  @Given("^Product Service is up and running$")
  public void productServiceIsUpAndRunning() {
    probe("Product Service", PRODUCT_ADDRESS);
  }

  @And("^Product Price Service is up and running$")
  public void productPriceServiceIsUpAndRunning() {
    probe("Product Price Service", PRODUCT_PRICE_ADDRESS);
    clearBytemanScript();
  }

  @When("^User query product list$")
  public void queryProductList() {
    answer = given()
      .when()
      .get(PRODUCT_ADDRESS + "/products")
      .then()
      .statusCode(is(200))
      .extract()
      .body()
      .jsonPath()
      .getList("products", Map.class);
  }

  @Given("^Install the byteman script ([A-Za-z0-9_\\.]+) to Product Price Service$")
  public void injectExceptionIntoProductPriceService(String bytemanScript) throws Exception {
    injectBytemanScript("target/test-classes/" + bytemanScript);
  }

  @Then("^Get following products$")
  public void compareResult(List<Map<String, String>> expected) {
    assertThat(answer).containsExactlyInAnyOrderElementsOf(expected);
  }
}
```

关于[Cucumber [2]](https://cucumber.io/)和[Byteman [3]](https://byteman.jboss.org/)的更详细的介绍可以见[ServiceComb Saga使用Cucumber做验收测试源码分析 [7]](https://servicecomb.apache.org/cn/docs/saga_with_cucumber/)。

#### 自动化搭建测试环境

我们希望能够在Maven的`integration-test` 阶段搭建测试环境、执行上述验收测试脚本。在`pom.xml`中添加到[Fabric8 docker-maven-plugin [4]](https://dmp.fabric8.io/)：

```xml
<plugin>
  <groupId>io.fabric8</groupId>
  <artifactId>docker-maven-plugin</artifactId>
  <configuration>
    <showLogs>true</showLogs>
    <images>
      <image>
        <name>msat-product:${project.version}</name>
        <alias>msat-product</alias>
        <run>
          <wait>
            <log>Started [a-zA-Z]+ in [0-9.]+ seconds</log>
            <time>120000</time>
          </wait>
          <links>
            <link>msat-product-price:msat-product-price</link>
          </links>
          <ports>
            <port>product.port:8080</port>
          </ports>
        </run>
      </image>
      <image>
        <name>msat-product-price:${project.version}</name>
        <alias>msat-product-price</alias>
        <run>
          <env>
            <JAVA_OPTS>
              -Dorg.jboss.byteman.debug=true -Dorg.jboss.byteman.verbose=true
              -javaagent:/maven/byteman.jar=port:9091,address:0.0.0.0,listener:true
            </JAVA_OPTS>
          </env>
          <wait>
            <log>Started [a-zA-Z]+ in [0-9.]+ seconds</log>
            <time>120000</time>
          </wait>
          <ports>
            <port>product-price.port:8080</port>
            <port>product-price.byteman.port:9091</port>
          </ports>
        </run>
      </image>
    </images>
  </configuration>
  <executions>
    <execution>
      <id>start</id>
      <phase>pre-integration-test</phase>
      <goals>
        <goal>start</goal>
      </goals>
    </execution>
    <execution>
      <id>stop</id>
      <phase>post-integration-test</phase>
      <goals>
        <goal>stop</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

这样一来就能够在`pre-integration-test`阶段启动容器，在`post-integration-test`阶段销毁容器了。

#### Take a run

接下来只需要`mvn clean install`它就会：

1. 构建：
   1. 构建Product Service项目，并为其构建Docker Image
   2. 构建Product Price Service项目，并为其构建Docker Image
2. 验收测试：
   1. 启动Product Service和Product Price Service的容器
   2. 执行验收测试脚本
   3. 销毁上述创建的容器

如果你想自己试试可以下载[本项目源码[8]](https://github.com/chanjarster/microservice-acceptance-test-demo)。

欢迎开发者朋友们加入ServiceComb社区，一起做些有意思的事情。[加入社区方法[9]](http://servicecomb.incubator.apache.org/cn/docs/join_the_community/)

### 参考资料

[1] Docker https://www.docker.com/

[2] Cucumber https://cucumber.io/

[3] Byteman  https://byteman.jboss.org/

[4] Fabric8 docker-maven-plugin  https://dmp.fabric8.io/

[5] Spotify dockerfile-maven-plugin https://github.com/spotify/dockerfile-maven

[6] Dockerfile https://docs.docker.com/engine/reference/builder/

[7] ServiceComb Saga使用Cucumber做验收测试源码分析 https://servicecomb.apache.org/cn/docs/saga_with_cucumber/

[8] 本项目源码 https://github.com/chanjarster/microservice-acceptance-test-demo

[9] 加入Servicecomb社区  http://servicecomb.incubator.apache.org/cn/docs/join_the_community/
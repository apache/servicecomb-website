---
title: "用透明RPC开发微服务"
lang: cn
ref: develop-with-transparent-rpc
permalink: /cn/users/develop-with-transparent-rpc/
excerpt: "用透明RPC开发微服务"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述

透明RPC开发模式是一种基于接口和接口实现的开发模式，服务的开发者不需要使用Spring MVC和JAX-RS注解。

## 开发示例
* **步骤 1** 添加依赖：

   在Maven的pom.xml中添加所需的依赖：

   ```xml
    <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>org.apache.servicecomb</groupId>
         <artifactId>java-chassis-dependencies</artifactId>
         <version>1.0.0-m1</version>
         <type>pom</type>
         <scope>import</scope>
       </dependency>
     </dependencies>
    </dependencyManagement>
    <dependencies>
      <!--transport根据microservice.yaml中endpoint发布需求选择，本例中两者都引入，也可以二选一-->
      <dependency>
        <groupId>org.apache.servicecomb</groupId>
        <artifactId>transport-rest-vertx</artifactId>
      </dependency>
      <dependency>
        <groupId>org.apache.servicecomb</groupId>
        <artifactId>transport-highway</artifactId>
      </dependency>
      <dependency>
        <groupId>org.apache.servicecomb</groupId>
        <artifactId>provider-pojo</artifactId>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
      </dependency>
    </dependencies>
   ```

* **步骤 2** 定义服务接口：

   根据开发之前定义好的契约，编写Java业务接口，代码如下：

   ```java
   public interface Hello {
     String sayHi(String name);
     String sayHello(Person person);
   }
   ```

* **步骤 3** 实现服务：

   Hello的服务实现如下：

   ```java
   import org.apache.servicecomb.samples.common.schema.Hello;
   import org.apache.servicecomb.samples.common.schema.models.Person;

   public class HelloImpl implements Hello {
     @Override
     public String sayHi(String name) {
       return "Hello " + name;
     }

     @Override
     public String sayHello(Person person) {
       return "Hello person " + person.getName();
     }
   }
   ```

* **步骤 4** 发布服务

   透明RPC开发模式支持Spring xml配置和注解配置两种服务发布方式：

1. 使用Spring xml配置方式：
   在resources/META-INF/spring目录下创建pojoHello.bean.xml文件，在文件中声明schema，文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns=" http://www.springframework.org/schema/beans " xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance "
          xmlns:p=" http://www.springframework.org/schema/p " xmlns:util=" http://www.springframework.org/schema/util "
          xmlns:cse=" http://www.huawei.com/schema/paas/cse/rpc "
          xmlns:context=" http://www.springframework.org/schema/context "
          xsi:schemaLocation=" http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">

       <cse:rpc-schema schema-id="pojoHello" implementation="org.apache.servicecomb.samples.pojo.provider.PojoHelloImpl"/>
   </beans>
   ```

2. 使用注解配置方式：

   在接口Hello的实现类上使用@RpcSchema注解定义schema，代码如下：

   ```java
   import org.apache.servicecomb.provider.pojo.RpcSchema;
   // other code omitted
   @RpcSchema(schemaId = "pojoHello")
   public class HelloImpl implements Hello {
     // other code omitted
   }
   ```

   在resources/META-INF/spring目录下的pojoHello.bean.xml文件中，配置Spring进行服务扫描的base-package，文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns=" http://www.springframework.org/schema/beans " xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance "
          xmlns:p=" http://www.springframework.org/schema/p " xmlns:util=" http://www.springframework.org/schema/util "
          xmlns:cse=" http://www.huawei.com/schema/paas/cse/rpc "
          xmlns:context=" http://www.springframework.org/schema/context "
          xsi:schemaLocation=" http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">
   
       <context:component-scan base-package="org.apache.servicecomb.samples.pojo.provider"/>
   </beans>
   ```

> **说明**：
与Spring MVC开发模式和JAX-RS开发模式不同的是，透明RPC开发模式使用的注解是`@RpcSchema`而非`@RestSchema`。

* **步骤 5** 添加服务定义。

   在resources目录中添加[microservice.yaml](http://servicecomb.incubator.apache.org/cn/users/service-definition/)。

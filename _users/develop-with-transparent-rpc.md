---
title: "用透明RPC开发微服务"
lang: en
ref: develop-with-transparent-rpc
permalink: /users/develop-with-transparent-rpc/
excerpt: "用透明RPC开发微服务"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述

透明RPC开发模式是一种基于接口和接口实现的开发模式，服务的开发者不需要使用Spring MVC和JAX-RS注解。

## 开发示例

透明RPC开发模式支持Spring xml配置和注解配置两种服务发布方式，通过Spring xml配置的方式如下：

* **步骤 1** 定义服务接口。

   根据开发之前定义好的契约，编写Java业务接口，代码如下：

   ```java
   public interface Hello {
     String sayHi(String name);
     String sayHello(Person person);
   }
   ```

   该接口的位置需要与契约中x-java-interface所指定的路径一致。

* **步骤 2** 实现服务

   Hello的服务实现如下：

   ```java
   import io.servicecomb.samples.common.schema.Hello;
   import io.servicecomb.samples.common.schema.models.Person;

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

* **步骤 3** 发布服务

   在resources/META-INF/spring目录下创建pojoHello.bean.xml文件，在文件中声明schema，文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns=" http://www.springframework.org/schema/beans " xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance " xmlns:p=" http://www.springframework.org/schema/p " xmlns:util=" http://www.springframework.org/schema/util " xmlns:cse=" http://www.huawei.com/schema/paas/cse/rpc " xmlns:context=" http://www.springframework.org/schema/context " xsi:schemaLocation=" http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd  http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">  
     <cse:rpc-schema schema-id="pojoHello" implementation="io.servicecomb.samples.pojo.provider.PojoHelloImpl"/> 
   </beans>
   ```

   每一个服务接口都需要定义一个schema声明。

## 通过注解配置的开发方式

1. 定义服务接口，与使用Spring xml的方式相同。
2. 实现服务，与使用Spring xml的方式相同。
3. 发布服务。在接口Hello的实现类上使用@RpcSchema注解定义schema，代码如下：

   ```java
   import io.servicecomb.provider.pojo.RpcSchema;
   // other code omitted
   @RpcSchema(schemaId = "pojoHello")
   public class HelloImpl implements Hello {
     // other code omitted
   }
   ```

   在resources/META-INF/spring目录下的pojoHello.bean.xml文件中，配置Spring进行服务扫描的base-package，文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns=" http://www.springframework.org/schema/beans " xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance " xmlns:p=" http://www.springframework.org/schema/p " xmlns:util=" http://www.springframework.org/schema/util " xmlns:cse=" http://www.huawei.com/schema/paas/cse/rpc " xmlns:context=" http://www.springframework.org/schema/context " xsi:schemaLocation=" http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd  http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">  
     <context:component-scan base-package="io.servicecomb.samples.pojo.provider"/> 
   </beans>
   ```

与Spring MVC开发模式和JAX-RS开发模式不同的是，透明RPC开发模式使用的注解是`@RpcSchema`而非`@RestSchema`。

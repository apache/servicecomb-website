---
title: "用JAX-RS开发微服务"
lang: cn
ref: develop-with-jax-rs
permalink: /cn/users/develop-with-jax-rs/
excerpt: "用JAX-RS开发微服务"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}

## 概念阐述

ServiceComb支持开发者使用JAX-RS注解，使用JAX-RS模式开发服务。

## 开发示例
* **步骤 1** 添加依赖。

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
        <artifactId>provider-jaxrs</artifactId>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
      </dependency>
    </dependencies>
   ```

* **步骤 2** 实现服务。

   使用JAX-RS注解开发业务代码，Hello的服务实现如下：

   ```java
   import javax.ws.rs.POST;
   import javax.ws.rs.Path;
   import javax.ws.rs.Produces;
   import javax.ws.rs.core.MediaType;
   import org.apache.servicecomb.samples.common.schema.models.Person;

   @Path("/jaxrshello")
   @Produces(MediaType.APPLICATION_JSON)
   public class JaxrsHelloImpl {
     @Path("/sayhi")
     @POST
     public String sayHi(String name) {
     　return "Hello " + name;
     }

     @Path("/sayhello")
     @POST
     public String sayHello(Person person) {
       return "Hello person " + person.getName();
     }
   }
   ```

* **步骤 3** 发布服务。

   在服务的实现类上打上注解`@RestSchema`，指定schemaId，表示该实现作为当前微服务的一个schema发布，代码如下：

   ```java
   import org.apache.servicecomb.provider.rest.common.RestSchema;
   // other code omitted
   @RestSchema(schemaId = "jaxrsHello")
   public class JaxrsHelloImpl implements Hello {
     // other code omitted
   }
   ```

   然后在resources/META-INF/spring目录下创建jaxrsHello.bean.xml文件，配置spring进行服务扫描的base-package，文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns=" http://www.springframework.org/schema/beans " xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance "
          xmlns:p=" http://www.springframework.org/schema/p " xmlns:util=" http://www.springframework.org/schema/util "
          xmlns:cse=" http://www.huawei.com/schema/paas/cse/rpc "
          xmlns:context=" http://www.springframework.org/schema/context "
          xsi:schemaLocation=" http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">
   
       <context:component-scan base-package="org.apache.servicecomb.samples.jaxrs.provider"/>
   </beans>
   ```

* **步骤 4** 添加服务定义。

   在resources目录中添加[microservice.yaml](http://servicecomb.incubator.apache.org/cn/users/service-definition/)。

* **步骤 5** 添加Main启动类

   ```java
   import org.apache.servicecomb.foundation.common.utils.BeanUtils;
   import org.apache.servicecomb.foundation.common.utils.Log4jUtils;

   public class Application {
     public static void main(String[] args) throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
     }
   }
   ```

## 涉及API

JAX-RS开发模式当前支持如下注解，所有注解的使用方法参考[JAX-RS官方文档](https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html)。

| 注解 | 位置 | 描述 |
| :--- | :--- | :--- |
| javax.ws.rs.Path | schema/operation | URL路径 |
| javax.ws.rs.Produces | schema/operation | 方法支持的编解码能力 |
| javax.ws.rs.DELETE | operation | http method |
| javax.ws.rs.GET | operation | http method |
| javax.ws.rs.POST | operation | http method |
| javax.ws.rs.PUT | operation | http method |
| javax.ws.rs.QueryParam | parameter | 从query string中获取参数 |
| javax.ws.rs.PathParam | parameter | 从path中获取参数，必须在path中定义该参数 |
| javax.ws.rs.HeaderParam | parameter | 从header中获取参数 |
| javax.ws.rs.CookieParam | parameter | 从cookie中获取参数 |

> **说明**：
- 当方法参数没有注解，且不为HttpServletRequest类型参数时，默认为body类型参数，一个方法只支持最多一个body类型参数。
- 打在参数上面的注解建议显式定义出value值，否则将直接使用契约中的参数名，例如应该使用`@QueryParam\("name"\) String name`，而不是`@QueryParam String name`。

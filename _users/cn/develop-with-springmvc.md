---
title: "用SpringMVC开发微服务"
lang: cn
ref: develop-with-springmvc
permalink: /cn/users/develop-with-springmvc/
excerpt: "用SpringMVC开发微服务"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述

ServiceComb支持SpringMVC注解，允许使用SpringMVC风格开发微服务。

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
        <artifactId>provider-springmvc</artifactId>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
      </dependency>
    </dependencies>
   ```

* **步骤 2** 实现服务。

   使用Spring MVC注解开发业务代码，Hello的服务实现如下：

   ```java
   import javax.ws.rs.core.MediaType;
   import org.springframework.web.bind.annotation.RequestBody;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.bind.annotation.RequestParam;
   import org.apache.servicecomb.samples.common.schema.models.Person;
   
   @RequestMapping(path = "/springmvchello", produces = MediaType.APPLICATION_JSON)
   public class SpringmvcHelloImpl {
     @RequestMapping(path = "/sayhi", method = RequestMethod.POST)
     public String sayHi(@RequestParam(name = "name") String name) {
   　  return "Hello " + name;
     }

     @RequestMapping(path = "/sayhello", method = RequestMethod.POST)
     public String sayHello(@RequestBody Person person) {
   　  return "Hello person " + person.getName();
   　}
   }
   ```
   
   **注意：请一定在服务的实现类（本文档例子为SpringmvcHelloImpl）上标记@RequestMapping，否则接口发布的Path和Method将会不正确！**
      
   本例sayHi的访问Path为`/springmvchello/sayhi`，sayHello的访问Path为`/springmvchello/sayhello`，如果希望他们的访问路径为`/sayhi`和`/sayhello`，直接设置SpringmvcHelloImpl上的`@RequestMapping`为`@RequestMapping(path = "/")`。

* **步骤 3** 发布服务

   在服务的实现类上打上注解@RestSchema，指定schemaId，表示该实现作为当前微服务的一个schema发布，代码如下：

   ```java
   import org.apache.servicecomb.provider.rest.common.RestSchema;
   // other code omitted
   @RestSchema(schemaId = "springmvcHello")
   public class SpringmvcHelloImpl {
     // other code omitted
   }
   ```

   然后在`resources/META-INF/spring`目录下创建`springmvcHello.bean.xml`文件，命名规则为`\*.bean.xml`，配置spring进行服务扫描的base-package，文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xsi:schemaLocation="http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd
          http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd">
   
       <context:component-scan base-package="org.apache.servicecomb.samples.springmvc.provider"/>
   </beans>
   ```

* **步骤 4** 添加服务定义。

   在resources目录中添加[microservice.yaml](https://docs.servicecomb.io/java-chassis/zh_CN/build-provider/definition/service-definition.html)。
   
* **步骤 5** 添加Main启动类

   ```java
   import org.apache.servicecomb.foundation.common.utils.BeanUtils;
   import org.apache.servicecomb.foundation.common.utils.Log4jUtils;

   public class Application {
     public static void main(String[] args) throws Exception {
        //初始化日志， 加载Bean(包括它们的参数), 以及注册Service, 更多信息可以参见文档 : https://docs.servicecomb.io/java-chassis/zh_CN/build-provider/bootup.html
        Log4jUtils.init();
        BeanUtils.init();
     }
   }
   ```

## 涉及API

Spring MVC开发模式当前支持org.springframework.web.bind.annotation包下的如下注解，所有注解的使用方法参考[Spring MVC官方文档](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html)。

| 注解 | 位置 | 描述 |
| :--- | :--- | :--- |
| RequestMapping | schema/operation | 支持标注path/method/produces三种数据，operation默认继承schema上的produces |
| GetMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| PutMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| PostMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| DeleteMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| PatchMapping | schema/operation | 支持标注path/produces两种数据，operation默认继承schema上的produces |
| PathVariable | parameter | 从path中获取参数 |
| RequestParam | parameter | 从query中获取参数 |
| RequestHeader | parameter | 从header中获取参数 |
| RequestBody | parameter | 从body中获取参数，每个operation只能有一个body参数 |

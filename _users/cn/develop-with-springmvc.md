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

* **步骤 1** 定义服务接口。

   根据开发之前定义好的契约，编写Java业务接口，代码如下：

   ```java
   public interface Hello {
     String sayHi(String name);
     String sayHello(Person person);
   }
   ```

   该接口的位置需要与契约中x-java-interface所指定的路径一致。

* **步骤 2** 实现服务。

   使用Spring MVC注解开发业务代码，Hello的服务实现如下：

   ```java
   import javax.ws.rs.core.MediaType;
   import org.springframework.web.bind.annotation.RequestBody;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.bind.annotation.RequestParam;
   import io.servicecomb.samples.common.schema.Hello;
   import io.servicecomb.samples.common.schema.models.Person;
   
   @RequestMapping(path = "/springmvchello", produces = MediaType.APPLICATION_JSON)
   public class SpringmvcHelloImpl implements Hello {
     @Override
     @RequestMapping(path = "/sayhi", method = RequestMethod.POST)
     public String sayHi(@RequestParam(name = "name") String name) {
   　  return "Hello " + name;
     }

     @Override
     @RequestMapping(path = "/sayhello", method = RequestMethod.POST)
     public String sayHello(@RequestBody Person person) {
   　  return "Hello person " + person.getName();
   　}
   }
   ```

* **步骤 3** 发布服务

   在服务的实现类上打上注解@RestSchema，指定schemaId，表示该实现作为当前微服务的一个schema发布，代码如下：

   ```java
   import io.servicecomb.provider.rest.common.RestSchema;
   // other code omitted
   @RestSchema(schemaId = "springmvcHello")
   public class SpringmvcHelloImpl implements Hello {
     // other code omitted
   }
   ```

   然后在resources/META-INF/spring目录下创建springmvcHello.bean.xml文件，命名规则为\*.bean.xml，配置spring进行服务扫描的base-package，文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns=" http://www.springframework.org/schema/beans " xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance " xmlns:p=" http://www.springframework.org/schema/p " xmlns:util=" http://www.springframework.org/schema/util " xmlns:cse=" http://www.huawei.com/schema/paas/cse/rpc " xmlns:context=" http://www.springframework.org/schema/context " xsi:schemaLocation=" http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd  http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">  
     <context:component-scan base-package="io.servicecomb.samples.springmvc.povider"/> 
   </beans>
   ```

## 涉及API

　　Spring MVC开发模式当前支持org.springframework.web.bind.annotation包下的如下注解，所有注解的使用方法参考[Spring MVC官方文档](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html)。

| 注解 | 位置 | 描述 |
| :--- | :--- | :--- |
| RequestMapping | schema/operation | 支持标注path/method/produces三种数据，operation默认继承schema上的produces |
| PathVariable | parameter | 从path中获取参数 |
| RequestParam | parameter | 从query中获取参数 |
| RequestHeader | parameter | 从header中获取参数 |
| RequestBody | parameter | 从body中获取参数，每个operation只能有一个body参数 |

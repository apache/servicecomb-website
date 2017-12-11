---
title: "在Spring Boot中使用ServiceComb"
lang: en
ref: use-servicecomb-in-spring-boot
permalink: /users/use-servicecomb-in-spring-boot/
excerpt: "在Spring Boot中使用ServiceComb"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 使用Service Center和治理中心管理Spring Cloud应用
### 概念阐述

本小节介绍在SpringCloud原生应用中，通过改变相关配置，让SpringCloud应用使用ServiceComb微服务框架中的Service Center和治理中心。

### 场景描述

* SpringCloud应用默认情况下由Spring Cloud Eureka提供在分布式环境下的服务发现和服务注册的功能。

   ![](/assets/images/manage_springcloud_application_using_sc_and_gs.png)

* ServiceComb微服务框架中的Service Center用于服务元数据以及服务实例元数据的管理和处理注册、发现，同时还支持以下功能：

> * 支持pull/push两种模式监控实例变化
>
> * 实例动态扩容，海量的长连接或者短连接
>
> * 支持灰度发布、服务分组等高级管理特性

使用SpringBoot/Cloud开发应用，并让服务运行于ServiceComb微服务SDK容器中，使用其高性能通信、服务治理、分布式事务管理等功能。

### 配置说明

使用SpringBoot/Cloud开发应用，在原有应用的基础上按照以下步骤进行操作，即可对接ServiceComb的SDK各组件：

* **步骤 1** 在pom中添加依赖管理dependencyManagement：

   ```xml
   <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>io.servicecomb</groupId>
         <artifactId>java-chassis-dependencies</artifactId>
         <version>0.1.0</version>
         <type>pom</type>
         <scope>import</scope>
       </dependency>
     </dependencies>
   </dependencyManagement>
   ```

* **步骤 2** 在pom中添加依赖：

   ```xml
   <dependency>
     <!--让服务运行于微服务sdk容器中-->
     <group>io.servicecomb</group>
     <artifactId>spring-boot-starter-provider</artifactId>
   </dependency>
   <dependency>
     <!--使用服务中心-->
     <group>io.servicecomb</group>
     <artifactId>spring-boot-starter-discovery</artifactId>
   </dependency>
   <dependency>
     <!--让服务运行于Spring boot embeded tomat中-->
     <group>io.servicecomb</group>
     <artifactId>spring-boot-starter-transport</artifactId>
   </dependency>
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
   </dependency><dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   ```

* **步骤 3** 配置处理链和协议：

   在resources目录下新建microservice.yaml文件，对服务进行定义，详细定义规则请参考[服务定义章节](/users/service-definition/)，示例如下：

   ```yaml
   APPLICATION_ID: discoverytest
   service_description:
     name: discoveryServer
     version: 0.0.2
   cse:
     service:
       registry:
         address:  http://127.0.0.1:30100 #服务注册中心地址
      rest:
        address: 0.0.0.0:8080 #服务发布的端口
      handler:
        chain:
          Provider:
            default: bizkeeper-provider #调用的处理链
   ```

* **步骤4** 若要使用ServiceComb的服务中心：

   在pom中添加依赖：

   ```java
   <dependency>
     <!--使用服务中心-->
     <group>io.servicecomb</group>
     <artifactId>spring-boot-starter-discovery</artifactId>
   </dependency>
   ```

* **步骤 5** 在启动类添加注解@EnableServiceComb：

   ```java
   @EnableDiscoveryClient
   @SpringBootApplication
   @EnableServiceComb //新增注解
   public class xxxServer {
     public static void main(String[] args) {
       SpringApplication.run(xxxServer.class, args);
     }
   }
   ```

* **步骤 6** 定义服务契约，具体请参考[服务契约](/users/service-contract/)，示例如下：

   ```java
   // ControllerImpl.class:
   @RestSchema(schemaId = "test")
   @RequestMapping(path = "/compute", produces = MediaType.TEXT_PLAIN)
   public class ControllerImpl {
     @ResponseBody
     @RequestMapping(path = "/hello/{name}", method = RequestMethod.GET)
     public String add(@PathVariable String name) {
       return "hello" + name;
     }
   }
   ```

* **步骤 7** 启动xxxServer，该服务便可注册到ServiceComb的Service Center。


## 在ServiceComb框架中集成Spring Boot框架
### 概念阐述

本小节介绍了在ServiceComb框架中集成SpringBoot框架的好处和操作步骤。

### 场景描述

#### **SpringBoot框架**

　　Spring Boot是由Pivotal团队提供的全新框架，其设计目的是用来简化新Spring应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。从最根本上来讲，Spring Boot就是一些库的集合，它能够被任意项目的构建系统所使用。Boot的功能是模块化的，通过导入Boot所谓的"starter"模块，可以将许多的依赖添加到工程中。

#### **在ServiceComb中集成SpringBoot**

　　使用原生的ServiceComb框架开发微服务应用，如若需要使用ServiceComb框架提供的各项功能服务，需要在微服务项目工程pom文件中添加相应的依赖包，例如需要使用ServiceComb框架提供的负载均衡服务，需要添加handler-loadbalance包依赖。这样可以把ServiceComb提供的能力以starter的方式插入Spring Boot中，同时使用Spring Boot中提供的其他开箱即用的starter（例如SpringCloud）一起构建微服务。

### ServiceComb集成SpringBoot

　　首先使用ServiceComb框架开发微服务应用，详细步骤请参考[开发服务提供者](/users/service-definition/)与[开发服务消费者](/users/develop-with-rest-template/)。然后在这个基础上集成SpringBoot框架。

　　在对应用进行SpringBoot框架适配前，请确保应用能够正常运行，并且能够从中央的maven库下载依赖的资源。

* **步骤 1** 在工程pom文件添加&lt;dependencyManagement&gt;节点：

   ```xml
   <dependencyManagement> 
     <dependencies> 
       <dependency> 
         <groupId>io.servicecomb</groupId>
         <artifactId>java-chassis-dependencies</artifactId>
         <version>0.1.0</version>
         <type>pom</type>
         <scope>import</scope>
       </dependency>
     </dependencies>
   </dependencyManagement>
   ```

* **步骤 2** 添加如下依赖：

   引入ServiceComb提供的Spring Boot依赖

   ```xml
   <dependency> 
     <groupId>io.servicecomb</groupId>
     <artifactId>spring-boot-starter-provider</artifactId> 
   </dependency>
   ```

   引入Spring Boot依赖

   ```xml
   <dependency> 
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId> 
   </dependency>
   <dependency> 
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-actuator</artifactId> 
   </dependency>
   ```

* **步骤 3** 在resources目录下新建application.yml文件，文件内容如下：

   ```yaml
   server:
     port: 7999 #此处的端口为springboot服务端口
   ```

* **步骤 4** 为微服务启动类添加注解：

   ```java
   package xxx
   import xxx
   @SpringBootApplication //新增注解
   @EnableServiceComb //新增注解
   public class xxxServer/Client {
     public static void main(final String[] args) {
     　 Log4jUtils.init();
     　//BeanUtils.init();
     　SpringApplication.run(xxxServerOrClient.class, args)
     }
   }
   ```

* **步骤 5** 运行/调试应用。

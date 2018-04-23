---
title: "使用Service Center和治理中心管理Spring Cloud应用"
lang: cn
ref: manage_springcloud_application_using_sc_and_gs
permalink: /cn/users/manage_springcloud_application_using_sc_and_gs/
excerpt: "使用Service Center和治理中心管理Spring Cloud应用"
last_modified_at: 2018-04-23T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述

在SpringCloud原生应用中，通过改变相关配置，让SpringCloud应用使用ServiceComb微服务框架中的Service Center和治理中心。

## 场景描述

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

注意： 如果使用Java Chassis 0.5.0 以及以前的版本的，请使用io.servicecomb 作为依赖的groupId。

* **步骤 1** 在pom中添加依赖管理dependencyManagement：

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
   ```

* **步骤 2** 在pom中添加依赖：

   ```xml
   <dependency>
     <!--让服务运行于微服务sdk容器中-->
     <group>org.apache.servicecomb</group>
     <artifactId>spring-boot-starter-provider</artifactId>
   </dependency>
   <dependency>
     <!--使用服务中心-->
     <group>org.apache.servicecomb</group>
     <artifactId>spring-boot-starter-discovery</artifactId>
   </dependency>
   <dependency>
     <!--让服务运行于Spring boot embedded tomcat中-->
     <group>org.apache.servicecomb</group>
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

   在resources目录下新建microservice.yaml文件，对服务进行定义，详细定义规则请参考[服务定义章节](/cn/users/service-definition/)，示例如下：

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
     <group>org.apache.servicecomb</group>
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

* **步骤 6** 定义服务契约，具体请参考[服务契约](/cn/users/service-contract/)，示例如下：

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
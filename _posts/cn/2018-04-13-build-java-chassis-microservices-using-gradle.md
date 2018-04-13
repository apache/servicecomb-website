---
title: "使用gradle构建基于Java Chassis开发的微服务"
lang: cn
ref: build-java-chassis-microservices-using-gradle
permalink: /cn/docs/build-java-chassis-microservices-using-gradle/
excerpt: ""
last_modified_at: 2018-04-13T09:18:43+08:00
author: Eric Lee
tags: [gradle]
redirect_from:
  - /theme-setup/
---

maven和gradle都是Java世界中常用的构建工具。在[Java Chassis](https://github.com/apache/incubator-servicecomb-java-chassis)项目中采用了maven作为其构建工具，并在maven中心仓库定期发布其最新稳定版。然而，鉴于gradle最新发布版(4.6.0)还不支持maven的统一版本管理(BOM)功能，则在使用gradle构建基于Java Chassis开发的微服务时，需要用到Spring的[依赖管理插件](https://github.com/spring-gradle-plugins/dependency-management-plugin)来引入Java Chassis的版本管理来统一依赖项的版本从而避免产生版本冲突。

在maven中，Java Chassis的依赖管理通过以下方式即可引入：

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

在gradle中，则需要以下三步完成，具体可参考：[https://github.com/apache/incubator-servicecomb-java-chassis/pull/640/files#diff-8d0fdb4970d74d053b6585c3d5ae4cc2R36](https://github.com/apache/incubator-servicecomb-java-chassis/pull/640/files#diff-8d0fdb4970d74d053b6585c3d5ae4cc2R36)。

1. 声明使用maven仓库及依赖管理插件的依赖

   ```gradle
   buildscript {
       repositories {
           mavenLocal()
           mavenCentral()
       }
       dependencies {
           classpath('io.spring.gradle:dependency-management-plugin:1.0.4.RELEASE')
       }
   }
   ```

2. 启用依赖管理插件

   ```gradle
   apply plugin: 'io.spring.dependency-management'
   ```

3. 声明Java Chassis的统一依赖管理

   ```gradle
   dependencyManagement {
       imports {
           mavenBom 'org.apache.servicecomb:java-chassis-dependencies:1.0.0-m1'
       }
   }
   ```

**注意：** 在每个子模块中都需要进行上述三步配置。 

对统一版本管理配置完成后，可增加程序运行入口使得命令行下也能方便的通过gradle运行应用，以便快速验证。其中，可将应用分为Spring Boot应用和非Spring Boot应用来为其添加启动入口：

1. Spring Boot应用

   1. 声明使用maven仓库及Spring Boot插件的依赖

      ```gradle
      buildscript {
          dependencies {
              classpath("org.springframework.boot:spring-boot-gradle-plugin:1.4.5.RELEASE")
          }
          repositories {
              mavenLocal()
              mavenCentral()
          }
      }
      ```

   2. 启用Spring Boot插件

      ```gradle
      apply plugin: 'org.springframework.boot'
      ```

2. 非Spring Boot应用

   非Spring Boot应用只需要在`build.gradle`文件中使用`application`插件并指明应用入口方法即可：
   
   ```gradle
   apply plugin: 'application'
   
   mainClassName = 'org.packageName.XXXMain'
   ```

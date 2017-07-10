---
title: "依赖包配置"
lang: en
ref: dependency-config
permalink: /docs/dependency-config/
excerpt: "如何利用JavaChassis迅速创建微服务."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

介绍开发过程依赖包的配置，请根据实际开发模式选择。

{% include toc %}

## 依赖包配置

使用dependencyManagement来进行依赖包版本的管理，通过修改version字段来使用相应版本的依赖包 。

依赖包中包括三类：transport、provider、handler，分别用于引入网络通道、开发模式、治理链依赖包。其中transport和provider为必选，服务端需要增加一个loadbalance handler必选项。在Pom文件中增加如下内容：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>java-chassis-dependencies</artifactId>
      <version>0.1.0-m1</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
    <!-- transport -->
    <dependency>
        <groupId>io.servicecomb</groupId>
        <artifactId>transport-rest-vertx</artifactId>
    </dependency>

    <!-- provider -->
    <dependency>
        <groupId>io.servicecomb</groupId>
        <artifactId>provider-pojo</artifactId>
    </dependency>

    <!-- handler -->
    <dependency>
        <groupId>io.servicecomb</groupId>
        <artifactId>handler-performance-stats</artifactId>
    </dependency>
</dependencies>
```

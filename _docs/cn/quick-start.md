---
title: "快速入门"
lang: cn
ref: quick-start
permalink: /cn/docs/quick-start/
excerpt: "介绍如何使用Java Chassis框架快速运行微服务应用"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}
## 安装 Java 开发环境

* 安装**git**，详情可参考[git安装教程](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git){:target="_blank"}。

* 安装JDK 1.8，详情可参考[JDK安装教程](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html){:target="_blank"}。

* 安装Maven 3.x，详情可参考[Maven安装教程](https://maven.apache.org/install.html){:target="_blank"}。

* 安装 ServiceComb Java Chassis(SDK)，执行以下指令：

   ```bash
   git clone https://github.com/apache/incubator-servicecomb-java-chassis.git
   cd incubator-servicecomb-java-chassis
   mvn clean install -DskipTests
   ```

## 运行 Service Center
在 **ServiceComb** 微服务框架中，**Service Center** 提供服务注册及服务发现功能，可直接使用 Docker 运行。 
```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```
*您可以通过阅读[环境配置](/cn/users/setup-environment/#运行service-center)获取在本地以二进制方式运行Service Center的方法。*

## 创建第一个微服务
本指南将以一个简单的 **体质指数(BMI)** 应用开展微服务之旅。[体质指数](https://baike.baidu.com/item/BMI%E6%8C%87%E6%95%B0){:target="_blank"}主要用于衡量人体胖瘦程度。该应用主要包含两个微服务：

* **体质指数计算器**：负责处理运算事务。

* **体质指数界面**：提供用户界面及网关服务。

其运行流程为：  
![体质指数应用运行流程](/assets/images/quick-start-sample-workflow.png){: .align-center}

其中，虚线表示服务注册及服务发现的过程。

## 运行微服务应用

1. 进入 **体质指数** 应用代码目录。

   ```bash
   cd samples/bmi
   ```
   **注意**：在windows开发环境下，docker是在虚拟机中启动，因此需要修改微服务的 **Service Center** IP地址为虚拟机IP地址。修改2个配置文件[calculator\|webapp]/src/main/resources/microservice.yaml，将其中<a>http://127.0.0.1:30100</a>修改为<a>http://192.168.99.100:30100</a>，其中192.168.99.100是虚拟机IP，需要与开发环境中的虚拟机IP保持一致。

2. 启动 **体质指数计算器** 和 **体质指数界面** 微服务，分别执行以下指令：

   ```bash
   cd calculator; mvn spring-boot:run
   cd webapp; mvn spring-boot:run
   ```

3. 验证服务。微服务启动完毕后，即可通过 <a>http://localhost:8889</a> 访问 **体质指数** 应用，届时将能看到如下界面，并可输入您的身高和体重信息验证服务是否正常运行。

   ![体质指数应用运行界面](/assets/images/bmi-interface.png){: .align-center}

## 下一步

* 阅读[**体质指数**微服务应用快速开发](/cn/docs/quick-start-bmi/)。

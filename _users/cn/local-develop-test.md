---
title: "本地开发与测试"
lang: cn
ref: huawei-cloud
permalink: /cn/users/local-develop-test/
excerpt: "本地开发与测试"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述

本小节介绍如何在开发者本地进行消费者/提供者应用的开发调试。开发服务提供者请参考[开发服务提供者章节](/cn/users/service-definition/)，开发服务消费者请参考[开发服务消费者章节](/cn/users/develop-with-rest-template/)。服务提供者和消费提供者均需要连接到在远程的服务中心，为了本地微服务的开发和调试，本小节介绍了两种搭建本地服务中心的方法进行本地微服务调试：

* [启动本地服务中心](#启动本地服务中心)。

* [通过local file模拟启动服务中心Mock机制](#mock机制启动服务中心)。

服务中心是微服务框架中的重要组件，用于服务元数据以及服务实例元数据的管理和处理注册、发现。服务中心与微服务提供/消费者的逻辑关系下图所示：

![](/assets/images/local_develop_test.png)

## 启动本地服务中心

* **步骤1** 启动本地服务中心，可参考[运行Service Center指南](/cn/users/setup-environment/#运行service-center)。

* **步骤 2** 启动本地轻量服务中心后，在服务提供/消费者的microservice.yaml文件中配置ServerCenter的地址和端口，示例代码：

   ```yaml
   cse:
     service:
       registry:
         address: http://127.0.0.1:30100 #服务中心地址及端口
   ```

* **步骤 3** 开发服务提供/消费者，启动微服务进行本地测试。

## Mock机制启动服务中心

* **步骤 1**新建本地服务中心定义文件registry.yaml，内容如下：

   ```yaml
   springmvctest:
     - id: "001"
       version: "1.0"
       appid: myapp #调试的服务id
       instances: 
         endpoints:
           rest://127.0.0.1:8080
   ```

   mock机制需要自己准备契约，并且当前只支持在本地进行服务消费端\(consumer\)侧的调试，不支持服务提供者\(provider\)

* **步骤 2**在服务消费者Main函数首末添加如下代码：

   ```java
   public class xxxClient {
   public static void main(String[] args) {
     System.setProperty("local.registry.file", "/path/registry.yaml");
     //your code
     System.clearProperty("local.registry.file");
   }
   ```

setProperty第二个参数填写registry.yaml的系统绝对路径，注意区分在不同系统下使用对应的路径分隔符。

* **步骤 3**开发服务消费者，启动微服务进行本地测试。

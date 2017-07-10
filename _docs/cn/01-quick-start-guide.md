---
title: "快速入门"
lang: cn
ref: quick-start-guide
permalink: /cn/docs/quick-start-guide/
excerpt: "如何利用JavaChassis迅速创建微服务."
last_modified_at: 2017-06-06T10:01:43-04:00
---

这个快速入门指南会帮助您迅速进行微服务业务开发。JavaChassis支持三种开发模式，此处通过POJO开发模式进行示例讲解，关于支持的Spring MVC/JAX RS两种开发模式，请参考详细的[用户手册]({{ site.url }}{{ site.baseurl }}/cn/docs/user-guide/)。

{% include toc %}

## 前提
环境准备:

1. JDK 1.8

2. maven 3.x

3. Docker可选，推荐直接使用二进制版本

4. 下载示例[POJO开发模式工程代码](https://github.com/ServiceComb/java-chassis/archive/master.zip)    
   注：示例工程pojo-sample在java-chassis/samples下，所以下载整个java-chassis工程

## 简单示例

第一步：运行Service Center进行服务的注册和发现  
第二步：运行Provider工程发布服务  
第三步：运行Consumer端服务消费  

### 运行Service Center

有两种方式运行Service Center:

1.通过docker镜像运行Service Center

```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```

2.直接运行编译好的二进制文件：
可以直接从service-center [release](https://github.com/servicecomb/service-center/releases/)页面下载Service Center运行包。
解压直接运行启动脚本：

Windows
软件包：service-center-xxx-windows-amd64.zip
启动：
```
start.bat
```

Linux
软件包： service-center-xxx-linux-amd64.zip
启动：
```
./start.sh
```

**Note:** Service Center运行后的绑定IP为http://127.0.0.1:30100。
如使用docker toolbox，可以通过 ```docker-machine ip``` 获取服务绑定IP地址。
{: .notice--warning}

### 运行Provider工程发布服务

导入示例工程，通过IDE直接运行Provider工程Main函数，启动成功完成服务发布。  

Main函数所在的类：pojo-provider:PojoProviderMain

### 运行Consumer端服务消费

导入示例工程，通过IDE直接运行Consumer工程Main函数   

Main函数所在的类：pojo-consumer:PojoConsumerMain    

启动成功，打印输出信息完成服务消费。

```
Hello Java Chassis 
Hello person ServiceComb/Java Chassis 
a: 1, b=2, result=3
```  

## 示例详解

请参考“[POJO例子]({{ site.url }}{{ site.baseurl }}/cn/docs/pojo-sample/)”页面的详细说明  


---
title: "单体应用利用ServiceComb实现微服务化和云化之路"
lang: en
ref: go-to-cloud
permalink: /docs/go-to-cloud/
excerpt: "该文档演示：从已有基于spring boot的单体应用利用ServiceComb实现微服务化和云化之路"
last_modified_at: 2017-06-24T11:40:00+08:00
author: Tank Tian
tags: [Huawei Cloud]
redirect_from:
  - /theme-setup/
---

## 背景

1. Service Stage：微服务云应用平台，它是面向企业及开发者的一站式DevOps平台服务，支持基于微服务的应用开发、治理、部署及运维监控的全生命周期管理，并提供大规模容器集群管理及中间件服务等平台能力，帮助用户快速构建云分布式应用。  

2. 本指导以Acmeair demo为例，演示如何使用ServiceComb (华为微服务框架开源版本)实现应用的微服务化，并利用Service Stage云平台上实现应用的云化。  


## 服务化和云化步骤

*	环境准备：基于Service Stage完成创建集群、添加节点等资源准备工作 

* 微服务开发

   1. 微服务的拆分设计

   2. 基于ServiceComb框架快速微服务化

   3. 制作镜像上传Service Stage软件仓库；

* 应用上线：通过Service Stage从软件仓库获取版本实现部署上线；

* 应用运维：通过Service Stage对微服务或应用进行生命周期管理（部署-启动-上线-升级-扩容-停止-下线-删除）、告警、监控、调用链分析和治理等。

## 环境准备：创建集群、添加节点，完成节点自动纳管
###	创建集群  
请参考[创建集群详细指导](http://support.hwclouds.com/usermanual-servicestage/zh-cn_topic_0053496188.html)  
![create group]({{ site.url }}{{ site.baseurl }}/assets/images/create-group.png){: .align-center}

###	添加节点  
请参考[为集群添加节点详细指导](http://support.hwclouds.com/usermanual-servicestage/zh-cn_topic_0053443149.html)   
![add node]({{ site.url }}{{ site.baseurl }}/assets/images/add-node.png){: .align-center}

## 微服务开发
###	应用架构设计，划分微服务，识别服务依赖关系
![micro service design]({{ site.url }}{{ site.baseurl }}/assets/images/micro-service-design.png){: .align-center}

### 创建微服务: 单体应用--->微服务应用
![micro service structure]({{ site.url }}{{ site.baseurl }}/assets/images/micro-service-structure.PNG){: .align-center}

### 简单4步ServiceComb帮你完成微服务化改造
备注：改造完成的Acmeair Demo如何本地运行，如何本地查看运行效果？ 请参考下文“Acmeair本地运行”章节。
#### Step 1: POM引入对ServiceComb和Service Stage的依赖
对ServiceComb的依赖：
![pom dependence]({{ site.url }}{{ site.baseurl }}/assets/images/pom-dependence.png){: .align-center}  

对Service Stage的依赖：   
![huaweicloud dependencies]({{ site.url }}{{ site.baseurl }}/assets/images/huaweicloud_dependencies.png){: .align-center}

#### Step 2 增加微服务描述文件和spring配置文件
![config file]({{ site.url }}{{ site.baseurl }}/assets/images/config-file.png){: .align-center}

#### Step 3: 引入ServiceComb注解一行代码完成服务发布
![code adjust]({{ site.url }}{{ site.baseurl }}/assets/images/code-adjust.png){: .align-center}

#### Step 4: 使用ServiceComb接口简单创建RestTemplate完成服务消费（也支持注解方式进行消费）
![service consumer]({{ site.url }}{{ site.baseurl }}/assets/images/service-consumer.png){: .align-center}

### 制作镜像上传到云镜像中心
请参考[上传镜像详细指导](http://support.hwclouds.com/usermanual-servicestage/zh-cn_topic_0055101643.html)  
![image upload 1]({{ site.url }}{{ site.baseurl }}/assets/images/image-upload-1.png){: .align-center}  
![image upload 2]({{ site.url }}{{ site.baseurl }}/assets/images/image-upload-2.png){: .align-center}

## 应用上线：利用应用管理实现部署上线
请参考[部署微服务详细指导](http://support.hwclouds.com/usermanual-servicestage/user_deployService.html)   
![service deploy]({{ site.url }}{{ site.baseurl }}/assets/images/service-deploy.png){: .align-center}

## 应用运维：保障应用平稳运行
### 微服务调用链分析
请参考[应用调用分析详细指导](http://support.hwclouds.com/usermanual-servicestage/zh-cn_topic_0053555508.html)  
 ![service monitor 1]({{ site.url }}{{ site.baseurl }}/assets/images/service-monitor-1.png){: .align-center}

### 微服务状态监控
请参考[应用监控详细指导](http://support.hwclouds.com/usermanual-servicestage/zh-cn_topic_0053555506.html)  
![service monitor 2]({{ site.url }}{{ site.baseurl }}/assets/images/service-monitor-2.png){: .align-center}

### 按需弹性伸缩
请参考[弹性伸缩详细指导](http://support.hwclouds.com/usermanual-servicestage/zh-cn_topic_0054051691.html)  
![scaling]({{ site.url }}{{ site.baseurl }}/assets/images/scaling.png){: .align-center}

### 微服务可视化治理
请参考[微服务管理详细指导](http://support.hwclouds.com/usermanual-servicestage/zh-cn_topic_0053560172.html)  
![governance]({{ site.url }}{{ site.baseurl }}/assets/images/governance.png){: .align-center}

# Acmeair本地运行
本章节介绍在windows 64位环境下如何本地运行Acmeair

## 环境准备

* JDK 1.8

* maven 3.x

* eclipse

* service-center    

   下载[service-center-x.x.x-x-windows-amd64.zip](https://github.com/ServiceComb/service-center/releases)解压到任意目录

* mongodb（可选）

* 下载[acmeair源码](https://github.com/TankTian/acmeair/archive/master.zip)

## 导入项目并构建
### 将acmeair项目导入eclipse
Import - - Maven:Existing Maven Projects，选择代码所在的目录，点击finish完成导入    
![import project]({{ site.url }}{{ site.baseurl }}/assets/images/import-project.png){: .align-center}

###	修改微服务描述文件

1. acmeair-booking-service\src\main\resources\microservice.yaml  
   ![booking microservice yaml]({{ site.url }}{{ site.baseurl }}/assets/images/booking-microservice-yaml.png){: .align-center}  

2. acmeair-customer-service\src\main\resources\microservice.yaml   
   ![customer microservice yaml]({{ site.url }}{{ site.baseurl }}/assets/images/customer-microservice-yaml.png){: .align-center}  

3. acmeair-website\src\main\resources\microservice.yaml  
   ![website microservice yaml]({{ site.url }}{{ site.baseurl }}/assets/images/website-microservice-yaml.png){: .align-center} 

###	执行 mvn install 结果 BUILD SUCCESS ，项目完成构建
![compile]({{ site.url }}{{ site.baseurl }}/assets/images/compile.png){: .align-center} 

## 启动服务
### service-center
找到service-center-0.1.0-m1-windows-amd64解压目录，双击start.bat  
![servcie center]({{ site.url }}{{ site.baseurl }}/assets/images/servcie-center.png){: .align-center}   
![service center start success]({{ site.url }}{{ site.baseurl }}/assets/images/service-center-start-success.png){: .align-center} 

###	acmeair-booking
AcmeairApplication:Run As - - Run Configurations…  
![start booking]({{ site.url }}{{ site.baseurl }}/assets/images/start-booking.png){: .align-center}    
watching microservice 2 successfully，服务注册成功  
![booking start success]({{ site.url }}{{ site.baseurl }}/assets/images/booking-start-success.png){: .align-center} 

###	acmeair-customer
CustomerServiceApplication:Run As - - Run Configurations…  
![start customer]({{ site.url }}{{ site.baseurl }}/assets/images/start-customer.png){: .align-center}   
watching microservice 4 successfully，服务注册成功  
![customer start success]({{ site.url }}{{ site.baseurl }}/assets/images/customer-start-success.png){: .align-center} 

###	acmeair-website
将acmeair-website\target\ROOT.war复制到tomcat webapps文件夹下，启动tomcat  
![start website]({{ site.url }}{{ site.baseurl }}/assets/images/start-website.png){: .align-center} 

## 前台访问
输入http://localhost:8080  
![home page]({{ site.url }}{{ site.baseurl }}/assets/images/home-page.png){: .align-center}

点击网页最下端Acme航空配置  
![init data]({{ site.url }}{{ site.baseurl }}/assets/images/init-data.png){: .align-center} 

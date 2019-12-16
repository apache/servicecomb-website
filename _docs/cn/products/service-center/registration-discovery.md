---
title: "服务注册发现"
lang: cn
ref: registration-discovery
permalink: /cn/docs/products/service-center/registration-discovery/
excerpt: "服务中心注册发现"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## 服务注册发现
   在微服务架构中，一个应用由一组职责单一化的服务组成，各个服务被动态的部署到不同的节点。面对这样一组服务，应该如何去管理服务之间的依赖关系呢？ 
   ![1](/assets/images/docs/service-center/service-center-why.png)   
   服务注册中心的出现正是为了解决这样的问题，它提供的注册机制，允许服务提供者将自己的信息登记到中心；提供的发现机制，供服务消费者从中心查找服务提供者信息。
   服务注册中心有以下几个优点：  
   - 1 解耦服务提供者与服务消费者，服务消费者不需要硬编码服务提供者地址；
   - 2 服务动态发现及可伸缩能力，服务提供者实例的动态增减能通过注册中心动态推送到服务消费者端；
   - 3 通过注册中心可以动态的监控服务运行质量及服务依赖，为服务提供服务治理能力。

## 注册发现流程
   ![1](/assets/images/docs/service-center/registration&discovery.png)  
   如上图，Service-Center中服务发现流程大致有以下几个步骤：
   - 1 服务提供者向Service-Center注册服务信息
   - 2 服务提供者发送心跳，维持在Service-Center中的“UP”状态
   - 3 服务消费者向Service-Center注册服务信息
   - 4 服务消费者从Service-Center发现服务提供者信息
   - 5 服务消费者向服务提供者发送请求，并获取通讯结果  
   
Service-Center注册发现接口基于RESTful标准实现，不受开发语言限制，接口定义请参考[官方API文档](https://rawcdn.githack.com/ServiceComb/service-center/master/docs/api-docs.html) 

## 注册发现初窥
以下将通过 curl 命令模拟 Service-center 中的服务注册与发现，以便于了解其流程。
1. provider 服务注册
   ```bash
   $ curl -X POST \
   http://127.0.0.1:30100/registry/v3/microservices \
   -H 'content-type: application/json' \
   -H 'x-domain-name: default' \
   -d '{
     "service":
     {
       "appId": "default",
       "serviceName": "ProviderDemoService",
       "version":"1.0.0"
     }
   }'
   {"serviceId":"fa82132706a6b75a13393d8cf48800f9689b2603"}
   ```
2. provider 实例注册  
根据上一步返回的的 serviceId，注册微服务实例
   ```bash
   $ curl -X POST \
   http://127.0.0.1:30100/registry/v3/microservices/fa82132706a6b75a13393d8cf48800f9689b2603/instances \
   -H 'content-type: application/json' \
   -H 'x-domain-name: default' \
   -d '{
     "instance": 
     {
         "hostName":"provider-demo",
         "endpoints": [
             "rest://127.0.0.1:8080"
         ]
     }
   }'
   {"instanceId":"6e160fb0196e11e9b8b50242ac110005"}
   ```
3. consumer 服务注册
   ```bash
   $ curl -X POST \
   http://127.0.0.1:30100/registry/v3/microservices \
   -H 'content-type: application/json' \
   -H 'x-domain-name: default' \
   -d '{
     "service":
     {
       "appId": "default",
       "serviceName": "ConsumerDemoService",
       "version":"1.0.0"
     }
   }'
   {"serviceId":"d08d29edbeaa372c5be88407aa9adb00b4cb6099"}
   ```
4. 服务发现  
根据 provider 服务名称和版本规则、以及 consumer 服务 ID 进行 provider 服务实例发现
   ```bash
   $ curl -X GET \
   'http://127.0.0.1:30100/registry/v3/instances?appId=default&serviceName=ProviderDemoService&version=latest' \
   -H 'content-type: application/json' \
   -H 'x-consumerid: d08d29edbeaa372c5be88407aa9adb00b4cb6099' \
   -H 'x-domain-name: default'
   {
     "instances": [
       {
         "instanceId": "c23da577197111e9b8b50242ac110005",
         "serviceId": "fa82132706a6b75a13393d8cf48800f9689b2603",
         "endpoints": [
           "rest://127.0.0.1:8080"
         ],
         "hostName": "provider-demo",
         "status": "UP",
         "healthCheck": {
           "mode": "push",
           "interval": 30,
           "times": 3
         },
         "timestamp": "1547631199",
         "modTimestamp": "1547631199",
         "version": "1.0.0"
       }
     ]
   }
   ```

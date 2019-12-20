---
title: "Registration&Discovery"
lang: en
ref: registration-discovery
permalink: /docs/products/service-center/registration-discovery/
excerpt: "Registration and discovery of the service-center"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## Registration&Discovery
   In a microservices architecture, an application consists of a set of services with a single responsibility, and each service is dynamically deployed to a different node. How should we manage the dependencies between this set of services? 
   ![1](/assets/images/docs/service-center/service-center-why.png)   
   The service registry has solved this problem. It allows the service of provider to register its information to the service-center; the service of consumer can discover the provider information from the service-center.
   The service registry has several advantages: 
   - 1 Decouple the provider and the consumer, the service consumer does not need to know the provider address;
   - 2 Service dynamic discovery and scalability, dynamic changes of the instance of provider will be pushed to the consumer with the service-center;
   - 3 You can monitor the quality of service operations and service dependencies dynamically, and provide governance capabilities for services.

## Registration and discovery process
   ![1](/assets/images/docs/service-center/registration&discovery.png)  
   The service registration and discovery process in Service-Center has the following steps:  
   - 1 Registration the provider service to Service-Center.  
   - 2 The provider sends a heartbeat to maintain the "UP" state in Service-Center.  
   - 3 Registration the consumer service to Service-Center.  
   - 4 The Consumer discover the provider information from Service-Center.  
   - 5 The consumer request the provider and get results.  
   
The Service-Center registration and discovery interface is implemented based on the RESTful standard. It is not restricted by the development language. For the interface definition, please refer to [API Document](https://rawcdn.githack.com/ServiceComb/service-center/master/docs/api-docs.html) 

## First used of registration and discovery
This chapter is about how to implement the feature of micro-service discovery with ServiceCenter.
1. Registration the provider service
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
   ```
   And then you can get the 'ProviderDemoService' ID like below:
   ```bash
   {"serviceId":"fa82132706a6b75a13393d8cf48800f9689b2603"}
   ```
2. Registration the provider instance  
Mark down the micro-service ID and call the instance registration API, according to the ServiceCenter definition: One process should be registered as one instance.
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
   ```
   The successful response like below:
   ```bash
   {"instanceId":"6e160fb0196e11e9b8b50242ac110005"}
   ```
3. Registration the consumer service
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
   ```
   if all are successful, it means you have completed the micro-service registration and instance publish
   ```bash
   {"serviceId":"d08d29edbeaa372c5be88407aa9adb00b4cb6099"}
   ```
4. Discovery the provider  
The next step is that discovery the micro-service instance by service name and version rule
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

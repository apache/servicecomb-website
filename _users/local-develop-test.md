---
title: "Local Development and Test"
lang: en
ref: huawei-cloud
permalink: /users/local-develop-test/
excerpt: "Local Development and Test"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description

This section describes how developers can locally develop and commission consumer and provider applications. Both service providers and consumers need to connect to the remote service center. Two methods of building Local  ServiceCenter for local microservice commissioning are as follows:

* Starting [Local Service Center](#启动本地服务中心)。

* Starting Local Service Center [Mock mechanism](#mock机制启动服务中心)。

Service center is an important component in the microservice architecture, and is used for managing, registering, and detecting metadata and instance metadata. The logic relationship between the service center and microservice provider/consumer is as follows:

![](/assets/images/local_develop_test_en.png)

## Starting Local ServiceCenter

* **Step 1** Starting local service center,  please refer to [Setup Environment](/users/setup-environment/#运行service-center),

* **Step 2** After local service center is started, configure the service center address in the microservice.yaml file that stores SDK configuration information, as shown in the following example:

   ```yaml
   cse:
     service:
       registry:
         address: http://127.0.0.1:30100 #Indicates the service center address and port number
   ```

* **Step 3** Develop service providers and consumers enable the microservice for local tests.

## Enable Local ServiceCenter Using the Mock Mechanism

* **Step 1** Create the registry.yaml file for Local ServiceCenter

   ```yaml
   springmvctest:
     - id: "001"
       version: "1.0"
       appid: myapp #Commissioning service ID
       instances: 
         endpoints:
           rest://127.0.0.1:8080
   ```

   NOTE: The mock mechanism needs an API definition on its own. Currently, only local commissioning for service consumers is supported.

* **Step 2** Add the following code to the end of the Main function for service consumers.

   ```java
   public class xxxClient {
   public static void main(String[] args) {
     System.setProperty("local.registry.file", "/path/registry.yaml");
     //your code
     System.clearProperty("local.registry.file");
   }
   ```

   NOTE: Set the second parameter of setProperty to the absolute path of registry.yaml file in the disk. The path separator depends on the system it is in.

* **Step 3** Develop service consumers and enable the microservice for local tests.
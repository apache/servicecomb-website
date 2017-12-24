---
title: "Using Confd and Nginx for Edge Service"
lang: en
ref: edging-service-nginx
permalink: /users/edging-service/nginx/
excerpt: "Using Confd and Nginx for Edge Service"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description

### **confd**

confd is a lightweight configuration management tool. The source code address is: https://github.com/kelseyhightower/confd](https://github.com/kelseyhightower/confd), It can store configuration information in etcd, consul, dynamodb, redis, and zookeeper. confd regularly pulls the latest configuration from storage nodes and then reloads services to complete updating the configuration file.

### **Nginx**

Nginx \(engine x\) is a high-performance HTTP and  reverse proxy server that has the load balancing function. For details, see [http://www.nginx.cn/doc/](http://www.nginx.cn/doc/). This secton describes the HTTP proxy function of Nginx.

## Scenario

This section describes how to use Nginx and confd to serve as edge services. Also, you can connect Nginx and confd to service center in the Java Chassis microservice framework and dynamically update configuration of Nginx using confd.

For details about how to use the dynamic reverse proxy of Nginx and confd, see [http://www.cnblogs.com/Anker/p/6112022.html](http://www.cnblogs.com/Anker/p/6112022.html), This section describes how to interconnect Confd with the service center of the Java Chassis framework.

## Interconnecting with the Service Center

This section describes how to enable confd to obtain service information from the service center. The service center provides the following APIs for external calls:

### **Method 1: HTTP call**

The tenant header information of "X-Tenant-Name:tenantName" needs to be added to the HTTP API in the Service Center. tenameName is the tenant name. The default value is default, such as X-Tenant-Name:default.

* Check the health status of the service center

  ```http
   GET 127.0.0.1:9980/health
  ```

* Obtain all microservice information

  ```http
   GET 127.0.0.1:9980/registry/v3/microservices
  ```

* Obtain the microservice information with a specified ID

> 1. Obtain the service ID based on the microservice information
>
>    ```http
>    GET 127.0.0.1:9980/registry/v3/existence?type=microservice&appId={appId}&serviceName={serviceName}&version={version}
>    ```
>
> 2. Obtain complete microservice information based on the service ID returned by API
>
>    ```http
>    GET 127.0.0.1:9980/registry/v3/microservices/{serviceId}
>    ```

* Obtain all instance information from specified microservice

  ```http
   GET 127.0.0.1:9980/registry/v3/microservices/{serviceId}/instances
  ```
   Add the following information to the header file:

   "X-ConsumerId:{serviceId}"

* Searching microservice instance information

  ```http
   GET 127.0.0.1:9980/registry/v3/instances?appId={appId}&serviceName={serviceName}&version={version}
  ```
  Add the following information to the header file:

  "X-ConsumerId:{serviceId}"

NOTE: The preceding service center address is provides as example only. Set the variables enclosed in curly brackets ({}) as needed. The data returned via HTTP is in JSON format.

### **Method 2: Using the open-source code API**

During the development of the microservice application, you only need to call the API provided by the tool RegistryUtil.java in the ServiceComb framework code to obtain the information in the Service Center. The API is described as follows:

* Obtain all microservice information
   ```java
   List<Microservice> getAllMicroservices();
   ```

* Obtain the unique ID of the microservice.
   ```java
   String getMicroserviceId(String appId, String microserviceName, String versionRule);
   ```

* Query the microservice static information based on the unique ID of the microservice.
   ```java
   Microservice getMicroservice(String microserviceId);
   ```

* Query all the microservice instance information based on the unique IDs of the microservices.
   ```java
   List<MicroserviceInstance> getMicroserviceInstance(String consumerId, String providerId);
   ```
* Query the instance end points information based on the application, interface, and version.  
   ```java
   List<MicroserviceInstance> findServiceInstance(String consumerId, String appId, String serviceName,String versionRule);
   ```

You can obtain information about the microservice and instance of the Service Center using the HTTP API to dynamically update the Nginx configuration using confd.

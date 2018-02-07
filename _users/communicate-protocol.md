---
title: "Communication Protocol"
lang: en
ref: communicate-protocol
permalink: /users/communicate-protocol/
excerpt: "Communication Protocol"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Communication Protocol
### Concept Description

ServiceComb uses two network channels, REST and Highway, both supporting encrypted Transport Layer Security (TLS) transmission. The REST channel releases services in the standard RESTful form. The consumer can send requests using http client.

### Precautions

Serialization of parameters and the returned values:

Currently, the body parameters of the REST channel support only the application/json serialization. To send form-type parameters to the server, construct a body of the application/json format at the consumer end. Do not send the form type parameters in multipart/form-data format.

Currently, the REST channel supports the application/json and text/plain serialization. A provider uses produces to declare that it has the serialization capability. The consumer specifies the serialization mode of the returned values by setting parameters regarding the requested Accept header. Data serialized in application/json serialization mode is returned by default.

## Thread Model
### Concept Description

This section describes the thread model for ServiceComb microservices and the relationship between the I/O and service threads.

### Thread Model

The complete thread model of CSE is shown in the following figure.

![](/assets/images/thread-model-en.png)

> 1. When a service thread is called for the first time, it binds to a network thread to avoid thread conflicts caused by switching among different network threads.
> 2. After the service thread bound to a network thread, it will bind to a connection of the network to avoid thread conflicts.

* Multiple network threads (eventloop) can be bound to both the client and the server. The number of network threads is two times the quantity of the CPU cores by default. Multiple connections can be configured for each network thread, and the default number is 1. The Rest and Highway network channels are supported. For details about these configurations, see following sections:
   * [REST over Servlet](/users/communicate-protocol#rest-over-servlet)
   * [REST over Vertx](/users/communicate-protocol/#rest-over-vertx)
   * [Highway RPC Protocol](/users/communicate-protocol/#highway-rpc协议)
* You can configure the service thread pool executor for the client, and the thread granularity can be schemaId: operation.

Add the executors in the microservice.yaml file and configure an independent service thread pool for schemaId: operation:

```yaml
cse: 
  executors: 
    Provider: 
      [schemaId].[operation]
```

## REST over Servlet
### Configuration

　　REST over Servlet is deployed and runs using a web container. You need to create a servlet project to pack the microservice, load it to the web container, and then start it. To pack a microservice, you can either fully configure it in the web.xml, or configure its listener and urlPattern in the web.xml and microservice.yaml files, respectively.

* Configure the microservice in the web.xml file.

   The web.xml file is under the src/main/webapp/WEB\_INF directory of the project, and its content is as follows:

   ```xml
   <web-app xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd" version="3.0">  
     <context-param> 
       <param-name>contextConfigLocation</param-name>  
       <param-value>classpath*:META-INF/spring/*.bean.xml classpath*:app-config.xml</param-value> 
     </context-param>  
     <listener> 
       <listener-class>org.apache.servicecomb.transport.rest.servlet.RestServletContextListener</listener-class> 
     </listener>  
     <servlet> 
       <servlet-name>RestServlet</servlet-name>  
       <servlet-class>org.apache.servicecomb.transport.rest.servlet.RestServlet</servlet-class>  
       <load-on-startup>1</load-on-startup>  
       <async-supported>true</async-supported> 
     </servlet>  
     <servlet-mapping> 
       <servlet-name>RestServlet</servlet-name>  
       <url-pattern>/rest/*</url-pattern> 
     </servlet-mapping> 
   </web-app>
   ```

* Configure the listener in the web.xml file and urlPattern in the microservice.yaml file.

   ```xml
   <web-app xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd" version="3.0">  
     <context-param> 
       <param-name>contextConfigLocation</param-name>  
       <param-value>classpath*:META-INF/spring/*.bean.xml classpath*:app-config.xml</param-value> 
     </context-param>  
     <listener> 
       <listener-class>org.apache.servicecomb.transport.rest.servlet.RestServletContextListener</listener-class> 
     </listener> 
   </web-app>
   ```

   In the microservice.yaml file, add a row to specify the urlPattern：

   ```yaml
   servicecomb.rest.servlet.urlPattern: /rest/*
   ```

The two method are equivalent, and they both require that the following dependencies be added in the pox.xml file:

```xml
<dependency> 
  <groupId>org.apache.servicecomb</groupId>  
  <artifactId>transport-rest-servlet</artifactId> 
</dependency>
```

Configuration items that need to be set in the microservice.yaml file are described in Table 1:

Table 1 Configuration items of REST over Servlet

| Configuration Item                  | Default Value | Value Range | Mandatory | Description                              | Remark                                   |
| :---------------------------------- | :------------ | :---------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| cse.rest.address                    | 0.0.0.0:8080  | -           | No        | Specifies the server listening IP address. | -                                        |
| cse.rest.timeout                    | 3000          | -           | No        | Specifies the timeout duration           | The unit is ms.                          |
| cse.request.timeout                 | 30000         | -           | No        | Specifies the request timeout duration.  | The configuration of this parameter for REST over Servlet is the same as that for REST over Vertx. |
| cse.references.\[服务名\].transport    | rest          |             | No        | Specifies the accessed transport type.   | The configuration of this parameter for REST over Servlet is the same as that for REST over Vertx. |
| cse.references.\[服务名\].version-rule | latest        | -           | No        | Specifies the version of the accessed instance. | The configuration of this parameter for REST over Servlet is the same as that for REST over Vertx. |

### Sample Code

The following is an example of the configuration in the microservice.yaml file for REST over Servlet:

```yaml
cse:
  rest:
    address: 0.0.0.0:8080
    timeout: 3000
```

## REST over Vertx
### Configuration

The REST over Vertx communication channel uses the standalone running mode that can be started using the main function. In the main function, you need to initialize logs and load service configuration. The code is as follow:

```java
import org.apache.servicecomb.foundation.common.utils.BeanUtils;
import org.apache.servicecomb.foundation.common.utils.Log4jUtils;

public class MainServer {
  public static void main(String[] args) throws Exception {
  　Log4jUtils.init();//Log initialization
  　BeanUtils.init(); // Spring bean initialization
  }
}
```

To use the REST over Vertx communication channel, you need to add the following dependencies in the maven pom.xml file:

```xml
<dependency>
　　<groupId>org.apache.servicecomb</groupId>
　　<artifactId>transport-rest-vertx</artifactId>
</dependency>
```

Configuration items that need to be set in the microservice.yaml file are described as follows:

Table 2 Configuration items of REST over Vertx

| Configuration Item                       | Default Value | Value Range | Mandatory | Description                              | Remark                                   |
| :--------------------------------------- | :------------ | :---------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| cse.rest.address                         | 0.0.0.0:8080  | -           | No        | Specifies the server listening IP address. | Only service providers require this parameter. |
| cse.rest.server.thread-count             | 1             | -           | No        | Specifies the number of server threads.  | Only service providers require this parameter. |
| cse.rest.client.thread-count             | 1             | -           | No        | Specifies the number of client network threads. | Only service consumers require this parameter. |
| cse.rest.client.connection-pool-per-thread | 1             | -           | No        | Specifies the number of connection pools in each client thread. | Only service consumers require this parameter. |
| cse.request.timeout                      | 30000         | -           | No        | Specifies the request timeout duration.  |                                          |
| cse.references.\[服务名\].transport         | rest          |             | No        | Specifies the accessed transport type.   | Only service consumers require this parameter. |
| cse.references.\[服务名\].version-rule      | latest        | -           | No        | Specifies the version of the accessed instance. | Only service consumers require this parameter. You can set it to latest, a version range such as 1.0.0+ or 1.0.0-2.0.2, or a specific version number. For details, see the API description of the service center. |

### Sample Code

An example of the configuration in the microservice.yaml file for REST over Vertx is as follows:

```yaml
cse:
  rest:
    address: 0.0.0.0:8080
    thread-count: 1
  references:
    hello:
      transport: rest
      version-rule: 0.0.1
```

## Highway RPC Protocol
### Concept Description

Highway is a high-performance proprietary protocol of ServiceComb, and you can use it in scenarios having special performance requirements.

### Configuration

To use the Highway communication channel, you need to add the following dependencies in the maven pom.xml file:

```xml
<dependency> 
  <groupId>org.apache.servicecomb</groupId>  
  <artifactId>transport-highway</artifactId> 
</dependency>
```

Configuration items that need to be set in the microservice.yaml file are described as follows:

Table 3 Configuration items of Highway

| Configuration Item                       | Default Value | Value Range | Mandatory | Description                              | Remark                                   |
| :--------------------------------------- | :------------ | :---------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| cse.highway.address                      | 0.0.0.0:7070  | -           | No        | Specifies the server listening IP address. | -                                        |
| cse.highway.server.thread-count          | 1             | -           | No        | Specifies the number of server network threads. | -                                        |
| cse.highway.client.thread-count          | 1             | -           | No        | Specifies the number of client network threads. | -                                        |
| cse.highway.client.connection-pool-per-thread | 1             | -           | No        | Specifies the number of connection pools in each client thread. | -                                        |
| cse.request.timeout                      | 30000         | -           | No        | Specifies the request timeout duration.  | The configuration of this parameter for Highway is the same as that for REST over Vertx. |
| cse.references.\[服务名\].transport         | rest          |             | No        | Specifies the accessed transport type.   | The configuration of this parameter for Highway is the same as that for REST over Vertx. |
| cse.references.\[服务名\].version-rule      | latest        | -           | No        | Specifies the version of the accessed instance. | The configuration of this parameter for Highway is the same as that for REST over Vertx. |

### 

An example of the configuration in the microservice.yaml file for Highway is as follows:

```yaml
cse:
  highway:
    address: 0.0.0.0:7070
```

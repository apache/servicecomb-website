---
title: "通信协议"
lang: cn
ref: communicate-protocol
permalink: /cn/users/communicate-protocol/
excerpt: "通信协议"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 通信协议
### 概念阐述

ServiceComb实现了两种网络通道，包括REST和Highway，均支持TLS加密传输。其中，REST网络通道将服务以标准RESTful形式发布，调用端兼容直接使用http client使用标准RESTful形式进行调用。

### 注意事项

参数和返回值的序列化：

当前REST通道的body参数只支持application/json序列化方式，如果要向服务端发送form类型的参数，那么需要在调用端构造好application/json格式的body，不能直接以multipart/form-data格式传递form类型参数。

当前REST通道返回值支持application/json和text/plain两种格式，服务提供者通过produces声明可提供序列化能力，服务消费者通过请求的Accept头指明返回值序列化方式，默认返回application/json格式的数据。

## 线程模型
### 概念阐述

本小节主要介绍ServiceComb微服务的完整线程模型，介绍IO线程和业务线程之间的关系

### 完整线程

ServiceComb微服务的完整线程模型如下图所示：

![](/assets/images/thread-model.png)

> 1. 业务线程在第一次调用时会绑定某一个网络线程,避免在不同网络线程之间切换,无谓地增加线程冲突的概率
> 2. 业务线程绑定网络线程后,会再绑定该网络线程内部的某个连接,同样是为了避免线程冲突

* 客户端和服务器都可以配置多个网络线程\(eventloop\)，默认为CPU核数的两倍，每个网络线程可以配置多个连接，默认为1，支持Rest和Highway两种网络通道，具体配置请查看如下章节：
   * [REST over Servlet](/cn/users/communicate-protocol#rest-over-servlet)
   * [REST over Vertx](/cn/users/communicate-protocol/#rest-over-vertx)
   * [Highway RPC协议](/cn/users/communicate-protocol/#highway-rpc协议)
* 客户端可配置业务线程池executor，线程粒度可细化至schemaId:operation，配置如下：

在microservice.yaml中添加executors配置，为schemaId:operation配置单独的业务线程池：

```yaml
cse: 
  executors: 
    Provider: 
      [schemaId].[operation]
```

## REST over Servlet
### 配置说明

　　REST over Servlet对应使用web容器模式部署运行，需要新建一个servlet工程将微服务包装起来，加载到web容器中启动运行，包装微服务的方法有两种，一种完全使用web.xml配置文件配置，另一种仅在web.xml文件中配置listener，在microservice.yaml文件中配置urlPattern，两种方式如下所示：

* 在web.xml文件中完成全部配置

   web.xml文件配置在项目的src/main/webapp/WEB\_INF目录，配置内容如下：

   ```xml
   <web-app xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd" version="3.0">  
     <context-param> 
       <param-name>contextConfigLocation</param-name>  
       <param-value>classpath*:META-INF/spring/*.bean.xml classpath*:app-config.xml</param-value> 
     </context-param>  
     <listener> 
       <listener-class>io.servicecomb.transport.rest.servlet.RestServletContextListener</listener-class> 
     </listener>  
     <servlet> 
       <servlet-name>RestServlet</servlet-name>  
       <servlet-class>io.servicecomb.transport.rest.servlet.RestServlet</servlet-class>  
       <load-on-startup>1</load-on-startup>  
       <async-supported>true</async-supported> 
     </servlet>  
     <servlet-mapping> 
       <servlet-name>RestServlet</servlet-name>  
       <url-pattern>/rest/*</url-pattern> 
     </servlet-mapping> 
   </web-app>
   ```

* 在web.xml文件中仅配置listener，在microservice.yaml文件中配置urlPattern

   ```xml
   <web-app xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd" version="3.0">  
     <context-param> 
       <param-name>contextConfigLocation</param-name>  
       <param-value>classpath*:META-INF/spring/*.bean.xml classpath*:app-config.xml</param-value> 
     </context-param>  
     <listener> 
       <listener-class>io.servicecomb.transport.rest.servlet.RestServletContextListener</listener-class> 
     </listener> 
   </web-app>
   ```

   在microservice.yaml文件中需要增加一行配置来指定urlPattern：

   ```yaml
   servicecomb.rest.servlet.urlPattern: /rest/*
   ```

以上两种方式是等效的，两种方式都需要在maven pom文件中添加如下依赖：

```xml
<dependency> 
  <groupId>io.servicecomb</groupId>  
  <artifactId>transport-rest-servlet</artifactId> 
</dependency>
```

REST over Servlet在microservice.yaml文件中的配置项见下表：

表1 REST over Servlet配置项说明

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| cse.rest.address | 0.0.0.0:8080 | - | 否 | 服务监听地址 | - |
| cse.rest.timeout | 3000 | - | 否 | 超时时间 | 单位为毫秒 |
| cse.request.timeout | 30000 | - | 否 | 请求超时时间 | 同REST over Vertx的配置 |
| cse.references.\[服务名\].transport | rest |  | 否 | 访问的transport类型 | 同REST over Vertx的配置 |
| cse.references.\[服务名\].version-rule | latest | - | 否 | 访问实例的版本号 | 同REST over Vertx的配置 |

### 示例代码

microservice.yaml文件中的配置示例如下：

```yaml
cse:
  rest:
    address: 0.0.0.0:8080
    timeout: 3000
```

## REST over Vertx
### 配置说明

REST over Vertx通信通道对应使用standalone部署运行模式，可直接通过main函数拉起。main函数中需要初始化日志和加载服务配置，代码如下：

```java
import io.servicecomb.foundation.common.utils.BeanUtils;
import io.servicecomb.foundation.common.utils.Log4jUtils;

public class MainServer {
  public static void main(String[] args) throws Exception {
  　Log4jUtils.init();//日志初始化
  　BeanUtils.init(); // Spring bean初始化
  }
}
```

使用REST over Vertx网络通道需要在maven pom文件中添加如下依赖：

```xml
<dependency>
　　<groupId>io.servicecomb</groupId>
　　<artifactId>transport-rest-vertx</artifactId>
</dependency>
```

REST over Vertx通道在microservice.yaml文件中有以下配置项：

表2 REST over Vertx配置项说明

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| cse.rest.address | 0.0.0.0:8080 | - | 否 | 服务监听地址 | 仅服务提供者需要配置 |
| cse.rest.server.thread-count | 1 | - | 否 | 服务端线程数 | 仅服务提供者需要配置 |
| cse.rest.client.thread-count | 1 | - | 否 | 客户端网络线程数 | 仅服务消费者需要配置 |
| cse.rest.client.connection-pool-per-thread | 1 | - | 否 | 客户端每个网络线程中的连接池的个数 | 仅服务消费者需要配置 |
| cse.request.timeout | 30000 | - | 否 | 请求超时时间 |  |
| cse.references.\[服务名\].transport | rest |  | 否 | 访问的transport类型 | 仅服务消费者需要配置 |
| cse.references.\[服务名\].version-rule | latest | - | 否 | 访问实例的版本号 | 仅服务消费者需要配置支持latest，1.0.0+，1.0.0-2.0.2，精确版本。详细参考服务中心的接口描述。 |

### 示例代码

microservice.yaml文件中的配置示例：

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

## Highway RPC协议
### 概念阐述

Highway是ServiceComb的高性能私有协议，用户可在有特殊性能需求的场景下选用。

### 配置说明

使用Highway网络通道需要在maven pom文件中添加如下依赖：

```xml
<dependency> 
  <groupId>io.servicecomb</groupId>  
  <artifactId>transport-highway</artifactId> 
</dependency>
```

Highway通道在microservice.yaml文件中的配置项如下表所示：

表3 Highway配置项说明

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| cse.highway.address | 0.0.0.0:7070 | - | 否 | 服务监听地址 | - |
| cse.highway.server.thread-count | 1 | - | 否 | 服务端网络线程个数 | - |
| cse.highway.client.thread-count | 1 | - | 否 | 客户端网络线程个数 | - |
| cse.highway.client.connection-pool-per-thread | 1 | - | 否 | 客户端每个网络线程的连接池个数 | - |
| cse.request.timeout | 30000 | - | 否 | 请求超时时间 | 同REST over Vertx的配置 |
| cse.references.\[服务名\].transport | rest |  | 否 | 访问的transport类型 | 同REST over Vertx的配置 |
| cse.references.\[服务名\].version-rule | latest | - | 否 | 访问实例的版本号 | 同REST over Vertx的配置 |

### 示例代码

microservice.yaml文件中的配置示例：

```yaml
cse:
  highway:
    address: 0.0.0.0:7070
```

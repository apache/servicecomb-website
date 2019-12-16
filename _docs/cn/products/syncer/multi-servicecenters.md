---
title: "异构服务中心通讯"
lang: cn
ref: multi-servicecenters
permalink: /cn/docs/products/syncer/multi-servicecenters/
excerpt: "了解如何使用异构、多服务中心通讯工具"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## ServiceCenter和Eureka异构服务中心通讯

本案例模拟了异构服务中心之间的通讯场景，包括以下四个部分：  
- EurekaServer： Eureka服务中心  
- AccountServer：注册到Eureka的账号服务  
- Servicecomb-ServiceCenter：Servicecomb-ServiceCenter服务中心  
- HelloServer：注册到Servicecomb-ServiceCenter，需要使用AccountServer的服务  

在传统的环境中，不同服务中心之间的实例是不能互相发现并访问的。当我们使用Syncer后，这将很容易实现。如下图：  
![image](/assets/images/docs/syncer/multi-servicecenters.png)   

### 运行环境
   1. 2台linux机器: （假设为：10.0.0.10 和 10.0.0.11）
   2. [JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
   3. [Maven 3.x](https://maven.apache.org/install.html)
   4. [Go 1.11.4](https://golang.google.cn/dl/)
  
### 运行前的准备：
1. [安装 ServiceCenter发布包（>=1.3.0）](/cn/docs/products/service-center/install/) 
```bash
$ project_dir=`pwd`
$ tar -zxvf  apache-servicecomb-service-center-1.3.0-linux-amd64.tar.gz
```
2. 下载[样例源码](https://github.com/apache/servicecomb-service-center/tree/master/syncer/samples/multi-servicecenters)
```bash
git clone https://github.com/apache/servicecomb-service-center.git
cd ${project_dir}/servicecomb-service-center/syncer
```

### 步骤1：启动Eureka环境和服务
机器： 10.0.0.10  
#### 1. 编译项目
```bash
# 编译 EurekaServer 和 AccountServer
$ cd samples/multi-servicecenters/eureka
$ mvn clean install
```
#### 2. 启动EurekaServer：  
- 修改启动配置
   文件位置：${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/eureka/eureka-server/src/main/resources/application.yaml
```yml
spring:
  application:
    name: eureka-server
server:
  port : 8761
#  servlet:
#    context-path: /eureka
eureka:
  instance:
    hostname : 10.0.0.10
  client:
    registerWithEureka : false
    fetchRegistry : false
    serviceUrl:
      defaultZone : http://${eureka.instance.hostname}:${server.port}/eureka/
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

- 启动服务
```bash
# 启动 EurekaServer
$ cd ${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/eureka/eureka-server/
$ nohup mvn spring-boot:run & >> eureka-server.log 2>&1 &
``` 
   浏览器打开http://10.0.0.10:8761，若出现如下页面，则启动成功  
   ![image](/assets/images/docs/syncer/eureka-server-success.jpg)

#### 3. 启动AccountServer
- 修改启动配置  
   文件位置：${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/eureka/account-server/src/main/resources/application.yaml
```yml
spring:
  application:
    name: account-server
server:
  port: 8090
eureka:
  instance:
    hostname: 10.0.0.10
  client:
    service-url:
      defaultZone: http://${eureka.instance.hostname}:8761/eureka/
management:
  endpoints:
    web:
      exposure:
        include: "*"
```  

- 启动服务  
```bash
#启动 AccountServer
$ cd ${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/eureka/account-server
$ mvn spring-boot:run
# 出现如下字样则为成功
2019-09-19 17:20:35.534  INFO 20890 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8090 (http) with context path ''
2019-09-19 17:20:35.548  INFO 20890 --- [           main] .s.c.n.e.s.EurekaAutoServiceRegistration : Updating port to 8090
2019-09-19 17:20:35.551  INFO 20890 --- [           main] o.a.s.s.account.AccountApplication       : Started AccountApplication in 3.92 seconds (JVM running for 6.754)
2019-09-19 17:20:35.617  INFO 20890 --- [nfoReplicator-0] com.netflix.discovery.DiscoveryClient    : DiscoveryClient_ACCOUNT-SERVER/10.0.0.10:account-server:8090 - registration status: 204
``` 

   此时打开http://10.0.0.10:8761，可以看到AccountServer已经注册成功  
   ![image](/assets/images/docs/syncer/eureka-account-server-success.jpg)

#### 4. 启动Syncer
```bash
$ cd ${project_dir}/apache-servicecomb-service-center-1.3.0-linux-amd64/
$ ./syncer daemon --sc-addr http://10.0.0.10:8761/eureka --bind-addr 10.0.0.10:30190 --rpc-addr 10.0.0.10:30191 --sc-plugin=eureka  --node eureka
#出现如下字样则为成功
2019-09-19T17:28:28.809+0800  INFO  etcd/agent.go:55  start etcd success
2019-09-19T17:28:28.809+0800  INFO  grpc/server.go:94 start grpc success
2019-09-19T17:28:28.809+0800  DEBUG server/handler.go:39  is leader: true
2019-09-19T17:28:28.809+0800  DEBUG server/handler.go:43  Handle Tick
```

### 步骤2：启动Servicecenter环境和服务  
机器： 10.0.0.11   
#### 1. 编译项目  
```bash
$ cd ${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/servicecenter/hello-server/
$ GO111MODULE=on go build
```   

#### 2. 启动Servicecenter  
- 修改启动配置：  
   文件位置：${project_dir}/apache-servicecomb-service-center-1.3.0-linux-amd64/conf/app.conf  
```bash
frontend_host_ip = 10.0.0.11
frontend_host_port = 30103
###################################################################
# sever options
###################################################################
# if you want to listen at ipv6 address, then set the httpaddr value like:
# httpaddr = 2400:A480:AAAA:200::159        (global scope)
# httpaddr = fe80::f816:3eff:fe17:c38b%eth0 (link-local scope)
httpaddr = 10.0.0.11
httpport = 30100
# ...以下省略...
```

- 启动 ServiceCenter 和 Frontend
```bash
$ cd ${project_dir}/apache-servicecomb-service-center-1.3.0-linux-amd64
# 启动 ServiceCenter
$ ./start-service-center.sh
# 启动 前端页面 Frontend
$ ./start-frontend.sh
```
   浏览器打开http://10.0.0.11:30103,若出现如下页面，则启动成功  
   ![image](/assets/images/docs/syncer/service-center-server-success.jpg)  

#### 3. 启动HelloServer
- 修改启动配置：  
   文件位置：${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/servicecenter/hello-server/conf/microservice.yaml  
```yml
service: # 微服务配置
  appId: eureka # eureka 中同步的实例appID均为：eureka
  name: hello-server
  version: 0.0.1
  instance: # 实例信息
    protocol: rest
    listenAddress: 10.0.0.11:8091 #实例监听地址
provider: # 服务端信息
  appId: eureka
  name: account-server
  version: 0.0.1
registry:
  address: http://10.0.0.11:30100
```  

- 启动服务  
```bash
$ cd ${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/servicecenter/hello-server
$ ./hello-server
2019-09-19T18:37:50.645+0800	DEBUG	servicecenter/servicecenter.go:163	send heartbeat success
2019-09-19T18:37:50.645+0800	WARN	servicecenter/servicecenter.go:85	discovery provider failed, appID = eureka, name = account-server, version = 0.0.1
2019-09-19T18:37:50.645+0800	INFO	servicecenter/servicecenter.go:87	waiting for retry
```  

   此时打开http://10.0.0.11:30103，可以看到HelloServer已经注册成功  
   ![image](/assets/images/docs/syncer/service-center-hello-server-success.jpg)  
   但由于无法发现属于Eureka服务中心的AccountServer实例，HelloServer处于重试状态  
   （==注：重试次数为3次，每次间隔30秒，所以我们需要在90秒内完成后面的操作==）  

#### 4.启动Syncer  
```bash
$ cd ${project_dir}/apache-servicecomb-service-center-1.3.0-linux-amd64/
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30190 --rpc-addr 10.0.0.11:30191 --sc-plugin=servicecenter --join-addr 10.0.0.10:30190 --node servicecenter

#出现以下内容则为Syncer成功启动，并同步了对方的实例
2019-09-19T18:44:35.536+0800	DEBUG	server/handler.go:62	is leader: true
2019-09-19T18:44:35.536+0800	DEBUG	server/handler.go:79	Receive serf user event
2019-09-19T18:44:35.536+0800	DEBUG	serf/agent.go:130	member = servicecenter, groupName = 0204d59328090c2f4449a088d4e0f1d8
2019-09-19T18:44:35.536+0800	DEBUG	serf/agent.go:130	member = eureka, groupName = 34f53a9520a11c01f02f58f733e856b3
2019-09-19T18:44:35.536+0800	DEBUG	server/handler.go:97	Going to pull data from eureka 10.0.0.10:30191
2019-09-19T18:44:35.536+0800	INFO	grpc/client.go:76	Create new grpc connection to 10.0.0.10:30191
2019-09-19T18:44:35.538+0800	DEBUG	servicecenter/servicecenter.go:87	create service success orgServiceID= account-server, curServiceID = 80784229255ec96d90353e3c041bdf3586fdbbae
2019-09-19T18:44:35.538+0800	DEBUG	servicecenter/servicecenter.go:90	trying to do registration of instance, instanceID = 10.0.0.10:account-server:8090
2019-09-19T18:44:35.540+0800	DEBUG	servicecenter/sync.go:63	Registered instance successful, instanceID = 78bca3e2daca11e99638fa163eca30e0
```  

### 步骤3：结果验证
1. 此时的HelloServer获取实例成功，并调用了AccountServer的CheckHealth接口  
   ![image](/assets/images/docs/syncer/hello-server-discovery-success.jpg)  

2. 分别打开Euraka和ServiceCenter的网页，两个服务中心里均包含了所有的实例信息  
   ![image](/assets/images/docs/syncer/eureka-server-has-all.jpg)  
   ![image](/assets/images/docs/syncer/service-center-server-has-all.jpg)  
3. curl命令调用HelloServer的Login接口  
```bash
$ curl -X POST \
http://192.168.88.75:8091/login \
-H 'Content-Type: application/json' \
-d '{
  "user":"Jack",
  "password":"123456"
}'
welcome Jack
```  
HelloServer与AccountServer分别会打印如下的信息  
AccountServer  
   ![image](/assets/images/docs/syncer/account-server-reply.jpg)   
HelloServer  
   ![image](/assets/images/docs/syncer/hello-server-result.jpg)  

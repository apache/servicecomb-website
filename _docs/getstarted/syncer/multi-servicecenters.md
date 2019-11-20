---
title: "Communication on differ-structure servicecenters"
lang: en
ref: install
permalink: /docs/syncer/multi-servicecenters/
excerpt: "Learn how to use differ-structure, multi-service center synchronization tool"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## ServiceCenter and Eureka

Situation description：  
- EurekaServer： The Service-center of Eureka  
- AccountServer：The account server of register to Eureka  
- Servicecomb-ServiceCenter：Servicecomb-ServiceCenter  
- HelloServer：The server of  register to Servicecomb-ServiceCenter，that dependent on account server  

Instances cannot be discovered and accessed by each other between different service centers, in a traditional environment. This will be easy to implement when we use Syner. As shown below:    
![image](/assets/images/docs/syncer/multi-servicecenters.png)   

### Operating environment
   1. 2 linux machines: （Host IP is like this：10.0.0.10 和 10.0.0.11）
   2. [JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
   3. [Maven 3.x](https://maven.apache.org/install.html)
   4. [Go 1.11.4](https://golang.google.cn/dl/)
  
### Before starting：
1. [Install ServiceCenter Release（>=1.3.0）](/docs/service-center/install/) 
```bash
$ project_dir=`pwd`
$ tar -zxvf  apache-servicecomb-service-center-1.3.0-linux-amd64.tar.gz
```
2. Download [the sample](https://github.com/apache/servicecomb-service-center/tree/master/syncer/samples/multi-servicecenters)
```bash
git clone https://github.com/apache/servicecomb-service-center.git
cd ${project_dir}/servicecomb-service-center/syncer
```

### Step 1: Launch the Eureka environment and services
One of the machines： 10.0.0.10  
#### 1. Compile EurekaServer and AccountServer
```bash
$ cd samples/multi-servicecenters/eureka
$ mvn clean install
```
#### 2. Run EurekaServer：  
- Modify the startup configuration
   File path：${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/eureka/eureka-server/src/main/resources/application.yaml
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

- Run server
```bash
$ cd ${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/eureka/eureka-server/
$ nohup mvn spring-boot:run & >> eureka-server.log 2>&1 &
``` 
   Open http://10.0.0.10:8761 in the browser, this is successful if the following page appears.  
   ![image](/assets/images/docs/syncer/eureka-server-success.jpg)

#### 3. Run AccountServer
- Modify the startup configuration  
   File path：${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/eureka/account-server/src/main/resources/application.yaml
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
- Start AccountServer
```bash
$ cd ${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/eureka/account-server
$ mvn spring-boot:run
#This is successful if the result like this，
2019-09-19 17:20:35.534  INFO 20890 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8090 (http) with context path ''
2019-09-19 17:20:35.548  INFO 20890 --- [           main] .s.c.n.e.s.EurekaAutoServiceRegistration : Updating port to 8090
2019-09-19 17:20:35.551  INFO 20890 --- [           main] o.a.s.s.account.AccountApplication       : Started AccountApplication in 3.92 seconds (JVM running for 6.754)
2019-09-19 17:20:35.617  INFO 20890 --- [nfoReplicator-0] com.netflix.discovery.DiscoveryClient    : DiscoveryClient_ACCOUNT-SERVER/10.0.0.10:account-server:8090 - registration status: 204
``` 
   Reopen http://10.0.0.10:8761, you can see that AccountServer has been registered successfully.  
   ![image](/assets/images/docs/syncer/eureka-account-server-success.jpg)

#### 4. Run Syncer of eureka
```bash
$ cd ${project_dir}/apache-servicecomb-service-center-1.3.0-linux-amd64/
$ ./syncer daemon --sc-addr http://10.0.0.10:8761/eureka --bind-addr 10.0.0.10:30190 --rpc-addr 10.0.0.10:30191 --sc-plugin=eureka  --node eureka
#This is successful if the result like this，
2019-09-19T17:28:28.809+0800	INFO	etcd/agent.go:55	start etcd success
2019-09-19T17:28:28.809+0800	INFO	grpc/server.go:94	start grpc success
2019-09-19T17:28:28.809+0800	DEBUG	server/handler.go:39	is leader: true
2019-09-19T17:28:28.809+0800	DEBUG	server/handler.go:43	Handle Tick
```

### Step 2: Start the Servicecenter environment and services  
Another machine： 10.0.0.11  
#### 1. Compile HelloServer  
```bash
$ cd ${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/servicecenter/hello-server/
$ GO111MODULE=on go build
```  
#### 2. Run Servicecenter  
- Modify the startup configuration：  
   File path：${project_dir}/apache-servicecomb-service-center-1.3.0-linux-amd64/conf/app.conf  
```bash
frontend_host_ip = 10.0.0.11
frontend_host_port = 30103
#sever options
#if you want to listen at ipv6 address, then set the httpaddr value like:
#httpaddr = 2400:A480:AAAA:200::159        (global scope)
#httpaddr = fe80::f816:3eff:fe17:c38b%eth0 (link-local scope)
httpaddr = 10.0.0.11
httpport = 30100
#...以下省略...
```  

- Run ServiceCenter and Frontend  
```bash
$ cd ${project_dir}/apache-servicecomb-service-center-1.3.0-linux-amd64
$ ./start-service-center.sh
$ ./start-frontend.sh
```  
   Open http://10.0.0.11:30103 in the browser, this is successful if the following page appears.    
   ![image](/assets/images/docs/syncer/service-center-server-success.jpg)  

#### 3. Run HelloServer  
- Modify the startup configuration  
   File path：${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/servicecenter/hello-server/conf/microservice.yaml  
```yml
service: # Micro service configuration
  appId: eureka # The appID is "eureka", if the instance synced from eureka.
  name: hello-server
  version: 0.0.1
  instance: # Instance information
    protocol: rest
    listenAddress: 10.0.0.11:8091 #The listening address of the instance
provider: # Provider information
  appId: eureka
  name: account-server
  version: 0.0.1
registry:
  address: http://10.0.0.11:30100
```

- Start HelloServer  
```bash
$ cd ${project_dir}/servicecomb-service-center/syncer/samples/multi-servicecenters/servicecenter/hello-server
$ ./hello-server
2019-09-19T18:37:50.645+0800	DEBUG	servicecenter/servicecenter.go:163	send heartbeat success
2019-09-19T18:37:50.645+0800	WARN	servicecenter/servicecenter.go:85	discovery provider failed, appID = eureka, name = account-server, version = 0.0.1
2019-09-19T18:37:50.645+0800	INFO	servicecenter/servicecenter.go:87	waiting for retry
```  
   Reopen http://10.0.0.11:30103, you can see that HelloServer has been registered successfully.    
   ![image](/assets/images/docs/syncer/service-center-hello-server-success.jpg)  
   But, the instance of AccountServer belonging to the EurekaServer cannot be found, the HelloServer is in the retry state.   
   (**_Warning_**: We must complete the operation within 3 retry times (90 seconds))  

#### 4.Run Syncer of service-center  
```bash
$ cd ${project_dir}/apache-servicecomb-service-center-1.3.0-linux-amd64/
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30190 --rpc-addr 10.0.0.11:30191 --sc-plugin=servicecenter --join-addr 10.0.0.10:30190 --node servicecenter
#This is successful if the result like this，
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

### Step 3: Results Verification  
1. At this point, HelloServer gets the instance successfully, and calls the CheckHealth interface of AccountServer.  
   ![image](/assets/images/docs/syncer/hello-server-discovery-success.jpg)   

2. Open the website of Euraka and ServiceCenter respectively. Both service centers contain all the instance information.  
   ![image](/assets/images/docs/syncer/eureka-server-has-all.jpg)   
   ![image](/assets/images/docs/syncer/service-center-server-has-all.jpg)   
3. Call the Login interface of HelloServer used the command line of curl,  
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
HelloServer and AccountServer respectively print the following information.    
AccountServer  
   ![image](/assets/images/docs/syncer/account-server-reply.jpg)   
HelloServer   
   ![image](/assets/images/docs/syncer/hello-server-result.jpg)  

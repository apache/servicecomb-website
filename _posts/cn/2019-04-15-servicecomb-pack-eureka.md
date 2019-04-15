---
lang: cn
title: "ServiceComb Pack 0.4.0 集成发现服务 : Spring Cloud Eureka"
ref: servicecomb-pack-eureka
permalink: /cn/docs/servicecomb-pack-eureka/
excerpt: "ServiceComb Pack 集成发现服务 Eureka"
last_modified_at: 2019-04-15T:19:30+08:00
author: Lei Zhang
tags: [ServiceComb Pack,Spring Cloud Eureka,Discovery]
redirect_from:
  - /theme-setup/
---

ServiceComb Pack 从 0.4.0 版本开始支持将 Alpha 服务实例注册到发现服务 Eureka 中，Omega 端的程序通过注册中心 Eureka 就可以连接 Alpha 服务

### 编译支持 Eureka 的版本

默认发行版不包含 Eureka 的支持，你需要使用 `-Pspring-cloud-eureka` 参数编译支持 Eureka 的版本

```bash
git clone https://github.com/apache/servicecomb-pack.git
cd servicecomb-pack
mvn clean install -DskipTests=true -Pspring-boot-2,spring-cloud-eureka
```

### 启动 Eureka

* 使用 Docker 启动 Eureka，更多方式请参考官方网站 [https://cloud.spring.io](https://cloud.spring.io/spring-cloud-netflix/spring-cloud-netflix.html#spring-cloud-eureka-server)

```bash
docker run -d -p 8761:8761 springcloud/eureka
```

* 访问 Eureka UI

在浏览器中访问 http://0.0.0.0:8761  ，能看到如下页面表示 Eureka 启动成功

![eureka_main]({{ site.url }}{{ site.baseurl }}/assets/images/2019-04-15-servicecomb-pack-eureka/eureka-main.png)

### 启动 Alpha

注册中心功能通过设置  `eureka.client.enabled=true` 参数开启

```bash
java -jar alpha-server-0.4.0-exec.jar \
  --server.port=8090 \
  --alpha.server.port=8080 \
  --spring.datasource.url="jdbc:postgresql://127.0.0.1:5432/saga?useSSL=false" \
  --spring.datasource.username=saga-user \
  --spring.datasource.password=saga-password \
  --eureka.client.enabled=true \
  --eureka.client.service-url.defaultZone=http://0.0.0.0:8761/eureka \
  --spring.profiles.active=prd 
```
**注意:** 更多 eureka 参数请参考 [Spring Cloud Netflix 2.x](https://cloud.spring.io/spring-cloud-netflix/multi/multi__service_discovery_eureka_clients.html#netflix-eureka-client-starter) [Spring Cloud Netflix 1.x](https://cloud.spring.io/spring-cloud-netflix/1.4.x/multi/multi__service_discovery_eureka_clients.html#netflix-eureka-client-starter)

Alpha 启动完毕后可以看到已经注册到 Eureka

![alpha_register_to_eureka]({{ site.url }}{{ site.baseurl }}/assets/images/2019-04-15-servicecomb-pack-eureka/alpha_register_to_eureka.png)

执行命令 `curl http://127.0.0.1:8761/eureka/apps/` 可以看到已经将 Alpha 的 gRPC 地址和端口注册到 Eureka 的 Metadata 中

```xml
<applications>
  <versions__delta>1</versions__delta>
  <apps__hashcode>UP_1_</apps__hashcode>
  <application>
    <name>SERVICECOMB-ALPHA-SERVER</name>
    <instance>
      <hostName>10.50.8.23</hostName>
      <app>SERVICECOMB-ALPHA-SERVER</app>
      <ipAddr>10.50.8.23</ipAddr>
      <status>UP</status>
      <overriddenstatus>UNKNOWN</overriddenstatus>
      <port enabled="true">8090</port>
      <securePort enabled="false">443</securePort>
      <countryId>1</countryId>
      <dataCenterInfo class="com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo">
        <name>MyOwn</name>
      </dataCenterInfo>
      <leaseInfo>
        <renewalIntervalInSecs>30</renewalIntervalInSecs>
        <durationInSecs>90</durationInSecs>
        <registrationTimestamp>1555317761365</registrationTimestamp>
        <lastRenewalTimestamp>1555317761365</lastRenewalTimestamp>
        <evictionTimestamp>0</evictionTimestamp>
        <serviceUpTimestamp>1555317761067</serviceUpTimestamp>
      </leaseInfo>
      <metadata>
        <management.port>8090</management.port>
        <servicecomb-alpha-server>0.0.0.0:8080</servicecomb-alpha-server>
      </metadata>
      <homePageUrl>http://10.50.8.23:8090/</homePageUrl>
      <statusPageUrl>http://10.50.8.23:8090/actuator/info</statusPageUrl>
      <healthCheckUrl>http://10.50.8.23:8090/actuator/health</healthCheckUrl>
      <vipAddress>servicecomb-alpha-server</vipAddress>
      <secureVipAddress>servicecomb-alpha-server</secureVipAddress>
      <isCoordinatingDiscoveryServer>false</isCoordinatingDiscoveryServer>
      <lastUpdatedTimestamp>1555317761365</lastUpdatedTimestamp>
      <lastDirtyTimestamp>1555317760932</lastDirtyTimestamp>
      <actionType>ADDED</actionType>
    </instance>
  </application>
</applications>
```

### 配置 Omega 端

> ServiceComb Pack 0.4.0 Omega 默认依赖 Spring Boot 2.x Spring 和 Spring Cloud Netflix 2.x ，如果你的 Omega 端项目依赖 Spring Boot 1.x 你可以使用 `-Pspring-boot-1` 参数重新编译 Spring Boot 1.x 和 Spring Cloud Netflix 1.x 的版本

修改原有 omega 端项目

增加以下依赖

```xml
<dependency>
  <groupId>org.apache.servicecomb.pack</groupId>
  <artifactId>omega-spring-cloud-eureka-starter</artifactId>
  <version>${pack.version}</version>
</dependency>
```

在 `application.yaml` 添加下面的配置项

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:8761/eureka
alpha:
  cluster:
    register:
      type: eureka
```
- `eureka.client.service-url.defaultZone` 配置 Eureka 注册中心的地址，更多 Eureka 客户端配置可以参考[Spring Cloud Netflix 2.x](https://cloud.spring.io/spring-cloud-netflix/multi/multi__service_discovery_eureka_clients.html#netflix-eureka-client-starter) 或 [Spring Cloud Netflix 1.x](https://cloud.spring.io/spring-cloud-netflix/1.4.x/multi/multi__service_discovery_eureka_clients.html#netflix-eureka-client-starter)

- `alpha.cluster.register.type=eureka` 配置 Omega 获取Alpha的方式是通过 Eureka 的注册中心

- spring boot 版本兼容

  如果你的项目使用的不是 spring boot 2.1.1 版本，那么请参照此列表增加兼容的 spring-cloud-starter-consul-discovery 版本

  | spring boot   | spring-cloud-starter-netflix-eureka-client |
  | ------------- | ------------------------------------------ |
  | 2.1.x.RELEASE | 2.1.1.RELEASE                              |
  | 2.0.x.RELEASE | 2.0.3.RELEASE                              |

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        <version>2.0.3.RELEASE</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```
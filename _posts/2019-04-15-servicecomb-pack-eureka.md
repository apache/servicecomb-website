---
lang: en
title: "ServiceComb Pack 0.4.0 Integrated Discovery Service : Eureka"
ref: servicecomb-pack-eureka
permalink: /docs/servicecomb-pack-eureka/
excerpt: "ServiceComb Pack Integrated Discovery Service Eurek"
last_modified_at: 2019-04-15T:19:30+08:00
author: Lei Zhang
tags: [ServiceComb Pack,Eureka,Discovery]
redirect_from:
  - /theme-setup/
---

ServiceComb Pack supports the registration of Alpha service instances to Eureka from version 0.4.0, and Omega-side programs can visit Alpha with Eureka

### 编译支持 Eureka 的版本

Default release does not include Eureka support，You can build the version support eureka with the `-Pspring-cloud-eureka` parameter

```bash
git clone https://github.com/apache/servicecomb-pack.git
cd servicecomb-pack
mvn clean install -DskipTests=true -Pspring-boot-2,spring-cloud-eureka
```

### Run Eureka

* Start Eureka with Docker, please refer to the official website [https://cloud.spring.io](https://cloud.spring.io/spring-cloud-netflix/spring-cloud-netflix.html#spring-cloud-eureka-server) for more ways

```bash
docker run -d -p 8761:8761 springcloud/eureka
```

* Eureka UI

Visit http://0.0.0.0:8761 in the browser, you can see the following page indicates that Eureka started successfully

![eureka_main]({{ site.url }}{{ site.baseurl }}/assets/images/2019-04-15-servicecomb-pack-eureka/eureka-main.png)

### Run Alpha

Enable registration to Eureka with the parameter `eureka.client.enabled=true`

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
**Note:** Check out for Eureka more details [Spring Cloud Netflix 2.x](https://cloud.spring.io/spring-cloud-netflix/multi/multi__service_discovery_eureka_clients.html#netflix-eureka-client-starter) [Spring Cloud Netflix 1.x](https://cloud.spring.io/spring-cloud-netflix/1.4.x/multi/multi__service_discovery_eureka_clients.html#netflix-eureka-client-starter)

After Alpha is launched, you can see that you have registered to Eureka

![alpha_register_to_eureka]({{ site.url }}{{ site.baseurl }}/assets/images/2019-04-15-servicecomb-pack-eureka/alpha_register_to_eureka.png)

Use `curl http://127.0.0.1:8761/eureka/apps/` You can see that Alpha's gRPC address and port have been registered in Eureka's Metadata

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

### Configuring the Omega side

> ServiceComb Pack 0.4.0 Omega defaults use Spring Boot 2.x Spring and Spring Cloud Netflix 2.x, If your Omega side project base on Spring Boot 1.x you can use `-Pspring-boot-1` to rebuild ServiceComb Pack to Spring Boot 1.x and Spring Cloud Netflix 1.x

Modify the original omega project

add dependencies

```xml
<dependency>
  <groupId>org.apache.servicecomb.pack</groupId>
  <artifactId>omega-spring-cloud-eureka-starter</artifactId>
  <version>${pack.version}</version>
</dependency>
```

Add the following to `application.yaml`

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

- `eureka.client.service-url.defaultZone` property is set to the Eureka server’s instance address, check out Spring Boot’s  [Spring Cloud Netflix 2.x](https://cloud.spring.io/spring-cloud-netflix/multi/multi__service_discovery_eureka_clients.html#netflix-eureka-client-starter) or [Spring Cloud Netflix 1.x](https://cloud.spring.io/spring-cloud-netflix/1.4.x/multi/multi__service_discovery_eureka_clients.html#netflix-eureka-client-starter) for more details.

- `alpha.cluster.register.type=eureka`  property is omega gets alpha gRPC address from Eureka

- spring boot version compatible

If your project is not using spring boot 2.1.1, please refer to this list to add a compatible spring-cloud-starter-netflix-eureka-client version

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
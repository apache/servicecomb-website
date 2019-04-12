---
lang: en
title: "ServiceComb Pack 0.4.0 Integrated Discovery Service : Consul"
ref: servicecomb-pack-consul
permalink: /docs/servicecomb-pack-consul/
excerpt: "ServiceComb Pack Integrated Discovery Service Consul"
last_modified_at: 2019-04-12T:12:30+08:00
author: Lei Zhang
tags: [ServiceComb Pack,Consul,Discovery]
redirect_from:
  - /theme-setup/
---

ServiceComb Pack supports the registration of Alpha service instances to Consul from version 0.4.0, and Omega-side programs can visit Alpha with Consul

### Run Consul

* Start Consul with Docker, please refer to the official website [https://www.consul.io](https://www.consul.io) for more ways

```bash
docker run -d -p 8500:8500 consul
```

* Consul UI

Visit http://0.0.0.0:8500 in the browser, you can see the following page indicates that Consul started successfully

![consul_main]({{ site.url }}{{ site.baseurl }}/assets/images/2019-04-12-servicecomb-pack-consul/consul_main.png)

### Run Alpha

Enable registration to Consul with the parameter `spring.cloud.consul.enabled = true`

```bash
java -jar alpha-server-0.4.0-exec.jar \
  --server.port=8090 \
  --alpha.server.port=8080 \
  --spring.datasource.url="jdbc:postgresql://127.0.0.1:5432/saga?useSSL=false" \
  --spring.datasource.username=saga-user \
  --spring.datasource.password=saga-password \
  --spring.cloud.consul.enabled=true \
  --spring.cloud.consul.host=0.0.0.0 \
  --spring.cloud.consul.port=8500 \
  --spring.profiles.active=prd 
```
**Note:** Check out for Consul more details [Spring Cloud Consul 2.x](https://cloud.spring.io/spring-cloud-consul/spring-cloud-consul.html) [Spring Cloud Consul 1.x](https://cloud.spring.io/spring-cloud-consul/1.3.x/single/spring-cloud-consul.html)

After Alpha is launched, you can see that you have registered to Consul

![alpha_register_to_consul]({{ site.url }}{{ site.baseurl }}/assets/images/2019-04-12-servicecomb-pack-consul/alpha_register_to_consul.png)

Use `curl http://0.0.0.0:8500/v1/agent/services` You can see that Alpha's gRPC address and port have been registered in Consul's Tags

```json
{
    "servicecomb-alpha-server-0-0-0-0-336b06581fb5b92ed91c7ade3fdafa88": {
        "ID": "servicecomb-alpha-server-0-0-0-0-336b06581fb5b92ed91c7ade3fdafa88",
        "Service": "servicecomb-alpha-server",
        "Tags": [
            "alpha-server-host=0.0.0.0",
            "alpha-server-port=8080",
            "secure=false"
        ],
        "Meta": {},
        "Port": 8090,
        "Address": "192.168.1.116",
        "Weights": {
            "Passing": 1,
            "Warning": 1
        },
        "EnableTagOverride": false
    }
}
```

### Configuring the Omega side

> ServiceComb Pack 0.4.0 Omega defaults use Spring Boot 2.x Spring and Cloud Consul 2.x, If your Omega side project base on Spring Boot 1.x you can use `-Pspring-boot-1` to rebuild ServiceComb Pack to Spring Boot 1.x and Spring Cloud Consul 1.x

Modify the original omega project

add dependencies

```xml
<dependency>
	<groupId>org.apache.servicecomb.pack</groupId>
	<artifactId>omega-spring-cloud-consul-starter</artifactId>
	<version>${pack.version}</version>
</dependency>
```

Add the following to `application.yaml`

```yaml
spring:
  cloud:
    consul:
      discovery:
      	register: false
      host: 0.0.0.0
      port: 8500
      
alpha:
  cluster:
    register:
      type: consul
```

- `spring.cloud.consul.host` property is set to the Consul server’s instance address, `spring.cloud.consul.port` property is set to the Consul server’s instance port, `spring.cloud.consul.discovery.register=false` property is not register yourself , check out Spring Boot’s  [Spring Cloud Consul 2.x](https://cloud.spring.io/spring-cloud-consul/spring-cloud-consul.html)  or [Spring Cloud Consul 1.x](https://cloud.spring.io/spring-cloud-consul/1.3.x/single/spring-cloud-consul.html) for more details.

- `alpha.cluster.register.type=consul`  property is omega gets Alpha gRPC address from Consul

- spring boot version compatible

 If your project is not using spring boot 2.1.1, please refer to this list to add a compatible spring-cloud-starter-consul-discovery version

 | spring boot   | spring-cloud-starter-consul-discovery |
 | ------------- | ------------------------------------- |
 | 2.1.x.RELEASE | 2.1.1.RELEASE                         |
 | 2.0.x.RELEASE | 2.0.2.RELEASE                         |

 ```xml
   <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>org.springframework.cloud</groupId>
         <artifactId>spring-cloud-starter-consul-discovery</artifactId>
         <version>2.0.2.RELEASE</version>
       </dependency>
     </dependencies>
   </dependencyManagement>
 ```

**Note:** If you define `spring.application.name` parameter when start Alpha,  You need to specify this service name in Omega via the parameter `alpha.cluster.serviceId`
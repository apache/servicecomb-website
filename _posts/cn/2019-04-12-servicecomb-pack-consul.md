---
lang: cn
title: "ServiceComb Pack 0.4.0 集成发现服务 : Consul"
ref: servicecomb-pack-consul
permalink: /cn/docs/servicecomb-pack-consul/
excerpt: "ServiceComb Pack 集成发现服务 Consul"
last_modified_at: 2019-04-12T:12:30+08:00
author: Lei Zhang
tags: [ServiceComb Pack,Consul,Discovery]
redirect_from:
  - /theme-setup/
---

ServiceComb Pack 从 0.4.0 版本开始支持将 Alpha 服务实例注册到发现服务 Consul 中，Omega 端的程序通过注册中心 Consul 就可以连接 Alpha 服务

### 启动 Consul

* 使用 Docker 启动 Consul，更多方式请参考官方网站 [https://www.consul.io](https://www.consul.io)

```bash
docker run -d -p 8500:8500 consul
```

* 访问 Consul UI

在浏览器中访问 http://0.0.0.0:8500  ，能看到如下页面表示 Consul 启动成功

![consul_main]({{ site.url }}{{ site.baseurl }}/assets/images/2019-04-12-servicecomb-pack-consul/consul_main.png)

### 启动 Alpha

注册中心功能通过设置 `spring.cloud.consul.enabled=true` 参数开启

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
**注意:** 更多 Consul 参数请参考 [Spring Cloud Consul 2.x](https://cloud.spring.io/spring-cloud-consul/spring-cloud-consul.html) [Spring Cloud Consul 1.x](https://cloud.spring.io/spring-cloud-consul/1.3.x/single/spring-cloud-consul.html)

Alpha 启动完毕后可以看到已经注册到 Consul

![alpha_register_to_consul]({{ site.url }}{{ site.baseurl }}/assets/images/2019-04-12-servicecomb-pack-consul/alpha_register_to_consul.png)

执行命令行 `curl http://0.0.0.0:8500/v1/agent/services` 可以看到已经将 Alpha 的 gRPC 地址和端口注册到 Consul 的 Tags 中

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

### 配置 Omega 端

> ServiceComb Pack 0.4.0 Omega 默认依赖 Spring Boot 2.x Spring 和 Cloud Consul 2.x ，如果你的 Omega 端项目依赖 Spring Boot 1.x 你可以使用 `-Pspring-boot-1` 参数重新编译 Spring Boot 1.x 和 Spring Cloud Consul 1.x 的版本

修改原有 omega 端项目

增加以下依赖

```xml
<dependency>
	<groupId>org.apache.servicecomb.pack</groupId>
	<artifactId>omega-spring-cloud-consul-starter</artifactId>
	<version>${pack.version}</version>
</dependency>
```

在 `application.yaml` 添加下面的配置项

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

- `spring.cloud.consul.host` 配置 Consul 注册中心的地址，`spring.cloud.consul.port` 配置 Consul 注册中心的端口，`spring.cloud.consul.discovery.register=false` 表示不注册自己到注册中心，更多 Consul 客户端配置可以参考[Spring Cloud Consul 2.x](https://cloud.spring.io/spring-cloud-consul/spring-cloud-consul.html) [Spring Cloud Consul 1.x](https://cloud.spring.io/spring-cloud-consul/1.3.x/single/spring-cloud-consul.html)

- `alpha.cluster.register.type=consul` 配置 Omega 获取 Alpha 的方式是通过 Consul 的注册中心

- spring boot 和 spring cloud 版本兼容

     如果你的项目使用的不是spring boot 2.1.1版本，那么请参照此列表增加兼容的spring-cloud-starter-consul-discovery版本

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
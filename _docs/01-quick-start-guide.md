---
title: "快速入门"
permalink: /docs/quick-start-guide/
excerpt: "如何利用JavaChassis迅速创建微服务."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

这个快速入门指南会帮助您迅速进行微服务业务开发。

{% include toc %}

## 前提
以下软件需要被安装:


1. JDK 1.8
2. Maven 3.5.0 


## 简单示例
### 启动Service Center

有两种方式运行Service Center:

1.通过运行二进制文件：

下载最新的[ETCD的release版本](https://github.com/coreos/etcd/releases) 以及[Service Center的release版本](https://github.com/servicecomb/service-center/releases/)

**Note:**首先下载3.X版本之上的ETCD的二进制版本并运行，然后下载Service-center的release版本的源码并Build。
{: .notice--warning}


将配置文件etc/conf/app.conf移到文件夹conf下并修改相应的参数

```
manager_cluster = "127.0.0.1:2379" #manager_cluster为ETCT地址
httpport = 9980 #httpport为Service Center绑定的端口
```

运行Service Center二进制文件

```bash
> ./service-center
```

2.通过docker镜像运行Service Center

```bash
> docker pull seanyinx/sc
> docker run -d -p 9980:9980 seanyinx/sc:latest
```

**Note:** Service Center运行后的绑定IP为http://127.0.0.1:9980。
{: .notice--warning}

### 例子代码

**服务契约配置**

将服务契约文件放置\src\main\resources\microservices\hello\hello.yaml

```yaml
swagger: '2.0'
info:
  title: hello
  version: 1.0.0
  x-java-interface: io.servicecomb.demo.Hello
basePath: /pojo/rest/hello
produces:
  - application/json

paths:
  /sayhi:
    post:
      operationId: sayHi
      parameters:
        - name: name
          in: body
          required: true
          schema:
            type: string
      responses:
        200:
          description: 成功返回值
          schema:
            type: string
        default:
          description: 默认返回值
          schema:
            type: string
```
**Note:** 推荐使用Swagger Editor工具来编写契约，工具链接：[http://swagger.io/swagger-editor/](swagger-editor)
{: .notice--warning}

**依赖包配置**

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>java-chassis-dependencies</artifactId>
      <version>0.1.0-m1</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<build>
  <plugins>
    <!-- 配置项目使用jdk1.8编译 -->
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.1</version>
      <configuration>
        <compilerArgument>-parameters</compilerArgument>
        <encoding>UTF-8</encoding>
        <source>1.8</source>
        <target>1.8</target>
      </configuration>
    </plugin>
  </plugins>
</build>
```

**服务端SDK配置**

```yaml
APPLICATION_ID: hellotest   # app应用ID
service_description:
  name: hello   # 为服务名，确保app内部唯一
  version: 0.0.1 # 微服务版本号
cse:
  service:
    registry:
      address: http://127.0.0.1:9980 # 服务中心地址
  rest:
    address: 0.0.0.0:8080   # rest通道端口信息，确保该端口可监听
  highway:
    address: 0.0.0.0:7070   # highway通道端口信息，确保该端口可监听
```

**Note:** SDK配置文件路径为： \src\main\resources\microservice.yaml
{: .notice--warning}


**服务接口**

```java
public interface Hello {
    String sayHi(String name);
}
```

**服务实现**

实现服务契约接口HelloImpl.java

```java
public class HelloImpl implements Hello {
    public String sayHi(String name) {
        return "Hello " + name;
    }
}
```

**服务启动代码**


```java
public class SimpleServer {

        public static void main(String[] args) throws Exception {
            Log4jUtils.init();
            BeanUtils.init();
        }

}
```


**服务发布**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p"
	xmlns:util="http://www.springframework.org/schema/util" xmlns:cse="http://www.huawei.com/schema/paas/cse/rpc"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd
		http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc-1.0.xsd">
	<cse:rpc-schema schema-id="hello"
		implementation="io.servicecomb.demo.server.HelloImpl"></cse:rpc-schema>
</beans>
```

**调用端SDK配置**

```yaml
APPLICATION_ID: hellotest  # app应用ID与服务端一致
service_description:
  name: helloClient
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:9980   # 服务中心IP
  handler:
    chain:
      Consumer:
        default: loadbalance
  references:
    hello:       # 微服务名称要与服务端一致
      version-rule: 0.0.1  # 微服务版本要与服务端一致
```

**Note:** SDK配置文件路径为： \src\main\resources\microservice.yaml
{: .notice--warning}


**调用声明**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p"
    xmlns:util="http://www.springframework.org/schema/util" xmlns:cse="http://www.huawei.com/schema/paas/cse/rpc"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd
        http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc-1.0.xsd">
    <cse:rpc-reference id="hello" schema-id="hello"
        microservice-name="helloserver"></cse:rpc-reference>
</beans>

```

**服务调用**

调用端在加载完日志配置、sdk配置后，就可以对服务进行远程调用了。

```
@Component
public class SimpleClient {

    @RpcReference(microserviceName = "hello", schemaId = "hello")
    private static Hello hello;

    public static void main(String[] args) throws Exception {
        init();
        System.out.println(hello.sayHi("Java Chassis"));
    }

    public static void init() throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }

}
```

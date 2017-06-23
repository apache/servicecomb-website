---
title: "快速入门"
permalink: /docs/quick-start-guide/
excerpt: "如何利用JavaChassis迅速创建微服务."
last_modified_at: 2017-06-06T10:01:43-04:00
---

这个快速入门指南会帮助您迅速进行微服务业务开发。JavaChassis支持三种开发模式，此处通过POJO开发模式进行示例讲解，关于支持的SpringMVC/Jaxrs两种开发模式，请参考详细的[用户手册](({{ site.url }}{{ site.baseurl }}/docs/user-guide/)。

{% include toc %}

## 前提
环境准备:

1. JDK 1.8

2. [maven 3.5](https://maven.apache.org/download.cgi)

3. [Docker](https://www.docker.com/community-edition#/download)

4. 如果使用不支持docker的操作系统如 Window7 ，请下载 [Docker Toolbox](https://www.docker.com/products/docker-toolbox)

5. 下载Docker镜像
docker pull openjdk:8-jre-alpine
docker pull servicecomb/service-center


## 简单示例

第一步：运行Service Center进行服务的注册和发现
第二步：运行Provider工程发布服务
第三步：运行Consumer端服务消费

### 运行Service Center

有两种方式运行Service Center:

1.通过docker镜像运行Service Center

```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:xxx
```

**Note:** Service Center运行后的绑定IP为http://127.0.0.1:30100。
如使用docker toolbox，可以通过 ```docker-machine ip``` 获取服务绑定IP地址。
{: .notice--warning}

2.直接运行编译好的二进制文件：
可以直接下载从service-center [release](https://github.com/servicecomb/service-center/releases/)页面下载Service Center运行包。
解压直接运行启动脚本：

Windows
软件包：service-center-xxx-windows-amd64.zip
启动：
```
start.bat
```

Linux
软件包： service-center-xxx-linux-amd64.zip
启动：
```
./start.sh
```

### 运行Provider工程发布服务

通过IDE直接运行Provider工程Main函数，启动成功完成服务发布。
Main函数所在的类: servicecomb-helloword/servicecomb-helloword-provider/io/servicecomb/demo/HelloProviderMain

### 运行Consumer端服务消费

通过IDE直接运行Consumer工程Main函数，启动成功,打印“ServiceComb test success: Hello Java Chassis”信息完成服务消费。
Main函数所在的类: servicecomb-helloword/servicecomb-helloword-consumer/io/servicecomb/demo/HelloConsumerMain

## 示例详解

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
**Note:** 推荐使用Swagger Editor工具来编写契约，工具链接：[swagger-editor](http://swagger.io/swagger-editor/)
{: .notice--warning}

**依赖包配置**

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>java-chassis-dependencies</artifactId>
      <version>0.1.0-m2</version>
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

<!--pojo开发模式provider-->
<dependency>
	<groupId>io.servicecomb</groupId>
	<artifactId>provider-pojo</artifactId>
</dependency>
<!--transport：rest模式-->
<dependency>
	<groupId>io.servicecomb</groupId>
	<artifactId>transport-rest-vertx</artifactId>
</dependency>
<!--transport：highway模式-->
<dependency>
	<groupId>io.servicecomb</groupId>
	<artifactId>transport-highway</artifactId>
</dependency>
<!--自定义日志系统-->
<dependency>
	<groupId>org.slf4j</groupId>
	<artifactId>slf4j-log4j12</artifactId>
</dependency>
```

**Provider端微服务描述文件配置**

```yaml
APPLICATION_ID: hellotest   # app应用ID
service_description:
  name: hello   # 为服务名，确保app内部唯一
  version: 0.0.1 # 微服务版本号
cse:
  service:
    registry:
      address: http://127.0.0.1:30100 # 服务中心地址
  rest:
    address: 0.0.0.0:8080   # rest通道端口信息，确保该端口可监听
  highway:
    address: 0.0.0.0:7070   # highway通道端口信息，确保该端口可监听
```

**Note:** SDK配置文件路径为： \src\main\resources\microservice.yaml （上面注释需要去掉）
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
        <context:component-scan base-package="io.servicecomb.demo" />
</beans>
```

**Consumer端微服务描述文件配置**

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

**Note:** SDK配置文件路径为： \src\main\resources\microservice.yaml（上面注释需要去掉）
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
    <context:component-scan base-package="io.servicecomb.demo" />
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

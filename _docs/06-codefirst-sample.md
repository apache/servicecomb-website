---
title: "CodeFirst 例子"
permalink: /docs/codefirst-sample/
excerpt: "如何利用CodeFirst模式迅速创建微服务."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

这个快速入门指南会提供详细的指令，帮助您迅速创建微服务。

{% include toc %}

## 前提
以下软件需要被安装:


1. JDK 1.8
2. Maven 3.5.0 


## 简单示例
### 启动Service Center

首先需要启动Service Center，请查看[如何启动Service Center]({{ "/docs/start-sc/" | absolute_url }})

### 例子代码

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
public interface Compute {

    int add(int a, int b);

    int multi(int a, int b);

    int sub(int a, int b);

    int divide(int a, int b);
}
```

**服务实现**

实现服务契约接口HelloImpl.java

```java
@RpcSchema(schemaId = "codefirstcompute")
public class CodeFirstComputeImpl implements Compute{
    @Override
    public int add(int a, int b) {
        return a + b;
    }

    @Override
    public int multi(int a, int b) {
        return a * b;
    }

    @Override
    public int sub(int a, int b) {
        return a - b;
    }

    @Override
    public int divide(int a, int b) {
        if (b != 0){
            return a / b;
        }
        return 0;
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
    http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">

    <context:component-scan base-package="io.servicecomb.demo.server" />
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



**服务调用**

调用端在加载完日志配置、sdk配置后，就可以对服务进行远程调用了。

```
@Component
public class SimpleClient {

    @RpcReference(microserviceName = "hello", schemaId = "codefirstcompute")
    public static Compute compute;

    public static void main(String[] args) throws Exception {
        init();
        System.out.println("a: 1, b=2, result=" + compute.add(1, 2));
    }

    public static void init() throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }

}
```

---
title: "JAX RS例子"
permalink: /docs/jaxrs-sample/
excerpt: "用Jaxre模式创建微服务."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

如何使用Jaxrs开发模式进行业务开发。

{% include toc %}

## 前提
以下软件需要被安装:


1. JDK 1.8
2. Maven 3.5.0 


## 简单示例
### 启动Service Center

首先需要启动Service Center，请查看[如何启动Service Center]({{ "/docs/start-sc/" | absolute_url }})

### 例子代码

**服务契约配置**

将服务契约文件放置\src\main\resources\microservices\hello\hello.yaml

```yaml
swagger: '2.0'
info:
  title: hello
  version: 1.0.0
  x-java-interface: io.servicecomb.samples.jaxrs.Hello
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
          description: 正确返回
          schema:
            type: string
        default:
          description: 默认返回
          schema:
            type: string
```
**Note:** 推荐使用Swagger Editor工具来编写契约，工具链接：[http://swagger.io/swagger-editor/](swagger-editor)
{: .notice--warning}

**依赖包配置** (xxx 为实际依赖的最新版本号)

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>java-chassis-dependencies</artifactId>
      <version>xxx</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>io.servicecomb.samples</groupId>
      <artifactId>commmon-schema</artifactId>
      <version>xxx</version>
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
APPLICATION_ID: jaxrstest   # app应用ID
service_description:
  name: jaxrs   # 为服务名，确保app内部唯一
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

**Note:** SDK配置文件路径为： \src\main\resources\microservice.yaml
{: .notice--warning}


**服务接口**

```java
public interface Hello {

    String sayHi(String name);
	
    String sayHello(Person person);
	
}
```

**服务实现**

使用JAX-RS标注进行业务代码的开发，实现服务契约接口JaxrsHelloImpl.java

```java
@RestSchema(schemaId = "jaxrsHello")
@Path("/jaxrshello")
@Produces(MediaType.APPLICATION_JSON)
public class JaxrsHelloImpl implements Hello {

    @Path("/sayhi")
    @POST
    @Override
    public String sayHi(String name) {
        return "Hello " + name;
    }
    
    @Path("/sayhello")
    @POST
    @Override
    public String sayHello(Person person) {
        return "Hello person " + person.getName();
    }

}
```

**服务启动代码**


```java
public class JaxrsProviderMain {

    public static void main(String[] args) throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }
	
}
```


**调用端SDK配置**

```yaml
APPLICATION_ID: jaxrstest  # app应用ID与服务端一致
service_description:
  name: helloClient
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:30100   # 服务中心IP
  handler:
    chain:
      Consumer:
        default: bizkeeper-consumer,loadbalance     # 治理相关handler配置
  isolation:
    Consumer:
      enabled: false  # 不开启故障隔离 
  references:
    jaxrs:       # 微服务名称要与服务端一致
      version-rule: 0.0.1  # 微服务版本要与服务端一致
```

**Note:** SDK配置文件路径为： \src\main\resources\microservice.yaml （上面注释需要去掉）
{: .notice--warning}


**服务调用**

调用端在加载完日志配置、sdk配置后，就可以对服务进行远程调用了。

```java
@Component
public class JaxrsConsumerMain {

    @RpcReference(microserviceName = "jaxrs", schemaId = "jaxrsHello")
    private static Hello hello;
    
    public static void main(String[] args) throws Exception {
        init();
        System.out.println(hello.sayHi("Java Chassis"));
        Person person = new Person();
        person.setName("ServiceComb/Java Chassis");
        System.out.println(hello.sayHello(person));
    }
    
    public static void init() throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }
	
}
```

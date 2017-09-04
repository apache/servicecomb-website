---
title: "SpringMvc 例子"
lang: cn
ref: springmvc-sample
permalink: /cn/users/spring-mvc-sample/
excerpt: "如何利用springmvc模式迅速创建微服务."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

如何使用Spring MVC开发模式进行业务开发。

{% include toc %}

## 前提
以下软件需要被安装:


1. JDK 1.8
2. Maven 3.5.0 


## 简单示例
### 启动Service Center

首先需要启动Service Center，请查看[如何启动Service Center]({{ "/cn/users/setup-environment/" | absolute_url }})

### 例子代码

**服务契约配置**

将服务契约文件放置\src\main\resources\microservices\hello\hello.yaml

```yaml
swagger: '2.0'
info:
  title: hello
  version: 1.0.0
  x-java-interface: io.servicecomb.samples.springmvc.Hello
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
  /sayhello:
     post:
          operationId: sayHello
          parameters:
            - name: person
              in: body
              required: true
              schema:
                $ref: "#/definitions/Person"
          responses:
            200:
              description: 正确返回
              schema:
                type: string
            default:
              description: 默认返回
              schema:
                type: string
definitions:
  Person:
    type: "object"
    properties:
      name:
        type: "string"
        description: "person name"
    xml:
      name: "Person"
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
APPLICATION_ID: springmvctest   # app应用ID
service_description:
  name: springmvc   # 为服务名，确保app内部唯一
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

实现服务契约接口SpringmvcHelloImpl.java

```java
@RestSchema(schemaId = "springmvcHello")
@RequestMapping(path = "/springmvchello", produces = MediaType.APPLICATION_JSON)
public class SpringmvcHelloImpl implements Hello {

    @Override
    @RequestMapping(path = "/sayhi", method = RequestMethod.POST)
    public String sayHi(@RequestParam(name = "name") String name) {
        return "Hello " + name;
    }
    
    @Override
    @RequestMapping(path = "/sayhello", method = RequestMethod.POST)
    public String sayHello(@RequestBody Person person) {
        return "Hello person " + person.getName();
    }

}
```

**服务启动代码**


```java
public class SpringmvcProviderMain {

    public static void main(String[] args) throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }
	
}
```


**调用端SDK配置**

```yaml
APPLICATION_ID: springmvctest  # app应用ID与服务端一致
service_description:
  name: springmvcConsumer
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:30100   # 服务中心IP
  handler:
    chain:
      Consumer:
        default: bizkeeper-consumer,loadbalance
  isolation:
    Consumer:
      enabled: false
  references:
    springmvc:       # 微服务名称要与服务端一致
      version-rule: 0.0.1  # 微服务版本要与服务端一致
```

**Note:** SDK配置文件路径为： \src\main\resources\microservice.yaml （上面注释需要去掉）
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
		http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">

	<cse:rpc-reference id="hello" microservice-name="hello"
		schema-id="hello" ></cse:rpc-reference>

```

**服务调用**

调用端在加载完日志配置、sdk配置后，就可以对服务进行远程调用了。

```java
@Component
public class SpringmvcConsumerMain {

    private static RestTemplate restTemplate = RestTemplateBuilder.create();
    
    @RpcReference(microserviceName = "springmvc", schemaId = "springmvcHello")
    private static Hello hello;
    
    public static void main(String[] args) throws Exception {
        init();
        Person person = new Person();
        person.setName("ServiceComb/Java Chassis");
        
        
        // RestTemplate Consumer or POJO Consumer. You can choose whatever you like
        // RestTemplate Consumer
        String sayHiResult = restTemplate.postForObject("cse://springmvc/springmvchello/sayhi?name=Java Chassis", null, String.class);
        String sayHelloResult = restTemplate.postForObject("cse://springmvc/springmvchello/sayhello", person, String.class);
        System.out.println("RestTemplate Consumer or POJO Consumer.  You can choose whatever you like.");
        System.out.println("RestTemplate consumer sayhi services: " + sayHiResult);
        System.out.println("RestTemplate consumer sayhello services: " + sayHelloResult);
        
        // POJO Consumer
        System.out.println("POJO consumer sayhi services: " + hello.sayHi("Java Chassis"));
        System.out.println("POJO consumer sayhi services: " + hello.sayHello(person));
    }
    
    public static void init() throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }
	
}
```

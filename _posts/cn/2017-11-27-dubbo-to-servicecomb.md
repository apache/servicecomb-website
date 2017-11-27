---
title: "Dubbo to ServiceComb 迁移指南"
lang: cn
ref: dubbo_to_servicecomb
permalink: /cn/docs/dubbo_to_servicecomb/
excerpt: "Dubbo to ServiceComb 迁移指南"
last_modified_at: 2017-11-27T11:08:00+08:00
author: Sean Yin
redirect_from:
  - /theme-setup/
---

Dubbo和Java chassis底层都使用了Spring的依赖注入和bean管理系统，所以使用Dubbo的服务迁移到ServiceComb工作量较小，
主要改动在依赖和配置方面。

## 服务提供方
### 替换依赖
将对dubbo的依赖替换为对Java chassis的依赖

Dubbo
```xml
  <dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>dubbo</artifactId>
    <version>${dubbo.version}</version>
  </dependency>
```

Java chassis
```xml
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>io.servicecomb</groupId>
				<artifactId>java-chassis-dependencies</artifactId>
				<version>${java.chassis.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>
	
	<dependencies>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>transport-highway</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>transport-rest-vertx</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>provider-pojo</artifactId>
    </dependency>
  </dependencies>
```

### 替换服务接口注释
以 `@Service` 注释方式暴露的服务接口，用 `@RpcSchema` 替代

Dubbo
```java
import com.alibaba.dubbo.config.annotation.Service;

@Service
public class SomeServiceImpl implements SomeService {
  // ...
}
```

Java chassis
```java
@RpcSchema(schemaId = "someServiceEndpoint")
public class SomeServiceImpl implements SomeService {
  // ...
}
```

### 修改提供方启动入口

Dubbo
```java
public class ProviderMain
{

	public static void main(String[] args) throws Exception
	{
		@SuppressWarnings(
		{ "resource", "unused" })
		ApplicationContext context = new ClassPathXmlApplicationContext("conf/applicationContext.xml");
		System.out.println("Dubbo provider started successfully...");

		System.in.read();
	}
}
```

Java chassis
```java
public class ProviderMain
{

	public static void main(String[] args) throws Exception
	{
		Log4jUtils.init();
		BeanUtils.init();

		System.out.println("ServiceComb provider started successfully...");
	}
}
```

### 修改服务提供方配置
Dubbo服务通过一个XML文件同时配置了服务接口、服务注册中心地址、服务监听端口等所有内容。
```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dubbo="http://code.alibabatech.com/schema/dubbo"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
    http://code.alibabatech.com/schema/dubbo http://code.alibabatech.com/schema/dubbo/dubbo.xsd">

	<dubbo:application name="provider-service" />

	<dubbo:registry protocol="zookeeper" address="127.0.0.1:2181" />

	<dubbo:protocol name="dubbo" port="20880" />

	<dubbo:annotation package="io.servicecomb.demo" />

  <!-- 以XML配置方式暴露的服务 -->
	<dubbo:service interface="io.servicecomb.demo.api.AnotherService" ref="anotherServiceImpl" />
	<bean id="anotherServiceImpl" class="io.servicecomb.demo.provider.AnotherServiceImpl" />

</beans>
```

Java chassis也同样提供了以XML文件暴露服务接口的方式，但其他服务配置则通过 `microservice.yaml` 文件提供。 
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

  <!-- 以XML配置方式暴露的服务 -->
	<cse:rpc-schema schema-id="anotherServiceEndpoint" implementation="io.servicecomb.demo.provider.AnotherServiceImpl"/>
</beans>
```

```yaml
APPLICATION_ID: my-application
service_description:
  name: service-provider
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:30100 # 服务注册中心地址
  rest:
    address: 0.0.0.0:8080 # 服务REST端口
```

## 服务消费方
### 替换依赖
将对Dubbo的依赖替换为对Java chassis的依赖
```xml
  <dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>dubbo</artifactId>
    <version>${dubbo.version}</version>
  </dependency>
```

```xml
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>io.servicecomb</groupId>
				<artifactId>java-chassis-dependencies</artifactId>
				<version>${java.chassis.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>
	
	<dependencies>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>transport-highway</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>transport-rest-vertx</artifactId>
    </dependency>
    <dependency>
      <groupId>io.servicecomb</groupId>
      <artifactId>provider-pojo</artifactId>
    </dependency>
  </dependencies>
```

### 修改消费方启动入口
```java
public class ConsumerMain
{

	public static void main(String[] args) throws Exception
	{
		@SuppressWarnings(
		{ "resource", "unused" })
		ApplicationContext context = new ClassPathXmlApplicationContext("conf/applicationContext.xml");
		System.out.println("Dubbo Consumer started successfully...");

		System.in.read();
	}
}
```

```java
public class ConsumerMain
{

	public static void main(String[] args) throws Exception
	{
		Log4jUtils.init();
		BeanUtils.init();

		System.out.println("ServiceComb Consumer started successfully...");
	}
}
```

### 服务异步调用
Dubbo
```java
  SomeService someService = (SomeService) context.getBean("someServiceRef");
  String hello = someService.sayHello("world");
  Future<String> future = RpcContext.getContext().getFuture();
  return future.get();
```

Java chassis
```java
  ApplicationContext context = BeanUtils.getContext();
  SomeService someService = (SomeService) context.getBean("someServiceRef");
  
  CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> someService.sayHello("world"));
  return future.get();
```

### 修改服务提供方配置
Dubbo服务通过一个XML文件同时配置了远程服务提供方接口、服务注册中心地址、服务监听端口等所有内容。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dubbo="http://code.alibabatech.com/schema/dubbo"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
    http://code.alibabatech.com/schema/dubbo http://code.alibabatech.com/schema/dubbo/dubbo.xsd">

	<dubbo:application name="consumer-service" />

	<dubbo:protocol name="dubbo" port="20880"/>
	<dubbo:registry protocol="zookeeper" address="127.0.0.1:2181" />

	<dubbo:reference id="someServiceRef"
		interface="io.servicecomb.demo.api.SomeService"
		async="true" timeout="30000" />

	<dubbo:reference id="anotherServiceRef"
		interface="io.servicecomb.demo.api.AnotherService"
		async="true" timeout="30000" />
</beans>
```

Java chassis也同样提供了以XML文件引用远程服务提供方接口的方式，但其他服务配置则通过 `microservice.yaml` 文件提供。
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


  <cse:rpc-reference id="someServiceRef" microservice-name="service-provider"
    schema-id="someServiceEndpoint" interface="io.servicecomb.demo.api.SomeService"/>
    
  <cse:rpc-reference id="anotherServiceRef" microservice-name="service-provider"
    schema-id="anotherServiceEndpoint" interface="io.servicecomb.demo.api.AnotherService"/>
</beans>
```

```yaml
APPLICATION_ID: my-application
service_description:
  name: service-consumer
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:30100
```

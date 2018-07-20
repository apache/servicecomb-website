# 用透明RPC开发微服务

## 概念阐述

透明RPC开发模式是一种基于接口和接口实现的开发模式，服务的开发者不需要使用Spring MVC和JAX-RS注解。

## 开发示例

透明RPC开发模式支持Spring xml配置和注解配置两种服务发布方式，通过Spring xml配置的方式如下：

### 步骤 1定义服务接口。

根据开发之前定义好的契约，编写Java业务接口，代码如下：

```java
public interface Hello {
    String sayHi(String name);
    String sayHello(Person person);
}

public interface Compute {
  int add(int a, int b);
  int multi(int a, int b);
  int sub(int a, int b);
  int divide(int a, int b);
}

```



### 步骤 2实现服务

Hello的服务实现如下：

> **说明**：  
> 每一个服务接口都需要定义一个schema声明。

* 在接口Hello 和 Compute 的实现类上使用@RpcSchema注解定义schema，代码如下：

```java
@RpcSchema(schemaId = "hello")
public class HelloImpl implements Hello {
    @Override
    public String sayHi(String name) {
        return "Hello " + name;
    }

    @Override
    public String sayHello(Person person) {
        return "Hello person " + person.getName();
    }
}

@RpcSchema(schemaId = "codeFirstCompute")
public class CodeFirstComputeImpl implements Compute {
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
    if (b != 0) {
      return a / b;
    }
    return 0;
  }
}
```

### 步骤 3发布服务

* 通过配置文件方式

在resources/META-INF/spring目录下的pojoHello.bean.xml文件中，配置Spring进行服务扫描的base-package，文件内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns=" http://www.springframework.org/schema/beans " xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance "
       xmlns:p=" http://www.springframework.org/schema/p " xmlns:util=" http://www.springframework.org/schema/util "
       xmlns:cse=" http://www.huawei.com/schema/paas/cse/rpc "
       xmlns:context=" http://www.springframework.org/schema/context "
       xsi:schemaLocation=" http://www.springframework.org/schema/beans classpath:org/springframework/beans/factory/xml/spring-beans-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd http://www.huawei.com/schema/paas/cse/rpc classpath:META-INF/spring/spring-paas-cse-rpc.xsd">

    <context:component-scan base-package="org.apache.servicecomb.samples.pojo.provider"/>
</beans>
```



### 步骤 4 启动服务

```java
public class PojoProviderMain {

  public static void main(String[] args) throws Exception {
    Log4jUtils.init();
    BeanUtils.init();
  }
}
```

> **说明**：  
> 与Spring MVC开发模式和JAX-RS开发模式不同的是，透明RPC开发模式使用的注解是`@RpcSchema`而非`@RestSchema`。




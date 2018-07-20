### 概念阐述

应用是微服务实例隔离层次中的一层，一个应用包含多个微服务。默认情况下，只允许同应用的微服务实例相互调用。

### 场景描述

当用户需要不同应用间的微服务相互调用时，就需要开启跨应用调用功能。

### 配置说明

若要开启跨应用调用，首先需在provider端的microservice.yaml文件开启跨应用调用配置。配置项如下：
```yaml
service_description:
  # other configuration omitted
  properties:
    allowCrossApp: true # enable cross app invocation
```

consumer端指定微服务名称调用provider的时候，需要加上provider所属的应用ID，格式变为`[appID]:[microserviceName]`。

### 示例代码

示例假设provider所属应用为helloApp，微服务名称为helloProvider；consumer所属应用为helloApp2，微服务名称为helloConsumer。

- RestTemplate调用方式

  当consumer端以RestTemplate方式开发微服务消费者时，需要在调用的URL中将`[microserviceName]`改为`[appID]:[microserviceName]`，代码示例如下：
  ```java
    RestTemplate restTemplate = RestTemplateBuilder.create();

    ResponseEntity<String> responseEntity = restTemplate
        .getForEntity("cse://helloApp:helloProvider/hello/sayHello?name={name}",
            String.class, "ServiceComb");
  ```

- RPC调用方式

  当consumer端以RPC方式开发微服务消费者时，声明的服务提供者代理如下：
  ```java
    @RpcReference(schemaId = "hello", microserviceName = "helloApp:helloProvider")
    private Hello hello;
  ```
  调用方式和调用同应用下的微服务相同：
  ```java
    hello.sayHello("ServiceComb");
  ```

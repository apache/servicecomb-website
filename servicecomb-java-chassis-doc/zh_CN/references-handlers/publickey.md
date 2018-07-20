# 公钥认证

## 场景描述

公钥认证是ServiceComb提供的一种简单高效的微服务之间认证机制，它的安全性建立在微服务与服务中心之间的交互是可信的基础之上，即微服务和服务中心之间必须先启用认证机制。它的基本流程如下：

1. 微服务启动的时候，生成秘钥对，并将公钥注册到服务中心。
2. 消费者访问提供者之前，使用自己的私钥对消息进行签名。
3. 提供者从服务中心获取消费者公钥，对签名的消息进行校验。

公钥认证需要在消费者、提供者都启用。

```
servicecomb:
  handler:
    chain:
      Consumer:
        default: auth-consumer
      Provider:
        default: auth-provider
```

POM依赖：

* 在pom.xml中增加依赖：

  ```
   <dependency> 
      <groupId>org.apache.servicecomb</groupId> 
      <artifactId>handler-publickey-auth</artifactId> 
    </dependency>
  ```

## 配置黑白名单

基于公钥认证机制，ServiceComb提供了黑白名单功能。通过黑白名单，可以控制微服务允许其他哪些服务访问。目前支持通过配置服务属性来控制，配置项如下：

```
servicecomb:
  publicKey:
    accessControl:
      black:
        list01:
          category: property ## property, fixed value
          propertyName: serviceName ## property name
# property value match expression. 
# only supports prefix match and postfix match and exactly match. 
# e.g. hacker*, *hacker, hacker
          rule: hacker 
      white:
        list02:
          category: property
          propertyName: serviceName
          rule: cust*
```

以上规则配置了黑名单，不允许微服务名称为hacker的访问；白名单，允许微服务名称为cust前缀的服务访问。

ServiceComb提供了[trust-sample](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/trust-sample)来演示黑白名单功能。
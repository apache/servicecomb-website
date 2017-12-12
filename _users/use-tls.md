---
title: "使用TLS通信"
lang: en
ref: use-tls
permalink: /users/use-tls/
excerpt: "使用TLS通信"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

## 场景描述

用户通过简单的配置即可启用TLS通信，以保障数据的传输安全。

## 外部服务通信配置

与外部服务通信相关的配置写在microservice.yaml文件中。

* 服务中心TLS通信配置
   微服务与服务中心的连接可以通过将http改为https启用TLS通信，配置示例如下：

   ```yaml
   cse:
     service:
       registry:
         address: https://127.0.0.1:30100
   ```

* 服务提供者启用TLS通信
   服务提供者在配置服务监听地址时，可以通过在地址后面追加`?sslEnabled=true`开启TLS通信，示例如下：

   ```yaml
   cse:
     rest:
       address: 0.0.0.0:8080?sslEnabled=true
     highway:
       address: 0.0.0.0:7070?sslEnabled=true
   ```

## 证书配置

证书配置项写在microservice.yaml文件中，支持统一制定证书，也可以添加tag进行更细粒度的配置，有tag的配置会覆盖全局配置，配置格式如下：

```yaml
ssl.[tag].[property]
```

证书配置项见下表证书配置项说明表。

**表1 证书配置项说明表**

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ssl.protocols | TLSv1.2 | - | 否 | 协议列表 | 使用逗号分隔 |
| ssl.ciphers | TLS\_ECDHE\_RSA\_WITH\_AES\_256\_GCM\_SHA384,<br/>TLS\_RSA\_WITH\_AES\_256\_GCM\_SHA384,<br/>TLS\_ECDHE\_RSA\_WITH\_AES\_128\_GCM\_SHA256,<br/>TLS\_RSA\_WITH\_AES\_128\_GCM\_SHA256 | - | 否 | 算法列表 | 使用逗号分隔 |
| ssl.authPeer | true | - | 否 | 是否认证对端 | - |
| ssl.checkCN.host | true | - | 否 | 是否对证书的CN进行检查 | 该配置项只对Consumer端，并且使用http协议有效，即Consumer端使用rest通道有效。对于Provider端、highway通道等无效。检查CN的目的是防止服务器被钓鱼，参考标准定义：[https://tools.ietf.org/html/rfc2818。](https://tools.ietf.org/html/rfc2818。) |
| ssl.trustStore | trust.jks | - | 否 | 信任证书文件 | - |
| ssl.trustStoreType | JKS | - | 否 | 信任证书类型 | - |
| ssl.trustStoreValue | - | - | 否 | 信任证书密码 | - |
| ssl.keyStore | server.p12 | - | 否 | 身份证书文件 | - |
| ssl.keyStoreType | PKCS12 | - | 否 | 身份证书类型 | - |
| ssl.keyStoreValue | - | - | 否 | 身份证书密码 | - |
| ssl.crl | revoke.crl | - | 否 | 吊销证书文件 | - |
| ssl.sslCustomClass | - | io.servicecomb.foundation.ssl.SSLCustom的实现类 | 否 | SSLCustom类的实现，用于开发者转换密码、文件路径等。 | - |

> **说明**：
>
> * 默认的协议算法是高强度加密算法，JDK需要安装对应的策略文件，参考：[http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html)。 您可以在配置文件配置使用非高强度算法。
> * 微服务消费者，可以针对不同的提供者指定证书（当前证书是按照HOST签发的，不同的提供者都使用一份证书存储介质，这份介质同时给微服务访问服务中心和配置中心使用）。

## 服务中心的证书配置

目前支持使用环境变量来配置服务中心的TLS认证方式，默认开启TLS通信，双向认证模式，认证对端时同时校验对端是否匹配证书（CommonName）字段。服务管理中心的证书配置项说明见下表服务中心TLS证书配置项说明。

**表2 服务中心TLS证书配置项说明**

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| CSE\_SSL\_MODE | 1 | 1/0<br/>0:HTTPS<br/>1:HTTP | 否 | 设置协议模式 | - |
| CSE\_SSL\_VERIFY\_CLIENT | 1 | 1/0<br/>0:HTTPS<br/>1:HTTP | 否 | 设置HTTPS模式下是否认证对端 | - |
| CSE\_SSL\_PASSPHASE | - | - | 否 | 设置HTTPS模式下的证书密钥访问密码 | - |

服务管理中心配置文件为$APP\_ROOT/conf/app.conf，配置项见，该配置暂不支持环境变量方式设置。

表3 服务中心配置文件

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ssl\_protocols | TLSv1.2 | - | 否 | 通信使用的SSL版本 | - |
| ssl\_ciphers | TLS\_ECDHE\_RSA\_WITH\_AES\_256\_GCM\_SHA384,<br/>TLS\_RSA\_WITH\_AES\_256\_GCM\_SHA384,<br/>TLS\_ECDHE\_RSA\_WITH\_AES\_128\_GCM\_SHA256,<br/>TLS\_RSA\_WITH\_AES\_128\_GCM\_SHA256,<br/>TLS\_RSA\_WITH\_AES\_128\_CBC\_SHA | - | 否 | 配置使用算法列表 | 由于服务中心支持HTTP/2协议，所以ssl\_ciphers必须配置有TLS\_ECDHE\_RSA\_WITH\_AES\_128\_GCM\_SHA256算法。TLS\_RSA\_WITH\_AES\_128\_GCM\_SHA256、TLS\_RSA\_WITH\_AES\_128\_CBC\_SHA被列为HTTP/2协议的不安全算法黑名单，但为了客户端算法兼容性，存在时必须配置到最后一位。 |

## 密钥物料及证书存放路径

**表4 密钥物料及证书存放路径**

| 配置项 | 含义 | 对应环境变量 | 注意 |
| :--- | :--- | :--- | :--- |
| / | - | - | - |
| /opt | - | - | - |
| /opt/CSE | - | INSTALL\_ROOT | - |
| /opt/CSE/etc | - | - | - |
| /opt/CSE/etc/cipher | 密钥物料存放目录 | CIPHER\_ROOT | - |
| /opt/CSE/etc/ssl | 证书存放目录 | SSL\_ROOT | - |
| /opt/CSE/etc/ssl/trust.cer | 授信CA | - | - |
| /opt/CSE/etc/ssl/server\_key.pem | 已加密服务端私钥文件 | - | - |
| /opt/CSE/etc/ssl/server.cer | 服务器证书 | - | - |
| /opt/CSE/etc/ssl/cert\_pwd | 用于存放解密私钥的对称加密密文文件 | - | - |
| /opt/CSE/apps | - | - | - |
| /opt/CSE/apps/ServiceCenter | - | APP\_ROOT | - |
| /opt/CSE/apps/ServiceCenter/conf | 服务管理中心配置文件目录 | - | - |
| /opt/CSE/apps/ServiceCenter/conf/app.conf | 应用配置文件 | - | - |

## 示例代码

microservice.yaml文件中启用TLS通信的配置示例如下：
```yaml
cse:
  service:
    registry:
      address: https://127.0.0.1:30100
  rest:
    address: 0.0.0.0:8080?sslEnabled=true
  highway:
    address: 0.0.0.0:7070?sslEnabled=true

#########SSL options
ssl.protocols: TLSv1.2
ssl.authPeer: true
ssl.checkCN.host: true

#########certificates config
ssl.trustStore: trust.jks
ssl.trustStoreType: JKS
ssl.trustStoreValue: Changeme_123
ssl.keyStore: server.p12
ssl.keyStoreType: PKCS12
ssl.keyStoreValue: Changeme_123
ssl.crl: revoke.crl
ssl.sslCustomClass: io.servicecomb.demo.DemoSSLCustom
```

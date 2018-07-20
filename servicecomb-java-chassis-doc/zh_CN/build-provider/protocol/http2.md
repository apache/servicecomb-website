## 场景描述

用户通过简单的配置即可启用Http2进行通信，提高性能。

## 外部服务通信配置

与外部服务通信相关的配置写在microservice.yaml文件中。

* 启用h2\(Http2 + TLS\)进行通信  
  服务端在配置服务监听地址时，可以通过在地址后面追加`?sslEnabled=true`开启TLS通信，具体介绍见[使用TLS通信](../../security/tls.md)章节。然后再追加`&protocol=http2`启用h2通信。示例如下：

  ```yaml
  servicecomb:
    rest:
      address: 0.0.0.0:8080?sslEnabled=true&protocol=http2
    highway:
      address: 0.0.0.0:7070?sslEnabled=true&protocol=http2
  ```

* 启用h2c\(Http2 without TLS\)进行通信  
  服务端在配置服务监听地址时，可以通过在地址后面追加`?protocol=http2`启用h2c通信。示例如下：

  ```yaml
  servicecomb:
    rest:
      address: 0.0.0.0:8080?protocol=http2
    highway:
      address: 0.0.0.0:7070?protocol=http2
  ```

* 客户端会通过从服务中心读取服务端地址中的配置来使用http2进行通信。




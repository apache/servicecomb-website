---
title: "通信信道"
lang: cn
ref: communicate-channel
permalink: /cn/users/communicate-channel/
excerpt: "通信信道"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

ServiceComb的consumer、transport、handler、producer之间是解耦的，各功能之间通过契约定义联合在一起工作的，即：

consumer使用透明rpc，还是springmvc开发与使用highway，还是RESTful在网络上传输没有关系，与producer是使用透明rpc，还是jaxrs，或者是springmvc开发，也没有关系。handler也不感知业务开发方式以及传输方式。

consumer访问producer，在运行时的transport选择上，总规则为：consumer的transport与producer的endpoint取交集，如果交集后，还有多个transport可选择，则轮流使用。分解开来，存在以下场景：

1. 当一个微服务producer同时开放了highway以及RESTful的endpoint

   * consumer进程中只部署了highway transport jar，则只会访问producer的highway endpoint
   * consumer进程中只部署了RESTful transport jar，则只会访问producer的RESTful endpoint
   * consumer进程中，同时部署了highway和RESTful transport jar，则会轮流访问producer的highway、RESTful endpoint

   如果此时consumer想固定使用某个transport访问producer，可以在consumer进程的microservice.yaml中配置，指定transport的名称

   ```yaml
   servicecomb:
     references:
       microservice_name:
         transport: highway
   ```

2. 当一个微服务producer只开放了highway的endpoint

   * consumer进程只部署了highway transport jar，则正常使用higway访问
   * consumer进程只部署了RESTful transport jar，则无法访问
   * consumer进程同时部署了highway和RESTful transport jar，则正常使用highway访问

3. 当一个微服务producer只开放了RESTful的endpoint

   * consumer进程只部署了highway transport jar，则无法访问
   * consumer进程只部署了RESTful transport jar，则正常使用RESTful访问
   * consumer进程同时部署了highway和RESTful transport jar，则正常使用RESTful访问

---
title: "SDK 配置"
lang: cn
ref: sdk-config
permalink: /cn/users/sdk-config/
excerpt: "SDK配置"
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

介绍SDK配置。

{% include toc %}

## SDK配置

1.在resources目录下面创建microservice.yaml文件，用于存放SDK配置信息。

2.服务端配置服务中心地址，网络通道地址，以及处理链信息，内容如下：

```yaml
APPLICATION_ID: helloTest
service_description:
  name: helloServer
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:9980
  rest:
    address: 0.0.0.0:8080
  handler:
    chain:
      Provider:
        default: perf-stats
```

3.消费端配置服务中心地址，网络通道地址，以及处理链信息，内容如下：

```yaml
APPLICATION_ID: helloTest
service_description:
  name: helloClient
  version: 0.0.1
cse:
  service:
    registry:
      address: http://127.0.0.1:9980
  handler:
    chain:
      Consumer:
        default: loadbalance,perf-stats
  references:
    helloServer:
      version-rule: 0.0.1
      transport: rest
```

**Note:** references用于为服务调用指定特定的version和通道，下面可以配置多个微服务，每个微服务都有自己的version-rule、transport，未配置的微服务，version-rule默认为latest，transport默认使用所有可用的transport。这里的version-rule支持模糊匹配，例如0.1+。
{: .notice--warning}

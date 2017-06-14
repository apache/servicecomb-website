---
title: "启动 Service Center"
permalink: /docs/start-sc/
excerpt: "如何启动Service Center."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

服务中心是用于服务的注册以及服务的被发现。Provider 可以向服务中心注册服务，而Consumer则可以通过服务中心发现Provider。

{% include toc %}



## 简单示例
### 启动Service Center

有两种方式运行Service Center:

1.通过运行二进制文件：

下载最新的[ETCD的release版本](https://github.com/coreos/etcd/releases) 以及[Service Center的release版本](https://github.com/servicecomb/service-center/releases/)

**Note:**首先下载3.X版本之上的ETCD的二进制版本并运行，然后下载Service-center的release版本的源码并Build。
{: .notice--warning}


将配置文件etc/conf/app.conf移到文件夹conf下并修改相应的参数

```
manager_cluster = "127.0.0.1:2379" #manager_cluster为ETCT地址
httpport = 9980 #httpport为Service Center绑定的端口
```

运行Service Center二进制文件

```bash
> ./service-center
```

2.通过docker镜像运行Service Center

```bash
> docker pull seanyinx/sc
> docker run -d -p 9980:9980 seanyinx/sc:latest
```

**Note:** Service Center运行后的绑定IP为http://127.0.0.1:9980。
{: .notice--warning}

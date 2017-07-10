---
title: "启动 Service Center"
lang: en
ref: start-sc
permalink: /docs/start-sc/
excerpt: "如何启动Service Center."
last_modified_at: 2017-06-06T10:01:43-04:00
---

服务中心是用于服务的注册以及服务的被发现。Provider 可以向服务中心注册服务，而Consumer则可以通过服务中心发现Provider。

{% include toc %}



## 简单示例
### 启动Service Center

有两种方式运行Service Center:

1.通过docker镜像运行Service Center

```bash
> docker pull servicecomb/service-center
> docker run -d -p 30100:30100 servicecomb/service-center:latest
```

**Note:** Service Center运行后的绑定IP为http://127.0.0.1:30100:30100。如使用docker toolbox，可以通过 ```docker-machine ip``` 获取服务绑定IP地址。
{: .notice--warning}

2.通过二进制文件方式运行Service Center：

可以直接从service-center [release](https://github.com/servicecomb/service-center/releases/)页面下载Service Center运行包。
解压直接运行启动脚本：

Windows
软件包：service-center-xxx-windows-amd64.zip
启动：
```
start.bat
```

Linux
软件包： service-center-xxx-linux-amd64.zip
启动：
```
./start.sh
```

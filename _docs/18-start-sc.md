---
title: "启动 Service Center"
permalink: /docs/start-sc/
excerpt: "如何启动Service Center."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

这个快速入门指南会提供详细的指令，帮助您迅速启动Service Center。

{% include toc %}



## 简单示例
### 启动Service Center

有两种方式运行Service Center:

1.通过运行二进制文件：


```bash
> curl -o etcd.zip 'https://github-production-release-asset-2e65be.s3.amazonaws.com/11225014/28ead7c6-3c88-11e7-83a2-338ef5ea1ba9?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20170607%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20170607T150952Z&X-Amz-Expires=300&X-Amz-Signature=1f2be15362d98feb9306b7a19c1c713953db4b552ec58bf258d1927f725f2966&X-Amz-SignedHeaders=host&actor_id=20241845&response-content-disposition=attachment%3B%20filename%3Detcd-v3.1.8-darwin-amd64.zip&response-content-type=application%2Foctet-stream'
> unzip -o etcd.zip
> cd etcd/
> ./etcd
> go get github.com/ServiceComb/service-center
> cd $GOPATH/src/github.com/ServiceComb/service-center/
> go build
```
**Note:**首先下载3.X版本之上的ETCD的二进制版本并运行（当前例子实在MAC之下），然后下载Service-center源码并Build。
{: .notice--warning}


将配置文件etc/conf/app.conf移到文件夹conf下并修改相应的参数

```
manager_cluster = "127.0.0.1:2379"
httpport = 9980
```
manager_cluster为ETCT地址

httpport为Service Center绑定的端口

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

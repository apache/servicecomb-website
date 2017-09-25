---
title: "环境配置"
lang: cn
ref: setup-environment
permalink: /cn/users/setup-environment/
excerpt: "环境配置"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}

## 安装Java开发环境

* 安装git，详情可参考[git安装教程](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

* 安装JDK 1.8+，详情可参考[JDK安装教程](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html){:target="_blank"}。

* 安装Maven 3.x，详情可参考[Maven安装教程](https://maven.apache.org/install.html){:target="_blank"}。

* 安装IntelliJ Idea IDE，详情可参考[IntelliJ安装教程](https://www.jetbrains.com/help/idea/installing-and-launching.html){:target="_blank"}。

## 运行*Service Center*
运行Service Center有以下两种方式:

1. 以可执行文件的方式运行

   <ul class="nav nav-tabs">
     <li data-toggle="tab" class="active"><a data-toggle="tab" href="#windows">Windows</a></li>
     <li data-toggle="tab"><a data-toggle="tab" href="#linux">Linux</a></li>
   </ul>
   
   <div class="tab-content">
     <div id="windows" class="tab-pane active" markdown="1">
   1. 下载[服务注册中心可执行文件压缩包](https://github.com/ServiceComb/service-center/releases/download/0.1.1/service-center-0.1.1-windows-amd64.zip)
   2. 解压缩到当前文件夹
   3. 进入解压缩后的目录，然后双击运行**start**文件
     </div>
     <div id="linux" class="tab-pane fade" markdown="1">
   1. 下载服务注册中心可执行文件压缩包并解压缩
   ```bash
   wget https://github.com/ServiceComb/service-center/releases/download/0.1.1/service-center-0.1.1-linux-amd64.tar.gz
   tar xvf service-center-0.1.1-linux-amd64.tar.gz
   ```
   2. 运行服务注册中心
   ```bash
   bash service-center-0.1.1-linux-amd64/start.sh
   ```
    </div>
   </div>

   注意：Window和Linux版本均只支持64位系统。
   {: .notice--warning}

2. 以Docker的方式运行

```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```

**注意事项：** 服务注册中心运行后绑定的IP为：*http://127.0.0.1:30100*。  
如使用Docker Toolbox，可通过 `docker-machine ip` 获取服务绑定IP地址。
{: .notice--warning}

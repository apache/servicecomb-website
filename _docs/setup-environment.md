---
title: "环境配置"
lang: cn
ref: setup-environment
permalink: /cn/docs/setup-environment/
excerpt: "环境配置"
last_modified_at: 2018-04-13T10:01:43-04:00
---

{% include toc %}

## 安装Java开发环境

* 安装git，详情可参考[git安装教程](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

* 安装JDK 1.8，详情可参考[JDK安装教程](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html){:target="_blank"}。

* 安装Maven 3.x，详情可参考[Maven安装教程](https://maven.apache.org/install.html){:target="_blank"}。

* 安装IntelliJ Idea IDE，详情可参考[IntelliJ安装教程](https://www.jetbrains.com/help/idea/installing-and-launching.html){:target="_blank"}。

## 运行 Service Center
### 运行 Stand-alone Service Center
运行Stand-alone Service Center有以下两种方式:

1. 以可执行文件的方式运行

   <ul class="nav nav-tabs">
     <li data-toggle="tab" class="active"><a data-toggle="tab" href="#windows">Windows</a></li>
     <li data-toggle="tab"><a data-toggle="tab" href="#linux">Linux</a></li>
   </ul>
   
   <div class="tab-content">
     <div id="windows" class="tab-pane active" markdown="1">
   1. 下载[服务注册中心可执行文件压缩包](http://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m2/apache-servicecomb-incubating-service-center-1.0.0-m2-windows-amd64.tar.gz)
   2. 解压缩到当前文件夹
   3. 进入解压缩后的目录，然后双击运行**start-service-center.bat**文件
     </div>
     <div id="linux" class="tab-pane fade" markdown="1">
   1. 下载服务注册中心可执行文件压缩包并解压缩
   ```bash
   wget http://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m2/apache-servicecomb-incubating-service-center-1.0.0-m2-linux-amd64.tar.gz
   tar xvf apache-servicecomb-incubating-service-center-1.0.0-m2-linux-amd64.tar.gz
   ```
   2. 运行服务注册中心
   ```bash
   bash apache-servicecomb-incubating-service-center-1.0.0-m2-linux-amd64/start-service-center.sh
   ```
   
    注意：前端（frontend）在Linux环境下默认会绑定ipv6地址，导致浏览器报错，修复办法为：先修改conf/app.conf中的httpaddr为外部可达网卡ip，之后修改app/appList/apiList.js中`ip : 'http://127.0.0.1'`为对应ip，最后重启ServiceCenter即可。
    {: .notice--warning}
  
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

### 运行 Service Center 集群
Service Center是一个无状态的应用因此它很容易以集群的模式部署提供HA。

它依赖[etcd](https://github.com/coreos/etcd)存储微服务的信息，etcd既支持standalone模式运行也支持[集群模式](https://coreos.com/etcd/docs/latest/op-guide/clustering.html)运行。

提示：我们强烈推荐etcd以集群模式运行，这样才能从整体上保证Service Center的HA能力；另外在这篇[文档](https://coreos.com/etcd/docs/latest/op-guide/runtime-configuration.html)中我们可以了解到etcd需要部署至少三个节点才能够避免Majority Failure。


部署了standalone或集群etcd后，你可以按下面的步骤部署Service Center集群，我们以在两台VM上各部署一个Service Center实例为例：

| Name    | Address     |
| :-----: | :---------: |
| VM1     | 10.12.0.1   |
| VM2     | 10.12.0.2   |

我们假定你的etcd运行在http://10.12.0.4:2379 上：

##### 第一步
在所有的VM上从[ServiceComb官网](https://github.com/apache/incubator-servicecomb-service-center/releases)下载最新版本的Service Center并解压：

```bash
tar -xvf service-center-X.X.X-linux-amd64.tar.gz
```

提示：请不要按stand-alone提示的方式执行start-service-center.sh，因为这样会启动内置的etcd。

##### 第二步
编辑ServcieComb的配置文件，修改ip/port以及etcd地址：
###### VM1
```bash
vi conf/app.conf
```

修改下面的配置 :
```text
httpaddr = 10.12.0.1
manager_cluster = "10.12.0.4:2379"
```

然后启动Service Center :
```bash
./service-center
```

###### VM2
```bash
vi conf/app.conf
```

修改下面的配置 :
```text
httpaddr = 10.12.0.2
manager_cluster = "10.12.0.4:2379"
```

然后启动Service Center :
```bash
./service-center
```

提示：在`manger_cluster`配置中你可以填写多个在etcd群集中的etcd实例地址：
```
manager_cluster= "10.12.0.4:2379,10.12.0.X:2379,10.12.0.X:2379"
```

##### 第三步
验证你部署完毕的Service Center实例 :
```bash
curl http://10.12.0.1:30101/v4/default/registry/health
```
将会返回下面的内容 :
```json
{
    "instances": [
        {
            "instanceId": "d6e9e976f9df11e7a72b286ed488ff9f",
            "serviceId": "d6e99f4cf9df11e7a72b286ed488ff9f",
            "endpoints": [
                "rest://10.12.0.1:30100"
            ],
            "hostName": "service_center_10_12_0_1",
            "status": "UP",
            "healthCheck": {
                "mode": "push",
                "interval": 30,
                "times": 3
            },
            "timestamp": "1516012543",
            "modTimestamp": "1516012543"
        },
        {
            "instanceId": "16d4cb35f9e011e7a58a286ed488ff9f",
            "serviceId": "d6e99f4cf9df11e7a72b286ed488ff9f",
            "endpoints": [
                "rest://10.12.0.2:30100"
            ],
            "hostName": "service_center_10_12_0_2",
            "status": "UP",
            "healthCheck": {
                "mode": "push",
                "interval": 30,
                "times": 3
            },
            "timestamp": "1516012650",
            "modTimestamp": "1516012650"
        }
    ]
}
```


我们可以看到Service Center能够自动发现所有正在集群中运行的实例，[Java-Chassis SDK](https://github.com/apache/incubator-servicecomb-java-chassis)将使用这个特性至少找到一个Service Center实例。

在你的microservice.yaml中你可以填写一个或多个Service Center实例，如果[Java-Chassis SDK](https://github.com/apache/incubator-servicecomb-java-chassis)发现配置的第一个地址（实例）失败，它将会自动使用下一个地址（实例）：
```yaml
servicecomb:
  service:
    registry:
      address: "http://10.12.0.1:30100,http://10.12.0.2:30100"
      autodiscovery: true
```
上面的例子里包含了我们已经配置好的两个Service Center实例。

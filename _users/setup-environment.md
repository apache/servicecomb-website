---
title: "Setup Environment"
lang: en
ref: setup-environment
permalink: /docs/users/setup-environment/
excerpt: "Setup Environment"
last_modified_at: 2018-04-13T10:01:43-04:00
---

{% include toc %}

## Setup Local Java Develop Environment

* Setup git，Refer to [How to setup git](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

* Setup JDK 1.8，Refer to [How to setup JDK](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html){:target="_blank"}。

* Setup Maven 3.x，Refer to [How to setup Maven](https://maven.apache.org/install.html){:target="_blank"}。

* Setup IntelliJ Idea IDE，Refer to [How to setup IntelliJ](https://www.jetbrains.com/help/idea/installing-and-launching.html){:target="_blank"}。

## Starting Service Center
### Starting Stand-alone Service Center
There are two ways to start a stand-alone service center service:

1. Start from installation package

   <ul class="nav nav-tabs">
     <li data-toggle="tab" class="active"><a data-toggle="tab" href="#windows">Windows</a></li>
     <li data-toggle="tab"><a data-toggle="tab" href="#linux">Linux</a></li>
   </ul>

   <div class="tab-content">
     <div id="windows" class="tab-pane active" markdown="1">
   1. Download [the installation package of ServiceCenter](http://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m2/apache-servicecomb-incubating-service-center-1.0.0-m2-windows-amd64.tar.gz)
   2. Decompress the installation package into the installation directory.
   3. Start Local ServiceCenter from **start-service-center.bat** file
   </div>
    <div id="linux" class="tab-pane fade" markdown="1">
   1. Download and Decompress command:
   ```bash
   wget http://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m2/apache-servicecomb-incubating-service-center-1.0.0-m2-linux-amd64.tar.gz
   tar xvf apache-servicecomb-incubating-service-center-1.0.0-m2-linux-amd64.tar.gz
   ```
   2. Start local service center command:
   ```bash
   bash apache-servicecomb-incubating-service-center-1.0.0-m2-linux-amd64/start-service-center.sh
   ```
   
   NOTE：Frontend will bind ipv6 address under Linux, so browser may report error, fix method：Modify httpaddr in conf/app.conf with a reachable ip, then modify `ip : 'http://127.0.0.1'` in app/appList/apiList.js with same ip, final restart ServiceCenter.
   {: .notice--warning}
   
    </div>
   </div>
   
   NOTE：The OS must be 64-bit.
   {: .notice--warning}

2. Start from Docker

```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```

**NOTE：** Running Service Center will bind on: *http://127.0.0.1:30100*。  
If using Docker Toolbox，command `docker-machine ip` can be used to get binded IP address.
{: .notice--warning}

### Starting Clustered Service Center
As Service-center is a stateless application so it can be seamlessly deployed in cluster mode to achieve HA.

SC is dependent on the [etcd](https://github.com/coreos/etcd) to store the micro-services information so you can opt for running etcd standalone or in [cluster](https://coreos.com/etcd/docs/latest/op-guide/runtime-configuration.html) mode.

Notice: We strongly recommend running etcd in cluster mode in order to get the perfect HA ability. In this [document](https://coreos.com/etcd/docs/latest/op-guide/runtime-configuration.html) we can know it is highly recommended to always have a cluster size greater than two in production in order to prevent Majority Failure.

Once you are done with installing the etcd either in cluster or standalone mode then you can follow the below steps to run the Service-Center.

Let's assume you want to install 2 instances of Service-Center on VM with following details  

| Name    | Address     |
| :-----: | :---------: |
| VM1     | 10.12.0.1   |
| VM2     | 10.12.0.2   |

Here we assume your etcd is running on http://10.12.0.4:2379 (you can follow [this](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/container.md) guide to install etcd in cluster mode.)

##### Step 1
Download the SC release from [here](https://github.com/apache/incubator-servicecomb-service-center/releases) on all the VM's.
```bash
tar -xvf service-center-X.X.X-linux-amd64.tar.gz
```

Note: Please don't run start-service-center.sh as it will also start the built-in etcd.

##### Step 2
Edit the configuration of the ip/port on which SC will run and etcd ip
###### VM1
```bash
vi conf/app.conf
```

Replace the below values :
```text
httpaddr = 10.12.0.1
manager_cluster = "10.12.0.4:2379"
```

Then start the Service-center :
```bash
./service-center
```

###### VM2
```bash
vi conf/app.conf
```

Replace the below values :
```text
httpaddr = 10.12.0.2
manager_cluster = "10.12.0.4:2379"
```

Then start the Service-center :
```bash
./service-center
```

Note: In `manger_cluster` you can put the multiple instances of etcd in the cluster like :
```
manager_cluster= "10.12.0.4:2379,10.12.0.X:2379,10.12.0.X:2379"
```

##### Step 3
Verify your instances via :
```bash
curl http://10.12.0.1:30101/v4/default/registry/health
```
Will return :
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

As we can see here the Service-Center can auto-discover all the instances of the Service-Center running in cluster, this auto-discovery feature is used by the [Java-Chassis SDK](https://github.com/apache/incubator-servicecomb-java-chassis) to auto-discover all the instances of the Service-Center by knowing at least one IP of Service-Center running in cluster.

In your microservice.yaml you can provide the SC IP of both the instance or any one instance, sdk can auto-discover other instances and use the other instances to get microservice details in case of failure of the first one.
```yaml
servicecomb:
  service:
    registry:
      address: "http://10.12.0.1:30100,http://10.12.0.2:30100"
      autodiscovery: true
```
In this case sdk will be able to discover all the instances of SC in cluster.

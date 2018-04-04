---
title: "Setup Environment"
lang: en
ref: setup-environment
permalink: /users/setup-environment/
excerpt: "Setup Environment"
last_modified_at: 2017-09-03T10:01:43-04:00
---

{% include toc %}

## Setup Local Java Develop Environment

* Setup git，Refer to [How to setup git](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

* Setup JDK 1.8，Refer to [How to setup JDK](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html){:target="_blank"}。

* Setup Maven 3.x，Refer to [How to setup Maven](https://maven.apache.org/install.html){:target="_blank"}。

* Setup IntelliJ Idea IDE，Refer to [How to setup IntelliJ](https://www.jetbrains.com/help/idea/installing-and-launching.html){:target="_blank"}。

## Starting Local *Service Center*
There are two ways to start a service center service:

1. Start from installation package

   <ul class="nav nav-tabs">
     <li data-toggle="tab" class="active"><a data-toggle="tab" href="#windows">Windows</a></li>
     <li data-toggle="tab"><a data-toggle="tab" href="#linux">Linux</a></li>
   </ul>

   <div class="tab-content">
     <div id="windows" class="tab-pane active" markdown="1">
   1. Download [the installation package of ServiceCenter](http://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m1/apache-servicecomb-incubating-service-center-1.0.0-m1-windows-amd64.tar.gz)
   2. Decompress the installation package into the installation directory.
   3. Start Local ServiceCenter from **start-service-center.bat** file
   </div>
   <div id="linux" class="tab-pane fade" markdown="1">
   1. Download and Decompress command:
   ```bash
   wget http://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m1/apache-servicecomb-incubating-service-center-1.0.0-m1-linux-amd64.tar.gz
   tar xvf apache-servicecomb-incubating-service-center-1.0.0-m1-linux-amd64.tar.gz
   ```
   2. Start local service center command:
   ```bash
   bash apache-servicecomb-incubating-service-center-1.0.0-m1-linux-amd64/start-service-center.sh
   ```
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

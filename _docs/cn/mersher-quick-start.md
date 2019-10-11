---
title: mersher快速入门
lang: cn
ref: mersher-quick-start
permalink: /cn/docs/mersher-quick-start/
excerpt: 介绍如何使用mersher快速改造微服务应用
last_modified_at: 2019-08-08T14:01:43.000Z
---

# 安装运行环境

- 安装**git**，详情可参考[git安装教程](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git){:target="_blank"}。

- 安装**golang 1.12.7** ，详情可参考[Go安装教程](https://golang.google.cn/doc/install){:target="_blank"}。

- 安装**python 2.7**，详情可参考[python安装教程](https://wiki.python.org/moin/BeginnersGuide/Download){:target="_blank"}。

- 安装**nodejs v10.16.2**，详情可参考[nodejs安装教程](https://nodejs.org/en/download/){:target="_blank"}。

# 运行 Service Center

在 **ServiceComb** 微服务框架中，**Service Center** 提供服务注册及服务发现功能，可直接使用 Docker 运行。

```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```

_您可以通过阅读[环境配置](/cn/users/setup-environment/#运行service-center)获取在本地以二进制方式运行**Service Center**和**front**的方法。_

# 使用mersher接入servicecomb微服务体系

## 案例背景

- 本用例主要是帮助用户快速入门**mersher sidecar模式**；希望用户通过该例子，快速上手使用mersher服务，了解mersher的工作模式，并了解如何通过mersher的帮助改造已有的http服务，接入ServiceComb微服务体系，得到go-chassis微服务框架提供的负载均衡、流控、服务治理、调用链追踪等微服务能力。完整案例将提交至[案例下载](https://github.com/apache/servicecomb-mesher/tree/master/examples/quick_start).

## 用例服务介绍

- 如下图所示，用例中的服务部署在地址为192.168.88.64的机器上，用户在地址为192.168.88.78的机器上通过浏览器发起请求；

- 1、 **httpserver_calculator**：基于python语言实现的http体质指数服务，可替换为任何语言开发的http服务；

- 2、 **httpserver_webapp**：基于nodejs语言实现的web服务，用于在浏览器上展示可视化结果；

- 3、 **mersher_webapp**：通过sidecar模式为httpserver_webapp提供服务的mersher实例；

- 4、 **mersher_calculator**：通过sidecar模式为httpserver_calculator提供服务的mersher实例；

- 5、 **servicecenter**：服务中心，接收mesher服务的注册，提供服务发现、路由查询、服务监控功能；

  ![mersher部署图](/assets/images/mersher/mersher-deployment-simple.png)

## 流程详情

- 1、 浏览器[192.168.88.78]对 **httpserver_webapp** 服务发起http调用[]()<http://192.168.88.64:4597/calculator/bmi>；

- 2、 httpserver_webapp服务接收请求，并发起对地址[]()<http://calculator/bmi>的http调用，因为设置了代理[]()<http://127.0.0.1:30101>，**httpserver_webapp** 发起的请求将被转发到 **mersher_webapp** 服务；

- 3、 **mersher_webapp** 根据请求的服务名(microservice.yaml配置的服务名**calculator**）从服务中心**servicecenter**获得该服务名的地址，转发到**mersher_calculator**；

- 4、 **mersher_calculator**服务根据设置好的specific地址，转发到自己绑定的体质指数**calculator**服务(**httpserver_calculator**)进行处理；

- 5、 **httpserver_calculator**会根据用户身高和体重进行计算，并返回自己的服务标识展示在界面上；流程图如下所示：

  ![mersher流程图](/assets/images/mersher/mersher-flowchart-simple.png)

## 环境搭建

- 1、 编译 **mersher** ：[下载地址](https://github.com/apache/servicecomb-mesher)， 按README.md编译项目得到可执行文件mersher(linux)，windows(mersher.exe)；

- 2、 创建 **mersher_webapp** 用于为**httpserver_webapp**服务： 在mersher目录下执行下列linux命令创建mersher_webapp，此处除了可执行文件，还需要拷贝conf

  ```bash
  mkdir /usr/local/src/mersher_webapp
  cp ./mesher /usr/local/src/mersher_webapp
  cp -r ./conf /usr/local/src/mersher_webapp
  ```

  更改conf中配置文件，microservice.yaml中的**服务name**，从hellomesher改为**webapp**；更改chassis.yaml中监听的服务地址，从本地回环（127.0.0.1）地址改为**内网ip**（linux下通过ifconfig查看，如192.168.88.64）:

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40101
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30101
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30102
  ```

- 3、 创建**mersher_calculator**

  ```bash
  mkdir /usr/local/src/mersher_calculator
  cp ./mesher /usr/local/src/mersher_calculator
  cp -r ./conf /usr/local/src/mersher_calculator
  ```

  更改conf中配置文件，分别更改**microservice.yaml**中的**服务name**为体质指数微服务名**calculator**；<br>
  更改**mersher_calculator**配置**chassis.yaml**监听的地址和端口：

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40107
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30111
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30112
  ```

- 4、 启动mersher服务，分别进入**mersher_webapp**和**mersher_calculator**，启动服务，其中需要设置mersher_calculator的**SPECIFIC_ADDR**地址，该地址用于将mersher和http服务绑定起来；

  ```bash
  cd /usr/local/src/mersher_calculator
  export SPECIFIC_ADDR=127.0.0.1:4540
  ./mersher
  ```

  ```bash
  cd /usr/local/src/mersher_webapp
  ./mersher
  ```

- 5、 启动**httpserver_webapp**服务：

  ```bash
  cd /usr/local/src/httpserver_webapp
  npm install
  export http_proxy=http://127.0.0.1:30101
  node ./httpserver_webapp.js
  ```

- 6、 **httpserver_calculator**作为体质指数计算服务，需要安装python2.7，依赖BaseHTTPServer包：

  ```bash
  cd /usr/local/src/httpserver_calculator
  ./httpserver_calculator.py
  ```

## 开始测试

- 1、 浏览器打开页面<http://192.168.88.64:30103> (如果打不开需要开启服务中心service-center的front服务，参考 <http://servicecomb.apache.org/cn/users/setup-environment/#%E8%BF%90%E8%A1%8Cservice-center>) 查看服务，其中地址service-center服务启动的地址，看到如图界面。**webapp**代表**mersher_webapp**服务，这里展示的是microservice.yaml中配置的服务名。**calculator**代表**mersher_calculator**服务，这里展示的是microservice.yaml中配置的服务名。大写的**SERVICECENTER**是服务中心；

  ![服务中心监控图](/assets/images/mersher/mersher-servercenter.png)

- 2、 浏览器打开<http://192.168.88.64:4597>，可以看到如下界面，为webapp呈现的静态页面：

  ![bmi测试初始化图](/assets/images/mersher/mersher-testinit.png)

- 3、 输入参数(180、70)点击submit，显示如下图：

  ![bmi测试初始化图](/assets/images/mersher/mersher-testpythonhttp.png)

# 下一步

- 阅读[**mersher**进阶](/cn/docs/mersher-quick-start-advance/)。

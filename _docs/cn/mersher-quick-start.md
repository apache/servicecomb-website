---
title: mersher快速入门
lang: cn
ref: mersher-quick-start
permalink: /cn/docs/mersher-quick-start/
excerpt: 介绍如何使用mersher快速改造微服务应用
last_modified_at: 2019-08-08T14:01:43.000Z
---

# 安装 Go 和 Python 开发环境

- 安装**git**，详情可参考[git安装教程](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git){:target="_blank"}。

- 安装**golang 1.12.7** ，详情可参考[Go安装教程](https://golang.google.cn/doc/install){:target="_blank"}。

- 安装**python 2.7**，详情可参考[python安装教程](https://wiki.python.org/moin/BeginnersGuide/Download){:target="_blank"}。

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

- 1、 **httpserver-a**：基于go语言实现的http体质指数服务，可替换为任何语言开发的http服务；
- 2、 **httpserver-b**：基于python语言实现的http体质指数服务，功能与httpserver-a相同，可替换为任何语言开发的http服务；
- 3、 **mersher-a**：通过sidecar模式为httpserver-a提供服务的mersher实例；
- 4、 **mersher-b**：通过sidecar模式为httpserver-b提供服务的mersher实例；
- 5、 **mersher-g**：通过sidecar模式为httpserver-gateway提供服务的mersher实例；
- 6、 **servicecenter**：服务中心，接收mesher服务的注册，提供服务发现、路由查询、服务监控功能；
- 7、 **webapp**：来源于bmi示例，用于在浏览器上展示可视化结果，使用ajax发起http服务调用；
- 8、 **httpserver-gateway**：内部服务服务统一出口，接收webapp服务请求，作为bmi（体质指数）客户端发起http请求；

  ![mersher部署图](/assets/images/mersher/mersher-deployment.png)

## 流程详情

- 1、 浏览器通过 **webapp** 服务发起http调用[]()<http://192.168.88.64:4538/bmi>；
- 2、 httpserver-gateway服务接收请求，并发起对地址[]()<http://mersher-provider/bmi>的http调用，因为设置了代理[]()<http://127.0.0.1:30101>，**httpserver-gateway** 发起的请求将被转发到 **mersher-g** 服务；
- 3、 **mersher-g** 根据请求的服务名(microservice.yaml配置的服务名**mersher-provider**）从服务中心**servicecenter**获得该服务名的地址，根据负载均衡算法（默认轮询）转发到部署的两个**mersher**(**mersher-a**和**mersher-b**)之一；
- 4、 **mersher**(**mersher-a**和**mersher-b**)服务根据设置好的spefic地址，转发到自己绑定的**provider**服务(**httpserver_a**和**httpserver_b**)服务进行处理；
- 5、 **httpserver_a**和**httpserver_b**会根据用户身高和体重进行计算，并返回自己的服务标识展示在界面上；流程图如下所示：

  ![mersher流程图](/assets/images/mersher/mersher-flowchart.png)

## 环境搭建

- 1、 编译 **mersher** ：[下载地址](https://github.com/apache/servicecomb-mesher), 按README.md编译项目 得到可执行文件mersher（linux），windows（mersher.exe）；
- 2、 创建 **mersher-g** 用于接收客户端请求： 在mersher目录下执行下列linux命令创建mersher-g，此处除了可执行文件，还需要拷贝conf

  ```bash
  mkdir /usr/local/src/mersher-g
  cp ./mesher /usr/local/src/mersher-g
  cp -r ./conf /usr/local/src/mersher-g
  ```

  更改conf中配置文件，microservice.yaml中的**服务name**，从hellomesher改为**mersher-consumer**；更改chassis.yaml中监听的服务地址，从本地回环（127.0.0.1）地址改为**内网ip**（linux下通过ifconfig查看，如192.168.88.64）:

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40101
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30101
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30102
  ```

- 3、 创建mersher-a和mersher-b

  ```bash
  mkdir /usr/local/src/mersher-a
  cp ./mesher /usr/local/src/mersher-a
  cp -r ./conf /usr/local/src/mersher-a
  mkdir /usr/local/src/mersher-b
  cp ./mesher /usr/local/src/mersher-b
  cp -r ./conf /usr/local/src/mersher-b
  ```

  更改conf中配置文件，分别更改**microservice.yaml**中的**服务name**为相同的**mersher-provider**；<br>
  更改**mersher-a**配置**chassis.yaml**监听的地址和端口：

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40107
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30111
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30112
  ```

  更改**mersher-b**配置**chassis.yaml**监听的地址和端口：

  ```bash
    listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40102
    listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30108
    listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30109
  ```

- 4、 启动mersher服务，分别进入mersher-g、mersher-a和mersher-b，启动服务，其中需要设置mersher-a和mersher-b的SPECIFIC_ADDR地址，该地址用于将mersher和http服务绑定起来；

  ```bash
  cd /usr/local/src/mersher-a
  export SPECIFIC_ADDR=127.0.0.1:4537
  ./mersher
  ```

  ```bash
  cd /usr/local/src/mersher-b
  export SPECIFIC_ADDR=127.0.0.1:4540
  ./mersher
  ```

  ```bash
  cd /usr/local/src/mersher-g
  ./mersher
  ```

- 5、 搭建**httpserver**作为http provier服务，**httpserver-gateway**作为http client服务：

  ```bash
  go build httpserver.go
  ./httpserver.go
  go build httpservergateway.go
  ./httpservergateway
  ```

- 6、运行**http_server.py**程序，需要安装python2.7，依赖BaseHTTPServer包；

- 7、 使用[**Bmi体质指数**](/cn/docs/quick-start.md/) 中的webapp作为展示服务，将webapp/src/main/resources/static/index.html 静态页面中 ajax调用的地址从/calculator/bmi?height=改为[]()<http://192.168.88.64:4538/bmi?height=> 这个地址是httpservergateway客户端服务的监听地址，更新application.yaml中的监听端口为192.168.88.64；

## 开始测试

- 1、 浏览器打开页面<http://192.168.88.64:30103> (如果打不开需要开启服务中心service-center的front服务，参考 <<http://servicecomb.apache.org/cn/users/setup-environment/#%E8%BF%90%E8%A1%8Cservice-center>) 查看服务，可以看到如下界面。其中gateway是上述的webapp服务，这里展示的是microservice.yaml中配置的服务名。大写的SERVICECENTER是服务中心；

  ![服务中心监控图](/assets/images/mersher/mersher-servercenter.png)

- 2、 浏览器打开<http://192.168.88.64:8889>，可以看到如下界面，为webapp呈现的静态页面：

  ![bmi测试初始化图](/assets/images/mersher/mersher-testinit.png)

- 3、 输入参数(180、70)点击submit，观察BMI Instance ID变化：

  ![bmi测试初始化图](/assets/images/mersher/mersher-testgohttp.png)<br>

  ![bmi测试初始化图](/assets/images/mersher/mersher-testpythonhttp.png)

# 下一步

- 阅读[**mersher**进阶](/cn/docs/mersher-quick-start-advance.md/)。

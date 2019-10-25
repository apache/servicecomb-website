---
title: Mersher Get started
lang: en
ref: mersher-quick-start
permalink: /docs/mersher-quick-start/
excerpt: Describe how to use mersher to merge into the servicecomb microservice system
last_modified_at: 2019-08-08T14:01:43.000Z
---

# Install development environment

- Install **git**. Get details [git Installation tutorial](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git){:target="_blank"}.

- Install **golang 1.12.7**. Get details [Go Installation tutorial](https://golang.google.cn/doc/install){:target="_blank"}.

- Install **python 2.7**. Get details [python Installation tutorial](https://wiki.python.org/moin/BeginnersGuide/Download){:target="_blank"}.

- Install **nodejs v10.16.2**. Get details [nodejs download](https://nodejs.org/en/download/){:target="_blank"}。

# Run Service Center

In the **ServiceComb** microservices framework, **Service Center** provides service registration and service discovery.

```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```

_Reference to [service center deployment](/users/setup-environment/#运行service-center) to learn deploying Service Center and front as a local binary._

# Use mersher to merge into the servicecomb microservice system

## Background

- This use case is mainly to help users get started quickly with **mersher sidecar** mode. We hope that users can understand the working mode of mersher and learn how to merge the existing http service into the ServiceComb micro-service system with mersher. The final goal is to help user get the micro-service capabilities such as load balancing, flow control, service management and call chain tracing provided by servicecomb. The full case will be submitted to [Case Download](https://github.com/apache/servicecomb-mesher/tree/master/examples/quick_start).

## Mersher use case service introduction

- 1 **httpserver_calculator**. A http server based on python which is for BMI calculator and can be developed by any language.
- 2 **httpserver_webapp**. A http server based on nodejs which is used for displaying results on the browser.
- 3 **mersher_webapp**. A mersher instance which serves for httpserver_webapp via sidecar mode.
- 4 **mersher_calculator**. A mersher instance which serves for httpserver_calculator via sidecar mode.
- 5 **servicecenter**. Servicecenter which receives registration of mesher service and provides services as service discovery, routing query, service monitoring and so on.

![mersher deployment diagram](/assets/images/mersher/mersher-deployment-simple.png)

## Process details

- 1 The browser[192.168.88.78] execute a http call to the **httpserver_webapp** service with url []()<http://192.168.88.64:4597/calculator/bmi>.
- 2 The httpserver_webapp service receives the request and execute http call []()<http://calculator/bmi>. Because the proxy is set as []()<http://127.0.0.1:30101>, the request initiated by **httpserver_webapp** will be forwarded to the **mersher_webapp** service.
- 3 **mersher_webapp** gets the address of the service name(the service name **calculator** here is configured in microservice.yaml) from the **servicecenter** and forwarded to **mersher_calculator**.
- 4 **mersher_calculator** service forward http requests to the **httpserver_calculator** service.
- 5 **httpserver_calculator** will calculate according to the input parameters(height and weight). The result containing service id and body mass index will be displayed on the browser. The flow chart is as follows:

  ![mersher-flow-chart](/assets/images/mersher/mersher-flowchart-simple.png)

## Environmental construction

- 1 Compile **mersher** [download](https://github.com/apache/servicecomb-mesher). Download the project and get the executable mersher(linux) or mersher.exe(windows) by README.md.

- 2 Create **mersher_webapp** which serves for **httpserver_webapp**. In the mersher directory execute the following linux command to create mersher_webapp. In order to the run mersher you also need to copy the conf.

  ```bash
  mkdir /usr/local/src/mersher_webapp
  cp ./mesher /usr/local/src/mersher_webapp
  cp -r ./conf /usr/local/src/mersher_webapp
  ```

  Change **service name** in microservice.yaml from hellemesher to **webapp**. Change the listening service address in chassis.yaml from 127.0.0.1 to **intranet ip**(Viewed by cmd ifconfig in linux, such as 192.168.88.64).

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40101
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30101
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30102
  ```

- 3 Create mersher_calculator service.

  ```bash
  mkdir /usr/local/src/mersher_calculator
  cp ./mesher /usr/local/src/mersher_calculator
  cp -r ./conf /usr/local/src/mersher_calculator
  ```

  Change the **service name** in conf file **microservice.yaml** from hellemesher to **calculator**.<br>
  Change the listening address and port in conf file **chassis.yaml**.

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40107
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30111
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30112
  ```

- 4 Run mersher_webapp and mersher_calculator respectively by cmd.

  ```bash
  cd /usr/local/src/mersher_calculator
  export SPECIFIC_ADDR=127.0.0.1:4540
  ./mersher
  ```

  ```bash
  cd /usr/local/src/mersher_webapp
  ./mersher
  ```

- 5 Run **httpserver_webapp**.

  ```bash
  cd /usr/local/src/httpserver_webapp
  npm install
  export http_proxy=http://127.0.0.1:30101
  node ./httpserver_webapp.js
  ```

- 6 Run **httpserver_calculator** program as BMI calculator. You need to install python2.7 and this service relies on package BaseHTTPServer.

  ```bash
  cd /usr/local/src/httpserver_calculator
  ./httpserver_calculator.py
  ```

## Start testing

- 1 Open url <http://192.168.88.64:30103> in browser(You need to start the front service of the service-center. Referring <http://servicecomb.apache.org/users/setup-environment/#%E8%BF%90%E8%A1%8Cservice-center>). You can see services information in web. The name **webapp** represents the **mersher_webapp** which is the service name configured in microservice.yaml. The name **calculator** represents the **mersher_calculator** which is the service name configured in microservice.yaml. **SERVICECENTER** represents the **servicecenter**.

  ![Service-center-monitoring](/assets/images/mersher/mersher-servercenter.png)

- 2 Open <http://192.168.88.64:4597> in browser and you can see the following interface.

  ![mersher_calculatormi-test](/assets/images/mersher/mersher-testinit.png)

- 3 Enter the parameters (180, 70) and click submit.

  ![mersher-testhttp](/assets/images/mersher/mersher-testpythonhttp.png)

# What's next

- Read [mersher quick start advance](/docs/mersher-quick-start-advance/)

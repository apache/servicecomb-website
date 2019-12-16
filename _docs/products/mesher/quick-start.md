---
title: Quick Start
lang: en
ref: quick-start
permalink: /docs/products/mesher/quick-start/
excerpt: Describe how to use mesher to merge into the servicecomb microservice system
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

_Reference to [service center install](/docs/products/service-center/install/#run-with-release-package) to learn deploying Service Center and front as a local binary._

# Use mesher to merge into the servicecomb microservice system

## Background

- This use case is mainly to help users get started quickly with **mesher sidecar** mode. We hope that users can understand the working mode of mesher and learn how to merge the existing http service into the ServiceComb micro-service system with mesher. The final goal is to help user get the micro-service capabilities such as load balancing, flow control, service management and call chain tracing provided by servicecomb. The full case will be submitted to [Case Download](https://github.com/apache/servicecomb-mesher/tree/master/examples/quick_start).

## mesher use case service introduction

- 1 **httpserver_calculator**. A http server based on python which is for BMI calculator and can be developed by any language.
- 2 **httpserver_webapp**. A http server based on nodejs which is used for displaying results on the browser.
- 3 **mesher_webapp**. A mesher instance which serves for httpserver_webapp via sidecar mode.
- 4 **mesher_calculator**. A mesher instance which serves for httpserver_calculator via sidecar mode.
- 5 **servicecenter**. Servicecenter which receives registration of mesher service and provides services as service discovery, routing query, service monitoring and so on.

![mesher deployment diagram](/assets/images/mesher/mesher-deployment-simple.png)

## Process details

- 1 The browser[192.168.88.78] execute a http call to the **httpserver_webapp** service with url []()<http://192.168.88.64:4597/calculator/bmi>.
- 2 The httpserver_webapp service receives the request and execute http call []()<http://calculator/bmi>. Because the proxy is set as []()<http://127.0.0.1:30101>, the request initiated by **httpserver_webapp** will be forwarded to the **mesher_webapp** service.
- 3 **mesher_webapp** gets the address of the service name(the service name **calculator** here is configured in microservice.yaml) from the **servicecenter** and forwarded to **mesher_calculator**.
- 4 **mesher_calculator** service forward http requests to the **httpserver_calculator** service.
- 5 **httpserver_calculator** will calculate according to the input parameters(height and weight). The result containing service id and body mass index will be displayed on the browser. The flow chart is as follows:

  ![mesher-flow-chart](/assets/images/mesher/mesher-flowchart-simple.png)

## Environmental construction

- 1 Compile **mesher** [download](https://github.com/apache/servicecomb-mesher). Download the project and get the executable mesher(linux) or mesher.exe(windows) by README.md.

- 2 Create **mesher_webapp** which serves for **httpserver_webapp**. In the mesher directory execute the following linux command to create mesher_webapp. In order to the run mesher you also need to copy the conf.

  ```bash
  mkdir /usr/local/src/mesher_webapp
  cp ./mesher /usr/local/src/mesher_webapp
  cp -r ./conf /usr/local/src/mesher_webapp
  ```

  Change **service name** in microservice.yaml from hellemesher to **webapp**. Change the listening service address in chassis.yaml from 127.0.0.1 to **intranet ip**(Viewed by cmd ifconfig in linux, such as 192.168.88.64).

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40101
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30101
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30102
  ```

- 3 Create mesher_calculator service.

  ```bash
  mkdir /usr/local/src/mesher_calculator
  cp ./mesher /usr/local/src/mesher_calculator
  cp -r ./conf /usr/local/src/mesher_calculator
  ```

  Change the **service name** in conf file **microservice.yaml** from hellemesher to **calculator**.<br>
  Change the listening address and port in conf file **chassis.yaml**.

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40107
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30111
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30112
  ```

- 4 Run mesher_webapp and mesher_calculator respectively by cmd.

  ```bash
  cd /usr/local/src/mesher_calculator
  export SPECIFIC_ADDR=127.0.0.1:4540
  ./mesher
  ```

  ```bash
  cd /usr/local/src/mesher_webapp
  ./mesher
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

- 1 Open url <http://192.168.88.64:30103> in browser(You need to start the front service of the service-center. Referring <http://servicecomb.apache.org/docs/service-center/install/#run-with-release-package>). You can see services information in web. The name **webapp** represents the **mesher_webapp** which is the service name configured in microservice.yaml. The name **calculator** represents the **mesher_calculator** which is the service name configured in microservice.yaml. **SERVICECENTER** represents the **servicecenter**.

  ![Service-center-monitoring](/assets/images/mesher/mesher-servercenter.png)

- 2 Open <http://192.168.88.64:4597> in browser and you can see the following interface.

  ![mesher_calculatormi-test](/assets/images/mesher/mesher-testinit.png)

- 3 Enter the parameters (180, 70) and click submit.

  ![mesher-testhttp](/assets/images/mesher/mesher-testpythonhttp.png)

# What's next

- Read [mesher quick start advance](/docs/products/mesher/advance/)

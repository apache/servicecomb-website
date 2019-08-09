---
title: Mersher Quick Start
lang: en
ref: mersher-quick-start
permalink: /docs/mersher-quick-start/
excerpt: Describe how to use mersher to merge into the servicecomb microservice system
last_modified_at: 2019-08-08T14:01:43.000Z
---

# Install Go and Python development environment

- Install **git**. Get details [git Installation tutorial](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git){:target="_blank"}.

- Install **golang 1.12.7**. Get details [Go Installation tutorial](https://golang.google.cn/doc/install){:target="_blank"}.

- Install **python 2.7**. Get details [python Installation tutorial](https://wiki.python.org/moin/BeginnersGuide/Download){:target="_blank"}。

# Run Service Center

In the **ServiceComb** microservices framework, **Service Center** provides service registration and service discovery, which can be run directly using Docker.

```bash
docker pull servicecomb/service-center
docker run -d -p 30100:30100 servicecomb/service-center:latest
```

_Reference to [service center deployment](/users/setup-environment/#运行service-center) to learn deploying Service Center and front as a local binary._

# Use mersher to merge into the servicecomb microservice system

## Background

- This use case is mainly to help users get started quickly with **mersher sidecar mode**. We hope that users can understand the working mode of mersher and learn how to merge the existing http service into the ServiceComb micro-service system with mersher's help. The final goal is to help user get the micro-service capabilities such as load balancing, flow control, service management and call chain tracing provided by servicecomb.

## Mersher use case service introduction

- 1 **httpserver-a**: A http server based on golang which is for BMI calculator and can be developed by any language.
- 2 **httpserver-b**: A http server based on python which is for BMI calculator and can be developed by any language.
- 3 **mersher-a**: A mersher instance which serves for httpserver-a via sidecar mode.
- 4 **mersher-b**: A mersher instance which serves for httpserver-b via sidecar mode.
- 5 **mersher-g**: A mersher instance which serves for httpserver-gateway via sidecar mode.
- 6 **servicecenter**: Servicecenter which receives registration of mesher service and provides services as service discovery, routing query, service monitoring and so on.
- 7 **webapp**: A http server which reuses the bmi example service is used for displaying visual results on the browser and using ajax to execute http service calls.
- 8 **httpserver-gateway**: A http server which is used as an unified export of internal services receives webapp's requestand and then execute HTTP request as a BMI client.

  ![mersher deployment diagram](/assets/images/mersher/mersher-deployment.png)

## Process details

- 1 The browser execute a http call via the **webapp** service []()<http://192.168.88.64:4538/bmi>.
- 2 The httpserver-gateway service receives the request and execute http call []()<http://mersher-provider/bmi>. Because the proxy is set as []()<http://127.0.0.1:30101>, the request initiated by **httpserver-gateway** will be forwarded to the **mersher-g** service.
- 3 **mersher-g** gets the address of the service name from the **servicecenter** based on the requested service name(the service name **mersher-provider** here is configured in microservice.yaml) and forwarded to one of the two **mersher** (**mersher-a** and **mersher-b**) according to the load balancing algorithm (default polling);
- 4 **mersher** (**mersher-a** and **mersher-b**) services forward http requests to their own **provider** service (**httpserver_a** or **httpserver_b**) based on the spefic address.
- 5 **httpserver_a** and **httpserver_b** will calculate according to the user's height and weight, and return their own service ID displayed on the interface. The flow chart is as follows:

  ![mersher-flow-chart](/assets/images/mersher/mersher-flowchart.png)

## Environmental construction

- 1 Compile **mersher** in [download](https://github.com/apache/servicecomb-mesher). Download the project by README.md to get the executable mersher(linux) or mersher.exe(windows).
- 2 Create **mersher-g** to receive client requests. In the mersher directory execute the following linux command to create mersher-g. In order to the execute mersher you also need to copy the conf.

  ```bash
  mkdir /usr/local/src/mersher-g
  cp ./mesher /usr/local/src/mersher-g
  cp -r ./conf /usr/local/src/mersher-g
  ```

  Change **service name** in microservice.yaml from hellemesher to **mersher-consumer**. Change the listening service address in chassis.yaml from 127.0.0.1 to **intranet ip**（Viewed by cmd ifconfig in linux, such as 192.168.88.64）:

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40101
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30101
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30102
  ```

- 3 Create mersher-a and mersher-b services.

  ```bash
  mkdir /usr/local/src/mersher-a
  cp ./mesher /usr/local/src/mersher-a
  cp -r ./conf /usr/local/src/mersher-a
  mkdir /usr/local/src/mersher-b
  cp ./mesher /usr/local/src/mersher-b
  cp -r ./conf /usr/local/src/mersher-b
  ```

  Change the **service name** in **microservice.yaml** from hellemesher to **mersher-provider** for both mersher-a and mersher-b<br>
  Change the listening address and port set in the **mersher-a** configuration file **chassis.yaml**:

  ```bash
  listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40107
  listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30111
  listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30112
  ```

  Change the listening address and port set in the **mersher-b** configuration file **chassis.yaml**:

  ```bash
    listenAddress: 127.0.0.1:40101  -----》  listenAddress: 192.168.88.64:40102
    listenAddress: 127.0.0.1:30101  -----》  listenAddress: 192.168.88.64:30108
    listenAddress: 127.0.0.1:30102  -----》  listenAddress: 192.168.88.64:30109
  ```

- 4 Start running mersher-g, mersher-a and mersher-b respectively by cmd.

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

- 5 Use **httpserver** to provide http service. Use **httpserver-gateway** as the client to execute http request to **httpserver**.

  ```bash
  go build httpserver.go
  ./httpserver.go
  go build httpservergateway.go
  ./httpservergateway
  ```

- 6 Run **http_server.py** program. You need to install python2.7 and this service relies on BaseHTTPServer package.

- 7 Use webapp as a user interface which is in [**Bmi-example**](/docs/quick-start.md/). Edit http address of the ajax call from /calculator/bmi?height= to []()<http://192.168.88.64:4538/bmi?height=> in static page webapp/src/main/resources/static/index.html. This address is the listening address of the httpservergateway.

## Start testing

- 1 Open url <http://192.168.88.64:30103> in browser. (If you can't open it, you need to open the front service of the service-center. Referring <http://servicecomb.apache.org/users/setup-environment/#%E8%BF%90%E8%A1%8Cservice-center>). You can see services information in web. The name 'gateway' represents the webapp service introduced above which is the service name configured in microservice.yaml. SERVICECENTER represents the servicecenter.

  ![Service-center-monitoring](/assets/images/mersher/mersher-servercenter.png)

- 2 Open <http://192.168.88.64:8889> in browser and you can see the following interface.

  ![mersher-bmi-test](/assets/images/mersher/mersher-testinit.png)

- 3 Enter the parameters (180, 70) and click submit to observe change of the BMI Instance ID.

  ![mersher-testhttp](/assets/images/mersher/mersher-testgohttp.png)<br>

  ![mersher-testhttp](/assets/images/mersher/mersher-testpythonhttp.png)

# What's next

- Read [**mersher** quick start advance](/docs/mersher-quick-start-advance.md/)

---
title: "使用Kubernetes对Saga进行压力测试"
lang: cn
ref: loadtest-saga-with-kubernetes
permalink: /cn/docs/loadtest-saga-with-kubernetes
excerpt: "如何使用Kubernetes方便的对Saga进行性能测试"
last_modified_at: 2018-09-11T10:26:28+08:00
author: Zhen Ju
tags: [microservice, servicemesh, saga]
redirect_from:
  - /theme-setup/
---

## 使用Kubernetes对Saga进行压力测试

Apache ServiceComb (incubating) Saga 是一个微服务应用的数据最终一致性解决方案。Saga在try阶段直接提交事务，后续rollback阶段则通过反向的补偿操作来完成。

基于ServiceComb Saga的项目，基本的构架如下：

![overview](https://raw.githubusercontent.com/apache/incubator-servicecomb-saga/master/docs/static_files/pack.png)

在我们的Saga实现中，业务服务引入Omega库，通过Omega将事务相关信息作为事件发送给Alpha server，由Alpha server统一进行协调。Alpha server将事务保存在PostgreSQL中，后台定期进行扫描。当扫描到异常事件时，尝试向事件对应的Omega发送gRPC请求，调用补偿方法。由于在原生业务中加入了Omega，进行了一系列后台操作，因此需要对整个框架进行压力测试，以获取框架的基础性能报告。

在Cloud Native时代，容器几乎是标准的部署形态，应用程序容器化之后，通过Kubernetes进行容器编排，可以轻松的实现弹性扩容、任务调度等，非常适合对该项目进行压力测试。有鉴于此，我们将demo项目构建成docker镜像，并部署到Kubernetes集群中，通过Kubernetes的一系列组件，对demo方便的进行压力测试，以对Saga项目的性能有一个初步的评估。





### "Kubernetize"服务

我们的demo项目由Java编写、maven作为依赖管理工具，在项目中引入了fabric8插件，编译程序时可以顺便将jar包构建成docker镜像。首先，我们构建alpha-server镜像：

```bash
$ cd alpha/alpha-server
$ mvn clean install -Pdocker
```

然后进入demo项目路径`saga-demo/saga-spring-demo`，执行相同的maven构建命令，构建完成后，我们可以看到产生了4个相关镜像：

```bash
$ docker images | grep SNAPHOST  # {version}-SNAPSHOT是构建过程中使用的镜像标签
alpha-server:0.3.0-SNAPSHOT
booking:0.3.0-SNAPSHOT
car:0.3.0-SNAPSHOT
hotel:0.3.0-SNAPSHOT
```

至此，我们已经构建好所需镜像，下一步便是编写Kubernetes所需的资源文件，这一步我们不再赘述，项目中已经有写好的yaml文件，路径在`saga-demo/saga-k8s-resources`，目录结构如下：

```base
.
├── base
│   ├── alpha.yaml
│   ├── jmeter-collector.yaml
│   └── postgresql.yaml
├── README.md
└── spring-demo
    ├── booking.yaml
    ├── car.yaml
    ├── hotel.yaml
    └── test
        ├── jmeter.configmap.yaml
        └── jmeter.yaml
```

其中`base`目录包含了alpha-server，postgresql以及用于收集测试报告的jmeter-collector3个服务。`spring-demo`目录包含了demo项目的所有服务，`spring-demo/test`路径下包含了对demo测试所需的服务。



我们通过最基础的deployment和service对项目进行部署，程序之间通过域名互相访问，通过`kubectl`命令对Kubernetes资源进行部署：

```bash
$ kubectl create ns servicecomb # 默认所有服务都在servicecomb namespace下
$ kubectl apply -f ./base
$ kubectl apply -f ./spring-demo
```

我们通过`kubectl exec`命令进入一个pod，通过curl命令测试booking程序：

```bash
$ kubectl exec -it -n servicecomb alpha-server-xxxxx
$ curl http://booking.servicecomb:8083/booking/test/2/2
resp: OK
```

至此，我们的demo项目就已经运行起来了。



### 部署JMeter

我们选用[JMeter](https://jmeter.apache.org/)作为压测工具，[Docker Hub](https://hub.docker.com/)上已有公共镜像[justb4/jmeter](https://hub.docker.com/r/justb4/jmeter/)，该镜像比较成熟，启动前会先侦测系统中可用内存，按照一定比例为jmeter申请jvm内存，可以最大化、合理的利用系统资源。

当我们部署JMeter时，为了保持测试的灵活性，一般需要将JMeter脚本单独存储，而JMeter程序可以通过某种方式获取测试脚本，进而保证测试配置可以单独修改，不需要重新构建JMeter镜像。在Kubernetes中，我们可以将JMeter的配置文件存放于[ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)，并通过[VolumeMount](https://kubernetes.io/docs/concepts/storage/volumes/)挂载到JMeter容器的指定目录，这样，当我们需要修改测试配置时，只需修改ConfigMap，并重新部署JMeter deployment，即可完成配置的更新。

部署ConfigMap命令如下：

```bash
$ kubectl apply -f spring-demo/test/jmeter.configmap.yaml
```



### JMeter 镜像改造

由于原有的JMeter容器执行完测试之后就退出了，如果在单机环境、仅运行docker容器的环境下，我们可以在执行`docker run`命令时通过-v参数将宿主机目录挂载到容器中，以保存测试的结果。但是Kubernetes环境，每个pod部署时都是根据一定的算法分配到不同节点上的，节点即是容器的宿主机。但是，登录到节点并找到相应目录来查看结果似乎是非常“不体面”的姿势，因此需要构建一个服务，收集JMeter生成的报告，并能够方便的展示。为此，我们用go语言实现了一个简单的文件上传服务，并附带静态文件服务。该服务收到JMeter测试报告达成的tgz压缩包，将其解压到相应静态文件服务目录中，这样，我们就可以方便的在集群中查看测试结果。该服务就是上文提到的jmeter-collector服务。

这样一来，我们还需要对JMeter服务进行一些小改造，当执行完JMeter测试后，我们通过一个脚本将测试结果目录打包上传到jmeter-collector服务。这些改造都已经完成并做好了相应的镜像，直接使用项目中的资源即可：

```bash
$ kubectl apply -f spring-demo/test/jmeter.yaml
```

现在，我们已经配置好JMeter相关资源，执行`kubectl logs`检查JMeter运行状况：

```bash
$ kubectl get pod -n servicecomb | grep spring-demo-jmeter
spring-demo-jmeter-xxxxx
$ kubectl logs -f -n servicecomb pring-demo-jmeter-xxxxx
...
summary +    420 in 00:00:22 =   18.8/s Avg:   214 Min:   111 Max:   471 Err:   207 (49.29%) Active: 12 Started: 12 Finished: 0
```

可以看到JMeter已经开始逐步增加测试线程进行压测了。

由于我们用deployment部署JMeter，当执行结束后，容器正常退出，Kubernetes会重新启动容器，将测试服务再次拉起。因此测试会持续进行，直到我们将deployment删除。

至此，我们已经完成了demo和相应的压力测试服务，整个集群中相关资源的结构如下图所示：

![demo-and-test-arch](https://github.com/crystaldust/incubator-servicecomb-website/raw/blogs/loadtest-saga-with-k8s/assets/images/spring-demo.jpg)

JMeter服务通过ConfigMap读取测试脚本，然后对booking服务发起压力测试，测试结束后，将结果上传至jmeter-collector服务。



### 查看测试结果

JMeter容器运行完成后，在容器内生成了测试结果文件，并调用upload脚本打包上传到jmeter-collector服务，可以通过该服务直接在页面上查看结果。在Kubernetes中，在集群外部访问服务有两种方式：LoadBalancer或NodePort，前者一般由提供Kubernetes集群服务的云服务厂商提供，后者则可以通过节点的IP和端口来访问某个服务。由于我们使用了本地部署的Kubernetes集群，因此我们使用NodePort来查看访问结果。

首先，调用`kubectl edit`命令，编辑jmeter-collector服务：

```bash
$ kubectl edit svc -n servicecomb jmeter-collector
# in the editor:
spec:
  type: NodePort ## 插入此行，注意yaml文件空格缩进
  exteranlIPs: ["192.168.43.70"] ## 插入此行，根据Kubernetes集群中节点IP来设置
  ports:
  - port: 80
  targetPort: 8883
  #....
```

在笔者的环境中，制定了IP为192.168.43.70的节点作为NodePort的IP，对外暴露80端口，因此，在浏览器中直接访问`http://192.168.43.70`即可查看测试报告的结果了，结果如下图所示：

![jmeter-collector-dashboard](https://github.com/crystaldust/incubator-servicecomb-website/raw/blogs/loadtest-saga-with-k8s/assets/images/jmeter-collector.png)




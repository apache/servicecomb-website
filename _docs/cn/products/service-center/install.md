---
title: "ServiceCenter 安装"
lang: cn
ref: install
permalink: /cn/docs/products/service-center/install/
excerpt: "了解如何运行ServiceComb的服务中心"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## 服务中心 ServiceCenter
ServiceCenter是一个服务注册中心。 服务提供者可以将自身的实例信息注册到 ServiceCenter，以供服务消费者发现并使用它。 
 
## 版本发布包启动
1. 下载 [最新版本的Service-Center](/cn/release/service-center-downloads/)  
   此处使用了 apache-servicecomb-service-center-1.3.0-linux-amd64.tar.gz 包做介绍，实际操作时请根据系统环境从下载页面选取最新版本 
2. 启动服务
   ```bash
   # 解压tar包
   $ tar -zxvf  apache-servicecomb-service-center-1.3.0-linux-amd64.tar.gz
   
   # 启动servicecenter服务
   $ cd apache-servicecomb-service-center-1.3.0-linux-amd64/
   $ ./start-service-center.sh
   ```
3. 查看服务状态
   ```bash
   # 查看进程状态
   $ ps -ef | grep service-center
   root     27048     1  2 14:38 pts/2    00:00:00 ./service-center
   root     27164 22742  0 14:38 pts/2    00:00:00 grep --color=auto service-center
   
   # 查看端口监听
   $ netstat -apn | grep :30100
   tcp        0      0 127.0.0.1:30100         0.0.0.0:*               LISTEN      27048/service-cente
   
   # curl命令调用接口
   $ curl http://127.0.0.1:30100
   {"_links":{"pb:latest-pact-versions":{"href":"http://127.0.0.1:30100/pacts/latest","title":"Latest pact versions"},"pb:latest-provider-pacts":{"href":"http://127.0.0.1:30100/pacts/provider/{provider}/latest","title":"Latest pacts by provider","templated":true},"pb:latest-provider-pacts-with-tag":{"href":"http://127.0.0.1:30100/pacts/provider/{provider}/latest/{tag}","title":"Latest pacts by provider with a specified tag","templated":true},"pb:pacticipants":{"href":"http://127.0.0.1:30100/participants","title":"Pacticipants"},"pb:publish-pact":{"href":"http://127.0.0.1:30100/pacts/provider/{provider}/consumer/{consumer}/version/{consumerApplicationVersion}","title":"Publish a pact","templated":true},"pb:webhooks":{"href":"http://127.0.0.1:30100/webhooks","title":"Webhooks"},"self":{"href":"http://127.0.0.1:30100/","title":"Index"}},"curies":[{"href":"http://127.0.0.1:30100/doc/{rel}","name":"pb"}]}
   
   # 返回如上json串即为启动成功
   ```
4. 启动前端页面并查看状态
   ```bash
   $ ./start-frontend.sh
   $ ps -ef | grep frontend 
   root      1875 32096  0 17:43 pts/6    00:00:00 grep --color=auto frontend
   root      3020     1  0 Nov05 ?        00:00:23 ./frontend
   
   # 查看端口监听
   $ netstat -apn | grep :30103
   tcp        0      0 127.0.0.1:30103     0.0.0.0:*               LISTEN      3020/frontend
   ```
5. 浏览器访问前端页面 http://127.0.0.1:30103，查看服务中心实例（出现以下页面即为成功）  
   ![1](/assets/images/docs/service-center/service-center.jpg)  
   **_注：_**
   - 若 frontend 服务不是本地启动，则无法通过 http://127.0.0.1:30103 访问；需要修改配置文件中"frontend_host_ip"为主机IP，并使用 http://{ip}:30103 的形式进行访问
   - 若 Service-Center 需要对外提供服务，需要修改"httpaddr"，外部应用使用 http://{ip}:30100 进行访问  
   如图：  
   ![1](/assets/images/docs/service-center/config-host-ip.jpg)
   
## Docker镜像启动
1. 下载并运行镜像
   ```bash
   # 下载镜像
   $ docker pull servicecomb/service-center
   # 启动容器
   $ docker run -d -p 30100:30100 servicecomb/service-center
   ```
2. 查看镜像状态和监听端口
   ```bash
   # 查看端口监听
   $ docker ps | grep service-center
   0733021cd96d        servicecomb/service-center        "/opt/service-cent..."   3 minutes ago       Up 3 minutes        0.0.0.0:30100->30100/tcp        gallant_varahamihira 
   ```

## Kubernetes 部署  
1. 配置部署脚本  
   ```bash
   
   $ cat <<EOF >> ./service-center.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: servicecenter
     namespace: svccomb-system
     labels:
       app: servicecenter
   spec:
     ports:
     - port: 30100
       name: http
     selector:
       app: servicecenter
   ---
   apiVersion: extensions/v1beta1
   kind: Deployment
   metadata:
     name: servicecenter
     namespace: svccomb-system
   spec:
     replicas: 1
     template:
       metadata:
         labels:
           app: servicecenter
           version: v1
       spec:
         containers:
         - name: servicecenter
           image: servicecomb/service-center:latest
           imagePullPolicy: IfNotPresent
           ports:
           - containerPort: 30100 
   EOF
   ```
2. Kubernetes中部署
   ```bash
   # 创建 namespace "svccomb-system"
   $ kubectl create namespace svccomb-system
   
   # 部署 service-center
   $ kubectl apply -f service-center.yaml
   ```
3. 查看Pod状态和service端口
   ```bash
   # 查看 pod 启动状态
   $ kubectl -n svccomb-system get pod
   NAME                             READY   STATUS    RESTARTS   AGE
   servicecenter-7d964b7644-h6f4s   1/1     Running   0          72s
   
   # 获取 service 监听
   $ kubectl -n svccomb-system get service
   NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)     AGE
   servicecenter   ClusterIP   10.104.241.163   <none>        30100/TCP   118s
   
   $ curl http://10.104.241.163:30100
   ...
   ```

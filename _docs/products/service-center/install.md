---
title: "Install of ServiceCenter"
lang: en
ref: install
permalink: /docs/products/service-center/install/
excerpt: "Learn how to run ServiceComb's service center"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## Service-Center
ServiceCenter is a service registry. The service provider can register its own instance information to the ServiceCenter for the service consumer to discover and use.  

## Run with release package
1. Download [the latest release package of Service-Center](/release/service-center-downloads/)  
   This example uses  apache-servicecomb-service-center-2.1.0-linux-amd64.tar.gz  
2. Start service-center
   ```bash
   # Decompression the package
   $ tar -zxvf  apache-servicecomb-service-center-2.1.0-linux-amd64.tar.gz
   
   # Start the service of servicecenter
   $ cd apache-servicecomb-service-center-2.1.0-linux-amd64/
   $ ./start-service-center.sh
   ```
3. View service status
   ```bash
   # View process status
   $ ps -ef | grep service-center
   root     27048     1  2 14:38 pts/2    00:00:00 ./service-center
   root     27164 22742  0 14:38 pts/2    00:00:00 grep --color=auto service-center
   
   # View the listening port
   $ netstat -apn | grep :30100
   tcp        0      0 127.0.0.1:30100         0.0.0.0:*               LISTEN      27048/service-cente
   
   # Call the interface with the curl command
   $ curl http://127.0.0.1:30100
   {"_links":{"pb:latest-pact-versions":{"href":"http://127.0.0.1:30100/pacts/latest","title":"Latest pact versions"},"pb:latest-provider-pacts":{"href":"http://127.0.0.1:30100/pacts/provider/{provider}/latest","title":"Latest pacts by provider","templated":true},"pb:latest-provider-pacts-with-tag":{"href":"http://127.0.0.1:30100/pacts/provider/{provider}/latest/{tag}","title":"Latest pacts by provider with a specified tag","templated":true},"pb:pacticipants":{"href":"http://127.0.0.1:30100/participants","title":"Pacticipants"},"pb:publish-pact":{"href":"http://127.0.0.1:30100/pacts/provider/{provider}/consumer/{consumer}/version/{consumerApplicationVersion}","title":"Publish a pact","templated":true},"pb:webhooks":{"href":"http://127.0.0.1:30100/webhooks","title":"Webhooks"},"self":{"href":"http://127.0.0.1:30100/","title":"Index"}},"curies":[{"href":"http://127.0.0.1:30100/doc/{rel}","name":"pb"}]}
   
   # If the above content is returned, the startup was successful.
   ```
4. Start the website of frontend and view the status
   ```bash
   $ ./start-frontend.sh
   $ ps -ef | grep frontend   
   root      1875 32096  0 17:43 pts/6    00:00:00 grep --color=auto frontend
   root      3020     1  0 Nov05 ?        00:00:23 ./frontend
   
   # View the listening port
   $ netstat -apn | grep :30103
   tcp        0      0 127.0.0.1:30103     0.0.0.0:*               LISTEN      3020/frontend
   ```
5. Open the website page "http://127.0.0.1:30103" with a browser, and view instances of the service center in website.（The result is success if like this）  
   ![1](/assets/images/docs/service-center/service-center.jpg)  
   **_Warning_**
   - If the frontend service is started not locally, it cannot be accessed through http://127.0.0.1:30103; you need to modify the "frontend_host_ip" in the configuration file as the host IP ，and open the website to accessed http://{ip}:30103
   - If Service-Center needs to provide external services, you need to modify "httpaddr", and external applications use http://{ip}:30100 for access. 
   Like this：  
   ![1](/assets/images/docs/service-center/config-host-ip.jpg)
   
## Run with docker
1. Download and run docker image
   ```bash
   # Download the docker image
   $ docker pull servicecomb/service-center
   # Start docker container
   $ docker run -d -p 30100:30100 servicecomb/service-center
   ```
2. View container status and listening port
   ```bash
   $ docker ps | grep service-center
   0733021cd96d        servicecomb/service-center        "/opt/service-cent..."   3 minutes ago       Up 3 minutes        0.0.0.0:30100->30100/tcp        gallant_varahamihira 
   ```

## Deployment with Kubernetes  
1. Configuring the deployment of kubernetes  
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
2. Deployment
   ```bash
   # create namespace "svccomb-system"
   $ kubectl create namespace svccomb-system
   
   # deploy service-center
   $ kubectl apply -f service-center.yaml
   ```
3. View Pod status and Service port
   ```bash
   # View Pod status
   $ kubectl -n svccomb-system get pod
   NAME                             READY   STATUS    RESTARTS   AGE
   servicecenter-7d964b7644-h6f4s   1/1     Running   0          72s
   
   # View the the listening port of service
   $ kubectl -n svccomb-system get service
   NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)     AGE
   servicecenter   ClusterIP   10.104.241.163   <none>        30100/TCP   118s
   
   $ curl http://10.104.241.163:30100
   ...
   ```

---
title: "One-click Deployment at Kubernetes"    
lang: en    
ref: company-on-kubernetes    
permalink: /docs/company-on-kubernetes/   
excerpt: "This blog will introduce how to deploy company based on ServiceComb in the kubernetes cluster, and intercom communication of company"   
author: Zen Lin   
redirect_from:   
  - /theme-setup/   
---
    
Blog [Linux Con Workshop Demo]({{ site.url }}{{ site.baseurl }}/_posts/cn/2017-06-15-linuxcon-workshop-demo.md) describes how to use the ServiceComb rapid development company example, the typical enterprise application company example for fast micro-serviced.
     
Now, [github] (https://github.com/ServiceComb/ServiceComb-Company-WorkShop.git) already provides a one-click deployment on the kubernetes cluster. This article is going to focus on the corresponding yaml file and service communication, which will be useful for developers develop and deploy micro-serviced application to the cloud based on the Company model.    
    

## One-click Deployment

[Run Company on Kubernetes Cluster](https://github.com/ServiceComb/ServiceComb-Company-WorkShop/blob/master/kubernetes/README.md) Provides a detailed user guide, company can be deployed in the kubernetes cluster easily thourgh the following three instructions,

```shell
git clone https://github.com/ServiceComb/ServiceComb-Company-WorkShop.git

cd ServiceComb-Company-WorkShop/kubernetes/

bash start.sh
```

## Yaml File Interpretation
   
Take the author's actual environment as an example:
    
```shell
root@zenlin:~/src/LinuxCon-Beijing-WorkShop/kubernetes# kubectl get pod -owide
NAME                                      READY     STATUS    RESTARTS   AGE       IP            NODE
company-beekeeper-3737555734-48sxf        1/1       Running   0          17s       10.244.2.49   zenlinnode2
company-bulletin-board-4113647782-th91w   1/1       Running   0          17s       10.244.1.53   zenlinnode1
company-doorman-3391375245-g0p8c          1/1       Running   0          17s       10.244.1.55   zenlinnode1
company-manager-454733969-0c1g8           1/1       Running   0          16s       10.244.2.50   zenlinnode2
company-worker-1085546725-x7zl4           1/1       Running   0          17s       10.244.1.54   zenlinnode1
zipkin-508217170-0khr3                    1/1       Running   0          17s       10.244.2.48   zenlinnode2
```      
Total of six pods, company manager, company-doorman, company-bulletin-board, company-worker, company-beekeeper, and zipkin, K8S cluster assigns the corresponding cluster IP to them.
     
```bash
root@zenlin:~/src/LinuxCon-Beijing-WorkShop/kubernetes# kubectl get svc -owide
NAME                     CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE       SELECTOR
company-bulletin-board   10.99.70.46     <none>        30100/TCP        12m       io.kompose.service=company-bulletin-board
company-manager          10.100.61.227   <nodes>       8083:30301/TCP   12m       io.kompose.service=company-manager
zipkin                   10.104.92.198   <none>        9411/TCP         12m       io.kompose.service=zipkin
```
     
Only three services are started, zipkin, bulletin-board, and  company-manager, that is because the address of call chain and the bulletin-board need to be passed in the cluster to be called by other services, and the manager is the api gateway nedd to be visited outside the cluster.
      
Read company-bulletin-board-service.yaml,
     
```yaml
    apiVersion: v1
    kind: Service
    metadata:
      creationTimestamp: null
      labels:
    	io.kompose.service: company-bulletin-board
      name: company-bulletin-board
    spec:
      ports:
    - name: "30100"
      port: 30100
      targetPort: 30100
        selector:
      io.kompose.service: company-bulletin-board
      status:
        loadBalancer: {}
```     
The file defines the service of bulletin-board, and defines the name, port, and targetPort for the service, which is created by 'kubectl expose' to keep DNS capability in the cluster. Thus, other services can access the bulletin board and registry themselves.

To the label and selector, it is useful to the situation of one-service to multiple-pods，When a pod dies, it is automatically removed from the endpoints, and new pods matching the Service’s selector will automatically get added to the endpoints.     
     
Read company-worker-deployment.yaml,    
```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
	io.kompose.service: company-worker
  name: company-worker
spec:
  replicas: 1
  strategy: {}
  template:
	metadata:
  	creationTimestamp: null
  	labels:
    	io.kompose.service: company-worker
spec:
  containers:
  - env:
    - name: ARTIFACT_ID
      value: worker
    - name: JAVA_OPTS
      value: -Dcse.service.registry.address=http://company-bulletin-board:30100 -Dservicecomb.tracing.collector.adress=http://zipkin:9411
    image: servicecomb/worker:0.0.1-SNAPSHOT
    name: company-worker
    ports:
    - containerPort: 7070
    - containerPort: 8080
    resources: {}
  restartPolicy: Always
status: {}
```
The yaml defines a pod with one replica (replicas: 1), which can be modified to control the number of replicas of the pod(Anyway, the flexibility of the K8S scalability to achieve on-demand dynamic horizontal expansion to reach the purpose, material of K8S scalability will be provided later in the website). We mentioned that the company-bulletin-board is a DNS name, it is used as the value of cse.service.registry.address and passed to the service within the pod, such as: -Dcse.service. Registry.address = http: // company-bulletin-board: 30100, [kube-dns] (https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/README.md) Automatically resolve the servicename.
     
Read [connect-applications-service](https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/) to understanding the communication of services in K8S cluster.

Other deployment.yaml and service.yaml are similar to the above except manager service, nodePort is defined in the company-manager-service.yaml to provide External-IP and Service-Port, as follows,     
```yaml
spec:
  ports:
  - name: "8083"
  	port: 8083
  	targetPort: 8080
  	nodePort: 30301
  	protocol: TCP
  type: NodePort
```

Get the External-IP and Service-Port by commands,

```shell
kubectl get svc company-manager -o yaml | grep ExternalIP -C 1
kubectl get svc company-manager -o yaml | grep nodePort -C 1
```

Now, you can use the External-IP and nodePort to visit company, Read [github.com/ServiceComb/ServiceComb-Company-WorkShop/kubernetes](https://github.com/ServiceComb/ServiceComb-Company-WorkShop/blob/master/kubernetes/README.md) to get details about how to visit it inside or outside the cluster.
      
## Model induction
   
You can sort out the following model by reading all the deployment.yaml and service.yaml in detail, 

![kubernetes-company]({{ site.url }}{{ site.baseurl }}/assets/images/kubernetes-company.png){: .align-center}
    
In addition, the classic air ticketing system 'Acmeair' has also been supported [one-click-deployment-at-kubernetes](https://github.com/WillemJiang/acmeair/tree/master/kubernetes) based on the version developed by the ServiceComb framework.

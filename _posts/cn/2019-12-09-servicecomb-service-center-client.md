---
lang: cn
title: "使用ServiceComb客户端轻松调用ServiceCenter"
ref: servicecomb-service-center-client
permalink: /cn/docs/servicecomb-service-center-client/
excerpt: "使用ServiceComb客户端轻松调用ServiceCenter"
last_modified_at: 2019-12-09T14:00:30+08:00
author: Zhou Zhongyuan
tags: [ServiceCenter,Client]
redirect_from:
  - /theme-setup/
---

## 1. 问题/背景
在微服务架构中，服务注册中心是必不可少的组件，提供服务注册与管理的能力。目前使用ServiceComb服用中心的java微服务开发者，不仅需要写微服务业务代码，还要写客户端代码去调用ServiceCenter的openAPI。开发者首先需要熟悉ServiceCenter的openAPI文档，然后代码实现http客户端用于发起请求和接收响应，并绑定ServiceCenter配置参数，最后代码实现对服务中心API的调用，才能使用上ServiceCenter。为了简单化开发者使用ServiceCenter，ServiceCenter客户端实现了上述步骤。开发者只需要添加客户端jar包调用API就能轻松使用ServiceCenter，不需要过多关注openAPI文档、不需要写http客户端层代码。使用ServiceComb客户端，开发者可以轻松调用ServiceCenter，更专注于写微服务业务代码。  
了解更多ServiceComb-Service-Center：[https://docs.servicecomb.io/service-center/zh_CN/index.html](https://docs.servicecomb.io/service-center/zh_CN/index.html)  
了解更多ServiceCenter客户端：[https://github.com/apache/servicecomb-java-chassis/tree/master/clients/service-center-client](https://github.com/apache/servicecomb-java-chassis/tree/master/clients/service-center-client)  
![service-center-client-design]({{ site.url }}{{ site.baseurl }}/assets/images/client/sc-client.jpg)  

## 2. 客户端原理及关键代码解读
2.1  基于httpClient设计ServiceCenter客户端  
  - 客户端发起请求和接收响应。客户端选择httpclient作为底层组件，用于实际发起请求和接收响应，并对请求和响应类进行了封装。代码中get方法对应发起GET请求，调用doRequest方法首先添加服务注册中心信息到封装过的httpRequest请求头部，再基于httpclient组件发起实际的http请求，最后将请求响应结果转化为封装过的httpResponse对象返回。
    
    ```java 
    //make GET request
    @Override
    public HttpResponse get(HttpRequest request) throws IOException {
        request.setMethod(HttpRequest.GET);
        return doRequest(request);
    }
    ......
   
    //make http request with httpClient component
    public HttpResponse doRequest(HttpRequest httpRequest) throws IOException {
        //add cse-serviceregistry-client header to identify client
        httpRequest.addHeader(HEADER_CONTENT_TYPE, "application/json");
        httpRequest.addHeader(HEADER_USER_AGENT, "cse-serviceregistry-client/1.0.0");
        
        if (globalHeaders != null) {
        globalHeaders.forEach(httpRequest::addHeader);
        }
        
        //make http request
        org.apache.http.HttpResponse response = httpClient.execute(httpRequest.getRealRequest());
        
        int statusCode = response.getStatusLine().getStatusCode();
        String messgae = response.getStatusLine().getReasonPhrase();
        String context = EntityUtils.toString(response.getEntity(), "UTF-8");
        
        return new HttpResponse(statusCode, messgae, context);
    }
    ```
  
  - 客户端支持定制化服务中心配置参数。代码中看到，客户端支持开发者定制服务中心IP，端口，项目名称，租户名称，导入TLSConfig和新增请求头，并通过客户端的Builder方法注入配置。TLSConfig为客户端TLS认证配置类，给客户端导入TLS证书配置，即可开启客户端双向认证模式。  
    
    ```java  
      /**
       * Customized host, port, projectName, tenantName, TLSConf, headers and any one parameter can be null.
       */
      public ServiceCenterClient(String host, int port, String projectName, String tenantName, TLSConfig tlsConfig,
        Map<String, String> extraGlobalHeaders) {
          HttpTransport httpTransport = HttpTransportFactory.getDefaultHttpTransport();
          if (tlsConfig != null) {
            httpTransport = new TLSHttpsTransport(tlsConfig);
          }
          httpTransport.addHeaders(extraGlobalHeaders);
          
          //set configuration parameters
          this.httpClient = new ServiceCenterRawClient.Builder()
              .setHost(host)
              .setPort(port)
              .setProjectName(projectName)
              .setTenantName(tenantName)
              .setHttpTransport(httpTransport).build();
      }
    ```
    
2.2  ServiceCenter客户端核心API
- 服务注册与发现，注册服务和实例到服务注册中心，根据服务ID发现服务实例。registerMicroserviceInstance方法用于注册服务实例，发起httpPOST请求访问服务实例注册URL，并将实例注入到请求body中，返回服务ID字符串; getMicroserviceInstanceList方法用于发现服务的所有实例，根据服务ID，发起httpGET请求访问服务发现URL，返回MicroserviceInstancesResponse对象。
    ```java
    //service register
    public String registerMicroserviceInstance(MicroserviceInstance instance, String serviceId) {
        try {
          ObjectMapper mapper = new ObjectMapper();
          mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, true);
          HttpResponse response = httpClient.postHttpRequest("/registry/microservices/" + serviceId + "/instances", null,
              mapper.writeValueAsString(instance));
          if (response.getStatusCode() == HttpStatus.SC_OK) {
            return response.getContent();
          } else {
            throw new OperationException(
                "register service instance fails, statusCode = " + response.getStatusCode() + "; message = " + response
                    .getMessage()
                    + "; content = " + response.getContent());
          }
        } catch (IOException e) {
          throw new OperationException(
              "register service instance fails", e);
        }
    }
 	  
    //service discovery
    public MicroserviceInstancesResponse getMicroserviceInstanceList(String serviceId) {
        try {
          HttpResponse response = httpClient
              .getHttpRequest("/registry/microservices/" + serviceId + "/instances", null, null);
          if (response.getStatusCode() == HttpStatus.SC_OK) {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(response.getContent(), MicroserviceInstancesResponse.class);
          } else {
            throw new OperationException(
                "get service instances list fails, statusCode = " + response.getStatusCode() + "; message = " + response
                    .getMessage()
                    + "; content = " + response.getContent());
          }
        } catch (IOException e) {
          throw new OperationException(
              "get service instances list fails", e);
        }
    }      
    ```
- 心跳，服务实例发送心跳告知服务中心。代码中发起httpPUT请求中访问心跳URL，并导入HeartbeatsRequest （包含服务ID和实例ID）到请求body中，响应状态码为200表示心跳成功。
    ```java 
    //heartBeats
    public void sendHeartBeats(HeartbeatsRequest heartbeatsRequest) {
      try {
        ObjectMapper mapper = new ObjectMapper();
        HttpResponse response = httpClient
            .putHttpRequest("/registry/heartbeats", null, mapper.writeValueAsString(heartbeatsRequest));
  
        if (response.getStatusCode() == HttpStatus.SC_OK) {
          LOGGER.info("HEARTBEATS SUCCESS");
        } else {
          throw new OperationException(
              "heartbeats fails, statusCode = " + response.getStatusCode() + "; message = " + response.getMessage()
                  + "; content = " + response.getContent());
        }
      } catch (IOException e) {
        throw new OperationException(
            "heartbeats fails ", e);
      }
    }
    ```

2.3 更多客户端API介绍，参考客户端说明文档 [https://github.com/apache/servicecomb-java-chassis/tree/master/clients/service-center-client](https://github.com/apache/servicecomb-java-chassis/tree/master/clients/service-center-client)  

## 3. ServiceCenter客户端实践
3.1 实践准备  
- 启动ServiceComb服务中心：[http://servicecomb.apache.org/cn/docs/service-center/install/](http://servicecomb.apache.org/cn/docs/service-center/install/)  
- 下载演示代码：[https://github.com/zaneChou1/spring-boot-servicecenter](https://github.com/zaneChou1/spring-boot-servicecenter)  

3.2 provider端启动服务，通过客户端注册到ServiceCenter  
运行provider模块，启动helloServer服务，并调用客户端API创建客户端对象、创建helloServer服务和实例对象、注册服务和实例到servicecomb 服务中心，并保持30s一次心跳，代码实现如下。
  ```java
  public static void registerMicroservice(){
     //new ServiceCenterClient object
     ServiceCenterClient sc = new ServiceCenterClient();
     
     //new Microservice object and setting properties and serviceName is necessary
     Microservice microservice = new Microservice();
     microservice.setServiceId("1111");
     microservice.setServiceName("HelloServer");
     //register microservice to service-center
     sc.registerMicroservice(microservice);
     
     //new MicroserviceInstance object and bind server IP and port
     MicroserviceInstance instance = new MicroserviceInstance();
     List<String> endPoints = new ArrayList<String>();
     endPoints.add("rest://127.0.0.1:8080/");
     instance.setEndpoints(endPoints);
     //setting instance hostName, instanceId and hostName is necessary
     instance.setHostName("test");
     instance.setInstanceId("2222");
     //register microservice instance to service-center
     sc.registerMicroserviceInstance(instance,microservice.getServiceId());
     
     //send a heartbeat every 30s
     HeartbeatsRequest heartbeatsRequest = new HeartbeatsRequest("1111","2222");
     while(true){
       sc.sendHeartBeats(heartbeatsRequest);
       try {
         Thread.sleep(30000);
       } catch (InterruptedException e) {
         e.printStackTrace();
       }
     }
  }
  ```
查看service-center的UI显示如下，helloServer服务注册到服务中心成功，且有一个服务实例test。   
![]({{ site.url }}{{ site.baseurl }}/assets/images/client/sc-sample-UI.png)  
访问provider服务监听的8080端口，返回“Hello Spring-Boot-ServiceCenter !”。  
![]({{ site.url }}{{ site.baseurl }}/assets/images/client/sc-sample-provider.png)  

3.3 consumer端通过客户端发现服务实例，发起服务调用  
运行consumer模块，启动consumer服务，调用客户端API新建客户端对象、发现helloServer服务实例、获取服务监听的IP和端口，最后调用provider端helloServer服务返回结果。
```java
//find service instance
ServiceCenterClient sc = new ServiceCenterClient();
MicroserviceInstancesResponse instances = sc.getMicroserviceInstanceList("1111");
//get IP and port that service is listening on
URI endpointURIBuilder = new URIBuilder(instances.getInstances().get(0).getEndpoints().get(0)).build();
int port = endpointURIBuilder.getPort();
String host = endpointURIBuilder.getHost();

//call service
RestTemplate restTemplate = new RestTemplate();
ResponseEntity<String> result = restTemplate.getForEntity("http://"+host+":"+port,String.class);
return result.getBody();
```
访问consumer端监听的8081端口，返回helloServer的响应结果“Hello Spring-Boot-ServiceCenter !”，consumer端通过ServiceComb服务注册中心调用provider端服务成功。    
![]({{ site.url }}{{ site.baseurl }}/assets/images/client/sc-sample-consumer.png)  
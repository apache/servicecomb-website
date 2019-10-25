---
title: "服务契约"
lang: cn
ref: service-contract
permalink: /cn/docs/users/service-contract/
excerpt: "服务契约"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述

服务契约，指基于OpenAPI规范的微服务接口契约，是服务端与消费端对于接口的定义。

## 场景描述

服务契约用于服务端和消费端的解耦，服务端围绕契约进行服务的实现，消费端根据契约进行服务的调用，可支持服务端和消费端采用不同的编程语言实现。

## 显式契约

### 配置说明

ServiceComb使用yaml文件格式定义服务契约，推荐使用[Swagger Editor](http://editor.swagger.io/#/)工具来编写契约，可检查语法格式及自动生成API文档。详细的契约文件格式请参考[OpenAPI官方文档](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)。

契约文件放置在"resources/microservices"或者"resources/applications"目录下，目录结构如下所示。

```txt
resources
  - microservices
    - serviceName #微服务名
      - schemaId.yaml #schema接口的契约
  - applications
    - appId #应用ID
      - serviceName #微服务名
        - schemaId.yaml #schema接口的契约
```

### 示例代码

```yaml
swagger: '2.0'
info:
  title: hello
  version: 1.0.0
  x-java-interface: org.apache.servicecomb.samples.common.schema.Hello
basePath: /springmvchello
produces:
  - application/json

paths:
  /sayhi:
    post:
      operationId: sayHi
      parameters:
        - name: name
          in: query
          required: true
          type: string
      responses:
        200:
          description: 正确返回
          schema:
            type: string
        default:
          description: 默认返回
          schema:
            type: string
  /sayhello:
    post:
      operationId: sayHello
      parameters:
        - name: person
          in: body
          required: true
          schema:
            $ref: "#/definitions/Person"
      responses:
        200:
          description: 正确返回
          schema:
            type: string
        default:
          description: 默认返回
          schema:
            type: string
definitions:
  Person:
    type: "object"
    properties:
      name:
        type: "string"
        description: "person name"
    xml:
      name: "Person"
```

> **注意**：  
- 根据swagger标准，basePath配置的路径需要包括web server的webroot。
- info.x-java-interface需要标明具体的接口路径，根据项目实际情况而定。

## 隐式契约
### 概念阐述

　　隐式契约是指ServiceComb根据服务实现类自动生成的服务契约。

### 场景描述

　　用户通过隐式契约功能，可以不预先定义契约和接口，直接定义实现类，在服务启动时，根据实现类自动生成契约，并注册到服务中心。

### 涉及API

　　隐式契约可用于Spring MVC、JAX-RS、透明RPC三种开发模式，具体使用参见[用SpringMVC开发微服务](/cn/users/develop-with-springmvc/)、[用JAX-RS开发微服务](/cn/users/develop-with-jax-rs/)和[用透明RPC开发微服务](/cn/users/develop-with-transparent-rpc/)。

　　使用透明RPC模式开发微服务时，由于从代码上无法分辨微服务开发人员期望如何定义契约，所以生成的契约全是POST方法，所有method的入参被包装为一个class，作为body参数传递，所以建议使用隐式契约开发provider时，选择SpringMVC或JAX-RS开发模式，可以得到完整的RESTful声明。

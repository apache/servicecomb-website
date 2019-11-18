---
title: "Toolkit 快速入门"
lang: cn
ref: install
permalink: /cn/docs/toolkit/quick-start/
excerpt: "了解如何使用一键式微服务开发工具"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## 一键式微服务开发工具 Toolkit
Apache ServiceComb Toolkit 是基于契约的微服务开发工具套件。提供契约、代码、文档相互转换及校验的能力，帮助用户一键式快速构建基于流行微服务框架和流行编程模型的微服务工程，降低微服务入门成本，使用户聚焦业务开发，提升遗留系统重构、开发效率。  
 
## 3 快速入门
### 3.1 从源码构建工具和插件
构建环境要求:

* [Java 8](http://java.oracle.com)

* [Apache maven 3.5.0 or greater](http://maven.apache.org/)

```shell
# 从github获取toolkit最新源码
$ git clone https://github.com/apache/servicecomb-toolkit.git
$ cd toolkit

# 构建打包
$ mvn clean install
```


### 使用toolkit-maven-plugin插件
#### 1 配置
在maven项目的pom文件中配置
```xml
<plugin>
    <groupId>org.apache.servicecomb.toolkit</groupId>
    <artifactId>toolkit-maven-plugin</artifactId>
    <version>0.2.0-SNAPSHOT</version>
    <configuration>
        <!-- 输入源。设置为 code，表示解析当前代码；设置为 contract，表示解析指定目录的契约文件。不设置则默认为 code -->
        <sourceType>code</sourceType>
        <!-- 生成契约文件的类型，不设置则默认为 yaml -->
        <contractFileType>yaml</contractFileType>
        <!-- 生成文档的类型，不设置则默认为 html -->
        <documentType>html</documentType>
        <!-- 生成契约文件、文档的根目录，不设置则默认为运行命令所在目录下的 target 目录，生成的微服务工程在 project 目录，契约文件在 contract 目录，文档在 document 目录 -->
        <outputDirectory>./target</outputDirectory>
        <!-- 被解析的契约文件路径，在 sourceType 设置为 contract 时有效，且必须设置 -->
        <contractLocation>./contract</contractLocation>
        <!-- 被校验的契约文件目录，在 sourceType 设置为 contract 时有效，且必须设置 -->
        <sourceContractPath>./target/contract</sourceContractPath>
        <!-- 样本契约文件目录，必须设置 -->
        <destinationContractPath>./contract</destinationContractPath>
        <!-- 生成的微服务代码工程配置 -->
        <service>
            <!-- 微服务的类型，可生成 provider/consumer/all，默认值为 all -->
            <serviceType>all</serviceType>
            <!-- 微服务的 groupid，用户可选，默认值为 domain.orgnization.project -->
            <groupId>domain.orgnization.project</groupId>
            <!-- 微服务的 artifactId，用户可选，默认值为 sample -->
            <artifactId>sample</artifactId>
            <!-- 微服务的 artifactVersion，用户可选，默认值为 0.1.0-SNAPSHOT -->
            <artifactVersion>0.1.0-SNAPSHOT</artifactVersion>
            <!-- 微服务的 packageName，用户可选，默认值为 domain.orgnization.project.sample -->
            <packageName>domain.orgnization.project.sample</packageName>
            <!-- 微服务框架，用户可选。设置为 ServiceComb，生成ServiceComb风格的微服务项目；设置为 SpringCloud，生成SpringCloud风格的微服务项目。默认值为 ServiceComb -->
            <microServiceFramework>ServiceComb</microServiceFramework>
            <!-- 服务提供者的服务id。仅包含服务消费者的场景（serviceType=consumer）必须设置该值 -->            
            <providerServiceId>servicecomb-provider</providerServiceId>
            <!-- 服务id，默认值为artifactId的值 -->
            <serviceId>servicecomb-consumer</serviceId>
        </service>
    </configuration>
</plugin>
```

#### 2 命令
```shell
# 生成契约，文档和微服务工程
mvn toolkit:generate

# 校验代码和契约一致性
mvn toolkit:verify
```

#### 2.1 解析代码，生成微服务代码工程、OpenAPI规范契约、文档

配置项(不显式设置 `<configuration>` 则使用默认配置)
例：
```xml
<plugin>
    <groupId>org.apache.servicecomb.toolkit</groupId>
    <artifactId>toolkit-maven-plugin</artifactId>
    <version>0.2.0-SNAPSHOT</version>
    <configuration>
        <!-- 输入源。设置为 code，表示解析当前代码；设置为 contract，表示解析指定目录的契约文件。不设置则默认为 code -->
        <sourceType>code</sourceType>
        <!-- 生成契约文件、文档的根目录，不设置则默认为运行命令所在目录下的 target 目录，生成的微服务工程在 project 目录，契约文件在 contract 目录，文档在 document 目录 -->
        <outputDirectory>./target</outputDirectory>
        <!-- 生成的微服务代码工程配置 -->
        <service>
            <!-- 微服务的类型，可生成 provider/consumer/all，默认值为 all -->
            <serviceType>all</serviceType>
        </service>
    </configuration>
</plugin>
```

运行命令
```shell
mvn toolkit:generate
```

代码生成契约现已支持以下注解(类级别)编写的restful接口
>RestController, RestSchema, RpcSchema, RequestMapping

代码生成契约时,restful接口方法修饰符必须指定为public


#### 2.2 解析契约，生成微服务工程、文档

配置项(不显式设置 `<configuration>` 则使用默认配置)
例：
```xml
<plugin>
    <groupId>org.apache.servicecomb.toolkit</groupId>
    <artifactId>toolkit-maven-plugin</artifactId>
    <version>0.2.0-SNAPSHOT</version>
    <configuration>
        <!-- 输入源。设置为 code，表示解析当前代码；设置为 contract，表示解析指定目录的契约文件。不设置则默认为 code -->
        <sourceType>contract</sourceType>
        <!-- 被解析的契约文件路径，在 sourceType 设置为 contract 时有效，且必须设置 -->
        <contractLocation>./contract</contractLocation>
        <!-- 生成契约文件、文档的根目录，不设置则默认为运行命令所在目录下的 target 目录，生成的微服务工程在 project 目录，契约文件在 contract 目录，文档在 document 目录 -->
        <outputDirectory>./target</outputDirectory>
        <!-- 生成的微服务代码工程配置 -->
        <service>
            <!-- 微服务的类型，可生成 provider/consumer/all，默认值为 all -->
            <serviceType>provider</serviceType>
        </service>
    </configuration>
</plugin>
```

运行命令
```shell
mvn toolkit:generate
```

#### 2.3 代码和契约一致性校验

配置项
例：
```xml
<plugin>
    <groupId>org.apache.servicecomb.toolkit</groupId>
    <artifactId>toolkit-maven-plugin</artifactId>
    <version>0.2.0-SNAPSHOT</version>
    <configuration>
        <!-- 输入源。设置为 code，表示解析当前代码；设置为 contract，表示解析指定目录的契约文件。不设置则默认为 code -->
        <sourceType>code</sourceType>
        <!-- 样本契约文件目录，必须设置 -->
        <destinationContractPath>./contract</destinationContractPath>
    </configuration>
</plugin>
```

运行命令
```shell
mvn toolkit:verify
```


### 3 使用toolkit cli工具
可执行jar包位于toolkit/cli/target/bin目录下
```shell
$ java -jar toolkit-cli-{version}.jar help
```
#### 3.1 契约生成微服务工程
```shell
$ java -jar toolkit-cli-{version}.jar  codegenerate -m ServiceComb -i swagger.yaml -o ./project -p SpringMVC
```
> **codegenerate** 命令选项说明:
* -m, --microservice-framework : 指定微服务框架,现支持ServiceComb  
例：-m ServiceComb
* -p, --programming-model : 指定编程模型，可选JAX-RS，POJO，SpringMVC，SpringBoot  
例：-p SpringMvc
* -i, --input : 指定遵循OpenAPI规范的契约文件，支持yaml和json格式，支持指定本地和网络文件  
例：-i http://petstore.swagger.io/v2/swagger.json
* -o, --output : 生成的项目代码输出路径  
例：-o ./project
* --group-id : 指定生成的项目的group id  
例：--group-id com.demo
* --artifact-id : 指定生成的项目的artifact id     
例：--artifact-id springmvc-example
* --artifact-version : 指定生成的项目的artifact version  
例：--artifact-version 1.0.0
* --api-package : 指定生成项目的api package  
例：--api-package com.demo.api
* --model-package : 指定生成项目的model package   
例：--model-package com.demo.model
* -t, --service-type : 指定生成的微服务项目的微服务类型。可选值为provider,consumer,all                  
例：--service-type provider  

#### 3.2 契约生成文档
```shell
$ java -jar toolkit-cli-{version}.jar docgenerate -i swagger.yaml -o ./document
```
> **docgenerate** 命令选项说明:
* -i, --input : 指定遵循OpenAPI规范的契约文件，支持yaml和json格式，支持指定本地和网络文件  
例：-i http://petstore.swagger.io/v2/swagger.json
* -o, --output : 文档输出路径   
例：-o ./document
* -f, --format : 指定输出文档风格,现支持swagger-ui
例：-f swagger-ui

#### 3.3 契约风格检查

```shell
$ java -jar toolkit-cli-{version}.jar checkstyle oas.yaml
或者
$ java -jar toolkit-cli-{version}.jar cs oas.yaml
```

> **checkstyle** Command argument
* &lt;file&gt; OpenAPI v3 spec yaml文件

见[风格检查规则](/cn/docs/toolkit/oas-validator/#合规性校验)

#### 3.4 契约兼容性检查

```shell
$ java -jar toolkit-cli-{version}.jar checkcompatibility left-oas.yaml right-oas.yaml
或者
$ java -jar toolkit-cli-{version}.jar cc left-oas.yaml right-oas.yaml
```

> **checkcompatibility** Command argument
* &lt;files&gt; Two OpenAPI v3 spec yaml file

见[兼容性检查规则](/cn/docs/toolkit/oas-validator/#兼容性检查)

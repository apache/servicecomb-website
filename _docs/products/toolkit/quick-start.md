---
title: "Toolkit Quick Start"
lang: en
ref: quick-start
permalink: /docs/products/toolkit/quick-start/
excerpt: "Learn how to use toolkit"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## Apache ServiceComb Toolkit
Apache ServiceComb Toolkit is a contract-based microservice development toolkit. Provides the ability to convert and verify contracts, code, and documents, helping users quickly build microservice projects based on popular microservices frameworks and popular programming models, reducing the cost of microservices entry, enabling users to focus on business development, enhance refactoring and development efficiency.  
  
 
## Quick Start
### 1 Build tool and plugins from source

> Build environment requirements
* [Java 8](http://java.oracle.com)
* [Apache maven 3.5.0 or greater](http://maven.apache.org/)

```shell
# Get the latest source code for toolkit from github
$ git clone https://github.com/apache/servicecomb-toolkit.git
$ cd toolkit

# Build package
$ mvn clean install
```

### 2 Use the toolkit-maven-plugin plugin
#### 2.1 configuration
Configured in the pom file of the maven project
```xml
<plugin>
    <groupId>org.apache.servicecomb.toolkit</groupId>
    <artifactId>toolkit-maven-plugin</artifactId>
    <version>0.2.0-SNAPSHOT</version>
    <configuration>
        <!-- Set to 'code' to resolve the current project. Set to 'contract' to resolve the contract file for the specified path.If not set, the default is 'code' -->
        <sourceType>code</sourceType>
        <!-- The type of the contract file is generated. If it is not set, the default is 'yaml' -->
        <contractFileType>yaml</contractFileType>
        <!-- The type of the generated document. If not set, the default is 'html' -->
        <documentType>html</documentType>
        <!-- The root directory to save microservice project,contract file and document. If it is not set, the default is the 'target' under the directory where the command is run -->
        <outputDirectory>./target</outputDirectory>
        <!-- Input contract file path. Valid when sourceType is set to 'contract', must be set -->
        <contractLocation>./contract</contractLocation>
        <!-- Checked contract file path. Valid when sourceType is set to 'contract', must be set -->
        <sourceContractPath>./target/contract</sourceContractPath>
        <!-- Sample contract file path, must be set -->
        <destinationContractPath>./contract</destinationContractPath>
        <!-- Generated microservice project configuration -->
        <service>
            <!-- Microservice type,can generated 'provider/consumer/all',the default is 'all' -->
            <serviceType>all</serviceType>
            <!-- Microservice project 'groupid',optional,the default is 'domain.orgnization.project' -->
            <groupId>domain.orgnization.project</groupId>
            <!-- Microservice project 'artifactId',optional,the default is 'sample' -->
            <artifactId>sample</artifactId>
            <!-- Microservice project 'artifactVersion',optional,the default is '0.1.0-SNAPSHOT' -->
            <artifactVersion>0.1.0-SNAPSHOT</artifactVersion>
            <!-- Microservice project 'packageName',optional,the default is 'domain.orgnization.project.sample' -->
            <packageName>domain.orgnization.project.sample</packageName>
        </service>
    </configuration>
</plugin>
```

#### 2.2 Command
```shell
# Generating contract, document and microservice project
mvn toolkit:generate

# Verify code and contract consistency
mvn toolkit:verify
```

#### 2.2.1 Extract the microservice project, OpenAPI contract file and document from the code

Configuration(use default configuration if not set `<configuration>`)

example
```xml
<plugin>
    <groupId>org.apache.servicecomb.toolkit</groupId>
    <artifactId>toolkit-maven-plugin</artifactId>
    <version>0.2.0-SNAPSHOT</version>
    <configuration>
        <!-- Set to 'code' to resolve the current project. Set to 'contract' to resolve the contract file for the specified path.If not set, the default is 'code' -->
        <sourceType>code</sourceType>
        <!-- The root directory to save contract file and document. If it is not set, the default is the 'target' under the directory where the command is run -->
        <outputDirectory>./target</outputDirectory>
        <!-- Generated microservice project configuration -->
        <service>
            <!-- Microservice type,can generated 'provider/consumer/all',the default is 'all' -->
            <serviceType>all</serviceType>
        </service>
    </configuration>
</plugin>
```

Run in shell
```shell
mvn toolkit:generate
```

When generating contracts from code,support for identifying restful interfaces written by the following annotations (class level)
>RestController, RestSchema, RpcSchema, RequestMapping

When generating contracts from code,the restful interface method access modifier must be specified as public


#### 2.2.2 Generate the microservice project and document from contract

Configuration(use default configuration if not set `<configuration>`)

example
```xml
<plugin>
    <groupId>org.apache.servicecomb.toolkit</groupId>
    <artifactId>toolkit-maven-plugin</artifactId>
    <version>0.2.0-SNAPSHOT</version>
    <configuration>
        <!-- Set to 'code' to resolve the current project. Set to 'contract' to resolve the contract file for the specified path.If not set, the default is 'code' -->
        <sourceType>contract</sourceType>
        <!-- The root directory to save contract file and document. If it is not set, the default is the 'target' under the directory where the command is run -->
        <outputDirectory>./target</outputDirectory>
        <!-- Input contract file path. Valid when sourceType is set to 'contract', must be set -->
        <contractLocation>./contract</contractLocation>
        <!-- Generated microservice project configuration -->
        <service>
            <!-- Microservice type,can generated 'provider/consumer/all',the default is 'all' -->
            <serviceType>provider</serviceType>
        </service>
    </configuration>
</plugin>
```

Run in shell
```shell
mvn toolkit:generate
```

#### 2.2.3 Contract verify

Configuration

example
```xml
<plugin>
    <groupId>org.apache.servicecomb.toolkit</groupId>
    <artifactId>toolkit-maven-plugin</artifactId>
    <version>0.2.0-SNAPSHOT</version>
    <configuration>
        <!-- Set to 'code' to resolve the current project. Set to 'contract' to resolve the contract file for the specified path.If not set, the default is 'code' -->
        <sourceType>code</sourceType>
        <!-- Sample contract file path, must be set -->
        <destinationContractPath>./contract</destinationContractPath>
    </configuration>
</plugin>
```

Run in shell
```shell
mvn toolkit:verify
```


### 3 Use the toolkit cli
The executable jar package is located in the toolkit/cli/target/bin directory
```shell
$ java -jar toolkit-cli-{version}.jar help
```
#### 3.1 Service contract generation microservice project
```shell
$ java -jar toolkit-cli-{version}.jar  codegenerate -m ServiceComb -i swagger.yaml -o ./project -p SpringMVC
```
> **codegenerate** Command option
* -m, --microservice-framework. Specify microservices framework, now supports ServiceComb.  
e.g.：-m ServiceComb
* -p, --programming-model. Specify programming model, optional JAX-RS, POJO, SpringMVC, SpringBoot.  
e.g.：-p SpringMvc
* -i, --input. Specifies contract files that follow the OpenAPI specification, supports yaml and json formats, and supports specifying local and network files.  
e.g.：-i http://petstore.swagger.io/v2/swagger.json
* -o, --output. Generated project code output path.  
e.g.：-o ./project
* --group-id. Specify the group id of the generated project.  
e.g.：--group-id com.demo
* --artifact-id. Specify the artifact id of the generated project.  
e.g.：--artifact-id springmvc-example
* --artifact-version. Specify the artifact version of the generated project.   
e.g.：--artifact-version 1.0.0
* --api-package : Specify the api package of the generated project.   
e.g.：--api-package com.demo.api  
* --model-package : Specify the model package of the generated project.  
e.g.：--model-package com.demo.model
* -t, --service-type : Specify microservice type of generated microservice project. optional value is provider,consumer,all               
e.g.：--service-type provider  

#### 3.2 Service contract generation document
```shell
$ java -jar toolkit-cli-{version}.jar docgenerate -i swagger.yaml -o ./document
```
> **docgenerate** Command option
* -i, --input. Specifies contract files that follow the OpenAPI specification, supports yaml and json formats, and supports specifying local and network files.
e.g：-i http://petstore.swagger.io/v2/swagger.json
* -o, --output. Document output path.
e.g：-o ./document
* -f, --format. Specifies the output document format, now supports swagger-ui
e.g：-f swagger-ui

#### 3.3 Service contract style checking

```shell
$ java -jar toolkit-cli-{version}.jar checkstyle oas.yaml
or
$ java -jar toolkit-cli-{version}.jar cs oas.yaml
```

> **checkstyle** Command argument
* &lt;file&gt; OpenAPI v3 spec yaml file

见[style check rules](/docs/products/toolkit/oas-validator/#style-check-rules)

#### 3.4 Service contract compatibility checking

```shell
$ java -jar toolkit-cli-{version}.jar checkcompatibility left-oas.yaml right-oas.yaml
or
$ java -jar toolkit-cli-{version}.jar cc left-oas.yaml right-oas.yaml
```

> **checkcompatibility** Command argument
* &lt;files&gt; Two OpenAPI v3 spec yaml file

见[compatibilty check rules](/docs/products/toolkit/oas-validator/#compatibility-check-rules)

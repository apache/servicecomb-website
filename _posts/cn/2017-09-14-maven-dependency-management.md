---
title: "使用maven管理复杂依赖关系的技巧"
lang: cn
ref: maven_dependency_management
permalink: /cn/docs/maven_dependency_management/
excerpt: "maven dependency management"
last_modified_at: 2017-09-14T20:33:43+08:00
author: liubao
tags: [maven]
redirect_from:
  - /theme-setup/
---


## 依赖关系管理的核心问题 
依赖关系管理最让人头疼的问题是软件版本的选择。一个简化的例子：开发人员目前需要开发一个X项目，该项目需要同时引用项目A提供的组件，也需要引用项目B的组件，并且项目A和项目B同时依赖了项目C，但是版本号不同。  

* 项目X的pom:

```xml
<dependency>
	<groupId>groupA</groupId>
	<artifactId>artifactA</artifactId>
        <version>0.1.0</version>   
</dependency>
<dependency>
	<groupId>groupB</groupId>
	<artifactId>artifactB</artifactId>
        <version>0.1.0</version>   
</dependency>
```


* 项目A的pom:

```xml
<dependency>
	<groupId>groupC</groupId>
	<artifactId>artifactC</artifactId>
        <version>0.1.0</version>   
</dependency>
```

* 项目B的pom:

```xml
<dependency>
  <groupId>groupC</groupId>
  <artifactId>artifactC</artifactId>
  <version>0.2.0</version>   
</dependency>
```

项目X在最终发布的时候，会出现如下几种情况：

1. 使用项目C的0.1.0版本。由于项目B是使用0.2.0版本编译和测试的，那么组件B可能无法正常工作。比如项目B使用了0.2.0提供的新接口。
2. 使用项目C的0.2.0版本。由于项目A是使用0.1.0版本编译和测试的，那么组件A可能无法正常工作。比如0.2.0版本和0.1.0不兼容，并且项目A恰好使用了这些不兼容的接口。  

可以看出，如果项目A和项目B使用的C组件存在接口不兼容的情况，无论怎么调整，项目X都无法正常工作，这个时候必须修改项目A的代码，使用和B同样的或者兼容的版本进行测试。进行依赖管理，能够做的事情，通常是保证对于公共组件的依赖，都使用较高的版本。尽管如此，我们通常还是会碰到一系列问题，特别是项目依赖关系非常复杂的情况。

## 最佳实践  
很多项目都使用maven提供的dependencyManagement配置来管理依赖关系，保证不会因为引入了新的组件，导致基础组件的版本发生变更，出现漏测试的情况。该机制在Spring boot、ServiceComb等开源项目中广泛采用。对于需要提供额外三方软件使用清单的商用产品，这种管理方式可以增强认证信息的准确性。以ServiceComb为例，该项目引入的所有的三方件的版本都统一在:  
 [https://github.com/apache/incubator-servicecomb-java-chassis/blob/master/java-chassis-dependencies/pom.xml](https://github.com/apache/incubator-servicecomb-java-chassis/blob/master/java-chassis-dependencies/pom.xml)   
管理，其他的子模块都不配置三方件的版本号，从而每个子模块依赖的三方件版本都是同一个版本，即使他们依赖的模块间接依赖了不同的三方件版本。  
这种机制给使用者也带来了一定的好处，使用者可以采用dependencyManagement来定义自己的三方组件依赖关系，定义的时候，通过import方式继承。比如使用ServiceComb的微服务，可以采用如下方式管理依赖关系：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>java-chassis-dependencies</artifactId>
      <version>0.2.0</version>
      <type>pom</type>
      <scope>import</scope>
      </dependency>
    </dependencies>
</dependencyManagement>
```

## 一个复杂的例子  
这个例子是在业务代码中使用Spring Boot、Spring Cloud、ServiceComb开源组件和ServiceComb商用组件的复杂场景。业务使用Spring Boot开发，并且启用了ServiceComb功能。可以通过下面的配置管理依赖关系。通过调整3个组件的顺序，决定优先使用哪些三方件。常见的业务场景有：

* Spring Cloud依赖于Spring Boot，业务发现Spring Boot的bug，并升级了Spring boot，但是Spring Cloud没有配套对应版本的新版本。在Spring Boot接口兼容的情况下，可以将Spring Boot的依赖放到Spring Cloud前面，从而达到独立升级Spring Boot的目的。
* Spring Cloud发现了bug，但是修复该bug的版本同时升级了Spring Boot，业务当前有其他原因不能使用Spring Boot的新版本，这个时候，可以将Spring Boot的依赖放到前面，保证了不会由于升级Spring Cloud，而引入Spring Boot新的版本。

```xml
    <dependencyManagement>
		<dependencies>
		  <dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-dependencies</artifactId>
			<version>1.5.6.RELEASE</version>
			<type>pom</type>
			<scope>import</scope>
		  </dependency>
		  <dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-dependencies</artifactId>
			<version>Dalston.SR2</version>
		        <type>pom</type>
			<scope>import</scope>
		  </dependency>
		  <dependency>
			<groupId>org.apache.servicecomb</groupId>
			<artifactId>java-chassis-dependencies</artifactId>
			<version>0.2.0</version>
			<type>pom</type>
			<scope>import</scope>
		  </dependency>
		  <dependency>
			<groupId>com.huawei.paas.cse</groupId>
			<artifactId>cse-dependency</artifactId>
			<version>2.1.1</version>
			<type>pom</type>
			<scope>import</scope>
		  </dependency>
		</dependencies>
	</dependencyManagement>
```

## 总结  
上面列举了依赖关系管理的最佳实践。在配套不同组件进行业务代码开发时，如果碰到ClassNotFoundException、NoSuchMethodException等异常，可以通过IDE（比如eclipse）或者mvn dependency:tree命令来分析是否由于依赖关系错误，引入了某些三方件较老的版本，然后都可以利用dependencyManagement机制来强制约束三方件的版本号。正如最开始指出的，任何的三方件升级都可能存在风险，并且有些时候会出现无法解决，需要修改依赖组件代码的情况。一个好的实践是进行持续的集成，并增加适当的测试用例，尽早发现问题和解决依赖关系管理引入的接口不兼容问题。我们建议开发者能够结合上面的例子，适当调整下各个组件的顺序，观察一个项目实际使用的三方件版本的变化，深刻理解dependencyManagement的作用原理，这样能够帮助快速解决开发过程中碰到的ClassNotFoundException、NoSuchMethodException等问题。


---
title: "ServiceComb发版验证指南"
lang: cn
ref: release_validation_guide
permalink: /cn/developers/release-validation-guide/
excerpt: "ServiceComb发版验证指南"
last_modified_at:  2018-06-12T00:00:00+08:00
author: Yangyong Zheng
tags: [发版,验证]
redirect_from:
  - /theme-setup/
---

{% include toc %}

ServiceComb项目发新版本时，会发起投票邀请大家验证新版本的代码和Repo是否正确，本文向大家介绍如何进行验证工作。

## 验证Java Chassis
### 环境准备
1. 请确保网络通畅；
2. 请检查依赖软件已经正确安装：
* [JDK1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Maven 3.x](https://maven.apache.org/download.cgi)
* [Docker](https://www.docker.com/get-docker)

>提示：如果验证环境操作系统是Windows，需要安装[Docker Machine](https://docs.docker.com/machine/install-machine/)

### 验证源代码包Hash和签名正确
请在Vote邮件中找到**Release Candidate**的URL，例如：

```text
Release Candidate : https://dist.apache.org/repos/dist/dev/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/rc-01/
```

在浏览器中打开，下载`src.zip`结尾的源代码压缩包，以及同名的`src.zip.asc`签名文件和`src.zip.sha512`哈希文件，保持三个文件在同一目录下。

请在Vote邮件中找到**Key**的URL：

```text
Keys to verify the Release Candidate : https://dist.apache.org/repos/dist/dev/incubator/servicecomb/KEYS
```

在浏览器中打开，保存内容为KEYS文件并导入：

```bash
gpg --import KEYS
```

提示`Mohammad Asif Siddiqui (ServiceComb Code Signing Key) <asifdxtreme@apache.org>`成功导入或未变化（已导入过）

验证签名：

```bash
gpg --verify xxx-src.zip.asc xxx-src.zip
```

提示`Good signature from "Mohammad Asif Siddiqui (ServiceComb Code Signing Key) <asifdxtreme@apache.org>"`代表签名正确。

验证Hash：

```bash
sha512sum -c xxx-src.zip.sha512
```

提示`OK`代表Hash正确。

### 验证源代码功能正确
解压源代码：

```bash
unzip xxx-src.zip
```

使用`cd`命令切换到解压出来的源代码根目录下，执行：

```bash
mvn clean install -Pdocker -Pit
```

>提示：如果如果验证环境操作系统是Windows：
>```bash
>mvn clean install -Pdocker -Pit -Pdocker-machine
>```

等待所有的测试通过，依据配置环境不同，约耗时10~30分钟。

### 验证Staging Repository内的库正确
首先删除本地Repo中ServiceComb的全部缓存：

```bash
rm -rf /root/.m2/repository/org/apache/servicecomb/
```

>提示：如果不是root用户，请修改对应的路径

请在Vote邮件中找到**Staging Repository**的URL：

```text
Staging Repository : https://repository.apache.org/content/repositories/orgapacheservicecomb-xxxx/
```

之后在maven的`settings.xml`中添加Staging Repository地址配置：

```xml
<settings>
	<profiles>
	   <profile>
		  <repositories>
			<repository>
			  <releases />
			  <snapshots>
				<enabled>false</enabled>
			  </snapshots>
			  <id>repo.apache.staging</id>
			  <url>{Vote邮件中的Staging Repository URL}</url>
			</repository>
		  </repositories>
		  <pluginRepositories>
			<pluginRepository>
			  <releases />
			  <snapshots>
				<enabled>false</enabled>
			  </snapshots>
			  <id>repo.apache.staging</id>
			  <url>{Vote邮件中的Staging Repository URL}</url>
			</pluginRepository>
		  </pluginRepositories>
		  <id>staging</id>
		</profile>
	</profiles>
</settings>
```

一切就绪后，使用`cd`命令切换到**源代码demo目录(注意不是根目录)下**，执行：

```bash
mvn clean install -Pdocker -Pstaging
```

>提示：如果如果验证环境操作系统是Windows：
>```bash
>mvn clean install -Pdocker -Pstaging -Pdocker-machine
>```

**测试过程中可以观察到Java Chassis的依赖将从我们之前指定的Apache Staging Repository下载：**

```text
Downloading: https://repository.apache.org/content/repositories/orgapacheservicecomb-xxxx/xxxx.pom
```

等待所有的测试通过，依据配置环境不同，约耗时5~15分钟。

### 验证Spring Cloud集成功能正确
从https://github.com/ServiceComb/ServiceComb-Company-WorkShop Clone最新Company示例项目代码，切换到`1.x`分支：

```bash
git clone https://github.com/ServiceComb/ServiceComb-Company-WorkShop.git
git checkout 1.x
```

修改项目根目录中的`pom.xml`，更改其中的`<java-chassis.version>`配置为当前发版版本，例如1.0.0-m2：

```xml
<properties>
  <java-chassis.version>1.0.0-m2</java-chassis.version>
</properties>
```

在项目根目录下执行：

```bash
mvn clean verify -Pdocker -Pstaging
```

>提示：如果如果验证环境操作系统是Windows：
>```bash
>mvn clean verify -Pdocker -Pstaging -Pdocker-machine
>```

等待所有的测试通过，依据配置环境不同，约耗时5~10分钟。

### 验证Samples是否正确（可选）
在源代码的sample下有很多例子，可以任选几个测试，例如使用BMI做验证；sample验证的方法请参见对应目录下README.md中的说明即可。
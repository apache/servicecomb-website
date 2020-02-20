---
title: "Release verification guide for ServiceComb"
lang: en
ref: release_validation_guide
permalink: developers/release-validation-guide/
excerpt: "How to verify Apache Release"
last_modified_at:  2018-06-12T00:00:00+08:00
author: Yangyong Zheng
tags: [release,verification]
redirect_from:
  - /theme-setup/
---

{% include toc %}

As apache project, when ServiceComb release new version, need make a vote and invite users and developers to verify its availability, this guide will introduce how to do this work.

## Verify Java Chassis
### Prerequisite
1. Make sure your network is available;
2. Please check these components had installed:
* [JDK1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Maven 3.x](https://maven.apache.org/download.cgi)
* [Docker](https://www.docker.com/get-docker)

>Hint: If the OS of environment is Windows, need install [Docker Machine](https://docs.docker.com/machine/install-machine/)

### Verify the Hash and the Signature
Please find the URL of **Release Candidate** in Vote mail, for example:

```text
Release Candidate : https://dist.apache.org/repos/dist/dev/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/rc-01/
```

Open this URL in browser, download the source code end with `src.zip`, signature file end with `src.zip.asc` and hash file end with `src.zip.sha512`, please keep these three files in same folder.

Please find URL of **Key** in Vote mail, for example:

```text
Keys to verify the Release Candidate : https://dist.apache.org/repos/dist/dev/incubator/servicecomb/KEYS
```

Open this URL in browser, copy contents into KEYS file, then import:

```bash
gpg --import KEYS
```

Then `Mohammad Asif Siddiqui (ServiceComb Code Signing Key) <asifdxtreme@apache.org>` will output if imported successfully.

Verify the Signature:

```bash
gpg --verify xxx-src.zip.asc xxx-src.zip
```

Then `Good signature from "Mohammad Asif Siddiqui (ServiceComb Code Signing Key) <asifdxtreme@apache.org>"` will output if verified successfully.

Verify the Hash:

```bash
sha512sum -c xxx-src.zip.sha512
```

Then `OK` will output if verified successfully.

### Verify the source code
Unzip the source code:

```bash
unzip xxx-src.zip
```

Run test case under source code root:

```bash
mvn clean install -Pdocker -Pit -Pdemo-run-release
```

>Hint: If the OS of environment is Windows:
>```bash
>mvn clean install -Pdocker -Pit -Pdocker-machine -Pdemo-run-release
>```

Wait all test case check passed, may use 10~30 minutes.

### Verify the Staging Repository
First need delete all ServiceComb cache in local maven repo:

```bash
rm -rf /root/.m2/repository/org/apache/servicecomb/
```

>Hint: If not the root, please change the path of .m2

Please find URL of **Staging Repository** in Vote mail, for example:

```text
Staging Repository : https://repository.apache.org/content/repositories/orgapacheservicecomb-xxxx/
```

Then add this Staging Repository address into `settings.xml` of maven: 

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
			  <url>{Staging Repository URL in Vote mail}</url>
			</repository>
		  </repositories>
		  <pluginRepositories>
			<pluginRepository>
			  <releases />
			  <snapshots>
				<enabled>false</enabled>
			  </snapshots>
			  <id>repo.apache.staging</id>
			  <url>{Staging Repository URL in Vote mail}</url>
			</pluginRepository>
		  </pluginRepositories>
		  <id>staging</id>
		</profile>
	</profiles>
</settings>
```

After that, enter **demo folder under the source code(not root folder of source code)** and run:

```bash
mvn clean install -Pdocker -Pstaging -Pdemo-run-release
```

>Hint: If the OS of environment is Windows:
>```bash
>mvn clean install -Pdocker -Pstaging -Pdocker-machine -Pdemo-run-release
>```

**When test cases are running, we can see the Java Chassis dependencies will download from Apache Staging Repository that had configured:**

```text
Downloading: https://repository.apache.org/content/repositories/orgapacheservicecomb-xxxx/xxxx.pom
```

Wait all test case check passed, may use 5~15 minutes.

### Verify integration with Spring Cloud
Please clone the latest source code of Company demo project from https://github.com/ServiceComb/ServiceComb-Company-WorkShop , then checkout branch of 1.x :

```bash
git clone https://github.com/ServiceComb/ServiceComb-Company-WorkShop.git
git checkout 1.x
```

Modify the configuration of `<java-chassis.version>` in `pom.xml` under  source code root folder to current releasing version, such as 1.0.0-m2 :

```xml
<properties>
  <java-chassis.version>1.0.0-m2</java-chassis.version>
</properties>
```

Run test case under source code root:

```bash
mvn clean verify -Pdocker -Pstaging
```

>Hint: If the OS of environment is Windows:
>```bash
>mvn clean verify -Pdocker -Pstaging -Pdocker-machine
>```

Wait all test case check passed, may use 5~10 minutes.

### Verify Samples(Optional)
Download [samples code](https://github.com/apache/servicecomb-samples). There are many samples here, choose 
some of them and change the version and do verifications. See each README of samples for details.

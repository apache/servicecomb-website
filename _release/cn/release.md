---
title: "ServiceComb Releases"
lang: cn
ref: release
permalink: /cn/release/
excerpt: "ServiceComb Releases"
last_modified_at: 2019-04-06T00:50:43-55:00
---

使用以下链接从我们的一个镜像下载ServiceComb工具包版本。 您必须使用从我们的主分发目录下载的签名来验证下载文件的完整性。

主分发站点及其镜像仅提供当前推荐的版本。


**稳定发布版 - 最新版本:**

* [ServiceComb Toolkit 0.1.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-toolkit/0.1.0/){:target="_blank"} (released on 2019-09-03)

* [ServiceComb Pack 0.5.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.5.0/){:target="_blank"} (released on 2019-08-26)

* [ServiceComb Java-Chassis 1.2.1](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/1.2.1/){:target="_blank"} (released on 2019-05-19)

* [ServiceComb Service-Center 1.2.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-service-center/1.2.0/){:target="_blank"} (released on 2019-04-06)

* [ServiceComb Saga Actuator 0.3.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-saga-actuator/0.3.0/){:target="_blank"} (released on 2018-12-18)

* [ServiceComb Saga 0.2.1](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-saga/0.2.1/){:target="_blank"} (released on 2018-11-23)

* [ServiceComb Mesher 1.6.3](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/){:target="_blank"} (released on 2019-9-9)

* [ServiceComb Kie 0.1.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-kie/0.1.0/){:target="_blank"} (released on 2019-10-26)

**先前发行版本 :**

* [ServiceComb Service-Center 1.1.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-service-center/1.1.0/){:target="_blank"} (released on 2018-11-30)
* [ServiceComb Service-Center 1.0.0](http://archive.apache.org/dist/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0/){:target="_blank"} (released on 2018-08-02)
* [ServiceComb Service-Center 1.0.0-m2](http://archive.apache.org/dist/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m2/){:target="_blank"} (released on 2018-06-21)
* [ServiceComb Service-Center 1.0.0-m1](http://archive.apache.org/dist/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m1/){:target="_blank"} (released on 2018-03-27)

* [ServiceComb Java-Chassis 1.2.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/1.2.0/){:target="_blank"} (released on 2019-04-12)
* [ServiceComb Java-Chassis 1.1.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/1.1.0/){:target="_blank"} (released on 2018-11-30)
* [ServiceComb Java-Chassis 1.0.0](http://archive.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0/){:target="_blank"} (released on 2018-08-02)
* [ServiceComb Java-Chassis 1.0.0-m2](http://archive.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/){:target="_blank"} (released on 2018-06-21)
* [ServiceComb Java-Chassis 1.0.0-m1](http://archive.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m1/){:target="_blank"} (released on 2018-04-02)

* [ServiceComb Pack 0.4.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.4.0/){:target="_blank"} (released on 2019-04-06)
* [ServiceComb Pack 0.3.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.3.0/){:target="_blank"} (released on 2019-01-02)
* [ServiceComb Saga 0.2.0](http://archive.apache.org/dist/incubator/servicecomb/incubator-servicecomb-saga/0.2.0/){:target="_blank"} (released on 2018-06-21)
* [ServiceComb Saga 0.1.0](http://archive.apache.org/dist/incubator/servicecomb/incubator-servicecomb-saga/0.1.0/){:target="_blank"} (released on 2018-03-27)


**注意:**
  - 请查看 [兼容版本](/release/compatibleversion) 获取版本兼容信息.


**验证发行版本**

使用PGP或SHA签名验证下载文件的完整性至关重要。可以使用GPG或PGP验证PGP签名。请下载[KEYS](https://www.apache.org/dist/servicecomb/KEYS){:target="_blank"} 以及相关发行版的asc签名文件。 建议从主发行版[目录](https://www.apache.org/dist/servicecomb/){:target="_blank"} 中获取这些文件，而不是从镜像中获取。
 ```
 gpg -import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

要验证二进制文件/源，您可以从主分发目录下载相关的asc文件，并按照以下指南进行操作。

```
gpg --verify apache-servicecomb-********.asc apache-servicecomb-*********

or

pgpv apache-servicecomb-********.asc

or

pgp apache-servicecomb-********.asc


```

或者，您可以从主发行版[repo](https://www.apache.org/dist/servicecomb/){:target="_blank"}下载SHA签名，并使用sha512sum或者shasum验证下载。

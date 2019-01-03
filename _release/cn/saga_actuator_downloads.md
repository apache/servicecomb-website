---
title: "ServiceComb Saga Actuator Downloads"
lang: cn
ref: release
permalink: /cn/release/saga-actuator-downloads/
excerpt: "ServiceComb Saga Actuator Downloads"
last_modified_at: 2018-03-28T00:50:43-55:00
---

## 发布包

| 版本号           |         源码            |           发布包         |
| ---------------------- | --------------------------------- | --------------------------------- |
|**Apache ServiceComb Saga Actuator 0.3.0(LATEST)**|[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-saga-actuator/0.3.0/apache-servicecomb-saga-actuator-distribution-0.3.0-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-saga-actuator/0.3.0/apache-servicecomb-saga-actuator-distribution-0.3.0-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-saga-actuator/0.3.0/apache-servicecomb-saga-actuator-distribution-0.3.0-src.zip.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-saga-actuator/0.3.0/apache-servicecomb-saga-actuator-distribution-0.3.0-bin.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-saga-actuator/0.3.0/apache-servicecomb-saga-actuator-distribution-0.3.0-bin.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-saga-actuator/0.3.0/apache-servicecomb-saga-actuator-distribution-0.3.0-bin.zip.sha512)|

**Verifying the release**

使用PGP或SHA签名验证下载文件的完整性是很有必要的。PGP签名可以使用GPG或PGP进行验证，请下载 [KEYS](https://www.apache.org/dist/servicecomb/KEYS)以及相关发行的asc签名文件。
建议从主发行[目录](https://www.apache.org/dist/servicecomb/servicecomb-saga-actuator/){:target="_blank"}中获取这些文件，而不是从镜像中获取这些文件。 ```
 gpg -import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-servicecomb-saga********.asc apache-servicecomb-saga-*********

or

pgpv apache-servicecomb-saga-********.asc

or

pgp apache-servicecomb-saga-********.asc


```

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/servicecomb/servicecomb-saga-actuator/){:target="_blank"} and verify the downloads using sha512sum.

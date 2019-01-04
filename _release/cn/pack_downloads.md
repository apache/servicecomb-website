---
title: "ServiceComb Pack Downloads"
lang: cn
ref: release
permalink: /cn/release/pack-downloads/
excerpt: "ServiceComb Pack Downloads"
last_modified_at: 2018-03-28T00:50:43-55:00
---

## 发布包

| 版本号           |         源码            |           发布包         |
| ---------------------- | --------------------------------- | --------------------------------- |
|**Apache ServiceComb Pack 0.3.0(LATEST)**|[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-src.zip.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-bin.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-bin.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-bin.zip.sha512)|

**发布包验证**
使用PGP或SHA签名验证下载文件的完整性是很有必要的。PGP签名可以使用GPG或PGP进行验证，请下载 [KEYS](https://www.apache.org/dist/servicecomb/KEYS)以及相关发行的asc签名文件。
建议从主发行[目录](https://www.apache.org/dist/servicecomb/servicecomb-pack/){:target="_blank"}中获取这些文件，而不是从镜像中获取这些文件。

 ```
 gpg -import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

要验证二进制文件或源代码，您可以从主发行目录下载相关的asc文件并按照以下指南进行操作。

```
gpg --verify apache-servicecomb-pack********.asc apache-servicecomb-pack-*********

or

pgpv apache-servicecomb-pack-********.asc

or

pgp apache-servicecomb-pack-********.asc


```

另外，您也可以从主发行[仓库](https://www.apache.org/dist/servicecomb/servicecomb-pack/){:target="_blank"}下载SHA签名并使用sha512sum验证。

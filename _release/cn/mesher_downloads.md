---
title: "ServiceComb Mesher Downloads"
lang: cn
ref: release
permalink: /cn/release/mesher-downloads/
excerpt: "ServiceComb Mesher Downloads"
last_modified_at: 2019-09-09T00:50:43-55:00
---

## 发布包


| Release           |         Source            |           Windows         |           Linux           |           Darwin          |          
| ---------------------- | --------------------------------- | --------------------------------- | --------------------------------- | --------------------------------- |
| **Apache ServiceComb Mesher 1.6.3 (LATEST)**    |[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-src.tar.gz) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-src.tar.gz.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-src.tar.gz.sha512)     | [[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-windows-amd64.tar.gz) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-windows-amd64.tar.gz.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-windows-amd64.tar.gz.sha512)| [[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-linux-amd64.tar.gz) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-linux-amd64.tar.gz.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-linux-amd64.tar.gz.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-darwin-amd64.tar.gz) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-darwin-amd64.tar.gz.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-darwin-amd64.tar.gz.sha512) | 

**发布包验证**

使用PGP或SHA签名验证下载文件的完整性是很有必要的。PGP签名可以使用GPG或PGP进行验证，
请下载 [KEYS](https://www.apache.org/dist/servicecomb/KEYS)以及相关发行的asc签名文件。
建议从主发行[目录](https://www.apache.org/dist/servicecomb/servicecomb-mesher/){:target="_blank"} 中获取这些文件，
而不是从镜像中获取这些文件。
 ```
 gpg --import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

要验证二进制文件或源代码，您可以从主发行目录下载相关的asc文件并按照以下指南进行操作。
```
gpg --verify apache-servicecomb-mesher-********.asc apache-servicecomb-mesher-*********

or

pgpv apache-servicecomb-mesher-********.asc

or

pgp apache-servicecomb-mesher-********.asc


```

另外，您也可以从主发行[仓库](https://www.apache.org/dist/servicecomb/servicecomb-mesher/){:target="_blank"} 下载SHA签名并使用sha512sum验证。

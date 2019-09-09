---
title: "ServiceComb Mesher Downloads"
lang: en
ref: release
permalink: /release/mesher-downloads/
excerpt: "ServiceComb Mesher Downloads"
last_modified_at: 2019-09-09T00:50:43-55:00
---

## Releases


| Release           |         Source            |           Windows         |           Linux           |           Darwin          |          
| ---------------------- | --------------------------------- | --------------------------------- | --------------------------------- | --------------------------------- |
| **Apache ServiceComb Mesher 1.6.3 (LATEST)**    |[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-src.tar.gz) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-src.tar.gz.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-src.tar.gz.sha512)     | [[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-windows-amd64.tar.gz) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-windows-amd64.tar.gz.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-windows-amd64.tar.gz.sha512)| [[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-linux-amd64.tar.gz) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-linux-amd64.tar.gz.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-linux-amd64.tar.gz.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-darwin-amd64.tar.gz) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-darwin-amd64.tar.gz.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-mesher/1.6.3/apache-servicecomb-mesher-1.6.3-darwin-amd64.tar.gz.sha512) | 

**Verifying the release**

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures.
 The PGP signatures can  be verified using GPG or PGP.
 Please download the [KEYS](https://www.apache.org/dist/servicecomb/KEYS){:target="_blank"} as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution [directory](https://www.apache.org/dist/servicecomb/servicecomb-mesher/){:target="_blank"} and not from the mirrors.
 ```
 gpg --import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-servicecomb-mesher-********.asc apache-servicecomb-mesher-*********

or

pgpv apache-servicecomb-mesher-********.asc

or

pgp apache-servicecomb-mesher-********.asc


```

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/servicecomb/servicecomb-mesher/){:target="_blank"} and verify the downloads using sha512sum.

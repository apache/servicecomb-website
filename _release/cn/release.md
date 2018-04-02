---
title: "ServiceComb Releases"
lang: cn
ref: release
permalink: /cn/release/
excerpt: "ServiceComb Releases"
last_modified_at: 2018-03-28T00:50:43-55:00
---

Use the links below to download the Apache ServiceComb Incubating from one of our mirrors. You must verify the integrity of the downloaded files using signatures downloaded from our main distribution directory.

Only current recommended releases are available on the main distribution site and its mirrors. 


**Stable Release - Latest Version:**

* [Apache ServiceComb (incubating) Service-Center 1.0.0-m1](https://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m1/){:target="_blank"} (released on 2018-03-27)

* [Apache ServiceComb (incubating) Java-Chassis 1.0.0-m1](https://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m1/){:target="_blank"} (released on 2018-04-02)

* [Apache ServiceComb (incubating) Saga 0.1.0](https://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-saga/0.1.0/){:target="_blank"} (released on 2018-03-27)


**Verifying the release**

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures.
 The PGP signatures can  be verified using GPG or PGP. 
 Please download the [KEYS](https://www.apache.org/dist/incubator/servicecomb/KEYS){:target="_blank"} as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution [directory](https://www.apache.org/dist/incubator/servicecomb/){:target="_blank"} and not from the mirrors.
 ```
 gpg -i KEYS
 
 or
 
 pgpk -a KEYS
 
 or
 
 pgp -ka KEYS

```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-servicecomb-incubating********.asc apache-servicecomb-incubating*********

or

pgpv apache-servicecomb-incubating********.asc

or 

pgp apache-servicecomb-incubating********.asc


```

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/incubator/servicecomb/){:target="_blank"} and verify the downloads using sha512sum.

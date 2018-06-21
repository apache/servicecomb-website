---
title: "ServiceComb Java-Chassis Downloads"
lang: en
ref: release
permalink: /release/java-chassis-downloads/
excerpt: "ServiceComb Java-Chassis Downloads"
last_modified_at: 2018-03-28T00:50:43-55:00
---

## Releases

* Apache ServiceComb (incubating) Service-Center 1.0.0-m2 (Latest)
    - Source [[src]](https://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m2-src.zip) [[asc]](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m2-src.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m2-src.zip.sha512) 
    - Distribution [[Binary]](https://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m2-bin.zip) [[asc]](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m2-bin.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m2/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m2-bin.zip.sha512)
 
* Apache ServiceComb (incubating) Service-Center 1.0.0-m1
    - Source [[src]](https://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m1/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m1-src.zip) [[asc]](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m1/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m1-src.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m1/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m1-src.zip.sha512) 
    - Distribution [[Binary]](https://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m1/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m1-bin.zip) [[asc]](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m1/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m1-bin.zip.asc) [[sha512]](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/1.0.0-m1/apache-servicecomb-incubating-java-chassis-distribution-1.0.0-m1-bin.zip.sha512)
    
    
**Verifying the release**

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures.
 The PGP signatures can  be verified using GPG or PGP. 
 Please download the [KEYS](https://www.apache.org/dist/incubator/servicecomb/KEYS){:target="_blank"} as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution [directory](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/){:target="_blank"} and not from the mirrors.
 ```
 gpg -i KEYS
 
 or
 
 pgpk -a KEYS
 
 or
 
 pgp -ka KEYS

```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-servicecomb-incubating-java-chassis-********.asc apache-servicecomb-incubating-java-chassis-*********

or

pgpv apache-servicecomb-incubating-java-chassis-********.asc

or 

pgp apache-servicecomb-incubating-java-chassis-********.asc


```

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/incubator/servicecomb/incubator-servicecomb-java-chassis/){:target="_blank"} and verify the downloads using sha512sum.

    
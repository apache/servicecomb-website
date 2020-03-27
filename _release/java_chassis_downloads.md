---
title: "ServiceComb Java-Chassis Downloads"
lang: en
ref: release
permalink: /release/java-chassis-downloads/
excerpt: "ServiceComb Java-Chassis Downloads"
last_modified_at: 2019-04-12T00:50:43-55:00
---

## Releases

| Release           |         Source            |           Distribution         |           Recommended Version of Service-Center         |
| ---------------------- | --------------------------------- | --------------------------------- | --------------------------------- |
|**Apache ServiceComb Java-Chassis 2.0.1 (Latest)**|[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/2.0.1/apache-servicecomb-java-chassis-distribution-2.0.1-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/2.0.1/apache-servicecomb-java-chassis-distribution-2.0.1-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/2.0.1/apache-servicecomb-java-chassis-distribution-2.0.1-src.zip.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/2.0.1/apache-servicecomb-java-chassis-distribution-2.0.1-bin.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/2.0.1/apache-servicecomb-java-chassis-distribution-2.0.1-bin.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/2.0.1/apache-servicecomb-java-chassis-distribution-2.0.1-bin.zip.sha512)|Service-Center 1.0.0 or above|
|Apache ServiceComb Java-Chassis 2.0.0|[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/2.0.0/apache-servicecomb-java-chassis-distribution-2.0.0-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/2.0.0/apache-servicecomb-java-chassis-distribution-2.0.0-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/2.0.0/apache-servicecomb-java-chassis-distribution-2.0.0-src.zip.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/2.0.0/apache-servicecomb-java-chassis-distribution-2.0.0-bin.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/2.0.0/apache-servicecomb-java-chassis-distribution-2.0.0-bin.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/2.0.0/apache-servicecomb-java-chassis-distribution-2.0.0-bin.zip.sha512)|Service-Center 1.0.0 or above|
|Apache ServiceComb Java-Chassis 1.3.0|[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/1.3.0/apache-servicecomb-java-chassis-distribution-1.3.0-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/1.3.0/apache-servicecomb-java-chassis-distribution-1.3.0-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/1.3.0/apache-servicecomb-java-chassis-distribution-1.3.0-src.zip.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/1.3.0/apache-servicecomb-java-chassis-distribution-1.3.0-bin.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/1.3.0/apache-servicecomb-java-chassis-distribution-1.3.0-bin.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/1.3.0/apache-servicecomb-java-chassis-distribution-1.3.0-bin.zip.sha512)|Service-Center 1.0.0 or above|

**Verifying the release**

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures.
 The PGP signatures can  be verified using GPG or PGP.
 Please download the [KEYS](https://www.apache.org/dist/servicecomb/KEYS){:target="_blank"} as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution [directory](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/){:target="_blank"} and not from the mirrors.
 ```
 gpg --import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-servicecomb-java-chassis-********.asc apache-servicecomb-java-chassis-*********

or

pgpv apache-servicecomb-java-chassis-********.asc

or

pgp apache-servicecomb-java-chassis-********.asc


```

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/servicecomb/servicecomb-java-chassis/){:target="_blank"} and verify the downloads using sha512sum.

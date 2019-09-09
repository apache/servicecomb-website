---
title: "ServiceComb Releases"
lang: en
ref: release
permalink: /release/
excerpt: "ServiceComb Releases"
last_modified_at: 2019-04-06T00:50:43-55:00
---

Use the links below to download the ServiceComb toolkits releases from one of our mirrors. You must verify the integrity of the downloaded files using signatures downloaded from our main distribution directory.

Only current recommended releases are available on the main distribution site and its mirrors.


**Stable Release - Latest Version:**

* [ServiceComb toolkit 0.1.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-toolkit/0.1.0/){:target="_blank"} (released on 2019-09-04)

* [ServiceComb Pack 0.5.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.5.0/){:target="_blank"} (released on 2019-08-26)

* [ServiceComb Java-Chassis 1.2.1](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-java-chassis/1.2.1/){:target="_blank"} (released on 2019-05-19)

* [ServiceComb Service-Center 1.2.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-service-center/1.2.0/){:target="_blank"} (released on 2019-04-06)

* [ServiceComb Saga Actuator 0.3.0](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-saga-actuator/0.3.0/){:target="_blank"} (released on 2018-12-18)

* [ServiceComb Saga 0.2.1](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-saga/0.2.1/){:target="_blank"} (released on 2018-11-23)

* [ServiceComb Mesher 1.6.3](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-mesher/1.6.3/){:target="_blank"} (released on 2019-9-9)

**Earlier Releases :**
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


**NOTE:**
  - Please check [this page](/release/compatibleversion) for compatible version.

**Verifying the release**

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures.
 The PGP signatures can  be verified using GPG or PGP.
 Please download the [KEYS](https://www.apache.org/dist/servicecomb/KEYS){:target="_blank"} as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution [directory](https://www.apache.org/dist/servicecomb/){:target="_blank"} and not from the mirrors.
 ```
 gpg -import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-servicecomb********.asc apache-servicecomb*********

or

pgpv apache-servicecomb********.asc

or

pgp apache-servicecomb********.asc


```

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/servicecomb/){:target="_blank"} and verify the downloads using sha512sum or shasum.

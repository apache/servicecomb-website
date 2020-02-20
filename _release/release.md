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

* [ServiceComb Service-Center 1.3.0](/release/service-center-downloads/) (released on 2019-11-07)

* [ServiceComb toolkit 0.2.0](/release/toolkit-downloads/) (released on 2020-01-05)

* [ServiceComb Pack 0.5.0](/release/pack-downloads/) (released on 2019-08-26)

* [ServiceComb Java-Chassis 2.0.0](/release/java-chassis-downloads/) (released on 2020-02-20)

* [ServiceComb Saga Actuator 0.3.0](/release/saga-actuator-downloads/) (released on 2018-12-18)

* [ServiceComb Saga 0.2.1](/release/saga-downloads/) (released on 2018-11-23)

* [ServiceComb Mesher 1.6.3](/release/mesher-downloads/) (released on 2019-9-9)

* [ServiceComb Kie 0.1.0](/release/kie-downloads/) (released on 2019-10-26)

**Earlier Releases :**
* [ServiceComb Service-Center 1.2.0](/release/service-center-downloads/) (released on 2019-04-06)
* [ServiceComb Service-Center 1.1.0](/release/service-center-downloads/) (released on 2018-11-30)
* [ServiceComb Service-Center 1.0.0](/release/service-center-downloads/) (released on 2018-08-02)
* [ServiceComb Service-Center 1.0.0-m2](/release/service-center-downloads/) (released on 2018-06-21)
* [ServiceComb Service-Center 1.0.0-m1](/release/service-center-downloads/) (released on 2018-03-27)

* [ServiceComb Java-Chassis 1.3.0](/release/java-chassis-downloads/) (released on 2019-10-31)
* [ServiceComb Java-Chassis 1.2.1](/release/java-chassis-downloads/) (released on 2019-05-19)
* [ServiceComb Java-Chassis 1.2.0](/release/java-chassis-downloads/) (released on 2019-04-12)
* [ServiceComb Java-Chassis 1.1.0](/release/java-chassis-downloads/) (released on 2018-11-30)
* [ServiceComb Java-Chassis 1.0.0](/release/java-chassis-downloads/) (released on 2018-08-02)

* [ServiceComb Pack 0.4.0](/release/pack-downloads/) (released on 2019-04-06)
* [ServiceComb Pack 0.3.0](/release/pack-downloads/) (released on 2019-01-02)
* [ServiceComb Saga 0.2.0](/release/saga-downloads/) (released on 2018-06-21)
* [ServiceComb Saga 0.1.0](/release/saga-downloads/) (released on 2018-03-27)

* [ServiceComb toolkit 0.1.0](/release/toolkit-downloads/) (released on 2019-09-04)

**NOTE:**
  - Please check [this page](/release/compatibleversion) for compatible version.

**Verifying the release**

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures.
 The PGP signatures can  be verified using GPG or PGP.
 Please download the [KEYS](https://www.apache.org/dist/servicecomb/KEYS) as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution [directory](https://www.apache.org/dist/servicecomb/) and not from the mirrors.
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

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/servicecomb/) and verify the downloads using sha512sum or shasum.

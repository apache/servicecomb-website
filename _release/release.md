---
title: "ServiceComb Releases"
lang: en
ref: release
permalink: /release/
excerpt: "ServiceComb Releases"
last_modified_at: 2022-05-16T00:50:43-55:00
---

Use the links below to download the ServiceComb toolkits releases from one of our mirrors. You must verify the integrity of the downloaded files using signatures downloaded from our main distribution directory.

Only current recommended releases are available on the main distribution site and its mirrors.


**Stable Release - Latest Version:**

* [ServiceComb Service-Center 2.2.0](/release/service-center-downloads/) (released on 2024-01-23)

* [ServiceComb toolkit 0.2.0](/release/toolkit-downloads/) (released on 2020-01-05)

* [ServiceComb Java-Chassis 3.2.2](/release/java-chassis-downloads/) (released on 2024-09-20)

* [ServiceComb Mesher 1.6.3](/release/mesher-downloads/) (released on 2019-9-9)

* [ServiceComb Kie 0.1.0](/release/kie-downloads/) (released on 2019-10-26)

**Earlier Releases :**

* [ServiceComb Service-Center 2.1.0](/release/service-center-downloads/) (released on 2022-03-15)
* [ServiceComb Service-Center 2.0.0](/release/service-center-downloads/) (released on 2021-06-04)
* [ServiceComb Service-Center 1.3.0](/release/service-center-downloads/) (released on 2019-11-07)
* [ServiceComb Service-Center 1.2.0](/release/service-center-downloads/) (released on 2019-04-06)
* [ServiceComb Service-Center 1.1.0](/release/service-center-downloads/) (released on 2018-11-30)
* [ServiceComb Service-Center 1.0.0](/release/service-center-downloads/) (released on 2018-08-02)
* [ServiceComb Service-Center 1.0.0-m2](/release/service-center-downloads/) (released on 2018-06-21)
* [ServiceComb Service-Center 1.0.0-m1](/release/service-center-downloads/) (released on 2018-03-27)

* [ServiceComb Java-Chassis 2.7.0](/release/java-chassis-downloads/) (released on 2022-04-07)
* [ServiceComb Java-Chassis 2.6.0](/release/java-chassis-downloads/) (released on 2021-12-01)
* [ServiceComb Java-Chassis 2.5.0](/release/java-chassis-downloads/) (released on 2021-08-17)
* [ServiceComb Java-Chassis 2.3.0](/release/java-chassis-downloads/) (released on 2021-06-22)
* [ServiceComb Java-Chassis 2.2.0](/release/java-chassis-downloads/) (released on 2020-02-28)

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

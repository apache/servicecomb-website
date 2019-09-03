---
title: "ServiceComb Toolkit Downloads"
lang: en
ref: release
permalink: /release/toolkit-downloads/
excerpt: "ServiceComb Toolkit Downloads"
last_modified_at: 2019-09-02T14:06:43-55:00
---

## Releases

| Release           |         Source            |
| ---------------------- | --------------------------------- | --------------------------------- |
|**Apache ServiceComb Toolkit 0.1.0(LATEST)**|[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-toolkit/0.1.0/apache-servicecomb-toolkit-distribution-0.1.0-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-toolkit/0.1.0/apache-servicecomb-toolkit-distribution-0.1.0-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-toolkit/0.1.0/apache-servicecomb-toolkit-distribution-0.1.0-src.zip.sha512)|

**Verifying the release**

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures.
 The PGP signatures can  be verified using GPG or PGP.
 Please download the [KEYS](https://www.apache.org/dist/servicecomb/KEYS){:target="_blank"} as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution [directory](https://www.apache.org/dist/servicecomb/servicecomb-toolkit/){:target="_blank"} and not from the mirrors.
 ```
 gpg --import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-servicecomb-toolkit********.asc apache-servicecomb-toolkit-*********

or

pgpv apache-servicecomb-toolkit-********.asc

or

pgp apache-servicecomb-toolkit-********.asc


```

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/servicecomb/servicecomb-toolkit/){:target="_blank"} and verify the downloads using sha512sum.

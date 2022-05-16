---
title: "ServiceComb Pack Downloads"
lang: en
ref: release
permalink: /release/pack-downloads/
excerpt: "ServiceComb Pack Downloads"
last_modified_at: 2022-05-16T00:50:43-55:00
---

## Releases

| Release           |         Source            |           Distribution         |
| ---------------------- | --------------------------------- | --------------------------------- |
|**Apache ServiceComb Pack 0.7.0(LATEST)**|[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.7.0/apache-servicecomb-pack-distribution-0.7.0-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.7.0/apache-servicecomb-pack-distribution-0.7.0-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.7.0/apache-servicecomb-pack-distribution-0.7.0-src.zip.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.7.0/apache-servicecomb-pack-distribution-0.7.0-bin.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.7.0/apache-servicecomb-pack-distribution-0.7.0-bin.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.7.0/apache-servicecomb-pack-distribution-0.7.0-bin.zip.sha512)|
|Apache ServiceComb Pack 0.6.0|[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.6.0/apache-servicecomb-pack-distribution-0.6.0-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.6.0/apache-servicecomb-pack-distribution-0.6.0-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.6.0/apache-servicecomb-pack-distribution-0.6.0-src.zip.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.6.0/apache-servicecomb-pack-distribution-0.6.0-bin.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.6.0/apache-servicecomb-pack-distribution-0.6.0-bin.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.6.0/apache-servicecomb-pack-distribution-0.6.0-bin.zip.sha512)|
|Apache ServiceComb Pack 0.5.0            |[[src]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.5.0/apache-servicecomb-pack-distribution-0.5.0-src.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.5.0/apache-servicecomb-pack-distribution-0.5.0-src.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.5.0/apache-servicecomb-pack-distribution-0.5.0-src.zip.sha512)|[[Binary]](https://apache.org/dyn/closer.cgi/servicecomb/servicecomb-pack/0.5.0/apache-servicecomb-pack-distribution-0.5.0-bin.zip) [[asc]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.5.0/apache-servicecomb-pack-distribution-0.5.0-bin.zip.asc) [[sha512]](https://www.apache.org/dist/servicecomb/servicecomb-pack/0.5.0/apache-servicecomb-pack-distribution-0.5.0-bin.zip.sha512)|
|Apache ServiceComb Pack 0.4.0            |[[src]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.4.0/apache-servicecomb-pack-distribution-0.4.0-src.zip) [[asc]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.4.0/apache-servicecomb-pack-distribution-0.4.0-src.zip.asc) [[sha512]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.4.0/apache-servicecomb-pack-distribution-0.4.0-src.zip.sha512)|[[Binary]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.4.0/apache-servicecomb-pack-distribution-0.4.0-bin.zip) [[asc]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.4.0/apache-servicecomb-pack-distribution-0.4.0-bin.zip.asc) [[sha512]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.4.0/apache-servicecomb-pack-distribution-0.4.0-bin.zip.sha512)|
|Apache ServiceComb Pack 0.3.0            |[[src]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-src.zip) [[asc]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-src.zip.asc) [[sha512]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-src.zip.sha512)|[[Binary]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-bin.zip) [[asc]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-bin.zip.asc) [[sha512]](https://archive.apache.org/dist/servicecomb/servicecomb-pack/0.3.0/apache-servicecomb-pack-distribution-0.3.0-bin.zip.sha512)|

**Verifying the release**

It is essential that you verify the integrity of the downloaded files using the PGP or SHA signatures.
 The PGP signatures can  be verified using GPG or PGP.
 Please download the [KEYS](https://www.apache.org/dist/servicecomb/KEYS){:target="_blank"} as well as the asc signature files for relevant distribution. It is recommended to get these files from the main distribution [directory](https://www.apache.org/dist/servicecomb/servicecomb-pack/){:target="_blank"} and not from the mirrors.
 ```
 gpg --import KEYS

 or

 pgpk -a KEYS

 or

 pgp -ka KEYS

```

To verify the binaries/sources you can download the relevant asc files for it from main distribution directory and follow the below guide.

```
gpg --verify apache-servicecomb-pack********.asc apache-servicecomb-pack-*********

or

pgpv apache-servicecomb-pack-********.asc

or

pgp apache-servicecomb-pack-********.asc


```

Alternatively you can download the SHA signatures from main distribution [repo](https://www.apache.org/dist/servicecomb/servicecomb-pack/){:target="_blank"} and verify the downloads using sha512sum.

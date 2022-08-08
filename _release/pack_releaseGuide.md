---
title: "ServiceComb Pack Release Guide"
lang: en
ref: release
permalink: /release/pack-release-guide/
excerpt: "ServiceComb Pack Release Guide"
last_modified_at: 2022-08-06T00:50:43-55:00
---

## Preparation

#### Creating a GPG keypair

1. Install GnuPG

Download and Install [GnuPG](https://www.gnupg.org/download/index.html) 2.0.20 version.

```shell
$ gpg --version
gpg (GnuPG/MacGPG2) 2.2.20
libgcrypt 1.8.5
Copyright (C) 2020 Free Software Foundation, Inc.
```

2. Configure GnuPG

Refer to the [Recommended](https://infra.apache.org/openpgp.html#sha-defaults) to configuration the `$HOME/.gnupg/gpg.conf` file

```properties
personal-digest-preferences SHA512
cert-digest-algo SHA512
default-preference-list SHA512 SHA384 SHA256 SHA224 AES256 AES192 AES CAST5 ZLIB BZIP2 ZIP Uncompressed
```

3. Generate a new key

Generate a GPG key with an ASF account. For more details [Generate Key with GPG](https://infra.apache.org/openpgp.html#generate-key)

```shell
$ gpg --full-gen-key
gpg (GnuPG/MacGPG2) 2.2.34; Copyright (C) 2022 g10 Code GmbH
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
  (14) Existing key from card
Your selection? 1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0)
Key does not expire at all
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: [Your ASF LDAP username]
Email address: [Your ASF email]
Comment: CODE SIGNING KEY
You selected this USER-ID:
    "[Your ASF LDAP username] (CODE SIGNING KEY) <[Your ASF email]>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
```

You need a **[GPG PASSPHRASE]** to protect your secret key, Please remember it.

4. Find GPG Public Key ID

You can find **[GPG Public Key ID]** with the following command, Please remember it.

```shell
$ gpg --list-keys
pub   rsa4096 2022-05-05 [SC]
      [GPG Public Key ID]
uid           [ unknown] [Your ASF LDAP username] (CODE SIGNING KEY) <[Your ASF email]>
sub   rsa4096 2022-05-05 [E]
```

5. Distributing keys

Upload the **[GPG Public Key ID]** to a public keyserver `pgpkeys.mit.edu`.

```shell
gpg --keyserver pgpkeys.mit.edu --send-key [GPG Public Key ID]
```

Verify the distribution with the following command (may take a while)

```shell
gpg --keyserver hkp://pgpkeys.mit.edu --recv-keys [GPG Public Key ID]
```

If you see the following message, it means the distribution has been successful.

```shell
gpg: key [GPG Public Key ID]: "[Your ASF LDAP username] (CODE SIGNING KEY) <[Your ASF email]>" not changed
gpg: Total number processed: 1
gpg:              unchanged: 1
```

6. Add public key fingerprint to your ASF LDAP

You must also add them to your LDAP record using the Apache [self-service app](https://id.apache.org).

```shell
$ gpg --fingerprint Lei Zhang
pub   rsa4096 2022-05-05 [SC]
      [public key fingerprint]
uid           [ unknown] [Your ASF LDAP username] (CODE SIGNING KEY) <[Your ASF email]>
sub   rsa4096 2022-05-05 [E]
```

7. Back up public & private key

export public key

```shell
gpg -a -o public-file.key --export [GPG Public Key ID]
```

export private key(need GPG PASSPHRASE)

```shell
gpg -a -o private-file.key --export-secret-keys [GPG Public Key ID]
```

8. Add public key to ASF SVN KEYS

* https://dist.apache.org/repos/dist/dev/servicecomb/KEYS
* https://dist.apache.org/repos/dist/release/servicecomb/KEYS

```shell
svn co --depth=empty https://dist.apache.org/repos/dist/dev/servicecomb
svn up KEYS
cat public-file.key >> KEYS
svn commit -m 'add [Your ASF email] gpg public key'

svn co --depth=empty https://dist.apache.org/repos/dist/release/servicecomb
svn up KEYS
cat public-file.key >> KEYS
svn commit -m 'add [Your ASF email] gpg public key'
```

#### Apache Maven Configuration

We need to configure the server address, account and password of the Apache Maven repository with [Password Encryption](https://maven.apache.org/guides/mini/guide-encryption.html).

1. Create a Maven master password

```shell
$ mvn --encrypt-master-password [Maven master password]
```

Add [Encrypted Maven master password] to `~/.m2/settings-security.xml`

```xml
<settingsSecurity>
  <master>[Encrypted Maven master password]</master>
</settingsSecurity>
```

2. Encrypt your ASF LDAP password

```shell
$ mvn --encrypt-password [Your ASF LDAP password]
```

3. Encrypt [GPG PASSPHRASE]

```shell
$ mvn --encrypt-password [GPG PASSPHRASE]
```

4. Add ASF server configuration in `~/.m2/settings.xml`

```xml
<settings>
  <servers>
    <server>
      <id>apache.snapshots.https</id>
      <username>[Your ASF LDAP username]</username>
      <password>[Encrypted ASF LDAP password]</password>
    </server>
    <server>
      <id>apache.releases.https</id>
      <username>[Your ASF LDAP username]</username>
      <password>[Encrypted ASF LDAP password]</password>
    </server>
     <server>
      <id>gpg.passphrase</id>
      <passphrase>[Encrypted GPG PASSPHRASE]</passphrase>
    </server>
  </servers>
</settings>
```

## Release ServiceComb Pack

This document is based on the `0.7.0` official release process. 
Please announce the upcoming release via `dev@servicecomb.apache.org` one week before the official release to confirm that the code is ready.

```html
Hello All,

Since from last ServiceComb pack [Previous version] release, we have made significant changes, so now is the time to release the new version [Release version].

I will cut a new release tomorrow morning from the branch https://github.com/apache/servicecomb-pack/tree/[Branch name].

@PMC/@Committers please let me know if there is any important patch we need to merge before this release.

Regards
[YOUR NAME]
```

**NOTE:** The **PMC Approval** part of the release process usually takes three days to release without any PMC voting -1 officially, so plan for your release.

#### Upload to Staging Repositories

1. Clone code from GitHub

```shell
mkdir ~/Work/apache-release-workspace
cd ~/Work/apache-release-workspace
git clone https://github.com/apache/servicecomb-pack.git
```

3. Build & Deploy, **Note:** Use `-Drevision=0.7.0` to specify the version

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
mvn deploy -DskipTests -Prelease -Drevision=0.7.0
```

4. Visit `https://repository.apache.org/`, Select the artifact in Staging Repositories and click Close to complete the temporary release.

#### Verify artifacts

Before launching the vote, we need to verify the Artifacts just deployed in Staging Repositories. We need to configure some parameters to allow the acceptance test to download those Artifacts from Staging Repositories. For more details, please refer to [Guide to Testing Staged Releases](https://maven.apache.org/guides/development/guide-testing-releases.html)

1. Delete Artifacts in the local repository

```shell
rm -rf ~/.m2/repository/org/apache/servicecomb/pack
```

2. Configuring the Staging Repositories in `~/.m2/settings.xml`

```xml
<profiles>
  <profile>
    <id>staged-releases</id>
    <repositories>
      <repository>
        <id>staged-releases</id>
        <url>https://repository.apache.org/content/groups/staging/</url>
      </repository>
    </repositories>
    <pluginRepositories>
      <pluginRepository>
        <id>staged-releases</id>
        <url>https://repository.apache.org/content/groups/staging/</url>
      </pluginRepository>
    </pluginRepositories>
  </profile>
</profiles>
```

3. Run acceptance tests, **Note:** Use `-Drevision=0.7.0` to specify the version

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
mvn clean verify -f demo -Pdemo -Pdocker -Drevision=0.7.0 -Pstaged-releases -U
mvn clean verify -f acceptance-tests -Pdemo -Pdocker -Drevision=0.7.0 -Pstaged-releases
```

4. Find if there is a SNAPSHOT version in the local artifact.

```shell
find ~/.m2/repository/org/apache/servicecomb/pack -name "*-0.7.0.pom" | xargs grep "SNAPSHOT"
```

5. If everything goes well, we will create the branch `0.7.x`, tag `0.7.0`, and update the trunk version to `0.8.0-SNAPSHOT`

Create and push branch `0.7.x`

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
git checkout master
git checkout -b 0.7.x
mvn versions:set-property -Dproperty=revision -DnewVersion=0.7.0
git add pom.xml
git commit -m 'Cut 0.7.0 Release'
git push origin 0.7.x
```

Create and push tag `0.7.0` base branch 0.7.x

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
git tag -a 0.7.0 -m "ServiceComb Pack 0.7.0 Release"
git push origin 0.7.0
```

Switch trunk and Update the trunk version to `0.8.0-SNAPSHOT`

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
git checkout master
mvn versions:set-property -Dproperty=revision -DnewVersion=0.8.0-SNAPSHOT
git add pom.xml
git commit -m 'Update Release Number to 0.8.0-SNAPSHOT'
git push origin master
```

#### Sign the Release & Upload to ASF SVN

1. Checkout Apache dev Release SVN

```shell
mkdir ~/Work/apache-release-workspace/dist
cd ~/Work/apache-release-workspace/dist
svn co https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack --username=[你的 ASF LDAP 用户名] --password=[你的 ASF LDAP 密码]
```

2. Create a new directory Apache dev Release SVN with release package name and release candidate number.

```shell
mkdir -p ~/Work/apache-release-workspace/dist/servicecomb-pack/0.7.0/rc1
```

3. Copy the release to the directory created in last step.

```shell
cd ~/Work/apache-release-workspace/dist/servicecomb-pack/0.7.0/rc1
cp ~/Work/apache-release-workspace/servicecomb-pack/distribution/target/apache-servicecomb-pack-distribution-0.7.0-bin.zip .
cp ~/Work/apache-release-workspace/servicecomb-pack/distribution/target/apache-servicecomb-pack-distribution-0.7.0-bin.zip.asc .
cp ~/Work/apache-release-workspace/servicecomb-pack/distribution/target/apache-servicecomb-pack-distribution-0.7.0-src.zip .
cp ~/Work/apache-release-workspace/servicecomb-pack/distribution/target/apache-servicecomb-pack-distribution-0.7.0-src.zip.asc .
```

4. Generate sha 512 checksum

```shell
cd ~/Work/apache-release-workspace/dist/servicecomb-pack/0.7.0/rc1
shasum -a 512 apache-servicecomb-pack-distribution-0.7.0-bin.zip >> apache-servicecomb-pack-distribution-0.7.0-bin.zip.sha512
shasum -a 512 apache-servicecomb-pack-distribution-0.7.0-src.zip >> apache-servicecomb-pack-distribution-0.7.0-src.zip.sha512
```

5. Upload the release to the SVN

```shell
cd ~/Work/apache-release-workspace/dist/servicecomb-pack
svn add 0.7.0
svn commit -m 'prepare for 0.7.0 RC1'  --username=[Your ASF LDAP username] --password=[Your ASF LDAP password]
```

6. Download all the releases from SVN and verify the signature and checksum.

```shell
mkdir ~/Work/apache-release-workspace/verify
cd ~/Work/apache-release-workspace/verify
curl -O https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc1/apache-servicecomb-pack-distribution-0.7.0-bin.zip
curl -O https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc1/apache-servicecomb-pack-distribution-0.7.0-bin.zip.asc
curl -O https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc1/apache-servicecomb-pack-distribution-0.7.0-bin.zip.sha512
curl -O https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc1/apache-servicecomb-pack-distribution-0.7.0-src.zip
curl -O https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc1/apache-servicecomb-pack-distribution-0.7.0-src.zip.asc
curl -O https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc1/apache-servicecomb-pack-distribution-0.7.0-src.zip.sha512
```

Verify checksum

```shell
cd ~/Work/apache-release-workspace/verify
shasum -c apache-servicecomb-pack-distribution-0.7.0-bin.zip.sha512
shasum -c apache-servicecomb-pack-distribution-0.7.0-src.zip.sha512
```

Import KEYS

```shell
curl https://dist.apache.org/repos/dist/dev/servicecomb/KEYS >> KEYS
$ gpg --import KEYS
```  

Verify the PGP signature

```shell
cd ~/Work/apache-release-workspace/verify
gpg --verify apache-servicecomb-pack-distribution-0.7.0-bin.zip.asc apache-servicecomb-pack-distribution-0.7.0-bin.zip
gpg --verify apache-servicecomb-pack-distribution-0.7.0-src.zip.asc apache-servicecomb-pack-distribution-0.7.0-src.zip
```

#### Creating release notes

[Creating release notes on JIRA](https://confluence.atlassian.com/adminjiraserver/creating-release-notes-938847219.html)

#### PMC Approval

Send voting email `[VOTE] Release Apache ServiceComb Pack version 0.7.0` to `dev@servicecomb.apache.org`.

```html
Hi all,

This is a call for Vote to release Apache ServiceComb Pack version 0.7.0

Release Candidate:
https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc1/

Staging Repository:
https://repository.apache.org/content/repositories/orgapacheservicecomb-1490

Release Tag:
https://github.com/apache/servicecomb-pack/releases/tag/0.7.0

Release CommitID:
fae7326c0bac2b07e06ba83cf2cc284648ab1713

Release Notes:
https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12321626&version=12348307

Keys to verify the Release Candidate:
https://dist.apache.org/repos/dist/dev/servicecomb/KEYS

Voting will start now (Thursday, 12th May 2022) and will remain open for
at-least 72 hours, Request all PMC members to give their vote.

[ ] +1 Release this package as 0.7.0
[ ] +0 No Opinion
[ ] -1 Do not release this package because...

On behalf of the ServiceComb Team

Regards
[YOUR NAME]
```

Wait for 72 hours. You need to send the vote closed notice to `dev@servicecomb.apache.org`.

```html
Hi All,

Thanks all for voting on this release, the vote has been closed now, and we will announce the results shortly.

Regards
[YOUR NAME]
```

Unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from **Release ServiceComb Pack**. 
Publish the result of the vote in `dev@servicecomb.apache.org`

```html
Hello All,

We are glad to announce that ServiceComb community has approved the Apache ServiceComb Pack 0.7.0 release with the following results:

+1 binding: 3 ([PMC],[PMC],[PMC],...)

We will be publishing the release binaries soon.

On behalf of ServiceComb Team

Thanks all for your participation in this vote.

Regards
[YOUR NAME]
```

#### Announcements

1. Visit `https://repository.apache.org/` Select the staging repository and click the release button to finish the release. It will be automatically synchronized to [Maven Central Repository](https://mvnrepository.com/repos/central) after a while.

2. Upload files from Apache dev Release SVN to Apache dist Release SVN

```shell
mkdir -p ~/Work/apache-release-workspace/release
cd ~/Work/apache-release-workspace/release
svn co https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-pack
mkdir -p ~/Work/apache-release-workspace/release/servicecomb-pack/0.7.0
cp ~/Work/apache-release-workspace/dist/servicecomb-pack/0.7.0/rc1/* ~/Work/apache-release-workspace/release/servicecomb-pack/0.7.0
cd ~/Work/apache-release-workspace/release/servicecomb-pack
svn add 0.7.0
svn commit -m 'Upload ServiceComb Pack 0.7.0 Release'
```

3. Delete Pack Release Candidate 0.7.0

```shell
cd ~/Work/apache-release-workspace/dist/servicecomb-pack
rm -rf 0.7.0
svn delete 0.7.0
svn commit -m 'Remove ServiceComb Pack 0.7.0 RC'
```

4. Delete Pack Release 0.6.0

```shell
cd ~/Work/apache-release-workspace/release/servicecomb-pack
rm -rf 0.6.0
svn delete 0.6.0
svn commit -m 'Remove ServiceComb Pack 0.6.0 Release'
```

5. Wait [Maven Central Repository](https://mvnrepository.com/repos/central) sync completed

6. Create a Release of 0.7.0 Tag on GitHub

Visit `https://github.com/apache/servicecomb-pack/releases/tag/0.7.0`, click the `Create release from tag` button, and the content reference [JIRA Release Notes](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12321626&version=12348307)

7. Update [ServiceComb Website](https://github.com/apache/servicecomb-website)

* https://github.com/apache/servicecomb-website/blob/master/_release/cn/pack_downloads.md
* https://github.com/apache/servicecomb-website/blob/master/_release/cn/pack_releaseNotes.md
* https://github.com/apache/servicecomb-website/blob/master/_release/cn/release.md
* https://github.com/apache/servicecomb-website/blob/master/_release/pack_downloads.md
* https://github.com/apache/servicecomb-website/blob/master/_release/pack_releaseNotes.md
* https://github.com/apache/servicecomb-website/blob/master/_release/release.md
* https://github.com/apache/servicecomb-website/blob/master/_pages/cn/home.md
* https://github.com/apache/servicecomb-website/blob/master/_pages/home.md

8. Send the announcement mails `[ANNOUNCE] Apache ServiceComb Pack version 0.7.0 Released` to dev@servicecomb.apache.org, announce@apache.org

```html
Hello All,

Apache ServiceComb Team is glad to announce the release of Apache
ServiceComb Pack 0.7.0

Apache ServiceComb Pack(https://github.com/apache/servicecomb-pack) is an
eventually data consistency solution for micro-service applications.
ServiceComb Pack currently has TCC and Saga distributed transaction
coordination protocol. ServiceComb Pack is composed of Alpha which plays
as a coordinator for the management of transactions and Omega which plays
as an agent and is an integral part of micro-services intercepting the
outgoing/incoming requests and reports transaction events to Alpha.

Download Links: https://servicecomb.apache.org/release/pack-downloads/

Release Notes: https://servicecomb.apache.org/release/pack-release-notes/

Know more about ServiceComb: https://servicecomb.apache.org/

ServiceComb Useful Links :
- JIRA: https://issues.apache.org/jira/browse/SCB
- Mailing lists: dev@servicecomb.apache.org
- Gitter: https://gitter.im/ServiceCombUsers/Saga

On behalf of ServiceComb Team

Regards
[YOUR NAME]
```
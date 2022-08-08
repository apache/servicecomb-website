---
title: "ServiceComb Pack Release Guide"
lang: cn
ref: release
permalink: /cn/release/pack-release-guide/
excerpt: "ServiceComb Pack 发行指南"
last_modified_at: 2022-08-06T00:50:43-55:00
---

## 发布环境准备

#### 生成签名密钥

1. 安装 GPG

在[GnuPG官网](https://www.gnupg.org/download/index.html)下载 2.X 安装包. 安装完毕后可以使用如下命令查看版本

```shell
$ gpg --version
gpg (GnuPG/MacGPG2) 2.2.20
libgcrypt 1.8.5
Copyright (C) 2020 Free Software Foundation, Inc.
```

2. 配置 GPG

安装完毕后你可以找到 `$HOME/.gnupg/gpg.conf` 文件，并增加如下[推荐配置](https://infra.apache.org/openpgp.html#sha-defaults)

```properties
personal-digest-preferences SHA512
cert-digest-algo SHA512
default-preference-list SHA512 SHA384 SHA256 SHA224 AES256 AES192 AES CAST5 ZLIB BZIP2 ZIP Uncompressed
```

3. 用 GPG 生成密钥

根据提示使用 ASF 邮箱生成 GPG 的密钥，更多详细说明请参考 [Generate Key with GPG](https://infra.apache.org/openpgp.html#generate-key)

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

Real name: [你的 ASF 账号]
Email address: [你的 ASF 邮箱]
Comment: CODE SIGNING KEY
You selected this USER-ID:
    "[你的 ASF 账号] (CODE SIGNING KEY) <[你的 ASF 邮箱]>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
```

生成密钥的过程中会提示你输入一个**[密钥密码]**用来保护你的密钥，请记住这个密钥密码

4. 查看 GPG 公钥ID

你可以使用如下命令查看生成的密钥，请保存 **[公钥ID]**。

```shell
$ gpg --list-keys
pub   rsa4096 2022-05-05 [SC]
      [公钥ID]
uid           [ unknown] [你的 ASF 账号] (CODE SIGNING KEY) <[你的 ASF 邮箱]>
sub   rsa4096 2022-05-05 [E]
```

5. 发布公钥到密钥服务器

使用 **[公钥ID]** 将公钥发布到 `pgpkeys.mit.edu`，发布后稍等一会就会自动同步到其他密钥服务器

```shell
gpg --keyserver pgpkeys.mit.edu --send-key [公钥ID]
```

使用如下命令验证公钥是否发布成功（因为发布后后台需要同步，所以可能需等待一会）

```shell
gpg --keyserver hkp://pgpkeys.mit.edu --recv-keys [公钥ID]
```

如果你看到如下信息，说明已经发布成功

```shell
gpg: key [公钥ID]: "[你的 ASF 账号] (CODE SIGNING KEY) <[你的 ASF 邮箱]>" not changed
gpg: Total number processed: 1
gpg:              unchanged: 1
```

6. 发布公钥指纹到 ASF 用户信息中

使用以下命令生成公钥指纹，登录 https://id.apache.org, 将下面**公钥指纹**粘贴到自己的用户信息中 OpenPGP Public Key Primary Fingerprint 中。

```shell
$ gpg --fingerprint Lei Zhang
pub   rsa4096 2022-05-05 [SC]
      [公钥指纹]
uid           [ unknown] [你的 ASF 账号] (CODE SIGNING KEY) <[你的 ASF 邮箱]>
sub   rsa4096 2022-05-05 [E]
```

7. 备份公钥和私钥（不是发布流程的必须环节）

你可以使用以下方式备份密钥

导出公钥

```shell
gpg -a -o public-file.key --export [公钥ID]
```

导出私钥(需要生成密钥时的密码)

```shell
gpg -a -o private-file.key --export-secret-keys [公钥ID]
```

8. 将公钥追加到以下两个文件中

* https://dist.apache.org/repos/dist/dev/servicecomb/KEYS
* https://dist.apache.org/repos/dist/release/servicecomb/KEYS

```shell
svn co --depth=empty https://dist.apache.org/repos/dist/dev/servicecomb
svn up KEYS
cat public-file.key >> KEYS
svn commit -m 'add [你的 ASF 邮箱] gpg public key'

svn co --depth=empty https://dist.apache.org/repos/dist/release/servicecomb
svn up KEYS
cat public-file.key >> KEYS
svn commit -m 'add [你的 ASF 邮箱] gpg public key'
```

#### Apache Maven 认证配置

在发布前我们需要配置 Apache Maven 仓库的服务器地址、账号和密码。为了安全我们使用 [Password Encryption](https://maven.apache.org/guides/mini/guide-encryption.html) 对 Apache LDAP 密码加密

1. 创建一个主密码

使用如下命令创建一个 **[主密码]**，并生成 **[加密后的主密码]**

```shell
$ mvn --encrypt-master-password [主密码]
```

将[加密后的主密码]配置在 ~/.m2/settings-security.xml 文件中

```xml
<settingsSecurity>
  <master>[加密后的主密码]</master>
</settingsSecurity>
```

2. 加密你的 ASF LDAP 密码

```shell
$ mvn --encrypt-password [你的 ASF LDAP 密码]
```

3. 加密你生成 GPG 密钥时输入的 [密钥密码]

```shell
$ mvn --encrypt-password [密钥密码]
```

4. 在 `~/.m2/settings.xml` 文件中配置发布服务器地址和加密后的密码

```xml
<settings>
  <servers>
    <server>
      <id>apache.snapshots.https</id>
      <username>[你的 ASF 账号]</username>
      <password>[加密后的 ASF LDAP 密码]</password>
    </server>
    <server>
      <id>apache.releases.https</id>
      <username>[你的 ASF 账号]</username>
      <password>[加密后的 ASF LDAP 密码]</password>
    </server>
     <server>
      <id>gpg.passphrase</id>
      <passphrase>[加密后的密钥密码]</passphrase>
    </server>
  </servers>
</settings>
```

## ServiceComb Pack 发布

本文档基于 `0.7.0` 正式版发布过程编写。在正式开始发布之前请提前一周通过 `dev@servicecomb.apache.org` 预告即将开始发布，确认代码是否已经准备就绪。

```html
Hello All,

Since from last ServiceComb pack [Previous version] release, we have made significant changes, so now is the time to release the new version [Release version].

I will cut a new release tomorrow morning from the branch https://github.com/apache/servicecomb-pack/tree/[Branch name].

@PMC/@Committers please let me know if there is any important patch we need to merge before this release.

Regards
[Your name]
```

**注意:** 发布流程中的 **PMC投票** 环节通常需要 3 天，在没有任何 PMC 投 -1 票后才能正式发布，因此请提前计划发布活动。

#### 发布到临时筹备库（Staging Repositories）

1. 使用 ASF LDAP 账号登录 `https://repository.apache.org/` 清除 Staging Repositories 中与 Pack 相关的多余版本

2. 下载代码

```shell
mkdir ~/Work/apache-release-workspace
cd ~/Work/apache-release-workspace
git clone https://github.com/apache/servicecomb-pack.git
```

3. 执行 Maven 部署命令，**注意：使用 `-Drevision=0.7.0` 设置要发布的版本号**

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
mvn deploy -DskipTests -Prelease -Drevision=0.7.0
```

4. 使用 ASF LDAP 账号登录 `https://repository.apache.org/`，在 Staging Repositories 中选择刚刚发布的 repository，点击 Close 后完成临时发布。

#### 测试临时筹备库中的 Artifacts

在发起投票前，我们需要测试 Staging Repositories 中刚刚发布的 Artifacts ，我们需要配置一些参数，让验收测试从 Staging Repositories 中拉取依 Artifacts，更多详细说明可以参考 [Guide to Testing Staged Releases](https://maven.apache.org/guides/development/guide-testing-releases.html)

1. 删除本地仓库中 Artifacts

```shell
rm -rf ~/.m2/repository/org/apache/servicecomb/pack
```

2. 在 `~/.m2/settings.xml` 中增加如下配置

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

3. 执行验收测试，**注意：使用 `-Drevision=0.7.0` 设置要发布的版本号**

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
mvn clean verify -f demo -Pdemo -Pdocker -Drevision=0.7.0 -Pstaged-releases -U
mvn clean verify -f acceptance-tests -Pdemo -Pdocker -Drevision=0.7.0 -Pstaged-releases
```

4. 检查本地 Artifacts 中是否还存未替换的 SNAPSHOT 版本 

```shell
find ~/.m2/repository/org/apache/servicecomb/pack -name "*-0.7.0.pom" | xargs grep "SNAPSHOT"
```

5. 如果一切正常，我们将创建 `0.7.x` 分支， `0.7.0` TAG，修改主干版本号为 `0.8.0-SNAPSHOT`

创建并推送 `0.7.x` 分支

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
git checkout master
git checkout -b 0.7.x
mvn versions:set-property -Dproperty=revision -DnewVersion=0.7.0
git add pom.xml
git commit -m 'Cut 0.7.0 Release'
git push origin 0.7.x
```

在 0.7.x 分支上创建并推送 `0.7.0` TAG

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
git tag -a 0.7.0 -m "ServiceComb Pack 0.7.0 Release"
git push origin 0.7.0
```

切换到主版本，修改版本号为 `0.8.0-SNAPSHOT` 并推送

```shell
cd ~/Work/apache-release-workspace/servicecomb-pack
git checkout master
mvn versions:set-property -Dproperty=revision -DnewVersion=0.8.0-SNAPSHOT
git add pom.xml
git commit -m 'Update Release Number to 0.8.0-SNAPSHOT'
git push origin master
```

#### 签署版本 & 上传到 ASF SVN 仓库

1. 拉取 SVN 仓库到本地

```shell
mkdir ~/Work/apache-release-workspace/dist
cd ~/Work/apache-release-workspace/dist
svn co https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack --username=[你的 ASF LDAP 用户名] --password=[你的 ASF LDAP 密码]
```

2. 创建发布包目录

如果你是第 1 次发布 0.7.0 版本，那么创建 `0.7.0/rc1` 目录，例如：

```shell
mkdir -p ~/Work/apache-release-workspace/dist/servicecomb-pack/0.7.0/rc1
```

3. 复制发布包到发布目录

```shell
cd ~/Work/apache-release-workspace/dist/servicecomb-pack/0.7.0/rc1
cp ~/Work/apache-release-workspace/servicecomb-pack/distribution/target/apache-servicecomb-pack-distribution-0.7.0-bin.zip .
cp ~/Work/apache-release-workspace/servicecomb-pack/distribution/target/apache-servicecomb-pack-distribution-0.7.0-bin.zip.asc .
cp ~/Work/apache-release-workspace/servicecomb-pack/distribution/target/apache-servicecomb-pack-distribution-0.7.0-src.zip .
cp ~/Work/apache-release-workspace/servicecomb-pack/distribution/target/apache-servicecomb-pack-distribution-0.7.0-src.zip.asc .
```

4. 生成 SHA512 签名

```shell
cd ~/Work/apache-release-workspace/dist/servicecomb-pack/0.7.0/rc1
shasum -a 512 apache-servicecomb-pack-distribution-0.7.0-bin.zip >> apache-servicecomb-pack-distribution-0.7.0-bin.zip.sha512
shasum -a 512 apache-servicecomb-pack-distribution-0.7.0-src.zip >> apache-servicecomb-pack-distribution-0.7.0-src.zip.sha512
```

5. 上传到 ASF SVN 仓库

```shell
cd ~/Work/apache-release-workspace/dist/servicecomb-pack
svn add 0.7.0
svn commit -m 'prepare for 0.7.0 RC1'  --username=[你的 ASF LDAP 用户名] --password=[你的 ASF LDAP 密码]
```

6. 验证候选版本

从 https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc1/ 下载发布包检查 GPG 签名和 SHA512

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

检查 SHA512 哈希

```shell
cd ~/Work/apache-release-workspace/verify
shasum -c apache-servicecomb-pack-distribution-0.7.0-bin.zip.sha512
shasum -c apache-servicecomb-pack-distribution-0.7.0-src.zip.sha512
```

导入公钥

```shell
curl https://dist.apache.org/repos/dist/dev/servicecomb/KEYS >> KEYS
$ gpg --import KEYS
```  

检查 GPG 签名

```shell
cd ~/Work/apache-release-workspace/verify
gpg --verify apache-servicecomb-pack-distribution-0.7.0-bin.zip.asc apache-servicecomb-pack-distribution-0.7.0-bin.zip
gpg --verify apache-servicecomb-pack-distribution-0.7.0-src.zip.asc apache-servicecomb-pack-distribution-0.7.0-src.zip
```

#### 整理发布说明

你需要检查 Jira 上的 ISSUE 是否都已更新，然后参考 [Creating release notes](https://confluence.atlassian.com/adminjiraserver/creating-release-notes-938847219.html) 生成发布说明

#### PMC 发布投票

发送投票邮件 `[VOTE] Release Apache ServiceComb Pack version 0.7.0` 到 `dev@servicecomb.apache.org`，你可以参考如下邮件模版：

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
[Your name]
```

等待 72 小时后，你可以通过 `dev@servicecomb.apache.org` 发送投票截止通知。

```html
Hi All,

Thanks all for voting on this release, the vote has been closed now, and we will announce the results shortly.

Regards
[Your name]
```

你可以通过 `dev@servicecomb.apache.org` 发布投票结果，如果您获得了至少三个 binding +1 投票，并且没有任何一个 binding -1 的投票，那么你可以继续发布。否则请解决问题并从 **ServiceComb Pack 发布** 重新开始。

```html
Hello All,

We are glad to announce that ServiceComb community has approved the Apache ServiceComb Pack 0.7.0 release with the following results:

+1 binding: 3 ([PMC Name],[PMC Name],[PMC Name],...)

We will be publishing the release binaries soon.

On behalf of ServiceComb Team

Thanks all for your participation in this vote.

Regards
[Your name]
```

#### 公告

1. 使用 ASF LDAP 账号登录 `https://repository.apache.org/` 选择 Staging Repositories 之前的 Artifacts，点击 Release 按钮。需要一段时间后会自动同步到 [Maven Central Repository](https://mvnrepository.com/repos/central) 中央库。

2. 上传发布包到 ASF 仓库

将 https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0/rc01/ 下的内容上传到 https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-pack/0.7.0

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

3. 删除之前的 RC 版本

删除 https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/0.7.0

```shell
cd ~/Work/apache-release-workspace/dist/servicecomb-pack
rm -rf 0.7.0
svn delete 0.7.0
svn commit -m 'Remove ServiceComb Pack 0.7.0 RC'
```

4. 删除之前的 0.6.0 Release 版本

删除 https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-pack/0.6.0/

```shell
cd ~/Work/apache-release-workspace/release/servicecomb-pack
rm -rf 0.6.0
svn delete 0.6.0
svn commit -m 'Remove ServiceComb Pack 0.6.0 Release'
```

5. 等待 [Maven Central Repository](https://mvnrepository.com/repos/central) 中央库已经同步完毕

6. 在 Github 上创建 0.7.0 Tag 的 Release

打开 `https://github.com/apache/servicecomb-pack/releases/tag/0.7.0` 点击 `Create release from tag` 按钮。发布内容填写来自 Jira 的 [Release Notes](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12321626&version=12348307)

7. 更新 [ServiceComb Website](https://github.com/apache/servicecomb-website)

* https://github.com/apache/servicecomb-website/blob/master/_release/cn/pack_downloads.md
* https://github.com/apache/servicecomb-website/blob/master/_release/cn/pack_releaseNotes.md
* https://github.com/apache/servicecomb-website/blob/master/_release/cn/release.md
* https://github.com/apache/servicecomb-website/blob/master/_release/pack_downloads.md
* https://github.com/apache/servicecomb-website/blob/master/_release/pack_releaseNotes.md
* https://github.com/apache/servicecomb-website/blob/master/_release/release.md
* https://github.com/apache/servicecomb-website/blob/master/_pages/cn/home.md
* https://github.com/apache/servicecomb-website/blob/master/_pages/home.md

8. 发送 `[ANNOUNCE] Apache ServiceComb Pack version 0.7.0 Released` 邮件到 `dev@servicecomb.apache.org` 和 `announce@apache.org`

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
[Your name]
```
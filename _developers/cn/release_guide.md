---
title: "ServiceComb发版指南"
lang: cn
ref: release_guide
permalink: /cn/developers/release-guide/
excerpt: "ServiceComb发版指南 介绍如何在Apache发版"
last_modified_at:  2018-05-08T09:55:44+08:00
author: Asif Siddiqui
tags: [发版]
redirect_from:
  - /theme-setup/
---

本文向大家介绍如何在Apache上进行ServiceComb项目发版.

## 前期准备

1. 项目CI应该是正常的（绿色的）。
2. 确定相关的项目版本号。
3. 因为发版的过程中需要签名，请确保签名用密钥对应公钥已经发布到公开公钥服务器。
4. 熟悉POM文件中版本发行相关的设置。

## 配置Maven
ServiceComb Java-Chassis和Saga使用Maven进行版本发布，我们需要在发布前对Maven进行一些配置。

在使用Maven把发行包发布到仓库之前，我们应当在`~/.m2/settings.xml`文件中配置制品为组群可写的，否则其它开发人员将无法提交相同制品的新SNAPSHOT版本。本项目参考了Maven项目的设定[指南](http://maven.apache.org/developers/committer-settings.html)。请特别注意[加密密码](http://maven.apache.org/guides/mini/guide-encryption.html)。

```
<settings>
  ...
  <servers>
    <!-- Per http://maven.apache.org/developers/committer-settings.html -->

    <!-- To publish a snapshot of some part of Maven -->
    <server>
      <id>apache.snapshots.https</id>
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <password> <!-- YOUR APACHE LDAP PASSWORD --> </password>
    </server>
    <!-- To publish a website of some part of Maven -->
    <server>
      <id>apache.website</id>
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <filePermissions>664</filePermissions>
      <directoryPermissions>775</directoryPermissions>
    </server>
    <!-- To stage a release of some part of Maven -->
    <server>
      <id>apache.releases.https</id>
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <password> <!-- YOUR APACHE LDAP PASSWORD --> </password>
    </server>
    <!-- To stage a website of some part of Maven -->
    <server>
      <id>stagingSite</id> <!-- must match hard-coded repository identifier in site:stage-deploy -->
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <filePermissions>664</filePermissions>
      <directoryPermissions>775</directoryPermissions>
    </server>

  </servers>
  ...
  <profiles>
    <profile>
      <id>apache-release</id>
      <properties>
        <gpg.useagent>false</gpg.useagent>
        <gpg.passphrase><!-- YOUR GPG PASSPHRASE --></gpg.passphrase>
        <test>false</test>
      </properties>
    </profile>

  </profiles>
...
</settings>
```

## 发行Service-Center

***准备和校验发行包***

1. 克隆service-center代码。
```
git@github.com:apache/incubator-servicecomb-service-center.git
cd incubator-servicecomb-service-center
gvt restore
```

2. 在master分支上打上准备发布版本的标签。

3. 运行RAT工具，检查所有源文件头都有合法的ASF声明, 请参考[该文档](https://github.com/apache/incubator-servicecomb-service-center/tree/master/docs/release)。

4. 运行`make_release.sh`脚本，请参考[该文档](https://github.com/apache/incubator-servicecomb-service-center/tree/master/scripts/release)。

5. 上一步将会在根目录下生成发行包。

6. 在Linux与Windows环境下运行前端与service-center。

7. 进行[集成测试](https://github.com/apache/incubator-servicecomb-service-center/tree/master/integration)。

8. 如果以上全部测试都通过了，将发行包分发给同事在不同机器上进行验证。

9. 将标签推送到主仓库。

***给发行包签名***

10. 从Github下载要发行版本[标签](https://github.com/apache/incubator-servicecomb-service-center/tags)的源码包。

11. 生成Linux发行包，Windows发行包和源码包的签名和校验和。

12. 上传发行版到[Apache发行开发仓库](https://dist.apache.org/repos/dist/dev/incubator/servicecomb/incubator-servicecomb-service-center/).

13. 从SVN下载发行包，验证签名和校验。

***PPMC批准***

14. 发送投票邮件至 ***dev@servicecomb.apache.org***， 发起PPMC批准.

15. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题并从***第1步***重新开始。

16. 将投票结果发布到dev@servicecomb.apache.org。

***IPMC批准***

17. 发送投票邮件至***general@incubator.apache.org***，发起IPMC批准。

18. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题并从***第1步***重新开始。

19. 将投票结果发布到general@incubator.apache.org。

***通告***

20. 上传发行包至[Apache发行仓库](https://dist.apache.org/repos/dist/release/incubator/servicecomb/incubator-servicecomb-service-center/)。

21. 等待24小时，让所有镜像同步。

22. 上传发行页面至ServiceComb网站。

23. 发送发行通告邮件到dev@servicecomb.apache.org， general@incubator.apache.org， announce@apache.org。




## 发行Java-Chassis

***准备和校验发行包***

1. 克隆java-chassis代码。
```
git clone git@github.com:apache/incubator-servicecomb-java-chassis.git
```

2. 使用以下perl命令，替换所有pom.xml文件中的版本号并提交改动至本地。
```
find . -name 'pom.xml'|xargs perl -pi -e 's/1.0.0-m2-SNAPSHOT/1.0.0-m2/g'
```

3. 在master分支上打上准备发布版本的标签。

4. 清理repository.apache.org中所有冗余的发行版。

5. 将GPG密钥文件拷贝至文件夹备用。

6. 更新`~/.m2/settings.xml`文件中的GPG密钥文件路径和密码.

7. 更新设置内Apache帐户用户名和密码。

8. 运行以下命令。
```
mvn deploy -DskipTests -Prelease -Pdistribution -Ppassphrase
```

9. 上述命令执行成功，所有的jar包都成功上传至临时仓库后，运行Company Workshop作基本的功能验证。

10. 将临时仓库共享给多人，在不同的机器和环境上进行验证。

11. 如果验证全部通过，将标签提交至主仓库。

12. 清理Apache临时仓库。

***给发行包签名***

13. 从临时仓库下载二进制包和源码包。

14. 生成二进制包和源码包的签名和校验和。

15. 上传发行包到[Apache发行开发仓库](https://dist.apache.org/repos/dist/dev/incubator/servicecomb/incubator-servicecomb-java-chassis/).
.

16. 从SVN下载发行包，验证签名和校验。

***PPMC批准***

17. 发送投票邮件至 ***dev@servicecomb.apache.org***， 发起PPMC批准.

18. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题并从***第1步***重新开始。

19. 将投票结果发布到dev@servicecomb.apache.org。

***IPMC批准***

20. 发送投票邮件至***general@incubator.apache.org***，发起IPMC批准。

21. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题并从***第1步***重新开始。

22. 将投票结果发布到general@incubator.apache.org。

***通告***

23. 上传发行包至[Apache发行仓库](https://dist.apache.org/repos/dist/release/incubator/servicecomb/incubator-servicecomb-java-chassis/)。

24. 等待24小时，让所有镜像同步。

25. 上传发行页面至ServiceComb网站。

26. 发送发行通告邮件到dev@servicecomb.apache.org， general@incubator.apache.org， announce@apache.org。




## 发行Saga

***准备和校验发行包***

1. 克隆Saga代码。
```
git@github.com:apache/incubator-servicecomb-saga.git
```

2. 使用以下perl命令，替换所有pom.xml文件中的版本号并提交改动至本地。
```
find . -name 'pom.xml'|xargs perl -pi -e 's/1.0.0-m2-SNAPSHOT/1.0.0-m2/g'
```

3. 在master分支上打上准备发布版本的标签。

4. 清理repository.apache.org中所有冗余的发行版。

5. 将GPG密钥文件拷贝至文件夹备用。

6. 更新`~/.m2/settings.xml`文件中的GPG密钥文件路径和密码.

7. 更新设置内Apache帐户用户名和密码。

8. 运行以下命令。
```
mvn deploy -DskipTests -Prelease -Pdistribution -Ppassphrase
```

9. 上述命令执行成功，所有的jar包都成功上传至临时仓库后，运行门槛测试以验证基本功能。

10. 将临时仓库共享给多人，在不同的机器和环境上进行验证。

11. 如果验证全部通过，将标签提交至主仓库。

12. 清理Apache临时仓库。

***给发行包签名***

13. 从临时仓库下载二进制包和源码包。

14. 生成二进制包和源码包的签名和校验和。

15. 上传发行包到[Apache发行开发仓库](https://dist.apache.org/repos/dist/dev/incubator/servicecomb/incubator-servicecomb-java-chassis/).
.

16. 从SVN下载发行包，验证签名和校验。

***PPMC批准***

17. 发送投票邮件至 ***dev@servicecomb.apache.org***， 发起PPMC批准.

18. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题并从***第1步***重新开始。

19. 将投票结果发布到dev@servicecomb.apache.org。

***IPMC批准***

20. 发送投票邮件至***general@incubator.apache.org***，发起IPMC批准。

21. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题并从***第1步***重新开始。

22. 将投票结果发布到general@incubator.apache.org。

***通告***

23. 上传发行包至[Apache发行仓库](https://dist.apache.org/repos/dist/release/incubator/servicecomb/incubator-servicecomb-saga/)。

24. 等待24小时，让所有镜像同步。

25. 上传发行页面至ServiceComb网站。

26. 发送发行通告邮件到dev@servicecomb.apache.org， general@incubator.apache.org， announce@apache.org。


**注意**
整个发行过程通常需要2周时间，如果PPMC投票和IPMC全部都一次性通过。因此请提前准备发行活动。

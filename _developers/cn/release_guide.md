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

{% include toc %}

本文向大家介绍如何在Apache上进行ServiceComb项目发版.

## 前期准备

1. 项目CI应该是正常的（绿色的）。
2. 确定发布版本号。
3. 因为发版的过程中需要使用[密钥](https://www.apache.org/dev/openpgp.html#generate-key)对[发布版本进行签名](https://www.apache.org/dev/release-signing)，请确保密钥中的公钥已经[发布](https://www.apache.org/dev/openpgp.html#publish-in-web-space)到公钥服务器。
4. 熟悉maven版本发行相关的设置。

## 配置Maven
ServiceComb Java-Chassis和Saga使用Maven进行版本发布，我们需要在发布前对Maven进行一些配置。

在使用Maven把发行包发布到仓库之前，参考了Maven项目的设定[指南](http://maven.apache.org/developers/committer-settings.html)。请特别注意[加密密码](http://maven.apache.org/guides/mini/guide-encryption.html)。

```
<settings>
  ...
  <servers>
    <!-- Per http://maven.apache.org/developers/committer-settings.html -->

    <!-- To stage a release of some part of Maven -->
    <server>
      <id>apache.releases.https</id>
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <password> <!-- YOUR APACHE LDAP PASSWORD --> </password>
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
git clone https://github.com/apache/servicecomb-service-center.git
cd servicecomb-service-center
gvt restore
```

2. 在master分支上打上准备发布版本的标签。

3. 运行RAT工具，检查所有源文件头都有合法的ASF声明, 请参考[该文档](https://github.com/apache/servicecomb-service-center/tree/master/docs/release)。

4. 运行`make_release.sh`脚本，请参考[该文档](https://github.com/apache/servicecomb-service-center/tree/master/scripts/release)。

5. 上一步将会在根目录下生成发行包。

6. 在Linux与Windows环境下运行前端与service-center。

7. 进行[集成测试](https://github.com/apache/servicecomb-service-center/tree/master/integration)。

8. 如果以上全部测试都通过了，将发行包分发给同事在不同机器上进行验证。

9. 将标签推送到主仓库。

***给发行包签名***

10. 从Github下载要发行版本[标签](https://github.com/apache/servicecomb-service-center/tags)的源码包。

11. 生成Linux发行包，Windows发行包和源码包的签名和校验和。

12. 上传发行版到[Apache发行开发仓库](https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-service-center/).

13. 从SVN下载发行包，验证签名和校验。

***PMC批准***

14. 发送投票邮件至 ***dev@servicecomb.apache.org***， 发起PMC批准.

15. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题并从***第1步***重新开始。

16. 将投票结果发布到dev@servicecomb.apache.org。


***通告***

20. 上传发行包至[Apache发行仓库](https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-service-center/)。

21. 等待24小时，让所有镜像同步。

22. 将[dev](https://dist.apache.org/repos/dist/dev)的文件移动到[release](https://dist.apache.org/repos/dist/release)目录中，同时确认已经被存档,同时更新网站上相关链接。

23. 上传发行页面至ServiceComb网站。

24. 发送发行通告邮件到dev@servicecomb.apache.org， announce@apache.org。




## 发行Java-Chassis

***准备和校验发行包***

1. 如果`~/.gnupg`中没有GPG密钥文件，则将GPG密钥文件拷贝至`~/.gnupg`文件夹。
  ```
  gpg.conf
  pubring.gpg
  random_seed
  secring.gpg
  trustdb.gpg
  ```

2. 更新`~/.m2/settings.xml`文件中的GPG密码。

3. 更新`~/.m2/settings.xml`文件中的Apache帐户用户名和密码。

4. 克隆java-chassis代码
```
git clone https://github.com/apache/servicecomb-java-chassis.git
```

5. 使用以下perl命令，替换所有pom.xml文件中的版本号并提交改动至本地
```
find . -name 'pom.xml'|xargs perl -pi -e 's/1.0.0-m2-SNAPSHOT/1.0.0-m2/g'
```

6. 在需要release的分支上打上准备发布版本的标签。

7. 运行以下命令
```
mvn clean deploy -DskipTests -Prelease -Pdistribution -Ppassphrase
```

8. 如果执行失败，需要解决问题，从步骤7重新开始。

9. 如果步骤7命令执行成功，则所有的jar包都已经成功上传至maven临时仓库。  
   使用apache帐号登录到[Apache Nexus](https://repository.apache.org/)，点击“Staging Repositories”，搜索“servicecomb”，根据时间找到最近的java-chassis相关的记录，close该条记录，得到maven临时仓库的链接，例如：`https://repository.apache.org/content/repositories/orgapacheservicecomb-1385`

10. 将release分支以及标签分别push至主仓库。


***给发行包签名***

11. 从临时仓库下载二进制包及签名  
  例如：  
  `https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip`  
  `https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip.asc`

12. 从临时仓库下载源码包及签名  
  例如：  
  `https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-src.zip`  
  `https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-src.zip.asc`

13. 生成二进制包和源码包的校验和  
  例如：  
  `sha512sum -b apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip > apache-servicecomb-java-chassis-distribution-1.2.0-bin.zi.sha512`  
  `sha512sum -b apache-servicecomb-java-chassis-distribution-1.2.0-src.zip > apache-servicecomb-java-chassis-distribution-1.2.0-src.zip.sha512`  

14. 将步骤11、12、13相关的文件，上传到[Apache开发仓库](https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-java-chassis/).  
  SVN命令：
  ```
  svn co https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-java-chassis
  cd serviecomb-java-chassis
  mkdir -p 1.2.0/rc01
  cp xxx/* 1.2.0/rc01
  svn add 1.2.0/rc01
  svn ci 1.2.0/rc01
  ```

15. 从SVN下载发行包，验证签名和校验。

***PMC批准***

17. 发送投票邮件至 ***dev@servicecomb.apache.org***， 发起PMC批准.
  模板：
  ```

  ```


18. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题，并删除主仓库的release版本对应的标签，并从***第1步***重新开始。

19. 将投票结果发布到dev@servicecomb.apache.org。


***通告***

20. 将[dev](https://dist.apache.org/repos/dist/dev)的文件移动到[release](https://dist.apache.org/repos/dist/release)目录中，同时确认已经被存档,同时更新网站上相关链接。
    同时删除[Apache开发仓库](https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-java-chassis/)中的目录
    ```
    svn rm -r 1.2.0
    checkin?
    ```
    使用apache帐号登录到[Apache Nexus](https://repository.apache.org/)，点击“Staging Repositories”，搜索“servicecomb”，选中java-chassis相关的所有记录，点击“Drop”。

    使用apache帐号登录到[Apache Nexus](https://repository.apache.org/)，点击“Staging Repositories”，搜索“servicecomb”，找到需要发布的java-chassis记录，点击“Release”。

21. 等待24小时，让所有镜像同步。

22. 上传发行页面至ServiceComb网站。
   fork https://github.com/apache/servicecomb-website/
   1.总版本，url
   2.java-chassis的RN和download（url）
   3.中文、英文
   PR

23. 发送发行通告邮件到dev@servicecomb.apache.org， announce@apache.org。
    模板：
    ```
    ```

## 发行Pack

***准备和校验发行包***

1. 如果`~/.gnupg`中没有GPG密钥文件，则将GPG密钥文件拷贝至`~/.gnupg`文件夹。
  ```
  gpg.conf
  pubring.gpg
  random_seed
  secring.gpg
  trustdb.gpg
  ```

2. 更新`~/.m2/settings.xml`文件中的GPG密码。

3. 更新`~/.m2/settings.xml`文件中的Apache帐户用户名和密码。

4. 克隆Pack代码。
```
git clone https://github.com/apache/servicecomb-pack.git
```

5. 使用以下perl命令，替换所有pom.xml文件中的版本号并提交改动至本地。
```
find . -name 'pom.xml'|xargs perl -pi -e 's/1.0.0-m2-SNAPSHOT/1.0.0-m2/g'
```
6. 在需要release的分支上打上准备发布版本的标签。

7. 运行以下命令。
```
mvn deploy -DskipTests -Prelease -Pdistribution -Ppassphrase
```

8. 上述命令执行成功，所有的jar包都成功上传至临时仓库后，运行门槛测试以验证基本功能。

8. 如果执行失败，需要解决问题，从步骤7重新开始。

9. 如果步骤7命令执行成功，则所有的jar包都已经成功上传至maven临时仓库。  
   使用apache帐号登录到[Apache Nexus](https://repository.apache.org/)，点击“Staging Repositories”，搜索“servicecomb-pack”，根据时间找到最近的pack相关的记录，close该条记录，得到maven临时仓库的链接，例如：`https://repository.apache.org/content/repositories/orgapacheservicecomb-1385`

10. 将release分支以及标签分别push至主仓库。

***给发行包签名***

13. 从临时仓库下载二进制包和源码包。

14. 生成二进制包和源码包的签名和校验和。

15. 上传发行包到[Apache发行开发仓库](https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-pack/).
.

16. 从SVN下载发行包，验证签名和校验。

***PMC批准***

17. 发送投票邮件至 ***dev@servicecomb.apache.org***， 发起PMC批准.

18. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题并从***第1步***重新开始。

19. 将投票结果发布到dev@servicecomb.apache.org。

***通告***

23. 上传发行包至[Apache发行仓库](https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-pack/)。

24. 等待24小时，让所有镜像同步。

25. 将[dev](https://dist.apache.org/repos/dist/dev)的文件移动到[release](https://dist.apache.org/repos/dist/release)目录中，同时确认已经被存档,同时更新网站上相关链接。

26. 上传发行页面至ServiceComb网站。

27. 发送发行通告邮件到dev@servicecomb.apache.org， announce@apache.org。

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

发布版本前，首先确定该版本所有的 apache issues 都已经关闭， 并且
登录 [apache issue 网站](https://issues.apache.org/jira/projects/SCB)， 点击发布， 生成该版本的 release notes。 

* ***准备待发布版本***

  clone 需要发布版本的分支到开发环境（比如 master）， 修改版本号， 并提交代码到仓库。
  假设当前版本为 `2.0.0-SNAPSHOT`，发布版本为 `2.0.0`。 执行：

        ```
        mvn versions:set -DgenerateBackupPoms=false -DnewVersion=2.0.0
        ```
        
  然后执行：

        ```
        mvn clean install -Pit
        ```
        
  如果编译成功，可以提交PR，代码检视通过后合入仓库。

* ***进行软件包发布***

  需要准备 Linux 开发环境，并确保网络能够往 maven 中央库上传文件。

1. 如果 `~/.gnupg` 中没有GPG密钥文件，则将GPG密钥文件拷贝至 `~/.gnupg` 文件夹。 文件列表如下：

        ```
        gpg.conf
        pubring.gpg
        random_seed
        secring.gpg
        trustdb.gpg
        ```

2. 更新 `~/.m2/settings.xml` 文件中的GPG密码。

3. 更新 `~/.m2/settings.xml` 文件中的Apache帐户用户名和密码。

4. 克隆java-chassis代码

        ```
        git clone https://github.com/apache/servicecomb-java-chassis.git
        ```
   
5. 运行以下命令。运行过程中可能需要输入 gpg 密码，

        ```
        mvn clean deploy -DskipTests -Prelease -Pdistribution
        ```
        
    如果提示 gpg 失败， 尝试执行下面的命令后，重新执行上面的命令：

        ```
        export GPG_TTY=$(tty)
        ```

6. 如果执行失败，需要解决问题。 并参考第7步`drop`临时仓库，重新执行第5步。

7. 如果步骤5命令执行成功，则所有的jar包都已经成功上传至maven临时仓库。  
    使用apache帐号登录到 [Apache Nexus](https://repository.apache.org/) ，点击 “Staging Repositories”， 搜索 “servicecomb”，
    根据时间找到最近的java-chassis相关的记录，close该条记录，得到maven临时仓库的链接，例
    如：`https://repository.apache.org/content/repositories/orgapacheservicecomb-1385`。

8. 在 servicecomb-java-chassis 的 github 的 release 页面，点击 release， 发布 pre release 版本， 打上 tag 。

* ***给发行包签名***

1. 从临时仓库下载二进制包及签名， 例如：
 
        ```
        https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip  
        https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip.asc
        ``` 

2. 从临时仓库下载源码包及签名，例如：

        ```
        https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-src.zip
        https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-src.zip.asc
        ```  

3. 生成二进制包和源码包的校验和，例如：

        ```
        sha512sum -b apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip > apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip.sha512  
        sha512sum -b apache-servicecomb-java-chassis-distribution-1.2.0-src.zip > apache-servicecomb-java-chassis-distribution-1.2.0-src.zip.sha512  
        ```  

4. 将上述步骤相关的文件，上传到 [Apache开发仓库](https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-java-chassis/) 。 SVN命令：

        ```
        svn co https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-java-chassis
        cd serviecomb-java-chassis
        mkdir -p 1.2.0/rc01
        cp xxx/* 1.2.0/rc01
        svn add 1.2.0
        svn ci 1.2.0
        ```

5. 从SVN下载发行包，验证签名和校验。

* ***PMC批准***

1. 发送投票邮件至 ***dev@servicecomb.apache.org***， 发起PMC批准.

2. 等待72小时，或者获得3票+1并且没有-1。如果有-1票，修正问题，重新开始版本发布流程（视具体的失败情况，可能
    需要重新生成 release notes，删除svn临时文件，删除临时`Staging repositories`等）。

3. 将投票结果发布到dev@servicecomb.apache.org。

* ***更新文档和通告***

1. 在 servicecomb-java-chassis 的 github 的 release 页面，将 pre release 修改为正式 release。完成 release notes书写。

2. 将 [dev](https://dist.apache.org/repos/dist/dev) 的文件移动到 [release](https://dist.apache.org/repos/dist/release) 目录中。

        ```
        cp dev/servicecomb/servicecomb-java-chassis/2.0.0/* release/servicecomb/servicecomb-java-chassis/2.0.0/
        cd release/servicecomb/servicecomb-java-chassis/
        svn add 2.0.0
        svn ci 2.0.0
        ```

    同时删除 [dev](https://dist.apache.org/repos/dist/dev) 的临时内容。

        ```
        svn rm 1.2.0
        svn ci .
        ```

3. 使用apache帐号登录到 [Apache Nexus](https://repository.apache.org/)，点击 “Staging Repositories” ，搜索 “servicecomb” ，
    找到需要发布的 java-chassis 记录，点击 “Release” 。 如果由其他临时 “Staging Repositories” ，可以点击 “Drop” 一并删除。

4. 等待24小时，让所有镜像同步。

5. 更新官网发布信息。 修改内容可以参考 [1.3.0 RP](https://github.com/apache/servicecomb-website/pull/210)
    或者 [2.0.0 RP](https://github.com/apache/servicecomb-website/pull/240)

6. 发送发行通告邮件到 `dev@servicecomb.apache.org`， `announce@apache.org`。

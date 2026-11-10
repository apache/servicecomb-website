---
title: "ServiceComb发版指南"
lang: cn
ref: release_guide
permalink: /cn/developers/release-guide/
excerpt: "ServiceComb发版指南 介绍如何在Apache发版"
last_modified_at: 2026-11-10T00:00:00+00:00
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

## 发布批准与完成检查

仅创建 Git 标签、GitHub Release 或通过投票，并不代表 Apache 正式发布已经完成。请遵循 [ASF 发布政策](https://www.apache.org/legal/release-policy.html)和[下载页面要求](https://infra.apache.org/release-download-pages.html)。

### PMC 批准要求 {#pmc-approval}

- 发起投票前，检查实际待投票的签名源码包、校验和、构建与测试，以及许可证合规性（包括 `LICENSE`、`NOTICE`、ASF 源码声明和捆绑的第三方内容）。逐项审核 RAT 结果，不能仅凭数量判断合规性。将签名公钥加入项目的 `KEYS` 文件，并使用它验证候选包。
- 向 `dev@servicecomb.apache.org` 发送 `[VOTE]`，注明候选包地址及 SVN 修订号、Git 标签和提交、校验和、`KEYS` 以及使用的临时仓库。
- 发布投票 SHOULD 保持开放至少 72 小时，不能仅因已经收到三票赞成就提前结束。缩短投票时间时，投票邮件 MUST 说明需要加急的特殊原因；偏离政策的情况 MUST 向董事会报告，通常可在下次定期报告中说明。
- 通过投票需要至少三票来自 PMC 成员的有效 +1，且有效赞成票多于反对票。发布投票没有否决权，但需要调查反对意见，并在发布前解决违反政策的问题。
- 向 `dev@servicecomb.apache.org` 发送 `[RESULT]`，记录实际起止时间、有效票数、投票讨论链接和获批的具体候选包。投票通过后，不得重新构建、替换或悄悄修改已投票的制品。

### 发布完成清单 {#publication-checklist}

发布经理为每项保存核验依据，完成后才能将版本标记为已发布：

- [ ] 将 `dist/dev/servicecomb` 中选定 RC 的获批制品、签名（`.asc`）和校验和（`.sha512`）原样移至 `dist/release/servicecomb` 下对应组件和版本的目录。记录 SVN 修订号和制品哈希。发布经理如没有 `dist/release` 写权限，应请有权限的 PMC 成员执行。
- [ ] 等待分发同步，然后从 `https://downloads.apache.org/servicecomb/` 下载每个已发布的制品、签名、校验和及项目 `KEYS`。使用已发布的公钥验证签名，检查校验和，并与获批 RC 比较。SVN 提交成功或等待时间届满都不能代替可用性验证。通告前继续采用项目现有的 24 小时等待时间；ASF 指南要求更新下载页或发送通告前至少等待一小时。
- [ ] 部署英文和中文下载页及发布说明。跟随 `closer.lua` 链接检查实际的当前版本文件；签名、校验和及 `KEYS` 使用指向 `downloads.apache.org` 的 HTTPS 直链。检查已部署页面上每个变更链接，包括准确的文件名和版本目录。不要发布不存在的可选二进制包链接。移除旧版本前，先确认其文件已在 `archive.apache.org/dist/servicecomb/` 存档，并更新或移除受影响的链接。
- [ ] ASF 分发与下载页面核验完成后，才发布 GitHub Release 信息，并链接到项目官方下载页。仅引导最终用户使用 ASF 分发的正式制品，不引导至 GitHub 自动生成的源码压缩包、`dist/dev` 候选包或临时仓库。未完成的 GitHub 发布说明保持为未公开草稿。
- [ ] 发送包含项目官方下载页链接的通告。在发布记录中保留投票及结果链接、SVN 修订号、核验结果、已部署页面检查结果和通告链接。检查失败时先修复，不能发送通告或将发布标记为完成。

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

3. 运行 RAT，并根据前述许可证检查要求逐项审核结果，区分 ASF 源码和捆绑的第三方内容。请参考[该文档](https://github.com/apache/servicecomb-service-center/tree/master/docs/release)。

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

遵循 [PMC 批准要求](#pmc-approval)，完成候选包核验、投票及结果邮件。

***通告***

依次完成[发布完成清单](#publication-checklist)：将获批候选包发布到 [Apache 发行仓库](https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-service-center/)，核验 ASF 下载，部署并检查官网，再发布 GitHub Release 信息，向 `dev@servicecomb.apache.org` 和 `announce@apache.org` 发送通告。


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

8. 将发布说明保存为未公开的 GitHub 草稿。不要发布 GitHub pre-release，也不要引导最终用户使用候选包。

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

遵循 [PMC 批准要求](#pmc-approval)，完成候选包核验、投票及结果邮件。

* ***更新文档和通告***

1. 仅将选定且获批 RC 的制品、签名和校验和原样移至 [Apache 发行仓库](https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-java-chassis/)对应版本目录。不要复制所有 RC 目录，也不要从 Git 标签重新构建。

2. 完成[发布完成清单](#publication-checklist)中的分发核验。在已发布文件验证成功前，保留临时候选包。

3. 使用 Apache 帐号登录 [Apache Nexus](https://repository.apache.org/)，发布投票邮件中明确指定的、已关闭的临时仓库，不能仅按时间选择最新仓库。Maven 发布不能代替 ASF 源码分发。

4. 部署并核验中英文官网的下载页和发布说明。页面结构可参考 [1.3.0 PR](https://github.com/apache/servicecomb-website/pull/210) 或 [2.0.0 PR](https://github.com/apache/servicecomb-website/pull/240)，但应使用当前待发布版本已验证的链接。清理旧版本前，确认存档并更新受影响的链接。

5. ASF 下载核验和网站部署完成后，再发布 GitHub Release 信息，并链接到项目官方下载页。

6. 完成清单中的通告和记录事项，所有检查通过后才向 `dev@servicecomb.apache.org` 和 `announce@apache.org` 发送通告。

---
title: "SonarCloud集成指南"
lang: cn
ref: sonarcloud-how-to
permalink: /cn/developers/sonarcloud-how-to/
excerpt: "SonarCloud集成指南"
last_modified_at:  2019-11-15T16:55:44+08:00
author: Daniel Qian
redirect_from:
  - /theme-setup/
---

{% include toc %}

本文向大家介绍如何在Apache ServiceComb中集成SonarCloud。

## 步骤

1. 首先你是Github的Apache组织的成员。
2. 用你的Github账号登录 [sonarcloud.io](https://sonarcloud.io)。
3. 在 [Jira Infrastructure ](https://issues.apache.org/jira/projects/INFRA/) 创建一个JIRA请求在SonarCloud中创建项目，样式可参考[这个](https://issues.apache.org/jira/browse/INFRA-19444)。在这个JIRA中要提供仓库的Github地址，project-key（在SonarCloud中唯一表示你项目的ID），作为项目Admin的Github账号，一般来说就是你自己。
4. 等待INFRA团队替你创建项目。然后你能在SonarCloud中看到了。
5. 根据SonarCloud中的指示修改你的`.travis.yml`

注意：

因为Travis不支持在PR中启用SonarCloud集成，因此你需要对构建脚本做类似下面的改动：

```bash
echo "TRAVIS_PULL_REQUEST=$TRAVIS_PULL_REQUEST"
if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo "Not a pull request build, running build with sonar"
  mvn ... sonar:sonar -Dsonar.projectKey=<project-key>
else
  echo "Pull request build or local build"
  mvn ...
fi;
```

## 参考资料

* [Apache CWiki - SonarQube Analysis](https://cwiki.apache.org/confluence/display/INFRA/SonarQube+Analysis)
* [Travis - SonarCloud](https://docs.travis-ci.com/user/sonarcloud/)


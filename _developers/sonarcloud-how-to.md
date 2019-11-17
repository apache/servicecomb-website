---
title: "How to Use SonarCloud"
lang: en
ref: sonarcloud-how-to
permalink: /developers/sonarcloud-how-to/
excerpt: "SonarCloud集成指南"
last_modified_at:  2019-11-15T16:55:44+08:00
author: Daniel Qian
redirect_from:
  - /theme-setup/
---

{% include toc %}

This guide helps you to integrate SonarCloud in your Travis build.

## Steps

1. First, you should be member of Apache Orgnization in Github.
2. Login to  [sonarcloud.io](https://sonarcloud.io) with your Github credentials.
3. Create an JIRA ticket in  [Infrastructure ](https://issues.apache.org/jira/projects/INFRA/) asking to create a project at SonarCloud, here is an [example](https://issues.apache.org/jira/browse/INFRA-19444). You should provde Github repo url, project-key (the id of your project in SonarCloud), Github id for the Admin of this project, generally speaking that's yours.
4. Wait for the INFRA team creating the project, after that you will see it at SonarCloud.
5. Follow the SonarCloud instructions modify project's `.travis.yml`

### About Shallow Clone

Travis [use shallow clone by default](https://docs.travis-ci.com/user/customizing-the-build/#git-clone-depth), and SonarCloud needs commit information, so you need to disable shallow clone:

```yaml
git:
  depth: false
```

### About PR

Travis doesn't support SonarCloud in PR build, you should modify your build script like this:

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

## References

* [Apache CWiki - SonarQube Analysis](https://cwiki.apache.org/confluence/display/INFRA/SonarQube+Analysis)
* [Travis - SonarCloud](https://docs.travis-ci.com/user/sonarcloud/)


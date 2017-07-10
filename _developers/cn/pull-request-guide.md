---
title: "如何提交Pull Request"
lang: cn
ref: pull-request-guide
permalink: /cn/developers/pull-request-guide/
date: 2017-06-28T03:02:20+00:00
---

在Github上面可以很方便地提交Pull Request (PR),  下面将以ServiceComb/java-chassis 项目为例（如果是其他项目，请替换项目名），向大家介绍如果提交PR。

## 配置git仓库

首先，使用Github提供的fork功能将ServiceComb/java-chassis代码库到自己的github账号，然后将代码克隆到本地：

```git clone https://github.com/<your_github_name>/java-chassis.git```

克隆到本地origin会默认指向github上的远程fork地址。
有时我们需要将ServiceComb java-chassis 本地的master。为此，必须向下面示例一样为ServiceComb Java Chassis镜像添加远程关联：

```git remote add upstream https://github.com/ServiceComb/java-chassis.git```

检查远程设置：

```git remote –v```

你会看到如下信息：

    origin https://github.com/<your_github_name>/java-chassis.git (fetch)
    origin    https://github.com/<your_github_name>/java-chassis.git (push)
    upstream  https://github.com/ServiceComb/java-chassis.git (fetch)
    upstream  https://github.com/ServiceComb/java-chassis.git (push)

你可以通过git fetch和git rebase来更新本地的master，操作如下：

	git fetch upstream master
	git rebase upstream/master

当前分支的所有操作默认情况下都会指向你的github帐户对应fork项目，因为“origin”是默认的。在你准备把代码合入到远程ServiceComb Java Chassis之前，都可以在当前分支操作。进行代码合入时，一般你需要拉出一个分支（java-chassis-xxxx，xxxx通常是一个JIRA单号）来做合并的操作，示例如下：

	git checkout -b jav-xxxx


## 如何创建一个PR

在创建PR之前，请确认：

*  创建了一个相应的JIRA问题，并给出了清晰的问题描述。

*  是否遵守编码规则。

*  有单元测试，随时可用。

针对Github中ServiceComb/java-chassis创建Pull Request。

1. push你的分支到github：

		git checkout java-chassis-xxxx
		git commit -a -m "xxxx doing some work"
		git push origin java-chassis-xxxx

2. 然后到github界面切换到你的java-chassis-xxxx分支。
3. 点击“New pull request”按钮，“base fork”默认是ServiceComb/java-chassis，“head fork”是你fork的仓库，“compare”是你的java-chassis-xxxx分支。
4. 点击“Create pull request”，然后填上Title/Write备注你此次提交PR的JIRA单号和目的，然后再次点击“Create pull request”就创建好了PR。
5. 现在PR呈现在github上的ServiceComb/java-chassis上。
6. 你的pull request会被committers检视和评论。当所有的检视者都认可后，pull request就会被接受合入了。

**Note:**创建pull requests详细信息，请参考[GitHub PR docs](https://help.github.com/articles/creating-a-pull-request/)合并一个PR。
{: .notice--warning}

## 关闭PR

   当我们想撤销一个PR（关闭不提交），我们可以打开对应PR然后点击关闭当前PR的按钮即可撤销该PR。

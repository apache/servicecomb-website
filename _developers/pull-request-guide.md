---
title: "如何提交Pull Request"
lang: en
ref: pull-request-guide
permalink: /developers/pull-request-guide/   
excerpt: "本文向开发者介绍如何向 ServiceComb 代码库提交 PR "   
last_modified_at: 2017-09-08T20:26:43-20:46
---

{% include toc %}

　　在 [Github](https://github.com/ServiceComb) 上面可以很方便地提交 [Pull Request (PR)](https://help.github.com/articles/about-pull-requests/)，下面将以本网站项目[ServiceComb/ServiceComb.github.io](https://github.com/ServiceComb/ServiceComb.github.io) 为例（如果是其他项目，请替换项目名ServiceComb.github.io）。

## Fork仓库

　　进入 ServiceComb/ServiceComb.github.io 的 [github 页面](https://github.com/ServiceComb/ServiceComb.github.io) ，点击右上角按钮 `Fork` 进行 Fork。

![体质指数应用运行界面](/assets/images/fork-repo.jpg){: .align-center}

## 配置git和提交修改

- 将代码克隆到本地：

  ```shell
  git clone https://github.com/<your_github_name>/ServiceComb.github.io.git
  ```

  注意：请将 \<your\_github\_name\> 替换为您的github名字。


　　clone完成后，origin会默认指向github上的远程fork地址。

- 将 ServiceComb/ServiceComb.github.io 添加为本地仓库的远程分支 upstream：

  ```shell
  cd ServiceComb.github.io
  git remote add upstream https://github.com/ServiceComb/ServiceComb.github.io.git
  ```


- 检查远程仓库设置：

  ```shell
  git remote –v
  origin https://github.com/<your_github_name>/ServiceComb.github.io.git (fetch)
  origin    https://github.com/<your_github_name>/ServiceComb.github.io.git (push)
  upstream  https://github.com/ServiceComb/ServiceComb.github.io.git (fetch)
  upstream  https://github.com/ServiceComb/ServiceComb.github.io.git (push)
  ```


- 新建分支以便在分支上做修改：

  ```shell
  git checkout -b <your_branch_name>
  ```


　　注意： \<your\_branch\_name\> 为您自定义的分支名字。

　　创建完成后可进行代码更改。

- 提交代码到远程分支：

  ```shell
  git commit -a -m "<you_commit_message>"
  git push origin <your_branch_name>
  ```

　　更多 git 使用方法请访问：[git 使用](https://www.atlassian.com/git/tutorials/setting-up-a-repository)，这里不赘述。

## 创建PR

　　在浏览器切换到自己的 github 页面，切换分支到提交的分支 \<your\_branch\_name\> ，依次点击 `New pull request` 和 `Create pull request` 按钮进行创建，如下图所示：

![体质指数应用运行界面](/assets/images/new-pr.jpg){: .align-center}
fig-1 New pull request 
{: .figure-caption}

![体质指数应用运行界面](/assets/images/create-pr.jpg){: .align-center}
fig-2 Create pull request 
{: .figure-caption}

　　至此，您的PR创建完成，更多关于 PR 请阅读 [collaborating-with-issues-and-pull-requests](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/) 。
## 下一步

　　请阅读[社区页面](http://servicecomb.io/cn/about/community/)加入开发者邮件列表。

---
title: "代码提交指南"
lang: en 
ref: submit-codes
permalink: /developers/submit-codes/
excerpt: "介绍如何向 ServiceComb 项目提交代码"
last_modified_at: 2017-09-08T20:26:43-20:46
---

{% include toc %}

## 贡献途径
　　ServiceComb正在不断成长中，也希望能找到更多志同道合的同伴一起成长和进步。向ServiceComb 贡献的途径有多种：
* 完善文档。完善网站上的文档或者项目中的介绍文档和API说明文档。其中，网站文档的完善可通过网站最底端的**报告本网页问题**或**在Github上编辑此页**对文档内容进行完善。
* 实现功能特性需求或修复BUG。项目的功能特性需求或者已发现但未修复的BUG都会在项目中的issue处看到，以[Saga](https://github.com/apache/incubator-servicecomb-saga/issues)项目为例，一般都会带有类似 **enhancement** 或类似 **bug** 的标签来说明这是功能需求还是BUG，读者可以结合自己的兴趣点来选择。此外，您也可以通过日常使用或阅读代码时发现BUG并以Issue的方式进行描述并针对该BUG提交PR，帮助我们进一步改进。同时，也欢迎您提出需求并在实现后提交PR。

   ![寻觅功能需求示例](/assets/images/find-features-by-example.png){: .align-center}

## 运行测试
　　在您提交代码前，请先按照项目README中说明的自动测试部分对代码的功能性和实现上的正确性进行验证。

## PR指南
　　在 [Github](https://github.com/search?q=org%3Aapache+servicecomb) 上面可以很方便地提交 [Pull Request (PR)](https://help.github.com/articles/about-pull-requests/)，下面将以本网站项目[apache/incubator-servicecomb-website](https://github.com/apache/incubator-servicecomb-website) 为例（如果是其他项目，请替换项目名incubator-servicecomb-website）。

### Fork仓库

　　进入 apache/incubator-servicecomb-website 的 [github 页面](https://github.com/apache/incubator-servicecomb-website) ，点击右上角按钮 `Fork` 进行 Fork。

![体质指数应用运行界面](/assets/images/fork-repo.jpg){: .align-center}

### 配置git和提交修改

- 将代码克隆到本地：

  ```shell
  git clone https://github.com/<your_github_name>/incubator-servicecomb-website.git
  ```

  注意：请将 \<your\_github\_name\> 替换为您的github名字。


　　clone完成后，origin会默认指向github上的远程fork地址。

- 将  apache/incubator-servicecomb-website 添加为本地仓库的远程分支 upstream：

  ```shell
  cd  incubator-servicecomb-website
  git remote add upstream https://github.com/apache/incubator-servicecomb-website.git
  ```


- 检查远程仓库设置：

  ```shell  
  git remote -v
  origin https://github.com/<your_github_name>/incubator-servicecomb-website.git (fetch)
  origin    https://github.com/<your_github_name>/incubator-servicecomb-website.git (push)
  upstream  https://github.com/apache/incubator-servicecomb-website.git (fetch)
  upstream  https://github.com/apache/incubator-servicecomb-website.git (push)
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

### 创建PR

　　在浏览器切换到自己的 github 页面，切换分支到提交的分支 \<your\_branch\_name\> ，依次点击 `New pull request` 和 `Create pull request` 按钮进行创建，如下图所示：

![体质指数应用运行界面](/assets/images/new-pr.jpg){: .align-center}
fig-1 New pull request 
{: .figure-caption}

![体质指数应用运行界面](/assets/images/create-pr.jpg){: .align-center}
fig-2 Create pull request 
{: .figure-caption}

　　至此，您的PR创建完成，更多关于 PR 请阅读 [collaborating-with-issues-and-pull-requests](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/) 。

### 冲突解决
　　提交PR时的代码冲突一般是由于多人编辑同一个文件引起的，解决冲突主要通过以下步骤即可：
1. 切换至主分支
   ```bash
   git checkout master
   ```
2. 同步远端主分支至本地
   ```bash
   git pull upstream master
   ```
3. 切换回刚才的分支（假设分支名为fix）
   ```bash
   git checkout fix 
   ```
4. 进行rebase
   ```bash
   git rebase -i master
   ```
   此时会弹出修改记录的文件，一般直接保存即可。然后会提示哪些文件出现了冲突，此时可打开冲突文件对冲突部分进行修改，将提示的所有冲突文件的冲突都解决后，执行
   ```bash
   git add .
   git rebase --continue
   ```
   依此往复，直至屏幕出现类似 *rebase successful* 字样即可，此时您可以进行往提交PR的分支进行更新：
   ```bash
   git push -f origin fix
   ```

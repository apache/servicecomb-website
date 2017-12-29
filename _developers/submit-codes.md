---
title: "Howto Submit Code"
lang: en 
ref: submit-codes
permalink: /developers/submit-codes/
excerpt: "Howto submit code for SerivceComb"
last_modified_at: 2017-09-08T20:26:43-20:46
---

{% include toc %}

## Contributing
   ServiceComb is still growing and we hope that more will join us to share this. There are many ways to contribute:
* Improve documents. Help us improve the documents on this site or the API documentation. For the documents on this site, you can find links **Report a Doc Issue** or **Edit This Page on Github** to start.
* Implement feature request or fix bugs. You can find all the feature request and bug reports on the projects' issues pages. Take [Saga](https://github.com/apache/incubator-servicecomb-saga/issues) as an example, issues will be labeled as **enhancement** or **bug**, you can choose the ones you are interested in. Bug reports and new feature requests are also welcomed.

   ![Find Features](/assets/images/find-features-by-example.png){: .align-center}

## Run tests
    Before submitting code, make sure that you have properly tested the functionality and verified the implementation according to the auto test section in README.

## How to submit a PR
　　It's quite convenient to submit a [Pull Request(PR)](https://help.github.com/articles/about-pull-requests/) on [Github](https://github.com/search?q=org%3Aapache+servicecomb). Take the [apache/incubator-servicecomb-website](https://github.com/apache/incubator-servicecomb-website) as an example:

### Fork repository

　　Visit the apache/incubator-servicecomb-website project's [github page](https://github.com/apache/incubator-servicecomb-website), click `Fork` button on the right left cornor.

![Fork Repository](/assets/images/fork-repo.jpg){: .align-center}

### Setup local repository

- Clone the source code to local machine:

  ```shell
  git clone https://github.com/<your_github_name>/incubator-servicecomb-website.git
  ```

  Note: substitute \<your\_github\_name\> with your github username.

  After the clone is done, the origin remote will point to the default branch of the cloned repository.

- Add apache/incubator-servicecomb-website as upstream remote:

  ```shell
  cd  incubator-servicecomb-website
  git remote add upstream https://github.com/apache/incubator-servicecomb-website.git
  ```
- Check the local repository's remotes

  ```shell  
  git remote -v
  origin https://github.com/<your_github_name>/incubator-servicecomb-website.git (fetch)
  origin    https://github.com/<your_github_name>/incubator-servicecomb-website.git (push)
  upstream  https://github.com/apache/incubator-servicecomb-website.git (fetch)
  upstream  https://github.com/apache/incubator-servicecomb-website.git (push)
  ```

- Create a new branch to start working

  ```shell
  git checkout -b <your_branch_name>
  ```
  
  Note: replace \<your\_branch\_name\> with an actual branch name at your choice, like feature-foo/bugfix-bar
  Now you can start coding.

- Push the changes to a remote repository

  ```shell
  git commit -a -m "<you_commit_message>"
  git push origin <your_branch_name>
  ```

　For more on git usages, please visit[Git tutorial](https://www.atlassian.com/git/tutorials/setting-up-a-repository).

### Create PR
  Goto your github page, find the apache/incubator-servicecomb-website project, swich to the branch you just pushed, click on `New pull request` and then `Create pull request`, see the image below:

![New Pull Request](/assets/images/new-pr.jpg){: .align-center}
fig-1 New pull request 
{: .figure-caption}

![Create Pull Request](/assets/images/create-pr.jpg){: .align-center}
fig-2 Create pull request 
{: .figure-caption}

  Congrautulations, now you have succesfully submitted a PR. For more on PR, please read [collaborating-with-issues-and-pull-requests](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/) 。

### Resolve conflicts
  When a same piece of file is edited by multiple person simultaneously, conflicts can occur. It can be resolved as follow:

1. Switch to the master branch
   ```bash
   git checkout master
   ```
2. Pull the upstream's master branch
   ```bash
   git pull upstream master
   ```
3. Switch back to the branch we are working on(e.g. fix)
   ```bash
   git checkout fix 
   ```
4. Rebase the working branch onto the master branch
   ```bash
   git rebase -i master
   ```
   A list of commits will be listed on your text editor. Normally we can just save and exit.
   Git will now apply the commits one by one onto the master branch until it encounters a conflict. When this happens, the rebase process is paused. We need to resolve the conflicts, then execute
   ```bash
   git add .
   git rebase --continue
   ```
   Repeat this process until all commits are successfully applied. And finally run 
   ```bash
   git push -f origin fix
   ```
   to push the resolved branch to remote origin

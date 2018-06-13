---
title: "Howto Use JIRA"
lang: en
ref: use-jira
permalink: /developers/use-jira/
excerpt: "How to use JIRA"
last_modified_at: 2018-02-28T11:26:43-20:46
---

{% include toc %}

## JIRA使用简介
　　JIRA是Atlassian公司出品的项目与实务跟踪工具，被广泛应用于缺陷跟踪、客户实务、需求收集、流程审批、任务跟踪、项目跟踪和敏捷管理等工作领域。ServiceComb使用JIRA进行缺陷和任务跟踪，本文将简单介绍在ServiceComb的开发过程中如何使用JIRA。

## 注册并登陆到JIRA
　　在浏览器中打开[JIRA注册页面](https://issues.apache.org/jira/secure/Signup!default.jspa)，填入个人邮箱，姓名等注册信息后即可注册。注册成功后登录并进入[ServiceComb项目](https://issues.apache.org/jira/projects/SCB/)

## 查看issues
​	登录到JIRA后左侧面板依次是Kanban, Releases, Reports, Issues, Components. Kanban内容如下图，展示了当前需要完成的任务（73 To Do），正在解决中任务（3 In Progress）和已经解决的任务（79 Done），所有任务的编号都以SCB（ServiceComb的简写）开头，可以点击任务栏查看每个任务的详细信息。

![](/assets/images/kanban.png){: .align-center}

​	点击左侧面板中Issues可以看到所有的任务并支持自定义过滤规则进行筛选查看，点击右上角View all issues and filters即可进行过滤，默认过滤规则包括任务类型、任务进度、负责人、当前状态等，也可以使用Advanced功能进行高级过滤筛选。

![](/assets/images/filter.png){: .align-center}

## 新建issue

​	点击Create可以新建一个issue，创建的时候需要选择issue类型，包括Task, Bug, Feature, Improvement等，选择类型后在Summary中简单描述一下issue内容，需要详细说明的可以在Description中填写更多内容，需要注意的是ServiceComb包含四个子项目，分别是Java Chassis, Saga, Service-Center和website，所以创建issue的时候要选择具体对应的Component来指定issue属于哪个子项目。

![](/assets/images/issue.png){: .align-center}

​	创建好issue后可以将issue指定给自己，启动任务Start Progress，待问题解决后Resolve Issue或Close Issue即可，如下图：

![](/assets/images/progress.png){: .align-center}

​	通过提交代码解决该issue的时候需要在创建的PR的title上以issue的SCB编号开头，如下图中[SCB-327]

![](/assets/images/pr.png){: .align-center}

​	JIRA更多使用方法请参考[官方文档](https://confluence.atlassian.com/jiracoreserver076/getting-started-as-a-user-945112029.html)。

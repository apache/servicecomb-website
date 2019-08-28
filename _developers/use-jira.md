---
title: "Howto Use JIRA"
lang: en
ref: use-jira
permalink: /developers/use-jira/
excerpt: "How to use JIRA"
last_modified_at: 2018-02-28T11:26:43-20:46
---

{% include toc %}

## JIRA Introduction
JIRA is a task and issue tracking system of Atlassian. It is widely used in defect tracking, customer practice, demand collection, process approval, task tracking, project tracking and agile management. ServiceComb uses JIRA for bug and task tracking. This article will briefly describe how to use JIRA during the development of ServiceComb.

## Login JIRA
Open the [JIRA registration page] (https://issues.apache.org/jira/secure/Signup!default.jspa) in your browser, fill in your personal email address, name and other registration information to register. Log in and enter the [ServiceComb project] after registration (https://issues.apache.org/jira/projects/SCB/)

## View issues
After logging in to JIRA, the left panel is followed by Kanban, Releases, Reports, Issues, Components. Kanban content is shown below, showing the tasks that need to be completed (73 To Do), 3 In Progress and resolved. Task (79 Done), all task numbers start with SCB (short for ServiceComb), you can click the taskbar to view the details of each task.

![](/assets/images/kanban.png){: .align-center}

​Click on Issues in the left panel to see all the tasks and support custom filtering rules for filtering. Click on View all issues and filters in the upper right corner to filter. The default filtering rules include task type, task progress, responsible person, current status. Etc., you can also use the Advanced feature for advanced filtering.

![](/assets/images/filter.png){: .align-center}

## Create issue

​Click Create to create an issue. When you create it, you need to select the issue type, including Task, Bug, Feature, Improvement, etc. After selecting the type, simply describe the issue content in the Summary. You need to fill in more content in the Description. It should be noted that ServiceComb contains four sub-projects, namely Java Chassis, Saga, Service-Center and website, so when creating an issue, you need to select the corresponding Component to specify which sub-project the issue belongs to.

![](/assets/images/issue.png){: .align-center}

​After creating an issue, you can assign the issue to yourself, start the task Start Progress, and wait for the problem to be resolved after the Resolve Issue or Close Issue, as shown below:

![](/assets/images/progress.png){: .align-center}

​To solve the issue by submitting the code, you need to start with the SCB number of the issue on the title of the created PR, as shown in the following figure [SCB-327]

![](/assets/images/pr.png){: .align-center}

​For more information on how to use JIRA, please refer to [Official Document](https://confluence.atlassian.com/jiracoreserver076/getting-started-as-a-user-945112029.html).

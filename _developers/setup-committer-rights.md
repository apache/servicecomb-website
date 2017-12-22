---
title: "Set Up Write Access for Committer"
lang: en 
ref: setup-committer-rights
permalink: /developers/setup-committer-rights/
excerpt: "How to set up repo write rights for committer"
last_modified_at: 2017-12-22T14:49:00
---

{% include toc %}

Congratulations for being a valuable committer to Apache ServiceComb projects!

This article will guide you through setting up write access to [Apache ServiceComb repositories](https://github.com/apache?utf8=%E2%9C%93&q=servicecomb&type=&language=) hosted on Github.

You need to complete three simple steps to obtain such rights, if you are already an Apache ServiceComb committer:
* Authorize your Apache account
* Authorize your Github account
* Join Apache Github organization

Open [https://gitbox.apache.org/setup/](https://gitbox.apache.org/setup/) in your favorite browser and you should see a page like below. 

![pre authorization]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/apache-pre-auth.png){: .align-center}

Let\'s get started!

## Authorize your Apache account
Click `Start ASF Oauth` link and follow the instructions on the page to log in with your Apache account.

![apache account authorization]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/apache-auth.png){: .align-center}

## Authorize your Github account
Before proceeding, enable [2FA on Github](https://github.com/settings/security) for your account.

Your Github account security page should look like the image below, if 2FA is set up successfully.

![github 2FA]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/github-2fa.png){: .align-center}

If you need help, please refer to [Github 2FA help page](https://help.github.com/articles/securing-your-account-with-two-factor-authentication-2fa/)

Once your Github 2FA is set up, click `Auth on GitHub` and follow the instructions to authorize your Github account.

![github account authorization]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/github-auth.png){: .align-center}

## Join Apache Github organization
Open [https://id.apache.org/](https://id.apache.org/) and log into your Apache account.

Once logged in, fill in your github username under *Your Github Username* section like below and save your changes:
 
![github account linking]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/link-apache-github-id.png){: .align-center}

An organisational invite will be sent to you shortly thereafter (within 30 minutes). 
You may visit [Apache on Github](https://github.com/apache/) to see if you have an invitation pending. It may take up to 30 minutes.

Accept the invitation and wait till you are added as an Apache ServiceComb project committer (you will be notified by email).

Once your write access is granted, you will see something like the image below:

![post authorization]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/apache-post-auth.png){: .align-center}

Congratulations! Now you have write access to Apache ServiceComb project, under which you are able to merge pull requests.

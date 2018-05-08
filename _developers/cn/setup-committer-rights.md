---
title: "Committer权限设置"
lang: cn
ref: setup-committer-rights
permalink: /cn/developers/setup-committer-rights/
excerpt: "How to set up repo write rights for committer"
last_modified_at: 2018-05-08T14:49:00
---

{% include toc %}

恭喜您成为Apache ServiceComb 项目宝贵的 committer !

本文将指导您设置对 Github 上托管的 Apache ServiceComb 仓库的权限。

如果您已经是Apache ServiceComb 项目的 committer，需要完成下面三个简单的步骤才能获得这些权限：

* 对 Apache 账号授权
* 对 Github 账号授权
* 加入 Apache Github 组织

在您喜欢的浏览器中打开 [https://gitbox.apache.org/setup/](https://gitbox.apache.org/setup/) ，您应该能看到如下所示的页面

![pre authorization]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/apache-pre-auth.png){: .align-center}

接下来开始授权！

## 授权 Apache 账户
点击 `Start ASF Oauth` 链接并按照页面上的说明使用您的 Apache 账号登录。

![apache account authorization]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/apache-auth.png){: .align-center}

## 授权 Github 账户
首先需要在 Github 账号上[启用2FA](https://github.com/settings/security) 安全设置。

如果2FA成功设置，您的Github账号安全设置页面应如下图所示。

![github 2FA]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/github-2fa.png){: .align-center}

更多安全设置资料请参考 [Github 2FA 资料](https://help.github.com/articles/securing-your-account-with-two-factor-authentication-2fa/)。

设置好 Github 2FA后，点击 `Auth on GitHub` 并按照说明授权Github 账号。

![github account authorization]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/github-auth.png){: .align-center}

## 加入 Apache Github 组织
打开 [https://id.apache.org/](https://id.apache.org/) 并登陆到您的 Apache 账户。

登陆后，填写您的 github 账户用户名并保存：

![github account linking]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/link-apache-github-id.png){: .align-center}

此后不久（30分钟内）将向您发送组织邀请，您可以在 Github 上访问 [Apache](https://github.com/apache/) 看看是否有待处理的邀请。这可能需要30分钟。

然后接受邀请并等待您添加为 Apache ServiceComb 项目的 committer （您将通过电子邮件获取通知）。

一旦您被授予权限，您将看到如下图所示的内容：

![post authorization]({{ site.url }}{{ site.baseurl }}/assets/images/gitbox/apache-post-auth.png){: .align-center}

恭喜！现在您可以访问 Apache ServiceComb 项目，在该项目下您将有权限Merge开发者的PR。

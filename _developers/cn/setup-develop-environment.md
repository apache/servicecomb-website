---
title: "开发环境准备"
lang: cn
ref: setup-develop-environment
permalink: /cn/developers/setup-develop-environment/
excerpt: "开发环境准备"
last_modified_at: 2017-06-24T18:48:43+08:00
---

{% include toc %}

## 基本环境准备
在您开始前，请确保以下应用已安装：
* **Git**，安装详情可参考[Git安装教程](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git){:target="_blank"}
* **JDK 1.8**，安装详情可参考[JDK安装教程](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html){:target="_blank"}
* **Maven 3.x**，安装详情可参考[Maven安装教程](https://maven.apache.org/install.html){:target="_blank"}
* **Docker**，安装详情可参考[Docker 安装教程](https://docs.docker.com/engine/installation/){:target="_blank"}
* **Service Center**, 安装详情可参考[Service Center安装教程](/cn/docs/service-center/install/)
* **IntelliJ Idea IDE**(可选，您可以使用其他心仪的IDE，如eclipse)，安装详情可参考[IntelliJ安装教程](https://www.jetbrains.com/help/idea/installing-and-launching.html){:target="_blank"}

## Git配置
1. 注册Github。由于ServiceComb的代码是托管在Github上的，所以您需要有一个Github的帐号，可前往 [https://github.com/join?source=header-home](https://github.com/join?source=header-home) 进行注册，如您已有Github帐号，则可跳过此步。注册完成后直接在 [https://github.com/login?return_to=%2Fjoin%3Fsource%3Dheader-home](https://github.com/login?return_to=%2Fjoin%3Fsource%3Dheader-home) 进行登录即可。
2. 配置Git。主要配置Git的个人信息和设置免密码提交代码。个人信息可通过以下指令进行配置：

   ```bash
   git config --global user.name <your-user-name>
   git config --global user.email <your-email-address>
   ```

   其中，请将\<your-user-name\>和\<your-email-address\>替换为您在Github上注册用到的用户名和邮箱信息。设置免密码提交代码可参考[Git免密码提交代码教程](https://stackoverflow.com/a/8588786){:target="_blank"}。
3. 获取项目代码。以 [ServiceComb-Java-Chassis](https://github.com/apache/servicecomb-java-chassis) 项目为例，可直接执行以下指令获取代码：

   ```bash
   git clone https://github.com/apache/servicecomb-java-chassis.git
   ```

## IDE 环境配置
现有支持Java开发的IDE很多，如Eclipse, IntelliJ IDEA和STS等。我们在此推荐使用IntelliJ IDEA，对于日常开发，其社区版的功能已经足够了。在安装完IntelliJ IDEA后，您可以根据[初始化设置教程](https://www.jetbrains.com/help/idea/installing-and-launching.html#d325787e291)对IntelliJ IDEA进行配置，随后可通过阅读[必备快捷键](https://www.jetbrains.com/help/idea/keyboard-shortcuts-you-cannot-miss.html)了解常用的快捷键。

Java Chassis和Saga项目使用了[Google Code Style](https://github.com/google/styleguide)作为代码风格，配置文件可以在本项目 `etc` 目录下找到。其中，目录中也有Eclipse的代码风格，读者可以直接导入使用。

![code style files]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.3.png){: .align-center}

{% include toc %}

### IntelliJ IDEA 配置
[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)的配置方法如下

1. 打开IntelliJ配置
![IntelliJ Settings]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.4.png){: .align-center}

1. Import 配置文件 `etc/intellij-java-google-style.xml`
![import code style]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.1.png){: .align-center}

1. 打开已修改而未提交的文件，并打开格式化文件对话框
![reformat file dialog]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.5.png){: .align-center}

1. 选择只格式化修改部分
![reformat options]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.2.png){: .align-center}

配置完成后，后续按快捷键 (Ctrl+Alt+i) 格式化修改文件即可。更多关于IntelliJ的使用技巧可阅读[IntelliJ教程](https://www.jetbrains.com/help/idea/tutorials.html)。

## 下一步

* 阅读[代码提交指南](/cn/developers/submit-codes/)

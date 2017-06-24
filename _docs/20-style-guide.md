---
title: "代码风格"
permalink: /docs/code-style/
excerpt: "代码风格"
last_modified_at: 2017-06-24T18:48:43+08:00
---

Java Chassis项目使用了[Google Code Style](https://github.com/google/styleguide)作为代码风格，配置文件可以
在本项目 `/etc` 目录下找到。

![code style files]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.3.png){: .align-center}

{% include toc %}

## IntelliJ IDEA 配置
[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)的配置方法如下

1. 打开IntelliJ配置
![IntelliJ Settings]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.4.png){: .align-center}

1. Import 配置文件 `/etc/intellij-java-google-style.xml`
![import code style]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.1.png){: .align-center}

1. 打开已修改而未提交的文件，并打开格式化文件对话框
![reformat file dialog]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.5.png){: .align-center}

1. 选择只格式化修改部分
![reformat options]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.2.png){: .align-center}

配置完成后，后续按快捷键格式化修改文件即可。

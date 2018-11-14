---
title: "Setup Developing Environment"
lang: en
ref: setup-develop-environment
permalink: /developers/setup-develop-environment/
excerpt: "setup developing environment"
last_modified_at: 2017-06-24T18:48:43+08:00
---

## Install required tools
Before you start, make sure you have the following tools installed:
* **Git**，please refer to [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git){:target="_blank"}
* **JDK 1.8**，please refer to [Install JDK](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html){:target="_blank"}
* **Maven 3.x**，please refer to [Install Maven](https://maven.apache.org/install.html){:target="_blank"}
* **Docker**，please refer to [Install Docker](https://docs.docker.com/engine/installation/){:target="_blank"}
* **Service Center**, please refer to [Install Service Center](/users/setup-environment/#运行service-center)
* **IntelliJ Idea IDE**(optional, you can use any IDE you like, e.g. eclipse), please refer to[Install IntelliJ](https://www.jetbrains.com/help/idea/installing-and-launching.html){:target="_blank"}

## Setup git
1. Get a Github account. The ServiceComb projects is hosted on Github, so you will need a Github account. You can goto [https://github.com/join?source=header-home](https://github.com/join?source=header-home) for signup. Skip this if you already own an Github account. You can login on [https://github.com/login?return_to=%2Fjoin%3Fsource%3Dheader-home](https://github.com/login?return_to=%2Fjoin%3Fsource%3Dheader-home) after you finished the signup.

2. Configure Git. Configure personal information and setup git for push without username/password.
   Configure personal information:

   ```bash
   git config --global user.name <your-user-name>
   git config --global user.email <your-email-address>
   ```

   Substitute \<your-user-name\>和\<your-email-address\> with your name and email. Refer[Git push without username and password](https://stackoverflow.com/a/8588786){:target="_blank"}to setup pushing without username/password.

3. Get the source code. For example, to get [ServiceComb-Java-Chassis](https://github.com/apache/servicecomb-java-chassis.git), execute the following command:

   ```bash
   git clone https://github.com/apache/servicecomb-java-chassis.git
   ```
       
## Configure IDE
There are many Java IDEs around, like Eclipse, IntelliJ IDEA and STS, etc. We suggest to use IntelliJ IDEA, it's community edition is good enough for daily usage. After you installed IntelliJ IDEA, follow [Initial Setup](https://www.jetbrains.com/help/idea/installing-and-launching.html#d325787e291) for basic configuration. For frequently used shortcuts, [Cannot Miss Shortcuts](https://www.jetbrains.com/help/idea/keyboard-shortcuts-you-cannot-miss.html)

The Java Chassis and Saga project uses [Google Code Style](https://github.com/google/styleguide). You can find the settings file under `etc` directory which can be imported to IDEA. There is also a settings file for Eclipse under the same directory.

![code style files]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.3.png){: .align-center}

{% include toc %}

### IntelliJ IDEA Configuration
Configure [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)

1. Open IntelliJ Settings page
![IntelliJ Settings]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.4.png){: .align-center}

2. Import the coding style settings file `etc/intellij-java-google-style.xml`
![import code style]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.1.png){: .align-center}


3. Open a modified but uncommited file, then Choose [Code] > [Show Reformat File Dialog]
![reformat file dialog]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.5.png){: .align-center}

4. Choose [Only VCS changed text], then click [Run]
![reformat options]({{ site.url }}{{ site.baseurl }}/assets/images/intellij.code.style.2.png){: .align-center}


Just run [Reformat code] (Ctrl+Alt+L) afterwards to format the code.

For more IntelliJ usages, please check [IntelliJ tutorial](https://www.jetbrains.com/help/idea/tutorials.html)。

## Next

* Read[Howto submit codes](/developers/submit-codes/)

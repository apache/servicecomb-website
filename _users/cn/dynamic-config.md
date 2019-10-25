---
title: "动态配置"
lang: cn
ref: customized-tracing
permalink: /cn/docs/users/dynamic-config/
excerpt: "动态配置"
last_modified_at: 2018-01-11T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述

动态配置能够在服务运行期间对服务自身和服务依赖的配置信息进行热修改。传统的配重信息处理方式是将配置信息写入xml、properties等配置文件中和应用一起打包，每次修改配置信息都需要重新打包部署，效率极低，且由于微服务架构中应用数量，应用依赖的配置数量会使配置信息的维护非常困难。动态配置功能就是为了解决这个问题。通过配置中心对服务依赖的配置信息进行修改，服务端主动查询或者配置中心下发都可以达到不用重新部署服务而改变其配置信息的目的。Java Chassis目前支持对接配置中心Apollo，用户可以通过实现Java Chassis提供的扩展接口很简单的对接到其他配置中心。

## 使用步骤:

### 部署并启动Apollo配置中心

通过镜像方式启动Apollo配置中心请参考[官方文档](https://github.com/ctripcorp/apollo/wiki/Apollo-Quick-Start-Docker%E9%83%A8%E7%BD%B2)，或者执行下面两个指令即可：

   ```bash
   git clone https://github.com/lijasonvip/apollo-image-for-servicecomb.git
   cd apollo-image-for-servicecomb && docker-compose up
   ```
等待出现 `Portal started. You can visit http://localhost:8070 now!` 后表示系统启动完成（启动时间基于机器性能可能需要1-3分钟），可以在浏览器中访问`http://localhost:8070`进入配置中心页面。 `docker-compose`安装请参考[文档](https://docs.docker.com/compose/install/)。

### 通过Apollo界面配置应用获取TOKEN

* ##### 登录Apollo配置中心创建项目

  在浏览器中输入登录地址，地址是容器所在主机的`IP:PORT`端口默认8070，如`http://192.168.199.1:8070`

  ![登录配置中心](/assets/images/config/login.png)

  Apollo配置中心的默认登录账号是apollo/admin，点击登录后会跳转到下图中的配置中心首页。

* ##### 创建项目

  ![创建项目](/assets/images/config/create_project.png)

  首页中默认展示一个示例项目SampleApp，用户可以点击创建项目自行创建一个，下图是创建项目页面，填入应用Id和应用名称，选择所在部门和应用负责人后点击提交即可。

![项目信息](/assets/images/config/create_project2.png)

​	需要注意的是，首次创建好一个项目后要发布之后客户端才能查询到该项目信息。如下图红框中的提示，点击发布即可。

![release_namespace](/assets/images/config/release_namespace.png)

* ##### 生成TOKEN

打开地址`http://192.168.199.1:8070/open/manage.html`进入下图页面，填入刚才创建项目使的应用名选择相应的部门和项目负责人即可生成应用对应的TOKEN，保存这个TOKEN稍后配置到项目代码中即可。

![生成TOKEN](/assets/images/config/token.png)

### 在应用中添加依赖

```xml
    <dependency>
          <groupId>org.apache.servicecomb</groupId>
          <artifactId>config-apollo</artifactId>
    </dependency>
```
### 添加配置项

   ```yaml
   apollo:
     config:
       serverUri: http://127.0.0.1:8070
       serviceName: SampleApp
       env: DEV
       clusters: default
       namespace: application
       token: testtoken
       refreshInterval: 10
   ```
​	`apollo.config`下的配置项是用户创建的应用参数，包括服务地址，用户名，集群，namespace，token等参数。这些参数可以在配置中心页面项目信息栏中查到。需要注意的是`refreshInterval: 10`表示应用会每隔10秒去配置中心查询一次最新的配置信息，不配置此项默认刷新周期为30秒。
  `serviceName`对应Apollo中的第三发应用ID: `AppId`.

### 获取动态属性

​	在配置中心中创建一个`timeout`的配置项，其值设置为`100`，并发布如下图：	![动态属性timeout](/assets/images/config/release_config.png)

​	代码中可以使用`DynamicPropertyFactory.getInstance().getProperty()`方法来获取具体的配置项值，`getProperty`方法可以根据配置项具体的类型来灵活使用，比如`getIntProperty()`,`getStringProperty()`等。

   ```java
   public class XXX {
      public static void main(String[] args) throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
        while (true) {
          DynamicIntProperty timeout = DynamicPropertyFactory.getInstance().
            getIntProperty("timeout", -1);
          System.out.println(timeout);
          Thread.sleep(3000);
        }
      }
    }
   ```
​	Apollo配置中心修改配置项并发布后，经过一个刷新周期后就会打印出最新的`timeout`值。


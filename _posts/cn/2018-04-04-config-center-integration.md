---
title: "ServiceComb示例讲解微服务配置中心选型与对接"
lang: cn
ref: config_center_integration
permalink: /cn/docs/config_center_integration/
excerpt: "ServiceComb对接配置中心"
last_modified_at: 2018-04-04T19:05:00+08:00
author: Li Bo
tags: [配置中心]
redirect_from:
  - /theme-setup/
---

### 配置中心

项目代码中经常会用到各种配置项，比如下面的代码中是从系统环境变量中获取`prop` :

```java
String prop = System.getProperty(myProperty);
int x = DEFAULT_VALUE;
try {
    x = Integer.parseInt(prop);
} catch (NumberFormatException e) {
    // handle format issues
}
myMethod(x);
```

类似使用环境变量或者`properties`和`xml`等文件方式传入配置进而控制应用表现的方法广泛应用于开发过程中，这样做可以将外部配置与业务代码解耦，若有变动只需修改配置参数而不需要重新编译构建项目。但是这种将配置和代码放在一起的方式可能会泄露隐私信息（比如密码），因为代码可能会公开，出于安全的考虑，配置和代码分离管理的方式开始广泛使用，常见的方法比如将配置放在CI服务器上通过打包脚本打入应用包中，或者直接放到运行应用的服务器的特定目录下，或者存储到数据库中。这种方式在传统的单体应用中简单有效，但也带来一些新的挑战：

* 配置变化频繁时，需要频繁的打包部署应用
* 不同的环境下配置项不同需要分开管理（比如测试环境和生产环境）
* 配置项中的隐私信息虽然避免了随代码公开而泄露，但是还是会打包到应用包中

此外，面对微服务爆发式增长的应用数量和服务器数量带来新的困难

* 复杂的业务对应大量的配置项


* 配置项在不同服务中可能出现冲突
* 对集群部署的应用配置进行修改时需要一次修改每个机器上的应用配置

这种背景下，中心化的配置服务即配置中心应运而生，简单来说，配置中心就是一种统一管理各种应用配置的基础服务组件，一个合格的配置中心需要满足：

* 配置项容易读取和修改
* 添加新配置要简单直接
* 支持对配置的修改的检视以把控风险
* 可以查看配置修改的历史记录
* 不同部署环境支持隔离


开源社区目前主流的配置中心有spring-cloud-config, ctrip apollo, disconf 等，下表是对其功能特性、技术路线、可用性和易用性等发面的比较[1]供参考。

|                  | spring-cloud-config   | ctrip apollo                 | disconf                      |
| ---------------- | :-------------------- | :--------------------------- | :--------------------------- |
| 静态配置管理     | 基于file              | 支持                         | 支持                         |
| 动态配置管理     | 支持                  | 支持                         | 支持                         |
| 统一管理         | 无，需要github        | 支持                         | 支持                         |
| 多维度管理       | 无，需要github        | 支持                         | 支持                         |
| 本地配置缓存     | 无                    | 支持                         | 支持                         |
| 配置生效时间     | 重启或手动refresh生效 | 实时                         | 实时                         |
| 配置更新推送     | 手动触发              | 支持                         | 支持                         |
| 配置定时拉取     | 无                    | 支持                         | 依赖时事件驱动               |
| 授权、审核、审计 | 无，需要github        | 支持                         | 无                           |
| 配置版本管理     | git做版本管理         | 界面上提供发布历史和回滚按钮 | 操作记录存数据库，无查询接口 |
| 实例配置监控     | 需要结合springadmin   | 支持                         | 支持                         |
| 灰度发布         | 不支持                | 支持                         | 不支持部分更新               |
| 告警通知         | 不支持                | 支持，邮件方式告警           | 支持，邮件方式告警           |
| 多数据中心部署   | 支持                  | 支持                         | 支持                         |
| 配置界面         | 无，通过git操作       | 统一界面                     | 统一界面                     |

综合比较后，ServiceComb选择了Apollo[2]作为配置中心进行对接。Apollo是携程框架部门研发并贡献到开源社区的分布式配置中心，活跃贡献者近百人。最新版本的ServiceComb Java Chassis已实现支持Apollo[1]，用户可以使用该配置中心结合Chassis中集成的Archaius实现在不需要重新启动或重新部署应用的前提下进行配置项的集中管理和动态修改。基于ServiceComb优秀的插件化设计，用户可以非常简单的对接到其他开源或自研的配置中心。

### 使用简介

##### 启动Apollo服务

* 启动Apollo服务

Apollo服务可以通过docker或二进制启动，方法参考官网文档[3]，推荐使用docker启动。

```bash
git clone https://github.com/lijasonvip/apollo-image-for-servicecomb.git
cd apollo-image-for-servicecomb && docker-compose up
```

出现`apollo-quick-start | Portal started. You can visit http://localhost:8070 now!`后表示Apollo已经启动成功，浏览器访问`http://localhost:8070`即可访问`portal`服务，默认登录账号为`apollo/admin`。

- 创建应用

登录后点击创建项目，填入应用名称，其他选默认即可，创建应用后需要进入应用点击发布才能生效。

![](/assets/images/config/create-project.png)

* 生成TOKEN

应用发布后我们需要获取一个TOKEN，在`http://localhost:8070/open/manage.html`页面填入刚才创建的应用ID和应用名称并选择项目和部门信息后点击创建即可生成一个TOKEN，保存此TOKEN并配置到Chassis应用的配置文件中。

![](/assets/images/config/token.png)

##### 引入依赖

在Chassis应用的pom文件中引入依赖`config-apollo`：

```xml 
 <dependency>
       <groupId>org.apache.servicecomb</groupId>
       <artifactId>config-apollo</artifactId>
 </dependency>
```

##### 添加配置

在Chassis应用的配置文件`microservice.yaml`中增加以下配置：

```yaml
   apollo:
     config:
       serverUri: http://127.0.0.1:8070		#Apollo portal服务地址
       serviceName: SampleApp				#创建应用时的AppID
       env: DEV								#env默认是DEV
       clusters: default					#cluster默认default
       namespace: application				#namespace默认application
       token: de3c5b2e6d8535b96				#第一步中生成的TOKEN
       refreshInterval: 10					#自动拉取配置的时间间隔
```

至此，通过简单的4步应用已经成功的对接到了Apollo配置中心，启动应用后可以在Apollo页面通过对配置项的新增、更新、回滚等操作进行服务治理啦！Demo参考[4]。

![](/assets/images/config/configuration.png)

### 对接配置中心

Chassis动态配置基于Netflix的Archaius实现[5]，Archaius扩展数据源方法参考文档[6]和demo[7]，Chassis按照[6]扩展了`PolledConfigurationSource` 和 `AbstractPollingScheduler`，启动的时候用SPI机制找到Source接口的实现类。

对接到一个新的配置中心只要扩展实现`ConfigCenterConfigurationSource`接口，实现`init`方法，在`init`方法中实现连接配置中心，刷新配置项的逻辑即可。具体代码请参考[8]。

* 设计配置项

  对接到新的配置中心可以设计新的配置参数，定义新的工具类获取这些参数，并指定默认值，参考`ApolloConfig`类对新增`apollo.config.serverUri`等参数的处理。

* 扩展Source接口

  init函数实现固定时间间隔或实时获取配置中心的配置项逻辑。`ApolloClient`中`refreshApolloConfig`函数启动了一个定时执行的线程刷新配置项：

  ```java
    public void refreshApolloConfig() {
      EXECUTOR
          .scheduleWithFixedDelay(new ConfigRefresh(serviceUri), 
                                  firstRefreshInterval, 
                                  refreshInterval, 
                                  TimeUnit.SECONDS);
    }
  ```

  `ConfigRefresh`线程的`run`中会从Apollo配置中心获取最新配置项并和之前的配置项对比分析出新增、修改和删除的配置参数，然后去执行对应的更新操作。对配置项的修改更新都是基于Archaius的`WatchedUpdateListener` 进而实现应用内参数的动态更新。

### 加入ServiceComb社区

ServiceComb目前在Apache基金会孵化，诚挚的欢迎开发者和用户一起参与社区讨论和贡献，加入社区的方法有订阅邮件列表，关注微信公众号，加入社区微信群等，详细方法请参考[9]。

### 参考资料

[0] ServiceComb 项目地址 [https://github.com/apache/incubator-servicecomb-java-chassis](https://github.com/apache/incubator-servicecomb-java-chassis)

[1] 开源配置中心比较 [https://github.com/ctripcorp/apollo/wiki/FAQ](https://github.com/ctripcorp/apollo/wiki/FAQ)

[2] ctrip apollo [https://github.com/ctripcorp/apollo/](https://github.com/ctripcorp/apollo/)

[3] Apollo启动 [https://github.com/ctripcorp/apollo/wiki/Quick-Start](https://github.com/ctripcorp/apollo/wiki/Quick-Start)

[4] Chassis应用使用Apollo配置中心Demo [https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/config-apollo-sample](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/config-apollo-sample)

[5] Netflix Archaius [https://github.com/Netflix/archaius/](https://github.com/Netflix/archaius/)

[6] Archaius 扩展数据源 [https://github.com/Netflix/archaius/wiki/Users-Guide](https://github.com/Netflix/archaius/wiki/Users-Guide)

[7] Archaius 对接Redis Demo [https://github.com/cnwrinc/archaius-redis](https://github.com/cnwrinc/archaius-redis)

[8] Chassis对接配置中心代码 [https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/dynamic-config/config-apollo](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/dynamic-config/config-apollo)

[9] 加入ServiceComb社区 [https://servicecomb.incubator.apache.org/cn/docs/join_the_community](https://servicecomb.incubator.apache.org/cn/docs/join_the_community)
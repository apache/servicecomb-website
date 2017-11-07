---
title: "华为公有云常见问题"
lang: cn
ref: huawei-cloud-faq
permalink: /cn/faqs/faqs-huawei-cloud/
excerpt: "华为公有云常见问题"
last_modified_at: 2017-10-29T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

* **Q: 在使用华为公有云时，设置镜像的标签只需要和上一次的标签不一样还是要和之前的都不一样？**

   A: 由于Docker本身的机制中并没有实现每次都从远端拉取镜像的功能，因此，只要本地中有一个版本的镜像存在而且每次都通过该版本的标签来访问镜像时，读取的镜像则为最开始上传的镜像，后续对该标签镜像的更新并不会在本地生效。因此现有两种解决方案：

   (1) 新上传的镜像的标签和之前的都不一样。

   (2) 登录到后台去将原版本标签的镜像删除。

   拓展：如果使用了华为公有云上面的编排功能，则可以通过设置imagePullPolicy为Always避免该问题。
   
* **Q: 华为公有云运行时报错：WARN com.huawei.paas.monitor.DataFactory: Upload monitor data error. 使用的配置为：**

   ```yaml
   cse:
     monitor:
       handler:
         chain:
           Provider:
             default: bizkeeper-provider
   ```

   A: 这个是配置文件的错误，handler应该是在cse的下一级而不是monitor的下一级，正确的配置是：

   ```yaml
   cse:
     handler:
       chain:
         Provider:
           default: bizkeeper-provider
   ```

* **Q: 微服务引擎CSE和ServiceComb有什么关系？**

   A:  CSE（Cloud Service Engine）是ServiceComb的商业版，其中除了ServiceComb还包含了安全增强以及服务管控界面。 CSE的核心模块以及相关的开发框架都是和ServiceComb同源的。 基于ServiceComb开发的应用可以不修改代码，很方便地部署CSE环境中。

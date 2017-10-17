---
title: "运行模式"
lang: cn
ref: run-mode
permalink: /cn/users/run-mode/
excerpt: "运行模式"
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架当前提供了两种部署运行模式：standalone模式和web容器模式。推荐使用**standalone模式**拉起服务进程。
## standalone模式
一个Standalone的容器，以简单的Main加载Spring启动，因为服务通常不需要Tomcat/JBoss等Web容器的特性，没必要用Web容器去加载服务。微框架提供了standalone部署运行模式，服务容器只是一个简单的Main方法，并加载一个简单的Spring容器，用于暴露服务。

### 操作步骤

* **步骤1** 编写Main函数，初始化日志和加载服务配置，内容如下：

   ```java
   import io.servicecomb.foundation.common.utils.BeanUtils;
   import io.servicecomb.foundation.common.utils.Log4jUtils;
   public class MainServer {
     public static void main(String[] args) throws Exception {
     　Log4jUtils.init(); #日志初始化
     　BeanUtils.init(); # Spring bean初始化
       // other codes omitted
     }
   }
   ```

* **步骤2** 运行MainServer即可启动该微服务进程，向外暴露服务。

   注意：如果使用的是rest网络通道，需要将pom中的transport改为使用cse-transport-rest-vertx包。

## WEB容器模式
如果需要将该微服务加载到web容器中启动运行时，需要新建一个servlet工程包装一下，该servlet工程，根据需要，可以不写或写少量的引导代码即可。

### 开发示例

```xml
<web-app>
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>
            classpath*:META-INF/spring/*.bean.xml
            classpath*:app-config.xml
        </param-value>
    </context-param>
    <listener>
        <listener-class>com.huawei.paas.cse.transport.rest.servlet.RestServletContextListener</listener-class>
    </listener>

    <servlet>
        <servlet-name>RestServlet</servlet-name>
        <servlet-class>com.huawei.paas.cse.transport.rest.servlet.RestServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
        <async-supported>true</async-supported>
    </servlet>
    <servlet-mapping>
        <servlet-name>RestServlet</servlet-name>
        <url-pattern>/rest/*</url-pattern>
    </servlet-mapping>
</web-app>
```

* **步骤2 修改pom文件**

```xml
<dependencies>
    <dependency>
        <groupId>com.huawei.paas.cse</groupId>
        <artifactId>cse-transport-rest-servlet</artifactId>
    </dependency>
</dependencies>
<build>
    <finalName>test</finalName>
</build>
```

**注意事项:**
1. RESTful调用应该与web容器中其他静态资源调用（比如html、js等等）隔离开来，所以webroot后一段应该还有一层关键字，比如上面web.xml中举的例子（/test/rest）中的rest。
2. 以tomcat为例，默认每个war包都有不同的webroot，这个webroot需要是basePath的前缀，比如webroot为test，则该微服务所有的契约都必须以/test打头。
3. 当微服务加载在web容器中，并直接使用web容器开的http、https端口时，因为是使用的web容器的通信通道，所以需要满足web容器的规则。

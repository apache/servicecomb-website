---
title: "部署运行"
lang: en
ref: deployment
permalink: /docs/deployment/
excerpt: "部署运行."
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

微服务框架当前提供了两种部署运行模式：standalone模式和web容器模式。推荐使用standalone模式拉起服务进程。

{% include toc %}

## standalone模式
以下软件需要被安装:

微服务框架提供了standalone部署运行模式，可直接在本地通过Main函数拉起。

编写Main函数，初始化日志和加载服务配置，内容如下。

```java
import io.servicecomb.foundation.common.utils.BeanUtils;
import io.servicecomb.foundation.common.utils.Log4jUtils;

public class MainServer {

    public static void main(String[] args) throws Exception {
        Log4jUtils.init();            # 日志初始化
        BeanUtils.init();            # Spring bean初始化

        ...
    }
}
```

**Note:**如果使用的是rest网络通道，需要将pom中的transport改为使用transport-rest-vertx包
{: .notice--warning}

运行MainServer即可启动该微服务进程，向外暴露服务。

## web容器模式

如果需要将该微服务加载到web容器中启动运行时，需要新建一个servlet工程包装一下。

### web.xml文件配置

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
        <listener-class>io.servicecomb.transport.rest.servlet.RestServletContextListener</listener-class>
    </listener>

    <servlet>
        <servlet-name>RestServlet</servlet-name>
        <servlet-class>io.servicecomb.transport.rest.servlet.RestServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
        <async-supported>true</async-supported>
    </servlet>
    <servlet-mapping>
        <servlet-name>RestServlet</servlet-name>
        <url-pattern>/rest/*</url-pattern>
    </servlet-mapping>
</web-app>
```

RestServletContextListener用于初始化微服务环境，包括日志、spring等。

需要指定spring配置文件加载路径，通过context-param来配置。 上例中，classpath*:META-INF/spring/*.bean.xml是微服务的内置规则，如果配置中未包含这个路径，则RestServletContextListener内部会将它追加在最后。

另外可以配置servlet-mapping中的url-pattern规则将满足指定规则的URL路由到该servlet中来。

### pom.xml文件配置

当前只有Rest网络通道支持此种运行模式，使用web容器模式时需要将pom文件中的transport改为依赖transport-rest-servlet包。

设置finalName，是方便部署，有这一项后，maven打出来的war包，部署到web容器中，webroot即是这个finalName。


```xml
<dependencies>
    <dependency>
        <groupId>io.servicecomb</groupId>
        <artifactId>transport-rest-servlet</artifactId>
    </dependency>

    ...
</dependencies>

<build>
    <finalName>test</finalName>
</build>
```

**Note:**1.RESTful调用应该与web容器中其他静态资源调用（比如html、js等等）隔离开来，所以webroot后一段应该还有一层关键字，比如上面web.xml中举的例子（/test/rest）中的rest。2.以tomcat为例，默认每个war包都有不同的webroot，这个webroot需要是basePath的前缀，比如webroot为test，则该微服务所有的契约都必须以/test打头。3.当微服务加载在web容器中，并直接使用web容器开的http、https端口时，因为是使用的web容器的通信通道，所以需要满足web容器的规则。
{: .notice--warning}

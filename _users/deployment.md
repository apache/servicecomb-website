---
title: "Running Mode"
lang: en
ref: run-mode
permalink: /users/run-mode/
excerpt: "Running Mode"
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
Currently, ServiceComb microservice framework support two kind of deploy mode: standalone mode and web container mode. You are advised to to use standalone to to start your services.
## Standalone Mode
A standalone container is loaded with a simple Main to start Spring. Because the service usually does not need the Web container feature, such as Tomcat/JBoss.

It is not necessary to unload services using the Web container. The microservice framework provides the standalone deployment mode.

The service container is only a simple Main method, and a simple Spring container is loaded to expose services.

### Procedure

* **Step 1**  Compile the Main function to initialize logs and load service configurations. The contents are as follows:

   ```java
   import org.apache.servicecomb.foundation.common.utils.BeanUtils;
   import org.apache.servicecomb.foundation.common.utils.Log4jUtils;
   public class MainServer {
     public static void main(String[] args) throws Exception {
     　Log4jUtils.init(); #Log initialization
     　BeanUtils.init(); # Spring bean initialization
       // other codes omitted
     }
   }
   ```

* **Step 2** Run MainServer to start process and expose services.

   NOTE: If the rest network is used, change transparent in the POM file to the cse-transport-rest-vertx package.

## WEB Container Mode
If you need to load the microservice to the web container, create a sersvlet project package. You do not need to write or write a small number of boot codes as needed.

### Development Example

**Step 1** Create a servlet project and modify the web.xml file as follows:

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
        <listener-class>org.apache.servicecomb.transport.rest.servlet.RestServletContextListener</listener-class>
    </listener>

    <servlet>
        <servlet-name>RestServlet</servlet-name>
        <servlet-class>org.apache.servicecomb.transport.rest.servlet.RestServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
        <async-supported>true</async-supported>
    </servlet>
    <servlet-mapping>
        <servlet-name>RestServlet</servlet-name>
        <url-pattern>/rest/*</url-pattern>
    </servlet-mapping>
</web-app>
```

* **Step 2 Modify the POM file**

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.servicecomb</groupId>
        <artifactId>transport-rest-servlet</artifactId>
    </dependency>
</dependencies>
<build>
    <finalName>test</finalName>
</build>
```

**NOTICE:**
1. The Restful call must be separated from other static resources (such as HTML and js) in the web container. The next segment of webroot should have a keyword, such as rest in this example (/test/rest) in web.xml
2. The Tomcat is used as an example. Each WAR package has unique webroot, which must be a basePath prefix. For example , if webroot is test, all the API definitions of the microservice must start with /test.
3. When the microservice is loaded to the web container and the HTTP and HTTPS ports are opened using the web container, which must meet requirements for the web container rules.

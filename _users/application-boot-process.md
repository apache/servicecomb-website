---
title: "Application Boot-up Process"
lang: en
ref: application-boot-process
permalink: /docs/users/application-boot-process/
excerpt: "Application Boot-up Process"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

The starup process of a service provider includes initializing Log4j, loading bean(including its parameters), and registering service.

* Initialize Log4j:

   By default, `Log4jUtils` obtains the configuration of log4j from the `classpath\*:config/base/log4j.properties` and `classpath\*:config/log4j.properties` files. combines them, and transfer them to PropertyConfigurator of log4j to initialize log4j. If the configuration file having the highest priority is stored on the disk and its directory has write permission, save the combined configuration to this directory to view which parameters take effect during maintenance.

* Load the bean.

   By default `BeanUtils`  loads the configuration file from the `classpath\*:META-INF/spring/\*.bean.xml` path and transfer the configuration to `ClassPathXmlApplicationContext` of the Spring framework to load the context. In this process, ```BeanUtils``` loads the bean of foundation-config module.

* Register the microservice.

   After Spring context has been loaded, `org.apache.servicecomb.core.CseApplicationListener` will configure the handler, load the information about the provider schema, and the register microservice to service center.

> **NOTE:**
> The three level of configuration items for ServiceComb are the configuration center, environment variables, and local files, listed in a descending order by priority. If configuration items with the same name exist, the one in the highest level overwrites others. Configuration items stored in the configuration center can be modified during running.

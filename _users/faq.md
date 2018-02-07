---
title: "FAQ"
lang: en
ref: faq
permalink: /users/faq/
excerpt: "FAQ"
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

1. **Q: What need to be cautious when using Java-Chassis?**

   A: There are a few restrictions when using Java-Chassis:
   * Before version 0.3.0-SNAPSHOT, it does not support annotations like `@GetMapping`.
   * When using the same HTTP request method, e.g. GET, the method name need to be unique as it will become operation ID when swagger generates contracts.
   * Class and method name need to be public.

2. **Q: When using the *spring-boot-starter-provider* dependency, property like `spring.main.web-environment` not working in *application.yml* file.**

   A: When you need both the starter provider dependency and the servlet, you need to declare `spring.main.web-environment` in *application.properties* file or declare it in *application.yml* file and create an empty *application.properties* file.

3. **Q: What's the dependency differences between gateway and other microservices?**

   ```xml
   <groupId>org.apache.servicecomb</groupId>
   <artifactId>spring-boot-starter-provider</artifactId>
   ```

   A: Gateway depends on not only the `spring-boot-starter-provider`, but also the `spring-boot-starter-discovery`. This can refer to the *manger* implementation of [LinuxCon-Beijing-Workshop](https://github.com/ServiceComb/LinuxCon-Beijing-WorkShop).

4. **Q: Do gateway need to configure assembly like the other microservices? Is */maven/gateway* the default path of the docker maven plugin?**

   A: Yes. Docker maven plugin relies on the assembly files to generate docker image. */maven* is the default path of docker maven plugin and */gateway* is the path defined in the assembly file.

5. **Q: Are there any restrictions of the return type of our API? Should it be the type of ResponseEntity?**

   A: No, examples can refer to [the implementation of integration-test](https://github.com/apache/incubator-servicecomb-java-chassis/blob/master/integration-tests/springmvc-tests/src/test/java/org/apache/servicecomb/demo/springmvc/tests/SpringMvcIntegrationTestBase.java) in java-chassis.

6. **Q: Our API can not be accessed after microservices are up. It just returns *404 Not Found*. The codes we use is as follows:**

   ```java
   @RestController
   @RestSchema(schemaId = "worker")
   public class WorkerController {
     @RequestMapping(value="/count", method=RequestMethod.GET)
     public int getWorkerNumbers() {
       ...
     }
   }
   ```

   A: Without specifying the base path, ServiceComb will use the classname as the base path. Hence, the path should be `/WorkerController/count` in the previous code. If you want to access path like `/count`, you need to specify base path as `/` as follows:
   ```java
   @RequestMapping(value = "/")
   public class WorkerController {}
   ```

7. **Q: What\'s the default base path if I have not declared the value of RequestMapping annotation?**

   A: Supposed the class name of your controller is *HelloController*, the base path is /HelloController.

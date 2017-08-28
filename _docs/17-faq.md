---
title: "FAQ"
lang: en
ref: faq
permalink: /docs/faq/
excerpt: "FAQ"
last_modified_at: 2017-06-06T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

1. **Q: When we push images to Huawei Public Cloud, what needs to be careful about the image tag?**

   A:  It needs to be different with all uploaded images. As Docker does not pull image from remote every time it starts up a container. Hence, the Docker does not know whether the image updated or not. There are two solutions for this:

   (1) Use different image tag every time you upload a image.

   (2) Delete the image in the backend manually.

   P.S. If you use the Huawei Cloud's orchestration, you can avoid this by setting *imagePullPolicy* to *Always*.

2. **Q: What's the dependency differences between gateway and other microservices?**

   ```xml
   <groupId>io.servicecomb</groupId>
   <artifactId>spring-boot-starter-provider</artifactId>
   ```

   A: Gateway depends on not only the `spring-boot-starter-provider`, but also the `spring-boot-starter-discovery`. This can refer to the *manger* implementation of [LinuxCon-Beijing-Workshop](https://github.com/ServiceComb/LinuxCon-Beijing-WorkShop).

3. **Q: Do gateway need to configure assembly like the other microservices? Is */maven/gateway* the default path of the docker maven plugin?**

   A: Yes. Docker maven plugin relies on the assembly files to generate docker image. */maven* is the default path of docker maven plugin and */gateway* is the path defined in the assembly file.

4. **Q: Are there any restrictions of the return type of our API? Should it be the type of ResponseEntity?**

   A: No, examples can refer to [the implementation of integration-test](https://github.com/ServiceComb/java-chassis/blob/master/integration-tests/springmvc-tests/src/test/java/io/servicecomb/demo/springmvc/tests/SpringMvcIntegrationTestBase.java#L145) in java-chassis.

5. **Q: We encountered this error when using Huawei Public Cloud: *WARN com.huaewi.paas.monitor.DataFactory: Upload monitor data error.* The configuration we use is as follows:**

   ```yaml
   cse:
     monitor:
       handler:
         chain:
           Provider:
             default: bizkeeper-provider
   ```

   A: There are mistakes in your configuration files. `handler` should be the child of `cse` instead of `monitor`. The right configuration should be as follows:

   ```yaml
   cse:
     handler:
       chain:
         Provider:
           default: bizkeeper-provider
   ```

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

7. **Q: What need to be cautious when using Java-Chassis?**

   A: There are a few restrictions when using Java-Chassis:
   (1) It does not support annotations like `@GetMapping`. As there are too many annotations in the spring framework, it's not realistic to support all of them.
   (2) When using the same HTTP request method, e.g. GET, the method name need to be unique as it will become operation ID when swagger generates contracts.
   (3) Class and method name need to be public.

8. **Q: When using the *spring-boot-starter-provider* dependency, property like `spring.main.web-environment` not working in *application.yml* file.**

   A: When you need both the starter provider dependency and the servlet, you need to declare `spring.main.web-environment` in *application.properties* file or declare it in *application.yml* file and create an empty *application.properties* file.

9. **Q: What's the default base path if I have not declared the value of RequestMapping annotation?**

   A: Supposed the class name of your controller is *HelloController*, the base path is /HelloController.

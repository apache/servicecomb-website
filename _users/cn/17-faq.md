---
title: "常见问题"
lang: cn
ref: faq
permalink: /cn/users/faq/
excerpt: "常见问题"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

1. **Q: 使用Java-Chassis这个框架时有什么需要注意的地方？**

   A: 使用Java-Chassis有以下这些限制：
   (1) 不支持类似`@GetMapping`这样的标注。因为Spring现有太多标注了，要支持全部的标注显得也不太实际。
   (2) 所用到的HTTP请求方法一样时，如GET，则方法名不能重载。这是由于生成契约时方法名会作为其Operation ID，所以要保证其唯一性。
   (3) 方法和类必须是public的。

2. **Q: 使用*spring-boot-starter-provider*这个依赖时，在*application.yml*文件中声明的`spring.main.web-application`属性并没有生效？**

   A: 使用*starter-provider*这个依赖时，如果用到了servlet这种方式时，需要在*application.properties*这个文件引入`spring.main.web-application=true`这样的属性或者在*application.yml*文件中声明，但是此时需要新建一个*application.properties*的文件，其内容可以为空。

3. **Q: 网关依赖的jar和其他微服务的一样吗？**

   ```xml
   <groupId>io.servicecomb</groupId>
   <artifactId>spring-boot-starter-provider</artifactId>
   ```

   A: 网关除了要依赖`spring-boot-starter-provider`之外还要依赖`spring-boot-starter-discovery`，可以参考[LinuxCon-Beijing-Workshop](https://github.com/ServiceComb/LinuxCon-Beijing-WorkShop)中manager的实现。

4. **Q: 网关需要像其他微服务一样配置assembly吗？其中的/maven/gateway这个路径是docker maven plugin默认的吗？**

   A: 需要，由于项目现在使用的是spring-boot的打包方式，docker maven plugin也是依赖打包生成的文件来生成docker镜像的。/maven这个路径是docker maven plugin指定的，而gateway这个路径是在assembly中指定的。

5. **Q: 服务接口的返回类型可以是任意类型吗？还是必须是responseEntity？**

   A: 可以，具体可以参考java-chassis的[integration-test的实现](https://github.com/ServiceComb/java-chassis/blob/master/integration-tests/springmvc-tests/src/test/java/io/servicecomb/demo/springmvc/tests/SpringMvcIntegrationTestBase.java#L145)。

6. **Q: 微服务启动后，无法正确调用接口，使用的代码为：**

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

   A: 在没有指明根路径的情况下，默认会使用类名作为其根路径，即上述代码中可访问的路径应为`/WorkerController/count`。如果想要实现`/count`这样的访问，则要指明根路径：

   ```java
   @RequestMapping(value = "/")
   public class WorkerController {}
   ```

7. **Q: 如果没有指定RequestMapping这个标注的value时，默认的基本路径是什么？**

   A: 假设你的Controller类名为*HelloController*，那么基本路径就是/HelloController。

---
title: "常见问题"
lang: cn
ref: faq
permalink: /cn/faqs/
excerpt: "常见问题"
last_modified_at: 2017-10-29T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

* **Q: ServiceComb和SpringCloud是什么关系，具体的应用场景是什么？**
   
   A: ServiceComb是华为基于内部多个大型IT系统实践提炼出来的一套微服务开发框架，在开发态基于最佳实践封装了一套微服务运行模型，这些能力对用户完全透明，可以通过配置引入功能和对其进行调整。在运维阶段充分考虑了微服务运维，提供了丰富的监控指标和动态治理能力。      
   B: ServiceComb的这套能力可以作为一个单独的开发框架，在需要轻量级微服务解决方案的的场景中单独使用，也可以建立在SpringCloud上，与SpringCloud提供的其他组件一起工作，在重量级场景中和SpringCloud一起产生 “1+1大于2”的效果。

* **Q: 用IntelliJ的免费版开发，有什么问题？**   
    
   A: 没有问题，使用IntelliJ 开发，可参考 [Setup Developer Environment](/cn/developers/setup-develop-environment/) 进行相应的环境配置。    
   
* **Q: 使用Java-Chassis这个框架时有什么需要注意的地方？**

   A: 使用Java-Chassis有以下这些限制：
   (1) 0.3.0-SNAPSHOT之前的版本不支持类似`@GetMapping`这样的标注。
   (2) 所用到的HTTP请求方法一样时，如GET，则方法名不能重载。这是由于生成契约时方法名会作为其Operation ID，所以要保证其唯一性。
   (3) 方法和类必须是public的。

* **Q: 使用*spring-boot-starter-provider*这个依赖时，在*application.yml*文件中声明的`spring.main.web-application`属性并没有生效？**

   A: 使用*starter-provider*这个依赖时，如果用到了servlet这种方式时，需要在*application.properties*这个文件引入`spring.main.web-application=true`这样的属性或者在*application.yml*文件中声明，但是此时需要新建一个*application.properties*的文件，其内容可以为空。

* **Q: 网关依赖的jar和其他微服务的一样吗？**

   ```xml
   <groupId>io.servicecomb</groupId>
   <artifactId>spring-boot-starter-provider</artifactId>
   ```

   A: 网关除了要依赖`spring-boot-starter-provider`之外还要依赖`spring-boot-starter-discovery`，可以参考[LinuxCon-Beijing-Workshop](https://github.com/ServiceComb/LinuxCon-Beijing-WorkShop)中manager的实现。

* **Q: 网关需要像其他微服务一样配置assembly吗？其中的/maven/gateway这个路径是docker maven plugin默认的吗？**

   A: 需要，由于项目现在使用的是spring-boot的打包方式，docker maven plugin也是依赖打包生成的文件来生成docker镜像的。/maven这个路径是docker maven plugin指定的，而gateway这个路径是在assembly中指定的。

* **Q: 服务接口的返回类型可以是任意类型吗？还是必须是responseEntity？**

   A: 可以，具体可以参考java-chassis的[integration-test的实现](https://github.com/ServiceComb/java-chassis/blob/master/integration-tests/springmvc-tests/src/test/java/io/servicecomb/demo/springmvc/tests/SpringMvcIntegrationTestBase.java#L145)。

* **Q: 微服务启动后，无法正确调用接口，使用的代码为：**

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

* **Q: 如果没有指定RequestMapping这个标注的value时，默认的基本路径是什么？**

   A: 假设你的Controller类名为*HelloController*，那么基本路径就是/HelloController。

* **Q: 在eclipse下修改了microservice.yaml配置文件下的端口号，启动程序后，端口号没生效？**

   A: 需要单独导入sample项目，如果导入整个ServiceComb-Java-Chassis项目，由于sample目录不在ServiceComb-Java-Chassis模块中，IDE不会对sample进行编译,eclipse下并没有提示错误信息，IDEA下会有提示信息。因此eclipse启动sample的demo会发现修改了端口没有生效。

* **Q: 如何自定义某个Java方法对应的REST接口里的HTTP Status Code？**

   A: 对于正常的返回值，可以通过SwaggerAnnotation实现，例如：

   ```java
   @ApiResponse(code = 300, response = String.class, message = "")
   public int test(int x) {
     return 100;
   }
   ```
   
   对于异常的返回值，可以通过抛出自定义的InvocationException实现，例如：、
   
   ```java
   public String testException(int code) {
     String strCode = String.valueOf(code);
       switch (code) {
         case 200:
           return strCode;
         case 456:
           throw new InvocationException(code, strCode, strCode + " error");
         case 556:
           throw new InvocationException(code, strCode, Arrays.asList(strCode + " error"));
         case 557:
           throw new InvocationException(code, strCode, Arrays.asList(Arrays.asList(strCode + " error")));
         default:
           break;
       }
   
     return "not expected";
   }
   ```


* **Q: 如何定制自己微服务的日志配置?**

   A: ServiceComb不绑定日志器，只是使用了slf4j，用户可以自由选择log4j/log4j2/logback等等。ServiceComb提供了一个log4j的扩展，在标准log4j的基础上，支持log4j的properties文件的增量配置。
   * 默认以规则："classpath\*:config/log4j.properties"加载配置文件
   * 实际会搜索出classpath中所有的```config/log4j.properties和config/log4j.*.properties```, 从搜索出的文件中切出```\*```的部分，进行alpha排序，然后按顺序加载，最后合成的文件作为log4j的配置文件。
   * 如果要使用ServiceComb的log4j扩展，则需要调用Log4jUtils.init，否则完全按标准的日志器的规则使用。

* **Q: 当服务配置了多个transport的时候，在运行时是怎么选择使用哪个transport的？**

   A: 
   * ServiceComb的consumer、transport、handler、producer之间是解耦的，各功能之间通过契约定义联合在一起工作的，即：
      consumer使用透明rpc，还是springmvc开发与使用highway，还是RESTful在网络上传输没有关系与producer是使用透明rpc，还是jaxrs，或者是springmvc开发，也没有关系handler也不感知，业务开发方式以及传输方式
   
   * consumer访问producer，在运行时的transport选择上，总规则为：
      consumer的transport与producer的endpoint取交集，如果交集后，还有多个transport可选择，则轮流使用
   
      分解开来，存在以下场景：
   
   * 当一个微服务producer同时开放了highway以及RESTful的endpoint
      * consumer进程中只部署了highway transport jar，则只会访问producer的highway endpoint
      * consumer进程中只部署了RESTful transport jar，则只会访问producer的RESTful endpoint
      * consumer进程中，同时部署了highway和RESTful transport jar，则会轮流访问producer的highway、RESTful endpoint
   
      如果，此时consumer想固定使用某个transport访问producer，可以在consumer进程的microservice.yaml中配置，指定transport的名称:

      ```yaml
      servicecomb:
        references:
          <service_name>:
            transport: highway
      ```
   
   * 当一个微服务producer只开放了highway的endpoint
      * consumer进程只部署了highway transport jar，则正常使用highway访问
      * consumer进程只部署了RESTful transport jar，则无法访问
      * consumer进程同时部署了highway和RESTful transport jar，则正常使用highway访问
   
   * 当一个微服务producer只开放了RESTful的endpoint
      * consumer进程只部署了highway transport jar，则无法访问
      * consumer进程只部署了RESTful transport jar，则正常使用RESTful访问
      * consumer进程同时部署了highway和RESTful transport jar，则正常使用RESTful访问

* **Q: swagger body参数类型定义错误，导致服务中心注册的内容没有类型信息**

   **现象描述:**
   
   定义如下接口，将参数放到body传递
   
   ```yaml
   /testInherate:
       post:
         operationId: "testInherate"
         parameters:
         - in: "body"
           name: "xxxxx"
           required: false
           type: string
         responses:
           200:
             description: "response of 200"
             schema:
               $ref: "#/definitions/ReponseImpl"
   ```
   
   采用上面方式定义接口。在服务注册以后，从服务中心查询下来的接口type: string 丢失，变成了：
   
   ```yaml
   /testInherate:
       post:
         operationId: "testInherate"
         parameters:
         - in: "body"
           name: "xxxxx"
           required: false
         responses:
           200:
             description: "response of 200"
             schema:
               $ref: "#/definitions/ReponseImpl"
   ```
   
   如果客户端没有放置swagger，还会报告如下异常：
   
   ```text
      Caused by: java.lang.ClassFormatError: Method "testInherate" in class ? has illegal signature "
   ```
   
   A：定义body参数的类型的时候，需要使用schema，不能直接使用type。
   
   ```yaml
   /testInherate:
       post:
         operationId: "testInherate"
         parameters:
         - in: "body"
           name: "request"
           required: false
           schema:
             type: string
         responses:
           200:
             description: "response of 200"
             schema:
               $ref: "#/definitions/ReponseImpl"
   ```

* **Q: ServiceComb微服务框架服务调用是否使用长连接?**

   A: http使用的是长连接（有超时时间），highway方式使用的是长连接（一直保持）。
   
* **Q: 服务断连服务中心注册信息是否自动删除**

   A: 服务中心心跳检测到服务实例不可用，只会移除服务实例信息，服务的静态数据不会移除。

* **Q: 如果使用tomcat方式集成ServiceComb微服务框架，如何实现服务注册**

   A: 如果使用cse sdk servlet方式（使用transport-rest-servlet依赖）制作为war包部署到tomcat，需要保证，服务描述文件（microservice.yaml）中rest端口配置和外置容器一致才能实现该服务的正确注册。否则无法感知tomcat开放端口。

* **Q: 如果使用tomcat方式集成CSE微服务框架，服务注册的时候如何将war包部署的上下文注册到服务中心**

   A: 发布服务接口的时候需要将war包部署的上下文（context）放在baseurl最前面，这样才能保证注册到服务中心的路径是完整的路径（包含了上下文）。实例：

   ```java
   @path(/{context}/xxx)
   class ServiceA
   ```
   
* **Q: ServiceComb微服务框架如何实现数据多个微服务间透传**

   A:
   透传数据塞入：
   
   ```java
   CseHttpEntity<xxxx.class> httpEntity = new CseHttpEntity<>(xxx);
   //透传内容
   httpEntity.addContext("contextKey","contextValue");
   ResponseEntity<String> responseEntity = RestTemplateBuilder.create().exchange("cse://springmvc/springmvchello/sayhello",HttpMethod.POST,httpEntity,String.class);
   ```
   
   透传数据获取：
   
   ```java
   @Override
   @RequestMapping(path="/sayhello",method = RequestMethod.POST)
   public String sayHello(@RequestBody Person person,InvocationContext context){
     //透传数据获取
     context.getContext();
     return "Hello person " + person.getName();
   }
   ```

* **Q: ServiceComb微服务框架服务如何自定义返回状态码?**

   A:
   ```java
   @Override
   @RequestMapping(path = "/sayhello",method = RequestMethod.POST)
   public String sayHello(@RequestBody Person person){
     InvocationContext context = ContextUtils.getInvocationContext();
     //自定义状态码
     context.setStatus(Status.CREATED);
     return "Hello person "+person.getName();
   }
   ```
   
* **Q: ServiceComb body Model部分暴露**

   A: 一个接口对应的body对象中，可能有一些属性是内部的，不想开放出去，生成schema的时候不要带出去，使用：
   
   ```java
   @ApiModelProperty(hidden = true)
   ```
   
* **Q: ServiceComb框架获取远端consumer的地址**

   A: 如果使用http rest方式（使用transport-rest-vertx依赖）可以用下面这种方式获取：

   ```java
   AbstractProducerContextArgMapper httpRequestCreator = (AbstractProducerContextArgMapper)invocation.getHandlerContext().get(RestConst.HTTP_REQUEST_CREATOR);
   if(httpRequestCreator != null){
     HttpServletRequest req = (HttpServletRequest)httpRequestCreator.createContextArg(invocation);
     System.out.println(req.getRemoteHost());
   }
   ```
   
   实际场景是拿最外层的地址，所以应该是LB传入到edgeservice，edgeService再放到context外下传递。
   
* **Q: ServiceComb不支持泛型**

   A: 明确不支持，需要修改接口，接口修改后需要修改版本号，以免consumer还是使用旧的版本。

* **Q: ServiceComb对handler描述**

   A: consumer默认的handler是simpleLB，没有配置的时候handler链会使用这个，如果配置了handler，里面一定要包含lb的handler，否则调用报错，需要在文档里面进行说明。

* **Q: ServiceComb日志替换**

   A: CSE java-chassis日志推荐方式是在启动的时候使用Log4jUtils.init\(\)，直接使用推荐的Log4j来做日志管理，但是有些场景不想用log4j，比如想使用log4j2或者logback，下面以log4j2为例简单介绍下步骤：

   1. 在代码里面不要使用Log4jUtils.init\(\)；
   2. 去掉log4j的配置文件（不删掉也没关系，因为不会使用）；
   3. exclude掉CSE框架引入的log4j，例如：
      ```xml
      <dependency>
          <groupId>io.servicecomb</groupId>
          <artifactId>provider-springmvc</artifactId>
          <exclusions>
              <exclusion>
                  <groupId>log4j</groupId>
                  <artifactId>log4j</artifactId>
              </exclusion>
          </exclusions>
      </dependency>
      ```
   4. 引入log4j2的依赖
   
      ```xml
      <dependency>    
          <groupId>org.apache.logging.log4j</groupId>
          <artifactId>log4j-slf4j-impl</artifactId>
      </dependency>
      <dependency>
          <groupId>org.apache.logging.log4j</groupId>
          <artifactId>log4j-api</artifactId>
      </dependency>
      <dependency>
          <groupId>org.apache.logging.log4j</groupId>
          <artifactId>log4j-core</artifactId>
      </dependency>
      ```
   
      如果没有版本依赖管理，还需要填写上版本号。
   
   5. 加入log4j2的配置文件log4j2.xml，关于这个请查看官方说明，例如：
   
      ```xml
       <?xml version="1.0" encoding="UTF-8"?>
       <!--日志级别以及优先级排序: OFF > FATAL > ERROR > WARN > INFO > DEBUG > TRACE > ALL -->
       <!--Configuration后面的status，这个用于设置log4j2自身内部的信息输出，可以不设置，当设置成trace时，你会看到log4j2内部各种详细输出-->
       <!--monitorInterval：Log4j能够自动检测修改配置 文件和重新配置本身，设置间隔秒数-->
       <configuration status="WARN" monitorInterval="30">
           <!--先定义所有的appender-->
           <appenders>
           <!--这个输出控制台的配置-->
               <console name="Console" target="SYSTEM_OUT">
               <!--输出日志的格式-->
                   <PatternLayout pattern="[%d{HH:mm:ss:SSS}] [%p] - %l - %m%n"/>
               </console>
               <!--文件会打印出所有信息，这个log每次运行程序会自动清空，由append属性决定，这个也挺有用的，适合临时测试用-->
               <File name="log" fileName="log/test.log" append="false">
                  <PatternLayout pattern="%d{HH:mm:ss.SSS} %-5level %class{36} %L %M - %msg%xEx%n"/>
               </File>
               <!-- 这个会打印出所有的info及以下级别的信息，每次大小超过size，则这size大小的日志会自动存入按年份-月份建立的文件夹下面并进行压缩，作为存档-->
               <RollingFile name="RollingFileInfo" fileName="${sys:user.home}/logs/info.log"
                            filePattern="${sys:user.home}/logs/$${date:yyyy-MM}/info-%d{yyyy-MM-dd}-%i.log">
                   <!--控制台只输出level及以上级别的信息（onMatch），其他的直接拒绝（onMismatch）-->
                   <ThresholdFilter level="info" onMatch="ACCEPT" onMismatch="DENY"/>
                   <PatternLayout pattern="[%d{HH:mm:ss:SSS}] [%p] - %l - %m%n"/>
                   <Policies>
                       <TimeBasedTriggeringPolicy/>
                       <SizeBasedTriggeringPolicy size="100 MB"/>
                   </Policies>
               </RollingFile>
               <RollingFile name="RollingFileWarn" fileName="${sys:user.home}/logs/warn.log"
                            filePattern="${sys:user.home}/logs/$${date:yyyy-MM}/warn-%d{yyyy-MM-dd}-%i.log">
                   <ThresholdFilter level="warn" onMatch="ACCEPT" onMismatch="DENY"/>
                   <PatternLayout pattern="[%d{HH:mm:ss:SSS}] [%p] - %l - %m%n"/>
                   <Policies>
                       <TimeBasedTriggeringPolicy/>
                       <SizeBasedTriggeringPolicy size="100 MB"/>
                   </Policies>
                   <!-- DefaultRolloverStrategy属性如不设置，则默认为最多同一文件夹下7个文件，这里设置了20 -->
                   <DefaultRolloverStrategy max="20"/>
               </RollingFile>
               <RollingFile name="RollingFileError" fileName="${sys:user.home}/logs/error.log"
                            filePattern="${sys:user.home}/logs/$${date:yyyy-MM}/error-%d{yyyy-MM-dd}-%i.log">
                   <ThresholdFilter level="error" onMatch="ACCEPT" onMismatch="DENY"/>
                   <PatternLayout pattern="[%d{HH:mm:ss:SSS}] [%p] - %l - %m%n"/>
                   <Policies>
                       <TimeBasedTriggeringPolicy/>
                       <SizeBasedTriggeringPolicy size="100 MB"/>
                   </Policies>
               </RollingFile>
           </appenders>
           <!--然后定义logger，只有定义了logger并引入的appender，appender才会生效-->
           <loggers>
               <!--过滤掉spring和mybatis的一些无用的DEBUG信息-->
               <logger name="org.springframework" level="INFO"></logger>
               <logger name="org.mybatis" level="INFO"></logger>
               <root level="all">
                   <appender-ref ref="Console"/>
                   <appender-ref ref="RollingFileInfo"/>
                   <appender-ref ref="RollingFileWarn"/>
                   <appender-ref ref="RollingFileError"/>
               </root>
           </loggers>
       </configuration>
      ```
   
   6. 启动服务进行验证

* **Q: netty版本问题**

   A: netty3和netty4是完全不同的三方件，因为坐标跟package都不相同，所以可以共存，但是要注意小版本问题，小版本必须使用CSE的版本。

* **Q: 服务超时设置**

   A: 在微服务描述文件（microservice.yaml）中添加如下配置：

   ```yaml
   cse:
     request:
       timeout: 30000
   ```

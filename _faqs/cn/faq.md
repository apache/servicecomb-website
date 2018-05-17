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

* **Q: 契约生成会报错Caused by: java.lang.Error: OperationId must be unique，不支持函数重载？**

   A: 我们是支持函数重载的， 加上`@ApiOperation`标签即可，demo-pojo中有示例。每个接口必须有唯一的operation id。

* **Q: 使用*spring-boot-starter-provider*这个依赖时，在*application.yml*文件中声明的`spring.main.web-application`属性并没有生效？**

   A: 使用*starter-provider*这个依赖时，如果用到了servlet这种方式时，需要在*application.properties*这个文件引入`spring.main.web-application=true`这样的属性或者在*application.yml*文件中声明，但是此时需要新建一个*application.properties*的文件，其内容可以为空。

* **Q: 网关依赖的jar和其他微服务的一样吗？**

   ```xml
   <groupId>org.apache.servicecomb</groupId>
   <artifactId>spring-boot-starter-provider</artifactId>
   ```

   A: 网关除了要依赖`spring-boot-starter-provider`之外还要依赖`spring-boot-starter-discovery`，可以参考[LinuxCon-Beijing-Workshop](https://github.com/ServiceComb/LinuxCon-Beijing-WorkShop)中manager的实现。

* **Q: 网关需要像其他微服务一样配置assembly吗？其中的/maven/gateway这个路径是docker maven plugin默认的吗？**

   A: 需要，由于项目现在使用的是spring-boot的打包方式，docker maven plugin也是依赖打包生成的文件来生成docker镜像的。/maven这个路径是docker maven plugin指定的，而gateway这个路径是在assembly中指定的。

* **Q: 服务接口的返回类型可以是任意类型吗？还是必须是responseEntity？**

   A: 可以，具体可以参考java-chassis的[integration-test的实现](https://github.com/apache/incubator-servicecomb-java-chassis/blob/master/integration-tests/springmvc-tests/src/test/java/org/apache/servicecomb/demo/springmvc/tests/SpringMvcIntegrationTestBase.java)。

* **Q: 微服务启动后，无法正确调用接口，或返回不存在错误？**

   A: 请检查调用路径与Producer实现代码中发布的路径完全一致。Producer端的启动日志可以查看到映射路径输出，例如：
   
   `[INFO] Swagger mapped "{[/hello/], method=[GET], produces=[application/json]}"`
   
   不同编程风格（模型）实现Producer的文档和注意事项请参见：[Jaxrs](/cn/users/develop-with-jax-rs/) [SpringMVC](/cn/users/develop-with-springmvc/) [Pojo](/cn/users/develop-with-transparent-rpc/) [Spring Boot](/cn/users/develop-with-spring-boot-starter/) 。

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
               $ref: "#/definitions/ResponseImpl"
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
               $ref: "#/definitions/ResponseImpl"
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
               $ref: "#/definitions/ResponseImpl"
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
          <groupId>org.apache.servicecomb</groupId>
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

* **Q: 服务超时设置**

   A: 在微服务描述文件（microservice.yaml）中添加如下配置：

   ```yaml
   servicecomb:
     request:
       timeout: 30000
   ```

* **Q: URL 地址就可以唯一定位，为什么要加上一个schema？**

   A:
   1. schema 是用来匹配服务契约的，用来保证服务端和消费端契约兼容，每个契约需要一个唯一ID，在服务中心存储。
   2. schema映射到java的interface概念，在consumer使用透明rpc模式开发时，可以找到是微服务里的哪个operation。schema之间的方法名是没有唯一性要求的。
   3. operation qualified name是治理的key，而URL 因为path参数的存在，没办法直接查找，而qualified name是不会变的。治理是不区分传输的，如果治理按URL 走，那么highway调进来时，还得根据参数反向构造出url，再来正则表达式匹配，太折腾了。
   4. http只是一种传输通道，还有别的传输通道不需要映射到URL的。

* **Q: rest客户端调用的时候，实际上只带上了服务名和URL，并不需要指定schema id的， 而实际上根据这个URL也能找到具体契约的，所以指定schema id作用何在？**

   A: 由于透明rpc是接口式调用，并没有URL，内部实际都归一化到operation来描述的，这样就可以结合schema id唯一定位到具体的请求处理中。

* **Q: Transport是个什么概念？用来干什么的？**

   A: transport负责编解码，以及传输。通信模型有rest和highway两种，highway对应的是私有协议，使用protobuf编码，rest用的是json。highway和rest都是基于vertx做的，vertx是基于netty的。

* **Q: 框架中引入了vertx会有什么好处？**

   A: 启用vertx的标准工作模式更强大，不过对业务人员要求就有些高了，目前还没开放业务接口出来。vertx标准的reactive工作模式，要求业务代码中不能有任何的block wait,sleep，大循环，总之不能有阻塞，做到这一点，就可以用更少的CPU，提供更多的服务。

* **Q: 一个服务提供者里面会有多个 appid 和微服务吗？什么场景会出现这种情况？**

   A: 会，这里表达的是一个merge的概念。microservice.yaml文件，可能同时存在于jar，磁盘，命令行参数指定这几个地方，此时他们按优先级合并，是用于增加灵活性的。在jar里的是默认值，在此之外，还有环境变量，命令行参数，配置中心覆盖，提供多层定制。

* **Q: ServiceComb和服务中心是怎么交互的?**

   A: 走rest，主要负责注册，取数据和心跳等；watch事件走websocket，watch事件是观察服务中心实例信息有没有变更。

* **Q: 有类似dubbo那种治理中心吗？**

   A: bizkeeper是一个handler，是治理的其中一个内容。治理可以通过handler扩展。

* **Q: service path怎么理解？**

   A: 每个微服务有一个servicePathManager，每一个schema将自己的path注册进去。

* **Q: 浏览器能直接访问微服务Endpoint吗？**

   A: 可以，restful发布的微服务Endpoint，可以直接在浏览器中使用HTTP加service path访问提供get方法的服务，如果是访问其他Http方法提供的服务建议安装使用[Postman](https://www.sap.com/developer/tutorials/api-tools-postman-install.html)。

* **Q: 契约生成时，需要强制带上版本号和语言吗？**

   A: 契约是属于微服务的，微服务本来就有版本，但语言是不应该带上版本号的。应该契约要求与语言无关。契约“没有版本”，契约的版本体现在微服务上，实例能找到所属的微服务的版本，就能找到一个确定的契约。

* **Q: ServiceRegistry里的设计代码和Eureka很类似？**

   A: 我们第一个版本就是在Spring Cloud的基础上做的 后来随着发展发现不够用了才逐渐自己做的一套，所以的确是在充分参考Eureka后设计的。

* **Q: 有些rpc是netty调用redis实现，比直接netty转发优势在哪里？**

   A: 可能是想用redis解决订阅发布吧。但这样意义也不大，之前也尝试过这么用，但后来都改成ServiceComb了。

* **Q: 如果同时引入了`transport-rest-servlet`和`transport-rest-vertx`的依赖，那么它怎么决定采用哪一个？**

   A: 如果端口没被占用，就用vertx；如果被占用了，就用servlet。

* **Q: qps流控设计时是出于什么场景考虑的？**

   A: 限流有两个主要作用，第一通过给不同的消费者限流保证对一些重点服务的服务效果，第二防止雪崩效应。可根据服务的重要性来决定水管的粗细，ServiceComb是支持消费端限流和服务端限流两种限流方式的，消费端限流可以做到比较精细的控制。

* **Q: 如果服务端是链式调用，即类似a->b->c，那设置了qps 流控会不会造成水管粗细不均的事情？**

   A: 一般采取的模式是先测量再设置。qps设置最终是结合整体业务需求来进行调控的，而不是就单个节点来进行设置。

* **Q: 通过cse://serviceName/appPath调用服务失败，报错:java.lang.Error:not support def type:class io.swagger.models.properties xxx**

   A: 检查consumer和provider依赖的java-chassis版本是否一致，如果不一致请修改并使用较新版本。

* **Q: 发送rest请求时，出现如下报错：Bad Request,description:http:request body too large**

   A: 检查Service Center是否老版本，如果是，则升级到最新版本。

* **Q: 如何在契约DTO中忽略中指定的属性？**

   A: 如果是使用rest transport，因为是Json序列化，可以使用@JsonIgnore注解标记需要忽略的属性；highway transport目前尚不支持。注意修改后需要更新微服务的version，例如:

  ```java
  public class OutputForTest{
  @JsonIgnore
  private String outputId = null;
  private String inputId = null;
  ...
  }
  ```

* **Q: 如何在用户自定义的handler中获取header中某个字段的值**

   A: 在用户自定义的handler使用@ApiImplicitParams注解声明，使用invocation.getArgs()获取header的值。例如:

  ```java
  public class MyHandler implements Handler {
    @ApiImplicitParams({@ApiImplicitParam(name = "tester", dataType = "string", paramType = "header")})
    @Override
    public void handle(Invocation invocation, AsyncResponse asyncResp) throws Exception {
      Object[] args = invocation.getArgs();
      System.out.println(args);
    }
  }
  ```

* **Q: 微服务运行时抛出异常：` java.lang.Error:not support def type:calss io.swagger.models.properties BaseIntegerProperty`？**

   A: 可将Service Center升级至0.4.0+版本来解决，[Service Center最新版本传送门](http://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center/1.0.0-m1/)。

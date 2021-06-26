---
title: "FAQ"
lang: en
ref: common-faq
permalink: /faqs/ 
excerpt: "FAQ"
last_modified_at: 2017-10-29T10:01:43-04:00
---


1. **Q: What is the relationship between ServiceComb and SpringCloud, and what is ServiceComb specific application scenarios? **

    A: ServiceComb is a set of microservice development frameworks based on large-scale IT system practices. It encapsulates a set of microservices running models based on best practices in development. These capabilities are completely transparent to users,it can be integrated and adjusted by configuration. In the operation and maintenance phase, microservices operation and maintenance have been fully considered, providing rich monitoring indicators and dynamic governance capabilities.
    B: ServiceComb's capabilities can be used as a separate development framework, in a scenario that requires a lightweight microservice solution, or on SpringCloud, working with other components provided by SpringCloud, in heavyweight The scene together with SpringCloud produces a '1+1>2' effect.

2. **Q: Do we have a problem with IntelliJ's free version? **
    A: No problem, use IntelliJ development, refer to [Setup Developer Environment] (/cn/developers/setup-develop-environment/) for the corresponding environment configuration.

3. **Q: What need to be cautious when using Java-Chassis?**

   A: There are a few restrictions when using Java-Chassis:
   * Before version 0.3.0-SNAPSHOT, it does not support annotations like `@GetMapping`.
   * When using the same HTTP request method, e.g. GET, the method name need to be unique as it will become operation ID when swagger generates contracts.
   * Class and method name need to be public.

4. **Q: Contract generation will report error: 'Caused by: java.lang.Error: OperationId must be unique', does not support function overriding? **

    A: We support function overriding, plus the `@ApiOperation` tag. There are examples in demo-pojo. Each interface must have a unique operation id.

5. **Q: When using the *spring-boot-starter-provider* dependency, property like `spring.main.web-environment` not working in *application.yml* file.**

   A: When you need both the starter provider dependency and the servlet, you need to declare `spring.main.web-environment` in *application.properties* file or declare it in *application.yml* file and create an empty *application.properties* file.
   
6. **Q: What's the dependency differences between gateway and other microservices?**

   ```xml
   <groupId>org.apache.servicecomb</groupId>
   <artifactId>spring-boot-starter-provider</artifactId>
   ```

   A: Gateway depends on not only the `spring-boot-starter-provider`, but also the `spring-boot-starter-discovery`. This can refer to the *manger* implementation of [LinuxCon-Beijing-Workshop](https://github.com/ServiceComb/LinuxCon-Beijing-WorkShop).

7. **Q: Do gateway need to configure assembly like the other microservices? Is */maven/gateway* the default path of the docker maven plugin?**

   A: Yes. Docker maven plugin relies on the assembly files to generate docker image. */maven* is the default path of docker maven plugin and */gateway* is the path defined in the assembly file.

8. **Q: Are there any restrictions of the return type of our API? Should it be the type of ResponseEntity?**

   A: No, examples can refer to [the implementation of integration-test](https://github.com/apache/incubator-servicecomb-java-chassis/blob/master/integration-tests/springmvc-tests/src/test/java/org/apache/servicecomb/demo/springmvc/tests/SpringMvcIntegrationTestBase.java) in java-chassis.
   
9. **Q: After the microservice is started, the interface cannot be called correctly, or is there no error returned? **

    A: Please check that the calling path is exactly the same as the path published in the Producer implementation code. The boot log on the Producer side can see the output of the map path, for example:
   
    `[INFO] Swagger mapped "{[/hello/], method=[GET], produces=[application/json]}"`
   
    For different programming styles (models) to implement Producer documentation and notes, please see: [Jaxrs](/cn/users/develop-with-jax-rs/) [SpringMVC](/cn/users/develop-with-springmvc/) [Pojo](/cn/users/develop-with-transparent-rpc/) [Spring Boot](/cn/users/develop-with-spring-boot-starter/) .
    
10. **Q: The port number under the microservice.yaml configuration file has been modified via eclipse. After starting the program, the port number does not work? **

    A: You need to import the sample project alone. If you import the entire ServiceComb-Java-Chassis project, the IDE will not compile the sample because the sample directory is not in the ServiceComb-Java-Chassis module. There is no error message under eclipse. Prompt message. Therefore, eclipse starts the demo of the sample and will find that the modified port does not work.
    
12. ** Q: How do I customize the HTTP status code in the REST interface for a Java method? **

A: For normal return values, you can do this with SwaggerAnnotation, for example:

   ```java
   @ApiResponse(code = 300, response = String.class, message = "")
   public int test(int x) {
     return 100;
   }
   ```

For the return value of the exception, you can do this by throwing a custom InvocationException, for example:

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

11. **Q: How to customize the log configuration of your own microservice?**

    A: ServiceComb does not bind the logger, just uses slf4j, users can freely choose log4j/log4j2/logback and so on. ServiceComb provides a log4j extension that supports incremental configuration of log4j's properties files on a standard log4j basis.
    * By default, the configuration file is loaded by the rule: "classpath\*:config/log4j.properties"
    * Actually search all the ```config/log4j.properties and config/log4j.*.properties``` in the classpath, and cut out the ```\*``` from the searched file to perform alpha. Sort, then load in order, and the final synthesized file is used as the log4j configuration file.
    * If you want to use ServiceComb's log4j extension, you need to call Log4jUtils.init, otherwise it will be used according to the rules of the standard logger.

12. **Q: When the service is configured with multiple transports, how do you choose which transport to use at runtime? **

   A:
   * ServiceComb's consumer, transport, handler, and producer are decoupled, and each function works together through contract definitions, namely:
      Consumer use transparent rpc, or springmvc development and use of highway, or RESTful transmission on the network does not matter with the producer is to use transparent rpc, or jaxrs, or springmvc development, there is no relationship between the receiver is not perceived, business development methods and transmission methods

   * Consumer access to the producer, at the runtime's transport selection, the general rule is:
      The consumer's transport and the producer's endpoint take the intersection. If there are multiple transports after the intersection, they are used in turn.

      Decomposed, there are the following scenarios:

   * When a microservice producer opens both the highway and the RESTful endpoint
      * Only the highway transport jar is deployed in the consumer process, only the producer's highway endpoint is accessed.
      * Only the RESTful transport jar is deployed in the consumer process, only the RESTful endpoint of the producer is accessed.
      * In the consumer process, both the highway and RESTful transport jars are deployed, and the producer's highway and RESTful endpoints are accessed in turn.

      If, at this time, the consumer wants to use a transport to access the producer, it can be configured in the microservice.yaml of the consumer process, specifying the name of the transport:

      ```yaml
      Servicecomb:
        References:
          <service_name>:
            Transport: highway
      ```

   * When a microservice producer only opens the endpoint of the highway
      * The consumer process only deploys the highway transport jar, then the highway access is normally used.
      *The consumer process only deploys RESTful transport jars and cannot be accessed
      * The consumer process deploys both the highway and the RESTful transport jar, and the highway access is normally used.

   * When a microservice producer only opens RESTful endpoints
      *The consumer process only deploys the highway transport jar and cannot access it.
      * The consumer process only deploys RESTful transport jars, which normally uses RESTful access.
      * The consumer process deploys both the highway and the RESTful transport jar, and the RESTful access is normally used.


13. **Q: The swagger body parameter type is incorrectly defined, causing the content registered in the service center to have no type information**

   **Symptom:**

   Define the following interface, put the parameters into the body to pass

   ```yaml
   /testInherate:
       Post:
         operationId: "testInherate"
         Parameters:
         - in: "body"
           Name: "xxxxx"
           Required: false
           Type: string
         Responses:
           200:
             Description: "response of 200"
             Schema:
               $ref: "#/definitions/ResponseImpl"
   ```

   Define the interface in the above way. After the service is registered, the interface type: string that is queried from the service center is lost and becomes:

   ```yaml
   /testInherate:
       Post:
         operationId: "testInherate"
         Parameters:
         - in: "body"
           Name: "xxxxx"
           Required: false
         Responses:
           200:
             Description: "response of 200"
             Schema:
               $ref: "#/definitions/ResponseImpl"
   ```

   If the client does not place a swagger, the following exception is also reported:

   ```text
      Caused by: java.lang.ClassFormatError: Method "testInherate" in class ? has illegal signature "
   ```

   A: When defining the type of the body parameter, you need to use the schema. You cannot use type directly.

   ```yaml
   /testInherate:
       Post:
         operationId: "testInherate"
         Parameters:
         - in: "body"
           Name: "request"
           Required: false
           Schema:
             Type: string
         Responses:
           200:
             Description: "response of 200"
             Schema:
               $ref: "#/definitions/ResponseImpl"
   ```

14. **Q: Does the ServiceComb microservices framework service innovate via long connection?**

    A: http request via a long connection (with a timeout), and the highway mode also via a long connection (all the time).
 
15. **Q: Is the service disconnected service center registration information automatically deleted?**

    A: The service center heartbeat detects that the service instance is unavailable, only the service instance information is removed, and the static data of the service is not removed.

 
16. **Q: How to implement service registration if you use the tomcat method to integrate the ServiceComb microservices framework**

    A: If you use the ServiceComb sdk servlet method (using the transport-rest-servlet dependency) to deploy to the tomcat as a war package, you need to ensure that the rest port configuration in the service description file (microservice.yaml) is consistent with the external container to implement the service. Register correctly. Otherwise, the tomcat open port cannot be perceived.

17. **Q: If you use the tomcat method to integrate the ServiceComb microservices framework, how to register the context of the war package deployment to the service center when the service is registered**

    A: When publishing the service interface, you need to put the context of the war package deployment at the front of the baseurl, so that the path registered to the service center is the complete path (including the context). Example:

    ```java
    @path(/{context}/xxx)
    Class ServiceA
    ```

18. **Q: How does the ServiceComb microservices framework implement data transparent transmission between multiple microservices**

    A:
    Transmitting data into:

    ```java
    CseHttpEntity<xxxx.class> httpEntity = new CseHttpEntity<>(xxx);
    / / Transparent content
    httpEntity.addContext("contextKey","contextValue");
    ResponseEntity<String> responseEntity = RestTemplateBuilder.create().exchange("cse://springmvc/springmvchello/sayhello",HttpMethod.POST, httpEntity, String.class);
    ```

    Transparent data acquisition:

    ```java
    @Override
    @RequestMapping(path="/sayhello",method = RequestMethod.POST)
    Public String sayHello(@RequestBody Person person, InvocationContext context){
      / / Transparent data acquisition
      context.getContext();
      Return "Hello person " + person.getName();
    }
    ```
   

19. **Q: How does the ServiceComb microservices framework service customize the return status code?**

    A:
    ```java
    @Override
    @RequestMapping(path = "/sayhello",method = RequestMethod.POST)
    Public String sayHello(@RequestBody Person person){
      InvocationContext context = ContextUtils.getInvocationContext();
      / / Custom status code
      context.setStatus(Status.CREATED);
      Return "Hello person "+person.getName();
    }
    ```

20. **Q: Partial exposure of ServiceComb body Model**

    A: There may be some attributes in the body object corresponding to an interface. You don't want to open it. Do not bring it out when generating the schema. Use:

    ```java
    @ApiModelProperty(hidden = true)
    ```

21. **Q: ServiceComb framework gets the address of the remote consumer**

    A: If you use the http rest method (using the transport-rest-vertx dependency) you can get it in the following way:

    ```java
    AbstractProducerContextArgMapper httpRequestCreator = (AbstractProducerContextArgMapper)invocation.getHandlerContext().get(RestConst.HTTP_REQUEST_CREATOR);
    If(httpRequestCreator != null){
      HttpServletRequest req = (HttpServletRequest)httpRequestCreator.createContextArg(invocation);
      System.out.println(req.getRemoteHost());
    }
    ```

    The actual scenario is to take the outermost address, so LB should be passed to edgeservice, and edgeService should be passed outside the context.

22. **Q: ServiceComb describes the handler**

    A: The consumer default handler is simpleLB. When there is no configuration, the handler chain will use this. If the handler is configured, it must contain the lb handler. Otherwise, the call error is reported in the document.

23. **Q: ServiceComb log replacement**

   A: CSE java-chassis log recommendation method is to use Log4jUtils.init\(\) at startup, directly use the recommended Log4j for log management, but some scenarios do not want to use log4j, such as want to use log4j2 or logback, below log4j2 Take a brief introduction to the next step:

   1. Do not use Log4jUtils.init\(\) in the code;
   2. Remove the log4j configuration file (it doesn't matter if you don't delete it, because it won't be used);
   3. Exclude the log4j introduced by the CSE framework, for example:
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
   4. Introducing the dependency of log4j2

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

      If there is no version dependency management, you need to fill in the version number.

   5. Add the log4j2 configuration file log4j2.xml. Please check the official description for this, for example:

      ```xml
       <?xml version="1.0" encoding="UTF-8"?>
       <!--Log level and priority ordering: OFF > FATAL > ERROR > WARN > INFO > DEBUG > TRACE > ALL -->
       <!--Configuration behind the configuration, this is used to set the internal information output of log4j2, can not be set, when set to trace, you will see various detailed output inside log4j2 -->
       <!--monitorInterval: Log4j can automatically detect the modified configuration file and reconfigure itself, set the interval seconds -->
       <configuration status="WARN" monitorInterval="30">
           <!--First define all appender-->
           <appenders>
           <!--This output console configuration -->
               <console name="Console" target="SYSTEM_OUT">
               <!--Format of output log -->
                   <PatternLayout pattern="[%d{HH:mm:ss:SSS}] [%p] - %l - %m%n"/>
               </console>
               <!--The file will print out all the information, this log will be automatically cleared every time the program is run, determined by the append attribute, this is also very useful, suitable for temporary testing -->
               <File name="log" fileName="log/test.log" append="false">
                  <PatternLayout pattern="%d{HH:mm:ss.SSS} %-5level %class{36} %L %M - %msg%xEx%n"/>
               </File>
               <!-- This will print out all info and the following level information. Each time the size exceeds the size, the size of the log will be automatically saved under the folder created by the year-month and compressed, as an archive -- >
               <RollingFile name="RollingFileInfo" fileName="${sys:user.home}/logs/info.log"
                            filePattern="${sys:user.home}/logs/$${date:yyyy-MM}/info-%d{yyyy-MM-dd}-%i.log">
                   <!--The console only outputs level and above information (onMatch), other direct rejection (onMismatch) -->
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
                   <!-- DefaultRolloverStrategy property is not set, the default is up to 7 files in the same folder, here set 20 -->
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
           <!-- Then define the logger, the appender will only take effect if the appender is defined and imported ->
           <loggers>
               <!--Filter out some useless DEBUG information from spring and mybatis -->
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
6. Start the service for verification

24. **Q: Service timeout setting**

    A: Add the following configuration to the microservice description file (microservice.yaml):
    
   ```yaml
   servicecomb:
     request:
       timeout: 30000
   ```

25. **Q: The URL address can be uniquely located. Why do you want to add a schema? **

    A:
    1. The schema is used to match the service contract. It is used to ensure that the server and the consumer contract are compatible. Each contract needs a unique ID and is stored in the service center.
    2. Schema maps to the interface concept of java. When the consumer uses the transparent rpc mode to develop, it can find which operation in the micro service. The method names between schemas are not unique.
    3. operation qualified name is the key of the governance, and the URL cannot be directly searched because of the existence of the path parameter, and the qualified name will not change. Governance does not distinguish between transmissions. If governance goes by URL, then when highway is called in, it has to construct the url according to the parameters, and then the regular expression matches, which is too tossing.
    4. http is just a transport channel, and there are other transport channels that do not need to be mapped to URLs.

26. **Q: When the Rest client is invocating, it only takes the service name and URL, and does not need to specify the schema id. In fact, according to this URL, the specific contract can also be found. So what is the role of the specified schema id? **

    A: Since transparent rpc is an interface call and does not have a URL, the internal is actually normalized to the operation to describe, so that it can be uniquely mapped to the specific request processing in conjunction with the schema id.
    

27. **Q: What is the concept of Transport? What is it used for? **

    A: The Transport is responsible for codec, and transmission. The communication model has two kinds of Rest and Highway. The Highway corresponds to the private protocol, which uses protobuf encoding, and the Rest uses json. Highway and Rest are based on vertx, and vertx is based on netty.
 
28. **Q: Is there be multiple appIDs and microservices in a service provider? What scenario will this happen? **

    A: Yes, what is expressed here is a concept of merge. The microservice.yaml file, which may exist in both jars, disks, and command line arguments, specifies that they are merged by priority and are used for added flexibility. In the jar is the default value, in addition to the environment variables, command line parameters, configuration center coverage, providing multiple layers of customization.

* **Q: How does ServiceComb interact with the service center?**

    A: Take the rest, mainly responsible for registration, taking data and heartbeat, etc.; 'watch event' via websocket, watch event is to observe whether the service center instance information has changed.

* **Q: Is there a governance center like dubbo? **

    A: bizkeeper is a handler, one of the contents of governance. Governance can be extended by handlers.

* **Q: How to understand the service path? **

    A: Each microservice has a servicePathManager, and each schema registers its own path.

* **Q: Can the browser directly access the microservice Endpoint? **

    A: Yes, the restful microservice Endpoint can be used to access the service that provides the get method directly in the browser using HTTP plus service path. If it is to access the services provided by other Http methods, it is recommended to install and use.(https://www.sap.com/developer/tutorials/api-tools-postman-install.html)

* **Q: When the contract is generated, do you have to add the version number and language? **

    A: The contract belongs to the microservice. The microservice has a version, but the language should not be accompanied by the version number. Contractual requirements should be independent of language. The contract "no version", the version of the contract is embodied in the microservice, the instance can find the version of the microservice to which it belongs, and a certain contract can be found.

* **Q: The design code in ServiceRegistry is similar to Eureka? **

    A: Our first version was built on the basis of Spring Cloud. Later, when we found that it was not enough to use it, we gradually made our own set, so it was designed after fully referring to Eureka.

* **Q: Some rpc is netty calling redis implementation, what is the advantage over direct netty forwarding? **

    A: Maybe I want to use Redis to solve the subscription release. But this is not a big deal. I tried it before, but later I changed it to ServiceComb.
    

* **Q: If you introduce the `transport-rest-servlet` and `transport-rest-vertx` dependencies at the same time, how does it decide which one to use? **

    A: If the port is not occupied, use vertx; if it is occupied, use servlet.

* **Q: What is the scenario for qps flow control design? **

A: Rate limit has two main functions. First, it guarantees the service effect to some key services by restricting different consumers, and the second is to prevent the avalanche effect. The thickness of the water pipe can be determined according to the importance of the service. ServiceComb supports two types of current limiting methods, namely, consumer-side current limiting and server-side current limiting. The consumer-side current limiting can achieve relatively fine control.

* **Q: If the server is a chain call, that is, a->b->c, then does the QPS flow control cause flow pipe uneven and unbalanced? **

    A: The general mode is to measure and then set. The qps settings are ultimately tuned in conjunction with the overall business needs, rather than setting them up on a single node.

* **Q: The service failed to be invoked via cse://serviceName/appPath, error: java.lang.Error:not support def type:class io.swagger.models.properties xxx**

    A: Check whether the version of java-chassis that the consumer and provider depend on are consistent. If they are inconsistent, please modify and use the newer version.

* **Q: When sending a rest request, the following error is reported: Bad Request, description: http:request body too large**

    A: Check if the Service Center is older version, and if so, upgrade to the latest version.

* **Q: How to ignore the attributes specified in the contract DTO? **

    A: If you are using 'rest transport', because it is Json serialization, you can use @JsonIgnore annotations to mark attributes that need to be ignored; 'highway transport' is not currently supported. Note that you need to update the version of the microservice after the modification, for example:
  
  ```java
  public class OutputForTest{
  @JsonIgnore
  private String outputId = null;
  private String inputId = null;
  ...
  }
  ```
 
* **Q: How to get the value of a field in the header in a user-defined handler**
    A: Use the @ApiImplicitParams annotation declaration in the user-defined handler and the invocation.getArgs() to get the value of the header. E.g:
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
* **Q: The exception is thrown when the microservices runtime: `java.lang.Error:not support def type:calss io.swagger.models.properties BaseIntegerProperty`? **

    A: Service Center can be upgraded to version 4.0.0+ to solve [Service Center latest version portal] (http://apache.org/dyn/closer.cgi/incubator/servicecomb/incubator-servicecomb-service-center /1.0.0-m1/).


*. **Q: Our API can not be accessed after microservices are up. It just returns *404 Not Found*. The codes we use is as follows:**

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

*. **Q: What\'s the default base path if I have not declared the value of RequestMapping annotation?**

   A: Supposed the class name of your controller is *HelloController*, the base path is /HelloController.
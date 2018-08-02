---
title: "Release Notes"
lang: en
ref: release
permalink: /release/java-chassis-release-notes/
excerpt: "Release Notes"
last_modified_at: 2018-03-28T00:50:43-55:00
---


        Release Notes - Apache ServiceComb - Version java-chassis-1.0.0
            
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-651'>SCB-651</a>] -         QPS rate limit bug
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-662'>SCB-662</a>] -         Using cse/servicecomb duplicate key will get list of values
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-666'>SCB-666</a>] -         Test failure on system that have rotate option set in /etc/resolv.conf
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-696'>SCB-696</a>] -         [AccessLog] If nginx send requests via short-lived connections, %v will print &quot;0.0.0.0&quot;
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-699'>SCB-699</a>] -         add schemaIds field in register.yaml when mock the Local sevice-center
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-703'>SCB-703</a>] -         When consumer invoke void type method in RPC style, an exception is thrown
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-705'>SCB-705</a>] -         When consumer invoke an unregistered provider, it will never find this provider even the provider is registered later
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-753'>SCB-753</a>] -         NPE when query not exists service
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-754'>SCB-754</a>] -         Check null invocation in AbstractRestInvocation to avoid unexpected NPE
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-759'>SCB-759</a>] -         Fix ServiceComb version error
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-772'>SCB-772</a>] -         Java Chassis::Handlers::Loadbalance test failed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-773'>SCB-773</a>] -         Java Chassis::Core test failed
</li>
</ul>
        
<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-616'>SCB-616</a>] -         Make access log mechanism extensible
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-640'>SCB-640</a>] -         Add black/white list support based on public key handler
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-679'>SCB-679</a>] -         Support Cross-Origin Resource Sharing (CORS)
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-708'>SCB-708</a>] -         Support assembling query param into Object parameter(in Spring MVC developing style)
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-752'>SCB-752</a>] -         User can switch off outputting merged log4j property file
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-760'>SCB-760</a>] -         provide a way to invoke service with full path
</li>
</ul>
        
<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-194'>SCB-194</a>] -         Improve component-scan setting
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-661'>SCB-661</a>] -         Logs improvement to give better information
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-671'>SCB-671</a>] -         Duplicate cse.xxx to servicecomb.xxx to work better in future
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-684'>SCB-684</a>] -         Following swagger conventions
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-685'>SCB-685</a>] -         Service comb chassis must support default values
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-697'>SCB-697</a>] -         Service comb chassis must support JAX-RS @DefaultValue
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-700'>SCB-700</a>] -         Check server status when choose an available server
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-701'>SCB-701</a>] -         RequestBody(required = false) and when requestBody is null then exception observed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-702'>SCB-702</a>] -         Deleted unwanted json-lib maven dependency for foundation-config
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-706'>SCB-706</a>] -         refactor loadbalance filters logic to support invocation based filter
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-712'>SCB-712</a>] -         Do not register service path to service center when not necessary
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-713'>SCB-713</a>] -         @DefaulValue should be set only when input param is null
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-715'>SCB-715</a>] -         Working in thread that do not have context class loader
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-727'>SCB-727</a>] -         Java Chassis-Local generated schema and service center schema are different while registering the service then print the difference content
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-750'>SCB-750</a>] -         Dependency management is incomplete in Saga and Java-Chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-755'>SCB-755</a>] -         [SCB-755] 755 Duplicate copy cse config to Servicecomb config
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-763'>SCB-763</a>] -         Simplify Dynamic Config (Apollo) Integration Test in Java Chassis
</li>
</ul>
        
<h2>        Wish
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-746'>SCB-746</a>] -         Update Chassis from m1 to m2 in start.servicecomb.io
</li>
</ul>
    
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-506'>SCB-506</a>] -         Report the service governance event 
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-693'>SCB-693</a>] -         registry microservice failed if get host address failed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-725'>SCB-725</a>] -         support get main class package when run with &quot;java -jar xxx.jar&quot;
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-726'>SCB-726</a>] -         edge support convert from form-data or x-www-form-urlencoded to json automatically
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-728'>SCB-728</a>] -         add decrypt/signature/... to edge demo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-729'>SCB-729</a>] -         check if instance cache equals to SC
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-733'>SCB-733</a>] -         open handlerContext for business logic, and add a new name: localContext
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-738'>SCB-738</a>] -         delete microservice from MicroserviceManager after it not exist in SC
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-762'>SCB-762</a>] -         resolve eclipse compile warnings
</li>
</ul>
                                                                                                                                        
                                                                                                                                        

        Release Notes - Apache ServiceComb - Version java-chassis-1.0.0-m2
    
<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-137'>SCB-137</a>] -         Add new dimension of transport way for all Consumer/Producer
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-196'>SCB-196</a>] -         Add metrics for each consumer/provider handler
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-203'>SCB-203</a>] -         servlet rest support file upload
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-252'>SCB-252</a>] -         Metrics support overwatch Integration
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-370'>SCB-370</a>] -         Metrics timer (like latency) output precision must to nano level not milli level
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-383'>SCB-383</a>] -         metrics subscribe invocation life event and do statistics
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-384'>SCB-384</a>] -         provide invocation performance log publisher
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-385'>SCB-385</a>] -         metrics publisher switch to new mechanism
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-422'>SCB-422</a>] -         add executor metrics, not just queue size
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-440'>SCB-440</a>] -         Provide Maven Archetype of business-service-pojo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-441'>SCB-441</a>] -         Provide Maven Archetype of business-service-jaxrs
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-442'>SCB-442</a>] -         Provide Maven Archetype of business-service-springmvc
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-445'>SCB-445</a>] -         delete old metrics mechanism
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-446'>SCB-446</a>] -         metrics-prometheus switch to new mechanism
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-450'>SCB-450</a>] -         documents for metrics initializer/publisher, and how to extend
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-462'>SCB-462</a>] -         cloud eye publisher switch to new mechanism
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-470'>SCB-470</a>] -         Provide Maven Archetype of business-service-spring-boot-starter
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-484'>SCB-484</a>] -         servlet rest support download
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-485'>SCB-485</a>] -         jaxrs mode support file download
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-486'>SCB-486</a>] -         edge support route file download invocation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-487'>SCB-487</a>] -         consumer support download file
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-494'>SCB-494</a>] -         support delete temp file after download
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-501'>SCB-501</a>] -         document for download
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-527'>SCB-527</a>] -         Reorganization All Archetype For Enable Auto Publish
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-529'>SCB-529</a>] -         producer download file from byte[]
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-531'>SCB-531</a>] -         x-java-interface change from require to optional
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-532'>SCB-532</a>] -         support recursive dependence
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-533'>SCB-533</a>] -         javassistUtils create class from CtClass, not only JavaType
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-534'>SCB-534</a>] -         generic class generate optimize
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-538'>SCB-538</a>] -         create SwaggerToClassGenerator to convert swagger to class
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-540'>SCB-540</a>] -         Delete archetypes from java-chassis-dependencies
</li>
</ul>
        
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-72'>SCB-72</a>] -         Can isolation information of provider and consumer been discovered through capability of release and subscription?
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-449'>SCB-449</a>] -         Typo in LICENSE
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-455'>SCB-455</a>] -         Base on 1.0.0-m2-SNAPSHOT version, execution of the metrics UT failed 
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-474'>SCB-474</a>] -         使用zuul做网关进行路由，当同一个微服务接口同时开放rest和highway方式时，出现无法调用情况。
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-481'>SCB-481</a>] -         Fix qps handler assertion errors when schemaid or microservice name contails . (dot)
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-490'>SCB-490</a>] -         Service Center verrsion is not forward compatible and needs to be noted in releasenote.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-495'>SCB-495</a>] -         Compile java-chassis 1.0.0-m2-SNAPSHOT failed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-502'>SCB-502</a>] -         logs日志没有输出
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-503'>SCB-503</a>] -         When using WeighedResponseTimeRule, there are some initialize and stateless access problems
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-507'>SCB-507</a>] -         poll task in MetricsBootstrap did not really measure meters
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-512'>SCB-512</a>] -         download support chinese file name
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-516'>SCB-516</a>] -         AccessLog of EdgeService does not print traceId
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-520'>SCB-520</a>] -         resolve service with env re-registered will fail
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-521'>SCB-521</a>] -         change the priority of ServiceComb config and SpringBoot config
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-562'>SCB-562</a>] -         Java Chassis will throw NPE when producer impl do not contain any method
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-567'>SCB-567</a>] -         treat warning as errors, modify the compilerArgments
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-579'>SCB-579</a>] -         NullPointerException is thrown when consumer upload null
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-580'>SCB-580</a>] -         When upload file size exceeds limitation of provider, consumer will return a confusing response
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-587'>SCB-587</a>] -         Fix archetypes readme
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-588'>SCB-588</a>] -         Set archetypes sourceEncoding to UTF-8
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-591'>SCB-591</a>] -         configcenter need to do encode
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-593'>SCB-593</a>] -         Change log level to remind user to specify loadbalance handler
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-597'>SCB-597</a>] -         update spring boot version from 1.4.5 to 1.5.12 in starter archetype
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-617'>SCB-617</a>] -         graceful shutdown with standalone tomcat
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-652'>SCB-652</a>] -         Fix schema registry environment configuration
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-653'>SCB-653</a>] -         When provider returns Transfer-Encoding header and Edge will cause problem
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-654'>SCB-654</a>] -         DiscoveryTree has concurrency problems.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-656'>SCB-656</a>] -         When provider returns non 200 code Edge Service will all convert to 502
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-658'>SCB-658</a>] -         leak of MicroserviceVersions register to EventBus
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-659'>SCB-659</a>] -         Fix build failed in Springmvc Integration Test
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-667'>SCB-667</a>] -         gracefully shutdown is not work in some case
</li>
</ul>
        
<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-6'>SCB-6</a>] -         ServiceComb Java Chassis Metrics
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-136'>SCB-136</a>] -         Improvement and New Features of Java Chassis Metrics in version 1.0.0-m2
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-201'>SCB-201</a>] -         As a SDK user, I want to send file/stream data so that I can use ServiceComb to handle the music or image data
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-257'>SCB-257</a>] -         As a developer, I want to download file from microservice
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-292'>SCB-292</a>] -         As a developer, I want to use annotation to validate input parameter
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-406'>SCB-406</a>] -         Chassis must support standard parameter validation handler
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-439'>SCB-439</a>] -         Provide Maven Archetypes in Java Chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-482'>SCB-482</a>] -         Http2 support for java chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-582'>SCB-582</a>] -         Provide a way to protection for instance removal
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-607'>SCB-607</a>] -         Support printing invocation context in access log
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-611'>SCB-611</a>] -         Provide a default Edge service dispatcher to make developer edge easy
</li>
</ul>
        
<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-350'>SCB-350</a>] -         Vertx ssl file config error execption approvement
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-355'>SCB-355</a>] -         As a operator, when sdk config a fault ak/sk on HuaweiCloud, then will auth token fail, but it continues to register, will cause may fault in server
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-373'>SCB-373</a>] -         As a developer, i want to do something around serialize/deserialize, so that we should make a  aspect to eanable others can do this work
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-431'>SCB-431</a>] -         Add Rat check on the travis CI
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-444'>SCB-444</a>] -         try to optimize autodiscovery function
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-447'>SCB-447</a>] -         optimize SPIServiceUtils to avoid get different instance for the same type
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-467'>SCB-467</a>] -         Contributing &amp; Reporting Issues in java-chassis README.md is not direct to any contents
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-477'>SCB-477</a>] -         sdk guava‘s version need to update from 16.0.1 to 19.0
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-488'>SCB-488</a>] -         Retry/Metrics some default behavior cause unnecessary retry and logs
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-498'>SCB-498</a>] -         Configuration Center IP Addresses need to meet general specifications
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-514'>SCB-514</a>] -         update pom and code, so that we can treat warnings as errors
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-517'>SCB-517</a>] -         service center starter for spring boot/cloud improvement
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-518'>SCB-518</a>] -         ServiceCenter ip address need to config default port
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-523'>SCB-523</a>] -         maven-remote-resource-plugin execute very slow
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-526'>SCB-526</a>] -         When creating dynamic configuration, we need to fetch once for the configuration when startup
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-543'>SCB-543</a>] -         optimize registry procedure
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-546'>SCB-546</a>] -         As a developer, want to reregistry schemas in the dev environment
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-548'>SCB-548</a>] -         Support Gracefully Shutdown
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-570'>SCB-570</a>] -         reformat  everything
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-575'>SCB-575</a>] -         Publish the Java doc of ServiceComb projects
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-576'>SCB-576</a>] -         javassist License file need to be updated
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-585'>SCB-585</a>] -         Add ServiceComb-java-chassis reference guide to project
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-625'>SCB-625</a>] -         ProduceProcessor use SPI to support extends
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-627'>SCB-627</a>] -         Java Chassis- Client Request Timeout support for operation/schema/service level
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-636'>SCB-636</a>] -         As a OM staff, i want to use the lb endpoint as the servicecenter/configcenter address config
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-646'>SCB-646</a>] -         if local swagger exists, not generate swagger according to class
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-649'>SCB-649</a>] -         when port can&#39;t been listened,log warn and show more detail message
</li>
</ul>
        
<h2>        Wish
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-504'>SCB-504</a>] -         Upgrade to Spring boot 1.5.12.RELEASE
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-515'>SCB-515</a>] -          change all configuration from &#39;cse.xxx&#39; to &#39;servicecomb.xxx&#39;
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-672'>SCB-672</a>] -         Edge Service support calls from different ApplicationIds
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-673'>SCB-673</a>] -         Edge Service support calls from different ApplicationIds
</li>
</ul>
    
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-324'>SCB-324</a>] -         Chassis must support network failure simulation, so that I can developers can enhance the robustness of the app
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-352'>SCB-352</a>] -         Support operation level flow control on provider side
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-354'>SCB-354</a>] -         metrics上报的统计数据可能需要支持加上业务自己的维度，方便统计分析，比如APP版本，机型等，业务可以把参数作为invocation参数传递到框架，需要框架支持
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-420'>SCB-420</a>] -         Change default HTTP header length restriction to 32K
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-424'>SCB-424</a>] -         Get configuration interface to add header: x-environment
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-443'>SCB-443</a>] -         Fix randomly UT failure of TestProviderQpsFlowControlHandler
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-453'>SCB-453</a>] -         Read configuration from application.yml/application.properties
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-456'>SCB-456</a>] -         Provider a way to input configuration from a Map, instead of  micreservice.yaml
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-457'>SCB-457</a>] -         Verify if gradle can manage the ServiceComb java Chassis jars in a remote or local maven repository
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-471'>SCB-471</a>] -         vertx upgrade causes use config center push mode error 
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-542'>SCB-542</a>] -         Update netty&#39;s version to 4.1.24
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-589'>SCB-589</a>] -         allow consumer upgrade before producer
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-590'>SCB-590</a>] -         Update the validator version to latest(6.0.2)
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-595'>SCB-595</a>] -         Compatible with old SC versions
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-599'>SCB-599</a>] -         Service registry failed when service before Service Center start
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-601'>SCB-601</a>] -         ServiceComb integrated to spring boot or tomcat will print too many logs
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-637'>SCB-637</a>] -         enhance HttpServletRequestEx impl
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-647'>SCB-647</a>] -         Update LICENSE/NOTICE for release
</li>
</ul>
                                                                                                                                    
                                                                                                                                    
        Release Notes - Apache ServiceComb - Version Java-Chassis-1.0.0-m1
    

### Major improvements:

 - Java Chassis can now use Apollo as configuration center. Users can now
change configurations like load balancing policy and those changes will
come into effect on the fly.
See [here](http://servicecomb.incubator.apache.org/users/dynamic-config/) for more
details.

 - Metrics was re-factored. We now uses events for collecting invocation data
instead of Hystrix. This reduces the performance penalty of computing
metrics.
Metrics can now be fetched via '/metrics' using HTTP.
See [here](http://servicecomb.incubator.apache.org/users/metrics-in-1.0.0-m1/) for
more details.

### Other Noticeable Changes:

- The Java Chassis libraries are now under group "org.apache.servicecomb".
- We provide out of the box metrics support now. Prometheus is supported.
- Configuration center was re-factored and moved out from foundation.
Support for Apollo was added.
- Users can now use Object type for calling services.
- Users can now use Generics for calling services.
- Better integration with Spring MVC.
- Upgraded to zipkin2 internally, Java Chassis can now work with zipkin
server v1 and v2.
- We are in the process of supporting reactive programming. Pojo consumer
and provider now supports CompletableFuture.

### For more detailed information please checkout [here](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12321626&version=12342351)

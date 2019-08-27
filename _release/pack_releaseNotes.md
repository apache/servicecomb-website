---
title: "ServiceComb Pack Release Notes"
lang: en
ref: release
permalink: /release/pack-release-notes/
excerpt: "ServiceComb Pack Release Notes"
last_modified_at: 2019-04-06T00:50:43-55:00
---


        Release Notes - Apache ServiceComb - Version pack-0.5.0
    
<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1372'>SCB-1372</a>] -         Collection state machine health to metrics
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1374'>SCB-1374</a>] -         Implement Alpha Event Channel Plugin
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1379'>SCB-1379</a>] -         Add alpha benchmark tool document
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1416'>SCB-1416</a>] -         Refactoring the core part of alpha-fsm module  to move to alpha-core
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1417'>SCB-1417</a>] -         Alpha Event Redis Channel Plugin
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1418'>SCB-1418</a>] -         Alpha Event Kafka Channel Plugin
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1435'>SCB-1435</a>] -         State machine manual
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1439'>SCB-1439</a>] -         Optimize class ElasticsearchTransactionRepository persistence parameters
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1442'>SCB-1442</a>] -         Topic initialization  &amp; Class KafkaMessagePublisher needs to use globalTxId as the partitioning strategy.
</li>
</ul>
        
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1264'>SCB-1264</a>] -         When setting server.port and alpha.server.port random port is missing the default tag configuration
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1281'>SCB-1281</a>] -         saga-frontend access alpha restful API has cross-domain issues
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1352'>SCB-1352</a>] -         Fixed a typo on ParametersContext class in servicecomb-pack
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1377'>SCB-1377</a>] -         The Notice file of ServiceComb-Pack need to updated
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1419'>SCB-1419</a>] -         ElasticsearchTransactionRepositoryTest failed for CI
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1421'>SCB-1421</a>] -         ElasticsearchTransactionRepositoryTest failed for CI 2
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1438'>SCB-1438</a>] -         Class ElasticsearchTransactionRepository synchronization save method is invalid
</li>
</ul>
            
<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1349'>SCB-1349</a>] -         support Nacos Discovery
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1386'>SCB-1386</a>] -         Support to send out SagaEnd event in other method
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1411'>SCB-1411</a>] -         Add alpha-ui module to provide a simple Web GUI
</li>
</ul>
    
<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-575'>SCB-575</a>] -         Publish the Java doc of ServiceComb projects
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1243'>SCB-1243</a>] -         Keep the handler name of saga-consumer and saga-producer 
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1247'>SCB-1247</a>] -         Set default value in alpha.cluster.address on omega side
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1272'>SCB-1272</a>] -         Improvement Omega timeout processing, interrupt request thread after the timeout
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1279'>SCB-1279</a>] -         add omega context verification
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1299'>SCB-1299</a>] -         Showing the type,createtime in the Saga UI
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1309'>SCB-1309</a>] -         ServicePack CI build should use sprint-boot-2 profile
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1380'>SCB-1380</a>] -         Upgrade Java-Chassis version to 1.2.1
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1381'>SCB-1381</a>] -         Add common api controller to bridge the request of transaction data querying and metrics data querying
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1385'>SCB-1385</a>] -         Provide a common way to pass GID and LID
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1387'>SCB-1387</a>] -         Upgrade Spring Boot version to 2.1.6
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1391'>SCB-1391</a>] -         Add support for explicit tx context passing for TCC
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1395'>SCB-1395</a>] -         Switch to openjdk in servicecomb-pack CI build
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1399'>SCB-1399</a>] -         Drop the support of Spring Boot 1.x for ServiceComb-Pack
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1432'>SCB-1432</a>] -         fix deprecated api
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1443'>SCB-1443</a>] -         Adding a Rolling File Appender for Log4j2
</li>
</ul>
    
<h2>        Test
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1397'>SCB-1397</a>] -         Acceptance test about Byteman error
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1403'>SCB-1403</a>] -         byteman port configuration conflicts in all acceptance tests.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1423'>SCB-1423</a>] -         Non-thread-safe method size of ConcurrentLinkedQueue in AlphaIntegrationTest
</li>
</ul>
        
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1026'>SCB-1026</a>] -         Saga compensation should support to define the retry times
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1238'>SCB-1238</a>] -         Introductory article on cluster implementation of ServiceComb Pack
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1241'>SCB-1241</a>] -         Update how to use mysql document
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1244'>SCB-1244</a>] -         Update the configuration of Pack 0.4.0 in the user guide
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1298'>SCB-1298</a>] -         Add Zookeeper as the Alpha server load balancer 
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1314'>SCB-1314</a>] -         support zookeeper user_guide
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1335'>SCB-1335</a>] -         Upgrade docker-compose file to 3.0
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1353'>SCB-1353</a>] -         Travis CI should fail fast
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1356'>SCB-1356</a>] -         add NACOS to DiscoveryType 
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1389'>SCB-1389</a>] -         Doc for SCB-1385
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1430'>SCB-1430</a>] -         Update the License file of ServiceComb Pack
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1440'>SCB-1440</a>] -         Remove the Kamon dependencies
</li>
</ul>
                                                                                                                                        

        Release Notes - Apache ServiceComb - Version pack-0.4.0

<h2> New and Noteworthy </h2>
  <ul>
   <li> Provides Alpha HA implementation </li>
   <li> Support to use eureka or consul to do the service discovery of Alpha</li>
   <li> Fix the event scanner thread exit issue </li>
  </ul>  

<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1180'>SCB-1180</a>] -         Unable to register eureka instance metadata on random gRPC port
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1187'>SCB-1187</a>] -         Update distribution LICENSE for Spring Cloud Starter Netflix
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1200'>SCB-1200</a>] -         Omega with consul
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1201'>SCB-1201</a>] -         alpha-spring-cloud-starter rename alpha-server-cloud-eureka-starter
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1204'>SCB-1204</a>] -         acceptance tests with consul
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1209'>SCB-1209</a>] -         Add a description about the integrated consul
</li>
</ul>

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1118'>SCB-1118</a>] -         EventScanner should catch the exception to keep it running.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1159'>SCB-1159</a>] -         Rxjs and TypeScript version compatibility issues
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1216'>SCB-1216</a>] -         Alpha Cluster support random gRPC port
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1217'>SCB-1217</a>] -         Consul support random gRPC port
</li>
</ul>

<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-15'>SCB-15</a>] -         service discovery with popular open source service registry
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1155'>SCB-1155</a>] -         Generate a random free gRPC port to launch alpha
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1199'>SCB-1199</a>] -         service discovery with consul
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1082'>SCB-1082</a>] -         Dependency-free-transaction-demo failed on Mac OSX
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1099'>SCB-1099</a>] -         Add nexus SNAPSHOT information to the README repo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1100'>SCB-1100</a>] -         Updated the user guide for migration from saga 0.2.x
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1103'>SCB-1103</a>] -         TCC should have participate started and ended events
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1110'>SCB-1110</a>] -         omega-transport-feign configure file error
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1119'>SCB-1119</a>] -         Add the order number on the demo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1121'>SCB-1121</a>] -         Clean up the OmegaContext once the invocation is over
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1122'>SCB-1122</a>] -         Specify the name of RestTemplate in the configuration
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1124'>SCB-1124</a>] -         Rename the Handler name of Omega transport
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1125'>SCB-1125</a>] -         Add omega instanceid to properties
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1127'>SCB-1127</a>] -         Support alpha server registering to Spring Cloud Eureka
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1128'>SCB-1128</a>] -         Omega get Alpha address from Spring Cloud Eureka
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1130'>SCB-1130</a>] -         Alpha cluster need distributed lock function
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1158'>SCB-1158</a>] -          External jars support Alpha
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1160'>SCB-1160</a>] -         SCB-1142 additional
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1171'>SCB-1171</a>] -         Improve unit test coverage for ClusterLockServiceTest
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1235'>SCB-1235</a>] -         Clean up third party license with maven plugin
</li>
</ul>

<h2>        Test
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-306'>SCB-306</a>] -         [pack] acceptance tests with all the transaction scenarios
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1152'>SCB-1152</a>] -         About abortTimeoutTxStartedEvent test case failed
</li>
</ul>

<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1151'>SCB-1151</a>] -         Add Eureka instructions in the user guide
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1161'>SCB-1161</a>] -         Eureka integration english guide
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1181'>SCB-1181</a>] -         Add mvn wrap script to lock the maven version
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1182'>SCB-1182</a>] -         Also need to use -Pspring-boot-2 by default
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1189'>SCB-1189</a>] -         Update the Eureka Integration User Guide for version 0.4.0
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1190'>SCB-1190</a>] -         Update the mysql manual for use extension jar description
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1194'>SCB-1194</a>] -         Specify alphaEventBus bean with @Qualifier(&quot;alphaEventBus&quot;)
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1195'>SCB-1195</a>] -         About typo in eureka Integrated documentation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1215'>SCB-1215</a>] -         Update document about alpha cluster
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1233'>SCB-1233</a>] -         Alpha Server should not include eureka dependencies by default
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1238'>SCB-1238</a>] -         Introductory article on cluster implementation of ServiceComb Pack
</li>
</ul>

        Release Notes - Apache ServiceComb - Version pack-0.3.0
<h2> New and Noteworthy </h2>
  <ul>
   <li> Provides the TCC support </li>
   <li> Rename the package name from "org.apache.servicecomb.saga" to "org.apache.servicecomb.pack"</li>
   <li> Omega supports JDK 1.7 </li>
   <li> Using Spring-Boot 2.1 by default </li>
</ul>   

<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-817'>SCB-817</a>] -         Setup the TCC events
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-818'>SCB-818</a>] -         Omega support of TCC
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-819'>SCB-819</a>] -         Acceptance test of  TCC Demo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-820'>SCB-820</a>] -         TCC demo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-856'>SCB-856</a>] -         Implement reaction of the event in Alpha Server
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-876'>SCB-876</a>] -         Confirm and Cancel invocation support of Omega
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-877'>SCB-877</a>] -         Alpha should pesistend the received TCC events
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-923'>SCB-923</a>] -         Provide API to access the TCC events
</li>
</ul>

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-739'>SCB-739</a>] -         It is useless for @SagaStart timeout,and it could not be compensated under @SagaStart
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-741'>SCB-741</a>] -         Caused by: com.mysql.jdbc.MysqlDataTruncation: Data truncation: Data too long for column &#39;payloads&#39; at row 1
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-745'>SCB-745</a>] -         RetrySender should not throw exception when go the saga start event.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-821'>SCB-821</a>] -         Add missing dependencyManagement for omega-transport-feign
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-822'>SCB-822</a>] -         Update LICENSE/NOTICE for saga
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-824'>SCB-824</a>] -         Failed to build saga demos
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-826'>SCB-826</a>] -         SagaStart abort event should use LocalTransactionID
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-830'>SCB-830</a>] -         Update Chassis from 1.0.0-m2 to 1.0.0 in Saga
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-831'>SCB-831</a>] -         Saga UT failed at LoadBalancedClusterMessageSenderTest on Windows environment
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-963'>SCB-963</a>] -         Saga transactional method can&#39;t work when compensation happens
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1081'>SCB-1081</a>] -         CompositeOmegaCallback&#39;s compensate(TxEvent event) method has concurrency issues
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1098'>SCB-1098</a>] -         Pack pom need to be updated
</li>
</ul>

<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-665'>SCB-665</a>] -         Provide TCC  support
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-730'>SCB-730</a>] -         Add Feign transport for supporting Spring Cloud
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-731'>SCB-731</a>] -         Add the omega-transport-feign into distribution kit
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-732'>SCB-732</a>] -         Add the omega-transport-feign into distribution kit
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-909'>SCB-909</a>] -         Add fault tolerance for service comb TCC
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-244'>SCB-244</a>] -         [pack] add demo to use pack with java chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-630'>SCB-630</a>] -         Active the -Pdocker profile if detect the docker installation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-639'>SCB-639</a>] -         upgrade docker maven plugin
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-660'>SCB-660</a>] -         Update the dubbo example compose file
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-750'>SCB-750</a>] -         Dependency management is incomplete in Saga and Java-Chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-785'>SCB-785</a>] -         Cannot get the GlobalTxId and LocalTxId in the compensation method
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-805'>SCB-805</a>] -         If the node time of alpha and omega are not same, the transaction could be aborted
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-806'>SCB-806</a>] -         Polish alpha-server logger
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-813'>SCB-813</a>] -         pack-contract-grp module mvn install builds failure
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-829'>SCB-829</a>] -         An index on TxEvent (globalTxId) should be added
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-853'>SCB-853</a>] -         Support JDK7 in saga-core
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-865'>SCB-865</a>] -         Refactoring the Omega Interceptors
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-868'>SCB-868</a>] -         Added kamon metrics to Alpha Server
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-874'>SCB-874</a>] -         saga dubbo demo insert sql and readme optimization
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-875'>SCB-875</a>] -         Start the old saga demo with sh script
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-879'>SCB-879</a>] -         Pack the aspectj-wave jar into Alpha Server when using perf profile
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-885'>SCB-885</a>] -         saga alpha event scanner delete duplicate events sql optimization
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-913'>SCB-913</a>] -         Switch TCC demo JPA implementation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-916'>SCB-916</a>] -         Clean up @order annotation in TransactionAspectConfig
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1013'>SCB-1013</a>] -         Support to disable the event scanner Alpha
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1018'>SCB-1018</a>] -         Upgrade spring boot  version to 1.5.17 and 2.0.6
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1029'>SCB-1029</a>] -         The compensationMethod size is small
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1036'>SCB-1036</a>] -         Throw exception when Compensable retries below -1.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1086'>SCB-1086</a>] -         Using spring-boot-2 by default
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1090'>SCB-1090</a>] -         Unify the logger output of the Omega transport.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1091'>SCB-1091</a>] -         Upgrade the dubbo version to 2.6.4
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1093'>SCB-1093</a>] -         Upgrade the Spring Boot version to 2.1.1 Release
</li>
</ul>

<h2>        Test
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-823'>SCB-823</a>] -         Set up a fully functional test in kubernetes environment
</li>
</ul>

<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-648'>SCB-648</a>] -         Omega support JDK7
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-766'>SCB-766</a>] -         Upgrade Spring Boot version to 2.0.3.Release and 1.5.14.Release
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-784'>SCB-784</a>] -         SagaStart annotated method should abort the saga transaction once the exception is thrown
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-973'>SCB-973</a>] -         TLP graduation tasks
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-976'>SCB-976</a>] -         Create new git repo for ServiceComb Saga-Core module
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1078'>SCB-1078</a>] -         Clean up the saga-core modules from saga-pack repo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1097'>SCB-1097</a>] -         Clean up the distribution of servicecomb-pack
</li>
</ul>

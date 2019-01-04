---
title: "ServiceComb Pack Release Notes"
lang: en
ref: release
permalink: /release/pack-release-notes/
excerpt: "ServiceComb Pack Release Notes"
last_modified_at: 2018-03-28T00:50:43-55:00
---

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

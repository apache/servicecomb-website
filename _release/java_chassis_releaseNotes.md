---
title: "Release Notes"
lang: en
ref: release
permalink: /release/java-chassis-release-notes/
excerpt: "Release Notes"
last_modified_at: 2019-04-12T00:50:43-55:00
---


        Release Notes - Apache ServiceComb - Version java-chassis-2.0.2

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1823'>SCB-1823</a>] -         change kie label env to environment
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1824'>SCB-1824</a>] -         jacskon convertValue will convert all objects start for 2.10.*, java-chassis need not convert RestTemplate arguments
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1826'>SCB-1826</a>] -         remove binary release LICENSE since 3rd parties not included
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1837'>SCB-1837</a>] -         revert changes for SCB-1643, do not include huaweicloud jar
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1857'>SCB-1857</a>] -         RequestLog need to distinguish PRODUCER or CONSUMER for InvocationFinishEvent
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1861'>SCB-1861</a>] -         fix config kie value parsing errors
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1863'>SCB-1863</a>] -         config kie bug fix : toke the revision when pull from kie
</li>
</ul>

<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1810'>SCB-1810</a>] -         create a new Dispathcer to direct forward requests to HTTP server and send response
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1816'>SCB-1816</a>] -         Print the instance endpoints in the end of the start up log
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1828'>SCB-1828</a>] -         support @JsonView
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1834'>SCB-1834</a>] -         add BOM for java-chassis
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1822'>SCB-1822</a>] -         fix problems when using multiple consumer interface for one operation and using CseHttpEntity to set localcontext
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1825'>SCB-1825</a>] -         client outlog: rename item and delete README.md
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1830'>SCB-1830</a>] -         refactring code: Invocation carry changable data in each Invocation in a better way
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1831'>SCB-1831</a>] -         Loadbalancer set endpoint can use Endpoint other the literal string
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1840'>SCB-1840</a>] -         InvokerUtils inherit current context to support tracing and other features
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1845'>SCB-1845</a>] -         add TOC for java-chassis documents to make easier to search
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1851'>SCB-1851</a>] -         config-kie: support enable property
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1853'>SCB-1853</a>] -         fix problems in README.md
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1862'>SCB-1862</a>] -         ServiceComb add extensions  to support cas env variables
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1866'>SCB-1866</a>] -         dependency update: jackson-datatype-jsr310 from unmanaged to 2.10.0
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1867'>SCB-1867</a>] -         dependency update: netty, from 4.1.45.Final to 4.1.47.Final
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1868'>SCB-1868</a>] -         change ISO8601DateFormat


        Release Notes - Apache ServiceComb - Version java-chassis-2.0.1

<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1531'>SCB-1531</a>] -         Support multiple service-center clusters
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1752'>SCB-1752</a>] -         accessor problem fix:  LogMarkerLeakFixUtils memory leak fix
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1801'>SCB-1801</a>] -         fix SCB-1752
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1802'>SCB-1802</a>] -         add document: for servlet transport, remove log4j will cause some change
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1807'>SCB-1807</a>] -         update documentation for kie long polling
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1809'>SCB-1809</a>] -         add document for InvokerUtils usage
</li>
</ul>

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1787'>SCB-1787</a>] -         Http 2 idleTimeoutInSeconds is not used
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1793'>SCB-1793</a>] -         When use @RequestHeader(value =&quot;xxx&quot;) and aggregatedParam at same time, it will throw null pointer exception
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1795'>SCB-1795</a>] -         when use query object, sdk don&#39;t support fluent setter
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1799'>SCB-1799</a>] -         add back servicecomb.service.registry.registerUrlPrefix
</li>
</ul>

<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1737'>SCB-1737</a>] -         support ISO 8601 data and time
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1796'>SCB-1796</a>] -         support client outlog
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1798'>SCB-1798</a>] -         InvokerUtils support specify response type
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1812'>SCB-1812</a>] -         Endpoint add new constructor to support user defined transport
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1779'>SCB-1779</a>] -         update servicecomb test cases to make run in MAC
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1785'>SCB-1785</a>] -         Run java-chassis in spring boot with external tomcat
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1786'>SCB-1786</a>] -         remove log4j dependency by default
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1794'>SCB-1794</a>] -         update the version of commons-beautils
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1800'>SCB-1800</a>] -         log4j is deprecated package, make log4j implementaions optional
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1803'>SCB-1803</a>] -         config-kie support long polling
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1814'>SCB-1814</a>] -         binary release only include java-chassis artifacts
</li>
</ul>

<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1804'>SCB-1804</a>] -         anylyse updating commons-configuration and archairus
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1805'>SCB-1805</a>] -         clear some unused 3rd party software and use akarta Expression Language
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1806'>SCB-1806</a>] -         PR TestSpringMVCObjectParamTypeRestOnly should run both for rest and highway
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1808'>SCB-1808</a>] -         add documentaion for using TraceIdLogger
</li>
</ul>


        Release Notes - Apache ServiceComb - Version java-chassis-2.0.0

<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-267'>SCB-267</a>] -         support generic for highway
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1117'>SCB-1117</a>] -         change SwaggerConsumer arguments to not depend on swagger class generation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1212'>SCB-1212</a>] -         change response mapper to not depend on swagger class generation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1213'>SCB-1213</a>] -         swagger generator placeholder resolver not depend on spring
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1214'>SCB-1214</a>] -         change weak-contract-type branch version to weak-contract-type-SNAPSHOT
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1225'>SCB-1225</a>] -         swagger generator core not depend on create dynamic class
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1227'>SCB-1227</a>] -         swagger generator jaxrs not depend on create dynamic class
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1228'>SCB-1228</a>] -         swagger generator springmvc not depend on create dynamic class
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1242'>SCB-1242</a>] -         provide spring data plugin to generate swagger and deserialize
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1248'>SCB-1248</a>] -         ServiceRegistry manage MicroserviceMeta
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1252'>SCB-1252</a>] -         change element of HttpParameterType to uppercase
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1256'>SCB-1256</a>] -         rename ConcreteInterfaceRegister to ConcreteTypeRegister
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1268'>SCB-1268</a>] -         ServiceRegistry publish microservice life event and move meta back to core
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1269'>SCB-1269</a>] -         change SwaggerProducer arguments to not depend on swagger class generation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1283'>SCB-1283</a>] -         avoid generate empty property by SwaggerDefinition
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1284'>SCB-1284</a>] -         operationId should not be empty
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1285'>SCB-1285</a>] -         enhance ResponseTypeProcessor to support extractResponseType
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1286'>SCB-1286</a>] -         support only generate response for a operation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1290'>SCB-1290</a>] -         add swagger generator unit test case for List&lt;List&lt;String&gt;&gt;
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1323'>SCB-1323</a>] -         should ignore parameter of HttpServletRequest when generate swagger
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1324'>SCB-1324</a>] -         basePath should be a single slash when basePath not specified and annotation by RestController
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1327'>SCB-1327</a>] -         delete duplicated swagger definition: ExtendConst
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1328'>SCB-1328</a>] -         restore feature: collect java type from swagger model or property
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1336'>SCB-1336</a>] -         should not lost @ApiParam description when wrap parameter to body at swagger generator pojo mode
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1337'>SCB-1337</a>] -         should wrap enum to body at swagger generator pojo mode
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1338'>SCB-1338</a>] -         tiny optimize for collect primitive default value
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1342'>SCB-1342</a>] -         consumer should not use ArgumentsMapperDirectReuse when arg index is different
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1344'>SCB-1344</a>] -         use producer parameter type in producer argument mapper for wrapped body
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1345'>SCB-1345</a>] -         rest transport switch to weak type core
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1346'>SCB-1346</a>] -         only special type need convert logic
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1347'>SCB-1347</a>] -         tiny optimize for DefaultParameterNameProvider
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1348'>SCB-1348</a>] -         change SchemaLoader to SwaggerLoader
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1362'>SCB-1362</a>] -         microservice meta not depend on create dynamic class
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1625'>SCB-1625</a>] -         update license file
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1626'>SCB-1626</a>] -         provide interface to replace spring 5 deprecated classes
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1628'>SCB-1628</a>] -         change starter name
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1629'>SCB-1629</a>] -         documentation should cut 2.0 branch
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1630'>SCB-1630</a>] -         add documentation for spring boot and add samples for it
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1631'>SCB-1631</a>] -         add documentation to help users migrate from 1.x to 2.0
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1632'>SCB-1632</a>] -         Complete weak type code and merge it into master branch
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1635'>SCB-1635</a>] -         Recover highway tests
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1636'>SCB-1636</a>] -         SwaggerLoader remove the dependency on Spring utilities
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1637'>SCB-1637</a>] -         Fix test problem in demo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1644'>SCB-1644</a>] -         add tests for different model in client and server
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1678'>SCB-1678</a>] -         using new proto API to serialize/deserialize Internal Objects
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1682'>SCB-1682</a>] -         Refactor getVendorExtensions method and add ProtoMapper to ScopedProtobufSchemaManager
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1683'>SCB-1683</a>] -         using new proto API to serialize/deserialize Requests/Responses
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1684'>SCB-1684</a>] -         add codec test cases and fix Date/LocalDate codec problem
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1692'>SCB-1692</a>] -         deserialize arguments in map with arguments actual types
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1693'>SCB-1693</a>] -         invocation args change from array to map
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1703'>SCB-1703</a>] -         Highway transport switch to new codec APIs and turn on highway transport
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1704'>SCB-1704</a>] -         change invocation arguments from &quot;swagger arguments&quot; to &quot;invocation arguments&quot;
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1706'>SCB-1706</a>] -         mapper arguments in codec phase for REST
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1709'>SCB-1709</a>] -         restore arguments mappers and refactor to invocation argument types
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1713'>SCB-1713</a>] -         Invocation carries both invocation arguments and swagger arguments
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1714'>SCB-1714</a>] -         highway support different models and arguments types in consumer and provider
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1722'>SCB-1722</a>] -         add generics test case and fix know problems
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1725'>SCB-1725</a>] -         turn on integration tests of highway
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1726'>SCB-1726</a>] -         fix all TODOs in springmvc demo(integration tests)
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1727'>SCB-1727</a>] -         support encode/decode Object(Any) types
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1728'>SCB-1728</a>] -         support response headers in Response type
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1730'>SCB-1730</a>] -         highway support primitive default values and convert char/byte/short
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1732'>SCB-1732</a>] -         support inheritance schema definition
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1734'>SCB-1734</a>] -         add a test case for bean with aXXX property and documents
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1744'>SCB-1744</a>] -         separate primitive descriptorParamType from non primitive
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1745'>SCB-1745</a>] -         remove accessor modifier in reflection
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1746'>SCB-1746</a>] -         add docs for SCB-1745 of changes
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1749'>SCB-1749</a>] -         fix OperationConfig setter problem
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1750'>SCB-1750</a>] -         remove usage of javax.xml.ws.Holder
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1755'>SCB-1755</a>] -         add  JavaBeans Activation Framework implicitly
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1758'>SCB-1758</a>] -         add document links to older versions
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1759'>SCB-1759</a>] -          fix first sample link error
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1761'>SCB-1761</a>] -         import document of porter application to java-chassis doc
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1762'>SCB-1762</a>] -         change gitbook to mkdoc
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1764'>SCB-1764</a>] -         add porter appliation to docs
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1765'>SCB-1765</a>] -         create a mirror for github pages for better access of china
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1766'>SCB-1766</a>] -         add documents for kie, nacos, appollo integration
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1771'>SCB-1771</a>] -         change project version to 2.0.0
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1772'>SCB-1772</a>] -         fix javadoc compile error
</li>
</ul>

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1310'>SCB-1310</a>] -         @RequestPart should use MultipartFile instead of string
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1489'>SCB-1489</a>] -         Micro-service instance wouldn&#39;t work after we shotdown our service center for updating while we had enable RSA authentication between services.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1546'>SCB-1546</a>] -         fix wrong code for sample
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1601'>SCB-1601</a>] -         Abandon waiting 30 seconds after waiting request timeout.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1638'>SCB-1638</a>] -         servicecenter do not handle websocket PONG message
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1710'>SCB-1710</a>] -         The scheduled tasks in RemoteServiceRegistry may be interrupted by exception
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1715'>SCB-1715</a>] -         IdleTimeout not work in client side without keepaliveTimeout set
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1716'>SCB-1716</a>] -         High CPU load when there are too many instances
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1717'>SCB-1717</a>] -         Return nothing when file upload exception occurs
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1740'>SCB-1740</a>] -         RouterInvokeFilter beforeSendResponseAsync return null and cause server hang without any information
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1747'>SCB-1747</a>] -         fix long file name problems
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1763'>SCB-1763</a>] -         upgrade netty and tcnative
</li>
</ul>

<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-102'>SCB-102</a>] -         As a developer, I want to work in reactive mode to improve performance
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-265'>SCB-265</a>] -         Support generic type in input parameter or response type
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-279'>SCB-279</a>] -         As a developer, I need to build edge service to open my microservices to the external users
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1499'>SCB-1499</a>] -         support servicecomb kie
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1550'>SCB-1550</a>] -         Add a sample Java client of ServiceComb-Kie
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1565'>SCB-1565</a>] -         add a Java client of servicecomb-service-center
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1566'>SCB-1566</a>] -         add README.md for 中文
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1615'>SCB-1615</a>] -         Extended dynamic configuration support for Nacos
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1624'>SCB-1624</a>] -         remove spring 4 &amp; spring boot 1 support for java-chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1643'>SCB-1643</a>] -         add a slution to integrate with huaweicloud
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1649'>SCB-1649</a>] -         RestTemplate result can use a different model than provider
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1674'>SCB-1674</a>] -         Highway transport not dependent on class generation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1711'>SCB-1711</a>] -         suppot kie as config source in java-chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1757'>SCB-1757</a>] -         prepare and improment documents for java-chassis 2.0
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1557'>SCB-1557</a>] -         Fix application start info log incorrect
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1567'>SCB-1567</a>] -         move java-chassis samples to servicecomb-samples project
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1574'>SCB-1574</a>] -         Add README for Kie-Client
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1575'>SCB-1575</a>] -         Add README for Service-Center-Client
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1582'>SCB-1582</a>] -         Upgrading thirdparty dependency versions
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1588'>SCB-1588</a>] -         ServerListFilterExt add switch
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1592'>SCB-1592</a>] -         upgrade vert.x and netty
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1610'>SCB-1610</a>] -         add updateInstanceStatus to ServiceRegistryClient.java
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1616'>SCB-1616</a>] -         refactor edge dispatcher to make them more extensible
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1623'>SCB-1623</a>] -         when timeout, return 500 error code and message is timeout
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1666'>SCB-1666</a>] -         improve documents for file uploading / downloading
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1705'>SCB-1705</a>] -         Update javax.servlet to jakarta.servlet
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1708'>SCB-1708</a>] -         add inspector module developer guide
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1767'>SCB-1767</a>] -         adjust nacos config name
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1773'>SCB-1773</a>] -         fix javadoc error: doclink all docs and add comments to APIs
</li>
</ul>

<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1559'>SCB-1559</a>] -         Use java.time.Clock instead of java.lang.System#currentTimeMillis to get time
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1770'>SCB-1770</a>] -         release java-chassis 2.0.0
</li>
</ul>                                                                                                                                        


        Release Notes - Apache ServiceComb - Version java-chassis-1.3.0

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1304'>SCB-1304</a>] -         FallbackPolicy interface support returns an exception
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1305'>SCB-1305</a>] -         CseAsyncRestTemplate is not support set headers
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1306'>SCB-1306</a>] -         When the request body of VertxServerRequestToHttpServletRequest is modified, the field VertxServerRequestToHttpServletRequest#inputStream should be set to null
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1318'>SCB-1318</a>] -         There may be memory leak in RSAProviderTokenManager
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1390'>SCB-1390</a>] -         quick start java-chassis samples bmi has some errors
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1475'>SCB-1475</a>] -         ServiceCombServerStats.getFailedRate may arise an  exception of java.lang.ArithmeticException: / by zero under concurrency scenarios
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1511'>SCB-1511</a>] -         when use method override, the generated swagger body is wrong
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1513'>SCB-1513</a>] -         merge config items according to priority
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1520'>SCB-1520</a>] -         using RPC and when first paramter type is Object, the second parameter value will be null
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1543'>SCB-1543</a>] -         java-chassis dependency structure is wrong and compile fail in clean environment
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1274'>SCB-1274</a>] -         when service center is unavailable, service should enter safe mode.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1278'>SCB-1278</a>] -         ServiceComb related headers are not exposed to 3rd party services by default
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1287'>SCB-1287</a>] -         refactor edge dispatcher to make them more extensible
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1291'>SCB-1291</a>] -         Support rest interface method overriding by @ApiOperation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1297'>SCB-1297</a>] -         Print warn log about config resolving failure while fetching config from Spring Environment
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1308'>SCB-1308</a>] -         Improve instance isolation mechanism
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1392'>SCB-1392</a>] -         If Multiple java bean param types are given the same name by using @ApiModel, there should be error tips in microservice&#39;s booting log
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1402'>SCB-1402</a>] -         BeanUtils.getImplClassFromBean can not return correctly info in cglib proxy situation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1405'>SCB-1405</a>] -         support maxWaitQueueSize setting in RestTransportClient
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1407'>SCB-1407</a>] -         Add new field when print provideCache log
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1431'>SCB-1431</a>] -         set all dependency version as properties in java-chasis-dependencies
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1434'>SCB-1434</a>] -         add a springboot2 archetype
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1437'>SCB-1437</a>] -         Upgrading third party dependency versions
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1448'>SCB-1448</a>] -         support class inheritance and interface inheritance with template type
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1450'>SCB-1450</a>] -         Microservice instance may get stuck when watch connection to sc is recovered and pulling instance action is executed in eventloop thread
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1451'>SCB-1451</a>] -         Printing the service information on the log
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1457'>SCB-1457</a>] -         delete no use code in ProtobufManager
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1461'>SCB-1461</a>] -         servicecomb.service.registry.client.workerPoolSize hasn&#39;t display the real role that it has announce by its name.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1462'>SCB-1462</a>] -         Two properties has been required by fix SCB-1450.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1488'>SCB-1488</a>] -         Upgrading protobuf version to 3.7.1
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1492'>SCB-1492</a>] -         Allow users to custom the ObjectMapper used in Swagger schema generation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1494'>SCB-1494</a>] -         Optimizing log when starting a new microservice
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1515'>SCB-1515</a>] -         use jdk 8 compiler for the Travis-CI of java-chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1516'>SCB-1516</a>] -         Upgrade third-party dependency versions
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1522'>SCB-1522</a>] -         Add &quot;Why use Java Chassis&quot; introduction into README
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1523'>SCB-1523</a>] -         Stopping retrying another server when no server available
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1524'>SCB-1524</a>] -         support register schema when old schema already exists
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1525'>SCB-1525</a>] -         print codec error stack
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1528'>SCB-1528</a>] -         Optimizing some code implementations
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1544'>SCB-1544</a>] -         default metrics printer should not print 0 operations
</li>
</ul>

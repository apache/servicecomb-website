---
title: "Release Notes"
lang: cn
ref: release
permalink: /cn/release/service-center-release-notes/
excerpt: "Release Notes"
last_modified_at: 2022-03-25T00:50:43-55:00
---


        Release Notes - Apache ServiceComb - Version service-center-2.1.0

## Bug

- [SCB-2400](https://issues.apache.org/jira/browse/SCB-2400) - Govern api return empty schemaIds
- [SCB-2403](https://issues.apache.org/jira/browse/SCB-2403) - Start up failed when upgrade sc version
- [SCB-2404](https://issues.apache.org/jira/browse/SCB-2404) - Return internal properties when list all microservices
- [SCB-2411](https://issues.apache.org/jira/browse/SCB-2411) - Try dlock before start retirement job
- [SCB-2418](https://issues.apache.org/jira/browse/SCB-2418) - Fix etcd metrics not correct
- [SCB-2420](https://issues.apache.org/jira/browse/SCB-2420) - Can not delete unused role

## New Feature

- [SCB-2402](https://issues.apache.org/jira/browse/SCB-2402) - Support synchronization of multiple registries
- [SCB-2401](https://issues.apache.org/jira/browse/SCB-2401) - Append inner properties when heartbeat success
- [SCB-2408](https://issues.apache.org/jira/browse/SCB-2408) - Add put instance service
- [SCB-2409](https://issues.apache.org/jira/browse/SCB-2409) - Add resource usage service
- [SCB-2412](https://issues.apache.org/jira/browse/SCB-2412) - Add dlock service
- [SCB-2414](https://issues.apache.org/jira/browse/SCB-2414) - Add schema retire cron job
- [SCB-2415](https://issues.apache.org/jira/browse/SCB-2415) - Add schema ref
- [SCB-2419](https://issues.apache.org/jira/browse/SCB-2419) - Add govern service

## Improvement

- [SCB-2405](https://issues.apache.org/jira/browse/SCB-2405) - Use dlock instead
- [SCB-2406](https://issues.apache.org/jira/browse/SCB-2406) - Using cari's mongo db client
- [SCB-2407](https://issues.apache.org/jira/browse/SCB-2407) - Using cari db client
- [SCB-2410](https://issues.apache.org/jira/browse/SCB-2410) - Refactoring disco service
- [SCB-2413](https://issues.apache.org/jira/browse/SCB-2413) - Refactoring RBAC datasource interface
- [SCB-2416](https://issues.apache.org/jira/browse/SCB-2416) - Refactoring quota mgr
- [SCB-2417](https://issues.apache.org/jira/browse/SCB-2417) - Refactoring schema service



        Release Notes - Apache ServiceComb - Version service-center-2.0.0


​         
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-2259'>SCB-2259</a>] -         gopool can not reuse worker with certainty
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-2176'>SCB-2176</a>] -         SD Cache is not consistency
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1720'>SCB-1720</a>] -         Service-center consumes huge CPU when it is disconnected from etcd
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1069'>SCB-1069</a>] -         Wrong response of batch delete microservices API
</li>
</ul>

​         
<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-2133'>SCB-2133</a>] -         governance northbound Interface / abstract access layer
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-2094'>SCB-2094</a>] -         New datasource architecture
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-2093'>SCB-2093</a>] -         Supplement the role module of rbac
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-952'>SCB-952</a>] -         Support sync ServiceComb service to Kubernetes
</li>
</ul>
  

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-624'>SCB-624</a>] -         Abstract service layer between api and cache
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-489'>SCB-489</a>] -         Suggest to add Service Center user guide and development guide to the ServiceComb official website
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-438'>SCB-438</a>] -         As SC model is changing, we should keep SC proto spec in isolated project, so that go sdk can import same model as SC does
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-2022'>SCB-2022</a>] -         Migrate service-center documents to sphinx
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1712'>SCB-1712</a>] -         Reset the etcd cache periodically
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1545'>SCB-1545</a>] -         add support env config for logfilepath and logfile level
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1042'>SCB-1042</a>] -         Support upload SC schemas
</li>
</ul>                                                                                                                      

        Release Notes - Apache ServiceComb - Version service-center-1.3.0

<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1296'>SCB-1296</a>] -         [Syncer] Store Syncer data to etcd
</li>
</ul>

<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1295'>SCB-1295</a>] -         Syncer for synchronize data between multiple service centers
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1301'>SCB-1301</a>] -         [Syncer] Syncer reliability improvement, support for etcd cluster management
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1302'>SCB-1302</a>] -         [Syncer]Refactor data strcture of storage module to support springcloud Eureka.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1307'>SCB-1307</a>] -         Store Syncer data to etcd
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1453'>SCB-1453</a>] -         [Syncer] New servicecenter plugin supported eureka
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1427'>SCB-1427</a>] -         Move storage to syncer/servicecenter
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1429'>SCB-1429</a>] -         Use etcd operation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1441'>SCB-1441</a>] -         [Syncer] Support for using tls certificate in Syner
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1464'>SCB-1464</a>] -         [Syncer] The architecture picture needs to be updated, after adding support for eureka
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1465'>SCB-1465</a>] -         [Syncer] Command line parameter error in Quick Start
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1491'>SCB-1491</a>] -         [Syncer] Example of instance access between multiple service-centers
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1498'>SCB-1498</a>] -         Allow schema modification of services in production environment
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1512'>SCB-1512</a>] -         Allow custom handler chain
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1539'>SCB-1539</a>] -         Add command line to support output syncer version
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1540'>SCB-1540</a>] -         Add syncer&#39;s packaging command to the script of release
</li>
</ul>
​                                                                                                                                                        

        Release Notes - Apache ServiceComb - Version service-center-1.2.0

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1050'>SCB-1050</a>] -         Metrics cache does not clean
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1059'>SCB-1059</a>] -         Unexpected events publish if error occurs in previous list-watch loop
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1059'>SCB-1059</a>] -         Re-register instance does not keep alive the lease
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1059'>SCB-1059</a>] -         Use the raw password if decrypt failed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1059'>SCB-1059</a>] -         Should not show the shared microservices by default
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1059'>SCB-1059</a>] -         Add grpc keepalive time
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1069'>SCB-1069</a>] -         Wrong response of batch delete microservices API
</li>
</ul>

<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1049'>SCB-1049</a>] -         Alarm center
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1087'>SCB-1087</a>] -         Add View Schema Option in Schema Details Page
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1052'>SCB-1052</a>] -         import zap logger without binding go version
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1053'>SCB-1053</a>] -         Batch microservices instances discovery API
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1070'>SCB-1070</a>] -         New instance &#39;TESTING&#39; status
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1092'>SCB-1092</a>] -         More abundant metrics information
</li>
</ul>

<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1219'>SCB-1219</a>] -         Prepare 1.2.0 Release
</li>
</ul>


        Release Notes - Apache ServiceComb - Version service-center-1.1.0

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-744'>SCB-744</a>] -         Wrong error code returned in Find API
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-851'>SCB-851</a>] -         Can not get providers if consumer have * dependency rule
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-857'>SCB-857</a>] -         Provider rule of consumer can not be removed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-863'>SCB-863</a>] -         build script for docker image gives an error
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-890'>SCB-890</a>] -         Lost changed event when bootstrap with embedded etcd
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-912'>SCB-912</a>] -         rest client still verify peer host when verifyPeer flag set false
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-924'>SCB-924</a>] -         Etcd cacher should re-list etcd in fixed time interval
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-927'>SCB-927</a>] -         The latest Lager is not compatible
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-929'>SCB-929</a>] -         Concurrent error in update resource APIs
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-930'>SCB-930</a>] -         Service Center Frontend stops responding in Schema test if Schema has &#39;\&quot;&#39; character in the description
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-934'>SCB-934</a>] -         Get all dependency rules will panic
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-938'>SCB-938</a>] -         Should check self presevation max ttl
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-951'>SCB-951</a>] -         Wrong help information in scctl
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-958'>SCB-958</a>] -         The instance delete event delay more than 2s
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-977'>SCB-977</a>] -         Dependencies will not be updated in 5min when micro service is changed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-980'>SCB-980</a>] -         The dependency will be broken when commit etcd failed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-981'>SCB-981</a>] -         Can not remove the microservice and instance properties
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-991'>SCB-991</a>] -         Optimize args parsing
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-993'>SCB-993</a>] -         Bug fixes
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-994'>SCB-994</a>] -         SC can not read the context when client using grpc api
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1027'>SCB-1027</a>] -         Fix the core dump in SC which compiled with go1.10+
</li>
</ul>

<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-815'>SCB-815</a>] -         Support deploy in Kubernetes
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-850'>SCB-850</a>] -         Support discover instances from kubernetes cluster
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-869'>SCB-869</a>] -         SC cli tool
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-902'>SCB-902</a>] -         Support service discovery by Service Mesh
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-914'>SCB-914</a>] -         Support using scctl to download schemas
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-941'>SCB-941</a>] -         Support multiple datacenter deployment
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-949'>SCB-949</a>] -         Support access distinct kubernetes clusters
</li>
</ul>

<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-418'>SCB-418</a>] -         How to deploy a SC cluster in container environment
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-435'>SCB-435</a>] -         Add plugin document in ServiceCenter
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-792'>SCB-792</a>] -         More abundant metrics information
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-796'>SCB-796</a>] -         Update the paas-lager package
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-797'>SCB-797</a>] -         More information in dump API
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-807'>SCB-807</a>] -         Limit the topology view to only 100 microservices.
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-808'>SCB-808</a>] -         Aut-refresh the dashboard and service-list page every 10sec
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-809'>SCB-809</a>] -         Verify the chinese version of the UI as all chinese text was translated using Google Translate
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-816'>SCB-816</a>] -         Update the protobuf version to 1.0.0
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-840'>SCB-840</a>] -         Support configable limit in buildin quota plugin
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-844'>SCB-844</a>] -         Update golang version to 1.9.2
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-848'>SCB-848</a>] -         Uses zap to replace the paas-lager
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-862'>SCB-862</a>] -         Using different environment variables in image
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-892'>SCB-892</a>] -         output plugins configs in version api
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-899'>SCB-899</a>] -         Support go1.11 module maintaining
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-901'>SCB-901</a>] -         Making service registration api idempotent
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-937'>SCB-937</a>] -         Customizable tracing sample rate
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-953'>SCB-953</a>] -         Support sync distinct Kubernetes service types to service-center
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-978'>SCB-978</a>] -         Fix translation issues for Chinese Locale on First Load
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-983'>SCB-983</a>] -         Output the QPS per domain
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-984'>SCB-984</a>] -         Add Health Check command
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1015'>SCB-1015</a>] -         Support the forth microservice version number registration
</li>
</ul>

<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-720'>SCB-720</a>] -         Show the instance statistics in Dashboard and Instance List in Side Menu
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-973'>SCB-973</a>] -         TLP graduation tasks
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1016'>SCB-1016</a>] -         Change git repo name
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1028'>SCB-1028</a>] -         Prepare 1.1.0 Service-Center Release
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1033'>SCB-1033</a>] -         Update license for Service-Center
</li>
</ul>



        Release Notes - Apache ServiceComb - Version Service-Center-1.0.0


#### New Features/Improvements:
 - Make ETCD connection more Resilient
 - Make ETCD request timeout configurable
 - Support TLS Plugin
 - Optimize Governance API for Searching Schema
 - Optimize Find Instance API
 - Use glide for dependency management
 - Add release binaries for MacOS
 - Add Toplogy View and Instance View in UI


#### Bug-Fix:
 - Fix connection leak in etcd
 - Fix Lose of events in some scenarios
 - Fix Cache mismatch.

###### For more details please [click here](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12321626&version=12342427)



        Release Notes - Apache ServiceComb - Version Service-Center-1.0.0-m2


#### API Changes :
* Governance API also returns self microservice information.
* Governance API should not show the shared microservices information.
* Support batch delete in registry.
* Change the type of force query parameter to bool in delete api.

#### New Features/Improvements:
* Support Async Rest Template.
* Support of Testing Schema from frontend.
* Support log rotation.
* Support ipv6.
* Static data return instanceCount by domain.
* Convenient store extension.
* Retry the connection to etcd in-case of failure.
* Show proper error details in frontend.
* Support Default TLS Cipher Suites.
* Proxy Frontend request to Service-Center.
* Use bower to resolve the dependency of frontend.
* Add registry server HC mechanism.

#### Bug-Fix:
* Fix issue of filter instance using service-tags.
* Fix re-creation of tracing file.
* Fix SC cannot check duplicate endpoints when registered with etcd.
* Fix wrong parentId in tracing data.
* Fix wrong log print in update Instance.
* Fix null pointer reference in zipkin plugin.
* Fix delete service should delete dependency key.
* Fix cache does not match with etcd store.
* Fix remove the backup log files which are expired.
* Fix typos in response of schema api's.
* Fix incorrect metric label value.
* Fix register instance withe same id will create redundant endpoints.

###### For more details please [click here](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12321626&version=12342354)


        Release Notes - Apache ServiceComb - Version Service-Center-1.0.0-m1


#### API Changes :
 * Added new API to get All Schema List.
 * Add Service statistics in the Governance API.
 * Add Self-microservice information in the Governance API.

#### New Features/Improvements:
* Support discovery of SC instances by Consumer micro-service.
* Event driven implementation for dependency rules.
* Make compact interval configurable and avoid defragmentation of the database when compacted.
* Update the default quota’s limit of service/instance count.
* Update black-list rule controls in discovery.

#### Metrics :
* Added support for Prometheus metrics exposure.
* Added templates for Grafana Dashboard.

#### Optimization:
* Optimized Restful clients and plugins loader.
* Optimized Service-Count calculation rule.
* Use CDN for resolving all the dependencies of frontend.

#### Bug-Fix:
* Fix panic issue while deleting instance and invalid metrics request.
* Fix modify schema response issue and heart-beat failure when etcd has no leader.
* Fix batch delete api to exempt from unregistering service-center microservice.
* Fix watcher wrong event sequence when SC modify resource concurrently
* Fix discovery of default APP services in Shared service mode

---
title: "Release Notes"
lang: en
ref: release
permalink: /release/service-center-release-notes/
excerpt: "Release Notes"
last_modified_at: 2018-06-21T00:50:43-55:00
---


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

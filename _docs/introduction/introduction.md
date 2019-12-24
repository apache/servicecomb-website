---
title: "Introduction"
lang: en
ref: introduction
permalink: /docs/introduction/
excerpt: "ServiceComb Introduction"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}

## Apache ServiceComb

Apache ServiceCom is the first Apache microservices top-level project in the word. It provides a complete open-source microservices solution that integrates the open-source ecosystem. Committed to helping enterprises, users, and developers to microservice applications to the cloud easily, to achieve efficient operation and maintenance management of microservice applications.

### ServiceComb Architecture

ServiceComb, as a microservices solution, contains multiple products. The combination of different products can easily cope with different scenarios of microservices, which facilitates the use of microservices on the cloud.

![1](/assets/images/docs/servicecomb/servicecomb.jpg)

### Service Registry（Service Center）:

ServiceCenter is a service registry. Like other service registry, its main role is to solve the problem of service registration and discovery, that is the problem of dynamic routing. At the same time, in order to better solve the problem of cross-team collaboration, it adds support for contract (based on OpenAPI specifications) services. If it is used with contract tools (Toolkit) or Java microservice development kit (Java Chassis), communication Interfaces will become transparent, allowing users to focus on business development.

Learn more：[User manual](/docs/products/service-center/install/)

### Configuration Center（Kie）

Kie is a semantic distributed system configuration center. It is designed for cloud-native distributed systems. It aims to provide users with the ability to configure dynamic delivery. At the same time, the key rules are changed from traditional splicing (a.b.timeout = 10s) Redesigned into easy-to-understand semantic type (timeout (service = a, version = b) = 10s), which is convenient for operation and maintenance personnel to understand configurations and manage complex distributed system configurations.

Learn more：[User manual](http://servicecomb.apache.org/docs/kie/0.1.0/index.html)

### Distributed transaction（Pack）

Apache ServiceComb Pack is an eventually data consistency solution for micro-service applications.

Features
- High availability. The coordinator is stateless and thus can have multiple instances.
- High reliability. All transaction events are stored in database permanently.
- High performance. Transaction events are reported to coordinator via gRPC and transaction payloads are serialized/deserialized by Kyro.
- Low invasion. All you need to do is add 2-3 annotations and the corresponding compensate methods.
- Easy to deploy. All components can boot via docker.
- Support both forward(retry) and backward(compensate) recovery.
- Easy to extend other coordination protocol which is based on the Pack, now we have Saga and TCC support out of box.

Learn more：[User manual](https://docs.servicecomb.io/saga/en_US/)

### Java microservice SDK（Java Chassis）

Apache ServiceComb Java Chassis is a Software Development Kit (SDK) for rapid development of microservices in Java, providing service registration, service discovery, dynamic routing, and service management features

- High performance

   The transport capability of Java Chassis is based on Vert.x, which enables Java Chassis to process massive requests with relatively less hardware resources, and support reactive develop style.

- Native support for OpenAPI

   Java Chassis describes the APIs of the microservices via Swagger natively, to help developers to design microservices that comply to OpenAPI standard.

- Flexible develop style

   Currently Java Chassis allow developers to develop their microservice APIs in SpringMVC/JAX-RS/transparent RPC styles, and to send the request in RPC/RestTemplate styles. And there are three kind of build-in transport mode: Rest over Vertx/Rest over Servlet/Highway. All of these features can be combined and replaced easily, because they are decoupled and all based on the Swagger schema, which can provide high flexibility.

- Out-of-box microservice governance features

   Java Chassis provides a lot of features for microservice governance and monitor.

- Multi languages support

   Via ServiceComb Mesher, the microservices built by other languages are also able to work with ServiceComb components. And Java Chassis can communicate with such microservices and make use of the built-in capabilities.

Learn more：[Quick start](/docs/products/java-chassis/quick-start/)  [User manual](https://docs.servicecomb.io/java-chassis/en_US/index.html)

### Application runs as a microservice in any language （Mesher）

Mesher is a service mesh project of Apache ServiceComb. It supports applications of any development language in any running environment to quickly access the ServiceComb microservice system. Mesher is implemented using the go language based on the go-chassis open-source framework. It supports plug-in support for microservice capabilities such as load balancing, flow control, call chain tracking, blowdown and degradation, service governance, and dynamic configuration management. Mesher currently supports two modes of operation: sidecar and edge-service. Supports communication between services using HTTP and GRPC protocols. It has good scalability, and users can expand their own protocols by themselves. Mesher processes requests in the form of call chains, and can freely tailor processing functions according to the configuration. On the control plane, Mesher can naturally access the Apache Aervicecomb microservice system. It is compatible with the current mainstream service-mesh, supports Kubernetes, and can be connected to Istio.

Learn more：[Quick start](/docs/products/mesher/quick-start/)  [User manual](http://servicecomb.apache.org/docs/mesher/1.6.3/index.html)

### Authnz of microservice（Fence）

The overall idea of Apache ServiceComb-fence is to combine the OAuth 2 and OpenID Connect protocols to provide the requirements for user diversity authentication. The focus is on ensuring authentication within the system (including using third-party authentication capabilities). OAuth 2 and OpenID connect protocols were originally designed to "provide authentication capabilities to third parties." Apache ServiceComb-fence meets the protocol standards in terms of solution design and capability opening. The protocol design is born for an ecologically-constructed enterprise, and Apache ServiceComb-fence is to better apply these capabilities to ecologically-participated enterprises, help participate in the ecology, and build an ecology for the future.

Learn more：[User manual](https://github.com/apache/servicecomb-fence/blob/master/README.md)

### A contract-based microservice development toolkit（Toolkit）

Apache ServiceComb Toolkit is a contract-based microservice development toolkit. Provides the ability to convert and verify contracts, code, and documents, helping users quickly build microservice projects based on popular microservices frameworks and popular programming models, reducing the cost of microservices entry, enabling users to focus on business development, enhance refactoring and development efficiency.

Features
- Code extraction service contract

   In applications developed based on the SpringMVC/POJO/JAX-RS model, one-click generation of service contract files conforming to the OpenAPI specification.

- Service contract generation microservice project

   Enter a service contract that conforms to the OpenAPI specification, one-click generation of a microservice project with ServiceComb/SpringCloud/Swagger as the base microservice framework and SpringMVC/POJO/JAX-RS or SpringBoot as programming model.

- Service contract and code consistency check

   Verify that the actual implementation of the application (such as the data and service API) is consistent with the agreed service contract description.

- Service contract style checking and compatibility checking

   The style checking checks whether the contract conforms to [OAS 3.0.2 specification] [openapi-3.0.2] and custom rules; the compatibility checking checks whether new OAS spec compatible with old spec

- Service contract/code generation document

   Enter a service contract that conforms to the OpenAPI specification, one-click generation of a document in html format.

Learn more：[Quick start](/docs/products/toolkit/quick-start/)

### Multiple servicecenters synchronization tools（Syncer）

Syncer is a multiple servicecenters synchronization tool, which is specially designed for large microservice architectures. It is used to synchronize differ-structure servicecenters and cross-region instances in the case of network interconnection. In the future, it will provide support for cross-network, cross-cloud and other scenarios. Syncer exists in the form of a servicecenter's companion system. It is mainly responsible for finding instances from the current service center and broadcasting to other members of the network; receiving broadcasts from other members, and pulling instance information to register with the current service center. Syncer has the following features:

- Zero intrusion in business architecture. Syncer synchronizes instance information for the service center in a transparent form. It does not participate in the original business process, and the service does not need to sense its existence.
- Unbound servicecenter, compatible with ecology, supports access to differ-structure servicecenters.
- Construct a centerless peer-to-peer network based on Serf (the implementation of the gossip protocol). Members can join and leave freely without affecting the Syncer network and servicecenter.
- It is transmitted in the network with a unified data structure, and the conversion of the data structure is distributed to each Syncer. It only needs to handle the conversion between the current service center data structure and SyncData to achieve maximum data compatibility.
- Support the service center in the form of golang plug-in, users can freely expand the servicecenter that needs to be accessed. The new servicecenter is added, and the data can be synchronized in the Syncer network by simply converting to SyncerData in its accompanying Syncer without the cooperation of other members.
- Service configuration, deployment, upgrade, and maintenance are still completed in a single servicecenter, without additional business maintenance costs.

Learn more：[Quick start](/docs/products/syncer/quick-start/)


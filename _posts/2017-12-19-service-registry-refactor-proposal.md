---
title: "Proposal for refactoring service registry module in Java Chassis"
lang: en
ref: service-registry-refactor-proposal
permalink: /docs/service-registry-refactor-proposal/
excerpt: "Analysis of service registry and propose a new architecture for it"
last_modified_at: 2017-12-19T09:18:43+08:00
author: Eric Lee
tags: [refactor]
redirect_from:
  - /theme-setup/
---

## Background

The architecture of the `service registry` module in Java Chassis is as follows.

![](/assets/images/service_registry.png)

However, it has the following problems:

* Low level components access high level components frequently. The cyclic relationships make the implementation complicated and introduce some redundant access points.
* Low level components should be stateless to be reused by high level components. Introducing state into low level components makes it relies heavily on the high level components, causing cyclic relationships.
* Hard to integrate with third-party framework. It does not provide a standalone client with cache capability inside. It also requires the configurations should be loaded from dynamic properties.

## Proposed Architecture

![](/assets/images/proposed_architecture.png)

The above architecture is what the `service registry` module supposed to be in my opinion. The low level components like `ApiManager` and `UriManager` are stateless so they do not rely on high level components any more. Relationships between components are clear and simple. 

Tasks can be divided into the following parts:

![](/assets/images/task.png)

There are two types of tasks: 

* Simple Task. Task that executes only once.
* Period Task. Task that executes at every interval.

The result of task will convert to event and posts to the `EventManager`. Any methods that subscribes that kind of event will be notified and execute the corresponding response, e.g. update the cache.

Both the outside requests and chassis requests share the same interface of Configuration, they can implement their own way to load configurations. The difference between chassis requests and outside requests is that chassis requests need to manage microservice informations of their own. Besides,  chassis requests also need to provide a compatible interface for requests to use. There comes  to the component `RegistryUtils`. It is responsible for the following stuff:

* Initialize service registry client with configurations.
* Initialization of service center service, attach with a PullTask.
* Initialization of service itself, attach with RegisterTask, HeartbeatTask and WatchTask.
* Provide wrapper method for service registry client.

The initialization process of service registry client is as follows:

![](/assets/images/client_initialization.png)

If the auto discovery switch is on, it need to create a period task `PullTask` to make the available service center services' information up to date. 

Any requests to a new microservice will create a new entry in the service registry client. Once we access the same microservice again, the client will response with the cached version which reduces communication cost with service center.

Let's checkout how the `Microservice` component works. Instances and its versions are cached inside the microservice. To get an instance of a specified id, all it needs to do is lookup the cache or create a query task to update the cache. All interactions from `Microservice` to  `ApiManager` are done by the `Task`. 

The `ApiManager` is designed to interact directly with service center as a pure client with api inside only. Its structure is as follows:

![](/assets/images/api_manager.png)

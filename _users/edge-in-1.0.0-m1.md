---
title: "ServiceComb Java Chassis Edge Service"
lang: en
ref: edge
permalink: /users/edge-in-1.0.0-m1/
excerpt: "ServiceComb Java Chassis Edge Service"
last_modified_at: 2018-4-3T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
We had provide an edge core module since 1.0.0-m1, please checkout the user guide and [release note](https://github.com/apache/servicecomb-java-chassis/releases) for more information.Also subscribe ServiceComb mail-list(dev-subscribe@servicecomb.apache.org) and join discussion is welcome.

## Edge Features
### Loose Coupling
Edge Service only redirect requests, no dependencies between services.

### Auto Match Available Version
Edge Service can auto match available versions, for example:
- In version 1.0.0 provided Operation1
- In version 1.1.0 provided both Operation1 and Operation2

If Edge Service redirect the request of Operation1,both instances of version 1.0.0 and instances of version 1.1.0 are allowed, but if Edge Service redirect the request of Operation2, only instances of version 1.1.0 will be selected.

### Support Consumer Handler
Edge Service support all Java Chassis Consumer Handlers, also support user extend custom handlers.

### Use Reactive Mode As Default
Because Edge Service will proxy all requests, so high performance is required, it use reactive mode as default, please do not add any heavy cost(blocking) codes, such as:
- Database query, remote call etc..
- Sleep, wait etc..
- Loop or heavy cost operation etc..

## Develop An Edge Service
### Add Dependency
Only need import edge-core:
```xml
<dependency>
  <groupId>org.apache.servicecomb</groupId>
  <artifactId>edge-core</artifactId>
  <version>1.0.0-m1</version>
</dependency>
```

### Develop Dispatcher
For enable Edge Service redirection, we need develop Dispatcher,implement org.apache.servicecomb.transport.rest.vertx.VertxHttpDispatcher interface or extend org.apache.servicecomb.transport.rest.vertx.AbstractVertxHttpDispatcher class:

#### getOrder Method
This value returned will decide the priority of routing rules, the smaller value the higher priority.

#### init Method
Init routing rules of the Dispatcher, we use [Vertx Routing Rule](https://vertx.io/docs/vertx-web/java/#_routing_by_exact_path), for example we add two routing rules like:
```java
public void init(Router router) {
  String regex = "/([^\\\\/]+)/([^\\\\/]+)/(.*)";
  router.routeWithRegex(regex).handler(CookieHandler.create());
  router.routeWithRegex(regex).handler(createBodyHandler());
  router.routeWithRegex(regex).failureHandler(this::onFailure).handler(this::onRequest);

  regex = "/([^\\\\/]+)/(.*)";
  router.routeWithRegex(regex).handler(CookieHandler.create());
  router.routeWithRegex(regex).handler(createBodyHandler());
  router.routeWithRegex(regex).failureHandler(this::onFailure).handler(this::onRequest);
}
```

1. /([^\\/]+)/([^\\/]+)/(.*) : this rule will match certain versions of instance for request, format like /user-service/v0/validate;
2. /([^\\/]+)/(.*) : this rule will match any versions of instance for request, format like /user-service/validate.

#### onRequest Method
Implement of redirection:
```java
void onRequest(RoutingContext context)
```

You can get micro-service name, path etc from context, then create and init a new EdgeInvocation for invoke:
```java
EdgeInvocation edgeInvocation = new EdgeInvocation();
edgeInvocation.setVersionRule(versionRule);
edgeInvocation.init(serviceName, context, path, httpServerFilters);
edgeInvocation.edgeInvoke();
```

### Load Dispatcher
Edge Service use SPI(Service Provider Interface) to load custom VertxHttpDispatcher, create a folder named META-INF/services under resources folder, then add a file named org.apache.servicecomb.transport.rest.vertx.VertxHttpDispatcher in it, in this file , add full class name of our Dispatcher:
```text
{your-package-path}.XXXDispatcher
```

### Extend Handler(Optional)
Edge Service always use to provide monitoring, resiliency, security, and more, not only dynamic routing. We recommend extend custom handlers, there is an example named AuthHandler in demo-edge.

## Other Reference
In demo/demo-edge we had provided a simple demo to show abilities of Edge Service:
1. edge-service:Edge Service, include AuthHandler;
2. authentication:Simulate authentication, accept requests from AuthHandler;
3. business-x.x.x:Simulate multi-version business instances;
4. consumer:Simulate UI(user) request,include different version requirement.
---
title: "Service Heartbeat"
lang: en
ref: service-heartbeat
permalink: /users/service-heartbeat/
excerpt: "Service Heartbeat"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Scenario

After a microservice instance is registered in the service center, the microservice need to periodically send heartbeats to the service center. If the service center receives no heartbeat within a specific period, the instance will be registered.

## Involved APIs

* `io.servicecomb.serviceregistry.client.ServiceRegistryClient` is the service client.

`ServiceRegistryClient` provides heartbeat to send heartbeats. You can call it as required. The sample code is as follows:

```java
public static void main(String[] args) throws Exception {
  // Register the microservice and the instance first
  // Send the heartbeats. Otherwise, the instances will be lost.
  while (true) {
    System.out.println("heartbeat sended:" + client.heartbeat(service2.getServiceId(), instance.getInstanceId()));
    Thread.sleep(3000);
  }
}
```

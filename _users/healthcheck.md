---
title: "HealthCheck"
lang: en
ref: healthcheck
permalink: /users/healthcheck/
excerpt: "HealthCheck"
last_modified_at: 2017-12-30T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
Java Chassis had support HealthCheck since 1.0.0-m1.

## Introduction
Microservice always depend on many middlewares like database, message queue etc. Also depend on other microservices. When microservice is unavailable, may caused by database, we need record details into log file or show details on dashboard: database disk had full? database accress right had invalid? or database accress user and password had changed? not only a DOWN state, details can help dev ops find where is the problem and solve it faster.

HealthCheck provide an extensible mechanism, user can create custom check point in order to probe whether the core dependencies are available, if any one is unavailable, report the details:

![HealthCheck](/assets/images/HealthCheck.png)

## How to use
### Implement custom HealthCheck
It is easy to implement Java Chassis HealthCheck, implements from `org.apache.servicecomb.foundation.metrics.health.HealthChecker` interface and override these methods:

| Method Name       | Description         |
| :---------- | :---------- |
| getName | Return the name of HealthChecker, please make sure do not duplicated, otherwise the results of same name will merged |
| check | Concrete implementation of Check logic |

Example:
```java
public class MySqlHealthChecker implements HealthChecker {
  @Override
  public String getName() {
    return "mysql";
  }

  @Override
  public HealthCheckResult check() {
    //add your health check code here
    Connection connection = null;
    try {
      connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/test_db?useSSL=false", "root", "pwd");
      return new HealthCheckResult(true, "local mysql health check", "");
    } catch (SQLException e) {
      e.printStackTrace();
      return new HealthCheckResult(false, "local mysql health check", e.toString());
    } finally {
      if (connection != null) {
        try {
          connection.close();
        } catch (SQLException e) {
          e.printStackTrace();
        }
      }
    }
  }
}
```

We use SPI to load it, create an new file named `org.apache.servicecomb.foundation.metrics.health.HealthChecker` under `esource/META-INF/services` folder, write class name of your HealthChecker into it, like:

```text
org.apache.servicecomb.samples.metrics.extendhealthcheck.MySqlHealthChecker
```

### Verify HealthCheck
After microservice startup, HealthCheck will publish use Rest endpoint, the publish address is same as `servicecomb.rest.address`, if had configure in `microservice.yaml` like:

```yaml
servicecomb:
  rest:
    address: 0.0.0.0:8080
```

We can get HealthCheck final result by accress http://localhost:8080/health , also can get detail results by accress http://localhost:8080/health/detail .

>NOTE:
>1. The implementation of Rest publish is in metrics-core, so need import this dependency;
>2. The result of /health is the final result of all HealthCheckers, true or false, if healthy result of any HealthChecker return false, then this value will false.

## Other Reference 
We had provided a sample at samples/metrics-extend-healthcheck.
---
title: "健康检查"
lang: cn
ref: healthcheck
permalink: /cn/users/healthcheck/
excerpt: "健康检查"
last_modified_at: 2017-12-30T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
微服务框架从1.0.0-m1版本开始支持健康检查。

## 介绍
微服务往往依赖诸多中间件例如数据库、消息队列等，也依赖其他微服务。当微服务不可用时，例如是由于数据库不可用引起的，我们需要通过日志系统或监控面板将不可用的详细原因记录下或展示出来：磁盘空间满报错？数据库访问用户名密码变更？数据库访问权限变化？而不仅仅是一个报错不可用的状态，这会对快速定位问题和解决故障大有裨益。

健康检查（HealthCheck）提供了一套扩展机制，用户可以自定义检查点，探测微服务内部核心依赖是否可用，如果不可用，将详细信息暴露出来：

![HealthCheck](/assets/images/HealthCheck.png)

## 如何使用
### 实现自定义HealthCheck
Java Chassis HealthCheck使用起来非常简单，只需要继承`org.apache.servicecomb.foundation.metrics.health.HealthChecker`接口，并实现方法：

| 方法名       | 描述         |
| :---------- | :---------- |
| getName | 返回此健康检查的名称，请确保名称不要重复，否则从发布获取数据的时候合并覆盖 |
| check | 具体的检查逻辑实现 |

例如：
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

然后使用SPI的方式加载它，具体为在`resource/META-INF/services`下创建`org.apache.servicecomb.foundation.metrics.health.HealthChecker`文件，然后写入实现的HealthCheck类名即可，例如：

```text
org.apache.servicecomb.samples.metrics.extendhealthcheck.MySqlHealthChecker
```

### 验证实现的HealthCheck
启动微服务后，HealthCheck默认以Rest方式发布，发布地址与`servicecomb.rest.address`一致，如果在`microservice.yaml`中设置的配置为：

```yaml
servicecomb:
  rest:
    address: 0.0.0.0:8080
```

那么就可以通过访问http://localhost:8080/health 获取检查结果，以及访问http://localhost:8080/health/detail 获取所有的检查项结果明细。

>说明：
>1. HealthCheck的默认Rest发布实现在metrics-core中，因此需要增加此依赖；
>2. /health为所有HealthCheck的最终结果，true或false，只要有任何一个HealthCheck的healthy结果为false，那么就会是false。

## 参考示例
我们已经提供了一个例子作为参考，代码在samples/metrics-extend-healthcheck中。
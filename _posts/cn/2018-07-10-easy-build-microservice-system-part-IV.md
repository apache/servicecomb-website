---
title: "轻松微服务系列：边缘服务支持统一认证"
lang: cn
ref: easy-build-microservice-system-part-IV
permalink: /cn/docs/easy-build-microservice-system-part-IV/
excerpt: "轻松微服务系列：边缘服务支持统一认证"
last_modified_at: 2018-07-10T19:00:00+08:00
author: Yangyong Zheng
tags: [Edge Service,API Gateway,Authentication]
redirect_from:
  - /theme-setup/
---

## 轻松微服务系列：边缘服务支持统一认证
在前一篇博文[《轻松微服务系列：开发高性能边缘服务》](http://servicecomb.incubator.apache.org/cn/docs/easy-build-microservice-system-part-III/)，我们开发了具备基本路由能力的高性能边缘服务。这篇博文我们将在Edge服务上实施如何扩展支持统一认证。

### 设计思路
正如前面的博文提到过，统一认证的目的是在Edge入口处进行访问认证，避免需要在所有的微服务中都承载重复的认证机制，因此：
1. 我们先要将认证功能作为一个独立的Procuder发布出来，使Edge服务能够随时认证Token，我们将其命名为`AuthenticationService`，放在用户服务中；
2. 将无需认证的访问请求识别出来，包括：

| 功能      | 描述                     |
| :------- | :--------------------- |
| login    | 登录验证，通过后为用户生成Token |
| logon    | 新用户注册                  |

除此之外其他业务请求都需要做Token认证；

3. Edge服务转发访问请求之前，对需要认证的请求先做统一认证，认证通过之后才转发，我们使用`HttpServerFilter`扩展这个能力：

![FilterChain](/assets/images/scaffold/FilterChain.png)

统一认证流程时序图为：

![EdgeAuth](/assets/images/scaffold/EdgeAuth.png)

### 实现统一认证
#### 第一步：发布认证服务
##### 定义AuthenticationService
```java
public interface AuthenticationService {
  String validate(String token);
}
```
##### 实现并发布AuthenticationService
```java
@RestSchema(schemaId = "authentication")
@RequestMapping(path = "/")
public class AuthenticationServiceImpl implements AuthenticationService {

  private final TokenStore tokenStore;

  @Autowired
  public AuthenticationServiceImpl(TokenStore tokenStore) {
    this.tokenStore = tokenStore;
  }

  @Override
  @GetMapping(path = "validate")
  public String validate(String token) {
    String userName = tokenStore.validate(token);
    if (userName == null) {
      throw new InvocationException(BAD_REQUEST, "incorrect token");
    }
    return userName;
  }
}
```

#### 第二步：实现统一认证AuthenticationFilter
```java
public class AuthenticationFilter implements HttpServerFilter {

  private final RestTemplate template = RestTemplateBuilder.create();

  private static final String USER_SERVICE_NAME = "user-service";

  public static final String EDGE_AUTHENTICATION_NAME = "edge-authentication-name";

  private static final Set<String> NOT_REQUIRED_VERIFICATION_USER_SERVICE_METHODS = new HashSet<>(
      Arrays.asList("login", "logon", "validate"));

  @Override
  public int getOrder() {
    return 0;
  }

  @Override
  public Response afterReceiveRequest(Invocation invocation, HttpServletRequestEx httpServletRequestEx) {
    if (isInvocationNeedValidate(invocation.getMicroserviceName(), invocation.getOperationName())) {
      String token = httpServletRequestEx.getHeader(AUTHORIZATION);
      if (StringUtils.isNotEmpty(token)) {
        String userName = template
            .getForObject("cse://" + USER_SERVICE_NAME + "/validate?token={token}", String.class, token);
        if (StringUtils.isNotEmpty(userName)) {
          //Add header
          invocation.getContext().put(EDGE_AUTHENTICATION_NAME, userName);
        } else {
          return Response
              .failResp(new InvocationException(Status.UNAUTHORIZED, "authentication failed, invalid token"));
        }
      } else {
        return Response.failResp(
            new InvocationException(Status.UNAUTHORIZED, "authentication failed, missing AUTHORIZATION header"));
      }
    }
    return null;
  }

  private boolean isInvocationNeedValidate(String serviceName, String operationPath) {
    if (USER_SERVICE_NAME.equals(serviceName)) {
      for (String method : NOT_REQUIRED_VERIFICATION_USER_SERVICE_METHODS) {
        if (operationPath.startsWith(method)) {
          return false;
        }
      }
    }
    return true;
  }
}
```

别忘了通过SPI机制加载它，在`resources\META-INF\services`目录中创建`org.apache.servicecomb.common.rest.filter.HttpServerFilter`文件：
```text
org.apache.servicecomb.scaffold.edge.filter.AuthenticationFilter
```

#### 第三步：在用户微服务中增加修改密码的功能用于验证
现有的`login`和`logon`都无需认证，因此我们在用户微服务中增加需要认证的修改密码的功能用于验证统一认证。
##### 在UserService中添加修改密码
```java
public interface UserService {
  ResponseEntity<Boolean> logon(UserDTO user);

  ResponseEntity<Boolean> login(UserDTO user);
  //需要认证的修改密码功能
  ResponseEntity<Boolean> changePassword(UserUpdateDTO userUpdate);
}
```

##### 在UserServiceImpl中实现修改密码
```java
@Override
@PostMapping(path = "changePassword")
public ResponseEntity<Boolean> changePassword(@RequestBody UserUpdateDTO userUpdate) {
  if (validateUserUpdate(userUpdate)) {
    UserEntity dbUser = repository.findByName(userUpdate.getName());
    if (dbUser != null) {
      if (dbUser.getPassword().equals(userUpdate.getOldPassword())) {
        dbUser.setPassword(userUpdate.getNewPassword());
        repository.save(dbUser);
        return new ResponseEntity<>(true, HttpStatus.OK);
      }
      throw new InvocationException(BAD_REQUEST, "wrong password");
    }
    throw new InvocationException(BAD_REQUEST, "user name not exist");
  }
  throw new InvocationException(BAD_REQUEST, "incorrect user");
}
```

### 验证实现的统一认证
#### 确认AuthenticationFilter在Edge服务中成功加载
在Edge服务的启动日志中能够找到：
```text
2018-07-13 14:38:48,756 [INFO]   1. org.apache.servicecomb.scaffold.edge.filter.AuthenticationFilter. org.apache.servicecomb.foundation.common.utils.SPIServiceUtils.loadSortedService(SPIServiceUtils.java:79)
```

#### 用户登录
使用zhengyangyong登录：

![LoginFirst](/assets/images/scaffold/LoginFirst.png)

拿到的Token值为：eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6aGVuZ3lhbmd5b25nIiwiZXhwIjoxNTMwNjA4OTczfQ.90teWUNbypPZvds_SD7Kus_y7wLc4b6VzC_aIVg8sLItKxwQ0g4V9BDU665PlqQY5KM-mnk8y0R6ENL1T8YVFg

#### 不带Authorization Header请求changePassword

![NoAuthHeader](/assets/images/scaffold/NoAuthHeader.png)

返回的失败信息是：authentication failed, missing AUTHORIZATION header

#### 使用错误的Token请求changePassword

![ErrorAuthHeader](/assets/images/scaffold/ErrorAuthHeader.png)

返回的失败信息是：authentication failed : InvocationException: code=400;msg=CommonExceptionData [message=incorrect token]

#### 使用正确的Token请求changePassword

![AuthSuccess](/assets/images/scaffold/AuthSuccess.png)

修改密码成功。

**这里可能有疑问，使用zhengyangyong登录后，是可以通过这个Token修改其他用户例如lidagang的密码的，这是因为我们目前构建的validate仅检查Token的有效性，而不做权限检查，基于RBAC的角色权限管理系统将会在未来构建。**

### 参考资料
1. AuthenticationFilter的完整[代码](https://github.com/zhengyangyong/scaffold/blob/master/edge-service/src/main/java/org/apache/servicecomb/scaffold/edge/filter/AuthenticationFilter.java)；
2. HttpServerFilter的[介绍](https://github.com/apache/incubator-servicecomb-docs/blob/master/java-chassis-reference/zh_CN/general-development/http-filter.md)。
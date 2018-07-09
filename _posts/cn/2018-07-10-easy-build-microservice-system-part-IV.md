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
3. Edge服务转发访问请求之前，对需要认证的请求先做统一认证，认证通过之后才转发，为了能够未来更好的扩展这种“转发前处理”的能力，我们设计一个处理链机制——`FilterChain`：

![FilterChain](/assets/images/scaffold/FilterChain.png)

>提示：另外一种方案就是扩展Handler，如果检查失败则使Handler链调用直接返回；但是由于认证过程同样是一个Consumer调用，也会触发Handler 处理，这会使Handler的逻辑和配置复杂化，因此此场景下不推荐。

完整统一认证时序图为：

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

#### 第二步：实现转发前处理链FilterChain
##### 定义处理链接口EdgeFilter
```java
public interface EdgeFilter {
  //Filter的处理顺序，越小越先被处理
  int getOrder();

  //如果需要中止Filter链执行，抛InvocationException即可
  void processing(String serviceName, String operationPath, RoutingContext context) throws InvocationException;
}
```
##### 实现统一认证AuthenticationFilter
```java
public class AuthenticationFilter implements EdgeFilter {

  private final RestTemplate template = RestTemplateBuilder.create();

  private static final String USER_SERVICE_NAME = "user-service";

  public static final String EDGE_AUTHENTICATION_NAME = "edge-authentication-name";

  private static final Set<String> NOT_REQUIRED_VERIFICATION_USER_SERVICE_METHODS = new HashSet<>(
      Arrays.asList("/login", "/logon", "/validate"));

  @Override
  public int getOrder() {
    return 0;
  }

  @Override
  public void processing(String serviceName, String operationPath, RoutingContext context) throws InvocationException {
    if (isInvocationNeedValidate(serviceName, operationPath)) {
      String token = context.request().headers().get(AUTHORIZATION);
      if (StringUtils.isNotEmpty(token)) {
        String userName = template
            .getForObject("cse://" + USER_SERVICE_NAME + "/validate?token={token}", String.class, token);
        if (StringUtils.isNotEmpty(userName)) {
          //Add header
          context.request().headers().add(EDGE_AUTHENTICATION_NAME, userName);
        } else {
          throw new InvocationException(Status.UNAUTHORIZED, "authentication failed, invalid token");
        }
      } else {
        throw new InvocationException(Status.UNAUTHORIZED, "authentication failed, missing AUTHORIZATION header");
      }
    }
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

#### 第三步：在Edge中添加FilterChain调用机制
##### 在EdgeDispatcher中链式递归的方式顺序调用所有的EdgeFilter
```java
  private void onRequest(RoutingContext context) {
    Map<String, String> pathParams = context.pathParams();
    //从匹配的param0拿到{ServiceComb微服务Name}
    final String service = pathParams.get("param0");
    //从匹配的param1拿到{服务路径&参数}
    String operationPath = "/" + pathParams.get("param1");

    //还记得我们之前说的做出一点点改进吗？引入一个自定义配置edge.routing-short-path.{简称}，映射微服务名；如果简称没有配置，那么就认为直接是微服务的名
    final String serviceName = DynamicPropertyFactory.getInstance()
        .getStringProperty("edge.routing-short-path." + service, service).get();

      //创建一个Edge转发
    EdgeInvocation edgeInvocation = new EdgeInvocation();
    //允许接受任意版本的微服务实例作为Provider，未来我们会使用此（设置版本）能力实现灰度发布
    edgeInvocation.setVersionRule(DefinitionConst.VERSION_RULE_ALL);
    edgeInvocation.init(serviceName, context, path, httpServerFilters);

    //处理Filter链，如果全部通过则转发请求
    loopExecuteEdgeFilterInChain(0, serviceName, operationPath, context, edgeInvocation);
  }

  private void loopExecuteEdgeFilterInChain(int index, String serviceName, String operationPath, RoutingContext context,
      EdgeInvocation edgeInvocation) {
    if (index < filterChain.size()) {
      EdgeFilter filter = filterChain.get(index);
      AtomicReference<InvocationException> exception = new AtomicReference<>();
      CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
        try {
          filter.processing(serviceName, operationPath, context);
        } catch (InvocationException e) {
          exception.set(e);
        }
      });

      future.whenComplete((result, throwable) -> {
        if (exception.get() != null) {
          sendFailed(context, exception.get());
        } else if (throwable != null) {
          sendFailed(context, new InvocationException(Status.INTERNAL_SERVER_ERROR, throwable.getMessage()));
        } else {
          loopExecuteEdgeFilterInChain(index + 1, serviceName, operationPath, context, edgeInvocation);
        }
      });
    } else {
      try {
        edgeInvocation.edgeInvoke();
      } catch (InvocationException e) {
        sendFailed(context, e);
      }
    }
  }

  private void sendFailed(RoutingContext context, InvocationException exception) {
    context.response().setStatusCode(exception.getStatusCode());
    context.response().headers().add(CONTENT_LENGTH, String.valueOf(exception.getMessage().length()));
    context.response().write(exception.getMessage());
    context.response().end();
  }
```

>提示：Edge默认工作于全异步模式下，不允许有任何阻塞操作，`AuthenticationFilter`是一个RPC调用，所以`loopExecuteEdgeFilterInChain`中调用EdgeFilter使用的是异步回调模式。

##### 使用SPI方式加载所有的EdgeFilter
在`resources\META-INF\services`目录中创建`org.apache.servicecomb.scaffold.edge.EdgeFilter`文件：
```text
org.apache.servicecomb.scaffold.edge.filter.AuthenticationFilter
```

之后在EdgeDispatcher增加SPI加载所有的EdgeFilter的逻辑：
```java
private final List<EdgeFilter> filterChain;

public EdgeDispatcher() {
    filterChain = SPIServiceUtils.getSortedService(EdgeFilter.class);
  }
```

#### 第四步：在用户微服务中增加修改密码的功能用于验证
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
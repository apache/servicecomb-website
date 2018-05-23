---
title: "轻松微服务系列：快速实现客户关系管理系统的用户服务"
lang: cn
ref: easy-build-microservice-system-part-II
permalink: /cn/docs/easy-build-microservice-system-part-II/
excerpt: "轻松微服务系列：快速实现客户关系管理系统的用户服务"
last_modified_at: 2018-05-23T19:05:00+08:00
author: Yangyong Zheng
tags: [Archetypes, Scaffold, Authentication, JWT]
redirect_from:
  - /theme-setup/
---

## 轻松微服务系列：快速实现客户关系管理系统的用户服务
在前一篇博文[《轻松微服务系列：从一键构建微服务和DDD设计开始》](http://servicecomb.incubator.apache.org/cn/docs/easy-build-microservice-system-part-I/)，我们已经详细介绍了如何快速构建微服务和DDD相关概念，并引入了一个经典场景——地产CRM。通过[Event Storming](https://en.wikipedia.org/wiki/Event_storming)实践获得了系统设计：

![MicroserviceDesign4](/assets/images/scaffold/MicroserviceDesign4.png)

现在，我们将从“用户微服务”入手，探索微服务实现过程中即将面对的细节，并轻松处理这些难点。

### 用户微服务并不简单
用户微服务是所有系统中不可或缺的部分，它承载了认证和授权等核心功能——无论是登录一个网站、还是打开一个APP，当涉及到需要身份识别后才能够执行的操作，都需要用户微服务把关。例如观看视频网站上的视频，匿名用户会插播广告，如果希望屏蔽广告，则需要登录并购买VIP会员，登录即是身份认证的过程，而VIP屏蔽广告即是授权的过程。

#### 认证
认证不仅仅是一次性验证用户名和密码的过程，还需要能反复使用认证的结果，确保后继所有操作都是合法的，这就涉及到“有状态”，但HTTP是一个无状态协议，如何能够将登录成功后的认证信息与后继的请求关联起来呢？

我们非常熟悉的做法是使用Session或Cookie：
- Session存储在服务端，因此具备良好的防篡改能力，但弊端是使服务有状态，微服务系统中，同一个微服务会依据系统压力的大小弹性伸缩出多个运行实例负载均衡，跨实例访问会状态丢失。
- Cookie存储在客户端，它正好与Session相反，优势是服务不必保持状态，但弊端是客户比较容易的篡改Cookie信息，例如修改过期时间以逃避验证，而且浏览器对Cookie也有较多限制。

那么，如何兼顾这两方面的需求呢？Token就是一个比较好的解决方案。

Token中文翻译为令牌，它将登录认证后的信息签名后返回，服务端不保存，客户端请求的时候将认证的完整信息附带上提供给服务端验签，签名可以保证信息不被篡改。了解了了解Token的原理，自然要关注Token的格式，JWT就是这样一个基于JSON的开放标准[RFC-7519](https://tools.ietf.org/html/rfc7519)。

##### JWT （Java Web Token）规范
简而言之JWT规范由三部分构成：
1. Header： 声明Token的类型也就是JWT，以及加密算法，例如：

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

2. Playload：存放有效信息，既包含标准签发者、用户、签发时间、过期时间，唯一标识等信息；也可以存放用户自定义的声明信息，例如权限控制相关的内容，例如：

```json
{
  "sub": "1234567890",
  "name": "YangYong Zheng",
  "iat": 1516239022
}
```

3. Signature：签名信息，包含Header和Playload的原始信息（Base64编码过）以及签名过后的信息。

>提示：JWT IO提供了[在线编码和解码工具](https://jwt.io/)。

#### 授权
授权的本意是指将完成某项工作所必须的权力授给下属人员，在软件系统中往往引申为使人或角色具备访问特定资源或更改行为的许可。例如之前提到的VIP屏蔽广告，即是视频网站允许播放终端在特定的帐号登录后跳过广告播放环节（行为）的许可。

授权系统比较常见的做法有ACL和RBAC：
- ACL：ACL全称Access Control List，它是以受控资源为核心，每一个受控资源，都有一个权限控制列表记录哪些用户或角色对这项资源执行具体操作（也被称为授权点）的权限设置，例如查询（可见）、修改、删除等等。Windows中的文件系统安全即是一个经典的ACL实现案例：

![ACL](/assets/images/scaffold/ACL.png)

- RBAC：RBAC全称Role Based Access Control，与ACL相比，它以角色为核心，权限落地在角色上，不为特定用户授权。它的优势是大幅简化了用户与权限的管理，在受控对象不多或控制粒度要求不高（例如接口访问控制）的场景下非常适用。

![RBAC](/assets/images/scaffold/RBAC.png)

由于微服务系统的权限控制主要是接口访问控制上，并且多采用用户组方式组织用户，因此RBAC是比较流行的做法。

### 实现用户微服务
#### 第一步：创建微服务项目
还记得前一篇博文[《轻松微服务系列：从一键构建微服务和DDD设计开始》](/cn/docs/easy-build-microservice-system-part-I/)中一键构建微服务的命令行么？使用ServiceComb SpringMVC Archetypes创建用户微服务，在交互模式下，`groupId`输入org.apache.servicecomb.scaffold，`artifactId`输入user-service，`version`使用默认的1.0-SNAPSHOT，创建完毕后使用IDEA或Eclipse打开项目：

![UserServiceInit](/assets/images/scaffold/UserServiceInit.png)

我们删掉HelloImpl和HelloConsumer，并添加自己的实现。

#### 第二步：使用MySQL持久化用户信息
用户微服务需要持久化用户信息，我们使用MySQL数据库，ORM使用Spring Data JPA：
##### 引入依赖
```xml
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
##### 定义存储User信息的UserEntity实体
```java
@Entity
@Table(name = "T_User")
public class UserEntity {
  @Id
  private String name;

  private String password;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public UserEntity() {
  }

  public UserEntity(String name, String password) {
    this.name = name;
    this.password = password;
  }
}
```

在CodeFist模式下，Spring Data JPA会在数据库中自动创建T_User表与此实体映射。

##### 实现UserEntity实体的Repository
我们继承JPA的PagingAndSortingRepository来实现ORM操作

```java
@Repository
public interface UserRepository extends PagingAndSortingRepository<UserEntity, Long> {
  UserEntity findByName(String name);
}
```

##### 配置数据库连接
在项目的`resources`目录下新增`application.properties`文件，写入数据库连接信息：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_db?useSSL=false
spring.datasource.username=root
spring.datasource.password=pwd
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5Dialect
```

>提示：关于Spring Data JPA的更多资料请参见[这篇文档](https://projects.spring.io/spring-data-jpa/)，为了能够简化依赖的引入我们实际上使用的是Spring Boot JPA Starter，详细的例子请参见[这篇文档](https://spring.io/guides/gs/accessing-data-jpa/)。

#### 第三步：实现JWT认证
##### 定义JWT接口

```java
public interface TokenStore {
  String generate(String userName);

  boolean validate(String token);
}
```

generate用于生成Token，validate用于验证Token是否正确。

##### 实现TokenStore
我们使用[jjwt](https://github.com/jwtk/jjwt)提供的JWT实现，创建JwtTokenStore类，继承TokenStore接口，并重写方法：

```java
@Component
@Component
public class JwtTokenStore implements TokenStore {
  private static final Logger LOGGER = LoggerFactory.getLogger(JwtTokenStore.class);

  private final String secretKey;

  private final int secondsToExpire;

  public JwtTokenStore() {
    this.secretKey = "someSecretKeyForAuthentication";
    this.secondsToExpire = 60 * 60 * 24;
  }

  public JwtTokenStore(String secretKey, int secondsToExpire) {
    this.secretKey = secretKey;
    this.secondsToExpire = secondsToExpire;
  }

  @Override
  public String generate(String userName) {
    return Jwts.builder().setSubject(userName)
        .setExpiration(Date.from(ZonedDateTime.now().plusSeconds(secondsToExpire).toInstant()))
        .signWith(HS512, secretKey).compact();
  }

  @Override
  public boolean validate(String token) {
    try {
      return StringUtils.isNotEmpty(Jwts.parser()
       .setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject());
    } catch (JwtException | IllegalArgumentException e) {
      LOGGER.info("validateToken token : " + token + " failed", e);
    }
    return false;
  }
}
```

#### 第四步：实现用户服务
##### 定义UserService接口

```java
public interface UserService {
  ResponseEntity<Boolean> logon(UserDTO user);
  ResponseEntity<Boolean> login(UserDTO user);
}

```

logon用于新用户注册，login用于用户登录验证，UserDTO用于参数传递：

```java
public class UserDTO {
  private String name;
  private String password;
  public String getName() {
    return name;
  }
  public String getPassword() {
    return password;
  }
  public UserDTO() {
  }
  public UserDTO(String name, String password) {
    this.name = name;
    this.password = password;
  }
}
```

##### 实现并发布UserService
创建UserServiceImpl，继承`UserService`接口：

```java
@RestSchema(schemaId = "user")
@RequestMapping(path = "/")
public class UserServiceImpl implements UserService {
  private final UserRepository repository;

  private final TokenStore tokenStore;

  @Autowired
  public UserServiceImpl(UserRepository repository, TokenStore tokenStore) {
    this.repository = repository;
    this.tokenStore = tokenStore;
  }

  @Override
  @PostMapping(path = "logon")
  public ResponseEntity<Boolean> logon(@RequestBody UserDTO user) {
    if (validateUser(user)) {
      UserEntity dbUser = repository.findByName(user.getName());
      if (dbUser == null) {
        UserEntity entity = new UserEntity(user.getName(), user.getPassword());
        repository.save(entity);
        return new ResponseEntity<>(true, HttpStatus.OK);
      }
      throw new InvocationException(BAD_REQUEST, "user name had exist");
    }
    throw new InvocationException(BAD_REQUEST, "incorrect user");
  }

  @Override
  @PostMapping(path = "login")
  public ResponseEntity<Boolean> login(@RequestBody UserDTO user) {
    if (validateUser(user)) {
      UserEntity dbUser = repository.findByName(user.getName());
      if (dbUser != null) {
        if (dbUser.getPassword().equals(user.getPassword())) {
          String token = tokenStore.generate(user.getName());
          HttpHeaders headers = generateAuthenticationHeaders(token);
          //add authentication header
          return new ResponseEntity<>(true, headers, HttpStatus.OK);
        }
        throw new InvocationException(BAD_REQUEST, "wrong password");
      }
      throw new InvocationException(BAD_REQUEST, "user name not exist");
    }
    throw new InvocationException(BAD_REQUEST, "incorrect user");
  }

  private boolean validateUser(UserDTO user) {
    return user != null && StringUtils.isNotEmpty(user.getName()) && StringUtils.isNotEmpty(user.getPassword());
  }

  private HttpHeaders generateAuthenticationHeaders(String token) {
    HttpHeaders headers = new HttpHeaders();
    headers.add(AUTHORIZATION, token);
    return headers;
  }
}
```

登录成功后，会从TokenStore生成Token，并将其写入Key为`AUTHORIZATION`的Header。

#### 第五步：实现授权（可选）
由于我们允许任何用户注册和登录，所以目前还没有授权的需求，基于RBAC构建授权体系将会在以后的博文中介绍。

经过上面五步，具有基本注册和登录功能的用户微服务就构建好了。

### 验证实现的用户服务
启动用户微服务，我们先注册一个账号：

![TestLogon](/assets/images/scaffold/TestLogon.png)

显示注册成功，现在我们使用这个账号登录：

![TestLogin](/assets/images/scaffold/TestLogin.png)

返回登录成功，Response中已经包含了`AUTHORIZATION`Header，后继的所有请求都需要使用这个Token值进行合法认证。

至此，实现客户关系管理系统的用户服务工作就结束了，下一篇文章我们会将目光转移到Edge服务，通过Edge服务作为微服务调用的统一入口，在它之上构建统一认证，并讲解如何应对海量级调用的挑战，敬请期待！
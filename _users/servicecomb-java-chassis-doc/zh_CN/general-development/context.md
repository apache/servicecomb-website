# 使用Context传递控制消息

ServiceComb提供了Context在微服务之间传递数据。Context是key/value对，只能够使用String类型的数据。由于Context会序列化为json格式并通过HTTP Header传递，因此也不支持ASCII之外的字符，其他字符需要开发者先自行编码再传递。Context在一次请求中，会在请求链上传递，不需要重新设置。[access log](../build-provider/access-log-configuration.md)的trace id等功能都基于这个特性实现的。

## 场景描述
* 在认证场景，Edge Service认证通过以后，需要将会话ID、用户名称等信息传递给微服务，实现鉴权等逻辑
* 灰度发布场景，需要结合自定义的tag实现引流，tag信息需要传递给微服务

## 使用参考

* 在Hanlder中获取和设置Context

Handler包含了Invocation对象，可以直接调用invocation.addContext和invocation.getContext设置。

* 在服务接口中获取Context

通过接口注入
```
public Response cseResponse(InvocationContext c1)
```
或者
```
ContextUtils.getInvocationContext()
```

* 在Edge Service中设置Context

通过重载EdgeInvocation
```
EdgeInvocation edgeInvocation = new EdgeInvocation() {
  protected void createInvocation() {
    super.createInvocation();
    this.invocation.addContext("hello", "world");
  }
};
```
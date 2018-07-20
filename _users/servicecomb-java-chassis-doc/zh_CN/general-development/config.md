# 使用动态配置

ServiceComb提供了分层次的配置机制。按照优先级，分为：
* 配置中心（动态配置）
* Java System Property（-D参数）
* 环境变量
* 配置文件，microservice.yaml。microservice.yaml文件从classpath扫描，可以允许存在很多份。通过servicecomb-config-order指定优先级。

配置文件默认是classpath下的microservice.yaml, 但是可以通过环境变量传入其他文件，可以设置的环境变量为：

|变量|描述|
|---|---|
|servicecomb.configurationSource.additionalUrls|配置文件的列表，以,分隔的多个包含具体位置的完整文件名|
|servicecomb.configurationSource.defaultFileName|默认配置文件名|

动态配置的默认实现是config-cc客户端，对接配置中心，配置项如下：

|变量|描述|
|---|---|
|servicecomb.config.client.refreshMode|应用配置的刷新方式，0为config-center主动push，1为client周期pull，默认为0|
|servicecomb.config.client.refreshPort|config-center推送配置的端口|
|servicecomb.config.client.tenantName|应用的租户名称|
|servicecomb.config.client.serverUri|config-center访问地址，http(s)://{ip}:{port}，以,分隔多个地址(可选，当cse.config.client.regUri配置为空时该配置项才会生效)|

## 在程序中获取配置信息

开发者使用一致的API获取配置，不区分配置的存储路径：
```
DynamicDoubleProperty myprop = DynamicPropertyFactory.getInstance().getDoubleProperty("trace.handler.sampler.percent", 0.1);
```

具体方法可参考[API DOC](https://netflix.github.io/archaius/archaius-core-javadoc/com/netflix/config/DynamicPropertyFactory.html)

## 处理配置变更
可以注册callback处理配置变更：
```
 myprop.addCallback(new Runnable() {
      public void run() {
          // Handle configuration changes
      }
  });
```

## 进行配置项映射
有些情况下，我们要屏蔽我们使用的一些开源组件的配置并给用户提供我们自己的配置项。在这种情况下，可以通过classpath下的config.yaml进行映射定义：
```
registry:
  client:
    serviceUrl:
      defaultZone: eureka.client.serviceUrl.defaultZone
```

定义映射后，在配置装载的时候框架会默认进行映射，把以我们定义的配置项映射为开源组件可以认的配置项。

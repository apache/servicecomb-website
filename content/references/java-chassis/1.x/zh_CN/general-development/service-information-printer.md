# 服务信息打印

## 概念阐述

为了使用户可以更快捷，方便的获得服务信息，将服务信息进行整理，并在日志中打印出来

## 效果
不论服务创建成功与否，服务信息都会在日志信息的末尾被自动打出，用户可以通过搜索"Service Information is shown below"进行定位
```
2019-08-21 16:37:14,859 [INFO] Service information is shown below:
service center: [http://127.0.0.1:30100]
config center: [http://127.0.0.1:30113]
AppID: Restful-Service-HelloWorld
ServiceName: restful_provider
Version: 0.0.1
Environment: production
ServiceID: a3344e9ad4557f883b36d7f53e33306fbc0a54ad
InstanceID; e0765a8ec3ee11e9910d0255ac105780
 org.apache.servicecomb.core.SCBEngine$1.afterRegistryInstance(SCBEngine.java:243)
```

## 扩展

### 相关的接口
接口BootUpInformationCollector
> collect(): 返回一个string，也就是服务中需要打印的信息  
> getOrder(): 返回BootUpInformationCollector实现类的优先级，数字越小优先级越高

### 用户扩展

用户如果需要对打印信息进行进一步扩展，需要
1. 根据BootUpInformationCollector创建新的类，并赋予合适的order。
2. 创建SPI文件

### 样例
1. 创建一个新的实现类HelloCollector
```java
public class HelloCollector implements BootUpInformationCollector {
  @Override
  public String collect() {
    return "Hello!";
  }

  @Override
  public int getOrder() {
    return 5;
  }
}
```
由于order是5，所以这个类会在地址信息（order 0）和服务信息（order 200）之间被打出
2. 创建SPI文件  
在resources/META-INF/services中创建新的SPI文件  
名字：org.apache.servicecomb.core.bootup.BootUpInformationCollector  
内容：(HelloCollector的类名)  
3. 运行效果
```
   2019-08-21 16:37:14,859 [INFO] Service information is shown below:
   service center: [http://127.0.0.1:30100]
   config center: [http://127.0.0.1:30113]
   Hello!
   AppID: Restful-Service-HelloWorld
   ServiceName: restful_provider
   Version: 0.0.1
   Environment: production
   ServiceID: a3344e9ad4557f883b36d7f53e33306fbc0a54ad
   InstanceID; e0765a8ec3ee11e9910d0255ac105780
    org.apache.servicecomb.core.SCBEngine$1.afterRegistryInstance(SCBEngine.java:243)
   ```
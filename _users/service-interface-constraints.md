---
title: "服务接口约束"
lang: en
ref: service-interface-constraints
permalink: /users/service-interface-constraints/
excerpt: "服务接口约束"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 接口约束说明
Java Chassis对于接口的使用约束建立在一个简单的原则上：接口定义即接口使用说明，不用通过查看代码实现，就能识别如何调用这个接口。举个例子：

```java
public Person query(String id);
public Object query(String id);
public class Person {String name;}
```

显然如果调用接口一，我们知道要传递一个String类型的id参数，返回值是一个Person类型，Person里面存在String类型的name等参数。如果调用接口二，我们不知道怎么处理返回值，必须参考服务提供者的文档说明。可以看出，我们是站在使用者视角这边的，以更容易被使用作为参考。 

当我们要将接口发布为REST接口的时候，可以通过使用swagger文件，指定id使用RequestParam或者PathVariable或者RequestBody进行传递，也可以使用SpringMVC或者JAX RS提供的标签来描述。

```java
public Person query(@RequestParam String id); 
public Person query(@PathVariable String id); 
public Person query(@RequestBody String id); 
```

通常，我们会将简单的数据类型，比如String, int等在RequestParam或者PathVariable传递，而把复杂的数据类型使用JSON编码以后在RequestBody传递，以减少HTTP协议限制可能给开发者带来的各种问题。

## 详细的约束列表 
开发者不能在接口定义的时候使用如下类型：

* 比较抽象的数据结构: java.lang.Object, net.sf.json.JsonObject等
* 接口或者抽象类
   ```java
   public interface IPerson {...}
   public abstract class AbstractPerson  {...}
   ```
* 泛型
   ```java
   public class PersonHolder<T> {...}
   ```
* 上述类型的集合类型或者没指定类型的集合，比如：`List<IPerson>, Map<String, PersonHolder<?>>, List, Map`等。 `List<String>, List<Person>`这些具体类型是支持的。

* 包含上述类型作为属性的类型
   ```java
   public class GroupOfPerson {IPerson master ...}
   ```

开发者不用担心记不住这些约束，程序会在启动的时候检查不支持的类型，并给与错误提示。

## 协议上的差异 
尽管ServiceComb-Java-Chassis实现了不同协议之间开发方式的透明，受限于底层协议的限制，不同的协议存在少量差异。

* map，key只支持string

* highway (protobuf限制)
  1. 不支持在网络上传递null，包括Collection、array中的元素，map的value
  2. 长度为0的数组、list，不会在网络上传递，接收端解码出来就是默认值

* springmvc
  1. 不支持Date作为path、query参数。 因为springmvc直接将Date做toString放在path、query中，与swagger的标准不匹配。

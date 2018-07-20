# 接口定义和数据类型

## 接口定义的要求

ServiceComb-Java-Chassis建议接口定义遵循一个简单的原则：接口定义即接口使用说明，不用通过查看代码实现，就能识别如何调用这个接口。可以看出，这个原则站在使用者这边，以更容易被使用作为参考。ServiceComb会根据接口定义生成接口契约，符合这个原则的接口，生成的契约也是用户容易阅读的。

举个例子：

```java
public Person query(String id);
public Object query(String id);
public class Person {String name;}
```

显然调用接口一，我们知道要传递一个String类型的id参数，返回值是一个Person类型，Person里面存在String类型的name参数。调用接口二，我们不知道怎么处理返回值，必须参考服务提供者的文档说明。这个视角是熟练的RPC开发者的视角。

当我们要将接口发布为REST接口的时候，可以指定接口参数和HTTP协议的映射关系，比如：

```java
public Person query(@RequestParam String id);
public Person query(@PathVariable String id);
public void save(@RequestBody Person person);
```

通常，我们会将简单的数据类型，比如String, int等在RequestParam或者PathVariable传递，而把复杂的数据类型使用JSON编码以后在RequestBody传递，以减少HTTP协议限制可能给开发者带来的各种问题。这个视角是熟练的REST开发者的视角，在RPC开发者的视角之外，REST开发者需要理解的信息更多，他们不仅需要知道RPC接口，还需要了解接口和HTTP协议的绑定关系，要理解JAVA对象如何在HTTP的消息中进行转换。

ServiceComb-Java-Chassis还有一个约束：接口定义必须符合Open API的规范，从而能够更好的在不同语言之间进行协作，能够支持除了HTTP以为的其他协议和编码。熟练的SpringMVC、JAX-RS开发者会发现一些特殊的用法无法使用，比如使用HttpServletRequest来解析HTTP头信息等。再比如，按照Open API规范，每个接口都必须有唯一的ID，如果开发者需要使用重载，那么必须显示的使用@ApiOperation给重载方法赋予唯一的ID。ServiceComb-Java-Chassis接口定义要求符合下面的范式：

```
@SupportedAnnotations
ResponseType methodName(RequestType...)
```

不能定义异常、不能包含在接口原型未声明的错误码和输出（如果没声明错误码，缺省的错误码除外，比如HTTP 的200）。

通常，系统约束越多，那么就更加容易对系统进行统一的管控和治理；开发方式越自由，实现业务功能则更加快速，需要在这两方面取得一些平衡。ServiceComb-Java-Chassis是比gRPC要灵活很多的框架，同时也去掉了Spring MVC的一些不常用的扩展。开发者可以在ServiceComb-Java-Chassis讨论区反馈开发过程中期望支持的场景，更好的维护这个平衡。期望这个讨论是围绕某个具体的应用场景来进行的，比如上传文件如何更好的进行，而不是具体的开发方式进行的，比如使用Object来传递参数。

## 详细的约束列表

开发者不能在接口定义的时候使用如下类型：

* 抽象的数据结构: java.lang.Object, net.sf.json.JsonObject等

  **备注：** 最新版本可以使用java.lang.Object作为参数和返回值。它的运行时类型可以是int、String、Map等。尽管如此，建议开发者不要使用抽象数据结构，以及第三方提供的非POJO类作为接口的参数和返回值。这些类型包括java.math.BigDecimal、org.joda.time.JodaTime等。这些类型会给开发者带来很大的困扰。比如开发者可能以为BidDecimal会以数字传输，实际不然，并且在某些内部状态没正确计算的情况下，得到的并不是用户预期的值。

* 接口或者抽象类
  ```java
   public interface IPerson {//...}
   public abstract class AbstractPerson  {//...}
  ```

* 上述类型的集合类型或者没有指定具体类型的集合，比如：`List<IPerson>, Map<String, PersonHolder<?>>, List, Map`等。 `List<String>, List<Person>`这些具体类型是支持的。

* 包含上述类型作为属性的类型

  ```java
   public class GroupOfPerson {IPerson master //...}
  ```

开发者不用担心记不住这些约束，程序会在启动的时候检查不支持的类型，并给与错误提示。

总之，数据结构需要能够使用简单的数据类型进行描述，一目了然就是最好的。这个在不同的语言，不同的协议里面都支持的很好，长期来看，可以大大减少开发者联调沟通和后期重构的成本。

### 关于数据结构和接口变更
接口名称、参数类型、参数顺序、返回值类型变更都属于接口变更。ServiceComb启动的时候，会根据版本号检测接口变化，接口变化要求修改版本号。ServiceComb识别接口是否变化是通过代码生成的契约内容，有些不规范的接口定义可能导致在代码没有变化的情况下，生成的契约不同。比如：

```
public void get(Person p)
class Person {
  private String value;
  private boolean isOk;
  public String getName() {return value}
  public boolean isOk() {return isOK}
}
```

这个接口通过access method定义了"name"和"ok"两个属性，和实际的字段"value"和"isOk"不同。这种情况可能导致每次启动生成的契约不一样。需要将代码调整为符合JAVA Bean规范的定义。
```
public void get(Person p)
class Person {
  private String name;
  private boolean ok;
  public String getName() {return name}
  public boolean isOk() {return ok}
}
```

或者通过JSON标注，显示的指明字段顺序。比如：

```
public void get(Person p)
@JsonPropertyOrder({"name", "ok"})
class Person {
  private String value;
  private boolean isOk;
  public String getName() {return value}
  public boolean isOk() {return isOK}
}
```

考虑到接口变更的影响，建议在进行对外接口定义的时候，尽可能不要使用第三方软件提供的类作为接口参数，而是使用自定义的POJO类。一方面升级三方件的时候，可能感知不到接口变化；另外一方面，如果出现问题，无法通过修改第三方代码进行规避。比如：java.lang.Timestamp, org.joda.time.JodaTime等。

## 协议上的差异

尽管ServiceComb-Java-Chassis实现了不同协议之间开发方式的透明，受限于底层协议的限制，不同的协议存在少量差异。

* map，key只支持string

* highway \(protobuf限制\)  
  1. 不支持在网络上传递null，包括Collection、array中的元素，map的value  
  2. 长度为0的数组、list，不会在网络上传递，接收端解码出来就是默认值

* springmvc  
  1. 不支持Date作为path、query参数。 因为springmvc直接将Date做toString放在path、query中，与swagger的标准不匹配。

## 泛型支持

ServiceComb-Java-Chassis 支持REST传输方式下的泛型请求参数和返回值。例如使用一个泛型的数据类型:
```java
public class Generic<T>{
  public T value;
}
```
其中的泛型属性T可以是一个实体类、java.util.Date、枚举，也可以嵌套泛型数据类型。

当用户使用隐式契约功能自动生成微服务契约时，需要在provider接口方法的返回消息中明确指定泛型类型，以保证 ServiceComb-Java-Chassis 生成的契约中包含足够的接口信息。例如，当provider端接口方法代码为
```java
public Generic<List<Person>> getHolderListArea() {
  Holder<List<Person>> response = new Holder<>();
  // ommited
  return response;
}
```
时， ServiceComb-Java-Chassis 能够识别出泛型返回对象的确切信息，以保证consumer端接收到的应答消息能够被正确地反序列化。
而如果provider端接口方法的代码为
```java
public Generic getHolderListArea() {
  Holder<List<Person>> response = new Holder<>();
  // ommited
  return response;
}
```
时，由于契约中缺少List元素的类型信息，就会出现consumer端无法正确反序列化应答的情况，比如consumer接收到的参数类型可能会变为`Holder<List<Map<String,String>>>`，`Person`对象退化为Map类型。

> ***说明:***   
> 虽然 ServiceComb-Java-Chassis 支持REST泛型参数，但是我们更加推荐用户使用实体类作为参数，以获得更加明确的接口语义。

## 其他常见问题

* 使用RestTemplate传递raw json
假设服务端定义了接口
```
Person test(Person input)
```
用户期望使用RestTemplate自行拼接json字符串，然后进行传递:
```
      String personStr = JsonUtils.writeValueAsString(input);
      result = template.postForObject(cseUrlPrefix + "sayhello", personStr, Person.class);
```
ServiceComb不推荐开发者这样使用，里面的处理逻辑存在大量歧义。如果必须使用，需要满足几个约束：Person必须包含带String类型的构造函数；provider/consumer都必须存在这个Person类型。
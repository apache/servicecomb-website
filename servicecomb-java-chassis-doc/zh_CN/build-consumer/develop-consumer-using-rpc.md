# 使用RPC方式开发服务消费者

## 概念阐述

RPC开发方式允许用户通过在服务接口上标注注解来生成服务提供者代理，从而进行服务的调用。

## 示例代码

只需要声明一个服务接口类型的成员，并且使用@RpcReference标注该成员，声明依赖的微服务及schemaId，即可进行服务调用，示例代码如下：

* 透明RPC 客户端代码示例

```java
@Component
public class PojoConsumerMain {

  @RpcReference(microserviceName = "hello", schemaId = "hello")
  private static Hello hello;

  @RpcReference(microserviceName = "hello", schemaId = "codeFirstCompute")
  public static Compute compute;

  public static void main(String[] args)
      throws Exception {
    init();
    System.out.println(hello.sayHi("Java Chassis"));
    Person person = new Person();
    person.setName("ServiceComb/Java Chassis");
    System.out.println(hello.sayHello(person));
    System.out.println("a=1, b=2, result=" + compute.add(1, 2));
  }

  public static void init()
      throws Exception {
    Log4jUtils.init();
    BeanUtils.init();
  }
}
```

>在以上代码中，服务消费者已经取得了服务提供者的服务接口`Hello 、Compute`，并在代码中声明一个`Hello`类型 和 Compute 类型的成员。通过在`hello 和 compute`上使用`@RPCReference`注解指明微服务名称和schemaId，ServiceComb框架可以在程序启动时从服务中心获取到对应的服务提供者实例信息，并且生成一个代理注入到hello和compute中，用户可以像调用本地类一样调用远程服务。

* JAX-RS 客户端示例代码 ：

```java
@Component
public class JaxrsConsumerMain {

    @RpcReference(microserviceName = "jaxrs", schemaId = "jaxrsHello")
    private static Hello hello;

    public static void main(String[] args) throws Exception {
        init();
        System.out.println(hello.sayHi("Java Chassis"));
        Person person = new Person();
        person.setName("ServiceComb/Java Chassis");
        System.out.println(hello.sayHello(person));
    }

    public static void init() throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }
}
```
>我们发现上述代码， `JAX-RS` 客户端也是使用 `RPC` 的方式访问的服务端方法。 其实不管 provider
是使用 `JAX-RS` 、 `Spring mvc` 还是 `RPC`，只需要在服务端定义的时候声明下 `RPC` 接口，客户端都可以通过RPC的方式远程远程访问。因此，服务端定义一个接口是很好的开发实践。

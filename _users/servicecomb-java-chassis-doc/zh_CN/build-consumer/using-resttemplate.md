# 使用RestTemplate开发服务消费者

## 概念阐述

RestTemplate是Spring提供的RESTful访问接口，ServiceComb提供该接口的实现类用于服务的调用。

## 场景描述

用户使用ServiceComb提供的RestTemplate实例，可以使用自定义的URL进行服务调用，而不用关心服务的具体地址。

## 示例代码

RestTemplate实例通过调用`RestTemplateBuilder.create()`方法获取，再使用该实例通过自定义的URL进行服务调用，代码如下：

* Spring MVC 客户端示例代码：

```java
@Component
public class SpringmvcConsumerMain {
    private static RestTemplate restTemplate = RestTemplateBuilder.create();

    public static void main(String[] args) throws Exception {
        init();
        Person person = new Person();
        person.setName("ServiceComb/Java Chassis");
        String sayHiResult = restTemplate
                .postForObject("cse://springmvc/springmvchello/sayhi?name=Java Chassis", null, String.class);
        String sayHelloResult = restTemplate
                .postForObject("cse://springmvc/springmvchello/sayhello", person, String.class);
        System.out.println("RestTemplate consumer sayhi services: " + sayHiResult);
        System.out.println("RestTemplate consumer sayhello services: " + sayHelloResult);
    }

    public static void init() throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }
}
```

* JAX RS 客户端示例代码：

```java

@Component
public class JaxrsConsumerMain {

    public static void main(String[] args) throws Exception {
        init();
        //其他都类似spring MVC示例的客户端代码，注意如果服务端只接收 GET 请求，要使用方法 getForObject()
        RestTemplate restTemplate = RestTemplateBuilder.create();
        String result = restTemplate.getForObject("cse://jaxrs/jaxrshello/saybye", String.class);
    }

    public static void init() throws Exception {
        Log4jUtils.init();
        BeanUtils.init();
    }
}
```

> 说明：
>
> * URL格式为：`cse://microserviceName/path?querystring`。以[用SpringMVC开发微服务](/用SpringMVC开发微服务)中定义的服务提供者为例，其微服务名称是springmvc，basePath是`/springmvchello`，那么URL中的microserviceName=`springmvc`，请求sayhi时的path=`springmvchello/sayhi`，所以示例代码中请求sayhi的URL是`cse://springmvc/springmvchello/sayhi?name=Java Chassis`。具体代码示例如下 ：


```java
@RestSchema(schemaId = "springmvcHello")
@RequestMapping(path = "/springmvchello", produces = MediaType.APPLICATION_JSON)
//这里 path = “/springmvchello” 中的 springmvchello 就是 上述的basePath
public class SpringmvcHelloImpl implements Hello {
    @Override
    @RequestMapping(path = "/sayhi", method = RequestMethod.POST)
    public String sayHi(@RequestParam(name = "name") String name) {
        return "Hello " + name;
    }

    @Override
    @RequestMapping(path = "/sayhello", method = RequestMethod.POST)
    public String sayHello(@RequestBody Person person) {
        return "Hello person " + person.getName();
    }
}
```
> 下述代码是示例项目  [ SpringMVC ](https://github.com/apache/incubator-servicecomb-java-chassis/tree/master/samples/springmvc-sample)的 springmvc-provider 模块 中 resources 目录下 microservice.yaml

```yaml
APPLICATION_ID: springmvc-sample
service_description:
  name: springmvc # 这里就是定义的微服务名称
  version: 0.0.2
servicecomb:
  service:
    registry:
      address: http://127.0.0.1:30100
  rest:
    address: 0.0.0.0:8080
  highway:
    address: 0.0.0.0:7070
  handler:
    chain:
      Provider:
        default: bizkeeper-provider
cse:
  service:
    registry:
      address: http://127.0.0.1:30100		#service center address
```




> * 使用上述这种URL格式，ServiceComb框架会在内部进行服务发现、熔断容错等处理并最终将请求发送到服务提供者。

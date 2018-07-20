# 使用AsynRestTemplate开发服务消费者

## 概念阐述

AsyncRestTemplate 开发方式允许用户异步的进行服务调用。具体的业务流程和 restTemplate 类似，只是这里以异步的形式进行服务的调用。

## 示例代码

AsyncRestTemplate 实例通过 new CseAsyncRestTemplate（）来创建和获取，再使用该实例通过自定义的 URL 进行服务调用。

* Spring MVC 客户端代码示例

```java

@Component
public class SpringmvcConsumerMain {
  private static final Logger LOG = LoggerFactory.getLogger(SpringmvcConsumerMain.class);

  public static void main(String[] args) throws Exception {
    init();
    Person person = new Person();
    person.setName("ServiceComb/Java Chassis");
    //AsyncRestTemplate Consumer
    CseAsyncRestTemplate cseAsyncRestTemplate = new CseAsyncRestTemplate();
    ListenableFuture<ResponseEntity<String>> responseEntityListenableFuture = cseAsyncRestTemplate
        .postForEntity("cse://springmvc/springmvchello/sayhi?name=Java Chassis", null, String.class);
    ResponseEntity<String> responseEntity = responseEntityListenableFuture.get();
    System.out.println("AsyncRestTemplate Consumer sayHi services: " + responseEntity.getBody());

    HttpEntity<Person> entity = new HttpEntity<>(person);
    ListenableFuture<ResponseEntity<String>> listenableFuture = cseAsyncRestTemplate
        .exchange("cse://springmvc/springmvchello/sayhello", HttpMethod.POST, entity, String.class);
    //    ResponseEntity<String> responseEntity1 = listenableFuture.get();
    //    System.out.println("AsyncRestTemplate Consumer sayHello services: " + responseEntity1.getBody());
    //设置回调函数
    listenableFuture.addCallback(
        new ListenableFutureCallback<ResponseEntity<String>>() {
          @Override
          public void onFailure(Throwable ex) {
            LOG.error("AsyncResTemplate Consumer catched exception when sayHello, ", ex);
          }

          @Override
          public void onSuccess(ResponseEntity<String> result) {
            System.out.println("AsyncRestTemplate Consumer sayHello services: " + result.getBody());
          }
        });
  }

  public static void init() throws Exception {
    Log4jUtils.init();
    BeanUtils.init();
  }
}

```

> 说明 ：
>
> * URL 的格式和 RestTemplate 一样，具体可以参考 restTemplate
> * 这里用自定义的 ListenableFuture 类来作为占位符，获取远程调用结束后可能获取的结果。同时也可以自定义回调函数，对可能返回的结果进行分批处理。

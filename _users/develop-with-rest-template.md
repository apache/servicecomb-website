---
title: "使用Rest Template方式开发"
lang: en
ref: develop-with-rest-template
permalink: /users/develop-with-rest-template/
excerpt: "使用Rest Template方式开发"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## 概念阐述

　　Rest Template是Spring提供的RESTful访问接口，ServiceComb提供该接口的实现类用于服务的调用。

## 场景描述

　　用户使用ServiceComb提供的Rest Template实例，可以使用自定义的URL进行服务调用，而不用关心服务的具体地址。

## 示例代码

　　Rest Template实例通过调用`RestTemplateBuilder.create()`方法获取，再使用该实例通过自定义的URL进行服务调用，代码如下：

```java
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import io.servicecomb.foundation.common.utils.BeanUtils;
import io.servicecomb.foundation.common.utils.Log4jUtils;
import io.servicecomb.provider.springmvc.reference.RestTemplateBuilder;
import io.servicecomb.samples.common.schema.models.Person;

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

> 说明：
- URL格式为：`cse://microserviceName/path?querystring`。以[用SpringMVC开发微服务](/users/develop-with-springmvc/)中定义的服务提供者为例，其微服务名称是`springmvc`，basePath是`/springmvchello`，那么URL中的microserviceName是`springmvc`，请求sayhi时的path是`springmvchello/sayhi`，所以示例代码中请求sayhi的URL是`cse://springmvc/springmvchello/sayhi?name=Java Chassis`。
- 使用这种URL格式，ServiceComb框架会在内部进行服务发现、熔断容错等处理并最终将请求发送到服务提供者。

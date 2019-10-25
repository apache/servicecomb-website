---
title: "Develop with Rest Template"
lang: en
ref: develop-with-rest-template
permalink: /docs/users/develop-with-rest-template/
excerpt: "Develop with Rest Template"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description

　　Rest Template is a RESTful API provide by the Spring framework.  ServiceComb provides the API for service calling

## Scenario

　　You can call microservices using your customized URL and the RestTemplate instance provided by ServiceComb regardless of the specific address of the service.

## Sample Code

　　Obtain RestTemplate by calling `RestTemplateBuilder.create()`. Then, use the instance and the customized URL to call microservices. The code is as follows:

```java
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import org.apache.servicecomb.foundation.common.utils.BeanUtils;
import org.apache.servicecomb.foundation.common.utils.Log4jUtils;
import org.apache.servicecomb.provider.springmvc.reference.RestTemplateBuilder;
import org.apache.servicecomb.samples.common.schema.models.Person;

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

> NOTE:
- The URL must be in format of ServiceComb: `cse://microserviceName/path?querystring`. Use the provider defined in [Develop Microservice with SpringMVC](/users/develop-with-springmvc/) as an example. The microservice name is `springmvc`, and its base path is `/springmvchello`, so you should set microserviceName in the URL to  `springmvchello/sayhi` when requesting sayhi. Therefore, the URL for requesting sayhi is  `cse://springmvc/springmvchello/sayhi?name=Java Chassis`.
- During use of this URL format, the ServiceComb framework will perform internal microservice descovery, fallbreak, and fault tolerance and send the requests to the microservice providers.

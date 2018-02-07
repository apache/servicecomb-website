---
title: "Develop with RPC"
lang: en
ref: develop-with-rpc
permalink: /users/develop-with-rpc/
excerpt: "Develop with RPC"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description

The RPC development mode allows you to add annotations on the microservice APIs to generate the service provider agent. In this case, you can call microservices.

## Sample Code

To call a microservice, you only need to declare a member of a service API type and add the @RpcReference annotation for the member, the microservice that depends on the declaration, and the schemaID. The sample code is as follows.

```java
import org.springframework.stereotype.Component;

import org.apache.servicecomb.foundation.common.utils.BeanUtils;
import org.apache.servicecomb.foundation.common.utils.Log4jUtils;
import org.apache.servicecomb.provider.pojo.RpcReference;
import org.apache.servicecomb.samples.common.schema.Hello;
import org.apache.servicecomb.samples.common.schema.models.Person;

@Component
public class CodeFirstConsumerMain {
    @RpcReference(microserviceName = "codefirst", schemaId = "codeFirstHello")
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

In the preceding code, the microservice consumers have obtained the microservice API Hello of the microservice provider and declared a member of the Hello type. The annotation `@RPCReference` on `Hello` specifies the microservice name and schemaId, The ServiceComb framework can obtain information about isntances from a certain provider during program startup and generate an agent to insert to Hello. This allows you to call a remote service in the same way as you call a local class.

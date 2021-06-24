## Scene Description

Service consumers can store contracts in the project directory without having to explicitly do so, and when the program starts, the ServiceComb framework automatically pulls the contract information from the service center based on the microservice name and version number of the service provider configured in the microservice.yaml file.

## Involving API

The use of implicit contracts can be used for both RestTemplate and transparent RPC service development models. For the development method using RestTemplate, see 4.3 Developing Service Consumers with RestTemplate.

## Sample Code

This section shows how to develop service consumers using implicit contracts, using transparent RPC development patterns as an example.

The sample code for the service consumer is as follows:

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

In the code above, the service consumer has taken the service interface Hello of the service provider and declared a Hello type member in the code. By using the RPCReference annotation on hello to specify the microservice name and schemaId, the ServiceComb framework can be in
When the program starts, the corresponding service provider instance information is obtained from the service center and a proxy is generated to be injected into the hello. The user can invoke the remote service as if it were a local class.

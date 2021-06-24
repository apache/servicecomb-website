# Printing Service Information
## Conception Illustration
In order make it easier and faster for users to gather the service information, those data are collected and printed on the log.
## effect
How the printing looks like:  
No matter the initialization of the service succeeded or not, the service information will be printed at the end of the log, users can search by "Service Information is shown below" to locate it
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

## extension
### related interfaces and classes
1. interface: BootUpInformationCollector
> collect(): return a string，which is the information that should be printed on the log  
> getOrder():return the priority of the implementation classes of BootUpInformationCollector, the smaller the number, the higher the priority.  

### how users implement extension
to make extension of the printing service, user need to:
1. Create new classes that implements Interface BootUpInformationCollector, and set the appropriate order.
2. Create SPI file.

### example
1. Create a new implementation class HelloCollector.
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
because the order of this class is 5, it will be printed between the address information(order 0) and service information(order 200)  
2. Create SPI file  
create new SPI file under directory resources/META-INF/services  
name of the file: org.apache.servicecomb.core.bootup.BootUpInformationCollector  
content: the class name of HelloCollector  
3. printing effect
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

---
title: "API Constraints"
lang: en
ref: service-interface-constraints
permalink: /users/service-interface-constraints/
excerpt: "API Constraints"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## API Constraints
A Java Chassis API constraints is that an API definition should describe its usage. You can identify how to call the API without checking the code.

As developers, we aim at making our APIs easy to be called. However, developers have different understanding about this aim.

For example:

```java
public Person query(String id);
public Object query(String id);
public class Person {String name;}
```

Obviously, if API 1 is called, we know that an ID parameter of String type needs to be transferred. The returned value is of Person type, which contains a string-typed name parameter. If API 2 is called, we do not know how to process the returned value, and need to refer to documents provided by the service provider. API 2 is developed in the perspective of RPC developers.

To release an API as a REST API, we can use the swagger file; specify the ID to be transmitted using RequestParam, PathVariable, or RequestBody; or use the label provided by SpringMVC or JAX-RS.

```java
public Person query(@RequestParam String id); 
public Person query(@PathVariable String id); 
public Person query(@RequestBody String id); 
```



Generally , simple data types, such as String and int, are transmitted in RequestParam or PathVariable, and complex data types are transmitted in RequestBody after being coded using JSON, to reduce problems cause by HTTP protocol restrictions on developers.

## Detailed Constraint List 
Developers cannot use the following types to define APIs:

* Abstract data structures, such as  java.lang.Object, net.sf.json.JsonObject
* API or abstract class
   ```java
   public interface IPerson {...}
   public abstract class AbstractPerson  {...}
   ```
* Generic type
   ```java
   public class PersonHolder<T> {...}
   ```
* A collection type of the preceding types or a set without a specified type, such as `List<IPerson>, Map<String, PersonHolder<?>>, List, Map`. such as `List<String>, List<Person>` are supported.

   ```java
   public class GroupOfPerson {IPerson master ...}
   ```


Developers do not need to worry about the constraints. The program automatically checks them when it is started, and displays types as properties.

## Protocol Difference 
Although ServiceComb-Java-Chassis implements transparent transmission between protocols, there are slight differences between protocols due to the limitations of the underlying protocols:

* Map, The key supports only string.

* highway (protobuf restriction)
  1. Null values cannot be transmitted over the network, including elements in Collection and array, and value in map.
  2. The array and list with the length of 0 are not transmitted over the network. The receiver obtains the default value after decoding them.

* springmvc
  1. Date cannot be used for the path or query parameter. Spring MVC stores toString in path and query, which does not match the swagger standard.

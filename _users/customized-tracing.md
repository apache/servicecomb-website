---
title: "Customized Tracing"
lang: en
ref: customized-tracing
permalink: /users/customized-tracing/
excerpt: "Dotting for Customized Tracing"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Disctiption

A distributed call chain tracking records the service calling sequence, but developers also need information about link invocation inside a microservice to describe a complete call chain. In this way, they can locate error and identify potential performance problems more easily.

## Prerequisites

* To use the customized dotting function, you need to configure and set the Java Chassis microservice call chain.

## Precautions

* The customized dotting that uses the `@Span` annotation can only be called using the thread that calls Java Chassis.
* To add the `@Span` annotation, you must use the Bean method of Spring. Otherwise, you need to configure dotting following the procedure in this section.

## Customized Dotting Call Chain

This function integrates Zipkin and provides the `@Span` annotation to customize dotting for the method you want to track. Java Chassis automatically tracks all the methods that track the `@Span` annotation, associating the local method call information with the call information between services.

## Procedure:

### Add dependency

For microservices based on ServiceComb Java Chassis, add the following content to pom.xml

```xml
    <dependency>
      <groupId>org.apache.servicecomb</groupId>
      <artifactId>tracing-zipkin</artifactId>
    </dependency>
```

### Enable customized dotting

Addthe `@EnableZipkinTracing` annotation to the application portal or the Spring configuration class:

```java
@SpringBootApplication
@EnableZipkinTracing
public class ZipkinSpanTestApplication {
  public static void main(String[] args) {
    SpringApplication.run(ZipkinSpanTestApplication.class);
  }
}
```

### Customize dotting

Add the `@Span` annotation to the method that requires dotting customization:

```java
@Component
public class SlowRepoImpl implements SlowRepo {
  private static final Logger logger = LoggerFactory.getLogger(SlowRepoImpl.class);

  private final Random random = new Random();

  @Span
  @Override
  public String crawl() throws InterruptedException {
    logger.info("in /crawl");
    Thread.sleep(random.nextInt(200));
    return "crawled";
  }
}
```

In this way, Zipkin-based customized dotting is enabled using the @Span annotation.

## Customize reported data

The call chain reported by customized dotting contains the following pieces of data:

* **span name** which is the full name of the annotated method by default.
* **call.path**  which is the signature of the annotated method by default.

  For example, the data reported in SlowRepoImp is as follows:

| key       | value                                    |
| :-------- | :--------------------------------------- |
| span name | crawl                                    |
| call.path | public abstract java.lang.String org.apache.servicecomb.tests.tracing.SlowRepo.crawl\(\) throws java.lang.InterruptedException |

To customize reported data, you can specify customized parameters:

```java
  public static class CustomSpanTask {
    @Span(spanName = "transaction1", callPath = "startA")
    public String invoke() {
      return "invoke the method";
    }
  }
```

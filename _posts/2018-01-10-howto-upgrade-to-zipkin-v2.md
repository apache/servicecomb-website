---
title: "Howto Upgrade to Zipkin2"
lang: en
ref: howto-upgrade-topzipkin2
permalink: /docs/howto-upgrade-topzipkin2/
excerpt: "Changes between v1 and v2 of zipkin and how Java Chassis upgraded to zipkin2"
last_modified_at: 2018-01-11T10:26:28+08:00
author: Yang Bo
tags: [zipkin]
redirect_from:
  - /theme-setup/
---

## Background

Java Chassis uses zipkin as the default tracing implementation. 

Zipkin introduced [v2 http api](http://zipkin.io/zipkin-api/#/) in version 1.31 which simplifies data types. There are also various other improvements and new features added to the zipkin libraries, so it seems a good time for us to follow the upstream and upgrade to zipkin2.

### Version matrix

| module   | current | target | supports v2 since |
|---|---|---|---|
| zipkin   |  1.24.0 |  2.4.2 |             2.0.0 |
| brave    |  4.13.1 | 4.13.1 |             4.7.1 |
| reporter |  0.10.0 |  2.2.2 |             2.0.0 |

## What's changed

Zipkin did a very good job on maintaining backward compatibility. All the changes that breaks compatiblity are packaged into a new group(`io.zipkin.java` -> `io.zipkin.zipkin2`, `io.zipkin.reporter` -> `io.zipkin.reporter2`). And v1/v2 libraries can coexist.

The zipkin2 library can use both v1 and v2 api to communicate with server.

The `zipkin2.Span` class changed a bit from the old `zipkin.Span` class. The public fields are refactored to methods. And the `BinaryAnnotation` class is removed along with `zipkin.Span.binaryAnnotaions` field. It's functionality is replaced by `zipkin2.Span.tags()` method which return a `Map<String,String>`.

## Upgrade to zipkin2 for Java Chassis

### Modify the maven dependencies to use the target version of related libraries.
Change the group `io.zipkin.java` and `io.zipkin.reporter` to `io.zipkin.zipkin2` and `io.zipkin.reporter2` respectively.

``` diff
java-chassis-dependencies/pom.xml
@@ -50,8 +50,8 @@
     <cxf.version>3.1.6</cxf.version>
     <logback.version>1.1.7</logback.version>
     <brave.version>4.13.1</brave.version>
-    <zipkin.version>1.24.0</zipkin.version>
-    <zipkin-reporter.version>0.10.0</zipkin-reporter.version>
+    <zipkin.version>2.4.2</zipkin.version>
+    <zipkin-reporter.version>2.2.2</zipkin-reporter.version>
   </properties>
 
   <dependencyManagement>
@@ -646,7 +646,7 @@
 
       <!-- zipkin dependencies -->
       <dependency>
-        <groupId>io.zipkin.java</groupId>
+        <groupId>io.zipkin.zipkin2</groupId>
         <artifactId>zipkin</artifactId>
         <version>${zipkin.version}</version>
       </dependency>
@@ -661,7 +661,7 @@
         <version>${brave.version}</version>
       </dependency>
       <dependency>
-        <groupId>io.zipkin.reporter</groupId>
+        <groupId>io.zipkin.reporter2</groupId>
         <artifactId>zipkin-sender-okhttp3</artifactId>
         <version>${zipkin-reporter.version}</version>
       </dependency>

handlers/handler-tracing-zipkin/pom.xml
@@ -50,7 +50,7 @@
       <artifactId>brave</artifactId>
     </dependency>
     <dependency>
-      <groupId>io.zipkin.reporter</groupId>
+      <groupId>io.zipkin.reporter2</groupId>
       <artifactId>zipkin-sender-okhttp3</artifactId>
     </dependency>
     <dependency>

```


### Make brave to use zipkin2 instead of zipkin

Change the zipkin.xxx import to zipkin2.xxx on imports, and most importantly, use `spanReporter()` instead of `reporter()` for generating reporter for brave, change the api path to /api/v2/xxx when creating sender.

``` diff
handlers/handler-tracing-zipkin/src/main/java/org/apache/servicecomb/tracing/zipkin/TracingConfiguration.java
@@ -31,11 +31,11 @@
 import brave.http.HttpTracing;
 import brave.propagation.CurrentTraceContext;
 import org.apache.servicecomb.config.DynamicProperties;
-import zipkin.Span;
-import zipkin.reporter.AsyncReporter;
-import zipkin.reporter.Reporter;
-import zipkin.reporter.Sender;
-import zipkin.reporter.okhttp3.OkHttpSender;
+import zipkin2.Span;
+import zipkin2.reporter.AsyncReporter;
+import zipkin2.reporter.Reporter;
+import zipkin2.reporter.Sender;
+import zipkin2.reporter.okhttp3.OkHttpSender;
 
 @Configuration
 class TracingConfiguration {
@@ -56,14 +56,15 @@ Sender sender(DynamicProperties dynamicProperties) {
     return AsyncReporter.builder(sender).build();
   }
 
+
   @Bean
   Tracing tracing(Reporter<Span> reporter, DynamicProperties dynamicProperties,
       CurrentTraceContext currentTraceContext) {
     return Tracing.newBuilder()
         .localServiceName(dynamicProperties.getStringProperty(CONFIG_QUALIFIED_MICROSERVICE_NAME_KEY,
             DEFAULT_MICROSERVICE_NAME))
         .currentTraceContext(currentTraceContext) // puts trace IDs into logs
-        .reporter(reporter)
+        .spanReporter(reporter)
         .build();
   }
```

**Note**:

In the [brave release notes](https://github.com/openzipkin/brave/releases/tag/4.7.1), it's stated that we need to use `create()` instead of `builder()`

``` diff

   /** Configuration for how to buffer spans into messages for Zipkin */
-  @Bean Reporter<Span> reporter() {
-    return AsyncReporter.builder(sender()).build();
+  @Bean Reporter<Span> spanReporter() {
+    return AsyncReporter.create(sender()).build();
   }
```


But this will not work. In `zipkin2.Reporter`, the `create(sender)` is actually equivalent to `builder(sender).build()`

``` java
  public static AsyncReporter<Span> create(Sender sender) {
    return (new AsyncReporter.Builder(sender)).build();
  }
  
  public static AsyncReporter.Builder builder(Sender sender) {
    return new AsyncReporter.Builder(sender);
  }
```


### Make changes according to the changes of zipkin.Span and zipkin2.Span.

We do not use zipkin.Span in our production code, but we do use it in our tests. Those changes are quite straight forward, we just change the accessing of fields to calling methods as described in the What's Changed section.

``` diff
tracing/tracing-zipkin/src/test/java/org/apache/servicecomb/tracing/zipkin/ZipkinSpanAspectTest.java 
@@ -45,7 +45,7 @@
 import org.apache.servicecomb.tracing.zipkin.app.ZipkinSpanTestApplication;
 import org.apache.servicecomb.tracing.zipkin.app.ZipkinSpanTestApplication.CustomSpanTask;
 import org.apache.servicecomb.tracing.zipkin.app.ZipkinSpanTestApplication.SomeSlowTask;
-import zipkin.Span;
+import zipkin2.Span;
 
 @RunWith(SpringRunner.class)
 @SpringBootTest(classes = {ZipkinSpanTestApplication.class, TracingConfig.class})
@@ -74,8 +74,8 @@ public void reportedSpanContainsAnnotatedMethodInfo() throws Exception {
 
     await().atMost(2, SECONDS).until(() -> !spans.isEmpty());
 
-    zipkin.Span span = spans.poll();
-    assertThat(span.name, is("crawl"));
+    zipkin2.Span span = spans.poll();
+    assertThat(span.name(), is("crawl"));
     assertThat(tracedValues(span), contains(SomeSlowTask.class.getMethod("crawl").toString()));
   }
   
@@ -84,17 +84,17 @@ public void reportCustomSpanInfomation() throws Exception {
     customSpanTask.invoke();
     await().atMost(2, SECONDS).until(() -> !spans.isEmpty());
   
-    zipkin.Span span = spans.poll();
-    assertThat(span.name, is("transaction1"));
+    zipkin2.Span span = spans.poll();
+    assertThat(span.name(), is("transaction1"));
     assertThat(tracedValues(span), contains("startA"));
     
   }
 
-  private List<String> tracedValues(zipkin.Span spans) {
-    return spans.binaryAnnotations.stream()
-        .filter(span -> CALL_PATH.equals(span.key) || "error".equals(span.key))
-        .filter(span -> span.value != null)
-        .map(annotation -> new String(annotation.value))
+  private List<String> tracedValues(zipkin2.Span spans) {
+    return spans.tags().entrySet().stream()
+        .filter(span -> CALL_PATH.equals(span.getKey()) || "error".equals(span.getKey()))
+        .filter(span -> span.getValue() != null)
+        .map(annotation -> new String(annotation.getValue()))
         .distinct()
         .collect(Collectors.toList());
   }
@@ -110,7 +110,7 @@ public void reportCustomSpanInfomation() throws Exception {
     Tracing tracing(Queue<Span> spans) {
       return Tracing.newBuilder()
           .currentTraceContext(new StrictCurrentTraceContext())
-          .reporter(spans::add)
+          .spanReporter(spans::add)
           .build();
     }
   }
``` 


### Support both v1 and v2 api of zipkin server.

Our customers may be still running a zipkin server prior to 1.31 which does not support the v2 http api. So we added an option to let them specify the server api version.

Supporting v1 api is built into zipkin2, so we do not need to rely on the v1 libraries. Just use the `SpanBytesEncoder.JSON_V1` when building reporter and change the sender api path.

``` java
sender = URLConnectionSender.create("http://localhost:9411/api/v1/spans")
reporter = AsyncReporter.builder(sender)
                        .build(SpanBytesEncoder.JSON_V1);
```


That's all, for the complete changes, please refer the [pull request](https://github.com/apache/incubator-servicecomb-java-chassis/pull/488) for the complete changes.

## References

* [Zipkin 2.0.0 release notes](https://github.com/openzipkin/zipkin/releases/tag/2.0.0)
* [Brave 4.7.1 release notes](https://github.com/openzipkin/brave/releases/tag/4.7.1)
* [Brave API V4](https://github.com/openzipkin/brave/tree/master/brave)

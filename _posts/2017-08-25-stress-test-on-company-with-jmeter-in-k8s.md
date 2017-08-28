---
title: "Stress test on Company Demo with Jmeter in Kubernetes Cluster"
lang: en
ref: stress-test-on-company-with-jmeter-in-k8s
permalink: /docs/stress-test-on-company-with-jmeter-in-k8s/
excerpt: "An introduction of how to do stress test on company demo with jmeter in kubernetes cluster"
last_modified_at: 2017-08-25T09:18:43+08:00
author: Eric Lee
redirect_from:
  - /theme-setup/
---

## Background

Stress test is an effective way to evaluate the performance of web applications. Besides, more and more web applications are decomposed into several microservices and performance of each microservice may vary as some are compute intensive while some are IO intensive. Stress test on web application based on microservice architecture plays a more important role. This blog will evaluate the performance of our [company demo](https://github.com/ServiceComb/ServiceComb-Company-WorkShop) using [JMeter 3.2](https://www.google.com.hk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwiv9rjg7u_VAhUkxoMKHfoYDaYQFggvMAA&url=http%3A%2F%2Fjmeter.apache.org%2F&usg=AFQjCNHIHCOA-F9LnhaAn_STCWyPPgOpdw)(a powerful stress test tool) in our [Kubernetes](https://kubernetes.io/) cluster(a three nodes cluster, one master, two slaves).

## Test Plan

From the [last post](http://servicecomb.io/docs/autoscale-on-company/), we figured out the manager service demands the most of the resources. Hence, in this plan, we want to find out the maximum performance of our manager service and find out the bottleneck of our system according to the maximum performance. Our JMeter test plan is shown in fig-1.  

![fig-1 JMeter test plan]({{ site.url }}{{ site.baseurl }}/assets/images/company_test_plan.png){: .align-center}
fig-1 JMeter test plan
{: .figure-caption}

At the very first of our test plan, we set up some global configurations that shared among all thread groups. The *CSV Data Set Config* loads our target server information from a local csv file. The *HTTP Request Defaults* sets up the default host and port in every request. The *User Defined Variables* defines variable that shared globally. The *HTTP Header Manager*  adds headers define inside it to every request.

Then comes to the *setUp* thread group. It does the authentication job. The build-in way to authenticate in JMeter is the *HTTP Cookie Manager* as cookie is being used widely over web applications. However, our workshop demo uses the token based authentication instead of cookie based authentication. We need to take a detour to get authenticate done in JMeter.   The *Remove header pre processor* uses the following script to avoid unnecessary headers being injected into login requests.

```shell
import org.apache.jmeter.protocol.http.control.Header;
sampler.getHeaderManager().removeHeaderNamed("Authorization");
```

Then we retrieve login credential in the *Set up Login* request. The *authorization\_extractor* is a *Regular Expression Extractor* used to extract the value of *Authorization* header. As variables can not pass from one thread group to another, it need to convert to the global property and the script in *BeanShell PostProcessor* does the job.

```shell
${__setProperty(Authorization,${Authorization},)}
```

The last part of our test plan is the stress tests perform on our services.  We test three endpoints as they all pass from the manager service to the other two microservices, namely worker and beekeeper. Before we test, we disable the caching capability by enabling *StressTest* profile in manager so that the worker service and beekeeper service can serve the incoming computing task all the time.  Besides, we simplify the computing task by setting the request argument to be just 1. 

## Test Results

Before we test, we start the *company demo* in the Kubernetes cluster with no resource limit. The command we use in stress test is as follows:

```bash
jmeter -n -t workshop.jmx -j workshop.log -l workshop.jtl -Jthreads=100 -Jduration=600
```

We test for a duration of 600 seconds to get a more stable result.  The number of threads we test vary from 1, 5, 8, 10, 15, 20, 100, 200 as fig-2 shows. 

![fig-2 Performance among various concurrency]({{ site.url }}{{ site.baseurl }}/assets/images/company_concurrency_performance.png){: .align-center}
fig-2 Performance among various concurrency
{: .figure-caption}

fig-2 shows that performance of manager service were stable until it reached the bottleneck(at concurrency of 15), it speeds up to 1000 requests per seconds while keeping the average response time low. Later on, as the concurrency increased, the average response time increased dramatically. The response time statistics can be helpful when evaluating the circuit-break timeout settings. 

![fig-3 Average response time among different services]({{ site.url }}{{ site.baseurl }}/assets/images/company_response_time.png){: .align-center}
fig-3 Average response time among different services
{: .figure-caption}

fig-3 shows the average response time of different services. As the beekeeper service relies on the worker service, it had a longer response time than the worker service.

![fig-4 CPU Load on various concurrency]({{ site.url }}{{ site.baseurl }}/assets/images/company_cpu_load.png){: .align-center}
fig-4 CPU Load on various concurrency
{: .figure-caption}

To find out why the performance stuck at the concurrency of 15, we checked the monitor data from [heapster](https://github.com/kubernetes/heapster) as fig-4 shows. Apparently, manager service became the bottleneck of the whole system. It reached the maximum cpu load when the throughput was around 1000 req/s. Other services increased much slower than manager service and required less resources. 

The performance of manager service seems to be quite poor. As manager service logs directly to the stdout, which may become a burden when too many concurrent requests. Besides, the JMeter test client running on a single host may not simulate enough concurrency simultaneously. To verify these causes, we tested on different scenes of log settings(stdout, asynchronous, none) at the concurrency of 200. The *asynchronous* log settings in *log4j2.xml* file is as follows:
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Configuration status="INFO">
  <Appenders>
    <RandomAccessFile name="RandomAccessFile" fileName="manager.log" immediateFlush="false" append="false">
      <PatternLayout pattern="%d [%p] %m %l%n"/>
    </RandomAccessFile>
  </Appenders>
  <Loggers>
    <asyncRoot level="info">
      <AppenderRef ref="RandomAccessFile"/>
    </asyncRoot>
  </Loggers>
</Configuration>
```
Besides, we also need to add the *disruptor* dependency to enable the asynchronous log settings.
```xml
<dependency>
  <groupId>com.lmax</groupId>
  <artifactId>disruptor</artifactId>
  <version>3.3.6</version>
</dependency>
```
The *none* log settings just replace the *info* logging level to *off* in the above setting. We also tested on distributed JMeter test client environment. Running Jmeter in distributed mode takes two steps:
1. run JMeter slave on each test node, the command is as follows:
```bash
jmeter-server -Djava.rmi.server.hostname=$(ifconfig eth0 | grep "inet addr" | awk '{print $2}' | cut -d ":" -f2)
```
2. run JMeter master, the command is as follows:
```bash
jmeter -n -R host1,host2 -t workshop.jmx -j workshop.log -l workshop.jtl -Gmin=1 -Gmax=2 -Gthreads=200 -Gduration=600
```
*Note:* JMeter property does not work in distributed mode. It needs to be declared as a global property. That's why We use *-G* option  here instead of *-J* option.

The results are as follows:
![different log and different JMeter settings](/assets/images/company_log_and_jmeter.png){: .align-center}
From the above figure, the performance in JMeter distributed mode and single mode are so close, it seems that a single JMeter test client is able to simulate enough concurrency for the current test. Besides, the log takes up too many computing resources when directly output to stdout and the asynchronous way has improved nearly 100% performance of the original. Seems like using the synchronous log settings may not be wise in production environment.

![fig-5 memory usage of different log settings](/assets/images/company_different_log_memory_usage.png){: .align-center}
fig-5 memory usage of different log settings
{: .figure-caption}

Although the asynchronous way save us much computing resources, it takes up a great deal of memory in the meanwhile as fig-5 shows.

![fig-6 Memory Usage of different services]({{ site.url }}{{ site.baseurl }}/assets/images/company_memory_used.png){: .align-center}
fig-6 Memory Usage of different services
{: .figure-caption}

fig-6 shows the memory usage of different services during tests. As company demo is a simple use case, the memory usage remained quite stable during tests. Comparing to memory usage of the *bulletin board* service(written in go), other services written in Java take a great deal of memory. 

## Conclusions

Stress test on applications can help us find out the potential problems in our services before our services run in production environment. It simulates the production environment and validates whether our services meet the specification requirements. We can tune our pod deployment settings based on the stress test result to system's maximum throughput while keeping SLA.

Applications based on microservice architecture become much more flexible not only on design, programming and tests, but also on deployment. As it's a cloud-era now, applications on the cloud is charged on demand. Services based on microservice architecture make resources scale up and down extremely faster than the traditional Iaas architecture. We can choose different specifications of machine and different replicas for different services to meet our business requirements and save a great deal of fee.

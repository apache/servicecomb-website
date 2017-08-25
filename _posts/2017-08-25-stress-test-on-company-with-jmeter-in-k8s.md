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

# 
## Background

Stress test is an effective way to evaluate the performance of web applications. Besides, more and more web applications are decomposed into several microservices and performance of each microservice may vary,  stress test on web application based on microservice architecture plays a more important role. This blog will evaluate the performance of our [company demo](https://github.com/ServiceComb/ServiceComb-Company-WorkShop) using [JMeter 3.2](https://www.google.com.hk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwiv9rjg7u_VAhUkxoMKHfoYDaYQFggvMAA&url=http%3A%2F%2Fjmeter.apache.org%2F&usg=AFQjCNHIHCOA-F9LnhaAn_STCWyPPgOpdw)(a powerful stress test tool) in our [Kubernetes](https://kubernetes.io/) cluster(a three nodes cluster, one master, two slaves).

## Test Plan

Our JMeter test plan is shown in fig-1.  In this plan, we want to find out the maximum performance of our manager service.

![fig-1 JMeter test plan]({{ site.url }}{{ site.baseurl }}/assets/images/company_test_plan.png){: .align-center}

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

fig-2 shows that performance kept increasing until it reached the bottleneck(at concurrency of 15). Later on, its throughput remained nearly the same(about 1000 requests per second). Besides, as the concurrency increased, the average response time increased too. The response time statistics can be helpful when evaluating the circuit-break timeout settings. 

![fig-3 Average response time among different services]({{ site.url }}{{ site.baseurl }}/assets/images/company_response_time.png){: .align-center}

fig-3 shows the average response time of different services. As the beekeeper service relies on the worker service, it had a longer response time than the worker service.

![fig-4 CPU Load on various concurrency]({{ site.url }}{{ site.baseurl }}/assets/images/company_cpu_load.png){: .align-center}


To find out why the performance stuck at the concurrency of 15, we checked the monitor data from [heapster](https://github.com/kubernetes/heapster) as fig-4 shows. Apparently, although we set no resource limit to the pod in Kubernetes, it still constraints from the node(2000 milli-cores per pod max, the node has 4000 milli-cores in total). Manager service became the bottleneck of the whole system. It reached the maximum cpu load when the throughput was around 1000 req/s. Other services increased much slower than manager service and required less resources. 

![fig-5]({{ site.url }}{{ site.baseurl }}/assets/images/company_memory_used.png){: .align-center}

fig-5 shows the memory usage of different services during tests. As company demo is a simple use case, the memory usage remained quite stable during tests. Comparing to memory usage of the *bulletin board* service(written in go), other services written in Java take a great deal of memory. 

## Conclusions

Stress test on applications can help us find out the potential problems in our services before our services run in production environment. It simulates the production environment and validates whether our services meet the specification requirements. We can tune our pod deployment settings based on the stress test result to the maximum performance while keeping SLA.

Applications based on microservice architecture become much more flexible not only on design, programming and tests, but also on deployment. As it's a cloud-era now, applications on the cloud is charged on demand. We can choose different specifications of machine and different replicas for different services to meet our business requirements and save a great deal of fee.

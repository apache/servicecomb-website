---
title: "在Kubernetes集群中使用JMeter对Company示例进行压力测试"
lang: cn
ref: stress-test-on-company-with-jmeter-in-k8s
permalink: /cn/docs/stress-test-on-company-with-jmeter-in-k8s/
excerpt: "介绍如何在Kubernetes集群上使用JMeter进行压力测试"
last_modified_at: 2017-08-26T09:18:43+08:00
author: Eric Lee
redirect_from:
  - /theme-setup/
---

## 背景

　　压力测试是评估网络应用性能的一种有效手段。此外，越来越多的网络应用被拆分为多个微服务而每个微服务的性能不一。因此，压力测试在基于微服务架构的网络应用中扮演着越来越重要的角色。本文将在我们搭建的一个[Kubernetes](https://kubernetes.io/)集群（共三个节点组成，其中一个主节点，两个从节点）中借助[JMeter 3.2](https://www.google.com.hk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwiv9rjg7u_VAhUkxoMKHfoYDaYQFggvMAA&url=http%3A%2F%2Fjmeter.apache.org%2F&usg=AFQjCNHIHCOA-F9LnhaAn_STCWyPPgOpdw)来对[Company示例](https://github.com/ServiceComb/ServiceComb-Company-WorkShop)进行性能评估。

## 测试计划

　　我们使用的测试计划如图1所示。在这个计划中，我们想要找出经理服务的最大性能点。

![图1 测试计划]({{ site.url }}{{ site.baseurl }}/assets/images/company_test_plan.png)  
图1 测试计划  

　　在我们测试计划的开始，我们设置了一些在所有线程组都能共享的全局配置。其中，*CSV Data Set Config*组件从本地csv文件中加载测试服务器的信息。*HTTP Request Defaults*组件则为每个请求预设了默认的请求服务器信息，如IP和端口。*User Defined Variables*组件定义了全局共享的变量。*HTTP Header Manager*组件自动为每个请求添加HTTP的请求头部。

　　然后就是介绍*setUp*线程组了。其作用主要是处理用户认证。由于Cookie在网络应用中得到较广泛的应用，因此JMeter中内置的认证方式是通过*HTTP Cookie Manager*组件来完成的。然而，我们的Company示例采用的是基于Token的认证方式而不是基于Cookie的认证方式。因此，这给我们在JMeter中处理认证添加了一点难度。*Remove header pre processor*组件使用了以下的脚本来去掉登录时请求中带有默认的请求头部，即登录请求时并不需要带有鉴权的请求头部。
```shell
import org.apache.jmeter.protocol.http.control.Header;
sampler.getHeaderManager().removeHeaderNamed("Authorization");
```
　　然后我们通过*Set up Login*组件发起一次登录请求来获取用户登录鉴权信息。之后再通过正则表达式提取组件*authorization\_extractor*来提取响应头部中的*Authorization*对应的值。由于变量无法在不同的线程组中共享和传递，这时候*BeanShell PostProcessor*组件就派上用场了，它主要工作就是将当前线程组中的目标变量转换为全局属性。
```shell
${__setProperty(Authorization,${Authorization},)}
```
　　在测试计划的最后部分就是我们要在Company示例上进行的压力测试。测试所选取的三个接口都是通过经理服务路由至其他两个服务的，即技工服务和养蜂人服务。在我们测试开始之前，我们通过打开*StressTest*的开关来禁用经理服务提供的缓存能力，从而使得技工服务和养蜂人服务能够处理到用户请求的计算任务。此外，我们通过将请求参数设置为1来简化技工服务和养蜂人服务的计算任务。

## 测试结果及分析
　　在我们测试开始之前， 我们现在Kubernetes集群上以无资源限制的方式来运行*Company示例*。我们用来进行压力测试的指令如下：
```bash
jmeter -n -t workshop.jmx -j workshop.log -l workshop.jtl -Jthreads=100 -Jduration=600
```
　　其中，通过设置测试时长为600秒来获取稳定的结果。测试的线程数包括1，5，8，10，15，20，100，200，如图2所示。
![图2 并发不同时的性能比较]({{ site.url }}{{ site.baseurl }}/assets/images/company_concurrency_performance.png){: .align-center}
图2 并发不同时的性能比较  
　　从图2可以看出，经理服务的性能在到达瓶颈（15并发度）前一直处于上升状态。 此后，其吞吐量基本保持一样（大约1000请求每秒）。此外，随着并发度的增加，平均响应时间也在增加。响应时间的统计数据在评估熔断超时设置时能起到一个很好的参考价值。
![图3 不同服务的平均响应时间]({{ site.url }}{{ site.baseurl }}/assets/images/company_response_time.png){: .align-center}
图3 不同服务的平均响应时间  
　　图3显示了不同服务的平均响应时间。由于养蜂人服务需要调用技工服务，因此其响应时间相对于技工服务的响应时间要稍微久一点。
![图4 不同并发度下CPU的负载]({{ site.url }}{{ site.baseurl }}/assets/images/company_cpu_load.png){: .align-center}
图4 不同并发度下CPU的负载  
　　为了找出性能卡在了15并发度时的原因，我们回看了[heapster](https://github.com/kubernetes/heapster)上的监控数据。如图4所示，尽管我们没有限制Kubernetes集群中Pod的资源，但它还是受到了节点上的资源的限制（每个Pod最多使用2000 milli-cores，而每个节点一共只有4000 milli-cores资源）。由此可见，经理服务是当前系统的瓶颈所在。它在吞吐量为1000 req/s时达到了最大的CPU负载。 相对而言，其它服务对资源的需求的增长速度要慢得多。
![图5 测试过程的内存使用量]({{ site.url }}{{ site.baseurl }}/assets/images/company_memory_used.png){: .align-center}
图5 测试过程的内存使用量  
　　图5显示了在测试过程中不同服务的内存使用量。由于Company示例只是一个简单的用例，在测试过程中各个服务的内存使用率都相对稳定。然而，相对*告示栏*服务（使用go语言编写）的内存使用量而言，其它以Java来编写的服务则占用了较多的内存。

## 总结

　　对应用进行压力测试往往能在应用投入生产环境前帮助我们找出服务中潜在的问题。此外，压力测试也能模拟生产环境，从而来验证服务是否已达到规定的指标性能。而根据压力测试的结果，我们可以权衡Pod部署时的设置来保证SLA的同时获得最大的性能。

　　基于微服务架构的应用不仅在设计、编码及测试方面变得更加灵活，同时也使得部署更加方便和灵活。如今也已迈入云的时代，部署在云上的应用都采取了按需收费的策略。因此，我们可以不同规格的集群和针对服务的需求和压力设置不同的备份数来成就商业成功的同时也节省了一大笔的费用。此外，在云上也能借助其弹性伸缩能力使得服务能够满足突发访问的场景。

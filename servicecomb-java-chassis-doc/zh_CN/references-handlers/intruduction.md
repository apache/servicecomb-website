处理链(Handlers)是ServiceComb的核心组成部分，它们构成服务运行管控的基础。ServiceComb通过处理链来处理负载均衡、熔断容错、流量控制等。

## 开发处理链
开发者自定义处理链包含如下几个步骤。由于ServiceComb的核心组成就是处理链，开发者可以参考handlers目录的实现详细了解处理链。下面简单总结下几个关键步骤：

* 实现Handler接口
* 增加*.handler.xml文件，给Handler取一个名字
* 在microservice.yaml中启用新增加的处理链

---
title: "部署模式"
lang: cn
ref: deploy-mode
permalink: /cn/users/deploy-mode/
excerpt: "部署模式"
last_modified_at: 2018-05-25T10:01:43-04:00
---

{% include toc %}
Java Chassis作为一个微服务框架，支持多样化的部署模式。

## 物理机或虚拟机部署
这种方式直接部署在物理机或虚拟机操作系统上，Chassis微服务以Java进程的方式启动：

![SimpleDeployment](/assets/images/SimpleDeployment.png)

请保证网络在同一个局域网内，或能互通。

### 如何打包微服务
在微服务项目的`pom.xml`中添加以下依赖：

```xml
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>2.6</version>
        <configuration>
          <archive>
            <manifest>
              <addClasspath>true</addClasspath>
              <classpathPrefix>lib/</classpathPrefix>
              <!--change to your main class-->
              <mainClass>${your-package}.Application</mainClass>
            </manifest>
            <manifestEntries>
              <Class-Path>. </Class-Path>
            </manifestEntries>
          </archive>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-dependency-plugin</artifactId>
        <executions>
          <execution>
            <id>copy-dependencies</id>
            <phase>package</phase>
            <goals>
              <goal>copy-dependencies</goal>
            </goals>
            <configuration>
              <outputDirectory>target/lib</outputDirectory>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
```

之后运行：

```bash
mvn package
```

在`target`目录下拷贝生成的微服务jar包和`lib`（依赖jar）至任何目录，运行即可：

```bash
java -jar ${project.artifactId}-${project.version}.jar
```

>提示：
>1. 如果需要更改`microservice.yaml`中的配置项又不希望重新打包，可以直接编写一个新的`microservice.yaml`，然后放置于微服务jar包同级别目录，重启微服务即可；
>2. 请修改上面打包依赖配置中`<mainClass>${your-package}.Application</mainClass>`为微服务启动MainClass。

## Docker容器化部署
这种方式适合部署测试环境，当微服务数据量比较多的情况下能够大幅减少部署的工作量，一键拉起所有的微服务：

![DockerDeployment](/assets/images/DockerDeployment.png)

### 如何直接打包微服务为Docker镜像
我们使用io.fabric8的[maven插件](https://github.com/fabric8io/docker-maven-plugin)从打包，镜像在微服务项目的`pom.xml`中添加以下依赖：

```xml
  <build>
    <pluginManagement>
      <plugins>
        <plugin>
          <groupId>io.fabric8</groupId>
          <artifactId>docker-maven-plugin</artifactId>
          <configuration>
            <images>
              <image>
                <name>${project.artifactId}:${project.version}</name>
                <alias>${project.artifactId}</alias>
                <build>
                  <from>openjdk:8-jdk-stretch</from>
                  <ports>
                    <port>8080</port>
                  </ports>
                  <volumes>
                    <volume>/docker</volume>
                  </volumes>
                  <assembly>
                    <mode>dir</mode>
                    <basedir>/</basedir>
                    <descriptor>assembly.xml</descriptor>
                  </assembly>
                  <entryPoint>
                    <shell>java $JAVA_OPTS -jar /docker/${project.artifactId}-${project.version}.jar</shell>
                  </entryPoint>
                </build>
              </image>
            </images>
          </configuration>
          <executions>
            <execution>
              <id>build</id>
              <phase>package</phase>
              <goals>
                <goal>build</goal>
              </goals>
            </execution>
          </executions>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>

  <profiles>
    <profile>
      <id>docker</id>
      <build>
        <plugins>
          <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-jar-plugin</artifactId>
            <version>2.6</version>
            <configuration>
              <archive>
                <manifest>
                  <addClasspath>true</addClasspath>
                  <classpathPrefix>lib/</classpathPrefix>
                  <!--change to your main class-->
                  <mainClass>${your-package}.Application</mainClass>
                </manifest>
                <manifestEntries>
                  <Class-Path>.</Class-Path>
                </manifestEntries>
              </archive>
            </configuration>
          </plugin>
          <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-dependency-plugin</artifactId>
            <executions>
              <execution>
                <id>copy-dependencies</id>
                <phase>package</phase>
                <goals>
                  <goal>copy-dependencies</goal>
                </goals>
                <configuration>
                  <outputDirectory>target/lib</outputDirectory>
                </configuration>
              </execution>
            </executions>
          </plugin>
          <plugin>
            <groupId>io.fabric8</groupId>
            <artifactId>docker-maven-plugin</artifactId>
          </plugin>
        </plugins>
      </build>
    </profile>
  </profiles>
```

在项目源代码`src\main`下，创建一个`docker`目录，之后在此目录中创建一个`assembly.xml`文件，填入下面的内容：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<assembly>
  <id>installer</id>
  <fileSets>
    <fileSet>
      <directory>${project.build.directory}/lib</directory>
      <outputDirectory>/docker/lib</outputDirectory>
      <fileMode>0644</fileMode>
      <directoryMode>0755</directoryMode>
    </fileSet>
  </fileSets>
  <files>
    <file>
      <source>${project.build.directory}/${project.artifactId}-${project.version}.jar</source>
      <outputDirectory>/docker</outputDirectory>
      <destName>${project.artifactId}-${project.version}.jar</destName>
    </file>
  </files>
</assembly>
```

完成之后的项目效果：

![DockerPackageAssembly](/assets/images/DockerPackageAssembly.png)

运行：

```bash
mvn package -Pdocker
```

等待打包完成，会有提示镜像生成成功并注册到本地镜像库的提示。

>提示：
>1. 请修改上面打包依赖配置中`<mainClass>${your-package}.Application</mainClass>`为微服务启动MainClass；
>2. 为了保留普通打包方式，docker打包方式配置为maven profile，即``-Pdocker`；
>3. 如果是使用windows系统，请安装docker machine，并且确保docker machine vm启动中；
>4. 打包的镜像会默认安装在本地镜像库中，如果需要上传外部镜像库例如中央库，可以使用下面的命令：
>```bash
>mvn -Ddocker.registry=registry.hub.docker.com/${username} -Ddocker.username=${username} -Ddocker.password=${password} docker:push
>```

### 使用Docker Compose编排并拉起所有的微服务
将所有的微服务打包为镜像后，就可以使用Docker Compose组织它们，我们给一个例子：
```yaml
version: '2.0'

services:
  service-center:
    image: "servicecomb/service-center"
    hostname: service-center
    ports:
      - "30100:30100"

  mysql-write-db:
    image: "mysql:latest"
    hostname: write_db_server
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=seckill
      - MYSQL_USER=seckill
      - MYSQL_PASSWORD=password
    ports:
      - "3306"

  activemq:
    image: "webcenter/activemq:latest"
    hostname: queue-server
    ports:
      - "61616"

  admin-service:
    image: "seckill-admin-service:0.2.0-SNAPSHOT"
    hostname: admin-service
    links:
      - "mysql-write-db:write_db.servicecomb.io"
    environment:
      - JAVA_OPTS=-Dspring.profiles.active=prd,cse -Dendpoints.shutdown.enabled=true
    ports:
      - "8081:8081"
```

为了能够使containers互联互通，使用`links`指定链接关系，`ports`用于映射到Docker Host的端口，关于Docker Compose Yaml配置的更多信息，可以参见[这篇文档](https://docs.docker.com/compose/)。

编写好docker-compose.yml后，切换到此文件目录，执行：

```bash
docker-compose up
```

即可将所有的微服务都拉起来。

>提示：
>1. docker-compose默认寻找当前文件夹下的docker-compose.yml文件作为编排配置文件，如果需要指定文件名或路径，请使用`docker-compose -f ${fullFileName}`；
>2. 如果container无需对外发布端口则可以不设置`ports`。

## Kubernetes集群部署
Kubernetes是谷歌开源的容器集群管理系统，目前已经具备生产化成熟度，虽然Java Chassis作为一个微服务框架与Kubernetes处于不同层次，但由于Kubernetes同样拥有注册-发现、弹性伸缩、监控等方面的功能，因此很容易与Java Chassis中相关功能搞混，我们需要比较深入的理解两者的差异。

### Kubernetes

![K8S](/assets/images/K8S.png)

上图中，我们省去了网络细节，关注这几个点：
1. Service的注册和发现：应用（app）实例（container）的启动或停止由Kubernetes管理，Kubernetes会依据Node的负载状况动态调配Host它们的Pod，那么这就带来一个问题：一个App想调用另外一个App，是如何知道目标App实例的IP和端口呢？因此Kubernetes引入了一个逻辑层次——Service，Service有唯一的名字，Kubernetes会将Service的所有App实例在Pod上的IP和端口保存在Name Service中，如果App之间的调用通过Service名，就可以通过Service名映射app实例的IP和端口，这个过程类似DNS。Kubernetes启动App实例并向Name Service登记的这个过程就是Service的注册，而一个App调用另外一个App从Name Service查询目标IP和端口的过程就是Service的发现；
2. 弹性伸缩：弹性伸缩是Kubernetes的一个重要能力，通过配置弹性伸缩策略，支持使用CPU、内存使用率、连接数，或其他第三方的Metrics作为输入，如何设置请参考[这篇文档](https://k8smeetup.github.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)；
3. 负载均衡：有了Service注册和发现机制，Kubernetes以Service Name为中心构建负载均衡，Service有三种类型`NodePort`，`ClusterIP`和`LoadBalancer`，后两种具有负载均衡能力，`LoadBalancer`需要PaaS平台实现，因此对于本地Kubernetes集群多用`ClusterIP`；
4. 监控：Kubernetes自带Heapster监控资源的使用。

### Java Chassis

![ServiceCombBasic](/assets/images/ServiceCombBasic.png)

上图是Java Chassis基本原理，我们同样解释几个点：
1. Java Chassis的注册和发现：ServiceCenter是一个完整独立的注册中心，不同于Kubernetes的Name Service，它存储了微服务启动后上传的Swagger契约，契约中描述了调用路径、入参和出参，即对接口进行了全面的描述。其它微服务发起调用的时候，可以通过获取Producer的契约动态生成Consumer代码，也可以做调用预检查等；
2. 弹性伸缩：Java Chassis作为一个SDK本身是无法启动微服务实例和调配资源的，因此没有此能力。
3. 负载均衡：Java Chassis是Consumer端软负载均衡；当一个Java Chassis微服务启动后，会将获取的本地IP和设置的发布端口发布至ServiceCenter，ServiceCenter会立刻通知所有的其他微服务实例信息发生了变化，更新本地缓存，调整负载分配；
4. 监控：Java Chassis并不带监控系统，它只可以输出Tracing、Metrics和Log数据，对接Zipkin、Prometheus等监控系统，当然Metrics也可以作为Kubernetes弹性伸缩策略的输入。

综合上述，我们总结为下面的表格：

| 说明项 | Kubernetes       | Java Chassis                       |
| :----------- | :--------------- | :------------------- |
| 定位 | 容器集群管理系统    | 微服务框架 |
| 层次 | PaaS    | SDK |
| Service的含义 | 逻辑概念，用selector指向containers | 业务概念，微服务拆分后的业务 |
| 注册和发现  | NameService为中心 | ServiceCenter为中心 |
| 弹性伸缩   | 调度资源启动或停止实例 | 无此能力 |
| 负载均衡   | name + selector机制 | Consumer端动态发现实例的变化 |
| 监控 | 有集成的监控系统    | 只作为监控系统的数据源 |

### Kubernetes + Java Chassis
理解了上面的内容之后，我们可以如下设计 Java Chassis在Kubernetes集群中的部署：

![ServiceCombInK8S](/assets/images/ServiceCombInK8S.png)

- 将微服务的镜像上传至Kubernetes能够访问到的镜像仓库；
- 为每一个 Java Chassis微服务配置为一个Kubernetes Deployment并配置弹性伸缩策略；
- ServerCenter如果作为一个Kubernetes Deployment部署，那么保证IP固定使得VPC内均可访问，也可以将ServiceCenter部署在外部，然后使用Kubernetes外部域名解析机制能够访问到它；
- 使用Fannel网络让Pod的IP能够互联互通， Java Chassis启动后会使用Pod的IP发布，保证能相互调用；否则配置使用`servicecomb.service.publishAddress`指定发布地址；
- 对于需要外部访问的 Java Chassis微服务，配置Kubernetes Service。

>提示：
>1. 请牢记 Java Chassis的负载均衡机制与Kubernetes的负载均衡机制无关，即Java Chassis的负载均衡并不走name + selector机制，也不需要配置Service；
>2. 上述部署细节可依据实际环境（例如网络）自行调整。 

### 在Kubernetes集群中部署Java Chassis Company演示项目
Company是我们提供的一个有趣味性的演示项目：
1. 源代码地址：https://github.com/huaweicse/ServiceComb-Company-WorkShop
2. 项目的详细讲解：http://servicecomb.apache.org/cn/docs/linuxcon-workshop-demo/

如何在Kubernetes集群中部署Company：http://servicecomb.apache.org/cn/docs/company-on-kubernetes/
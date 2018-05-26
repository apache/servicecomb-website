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

之后运行`mvn package`，在`target`目录下拷贝生成的微服务jar包和`lib`（依赖jar）至任何目录，运行即可：

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
我们使用io.fabric8的maven插件从打包，镜像在微服务项目的`pom.xml`中添加以下依赖：

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

运行`mvn package -Pdocker`，等待打包完成。

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


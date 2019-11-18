---
title: "Syncer 快速入门"
lang: cn
ref: install
permalink: /cn/docs/syncer/quick-start/
excerpt: "了解如何使用异构、多服务中心通讯工具"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## 异构、多服务中心通讯 Syncer
Syncer是一个多服务中心的同步工具，专为大型微服务架构设计，用于在网络互通的情况下，不同技术栈服务中心、跨区域的实例同步，未来将对跨网络、跨云等场景提供支持。

## 快速入门 
1. 获取并启动服务中心

以Service-center为例，详细参见：[ServiceCenter 环境安装](/cn/docs/service-center/install/)  

2. 下载并解压[ServiceCenter发布包（>=1.3.0）](/cn/release/service-center-downloads/)  
```bash
# 解压tar包
$ tar -zxvf  apache-servicecomb-service-center-1.3.0-linux-amd64.tar.gz
$ cd apache-servicecomb-service-center-1.3.0-linux-amd64/
```

3. 启动ServiceCenter Syncer
### 命令行参数说明:
- node:         syncer名称,集群内成员名必须唯一。
- sc-addr:      服务注册中心地址。支持集群模式，多个地址间使用英文半角","隔开。    
- bind-addr:    Gossip协议通讯地址，用于Syncer间的消息传递、集群管理   
- rpc-addr:     RPC数据传输地址，用于Syncer间的数据同步  
- join-addr:    指向目标Syncer的BindAddr，当前Syncer将通过该地址加入网络   
- mode:         运行模式配置，当前支持两种模式，单实例模式“single”和集群模式“cluster”, cluster模式下每个syncer拥有三个实例
- cluster-name: 当mode为”cluster“时，Syncer集群的名字
- cluster-port: 当mode为“cluster”时，Syncer三个实例之间一致性协商的端口


假设有2个服务中心，每个服务中心都有一个用于微服务发现和注册的服务中心集群，如下所示：   

|     Service center     | Local address |
| :--------------------: | :-----------: |
| http://10.0.0.10:30100 |   10.0.0.10   |
| http://10.0.0.11:30100 |   10.0.0.11   |

### 单例模式（Single Mode）

分别在两个机器上启动两个syncer来完成这两个服务中心之间的微服务数据同步

- 在10.0.0.10的机器上执行以下命令启动Syncer

```bash
$ ./syncer daemon --sc-addr http://10.0.0.10:30100 --bind-addr 10.0.0.10:30190 --rpc-addr 10.0.0.10:30191
```

- 在10.0.0.11的机器上执行以下命令启动Syncer，并加入10.0.0.10的gossip池

```bash
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30190 --rpc-addr 10.0.0.11:30191 --join-addr 10.0.0.10:30191
```

### 集群模式（Cluster Mode）

分别在两个机器上启动两个syncer集群来完成这两个服务中心之间的微服务数据同步

- 在10.0.0.10的机器上启动syncer集群

```bash
$ ./syncer daemon --sc-addr http://10.0.0.10:30100 --bind-addr 10.0.0.10:30190 --rpc-addr 10.0.0.10:30191 --mode cluster --node syncer011 --cluster-port 30201 --join-addr 10.0.0.10:30190
$ ./syncer daemon --sc-addr http://10.0.0.10:30100 --bind-addr 10.0.0.10:30290 --rpc-addr 10.0.0.10:30291 --mode cluster --node syncer012 --cluster-port 30202 --join-addr 10.0.0.10:30190
$ ./syncer daemon --sc-addr http://10.0.0.10:30100 --bind-addr 10.0.0.10:30390 --rpc-addr 10.0.0.10:30391 --mode cluster --node syncer013 --cluster-port 30203 --join-addr 10.0.0.10:30190
```

- 在10.0.0.11机器上启动syncer集群

```bash
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30190 --rpc-addr 10.0.0.11:30191 --mode cluster --node syncer021 --cluster-port 30201 --join-addr 10.0.0.10:30190
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30290 --rpc-addr 10.0.0.11:30291 --mode cluster --node syncer022 --cluster-port 30202 --join-addr 10.0.0.10:30190
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30390 --rpc-addr 10.0.0.11:30391 --mode cluster --node syncer023 --cluster-port 30203 --join-addr 10.0.0.10:30190
```

### 结果验证  
将微服务实例注册到其中一个ServiceCener后30秒，可以从每个ServiceCenter获取有关该实例的信息。

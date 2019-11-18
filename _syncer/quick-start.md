---
title: "Syncer Quick Start"
lang: en
ref: install
permalink: /docs/syncer/quick-start/
excerpt: "Learn how to use differ-structure, multi-service center synchronization tool"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## Differ-structure, multi-service center synchronization tool
Syncer is a multiple servicecenters synchronization tool designed for large microservice architectures,supporting differ-structure servicecenters.  

## Quick Start
1 Getting & Running Service center

Take Service-center as an example, reference to [Install ServiceCenter](/docs/service-center/install/)  

2. Download and decompression [ServiceCenter发布包（>=1.3.0）](/release/service-center-downloads/)  
```bash
# 解压tar包
$ tar -zxvf  apache-servicecomb-service-center-1.3.0-linux-amd64.tar.gz
$ cd apache-servicecomb-service-center-1.3.0-linux-amd64/
```

##### 3.3 Running ServiceCenter Syncer
###### Parameter Description  
- node

  The member name of syncer, that must be unique in the cluster
  
- sc-addr 

  Service center address, which is the service registry address. Cluster mode is supported, and multiple addresses are separated by commas.   
  
- bind-addr

  P2P address of Syncer for communication with other Syner members in P2P networks by Gossip.   
  
- rpc-addr

  Address of Syncer for data transmission, used to synchronize microservices data  between Syncers.  
  
- join-addr

  The bind-addr of target syncer, one of other syncer members, the current Syncer will join the network by this.  
   
- mode

  Runtime mode of Syncer, specify 'cluster' for cluster mode which enables each Syncer to have three instance, default to 'single' mode.
  
- cluster-name

  Name of the Syncer cluster when mode is set to be 'cluster'.
  
- cluster-port

  The port that the Syner cluster members communicate with when mode is set to be "cluster".

Suppose there are 2 Service centers, each of them with a Service-center cluster for microservices discovery and registry, as following,   

|     Servicecenter      | Local address |
| :--------------------: | :-----------: |
| http://10.0.0.10:30100 |   10.0.0.10   |
| http://10.0.0.11:30100 |   10.0.0.11   |

#### Single Mode

Start Service-center Syncer to enable communication between 2 service centers

- Start Sycner  on host 10.0.0.10 

```bash
$ ./syncer daemon --sc-addr http://10.0.0.10:30100 --bind-addr 10.0.0.10:30190 --rpc-addr 10.0.0.10:30191
```

- Start Syncer on host 10.0.0.11 and join into 10.0.0.10 gossip pool

```bash
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30190 --rpc-addr 10.0.0.11:30191 --join-addr 10.0.0.10:30191
```

#### Cluster Mode

Start 2 Syncer clusters on there host to synchronize microservice data between the 2 service centers

- Start Syncer cluster on host 10.0.0.10

```bash
$ ./syncer daemon --sc-addr http://10.0.0.10:30100 --bind-addr 10.0.0.10:30190 --rpc-addr 10.0.0.10:30191 --mode cluster --node syncer011 --cluster-port 30201 --join-addr 10.0.0.10:30190
$ ./syncer daemon --sc-addr http://10.0.0.10:30100 --bind-addr 10.0.0.10:30290 --rpc-addr 10.0.0.10:30291 --mode cluster --node syncer012 --cluster-port 30202 --join-addr 10.0.0.10:30190
$ ./syncer daemon --sc-addr http://10.0.0.10:30100 --bind-addr 10.0.0.10:30390 --rpc-addr 10.0.0.10:30391 --mode cluster --node syncer013 --cluster-port 30203 --join-addr 10.0.0.10:30190
```

- Start Syncer cluster on host 10.0.0.11

```bash
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30190 --rpc-addr 10.0.0.11:30191 --mode cluster --node syncer021 --cluster-port 30201 --join-addr 10.0.0.10:30190
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30290 --rpc-addr 10.0.0.11:30291 --mode cluster --node syncer022 --cluster-port 30202 --join-addr 10.0.0.10:30190
$ ./syncer daemon --sc-addr http://10.0.0.11:30100 --bind-addr 10.0.0.11:30390 --rpc-addr 10.0.0.11:30391 --mode cluster --node syncer023 --cluster-port 30203 --join-addr 10.0.0.10:30190
```

**Verification**  
30 seconds after registering a microservice to one of the Service-centers,  the information about it can be get from the other one.


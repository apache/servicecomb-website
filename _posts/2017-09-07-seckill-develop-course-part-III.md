---
title: "SecKill Develop Journey (III)"
lang: en
ref: seckill-development-journey-part-III
permalink: /docs/seckill-development-journey-part-III/
excerpt: "an introduction how build seckill demo project step by step"
last_modified_at: 2017-09-13T09:00:00+08:00
author: Yangyong Zheng
tags: [seckill]
redirect_from:
  - /theme-setup/
---

  [Previous article]({{ site.url }}{{ site.baseurl }}/docs/seckill-development-journey-part-II/) we had built a full-featured seckill demo, release it version 0.1.0-RELEASE; now you should find that data persistence is centered on a single database, seckill is high-stress scenario, it's difficult to meet high-scalable requirement, and as we mentioned at the beginning, micro-service is recommended to have independent storage, so we will start using Event Sourcing implement CQRS pattern to enhance the ability to endure huge requests.

## CQRS
  CQRS means Command Query Responsibility Segregation, it's a powerful design pattern, often implement with Event Sourcing, there has a figure describe it from Microsoft MSDN:

![Fig-1 CQRS](/assets/images/seckill-develop-course-part-III-cqrs.png){: .align-center}

## Improvement Design
  CQRS is read write separation and message-driven best practices, now we focus on the MySQL database:  
1. The database should be split into ReadDB and WriteDB,read-intensive Query micro-service and write-intensive Command micro-service should be independent;
2. ReadDB and WriteDB using Event Message drive data synchronization, so we need add a new micro-service named Event(Processor);  
3. Message Broker currently has a lot of great implements, such as RabbitMQ, Kafka, etc., because our seckill based on ServiceComb and Spring Boot, in order to be able to quickly build this new feature, we use built-in ActiveMQ, which supports memory queue mode, very easy to build Testing, suitable for agile development approach

  Now the latest Architecture below:

![Fig-2 CQRS improved Architecture](/assets/images/seckill-develop-course-part-III-arch-en.png){: .align-center}

## Improvement Implement
### Database Separation
#### WriteDB
  Admin micro-service maintain Promotion entity;

  Command micro-service write PromotionEvent Value-Object,when recovery Promotion,Relapy PromotionEvent.
#### ReadDB
  Event micro-service write ActivePromotion Value-Object and Coupon Value-Object;

  Query micro-service query ActivePromotion Value-Object and Coupon Value-Object.

#### Command micro-service Message Publisher component
  Since the Event Sourcing was not introduced before, the PromotionEvent entity only needed to write to the database directly. Now it is necessary to publish PromotionEvent to Message Broker. Considering that future we will be replaced by Distributed Message Service (DMS) as Message Broker in order to deploy to [Huawei Cloud](http://www.hwclouds.com/), We defined the generic message publish interface:
```java
public interface SecKillMessagePublisher {
  void publishMessage(String messageContent);
}
```

#### Event micro-service implement
  Event micro-service subscribe Message Broker in order to get PromotionEvent Message, then depending on the message type convert to ActivePromotion Value-Object operation or Coupon Value-Object operation in ReadDB.   
* Promotion Start Message: create ActivePromotion Value-Object;   
* Promotion Finish Message: delete ActivePromotion Value-Object var Id;  
* Coupon Grabbed Message: create Coupon Value-Object;

  Also considering that future we will be replaced by Distributed Message Service (DMS) as Message Broker in order to deploy to [Huawei Cloud](http://www.hwclouds.com/), We defined the generic message subscribe interface:
```java
public interface SecKillMessageSubscriber {
  void subscribeMessage(String messageContent);
}
```

#### Update of Query micro-service
  After the refactoring of the read and write separation, all activing Promotion are saved in ActivePromotion Value-Object Table, and customers own Coupon are stored in Coupon Value-Object Table, now we can directly query them, no longer need Replay PromotionEvent.

## All-In-One start-up
  Now, we have complete Event Sourcing architecture refactoring, in order to be easy to start-up, we provide docker compose script, use it pull all services up by one command, see detail at [SecKill](https://github.com/ServiceComb/seckill).

### start-up all service in Docker ToolBox

![Fig-3 SecKill All-in-One](/assets/images/seckill-develop-course-part-III-seckill-all-in-one.png){: .align-center}

## Reference
1. [Command and Query Responsibility Segregation (CQRS) pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs) by Microsoft Azure Team  
2. [Introducing Event Sourcing](https://msdn.microsoft.com/en-us/library/jj591559.aspx) by Microsoft patterns & practices Developer Center  
3. [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) by Martin Fowler

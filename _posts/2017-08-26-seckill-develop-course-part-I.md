---
title: "SecKill Development Journey (I)"
lang: en
ref: seckill-development-journey-part-I
permalink: /docs/seckill-development-journey-part-I/
excerpt: "an introduction of how to build seckill demo project step by step"
last_modified_at: 2017-09-13T09:00:00+08:00
author: Yangyong Zheng
redirect_from:
  - /theme-setup/
---

## Overview
  SecKill is a demo project that our ServiceComb team try to build a micro-service architecture from the perspective of domain-driven design ([DDD](https://en.wikipedia.org/wiki/Domain-driven_design)).

## Background

  SecKill idea comments from the Internet popular promotions, using coupons to obtain some discounts; because the number of coupons is limited, so we must provide a platform for everyone who wants to get it fair competition.

  As a demo project, so we don't want make the SecKill too complicated; we just use the most primitive strategy - first come first get. It is quite simple if you want to implements other strategies by yourself.

## First Design
   Now let's analyze requirement in customer bounded context:  
1. Customer try to grab a coupon, SecKill return the coupon according to the coupon in inventory;
2. Customer cannot get the coupon anymore if he already send the request to the system.
3. Customer can query how many coupons he owned.  

  Let's go! what? you say this description is to simple? because they are no registration system, and promotion is how come, how to start? which coupon the customer request for? Is the discount all same? etc.

  Actually, we are accustomed to thinking a lot at the beginning, so some larger system, the design stage may be a few months, but this time you can't consider too much, because we believe:

1. Over-design can't guarantee fully meeting the demand after construction completed, the only constant is the demand is always changing, so don't over-design;  
2. The principle of the microservice architecture is that service provides single function, so each components(microservices) only need to provide small service, without having to design all the services in system one-time;  
3. Should be solve the problem of the core domain as soon as possible.

  Then, we can follow the many principles of domain-driven design ([DDD](https://en.wikipedia.org/wiki/Domain-driven_design)). The core task of the design process is identify entities, value objects, services and other elements, and further search aggregation; because our requirements are very simple, so it's easy find them out:  
*  Entities:Promotion  
*  Value-Object:Coupon,PromotionEvent  
*  Domain Service:SecKill  

  Now we can find the aggregation between them, separated two microservice, now we direct use MySQL database for shared data (although microservice recommend use independent storage for each, we can revisit it in the next iteration)  
1. Command : for SecKill domain service  
2. Query : for query Coupon Value-Object

![Fig-1 Architecture](/assets/images/seckill-develop-course-part-I-arth-en.png){: .align-center}

## Core Domain Implement
  The source code at [Github](https://github.com/ServiceComb/seckill), Welcome to Watch and Star : )
### Implement of Command micro-service
  We create two class "SecKillCommandService" and "SecKillPersistentRunner" to accept seckill request and persist seckill result, considering persistence is slow, we use BlockQueue temporary cache requests. another class "SecKillCommandRestController" act as Endpoint; ServiceComb support a variety of programming models and communication model, also well support Spring Boot, and easy deploy to Huawei cloud.

![Fig-2 Command micro-service components](/assets/images/seckill-develop-course-part-I-command-en.png){: .align-center}

### Implement of Query microService
  Query logic is relatively simple, because PromotionEvent is Value-Object, we use PromotionEvent records to get Coupon Value-Object, you can read the source code and understand this process.

## Support Domain Implement
  As promotion is entity and seckill need it as preconditions, we need build and manage it in another domain, because it's not so urgent at current stage, we can use Spring injection autowire fix objects.

![Fig-3 Support domain object injection](/assets/images/seckill-develop-course-part-I-spring.png){: .align-center}

## Function Verification
  Finally, we use PostMan to check completed functions, Please ensure request body fill with JSON format, and set Content-Type to application/json:

### Request SecKill

![Fig-4 Request seckill](/assets/images/seckill-develop-course-part-I-request-seckill.png){: .align-center}

### Query owned coupons

![Fig-5 Query owned coupons](/assets/images/seckill-develop-course-part-I-query-coupons.png){: .align-center}

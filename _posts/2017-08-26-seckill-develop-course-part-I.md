---
title: "SecKill Develop Course (I)"
lang: en
ref: seckill-develop-course-part-I
permalink: /docs/seckill-develop-course-part-I/
excerpt: "an introduction how build seckill demo project using agile development mode step by step"
last_modified_at: 2017-09-13T09:00:00+08:00
author: Yangyong Zheng
redirect_from:
  - /theme-setup/
---

## Overview
  SecKill is our ServiceComb open source team how builds a micro-service architecture from the perspective of domain-driven design ([DDD](https://en.wikipedia.org/wiki/Domain-driven_design)). In this process, you can learn from the micro-service architecture is different from the traditional single program architecture features; In addition, we will use the agile development model to quickly build it.

## Background

  SecKill's demand originated from the Internet's popular promotions, support use coupons to obtain some discounts; because the number of coupons is very limited, so we must provide a platform for everyone who wants to get it fair competition. 

  Because SecKill is a demo project, so we don't want make it too complicated, the real seckill scenario has too many details that go far beyond our imagination; we also don't want make it too specific, and we use the most primitive strategy - first come first get, if you want to try other strategies, you can download the source code and modify it, I believe that will not difficult.

## First Design
  Now let's us analyze requirement in customer bounded context:  
1. Customer can request grab a coupon,system will return whether successed;  
2. Customer can query how many coupons owned.  

  Let's go! what? you say this description is to simple? because they are no registration system, and promotion is how come, how to start? which coupon the customer request for? Is the discount all same? etc.

  Actually, we are accustomed to thinking a lot at the beginning, so some larger system, the design stage may be a few months, but this time you can't consider too much, because we believe:  
3. Over-design can't guarantee fully meetting the demand after construction completed, the only constant is the demand is always changing, so don't over-design;  
4. The principle of the micro-service architecture is that service provides single function, so each component(micro-service) only need to provide small service, without having to design all the services in system one-time;  
5. Should be solve the problem of the core domain as soon as possible.

  Then, we need to use correct method to complete the design process - follow the many principles of domain-driven design ([DDD](https://en.wikipedia.org/wiki/Domain-driven_design)). The core task of the design process is identify entities, value objects, services and other elements, and further search aggregation; because our requirements are very simple, so it's easy find them out:  
*  Entities:Promotion  
*  Value-Object:Coupon,PromotionEvent  
*  Domain Service:SecKill  

  Now we can found the aggregation between them, separated two micro-services, in order to quickly complete we direct use MySQL database for shared data (although micro-service recommend use independent storage for each, we will improve this point future)  
1. Command micro-service:for SecKill domian service  
2. Query micro-service:for query Coupon Value-Object

![Fig-1 Architecture](/assets/images/seckill-develop-course-part-I-arth-en.png){: .align-center}

## Core Domain Implement
  The source code at [Github](https://github.com/ServiceComb/seckill), Welcome to Watch and Star : )
### Implement of Command micro-service
  We create two class "SecKillCommandService" and "SecKillPersistentRunner" to accept seckill request and persist seckill result, considering persistence is slow, we use BlockQueue temporary cache requests. another class "SecKillCommandRestController" act as Endpoint; ServiceComb support a variety of programming models and communication model, also well support Spring Boot, and easy deploy to Huawei cloud.

![Fig-2 Command micro-service components](/assets/images/seckill-develop-course-part-I-command-en.png){: .align-center}

### Implement of Query micro-service
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
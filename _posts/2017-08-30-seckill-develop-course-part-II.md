---
title: "SecKill Develop Course (II)"
lang: en
ref: seckill-develop-course-part-II
permalink: /docs/seckill-develop-course-part-II/
excerpt: "an introduction how build seckill demo project using agile development mode step by step"
last_modified_at: 2017-09-13T09:00:00+08:00
author: Yangyong Zheng
redirect_from:
  - /theme-setup/
---

  [Previous article]({{ site.url }}{{ site.baseurl }}/docs/seckill-develop-course-part-I/) We only built a core function seckill demo, this article we will gradually improve more features in order to let it had complete function.

## Problems
  Review what we has been done, we can find that:   
1. Service for Promotion entity is not provided (inject by Spring);  
2. Lack some base check and features, include:  
 * One customer can only grab one coupon per promotion  
 * Support multi promotion activing (discount of each promotion is different)  
3. If Command micro-service down, it will recovery all uncompleted promotions immediately before start-up again.

  Maybe you would say that customer management and customer login function are not listed? Indeed, the customer is indispensable in our scenario, in order to simply design, we don't include login and token authentication etc., if you are interesting about this, you can see ServiceComb's [Company](https://github.com/ServiceComb/ServiceComb-Company-WorkShop) demo application to get more information.

## Improvement Design
  For entity, domain-driven design ([DDD](https://en.wikipedia.org/wiki/Domain-driven_design)) recommended to use a separate interface, so we design a new Admin micro-service to provide service:

![Fig-1 Architecture after Admin micro-service added](/assets/images/seckill-develop-course-part-II-arth-en.png){: .align-center}

## Improvement Implement
### Implement of Admin micro-service
  Admin micro-service only provide services for promotion entity, we can map this function to REST method:  
* New promotion map to Post;  
* Modify promotion map to Put;  　　
* Query promotion map to Get;  　　
* Delete promotion map to Delete.　　

  To match current requirement we only need implement Post and Get, In addition, already started promotion should not be able to modify, so we increased the corresponding check.

### New check and features Implement
  Add a HashSet per promotion to check whether customer had grab coupon;   
  Add "SecKillPromotionBootstrap" class as promotion bootstrap manager for support multi active, "SecKillCommandService" and "SecKillPersistentRunner" now managed(create) by it。

### Command micro-service auto recovery Implement
  Add "SecKillRecoveryService" class to check state of promotion, uncomplement promotions whether unstart or activing all need check by it to init start-up information including left coupons, grabbed customers list, etc.

## Function Verification
  Finally, we use PostMan to check completed functions, Please ensure request body fill with JSON format, and set Content-Type to application/json：
### Create Promotion

![Fig-2 Create promotion](/assets/images/seckill-develop-course-part-II-create-promotion.png){: .align-center}

### Query Activing Promotions

![Fig-3 Query activing promotions](/assets/images/seckill-develop-course-part-II-query-active-promotion.png){: .align-center}

### Reject duplicate Grab

![Fig-4 Reject duplicate grab](/assets/images/seckill-develop-course-part-II-reject-duplicate-grab.png){: .align-center}

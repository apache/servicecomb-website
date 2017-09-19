---
title: "Eventual Data Consistency Solution in ServiceComb - part 2"
lang: en
ref: distributed_saga_2
permalink: /docs/distributed_saga_2/
excerpt: "The design of distributed saga in ServiceComb"
last_modified_at: 2017-09-16T16:05:00+08:00
author: Sean Yin
redirect_from:
  - /theme-setup/
---

In my [previous post]({{ site.baseurl }}{% link _posts/2017-09-13-saga-background.md %}), I talked about how [Saga][1] can 
be used to solve the data consistency issue of our trip planning application. Now let\'s gather the requirements to design
a saga.

## Saga Log
Saga guarantees either all sub-transactions are committed or compensated for, but the saga system itself may crash. There
are a few states that a saga may be in on crash:
* Saga received a request, but no transaction started yet. States of services involved in sub-transactions are not modified
by saga, nothing has been done.
* Some sub-transactions were done. When restarted, saga has to resume from the last completed transaction.
* A sub-transaction was started, but not completed yet. Since we are not sure if the remote service completed the transaction, 
failed the transaction, or the request to remote service timed out, saga has to redo the sub-transaction on restart. That also
means sub-transactions have to be idempotent.
* A sub-transaction failed and its compensating transaction has not started yet. Saga has to resume from the compensating
transaction on restart.
* A compensating transaction started but not completed yet. The solution is basically the same as the previous one. That means
compensating transactions have to idempotent too.
* All sub-transactions or compensating transactions were done, which is the same as the first case.

In order for saga to recover to the states mentioned above, we have to keep track of each step of sub-transactions and
compensating transactions. We decided to achieve that by saving the following events in a persistent store called saga log:
* **Saga started event** stores the entire saga request, which includes multiple transaction/compensation requests 
* **Transaction started event** stores individual transaction request
* **Transaction ended event** stores individual transaction request and its response
* **Transaction aborted event** stores individual transaction request and the cause of failure
* **Transaction compensated event** stores individual compensation request and its response
* **Saga ended event** marks the end of a saga request and stores nothing

![Events]({{ site.url }}{{ site.baseurl }}/assets/images/saga.events.png){: .align-center}

By persisting these events in saga log, a crashed saga can be recovered to any states above. 

Since saga only needs persistence of events and the event contents are stored as JSON, the implementation of the saga log 
is very flexible. Databases (SQL or NoSQL), durable message queues, or even plain files can be used as event storage, but
some are faster for saga to recover.

## Request Data Structure of Saga
In our case, flight booking, car rental, and hotel reservation have no dependency among each other at all and they can be
processed in parallel. However, it\'s more user friendly for our customers to only charge their credit cards once, when all 
the bookings are done successfully. That means the transactions of the four services look like the graph below.

![Transactions]({{ site.url }}{{ site.baseurl }}/assets/images/saga.transactions.png){: .align-center}

It makes sense to implement the data structure of trip planning request as a [Directed Acyclic Graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph).
The root of the graph is saga start task and the leaf is saga end task.

![Request Graph]({{ site.url }}{{ site.baseurl }}/assets/images/saga.graph.png){: .align-center}

## Parallel Saga
As mentioned above, flight booking, car rental, and hotel reservation can be processed in parallel. But doing so creates
another problem: what if flight booking failed while car rental is being processed? We can\'t keep waiting for the response
from car rental service, because we have no idea how long it will take. 

THe best thing we can do is to send the car rental request again and hope we get a response so that we can continue our 
backward recovery. If car rental service never responds, we may have to fallback with manual intervention.

The delayed booking request may still be received by the remote car rental service. When it does, the service has already
processed the same booking and its cancellation request.

![Network Latency]({{ site.url }}{{ site.baseurl }}/assets/images/saga.commutative.png){: .align-center}

Therefore, services have to implement transactions and compensations in such a way that transaction request received after
its compensation request takes no effect. Caitie McCaffrey called this **commutative compensating request** in her talk 
on [Distributed Sagas: A Protocol for Coordinating Microservices](https://www.youtube.com/watch?v=1H6tounpnG8). 

## ACID and Saga
[ACID](https://en.wikipedia.org/wiki/ACID) is consistency model with the following properties:
* Atomicity
* Consistency
* Isolation
* Durability

Saga does not provide ACID guarantee, because atomicity and isolation are not satisfied according to the [paper][1] 
>full atomicity is not provided. That is, sagas may view the partial results of other sagas [[1]]

With durable saga log, saga guarantees consistency and durability.

## Saga Architecture
Finally, the architecture of our saga looks like this

![Saga Architecture]({{ site.url }}{{ site.baseurl }}/assets/images/saga.design.png){: .align-center}

* Saga execution component parses the request JSON and builds a graph of requests
* TaskRunner ensures the execution order of requests with task queue
* TaskConsumer processes tasks to write events to saga log and send requests to remote services

## Summary
In this article, we talked about how saga can be implemented with a saga log to persist transaction/compensation events 
and request graph. A crashed saga can also be recovered from all the persisted events in saga log on restart. However,
there are a few requirements on design of microservices to ensure saga consistency guarantee:
* transaction and compensation requests must be idempotent
* compensation requests must be commutative

## References
1. [Original Paper on Sagas][1] by By Hector Garcia-Molina & Kenneth Salem

[1]:https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf

---
title: "Eventual Data Consistency with Distributed Saga - part 1"
lang: en
ref: distributed_saga_1
permalink: /docs/distributed_saga_1/
excerpt: "The background of data consistency problem in the scenario of microservice architecture"
last_modified_at: 2017-09-13T18:33:43+08:00
author: Sean Yin
redirect_from:
  - /theme-setup/
---


## Data Consistency of Monolithic Applications
Imagine we are a giant corporation who runs an airline, a car rental company, and a hotel chain. We provide one-stop trip 
planning experience for our customers, so that they only have to provide a destination and we will book a flight, rent a 
car, and reserve a hotel room for them. From the business point of view, we have to make sure **bookings with all the three
are successful to make a successful trip plan, or there will be no plan**.

This requirement is easily satisfied with our current monolithic application. We just had to wrap all the three bookings 
in a single database transaction and they would all be done successfully or none was done.

![Monolithic Application]({{ site.url }}{{ site.baseurl }}/assets/images/saga.monolithic.png){: .align-center}

When this feature released, our business was happy, and our customer was happy.

## Data Consistency in the Microservice Scenario
In a few years, our corporation is doing so well on this trip planning business and our customers grow over tenfold. As 
more services provided by our airline, car rental company, and hotel chain, our application and development teams also 
grow. Now our monolith is so big and complex that not a single person understands how everything works together. What\'s
even worse is that it takes weeks for all the development teams to put together their changes for a new release. Our business
is not happy, since our market share is dropping due to the delay of our new features.

We decide to split our monolith into four microservices, flight booking, car rental, hotel reservation, and payment, after 
several rounds of discussions. Services use their own database and communicate through HTTP requests. They are released
according to their own schedule to meet the market needs. But we face a new problem: how do we ensure the original business 
rule of bookings with all three services must be successful to make a trip plan? A service cannot just access another\'s
database, because it violates the service boundary and services may not use the same database technology.

![Service Boundary]({{ site.url }}{{ site.baseurl }}/assets/images/saga.service.boundary.png){: .align-center}

## Sagas
We found a [great paper][1] by Hector & Kenneth on the Internet talking about data consistency issues and this paper mentioned 
a terminology named Saga. 

>A saga refers to a long live transaction that can be broken into a collection of sub-transactions that can be interleaved
in any way with other transactions. Each sub transactions in this case is a real transaction in the sense that it preserves 
database consistency. [[1]]

In case of our business, a trip transaction is a saga which consists of four sub-transactions: flight booking, car rental, 
hotel reservation, and payment.

![Transactions]({{ site.url }}{{ site.baseurl }}/assets/images/saga.transactions.png){: .align-center}

### How Saga Works
>The transactions in a saga are related to each other and should be executed as a (non-atomic) unit. Any partial executions 
of the saga are undesirable, and if they occur, must be compensated for. To amend partial executions, each saga transaction 
T<sub>1</sub> should be provided with a compensating transaction C<sub>1</sub>.[[1]]

We define the following transactions and their corresponding compensations for our services according to the rule above:

| Service | Transaction | Compensation |
|:---:|:---:|:---:|
| flight booking | book flight | cancel booking |
| car rental | rent car | cancel booking |
| hotel reservation | reserve room | cancel reservation |
| payment | pay | refund |

>Once compensating transactions C<sub>1</sub>, C<sub>2</sub>, ..., C<sub>n-1</sub> are defined for saga T<sub>1</sub>, T<sub>2</sub>, ..., T<sub>n</sub>, 
>then the system can make the following guarantee [[1]]
>* either the sequence T<sub>1</sub>, T<sub>2</sub>, ..., T<sub>n</sub> (which is the preferable one) 
>* or the sequence T<sub>1</sub>, T<sub>2</sub>, ..., T<sub>j</sub>, C<sub>j</sub>, ..., C<sub>2</sub>, C<sub>1</sub>, for some 0 < j < n, will be executed 

In another word, with the above defined transaction/compensation pairs, saga guarantees the following business rules are met:
* all the bookings are either executed successfully, or cancelled if any of them fails
* if the payment fails in the last step, all bookings are cancelled too

### Saga Recovery
Two types of saga recovery were described in the [original paper][1]:
* **backward recovery** *compensates* all completed transactions if one failed  
* **forward recovery** *retries* failed transactions, assuming every sub-transaction will eventually succeed

Apparently there is no need for compensating transactions in forward recovery, which is useful if sub-transactions will
always succeed (eventually) or compensations are very hard or impossible for your business.

Theoretically compensating transactions shall never fail. However, in the distributed world, servers may go down, network 
can fail, and even data centers may go dark. What can we do in such situations? The last resort is to have fallbacks which
may involve manual intervention.

### The Restrictions of Saga
That looks promising. Are all long live transactions can be done this way? There are a few restrictions:
* A saga only permits two levels of nesting, the top level saga and simple transactions [[1]]
* At the outer level, full atomicity is not provided. That is, sagas may view the partial results of other sagas [[1]] 
* Each sub-transaction should be an independent atomic action [2]

In our case, flight booking, car rental, hotel reservation, and payment are naturally independent actions and transaction
of each can be performed atomically with their corresponding databases. 

We don\'t need atomicity at the trip transaction level either. One user may book the last seat on a flight which gets 
cancelled later due to insufficient balance in credit card. Another user may see the flight fully booked and one seat freed
up for booking due to the cancellation. He/she can grab the last flight seat and complete the trip plan. It does not really
matter to our business.

There are also things to consider on compensations.
>The compensating transaction undoes, from a semantic point of view, any of the actions performed by T<sub>i</sub>, but 
does not necessarily return the database to the state that existed when the execution of T<sub>i</sub> began. (For instance,
if a transaction fires a missile, it may not be possible to undo this action) [[1]] 

However, this is not a problem at all for our business. And it is still possible to compensate for actions hard to undo. For
example, a transaction sending an email can be compensated by sending another email explaining the problem. 

## Summary
Now we have a solution to tackle our data consistency issue with saga. It allows us to either successfully perform all
transactions or compensate succeeded ones in case any fails. Although saga does not provide [ACID](https://en.wikipedia.org/wiki/ACID) guarantee, it still suits
many scenarios where eventual data consistency is enough. How do we design a saga system? Let\'s address the question in our
next blog post.

## References
1. [Original Paper on Sagas][1] by By Hector Garcia-Molina & Kenneth Salem
2. Gifford, David K and James E Donahue, “Coordinating Independent Atomic Actions”, Proceedings of IEEE COMPCON, San Francisco, CA, February, 1985

[1]:https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf

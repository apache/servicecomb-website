---
title: Mersher Distributed Tracing
lang: en
ref: mersher-distributed-tracing
permalink: /docs/mersher-quick-start-advance/mersher-distributed-tracing/
excerpt: Introduce how to use distributed tracing with mersher
last_modified_at: 2019-08-08T14:01:43.000Z
---

- Distributed handler chain tracking provides the ability of tracing microservice call relationships and watching processing time. It is used to make it easy for users to check the health of microservices in a distributed environment. This guide will show you how to use the distributed handler chain tracking capabilities provided by **mersher**.

# Foreword

- Walk through [mersher-quick-start](/docs/mersher-quick-start/) and have **mersher display programs** running.

# Enable

- 1 Added zipkin library dependency in mersher main file.

  ```bash
  _ "github.com/go-chassis/go-chassis-plugins/tracing/zipkin"
  ```

- 2 Add default handlers in bootstrap.go as shown by the arrows in the figure.

  ![tracing-func](/assets/images/mersher/mersher-tracing-func.png)

- 3 Recompile and replace the executable file of **mersher_webapp** and **mersher_calculator**. Then start the mersher service respectively.

- 4 Running Zipkin Distributed tracking service with docker.

  ```bash
  docker run -d -p 9411:9411 openzipkin/zipkin
  ```

- 5 Click on the _Submit_ button to initiate http call.

- 6 Open <http://192.168.88.64:9411> to view the distributed tracking results. You can see the call chains and processing time of http call.

  ![Distributed tracking rendering 30111](/assets/images/mersher/mersher-tracing-30111.png)

# What's next

- Learn more about [Distributed Tracing](/users/distributed-tracing/)

- Read [Distributed Tracing with ServiceComb and Zipkin](/docs/tracing-with-servicecomb/)

- See [ServiceComb User Guide](/users/)

- Learn more from [the Company application](/docs/linuxcon-workshop-demo/) for a more complete example of microservice applications integrated with ServiceComb

  ``

---
title: "数据一致性解决方案"
lang: cn
ref: quick-start-dataconsistency
permalink: /cn/docs/quick-start-dataconsistency/
excerpt: "介绍ServiceComb的Saga数据一致性方案应用demo"
last_modified_at: 2017-09-19T11:50:10-04:00
---

{% include toc %}
模拟一个简单的旅行应用，展示如何使用ServiceComb提供的Saga方案保证微服务间数据一致性。

旅行应用包含四个微服务：
- 机票预订服务(flight-booking-service)
- 租车服务(car-rental-service)
- 酒店预订服务(hotel-reservation-service)
- 支付服务(payment-service)

机票预订、租车、酒店预订服务间无依赖关系，使用自己的数据库，通过HTTP协议通信。
在以上三个服务的预订成功，支付完成后才能满足一个成功的行程，否则不能成行，Saga自动补偿。

![Saga-demo]({{ site.url }}{{ site.baseurl }}/assets/images/saga-demo.png)

## 运行demo

注：Demo 集成在 [ServiceComb-Saga](https://github.com/ServiceComb/ServiceComb-Saga) 项目中。

1. 准备环境
- [Oracle JDK 1.8+](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Maven 3.x](https://maven.apache.org/install.html)
- [Docker](https://www.docker.com/get-docker)
- [MySQL](https://dev.mysql.com/downloads/)
- [Service Center](https://github.com/ServiceComb/service-center)
- [Docker compose](https://docs.docker.com/compose/install/)

2. 配置服务
	在各服务的 *microservice.yaml* 文件，设置该服务注册的服务中心

	```yaml
	APPLICATION_ID: saga
	service_description:
	  name: flight-booking-service
	  version: 0.0.1
	cse:
	  service:
	    registry:
	      address: http://sc.servicecomb.io:30100 #此处选择使用ServiceComb的Service Center
	  rest:
	    address: 0.0.0.0:8080
	  handler:
	    chain:
	      Consumer:
	        default: loadbalance
	```

	在 *saga-demo/docker-compose.yaml* 设置部署脚本
	```yaml
	version: '2.1'

	services:
	  service-center: #此处选择使用ServiceComb的Service Center容器镜像
	    image: "servicecomb/service-center"
	    hostname: service-center
	    ports:
	      - "30100:30100"

	  mysql:  #此处选择使用5.7版本的mysql镜像
	    image: "mysql/mysql-server:5.7"
	    hostname: mysql
	    environment:
	      - MYSQL_ROOT_PASSWORD=password
	      - MYSQL_DATABASE=saga
	      - MYSQL_USER=saga
	      - MYSQL_PASSWORD=password
	    ports:
	      - "3306:3306"
	    healthcheck:
	        test: ["CMD-SHELL", "nc -z localhost 3306 &> /dev/null; echo $$?"]
	        interval: 30s
	        timeout: 10s
	        retries: 5

	  car-rental-service:
	    image: "car-rental-service:0.0.2-SNAPSHOT"
	    hostname: car
	    links:
	      - "service-center:sc.servicecomb.io"
	    ports:
	      - "8080:8080"

	  flight-booking-service:
	    image: "flight-booking-service:0.0.2-SNAPSHOT"
	    hostname: flight
	    links:
	      - "service-center:sc.servicecomb.io"
	    ports:
	      - "8081:8080"

	  hotel-reservation-service:
	    image: "hotel-reservation-service:0.0.2-SNAPSHOT"
	    hostname: hotel
	    links:
	      - "service-center:sc.servicecomb.io"
	    ports:
	      - "8082:8080"

	  payment-service:
	    image: "payment-service:0.0.2-SNAPSHOT"
	    hostname: payment
	    links:
	      - "service-center:sc.servicecomb.io"
	    ports:
	      - "8080"

	  saga:
	    image: "saga-spring:0.0.2-SNAPSHOT"
	    hostname: saga
	    links:
	      - "mysql:mysql.servicecomb.io"
	      - "service-center:sc.servicecomb.io"
	      - "car-rental-service:car.servicecomb.io"
	      - "flight-booking-service:flight.servicecomb.io"
	      - "hotel-reservation-service:hotel.servicecomb.io"
	      - "payment-service:payment.servicecomb.io"
	    environment:
	      - JAVA_OPTS=-Dspring.profiles.active=prd,servicecomb -Dcse.service.registry.address=http://sc.servicecomb.io:30100
	    ports:
	      - "8083:8080"
	    depends_on:
	      mysql:
	        condition: service_healthy
	```

3. 在Saga项目的根目录执行编译，制作Saga、机票预订、租车、酒店预订和支付服务镜像

	```bash
	mvn package -DskipTests -Pdocker -Pdemo
	```

4. 在Saga项目的saga-demo目录通过docker-compose一键启动Saga、机票预订、租车、酒店预订和支付服务

	```bash
	docker-compose up
	```

## 验证

1. 参照 [Saga API](https://github.com/ServiceComb/ServiceComb-Saga/blob/master/docs/api/api.md) 说明，设定各服务的事务、补偿、依赖和恢复参数，并保存为 *request.json* 文件

	```json
	{
	  "policy": "BackwardRecovery",
	  "requests": [
	    {
	      "id": "request-car",
	      "type": "rest",
	      "serviceName": "car-rental-service",
	      "transaction": {
	        "method": "post",
	        "path": "/rentals",
	        "params": {
	          "form": {
	            "customerId": "mike"
	          }
	        }
	      },
	      "compensation": {
	        "method": "put",
	        "path": "/rentals",
	        "params": {
	          "form": {
	            "customerId": "mike"
	          }
	        }
	      }
	    },
	    {
	      "id": "request-hotel",
	      "type": "rest",
	      "serviceName": "hotel-reservation-service",
	      "transaction": {
	        "method": "post",
	        "path": "/reservations",
	        "params": {
	          "form": {
	            "customerId": "mike"
	          }
	        }
	      },
	      "compensation": {
	        "method": "put",
	        "path": "/reservations",
	        "params": {
	          "form": {
	            "customerId": "mike"
	          }
	        }
	      }
	    },
	    {
	      "id": "request-flight",
	      "type": "rest",
	      "serviceName": "flight-booking-service",
	      "transaction": {
	        "method": "post",
	        "path": "/bookings",
	        "params": {
	          "form": {
	            "customerId": "mike"
	          }
	        }
	      },
	      "compensation": {
	        "method": "put",
	        "path": "/bookings",
	        "params": {
	          "form": {
	            "customerId": "mike"
	          }
	        }
	      }
	    },
	    {
	      "id": "request-payment",
	      "type": "rest",
	      "serviceName": "payment-service",
	      "parents": [
	        "request-car",
	        "request-flight",
	        "request-hotel"
	      ],
	      "transaction": {
	        "method": "post",
	        "path": "/payments",
	        "params": {
	          "form": {
	            "customerId": "mike"
	          }
	        }
	      },
	      "compensation": {
	        "method": "put",
	        "path": "/payments",
	        "params": {
	          "form": {
	            "customerId": "mike"
	          }
	        }
	      }
	    }
	  ]
	}
	```

2. 发送请求到Saga

	```bash
	curl -XPOST -H "Content-Type: text/plain" -d @./request.json  http://<localhost.ip:8083>/requests
	```

    获取处理结果成功(如果失败，返回相应的错误信息)
	```bash
	success
	```

3. 查看Saga的事务

	```bash
	curl -XGET http://<localhost.ip:8083>/events
	```

    查询结果

	```bash
	{
	    "bcd27f0d-6b82-49b3-8067-b16eba970e55": [
	        {
	            "id": 1,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:21Z",
	            "type": "SagaStartedEvent",
	            "contentJson": "{\"policy\": \"BackwardRecovery\", \"requests\": [{\"id\": \"request-car\", \"type\": \"rest\", \"serviceName\": \"car-rental-service\", \"transaction\": {\"path\": \"/rentals\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/rentals\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}}, {\"id\": \"request-hotel\", \"type\": \"rest\", \"serviceName\": \"hotel-reservation-service\", \"transaction\": {\"path\": \"/reservations\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/reservations\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}}, {\"id\": \"request-flight\", \"type\": \"rest\", \"serviceName\": \"flight-booking-service\", \"transaction\": {\"path\": \"/bookings\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/bookings\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}}, {\"id\": \"request-payment\", \"type\": \"rest\", \"parents\": [\"request-car\", \"request-flight\", \"request-hotel\"], \"serviceName\": \"payment-service\", \"transaction\": {\"path\": \"/payments\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/payments\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}}]}"
	        },
	        {
	            "id": 2,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:21Z",
	            "type": "TransactionStartedEvent",
	            "contentJson": "{\"id\": \"request-hotel\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"hotel-reservation-service\", \"transaction\": {\"path\": \"/reservations\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/reservations\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}"
	        },
	        {
	            "id": 3,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:21Z",
	            "type": "TransactionStartedEvent",
	            "contentJson": "{\"id\": \"request-car\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"car-rental-service\", \"transaction\": {\"path\": \"/rentals\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/rentals\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}"
	        },
	        {
	            "id": 4,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:21Z",
	            "type": "TransactionStartedEvent",
	            "contentJson": "{\"id\": \"request-flight\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"flight-booking-service\", \"transaction\": {\"path\": \"/bookings\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/bookings\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}"
	        },
	        {
	            "id": 5,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:22Z",
	            "type": "TransactionEndedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-flight\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"flight-booking-service\", \"transaction\": {\"path\": \"/bookings\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/bookings\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Flight booked with id f249543b-765e-4e10-9ba3-74fe33d8af83 for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 6,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:24Z",
	            "type": "TransactionEndedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-hotel\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"hotel-reservation-service\", \"transaction\": {\"path\": \"/reservations\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/reservations\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Hotel reserved with id f74049a0-3d3d-49b6-a45b-058a409daecf for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 7,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:25Z",
	            "type": "TransactionEndedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-car\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"car-rental-service\", \"transaction\": {\"path\": \"/rentals\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/rentals\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Car rented with id 937d7364-be07-4d47-9e01-af72290d0478 for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 8,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:25Z",
	            "type": "TransactionStartedEvent",
	            "contentJson": "{\"id\": \"request-payment\", \"type\": \"rest\", \"parents\": [\"request-car\", \"request-flight\", \"request-hotel\"], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"payment-service\", \"transaction\": {\"path\": \"/payments\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/payments\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}"
	        },
	        {
	            "id": 9,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:25Z",
	            "type": "TransactionEndedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-payment\", \"type\": \"rest\", \"parents\": [\"request-car\", \"request-flight\", \"request-hotel\"], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"payment-service\", \"transaction\": {\"path\": \"/payments\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/payments\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Payment made for customer mike and remaining balance is 200\\\"\\n}\"}}"
	        },
	        {
	            "id": 10,
	            "sagaId": "bcd27f0d-6b82-49b3-8067-b16eba970e55",
	            "creationTime": "2017-09-20T00:30:25Z",
	            "type": "SagaEndedEvent",
	            "contentJson": "{}"
	        }
    	]
	}
	```

4. demo中模拟了支付服务帐户余额不足场景，发送请求超过一次将触发补偿操作。再次发送请求，可以在Saga日志中找到补偿事件

	```bash
	{
	    "bcd27f0d-6b82-49b3-8067-b16eba970e55": [
	        ...
	    ],
	    "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9": [
	        {
	            "id": 11,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:30:45Z",
	            "type": "SagaStartedEvent",
	            "contentJson": "{\"policy\": \"BackwardRecovery\", \"requests\": [{\"id\": \"request-car\", \"type\": \"rest\", \"serviceName\": \"car-rental-service\", \"transaction\": {\"path\": \"/rentals\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/rentals\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}}, {\"id\": \"request-hotel\", \"type\": \"rest\", \"serviceName\": \"hotel-reservation-service\", \"transaction\": {\"path\": \"/reservations\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/reservations\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}}, {\"id\": \"request-flight\", \"type\": \"rest\", \"serviceName\": \"flight-booking-service\", \"transaction\": {\"path\": \"/bookings\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/bookings\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}}, {\"id\": \"request-payment\", \"type\": \"rest\", \"parents\": [\"request-car\", \"request-flight\", \"request-hotel\"], \"serviceName\": \"payment-service\", \"transaction\": {\"path\": \"/payments\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/payments\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}}]}"
	        },
	        {
	            "id": 12,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:30:45Z",
	            "type": "TransactionStartedEvent",
	            "contentJson": "{\"id\": \"request-car\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"car-rental-service\", \"transaction\": {\"path\": \"/rentals\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/rentals\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}"
	        },
	        {
	            "id": 13,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:30:45Z",
	            "type": "TransactionStartedEvent",
	            "contentJson": "{\"id\": \"request-hotel\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"hotel-reservation-service\", \"transaction\": {\"path\": \"/reservations\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/reservations\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}"
	        },
	        {
	            "id": 14,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:30:45Z",
	            "type": "TransactionStartedEvent",
	            "contentJson": "{\"id\": \"request-flight\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"flight-booking-service\", \"transaction\": {\"path\": \"/bookings\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/bookings\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}"
	        },
	        {
	            "id": 15,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:30:45Z",
	            "type": "TransactionEndedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-car\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"car-rental-service\", \"transaction\": {\"path\": \"/rentals\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/rentals\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Car rented with id 75f4be4b-0d32-4bbb-b786-7b39c340682a for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 16,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:30:45Z",
	            "type": "TransactionEndedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-hotel\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"hotel-reservation-service\", \"transaction\": {\"path\": \"/reservations\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/reservations\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Hotel reserved with id 7ad11c00-25eb-4b4b-b1fb-b55d4e833f51 for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 17,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:30:45Z",
	            "type": "TransactionEndedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-flight\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"flight-booking-service\", \"transaction\": {\"path\": \"/bookings\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/bookings\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Flight booked with id 1a40d7bf-ee66-46d1-b066-a9973f15176a for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 18,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:30:45Z",
	            "type": "TransactionStartedEvent",
	            "contentJson": "{\"id\": \"request-payment\", \"type\": \"rest\", \"parents\": [\"request-car\", \"request-flight\", \"request-hotel\"], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"payment-service\", \"transaction\": {\"path\": \"/payments\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/payments\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}"
	        },
	        {
	            "id": 19,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:31:15Z",
	            "type": "TransactionAbortedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-payment\", \"type\": \"rest\", \"parents\": [\"request-car\", \"request-flight\", \"request-hotel\"], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"payment-service\", \"transaction\": {\"path\": \"/payments\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/payments\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"body\\\": \\\"io.servicecomb.saga.core.TransactionFailedException: The remote service payment-service failed to serve the post request to /payments \\n\\tat io.servicecomb.saga.discovery.service.center.ServiceCenterDiscoveryRestTransport.with(ServiceCenterDiscoveryRestTransport.java:81)\\n\\tat io.servicecomb.saga.format.JacksonRestOperation.send(JacksonRestOperation.java:43)\\n\\tat io.servicecomb.saga.format.JacksonRestTransaction.send(JacksonRestTransaction.java:24)\\n\\tat io.servicecomb.saga.core.RequestProcessTask.commit(RequestProcessTask.java:45)\\n\\tat io.servicecomb.saga.core.BackwardRecovery.apply(BackwardRecovery.java:33)\\n\\tat io.servicecomb.saga.core.LoggingRecoveryPolicy.apply(LoggingRecoveryPolicy.java:38)\\n\\tat io.servicecomb.saga.core.TransactionTaskConsumer$OperationCallable.call(TransactionTaskConsumer.java:110)\\n\\tat io.servicecomb.saga.core.TransactionTaskConsumer$OperationCallable.call(TransactionTaskConsumer.java:94)\\n\\tat java.util.concurrent.FutureTask.run(FutureTask.java:266)\\n\\tat java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)\\n\\tat java.util.concurrent.FutureTask.run(FutureTask.java:266)\\n\\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)\\n\\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)\\n\\tat java.lang.Thread.run(Thread.java:748)\\nCaused by: InvocationException: code=490;msg=CommonExceptionData [message=Cse Internal Bad Request]\\n\\tat io.servicecomb.swagger.invocation.exception.ExceptionFactory.doCreate(ExceptionFactory.java:74)\\n\\tat io.servicecomb.swagger.invocation.exception.ExceptionFactory.convertException(ExceptionFactory.java:119)\\n\\tat io.servicecomb.swagger.invocation.exception.ExceptionFactory.convertConsumerException(ExceptionFactory.java:78)\\n\\tat io.servicecomb.swagger.invocation.Response.createConsumerFail(Response.java:128)\\n\\tat io.servicecomb.swagger.invocation.Response.createFail(Response.java:121)\\n\\tat io.servicecomb.swagger.invocation.AsyncResponse.fail(AsyncResponse.java:41)\\n\\tat io.servicecomb.transport.rest.client.http.VertxHttpMethod.lambda$doMethod$0(VertxHttpMethod.java:67)\\n\\tat io.vertx.core.http.impl.HttpClientRequestBase.handleException(HttpClientRequestBase.java:110)\\n\\tat io.vertx.core.http.impl.HttpClientRequestImpl.handleException(HttpClientRequestImpl.java:50)\\n\\tat io.vertx.core.http.impl.HttpClientRequestBase.timeout(HttpClientRequestBase.java:155)\\n\\tat io.vertx.core.http.impl.HttpClientRequestBase.handleTimeout(HttpClientRequestBase.java:140)\\n\\tat io.vertx.core.http.impl.HttpClientRequestBase.lambda$setTimeout$0(HttpClientRequestBase.java:100)\\n\\tat io.vertx.core.impl.VertxImpl$InternalTimerHandler.handle(VertxImpl.java:782)\\n\\tat io.vertx.core.impl.VertxImpl$InternalTimerHandler.handle(VertxImpl.java:753)\\n\\tat io.vertx.core.impl.ContextImpl.lambda$wrapTask$2(ContextImpl.java:316)\\n\\tat io.netty.util.concurrent.AbstractEventExecutor.safeExecute(AbstractEventExecutor.java:163)\\n\\tat io.netty.util.concurrent.SingleThreadEventExecutor.runAllTasks(SingleThreadEventExecutor.java:418)\\n\\tat io.netty.channel.nio.NioEventLoop.run(NioEventLoop.java:440)\\n\\tat io.netty.util.concurrent.SingleThreadEventExecutor$5.run(SingleThreadEventExecutor.java:873)\\n\\t... 1 more\\nCaused by: java.util.concurrent.TimeoutException: The timeout period of 30000ms has been exceeded\\n\\t... 11 more\\n\\\"\\n}\"}}"
	        },
	        {
	            "id": 20,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:31:15Z",
	            "type": "TransactionCompensatedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-car\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"car-rental-service\", \"transaction\": {\"path\": \"/rentals\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/rentals\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Car rental cancelled with id 38bc5913-6768-4321-add3-6d26db364c19 for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 21,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:31:15Z",
	            "type": "TransactionCompensatedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-hotel\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"hotel-reservation-service\", \"transaction\": {\"path\": \"/reservations\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/reservations\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Hotel reservation cancelled with id efcff718-fb74-4b70-a2e2-689ecb42206d for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 22,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:31:15Z",
	            "type": "TransactionCompensatedEvent",
	            "contentJson": "{\"request\": {\"id\": \"request-flight\", \"type\": \"rest\", \"parents\": [], \"fallback\": {\"type\": \"NOP\"}, \"serviceName\": \"flight-booking-service\", \"transaction\": {\"path\": \"/bookings\", \"method\": \"post\", \"params\": {\"form\": {\"customerId\": \"mike\"}}}, \"compensation\": {\"path\": \"/bookings\", \"method\": \"put\", \"params\": {\"form\": {\"customerId\": \"mike\"}}, \"retries\": 3}}, \"response\": {\"body\": \"{\\n  \\\"statusCode\\\": 200,\\n  \\\"content\\\": \\\"Flight booking cancelled with id 37572464-6f53-4351-aa37-5f88e3f1f872 for customer mike\\\"\\n}\"}}"
	        },
	        {
	            "id": 23,
	            "sagaId": "2654fa50-71e2-4fc8-afc2-6a5e0d3dafe9",
	            "creationTime": "2017-09-20T00:31:15Z",
	            "type": "SagaEndedEvent",
	            "contentJson": "{}"
	        }
	    ]
	}
	```

## 下一步

* 了解更多[ServiceComb中的数据最终一致性方案 - part 1](/cn/docs/distributed_saga_1/)

* 了解更多[ServiceComb中的数据最终一致性方案 - part 2](/cn/docs/distributed_saga_2/)

* 了解更多[ServiceComb中的数据最终一致性方案 - part 3](/cn/docs/distributed_saga_3/)

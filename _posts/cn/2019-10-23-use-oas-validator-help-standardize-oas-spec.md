---
title: "使用OAS Validator帮助你规范OpenAPI Spec文档"
lang: cn
ref: use-oas-validator-help-standardize-oas-spec
permalink: /cn/docs/use-oas-validator-help-standardize-oas-spec/
excerpt: "本文将介绍如何规范你的OpenAPI Spec文档"
last_modified_at: 2019-10-23T12:37:43+08:00
author: Daniel Qian
tags: [微服务]
redirect_from:
  - /theme-setup/
---

## 使用OAS Validator规范你的OpenAPI Spec文档

当前主流的开发RESTful API的做法有两种：Code First和Contract First。Code First指先写代码，然后生成Contract，而Contract First则是先写Contract再写代码实现。

两种做法各有利弊，Code First可以让开发人员先写接口实现，然后利用工具反向生成Contract，优点是快速开发，并能保证接口实现与Contract保证一致，缺点是Contract太过易变容易导致下游应用故障。Contract First则可以让Contract的变动受控，保证下游应用的稳定性，缺点是需要人工来保证接口实现与Contact的一致性，具有一定难度。

对于如何规范管理Contract，新开普软件研究院开源的[OAS Validator[1]](https://github.com/NewCapec-Institute/oas-validator)提供了一些思路，下面简单介绍。

### 合规性校验

OAS Validator支持对使用[OpenAPI V3[2]](https://github.com/OAI/OpenAPI-Specification)编写的Contract文档做合规性校验（也可称之为风格校验）。

在一个微服务架构的系统中，提供RESTful API的组件可能会有很多个，并且由不同开发人员/团队开发，那么在使用这些接口的时候有一个很自然的需求就是希望这些接口（或接口文档）的风格是一致的。OAS Validator的合规性校验做的就是这部分工作。下面举例说明怎么使用合规性校验功能：

1. 到 https://github.com/NewCapec-Institute/oas-validator clone下代码
2. 然后 `mvn clean install`打包
3. 到`oas-validator-web/target`目录下执行`java -jar oas-validator-web-exec.jar`启动OAS Validator Web
4. 访问 http://localhost:8080，进入合规性校验功能
5. 把 [petstore.yaml](https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v3.0/petstore.yaml) 内容贴到文本框中然后点击校验得到结果：

```txt
$.tags : 至少提供一个
$.openapi : 必须>=3.0.2
$.components.schemas.'Pet'.title : 必须提供
$.components.schemas.'Pet'.properties.'id'.title : 必须提供
$.components.schemas.'Pet'.properties.'name'.title : 必须提供
$.components.schemas.'Pet'.properties.'tag'.title : 必须提供
$.components.schemas.'Error'.title : 必须提供
$.components.schemas.'Error'.properties.'code'.title : 必须提供
$.components.schemas.'Error'.properties.'message'.title : 必须提供
$.info.description : 必须提供
$.paths./pets.get.tags[0] : 不在$.tags所定义的范围内
$.paths./pets.get.responses.200.headers.'x-next' : 必须为upper hyphen case
$.paths./pets.post.tags[0] : 不在$.tags所定义的范围内
$.paths./pets/{petId}.get.tags[0] : 不在$.tags所定义的范围内
```

下面是功能截图：

![图1 合规性校验](/assets/images/2019-10-23-use-oas-validator-help-standardize-oas-spec/oas-validator-1.png){: .align-center}

下面举例解释检查报告的意思：

`$.components.schemas.'Pet'.title : 必须提供`，前面一段是[JsonPath[3]](https://github.com/json-path/JsonPath)，用来描述出问题的元素/属性的位置，“必须提供”则的意思是没有填写该属性。如下图：

![图2 合规性校验示例](/assets/images/2019-10-23-use-oas-validator-help-standardize-oas-spec/oas-validator-2.png){: .align-center}

`title`是一个文档性字段，没有它虽然不影响接口的语义，但是对于下游应用的开发者来说没有它会造成理解上的困难，因此在这里我们把它设定为必填。

再来看这一条报告 `$.paths./pets.get.responses.200.headers.'x-next' : 必须为upper hyphen case`，同样前面是JsonPath，告诉你该属性应该为Upper Hyphen Case，正确的写法应该是`X-Next`。和`title`属性一样Header的大小写不是一个技术问题，但是统一的大小写风格能够让下游应用的开发人员更舒适，从而有更少的Bug。

### 兼容性校验

不管你是采用Code First还是Contract First，Contract的变动不可避免，那么如何保证变化后的Contract能够对下游应用向下兼容就成了不可回避的问题。这个问题的具体描述就是根据V1.0 Contract开发的下游应用是否依然能够与根据V1.1 Contract实现的接口正确交互。

OAS Validator提供了这种兼容性校验，当然同样只支持OpenAPI V3文档。下面举例说明如何使用这一功能：

我们先提供一个v1.0的OAS Spec：

```yaml
openapi: "3.0.0"
info:
  version: 1.0
  title: Swagger Petstore
paths:
  /pets/{petId}:
    get:
      operationId: showPetById
      tags:
        - pets
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pet"
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
```

再写一个v1.1的OAS Spec，添加了一个query参数`name`：

```yaml
openapi: "3.0.0"
info:
  version: 1.1
  title: Swagger Petstore
paths:
  /pets/{petId}:
    get:
      operationId: showPetById
      tags:
        - pets
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
        - name: name
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pet"
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
```

然后同样打开OAS Validator Web，进入“兼容性校验”功能，在左侧贴上v1.0在右侧贴上v1.1，点击校验得到结果：

```txt
$.paths./pets/{petId}.get.parameters[1].required : [name=name,in=query]:仅允许新增required=false的parameter
```

这个报告的意思是新增的query参数`name`是必填的，这种做法不向下兼容。仔细想想是不是的确如此？

### 总结

关于OAS Validator的详细文档可见Github。需要注意的是，目前校验规则还不能配置，但是在代码层面提供了接口供扩展，你可以根据自己的需求写一个自己的合规性校验器。

同时OAS Validator正在请求捐赠到[Servicecomb Toolkit[4]](https://github.com/apache/servicecomb-toolkit)项目，流程结束后会尽快将其整合到Servicecomb Toolkit中希望能够为广大开发者带来帮助。

最后，欢迎开发者朋友们加入ServiceComb社区，一起做些有意思的事情。[加入社区方法[5]](http://servicecomb.incubator.apache.org/cn/docs/join_the_community/)

### 参考资料

[1] OAS Validator https://github.com/NewCapec-Institute/oas-validator

[2] OpenAPI V3 https://github.com/OAI/OpenAPI-Specification

[3] JsonPath https://github.com/json-path/JsonPath

[4] Servicecomb Toolkit https://github.com/apache/servicecomb-toolkit

[5] 加入Servicecomb社区  http://servicecomb.incubator.apache.org/cn/docs/join_the_community/
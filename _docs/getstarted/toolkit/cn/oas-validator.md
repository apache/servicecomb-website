---
title: "OpenAPI V3 Spec校验工具"
lang: cn
ref: install
permalink: /cn/docs/toolkit/oas-validator/
excerpt: "了解如何使用OpenAPI V3 Spec校验工具"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## 项目结构

* oas-validator-core，核心API及骨架实现
* oas-validator-core-spring，骨架的Spring Boot Starter
* oas-validator-test，核心API的测试帮助类
* oas-validator-compliance，合规性校验实现
* oas-validator-compliance-spring，合规性校验的Spring Boot Starter
* oas-validator-compatibility，兼容性校验实现
* oas-validator-compatibility-spring，兼容性校验实现的Spring Boot Starter
* oas-validator-web，校验工具的操作UI

## 合规性校验

OAS必须符合[OAS 3.0.2规范][openapi-3.0.2]（比如属性的名称、REQUIED要求）。除此之外则是我们自己的定义的合规性检查。

### 一些字符串匹配规则

* <a name="lower-camel-case"></a>Lower Camel Case：首字母小写的驼峰，对应的正则`^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$`
* <a name="upper-camel-case"></a>Upper Camel Case：首字母大写的驼峰，对应的正则`^[A-Z]([a-z0-9]+[A-Z]?)*$`
* <a name="upper-hyphen-case"></a>Upper Hyphen Case：单词首字母大写，多个单词用`-`连接，比如`Content-Type`、`Accept`、`X-Rate-Limit-Limit`。对应的正则：`^([A-Z][a-z0-9]*-)*([A-Z][a-z0-9]*)$`

### OpenAPI Object [doc][spec-openapi]

<a name="openapi-compliance"></a>

* `openapi`属性必须为3.0.x且>=3.0.2
* `info`属性见[Info Object合规性检查](#info-compliance)
* `paths`属性，必须提供见[Paths Object合规性检查](#paths-compliance)
* `components`属性见[Components Object合规性检查](#components-compliance)
* `tags`属性，至少提供一个[Tag Object][spec-tag]
  * 见[Tag Object合规性检查](#tag-compliance)
* `security`属性，不允许提供

### Info Object [doc][spec-info]

<a name="info-compliance"></a>

* `description`属性，必须填写

### Tag Object [doc][spec-tag]

<a name="tag-compliance"></a>

- `name`属性，必须是[Upper Camel Case](#upper-camel-case)
- `description`属性，必须填写
- 不得存在[Operation Object][spec-operation]没有引用过的tag

### Paths Object [doc][spec-paths]

<a name="paths-compliance"></a>

* path必须是[Lower Camel Case](#lower-camel-case)，包括[Path Templating][spec-path-templating]中的变量
  * 见[Path Item Object合规性检查](#path-item-compliance)

### Path Item Object [doc][spec-path-item]

<a name="path-item-compliance"></a>

* `get/post/put/delete/...`属性，见[Operation Object合规性检查](operation-compliance)
* `parameters`属性，见[Parameter Object合规性检查](#parameter-compliance)

### Operation Object [doc][spec-operation]

<a name="operation-compliance"></a>

* `summary`属性、必须填写
* `operationId`属性，且[Lower Camel Case](#lower-camel-case)
* `parameters`属性，见[Parameter Object合规性检查](#parameter-compliance)
* `requestBody`属性，见[Request Body Object合规性检查](#request-body-compliance)
* `responses`属性，见[Responses Object合规性检查](#responses-compliance)
* `tags`属性，且只能写一个tag，且必须在[OpenAPI Object][spec-openapi] 的 `tags`属性里所定义的范围内
  
* `servers`属性，不允许提供

### Parameter Object [doc][spec-parameter]

<a name="parameter-compliance"></a>

* `description`属性，必须填写
* `name`属性
  * 如果`in`为path、query、cookie，则那么必须是[Lower Camel Case](#lower-camel-case)
  * 如果`in`为header，则那么必须是[Upper Hyphen Case](#upper-hyphen-case)
* `schema`属性，见[Schema Object合规性检查](#schema-compliance)
* `content`属性，见[Media Type Object合规性检查](#media-type-compliance)

### Request Body Object [doc][spec-request-body]

<a name="request-body-compliance"></a>

* `description`属性，必须填写
* `content`属性，见[Media Type Object合规性检查](#media-type-compliance)

### Media Type Object [doc][spec-media-type]

<a name="media-type-compliance"></a>

* `schema`属性，必须填写。见[Schema Object合规性检查](#schema-compliance)
* `encoding`属性，见[Encoding Object合规性检查](#encoding-compliance)

### Responses Object [doc][spec-responses]

<a name="responses-compliance"></a>

* 见[Response Object合规性检查](#response-compliance)

### Response Object [doc][spec-response]

<a name="response-compliance"></a>

* `description`属性，必须填写
* `headers`属性，name（`headers`的key）必须是[Upper Hyphen Case](#upper-hyphen-case)
  * 见[Header Object合规性检查](#header-compliance)
* `content`属性，见[Media Type Object合规性检查](#media-type-compliance)

### Schema Object [doc][spec-schema]

<a name="schema-compliance"></a>

* `title`属性，如果上级是[Schema Object][spec-schema]或[Components Object][spec-components]，那么必须填写
* `properties`属性，name（`properties`的key）必须是[Lower Camel Case](#lower-camel-case)
  * Sub Schema见[Schema Object合规性检查](#schema-compliance)

### Encoding Object [doc][spec-encoding]

<a name="encoding-compliance"></a>

* `headers`属性，name（`headers`的key）必须是[Upper Hyphen Case](#upper-hyphen-case)
  * 见[Header Object合规性检查](#header-compliance)

### Header Object [doc][spec-header]

<a name="header-compliance"></a>

* `description`属性，必须填写
* `schema`属性，见[Schema Object合规性检查](#schema-compliance)
* `content`属性，见[Media Type Object合规性检查](#media-type-compliance)

### Components Object [doc][spec-components]

<a name="components-compliance"></a>

* `schemas`属性，name必须是[Upper Camel Case](#upper-camel-case)
  * 见[Schema Object合规性检查](#schema-compliance)
* `responses`属性，name必须是[Upper Camel Case](#upper-camel-case)
  * 见[Response Object合规性检查](#response-compliance)
* `parameters`属性，name必须是[Upper Camel Case](#upper-camel-case)
  * 见[Parameter Object合规性检查](#parameter-compliance)
* `examples`属性，name必须是[Upper Camel Case](#upper-camel-case)
* `requestBodies`属性，name必须是[Upper Camel Case](#upper-camel-case)
  * 见[Request Body合规性检查](#request-body-compliance)
* `headers`属性，name必须是[Upper Hyphen Case](#upper-hyphen-case)
  * 见[Header合规性检查](#header-compliance)
* `links`属性，name必须是[Upper Camel Case](#upper-camel-case)
* `callbacks`属性，name必须是[Upper Camel Case](#upper-camel-case)

## 兼容性检查

对新旧两个版本的OAS做兼容性检查。

OAS可以使用[Reference Object][spec-reference]来描述Spec，两个不同的OAS会出现描述不同但语义相同的情况。比如下面的旧OAS没有使用[Reference Object][spec-reference]，而新OAS则使用了的情况：

旧OAS

```yaml
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Swagger Petstore
  license:
    name: MIT
servers:
  - url: http://petstore.swagger.io/v1
paths:
  /pets:
    post:
      summary: List all pets
      operationId: listPets
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  Foo:
                    type: string
      responses:
        '200':
          description: A paged array of pets
```

新OAS

```yaml
paths:
  /pets:
    post:
      operationId: listPets
      requestBody:
        content:
          application/json: 
            schema:
              $ref: '#/components/schemas/Foo'
      responses:
        '200':
          description: A paged array of pets
components:
  schemas:
    Foo:
      type: array
      items:
        type: object
        properties:
          Foo:
            type: string
```

因此在检查兼容性的时候会将新旧OAS的[Reference Object][spec-reference]做解析，然后再检查，下面是一段[swagger-parser][swagger-parser]的例子：

```java
OpenAPIV3Parser parser = new OpenAPIV3Parser();

ParseOptions parseOptions = new ParseOptions();
parseOptions.setResolve(true);
parseOptions.setResolveCombinators(true);
parseOptions.setResolveFully(true);
parseOptions.setFlatten(false);

SwaggerParseResult parseResult = parser.readContents(content, null, parseOptions);
```

因此，检查下来如果发现不兼容，那么所报告的位置会和原文档有所不同。

### Paths Object [doc][spec-paths]

<a name="paths-compatibility"></a>

* 新OAS必须包含旧OAS的所有的`path`，如果`path`使用了[Path Templating][spec-path-templating]，只要变量名发生了变化，那么即使语义上相同也会被认为不同，比如`/pets/{foo}`和`/pets/{bar}`会被认定为不同。
  * 见[Path Item Object兼容性检查](#path-item-compatibility)

### Path Item Object [doc][spec-path-item]

<a name="path-item-compatibility"></a>

* 新OAS必须包含旧OAS的所有的get/put/post/delete/...[Operation Object][spec-operation]

### Operation Object [doc][spec-operation]

<a name="operation-compatibility"></a>

* `operationId`属性，新旧OAS必须完全一致。
* `parameters`属性，对它检查须在考虑到[Path Item Object parameters属性][spec-path-item-parameters]的情况下进行：
  * 新OAS可以新增[Parameter Object][spec-parameter]，但是新增的[Parameter Object][spec-parameter]的`required`属性必须为`false`
  * 新OAS可以删除[Parameter Object][spec-parameter]
  * 针对单个[Parameter Object][spec-parameter]的修改的检查见[Parameter Object兼容性检查](#parameter-compatibility)（在同一个[Operation Object][spec-operation]下[Parameter Object][spec-parameter]依靠`name`和`in`两个属性作为ID）。
* `requestBody`属性，见[Request Body Object兼容性检查](#request-body-compatibility)
* `responses`属性，见[Responses Object兼容性检查](#responses-compatibility)

### Parameter Object [doc][spec-parameter]

<a name="parameter-compatibility"></a>

* `required`属性，只允许`true(旧) -> false(新)`
* `allowEmptyValue`属性，只允许`false(旧) -> true(新)`的变化
* `style`属性，新旧OAS必须保持一致
* `explode`属性，新旧OAS必须保持一致
* `allowReserved`属性，只允许`false(旧) -> true(新)`的变化
* `schema`属性，见[Schema Object兼容性检查](#schema-compatibility)
* `content`属性，新OAS必须包含旧OAS的所有media type（`content`的key），且不能新增media type
  * 见[Media Type Object兼容性检查](#media-type-compatibility)

### Request Body Object [doc][spec-request-body]

<a name="request-body-compatibility"></a>

* `content`属性，新OAS必须包含旧OAS的所有media type（`content`的key）
  * 见[Media Type Object兼容性检查](#media-type-compatibility)
* `required`属性，只允许`true(旧) -> false(新)`的变化

### Media Type Object [doc][spec-media-type]

<a name="media-type-compatibility"></a>

* `schema`属性，见[Schema Object兼容性检查](#schema-compatibility)
* `encoding`属性，该属性仅适用于`requestBody`，因此新旧OAS的property name（`encoding`的key）必须完全一致
  * 见[Encoding Object兼容性检查](#encoding-compatibility)

### Responses Object [doc][spec-responses]

<a name="responses-compatibility"></a>

* `default`属性，如果旧OAS没有定义`default`，那么新OAS也不能定义`default`。
* `{Http Status Code}`属性，新OAS不允许新增。
* 见[Response Object兼容性检查](#response-compatibility)

### Response Object [doc][spec-response]

<a name="response-compatibility"></a>

* `headers`属性，新OAS必须包含旧OAS的所有header name（`headers`的key），可以新增header name
  * [Header Object][spec-header]见[Header Object兼容性检查](#header-compatibility)
* `content`属性，新OAS必须包含旧OAS的所有media type（`content`的key），可以新增media type
  - [Media Type Object][spec-media-type]见[Media Type Object兼容性检查](#media-type-compatibility)

### Schema Object [doc][spec-schema]

<a name="schema-compatibility"></a>

OAS中定义，Schema Object可以直接或间接用在：

* 请求类：[Parameter Object][spec-parameter]、[Request Body Object][spec-request-body]、[Header Object][spec-header]
* 响应类：[Header Object][spec-header]、[Response Object][spec-response]

不同用途的兼容性检查规则有所不同。

### 用做请求时

原则上，当Schema Object用在请求时，只允许从紧到松的变化。

* `type, format`组合所允许的变化范围

| 旧(type,format)  | 新(type,format)                                              |
| ---------------- | ------------------------------------------------------------ |
| integer, null    | integer, int64<br />number, double<br />number, null         |
| integer, int32   | integer, int64<br />integer, null<br />number, float<br />number, double<br />number, null |
| integer, int64   | integer, null<br />number, double<br />number, null          |
| number, null     | number, double                                               |
| number, float    | number, null<br />number, double                             |
| number, double   | number, null                                                 |
| string, null     | string, password                                             |
| string, password | string, null                                                 |

* `allOf`、`oneOf`、`anyOf`属性，在combine之后再做检查
* `multipleOf`属性，如果旧OAS为null。新OAS必须==旧OAS或者新OAS是旧OAS的因子，比如6(旧)->3(新)
* `maximum`、`maxLength`、`maxItems`、`maxProperties`，如果旧OAS为null，那么新OAS也必须是null。其他情况，新OAS必须>=旧OAS。
* `minimum`、`minLenght`、`minItems`、`minProperties`，如果旧OAS为null，那么新OAS也必须是null。其他情况，新OAS必须<=旧OAS。
* `exclusiveMaximum`、`exclusiveMinimum`属性，仅允许`true(旧)->false(新)`的变化
* `uniqueItems`属性，只允许`true(旧)->false(新)`的变化。
* `required`属性，新OAS必须==旧OAS，或者新OAS是旧OAS的子集。
* `enum`属性，新OAS必须==旧OAS，或者新OAS是旧OAS的超集。
* `properties`属性，新OAS可以新增property name（`properties`的key）或者减少property name。
* `nullable`属性，只允许`false(旧)->true(新)`的变化。
* `discriminator`属性，新旧OAS必须完全一致。
* `xml`属性，新旧OAS必须完全一致。
* `readOnly`、`writeOnly`，新旧OAS必须完全一致。

### 用做响应时

原则上，当Schema Object用在响应时，只允许从松到紧的变化。

* `type, format`组合所允许的变化范围

| 旧(type,format)  | 新(type,format)                    |
| ---------------- | ---------------------------------- |
| integer, null    | integer, int64<br />integer, int32 |
| integer, int64   | integer, null<br />interger, int32 |
| number, null     | number, double<br />number, float  |
| number, double   | number, null<br />number, float    |
| string, null     | string, password                   |
| string, password | string, null                       |

* `allOf`、`oneOf`、`anyOf`属性，在combine之后再做检查
* `multipleOf`属性，如果旧OAS为null。新OAS必须==旧OAS或者新OAS是旧OAS的倍数，比如3(旧)->6(新)
* `maximum`、`maxLength`、`maxItems`、`maxProperties`，如果旧OAS为null，那么新OAS也必须是null。其他情况，新OAS必须<=旧OAS。
* `minimum`、`minLenght`、`minItems`、`minProperties`，如果旧OAS为null，那么新OAS也必须是null。其他情况，新OAS必须>=旧OAS。
* `exclusiveMaximum`、`exclusiveMinimum`属性，仅允许`false(旧)->true(新)`的变化
* `uniqueItems`属性，只允许`false(旧)->true(新)`的变化。
* `required`属性，新OAS必须==旧OAS或者，新OAS是旧OAS的超集。
* `enum`属性，新OAS必须==旧OAS，或者新OAS是旧OAS的子集。
* `properties`属性，新OAS可以新增property name（`properties`的key）或者减少property name。
* `nullable`属性，只允许`true(旧)->false(新)`的变化。
* `discriminator`属性，新旧OAS必须完全一致。
* `xml`属性，新旧OAS必须完全一致。
* `readOnly`、`writeOnly`，新旧OAS必须完全一致。

### Encoding Object [doc][spec-encoding]

<a name="encoding-compatibility"></a>

PS. Encoding Object仅针对Request Body Object有用

* `contentType`属性，新旧OAS必须保持一致
* `headers`属性，新OAS不能新增旧OAS的header name（`headers`的key），但是可以删除header name
  * [Header Object][spec-header]见[Header Object兼容性检查](#header-compatibility)
* `style`属性，新旧OAS必须保持一致
* `explode`属性，新旧OAS必须保持一致
* `allowReserved`属性，只允许`false(旧) -> true(新)`的变化

### Header Object [doc][spec-header]

<a name="header-compatibility"></a>

- `schema`属性，见[Schema Object兼容性检查](#schema-compatibility)

### Components Object [doc][spec-components]

<a name="components-compatibility"></a>

[Components Object][spec-components]定义的都是可复用OAS Object，而在检查兼容性的时候所有`$ref`都已被解析了，因此不需要对[Components Object][spec-components]的属性做兼容性检查。


[spec-operation]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#operationObject
[openapi-3.0.2]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
[spec-openapi]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#openapi-object
[spec-server]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#serverObject
[spec-info]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#infoObject
[spec-paths]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#paths-object
[spec-path-item]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#pathItemObject
[spec-parameter]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#parameterObject
[spec-request-body]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#requestBodyObject
[spec-security-scheme]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#securitySchemeObject
[spec-components]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#components-object
[spec-tag]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#tagObject
[spec-schema]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#schemaObject

[spec-media-type]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#media-type-object
[spec-response]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#response-object
[spec-path-templating]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#path-templating
[spec-parameterIn]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#parameterIn
[spec-encoding]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#encodingObject
[spec-header]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#header-object
[spec-info]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#infoObject
[spec-reference]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#reference-object
[swagger-parser]: https://github.com/swagger-api/swagger-parser
[spec-path-item-parameters]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#user-content-pathitemparameters
[spec-responses]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#responsesObject

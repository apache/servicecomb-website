---
title: "OpenAPI V3 Spec validation tools"
lang: cn
ref: oas-validator
permalink: /docs/products/toolkit/oas-validator/
excerpt: "Learn how to use OpenAPI V3 Spec validation tools"
last_modified_at: 2019-11-12T00:50:43-55:00
---

{% include toc %}
## Project structure

* oas-validator-core: core apis and skeletons implementations
* oas-validator-core-spring: Spring Boot Starter for core skeletons
* oas-validator-test: test helpers for core api
* oas-validator-compliance: check style validators
* oas-validator-compliance-spring: Spring Boot Starter for check style validators
* oas-validator-compatibility: compatibility validators
* oas-validator-compatibility-spring: Spring Boot Starter for compatibility validators
* oas-validator-web: web ui

## Style check rules

OAS must compatible with [OAS 3.0.2][openapi-3.0.2], besides must obey the following rules.

### String patterns

* <a name="lower-camel-case"></a> Lower Camel Case: initial letter lowercase camel case, regex is `^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$`
* <a name="upper-camel-case"></a> Upper Camel Case: initial letter uppercase camel case, regex is `^[A-Z]([a-z0-9]+[A-Z]?)*$`
* <a name="upper-hyphen-case"></a> Upper Hyphen Case: initial letter uppercase, multiple words concat with `-`, such as `Content-Type`, `Accept`, `X-Rate-Limit-Limit`, regex is `^([A-Z][a-z0-9]*-)*([A-Z][a-z0-9]*)$`

### OpenAPI Object [doc][spec-openapi]

<a name="openapi-compliance"></a>

* `openapi` property must be 3.0.x and >= 3.0.2
* `info` propety, see [Info Object style check rules](#info-compliance)
* `paths` property, must provide, see  [Paths Object style check rules](#paths-compliance)
* `components` property, see [Components Object style check rules](#components-compliance)
* `tags` property should at least provide one [Tag Object][spec-tag]
  * see  [Tag Object style check rules](#tag-compliance)
* `security` property, should not provide

### Info Object [doc][spec-info]

<a name="info-compliance"></a>

* `description` property, required

### Tag Object [doc][spec-tag]

<a name="tag-compliance"></a>

- `name` property, must be [Upper Camel Case](#upper-camel-case)
- `description` property, required
- Every tag should be referenced by at least one [Operation Object][spec-operation]

### Paths Object [doc][spec-paths]

<a name="paths-compliance"></a>

* path must be [Lower Camel Case](#lower-camel-case), including [Path Templating][spec-path-templating] variable
  * see  [Path Item Object style check rules](#path-item-compliance)

### Path Item Object [doc][spec-path-item]

<a name="path-item-compliance"></a>

* `get/post/put/delete/...` properties, see  [Operation Object style check rules](operation-compliance)
* `parameters` property, see  [Parameter Object style check rules](#parameter-compliance)

### Operation Object [doc][spec-operation]

<a name="operation-compliance"></a>

* `summary` property, required
* `operationId` property, must be [Lower Camel Case](#lower-camel-case)
* `parameters` property, see  [Parameter Object style check rules](#parameter-compliance)
* `requestBody` property, see  [Request Body Object style check rules](#request-body-compliance)
* `responses` property, see  [Responses Object style check rules](#responses-compliance)
* `tags` property, can only provide one tag, must be in the range of [OpenAPI Object][spec-openapi]   `tags` property
* `servers` property, should not provide

### Parameter Object [doc][spec-parameter]

<a name="parameter-compliance"></a>

* `description` property, required
* `name` property
  * if `in` is path, query or cookie, then must be [Lower Camel Case](#lower-camel-case)
  * if `in` is header, then must be [Upper Hyphen Case](#upper-hyphen-case)
* `schema` property, see  [Schema Object check sytle rules](#schema-compliance)
* `content` property, see  [Media Type Object style check rules](#media-type-compliance)

### Request Body Object [doc][spec-request-body]

<a name="request-body-compliance"></a>

* `description` property, required
* `content` property, see  [Media Type Object style check rules](#media-type-compliance)

### Media Type Object [doc][spec-media-type]

<a name="media-type-compliance"></a>

* `schema` property, required. See  [Schema Object style check rules](#schema-compliance)
* `encoding` property, see  [Encoding Object style check rules](#encoding-compliance)

### Responses Object [doc][spec-responses]

<a name="responses-compliance"></a>

* See [Response Object style check rules](#response-compliance)

### Response Object [doc][spec-response]

<a name="response-compliance"></a>

* `description` property, required
* `headers` property, name (`headers` key) must be [Upper Hyphen Case](#upper-hyphen-case)
  * See [Header Object style check rules](#header-compliance)
* `content` property, see [Media Type Object style check rules](#media-type-compliance)

### Schema Object [doc][spec-schema]

<a name="schema-compliance"></a>

* `title` property, required if parent is [Schema Object][spec-schema] or [Components Object][spec-components]
* `properties` property, name(`properties` key) must be [Lower Camel Case](#lower-camel-case)
  * Sub Schema, see [Schema Object style check rules](#schema-compliance)

### Encoding Object [doc][spec-encoding]

<a name="encoding-compliance"></a>

* `headers` property, name(`headers` key) must be [Upper Hyphen Case](#upper-hyphen-case)
  * See [Header Object style check rules](#header-compliance)

### Header Object [doc][spec-header]

<a name="header-compliance"></a>

* `description` property, required
* `schema` property, see [Schema Object style check rules](#schema-compliance)
* `content` property, see [Media Type Object style check rules](#media-type-compliance)

### Components Object [doc][spec-components]

<a name="components-compliance"></a>

* `schemas` property, name must be [Upper Camel Case](#upper-camel-case)
  * See [Schema Object style check rules](#schema-compliance)
* `responses` property, name must be [Upper Camel Case](#upper-camel-case)
  * See [Response Object style check rules](#response-compliance)
* `parameters` property, name must be [Upper Camel Case](#upper-camel-case)
  * See [Parameter Object style check rules](#parameter-compliance)
* `examples` property, name must be [Upper Camel Case](#upper-camel-case)
* `requestBodies` property, name must be [Upper Camel Case](#upper-camel-case)
  * See [Request Body style check rules](#request-body-compliance)
* `headers` property, name must be [Upper Hyphen Case](#upper-hyphen-case)
  * See [Header style check rules](#header-compliance)
* `links` property, name must be [Upper Camel Case](#upper-camel-case)
* `callbacks` property, name must be [Upper Camel Case](#upper-camel-case)

## Compatibility check rules

Check whether new OAS spec compatibile with old spec.

Notice: OAS could use [Reference Object][spec-reference], two  OAS which are different in text maybe semantically same. For example, below old OAS doesn't use [Reference Object][spec-reference] while the new one uses:

Old OAS

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

New OAS

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

So, when do compatibility check we resolve [Reference Object][spec-reference] in old and new OAS first, then do the check, below is the code snippet using [swagger-parser][swagger-parser]:

```java
OpenAPIV3Parser parser = new OpenAPIV3Parser();

ParseOptions parseOptions = new ParseOptions();
parseOptions.setResolve(true);
parseOptions.setResolveCombinators(true);
parseOptions.setResolveFully(true);
parseOptions.setFlatten(false);

SwaggerParseResult parseResult = parser.readContents(content, null, parseOptions);
```

So if  compatibility violations be found, the reported location will be different from the location in origin OAS spec.

### Paths Object [doc][spec-paths]

<a name="paths-compatibility"></a>

* New OAS must include all the `path` appears in 旧OAS. If `path` uses [Path Templating][spec-path-templating], even the variable name changed, will be considered semantically different. For example `/pets/{foo}` and `/pets/{bar}` are different.
  * See [Path Item Object compatibility check rules](#path-item-compatibility)

### Path Item Object [doc][spec-path-item]

<a name="path-item-compatibility"></a>

* New OAS must inclued all old OAS get/put/post/delete/...[Operation Object][spec-operation]

### Operation Object [doc][spec-operation]

<a name="operation-compatibility"></a>

* `operationId` property,  new and old must be identical
* `parameters` property, check work must also consider [Path Item Object parameters property][spec-path-item-parameters]:
  * New OAS could add new [Parameter Object][spec-parameter], but the new [Parameter Object][spec-parameter] `required` property must be `false`
  * New OAS could delete[Parameter Object][spec-parameter]
  * The check on [Parameter Object][spec-parameter] see [Parameter Object compatibility check rules](#parameter-compatibility)(Under the same [Operation Object][spec-operation] [Parameter Object][spec-parameter] is identified by `name` and `in` property)。
* `requestBody` property, see [Request Body Object compatibility check rules](#request-body-compatibility)
* `responses` property, see[Responses Object compatibility check rules](#responses-compatibility)

### Parameter Object [doc][spec-parameter]

<a name="parameter-compatibility"></a>

* `required` property, only allow `true(old) -> false(new)` change
* `allowEmptyValue` property, only allow `false(old) -> true(new)` change
* `style` property, new and old must be identical
* `explode` property, new and old must be identical
* `allowReserved` property, only allow `false(old) -> true(new)` change
* `schema` property, see [Schema Object compatibility check rules](#schema-compatibility)
* `content`property, new OAS must include all old OAS media type (`content` keys), and add new media type is not allowed
  * see [Media Type Object compatibility check rules](#media-type-compatibility)

### Request Body Object [doc][spec-request-body]

<a name="request-body-compatibility"></a>

* `content`property, new OAS must include all old OAS media type (`content` keys)
  * See [Media Type Object compatibility check rules](#media-type-compatibility)
* `required` property, only allow `true(old) -> false(new)` change

### Media Type Object [doc][spec-media-type]

<a name="media-type-compatibility"></a>

* `schema` property, see [Schema Object compatibility check rules](#schema-compatibility)
* `encoding` property, this property only apply to `requestBody`, so new OAS and old OAS property name(`encoding` key) must be identical
  * See [Encoding Object compatibility check rules](#encoding-compatibility)

### Responses Object [doc][spec-responses]

<a name="responses-compatibility"></a>

* `default` property, if old OAS doesn't define `default`, then new OAS should not define `default` too.
* `{Http Status Code}` property, new OAS is not allowed to add one.
* See [Response Object compatibility check rules](#response-compatibility)

### Response Object [doc][spec-response]

<a name="response-compatibility"></a>

* `headers` property, new OAS must include all old OAS header name(`headers` keys), and add new header name is allowed
  * [Header Object][spec-header] see [Header Object compatibility check rules](#header-compatibility)
* `content` property, new OAS must include all old OAS media type(`content` keys), and add new media type is allowed
  - [Media Type Object][spec-media-type] see [Media Type Object compatibility check rules](#media-type-compatibility)

### Schema Object [doc][spec-schema]

<a name="schema-compatibility"></a>

OAS allows Schema Object be directly or indirectly in:

* Request: [Parameter Object][spec-parameter], [Request Body Object][spec-request-body], [Header Object][spec-header]
* Response: [Header Object][spec-header], [Response Object][spec-response]

In different context compatibility check rules are different.

### In request context

When Schema Object is in response context, only allow change from more specific form to less specific form.

* `type, format` combination allowed change:

| Old (type,format)  | New (type,format)                                              |
| ---------------- | ------------------------------------------------------------ |
| integer, null    | integer, int64<br />number, double<br />number, null         |
| integer, int32   | integer, int64<br />integer, null<br />number, float<br />number, double<br />number, null |
| integer, int64   | integer, null<br />number, double<br />number, null          |
| number, null     | number, double                                               |
| number, float    | number, null<br />number, double                             |
| number, double   | number, null                                                 |
| string, null     | string, password                                             |
| string, password | string, null                                                 |

* `allOf`, `oneOf`, `anyOf` property, combine them first then do check
* `multipleOf` property, if old OAS is null, then new OAS must == old OAS or new OAS is a factor of old OAS, eg, 6(old)->3(new)
* `maximum`, `maxLength`, `maxItems`, `maxProperties`, if old OAS is null, then new OAS must be null too. Otherwise, new OAS must be >= old OAS
* `minimum`, `minLenght`, `minItems`, `minProperties`, if old OAS is null, then new OAS must be null too. Otherwise, new OAS must be <= old OAS.
* `exclusiveMaximum`, `exclusiveMinimum` property, only allow change `true(old)->false(new)`
* `uniqueItems` property, only allow change `true(old)->false(new)`
* `required` property, new OAS must == old OAS or new OAS is old OAS subset
* `enum` property, new OAS must == old OAS or new OAS is old OAS superset
* `properties` property, new OAS could add or delete property name(`properties` key) 
* `nullable` property, only allow change `false(old)->true(new)`
* `discriminator` property, new and old must be identical
* `xml` property, new and old must be identical
* `readOnly`, `writeOnly` property, new and old must be identical

### In response context

When Schema Object is in response context, only allow change from less specific form to more specific form.

* `type, format` combination allowed change:

| Old (type,format)  | New (type,format)                    |
| ---------------- | ---------------------------------- |
| integer, null    | integer, int64<br />integer, int32 |
| integer, int64   | integer, null<br />interger, int32 |
| number, null     | number, double<br />number, float  |
| number, double   | number, null<br />number, float    |
| string, null     | string, password                   |
| string, password | string, null                       |

* `allOf`, `oneOf`, `anyOf` property, combine them first then do check
* `multipleOf` property if old OAS is null. new OAS must == old OAS or new OAS must be a multiple of old OAS, eg, 3(old)->6(new)
* `maximum`, `maxLength`, `maxItems`, `maxProperties`, if old OAS is null, then new OAS must be null too. Otherwise, new OAS must <= old OAS
* `minimum`, `minLenght`, `minItems`, `minProperties`, if old OAS is null, then new OAS must be null too. Otherwise, new OAS must >= old OAS
* `exclusiveMaximum`, `exclusiveMinimum` property, only allow change  `false(old)->true(new)`
* `uniqueItems` property, only allow change `false(old)->true(new)`
* `required` new OAS must == old OAS or new OAS is old OAS superset
* `enum` property, new OAS must == old OAS or new OAS is old OAS subset
* `properties` property, new OAS could add or delete property name(`properties` key) 
* `nullable` property , only allow change `true(old)->false(new)`
* `discriminator` property, new and old must be identical
* `xml` property, new and old must be identical
* `readOnly`, `writeOnly` property, new and old must be identical

### Encoding Object [doc][spec-encoding]

<a name="encoding-compatibility"></a>

Notice: Encoding Object only apply to Request Body Object

* `contentType` property, new and old must be identical
* `headers` property, new OAS can not add new he header name (`headers` key), but and delete header name
  * [Header Object][spec-header] see [Header Object compatibility check rules](#header-compatibility)
* `style` property, new and old must be identical
* `explode` property, new and old must be identical
* `allowReserved` property, only allow change `false(old) -> true(new)`

### Header Object [doc][spec-header]

<a name="header-compatibility"></a>

- `schema` property, see [Schema Object compatibility check rules](#schema-compatibility)

### Components Object [doc][spec-components]

<a name="components-compatibility"></a>

[Components Object][spec-components] defines reusable OAS Object, but when doing compatibility check all `$ref` are resolved, so no need to check [Components Object][spec-components] compatibility.


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

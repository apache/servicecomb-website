# CORS机制

## 概念阐述

跨域资源共享(CORS, Cross-Origin Resource Sharing)允许Web服务器进行跨域访问控制，使浏览器可以更安全地进行跨域数据传输。

## 场景描述

当用户需要从浏览器上跨域发送REST请求时就有可能要用到CORS机制，接收跨域请求的微服务需要开启CORS支持。

## 配置说明

CORS功能在microservice.yaml文件中配置，配置项见下表所述。

| 配置项 | 默认值 | 取值范围 | 是否必选 | 含义 | 注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| servicecomb.cors.enabled | `false` | `true`/`false` | 否 | 是否开启CORS功能 | - |
| servicecomb.cors.origin | `*` | - | 否 | Access-Control-Allow-Origin | - |
| servicecomb.cors.allowCredentials | `false` | `true`/`false` | 否 | Access-Control-Allow-Credentials | 根据CORS标准，当Access-Control-Allow-Credentials设置为`true`时，Access-Control-Allow-Origin不可设置为"*"，否则将会抛出异常 |
| servicecomb.cors.allowedHeader | 无 | - | 否 | Access-Control-Allow-Headers | 多个值使用逗号分隔 |
| servicecomb.cors.allowedMethod | 无 | - | 否 | Access-Control-Allow-Methods | 多个值使用逗号分隔 |
| servicecomb.cors.exposedHeader | 无 | - | 否 | Access-Control-Expose-Headers | 多个值使用逗号分隔 |
| servicecomb.cors.maxAge | 无 | (0,2147483647]，整型 | 否 | Access-Control-Max-Age | 单位是秒，如果用户不配置此项，则CORS应答中没有Access-Control-Max-Age |


## 示例代码

```yaml
servicecomb:
  cors:
    enabled: true
    origin: "*"
    allowCredentials: false
    allowedMethod: PUT,DELETE
    maxAge: 3600
```

---
layout: splash
lang: cn
ref: home
permalink: /cn/
header:
  overlay_color: "#dcdde2"
  overlay_image: /assets/images/servicecomb-banner-s.jpg
  caption:
excerpt: 'ServiceComb提供了一套包含代码框架生成，服务注册发现，负载均衡，服务可靠性（容错熔断，限流降级，调用链追踪）等功能的微服务框架。<br /><br />
<small>最新发布版本:<small><br />
<a href="https://github.com/ServiceComb/java-chassis/releases/tag/0.1.0"> Java开发包 v0.1.0 </a></small><br />
<small><a href="https://github.com/ServiceComb/service-center/releases/tag/0.1.0-m1">服务中心 v0.1.0-m1</a></small><br />'

intro:
  - excerpt: "在新近结束的LinuxCon Beijing 2017大会上，ServiceComb举办了一次 [workshop](/cn/slides/)向大家展示[如何使用ServiceComb构建一个云化应用](/cn/docs/linuxcon-workshop-demo/)。<br /><br />
  现在[ServiceComb支持使用Zipkin进行分布式事务追踪](/cn/docs/tracing-with-servicecomb/)。 
  "

feature_row:
  - image_path: /assets/images/servicecomb-feature-openapi.png
    alt: "标准"
    title: "服务契约"
    excerpt: "基于 [OpenAPI](https://www.openapis.org) 的服务契约保障。"
  - image_path: /assets/images/servicecomb-feature-quickstart.png
    alt: "高效"
    title: "快速开发"
    excerpt: "支持多种服务框架，快速构建云化应用。"
  - image_path: /assets/images/servicecomb-feature-multiLanguage.png
    alt: "多语言"
    title: "多语言"
    excerpt: "Java/Go框架级别支持。"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

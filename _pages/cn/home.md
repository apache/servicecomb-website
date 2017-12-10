---
layout: splash
lang: cn
ref: home
permalink: /cn/
header:
  overlay_image: /assets/images/servicecomb-banner-s.png
  caption:
excerpt: 'ServiceComb提供了一套包含代码框架生成，服务注册发现，负载均衡，服务可靠性（容错熔断，限流降级，调用链追踪）等功能的微服务框架。


<div class="excerpt-label">最新发布版本：</div>
<div class="button-group">
<a href="https://github.com/ServiceComb/java-chassis/releases/tag/0.5.0" class="home-button btn--info">Java开发包 v0.5.0</a>
<a href="https://github.com/ServiceComb/service-center/releases/tag/0.5.0" class="home-button btn--info">服务中心 v0.5.0</a>
<a href="https://github.com/ServiceComb/ServiceComb-Saga/releases/tag/saga-0.0.2" class="home-button btn--info">Saga v0.0.2</a>
</div>'

intro:
  - excerpt: "
<div class='excerpt-title'>最新新闻</div>

<ul>
  <li>
    <a href='/cn/docs/quick-start-dataconsistency/'>号外： 现在ServiceComb提供了微服务场景下的数据一致性解决方案Saga！</a>
  </li>
  <li class='line-end'>
    <a href='/cn/docs/linuxcon-workshop-demo/'>在新近结束的LinuxCon Beijing 2017大会上，ServiceComb举办了一次 workshop向大家展示如何使用ServiceComb构建一个云化应用。</a>
  </li>
</ul>"

feature_row:
  - image_path: /assets/images/servicecomb-feature-openapi.png
    alt: "标准"
    title: "服务契约"
    url: /cn/users/service-contract/
    excerpt: "基于 [OpenAPI](https://www.openapis.org) 的服务契约保障。"
  - image_path: /assets/images/servicecomb-feature-quickstart.png
    alt: "高效"
    title: "快速开发"
    url: /cn/docs/quick-start/
    excerpt: "支持多种服务框架，快速构建云化应用。"
  - image_path: /assets/images/servicecomb-feature-multiLanguage.png
    alt: "多语言"
    title: "多语言"
    excerpt: "Java/Go框架级别支持。"
---

{% include feature_row id="intro" type="center" %}

<div class="normal-feature-row">
{% include feature_row %}
</div>

---
layout: splash
lang: en
ref: home
permalink: /
header:
  overlay_image: /assets/images/servicecomb-banner-s.png
  caption:
excerpt: 'ServiceComb is a microservice framework that provides functionalities of service registry and discovery, load balance, service reliability(latency and fault tolerance, flow control and graceful degradation, distributed tracing) et al.<br /><br />
<small>Latest release:</small><br /><br />
<a href="https://github.com/ServiceComb/java-chassis/releases/tag/0.2.0" class="home-button btn--info">Java SDK v0.2.0</a>
<a href="https://github.com/ServiceComb/service-center/releases/tag/0.1.1" class="home-button btn--info">Service Center v0.1.1</a>'

intro:
  - excerpt: "In the recent LinuxCon Beijing 2017 conference, ServiceComb organized a workshop to show [the way to build a cloud application using ServiceComb](/docs/linuxcon-workshop-demo/).<br /><br />

  ServiceComb now supports to do [the distributed tracing with Zipkin](/docs/tracing-with-servicecomb/)."

feature_row:
  - image_path: /assets/images/servicecomb-feature-openapi.png
    alt: "Standard"
    title: "Service Contract"
    excerpt: "service contract gurantee based on [OpenAPI](https://www.openapis.org)"
  - image_path: /assets/images/servicecomb-feature-quickstart.png
    alt: "Efficient"
    title: "Rapid Development"
    excerpt: "supports many service frameworks, speed up building of cloud applications"
  - image_path: /assets/images/servicecomb-feature-multiLanguage.png
    alt: "MultiLanguage"
    title: "Multiple Languages"
    excerpt: "supports both Java and Go"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

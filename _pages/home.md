---
layout: splash
lang: en
ref: home
permalink: /
header:
  overlay_color: "#dcdde2"
  overlay_image: /assets/images/servicecomb-banner-s.jpg
  caption:
excerpt: 'ServiceComb is a microservice framework that provides an easy way to develop and deploy applications in the cloud. It provides functionalities of code framework generation, service registration, service discovery, load balance, service reliability(latency and fault tolerance, flow control and graceful degradation, handler chain tracing) et al.<br /><br />
<small>Latest release:<small><br />
<a href="https://github.com/ServiceComb/java-chassis/releases/tag/0.1.0"> Java SDK v0.1.0 </a></small><br />
<small><a href="https://github.com/ServiceComb/service-center/releases/tag/0.1.0">Service Center v0.1.0</a></small><br />'

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

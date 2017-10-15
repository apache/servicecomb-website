---
layout: splash
lang: en
ref: home
permalink: /
header:
  overlay_image: /assets/images/servicecomb-banner-s.png
  caption:
excerpt: 'ServiceComb is a microservice framework with full functionality of service management, focus on rapidly development of microservices.

<div class="excerpt-label">Latest release:</div>
<div class="button-group">
<a href="https://github.com/ServiceComb/java-chassis/releases/tag/0.3.0" class="home-button btn--info">Java SDK v0.3.0</a>
<a href="https://github.com/ServiceComb/service-center/releases/tag/0.2.0" class="home-button btn--info">Service Center v0.2.0</a>
<a href="https://github.com/ServiceComb/ServiceComb-Saga/releases/tag/saga-0.0.1" class="home-button btn--info">Saga v0.0.1</a>
</div>'

intro:
  - excerpt: "
<div class='excerpt-title'>Latest News</div>

<ul>
  <li>
    <a href='/docs/quick-start-dataconsistency/'>ServiceComb now provides data consistency solutions(Saga) in microservice application.</a>
  </li>
  <li class='line-end'>
    <a href='/docs/linuxcon-workshop-demo/'>In the recent LinuxCon Beijing 2017 conference, ServiceComb organized a workshop to demonstrate how to build a cloud application using ServiceComb.</a>
  </li>
</ul>"

feature_row:
  - image_path: /assets/images/servicecomb-feature-openapi.png
    alt: "Standard"
    title: "Service Contract"
    url: /users/service-contract/
    excerpt: "service contract gurantee based on [OpenAPI](https://www.openapis.org)"
  - image_path: /assets/images/servicecomb-feature-quickstart.png
    alt: "Efficient"
    title: "Rapid Development"
    url: /docs/quick-start/
    excerpt: "supports many service frameworks, speed up building of cloud applications"
  - image_path: /assets/images/servicecomb-feature-multiLanguage.png
    alt: "MultiLanguage"
    title: "Multiple Languages"
    excerpt: "supports both Java and Go"
---

{% include feature_row id="intro" type="center" %}

<div class="normal-feature-row">
{% include feature_row %}
</div>

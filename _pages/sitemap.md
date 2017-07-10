---
layout: archive
lang: en
ref: sitemap
title: "Sitemap"
permalink: /sitemap/
author_profile: false
---

A list of all the posts and pages found on the site. For you robots out there is an [XML version]({{ "sitemap.xml" | absolute_url }}) available for digesting as well.

<h2>Pages</h2>
{% assign pages = site.pages | where: "ref", page.ref | sort: "lang" %}
{% for page in pages %}
  <link rel="alternate" hreflang="{{ page.lang }}" href="{{ page.url }}" />
  {% include archive-single.html %}
{% endfor %}

<h2>Posts</h2>
{% assign posts = site.posts | where: "ref", page.ref | sort: "lang" %}
{% for post in posts %}
  <link rel="alternate" hreflang="{{ post.lang }}" href="{{ post.url }}" />
  {% include archive-single.html %}
{% endfor %}

{% capture written_label %}'None'{% endcapture %}

{% for collection in site.collections %}
{% unless collection.output == false or collection.label == "posts" %}
  {% capture label %}{{ collection.label }}{% endcapture %}
  {% if label != written_label %}
  <h2>{{ label }}</h2>
  {% capture written_label %}{{ label }}{% endcapture %}
  {% endif %}
{% endunless %}
{% for doc in collection.docs %}
  <link rel="alternate" hreflang="{{ doc.lang }}" href="{{ doc.url }}" />
  {% unless collection.output == false or collection.label == "posts" %}
  {% include archive-single.html %}
  {% endunless %}
{% endfor %}
{% endfor %}

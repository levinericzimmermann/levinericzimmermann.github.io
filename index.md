---
layout: base
title: Levin Eric Zimmermann
tagline: Page of composer and developer Levin Zimmermann
footer: 1
---

{% assign column_count = 3 %}

<div class="container">
{% for x in site.nav %}
  {% assign i = forloop.index | minus:1 | modulo:column_count %}
  {% if i == 0 %}
    <div class="row index-row">
  {% endif %}
    <div class="col">
        <h1><a class="fill-div" href="{{ x.link }}">{{ x.name | slice: 0 }}</a></h1>
    </div>
  {% assign control_value = i | plus:1 %}
  {% if control_value == column_count %}
    </div>
  {% endif %}
{% endfor %}
</div>

<h1 style="visibility: hidden;">Levin Eric Zimmermann</h1>

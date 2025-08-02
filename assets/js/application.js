---
scripts:
  - components/features/slide_animation.js
---
{% for script in page.scripts %}
    (function () {
        {% include_relative {{ script }} %}
    })();
{% endfor %}
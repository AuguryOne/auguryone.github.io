---
scripts:
  - vendored/jquery.js
  - vendored/bootstrap.min.js
  - vendored/jquery.easing.min.js
  - pages/guidance/guidance-hero-code-animation.js
  - pages/guidance/guidance-tabbed-capabilities.js
  - components/features/animated-svgs/guidance/github-integration-svg.js
  - components/features/slide_animation.js
  - components/common/navbar.js
---
{% for script in page.scripts %}
    (function () {
        {% include_relative {{ script }} %}
    })();
{% endfor %}
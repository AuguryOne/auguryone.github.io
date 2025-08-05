# Jekyll Codebase Refactoring Plan

## Overview
This plan outlines the complete refactoring of the current Jekyll codebase to achieve modular, maintainable components while preserving all existing styling and content. The refactor will consolidate CSS, extract reusable components, and implement Jekyll best practices.

## Current State Analysis

### Existing Structure
- **Main Pages**: index.html, pricing.html, guidance.html, intelligence.html, response.html
- **Layouts**: default.html (homepage), default-page.html (other pages)
- **Large Monolithic Includes**: guidance.html (1,684 lines), intelligence.html (1,220 lines), response.html (1,059 lines), pricing-content.html (867 lines)
- **Hero Sections**: guidance-hero.html (949 lines), intelligence-hero.html (95 lines), response-hero.html (84 lines)
- **CSS**: Single massive grayscale.css file (2,885 lines) with mixed styles
- **Features**: Partially componentized in `_includes/features/` with inconsistent organization

### Identified Repeated Patterns
1. **Headline Sections**: h2 + p + optional glow-text spans
2. **2x2 Grid Highlights**: Visual elements + content with configurable styling
3. **Platform Features**: Text + SVG animations (left/right positioning)
4. **Tabbed Panels**: Multi-discipline capability sections
5. **Pricing Sections**: Unique content per page

## Refactoring Steps

### Step 1: Project Preparation and Backup
1. **Document current functionality**
   - Document any dynamic behaviors or animations
   - Note all color variations and styling differences

### Step 2: Setup New Directory Structure

1. **Create new component directories**:
   ```
   _includes/
   ├── components/
   │   ├── common/
   │   │   ├── headline-section.html
   │   │   ├── grid-2x2.html
   │   │   └── hero-section.html
   │   ├── features/
   │   │   ├── feature-left.html
   │   │   ├── feature-right.html
   │   │   └── animated-svg/
   │   │       ├── guidance/
   │   │       ├── intelligence/
   │   │       └── response/
   │   ├── sections/
   │   │   ├── guidance/
   │   │   │   ├── tabbed-capabilities.html
   │   │   │   └── pricing.html
   │   │   ├── intelligence/
   │   │   │   ├── tabbed-capabilities.html
   │   │   │   └── pricing.html
   │   │   └── response/
   │   │       └── pricing.html
   │   └── layout/
   │       ├── navigation.html
   │       ├── header.html
   │       ├── footer.html
   │       └── base-scripts.html
   assets/
   ├── css/
   │   ├── application.css
   │   ├── components/
   │   │   ├── _common.scss
   │   │   ├── _navigation.scss
   │   │   ├── _headlines.scss
   │   │   ├── _grids.scss
   │   │   ├── _features.scss
   │   │   ├── _heroes.scss
   │   │   └── _buttons.scss
   │   ├── pages/
   │   │   ├── _homepage.scss
   │   │   ├── _guidance.scss
   │   │   ├── _intelligence.scss
   │   │   ├── _response.scss
   │   │   └── _pricing.scss
   │   └── vendors/
   │       └── _bootstrap.scss
   └── js/
       ├── application.js
       ├── components/
       └── pages/
   ```

2. **Rename unused files for cleanup**:
   - Identify unused CSS classes and mark files for deletion
   - Rename to `*-delete-me.*` format

### Step 3: Extract Common Components

#### 3.1: Create Headline Section Component
Create `_includes/components/common/headline-section.html`:
```html
<!-- Parameterized headline section -->
<div class="headline-section {{ include.section_class | default: '' }}">
    <div class="headline-content">
        <h2>
            {% if include.glow_text %}
                {{ include.headline | replace: include.glow_text, '<span class="glow-text">' | append: include.glow_text | append: '</span>' }}
            {% else %}
                {{ include.headline }}
            {% endif %}
        </h2>
        <p>{{ include.subtext }}</p>
    </div>
</div>
```

#### 3.2: Create 2x2 Grid Component
Create `_includes/components/common/grid-2x2.html`:
```html
<!-- Parameterized 2x2 highlights grid -->
<div class="platform-highlights {{ include.grid_class | default: '' }}">
    <div class="highlights-grid">
        {% for item in include.items %}
        <div class="highlight-item">
            <div class="highlight-separator" style="background-color: {{ item.separator_color | default: '#16a34a' }};"></div>
            <div class="highlight-visual">
                <div class="visual-element {{ item.visual_class }}"
                     style="
                       border-color: {{ item.icon_border_color | default: '#16a34a' }};
                       background-color: {{ item.icon_bg_color | default: 'transparent' }};
                       color: {{ item.icon_color | default: '#16a34a' }};
                     "
                     onmouseover="
                       this.style.borderColor='{{ item.icon_border_hover | default: item.icon_border_color | default: '#16a34a' }}';
                       this.style.backgroundColor='{{ item.icon_bg_hover | default: item.icon_bg_color | default: 'transparent' }}';
                       this.style.color='{{ item.icon_color_hover | default: item.icon_color | default: '#16a34a' }}';
                     "
                     onmouseout="
                       this.style.borderColor='{{ item.icon_border_color | default: '#16a34a' }}';
                       this.style.backgroundColor='{{ item.icon_bg_color | default: 'transparent' }}';
                       this.style.color='{{ item.icon_color | default: '#16a34a' }}';
                     ">
                    <i class="{{ item.icon_class }}"></i>
                </div>
            </div>
            <div class="highlight-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
            </div>
        </div>
        {% endfor %}
    </div>
</div>
```

#### 3.3: Create Feature Components
Create `_includes/components/features/feature-left.html`:
```html
<!-- Feature with text on left, animation on right -->
<div class="platform-feature scroll-animate {{ include.feature_class | default: '' }}" data-animation="slideInLeft">
    <div class="feature-content">
        <h3>{{ include.title }}</h3>
        <p>{{ include.description }}</p>
    </div>
    <div class="feature-animation">
        {% include {{ include.svg_include }} %}
    </div>
</div>
```

Create `_includes/components/features/feature-right.html`:
```html
<!-- Feature with animation on left, text on right -->
<div class="platform-feature scroll-animate {{ include.feature_class | default: '' }}" data-animation="slideInRight">
    <div class="feature-animation">
        {% include {{ include.svg_include }} %}
    </div>
    <div class="feature-content">
        <h3>{{ include.title }}</h3>
        <p>{{ include.description }}</p>
    </div>
</div>
```

#### 3.4: Create Hero Section Component
Create `_includes/components/common/hero-section.html`:
```html
<!-- Parameterized hero section -->
<header class="hero-section {{ include.hero_class | default: '' }}">
    {% if include.background_include %}
        {% include {{ include.background_include }} %}
    {% endif %}
    
    <div class="hero-content">
        <div class="hero-container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h1 class="hero-title animate-fadeInUp">
                        {% if include.highlight_text %}
                            {{ include.title | replace: include.highlight_text, '<span class="highlight-text">' | append: include.highlight_text | append: '</span>' }}
                        {% else %}
                            {{ include.title }}
                        {% endif %}
                    </h1>
                    
                    <p class="hero-subtitle animate-fadeInUp delay-1">
                        {{ include.subtitle }}
                    </p>
                    
                    {% if include.show_scroll_indicator %}
                    <div class="hero-see-more animate-fadeInUp delay-2">
                        <a href="#{{ include.scroll_target | default: 'content' }}" class="btn-see-more">
                            <div class="chevron-double">
                                <i class="fa fa-chevron-down chevron-1"></i>
                                <i class="fa fa-chevron-down chevron-2"></i>
                            </div>
                        </a>
                    </div>
                    {% endif %}
                </div>
            </div>
        </div>
        
        {% if include.logo_watermark %}
        <div class="hero-logo-bg">
            <img src="{{ include.logo_watermark }}" alt="Augury One" class="logo-watermark">
        </div>
        {% endif %}
        
        {% if include.show_particles %}
        <div class="floating-particles">
            <div class="particle particle-1"></div>
            <div class="particle particle-2"></div>
            <div class="particle particle-3"></div>
            <div class="particle particle-4"></div>
            <div class="particle particle-5"></div>
        </div>
        {% endif %}
    </div>
</header>

{% if include.show_scroll_indicator %}
<script>
document.addEventListener('DOMContentLoaded', function() {
    const seeMoreButton = document.querySelector('.hero-see-more .btn-see-more');
    if (seeMoreButton) {
        seeMoreButton.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#{{ include.scroll_target | default: 'content' }}');
            if (target) {
                const navbar = document.querySelector('.navbar-fixed-top');
                let navbarHeight = navbar ? navbar.offsetHeight : 0;
                const extraOffset = 20;
                const targetPosition = target.offsetTop - navbarHeight - extraOffset;
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    }
});
</script>
{% endif %}
```

### Step 4: Extract Page-Specific Components

#### 4.1: Extract Tabbed Capabilities Components
Move the tabbed panels from each page into dedicated components:
- `_includes/components/sections/guidance/tabbed-capabilities.html`
- `_includes/components/sections/intelligence/tabbed-capabilities.html`

#### 4.2: Extract Pricing Components
Move pricing sections into dedicated components:
- `_includes/components/sections/guidance/pricing.html`
- `_includes/components/sections/intelligence/pricing.html`
- `_includes/components/sections/response/pricing.html`

#### 4.3: Organize SVG Animation Components
Move and organize SVG animations:
- Create subdirectories for each page's animations
- Extract SVG content into separate includes
- Remove inline styling from SVGs

### Step 5: Consolidate and Reorganize CSS

#### 5.1: Setup SCSS Structure
1. **Install SCSS processing** (if not already configured)
2. **Create main application.scss**:
   ```scss
   // Vendors
   @import 'vendors/bootstrap';
   
   // Base styles
   @import 'components/common';
   
   // Components
   @import 'components/navigation';
   @import 'components/headlines';
   @import 'components/grids';
   @import 'components/features';
   @import 'components/heroes';
   @import 'components/buttons';
   
   // Pages
   @import 'pages/homepage';
   @import 'pages/guidance';
   @import 'pages/intelligence';
   @import 'pages/response';
   @import 'pages/pricing';
   ```

#### 5.2: Extract and Organize CSS
1. **Split grayscale.css into component files**:
   - Extract navigation styles → `_navigation.scss`
   - Extract typography and base styles → `_common.scss`
   - Extract component-specific styles into respective files
   - Extract page-specific styles into page files

2. **Remove unused CSS**:
   - Use CSS analysis tools to identify unused selectors
   - Mark unused files with `-delete-me` suffix
   - Document any styles that might be dynamically applied

3. **Clean up inline styles**:
   - Move all inline styles to appropriate CSS files
   - Remove all `<style>` tags from HTML files
   - Ensure component parameterization handles style variations

### Step 6: Refactor Page Templates

#### 6.1: Update Main Page Templates
Replace monolithic includes with component calls:

**guidance.html**:
```html
---
layout: default-page
title: Augury One - Guidance
---

{% include components/common/hero-section.html
   hero_class="guidance-hero"
   title="Software Security Guidance"
   subtitle="Monitor and remediate emerging vulnerabilities before attackers do."
   highlight_text="Guidance"
   show_scroll_indicator=true
   scroll_target="guidance"
   logo_watermark="/assets/img/augury_one_logo.png"
   show_particles=true
   background_include="components/backgrounds/guidance-hero-bg.html"
%}

{% include components/common/headline-section.html
   headline="Secure your software at every stage of development"
   subtext="Go beyond annual security reviews with on-demand guidance and secure code review delivered by expert security engineers."
   glow_text="every stage of development"
   section_class="guidance-headline-section"
%}

{% assign guidance_highlights = site.data.guidance.highlights %}
{% include components/common/grid-2x2.html
   items=guidance_highlights
   grid_class="guidance-platform-highlights"
%}

{% include components/sections/guidance/tabbed-capabilities.html %}

{% include components/common/headline-section.html
   headline="Maintain development velocity"
   subtext="Engage with expert security engineers within the Augury One platform and natively within GitHub."
   glow_text="velocity"
   section_class="guidance-headline-section"
%}

{% include components/features/feature-left.html
   title="GitHub Integration"
   description="Seamlessly integrate security reviews into your development workflow."
   svg_include="components/features/animated-svg/guidance/github-integration.html"
   feature_class="guidance-github-feature"
%}

<!-- Continue with other features and sections... -->

{% include components/sections/guidance/pricing.html %}
```

#### 6.2: Create Data Files
Create `_data/` files for component configurations:

**_data/guidance.yml**:
```yaml
highlights:
  - title: "Ship features, not vulnerabilities"
    description: "Embed real security engineers into your development process to find and help fix vulnerabilities before they reach production."
    icon_class: "fa fa-lightning"
    visual_class: "visual-element--lightning"
    separator_color: "#16a34a"
    icon_border_color: "#16a34a"
    icon_bg_color: "transparent"
    icon_color: "#16a34a"
    icon_border_hover: "#22c55e"
    icon_bg_hover: "rgba(34, 197, 94, 0.1)"
    icon_color_hover: "#22c55e"
  # ... other highlights
```

### Step 7: Update JavaScript and Asset Management

1. **Consolidate JavaScript files**:
   - Create `assets/js/application.js` as main entry point
   - Move component-specific JS into separate files
   - Implement proper module loading

2. **Update asset references**:
   - Update all CSS/JS references to use new asset structure
   - Ensure proper Jekyll asset pipeline integration

### Step 8: Testing and Validation

1. **Visual regression testing**:
   - Compare screenshots before and after refactor
   - Test all pages across different screen sizes
   - Verify all animations and interactions work

2. **Performance testing**:
   - Measure page load times
   - Verify CSS file sizes are reasonable
   - Test with Jekyll build

3. **Functionality testing**:
   - Test all navigation elements
   - Verify all forms and interactive elements
   - Test smooth scrolling and animations

### Step 9: Documentation and Cleanup

1. **Create component documentation**:
   - Document all component parameters
   - Provide usage examples
   - Create style guide

2. **Clean up marked files**:
   - Delete all files marked with `-delete-me`
   - Remove empty directories
   - Update `.gitignore` if needed

3. **Final validation**:
   - Run Jekyll build
   - Verify no broken links or missing assets
   - Test production deployment

## Target Directory Structure

```
/
├── _config.yml
├── index.html
├── pricing.html
├── guidance.html
├── intelligence.html
├── response.html
├── _layouts/
│   ├── default.html
│   └── default-page.html
├── _includes/
│   ├── components/
│   │   ├── common/
│   │   │   ├── headline-section.html
│   │   │   ├── grid-2x2.html
│   │   │   └── hero-section.html
│   │   ├── features/
│   │   │   ├── feature-left.html
│   │   │   ├── feature-right.html
│   │   │   └── animated-svg/
│   │   │       ├── guidance/
│   │   │       ├── intelligence/
│   │   │       └── response/
│   │   ├── sections/
│   │   │   ├── guidance/
│   │   │   ├── intelligence/
│   │   │   └── response/
│   │   ├── backgrounds/
│   │   │   ├── guidance-hero-bg.html
│   │   │   ├── intelligence-hero-bg.html
│   │   │   └── response-hero-bg.html
│   │   └── layout/
│   │       ├── navigation.html
│   │       ├── header.html
│   │       ├── footer.html
│   │       └── base-scripts.html
│   └── legacy/ (temporary, for reference during refactor)
├── _data/
│   ├── guidance.yml
│   ├── intelligence.yml
│   ├── response.yml
│   └── pricing.yml
├── assets/
│   ├── css/
│   │   ├── application.scss
│   │   ├── components/
│   │   │   ├── _common.scss
│   │   │   ├── _navigation.scss
│   │   │   ├── _headlines.scss
│   │   │   ├── _grids.scss
│   │   │   ├── _features.scss
│   │   │   ├── _heroes.scss
│   │   │   └── _buttons.scss
│   │   ├── pages/
│   │   │   ├── _homepage.scss
│   │   │   ├── _guidance.scss
│   │   │   ├── _intelligence.scss
│   │   │   ├── _response.scss
│   │   │   └── _pricing.scss
│   │   └── vendors/
│   │       └── _bootstrap.scss
│   └── js/
│       ├── application.js
│       ├── components/
│       │   ├── navigation.js
│       │   ├── smooth-scroll.js
│       │   └── animations.js
│       └── pages/
│           ├── guidance.js
│           ├── intelligence.js
│           └── response.js
├── img/
├── css/ (legacy - mark for deletion)
└── js/ (legacy - mark for deletion)
```

## File Placement Instructions

### Assets Directory (`assets/`)
- **Main CSS**: `assets/css/application.scss`
- **Component Styles**: `assets/css/components/_*.scss`
- **Page Styles**: `assets/css/pages/_*.scss`
- **Vendor Styles**: `assets/css/vendors/_*.scss`
- **Main JS**: `assets/js/application.js`
- **Component JS**: `assets/js/components/*.js`
- **Page JS**: `assets/js/pages/*.js`

### Components Directory (`_includes/components/`)
- **Common Components**: Reusable across multiple pages
- **Feature Components**: Platform feature presentations
- **Section Components**: Page-specific sections that don't need parameterization
- **Background Components**: Complex background animations and effects
- **Layout Components**: Navigation, header, footer, scripts

### Data Directory (`_data/`)
- **Page Configuration**: YAML files containing component parameters
- **Content Data**: Structured content for grid items, features, etc.

### Legacy Cleanup
- **Mark for Deletion**: Add `-delete-me` suffix to unused files
- **Temporary Reference**: Move large existing includes to `_includes/legacy/` during transition
- **Final Cleanup**: Remove all legacy files after successful testing

## Success Criteria

### Functional Requirements
- [ ] All pages render identically to current state
- [ ] All animations and interactions work as before
- [ ] All styling matches current design
- [ ] No broken links or missing assets
- [ ] Fast Jekyll build times

### Technical Requirements
- [ ] Single consolidated CSS file (`application.css`)
- [ ] No inline styles or `<style>` tags
- [ ] Modular, reusable components
- [ ] Parameterized component configurations
- [ ] Clean, organized directory structure
- [ ] Follows Jekyll best practices

### Maintenance Requirements
- [ ] Components are easily configurable
- [ ] New pages can reuse existing components
- [ ] CSS is organized and maintainable
- [ ] Code is well-documented
- [ ] Unused files are marked for deletion

This plan ensures a systematic, low-risk refactoring that maintains all existing functionality while achieving the desired modular architecture. 
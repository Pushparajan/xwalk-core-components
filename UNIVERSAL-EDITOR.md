# Universal Editor & JCR Integration Guide

Complete guide to using XWalk Core Components with Adobe Experience Manager Universal Editor and JCR repository integration.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [AEM Connection Setup](#aem-connection-setup)
4. [Universal Editor Instrumentation](#universal-editor-instrumentation)
5. [JCR Repository Structure](#jcr-repository-structure)
6. [Component Models](#component-models)
7. [Block Development with Universal Editor](#block-development-with-universal-editor)
8. [Best Practices](#best-practices)

## Overview

### What is XWalk?

XWalk (Crosswalk) is a powerful content authoring and delivery solution that combines:

- **AEM JCR Repository** - Robust content storage in Adobe Experience Manager
- **Edge Delivery Services** - Lightning-fast content delivery via CDN
- **Universal Editor** - WYSIWYG authoring with real-time preview
- **GitHub Code** - Version-controlled blocks, scripts, and styles

### Data Flow

```
Author → Universal Editor → AEM JCR → Publish → Edge Delivery → End User
                              ↓                        ↓
                         /content/xwalk/*      GitHub blocks/scripts
```

## Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Universal Editor                           │
│            https://experience.adobe.com/#/aem                 │
│                 (WYSIWYG Authoring UI)                        │
└────────────────────────┬─────────────────────────────────────┘
                         │ data-aue-* attributes
                         ▼
┌──────────────────────────────────────────────────────────────┐
│               AEM Author (JCR Repository)                     │
│         https://author-p12345-e67890.adobeaemcloud.com        │
│                                                               │
│  Content Structure:                                           │
│  /content/xwalk/                                              │
│    ├── en/                                                    │
│    │   ├── home/jcr:content/root/                            │
│    │   │   ├── section1/ (sling:resourceType)                │
│    │   │   │   ├── hero/ (component)                         │
│    │   │   │   │   ├── image (String)                        │
│    │   │   │   │   ├── imageAlt (String)                     │
│    │   │   │   │   └── text (String - HTML)                  │
│    │   │   ├── section2/                                     │
│    │   │   │   └── cards/ (container)                        │
│    │   │   │       ├── card1/                                │
│    │   │   │       ├── card2/                                │
│    │   │   │       └── card3/                                │
└────────────────────────┬─────────────────────────────────────┘
                         │ publish event
                         ▼
┌──────────────────────────────────────────────────────────────┐
│            Edge Delivery Services (GitHub)                    │
│        https://main--xwalk--username.hlx.page                 │
│                                                               │
│  Code Structure:                                              │
│  blocks/                                                      │
│    ├── hero/                                                  │
│    │   ├── hero.js (decorate function)                       │
│    │   └── hero.css                                          │
│    ├── cards/                                                 │
│    │   ├── cards.js                                          │
│    │   └── cards.css                                         │
│  scripts/                                                     │
│    ├── aem.js (utilities)                                    │
│    └── scripts.js (main logic)                               │
│  styles/styles.css                                            │
└──────────────────────────────────────────────────────────────┘
```

## AEM Connection Setup

### 1. Configure AEM Connection

Add the connection metadata in your HTML `<head>`:

```html
<meta name="urn:adobe:aem:editor:aemconnection"
      content="aem:https://author-p12345-e67890.adobeaemcloud.com">
```

Replace `p12345` with your Program ID and `e67890` with your Environment ID.

### 2. Environment-Specific Configuration

For different environments:

```html
<!-- Development -->
<meta name="urn:adobe:aem:editor:aemconnection"
      content="aem:https://author-p12345-e67890.adobeaemcloud.com">

<!-- Staging -->
<meta name="urn:adobe:aem:editor:aemconnection"
      content="aem:https://author-p12345-e98765.adobeaemcloud.com">

<!-- Production -->
<meta name="urn:adobe:aem:editor:aemconnection"
      content="aem:https://author-p12345-e11111.adobeaemcloud.com">
```

## Universal Editor Instrumentation

### Core Data-AUE Attributes

#### data-aue-resource

Identifies the JCR node where content is stored:

```html
<div data-aue-resource="urn:aemconnection:/content/xwalk/en/home/jcr:content/root/hero">
  <!-- Content -->
</div>
```

#### data-aue-type

Defines how the element should be treated:

- `container` - Can contain other components
- `component` - A single component instance
- `reference` - Reference to another resource

```html
<!-- Container -->
<div data-aue-type="container" data-aue-filter="content">

<!-- Component -->
<div data-aue-type="component" data-aue-model="hero">

<!-- Reference -->
<img data-aue-type="reference">
```

#### data-aue-prop

Maps to the JCR property name:

```html
<!-- Stores value in JCR property "title" -->
<h1 data-aue-prop="title" data-aue-type="text">My Title</h1>

<!-- Stores HTML in JCR property "text" -->
<div data-aue-prop="text" data-aue-type="richtext">
  <p>Rich text content</p>
</div>

<!-- Stores image path in JCR property "image" -->
<img data-aue-prop="image" data-aue-type="media" src="/image.jpg">
```

#### data-aue-model

References the component model definition from `component-models.json`:

```html
<div data-aue-model="hero">
  <!-- Fields defined in hero model -->
</div>
```

#### data-aue-label

Display name shown in Universal Editor UI:

```html
<div data-aue-label="Hero Banner">
  <!-- Shows as "Hero Banner" in editor -->
</div>
```

#### data-aue-filter

Defines which components can be added to a container:

```html
<!-- Only components with filter "content" can be added -->
<div data-aue-filter="content">

<!-- Only card items can be added -->
<div data-aue-filter="card">
```

### Complete Example

```html
<!-- Section Container -->
<div data-aue-resource="urn:aemconnection:/content/xwalk/en/home/jcr:content/root/section1"
     data-aue-type="container"
     data-aue-label="Hero Section"
     data-aue-model="section"
     data-aue-filter="content">

  <!-- Hero Component -->
  <div class="hero"
       data-aue-resource="urn:aemconnection:/content/xwalk/en/home/jcr:content/root/section1/hero"
       data-aue-type="component"
       data-aue-label="Hero"
       data-aue-model="hero">

    <!-- Two-column layout -->
    <div>
      <!-- Image Column -->
      <div>
        <picture data-aue-prop="image" data-aue-type="media">
          <img src="/hero.jpg"
               alt="Hero image"
               data-aue-prop="imageAlt"
               data-aue-type="text">
        </picture>
      </div>

      <!-- Text Column -->
      <div data-aue-prop="text" data-aue-type="richtext">
        <h1>Welcome to XWalk</h1>
        <p>Build amazing experiences with AEM and Edge Delivery.</p>
      </div>
    </div>
  </div>
</div>
```

## JCR Repository Structure

### Content Tree

```
/content/xwalk/
├── en/                                    [cq:Page]
│   ├── jcr:content                       [cq:PageContent]
│   │   ├── jcr:title: "English Home"
│   │   ├── jcr:description: "Home page"
│   │   └── root/                         [nt:unstructured]
│   │       ├── section1/                 [nt:unstructured]
│   │       │   ├── name: "hero-section"
│   │       │   ├── style: "highlight"
│   │       │   └── hero/                 [nt:unstructured]
│   │       │       ├── sling:resourceType: "core/franklin/components/block/v1/block"
│   │       │       ├── image: "/content/dam/xwalk/hero.jpg"
│   │       │       ├── imageAlt: "Hero image"
│   │       │       └── text: "<h1>Welcome</h1><p>Content</p>"
│   │       ├── section2/                 [nt:unstructured]
│   │       │   └── cards/                [nt:unstructured]
│   │       │       ├── classes: "cards"
│   │       │       ├── card1/            [nt:unstructured]
│   │       │       │   ├── image: "/content/dam/xwalk/card1.jpg"
│   │       │       │   └── text: "<h3>Title</h3><p>Description</p>"
│   │       │       ├── card2/            [nt:unstructured]
│   │       │       └── card3/            [nt:unstructured]
│   ├── products/                         [cq:Page]
│   │   └── jcr:content
│   │       └── root/
│   └── about/                            [cq:Page]
│       └── jcr:content
│           └── root/
├── fr/                                    [cq:Page]
│   └── ...
└── de/                                    [cq:Page]
    └── ...
```

### Node Types

- **`cq:Page`** - Page node
- **`cq:PageContent`** - Page content node (jcr:content)
- **`nt:unstructured`** - Generic content node
- **`sling:resourceType`** - Component type reference

### Properties

```javascript
// Example JCR properties
{
  "jcr:primaryType": "nt:unstructured",
  "sling:resourceType": "core/franklin/components/block/v1/block",
  "jcr:title": "Welcome Hero",
  "image": "/content/dam/xwalk/images/hero.jpg",
  "imageAlt": "Welcome to our site",
  "text": "<h1>Welcome to XWalk</h1><p>Build amazing experiences.</p>",
  "jcr:created": "2025-01-20T10:30:00.000Z",
  "jcr:createdBy": "admin",
  "jcr:lastModified": "2025-01-20T15:45:00.000Z",
  "jcr:lastModifiedBy": "author"
}
```

## Component Models

### Model Definition Structure

In `component-models.json`:

```json
{
  "models": [
    {
      "id": "hero",
      "fields": [
        {
          "component": "reference",
          "name": "image",
          "label": "Image",
          "valueType": "string",
          "multi": false
        },
        {
          "component": "text",
          "name": "imageAlt",
          "label": "Image Alt Text",
          "valueType": "string"
        },
        {
          "component": "richtext",
          "name": "text",
          "label": "Text",
          "valueType": "string"
        }
      ]
    }
  ]
}
```

### Field Component Types

| Component Type | Description | Value Type | Example Usage |
|---------------|-------------|------------|---------------|
| `text` | Single-line text input | string | Titles, labels, short text |
| `richtext` | HTML editor | string | Paragraphs, formatted content |
| `reference` | Asset/page reference | string | Images, documents, links |
| `select` | Dropdown selection | string/number | Type, style, variant |
| `multiselect` | Multiple selections | string | Tags, categories, classes |
| `boolean` | Checkbox | boolean | Flags, toggles |
| `number` | Numeric input | number | Counts, dimensions |
| `aem-content` | Content fragment/page | string | References to other content |

### Example Models

#### Button Model

```json
{
  "id": "button",
  "fields": [
    {
      "component": "aem-content",
      "name": "link",
      "label": "Link"
    },
    {
      "component": "text",
      "name": "text",
      "label": "Text",
      "valueType": "string"
    },
    {
      "component": "select",
      "name": "type",
      "label": "Type",
      "valueType": "string",
      "value": "",
      "options": [
        { "name": "default", "value": "" },
        { "name": "primary", "value": "primary" },
        { "name": "secondary", "value": "secondary" }
      ]
    }
  ]
}
```

#### Cards Container Model

```json
{
  "id": "cards",
  "fields": [
    {
      "component": "text",
      "name": "classes",
      "label": "CSS Classes",
      "valueType": "string"
    }
  ]
}
```

## Block Development with Universal Editor

### Preserving Instrumentation

Use `moveInstrumentation()` to transfer `data-aue-*` attributes when transforming DOM:

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Transfer data-aue-* attributes from row to li
    moveInstrumentation(row, li);

    // Move children
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    ul.append(li);
  });

  // Optimize images and preserve instrumentation
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);

    // Transfer data-aue-* from original img to optimized img
    moveInstrumentation(img, optimizedPic.querySelector('img'));

    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}
```

### Cards Block Example

```javascript
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Preserve Universal Editor instrumentation
    moveInstrumentation(row, li);

    while (row.firstElementChild) li.append(row.firstElementChild);

    // Add classes based on content
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    ul.append(li);
  });

  block.replaceChildren(ul);
}
```

### Hero Block Example

```javascript
export default function decorate(block) {
  const heading = block.querySelector('h1');
  const picture = block.querySelector('picture');

  // Create semantic structure while preserving instrumentation
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  const heroMedia = document.createElement('div');
  heroMedia.className = 'hero-media';

  // Move elements and preserve data-aue attributes
  if (heading) {
    moveInstrumentation(heading.closest('div'), heroContent);
    heroContent.append(heading);
  }

  if (picture) {
    moveInstrumentation(picture.closest('div'), heroMedia);
    heroMedia.append(picture);
  }

  block.replaceChildren(heroMedia, heroContent);
}
```

## Best Practices

### 1. Always Use moveInstrumentation()

```javascript
// ✅ Correct - Preserves data-aue attributes
const newElement = document.createElement('div');
moveInstrumentation(oldElement, newElement);

// ❌ Wrong - Loses Universal Editor functionality
const newElement = document.createElement('div');
newElement.innerHTML = oldElement.innerHTML;
```

### 2. Resource URN Naming

```javascript
// ✅ Good - Clear hierarchy
data-aue-resource="urn:aemconnection:/content/xwalk/en/home/jcr:content/root/section1/hero"

// ❌ Bad - Missing structure
data-aue-resource="urn:aemconnection:/content/hero"
```

### 3. Component vs Container

```html
<!-- Container - can hold multiple components -->
<div data-aue-type="container" data-aue-filter="content">
  <div data-aue-type="component">...</div>
  <div data-aue-type="component">...</div>
</div>

<!-- Component - single item -->
<div data-aue-type="component" data-aue-model="hero">
  <!-- Component content -->
</div>
```

### 4. Semantic HTML with Instrumentation

```html
<!-- ✅ Good - Semantic HTML with proper instrumentation -->
<article data-aue-resource="..." data-aue-type="component" data-aue-model="article">
  <header>
    <h1 data-aue-prop="title" data-aue-type="text">Title</h1>
  </header>
  <div data-aue-prop="content" data-aue-type="richtext">
    <p>Content...</p>
  </div>
</article>

<!-- ❌ Bad - Divitis without semantics -->
<div data-aue-resource="..." data-aue-type="component">
  <div>
    <div data-aue-prop="title">Title</div>
  </div>
</div>
```

### 5. Model Field Names Match JCR Properties

```json
// component-models.json
{
  "id": "hero",
  "fields": [
    { "name": "image", "component": "reference" },    // Stores in JCR as "image"
    { "name": "imageAlt", "component": "text" },      // Stores in JCR as "imageAlt"
    { "name": "text", "component": "richtext" }       // Stores in JCR as "text"
  ]
}
```

```html
<!-- HTML must use same property names -->
<div data-aue-model="hero">
  <img data-aue-prop="image" data-aue-type="media">
  <img data-aue-prop="imageAlt" data-aue-type="text">
  <div data-aue-prop="text" data-aue-type="richtext">
</div>
```

## Resources

- [Universal Editor Documentation](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/developer-overview)
- [Universal Editor Attributes](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/attributes-types)
- [Component Model Definitions](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/field-types)
- [AEM Edge Delivery Services](https://www.aem.live/developer/tutorial)
- [Creating Blocks for Universal Editor](https://www.aem.live/developer/universal-editor-blocks)

---

**Next Steps:**

1. Review `sample-page.html` for complete working example
2. Explore `component-models.json` for all available models
3. Check `component-definition.json` for component registration
4. Start building your first Universal Editor-enabled block!

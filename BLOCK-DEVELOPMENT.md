# Block Development Best Practices

Complete guide for developing blocks that work seamlessly with AEM Edge Delivery Services and Universal Editor.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Required Imports](#required-imports)
3. [Universal Editor Instrumentation](#universal-editor-instrumentation)
4. [Image Optimization](#image-optimization)
5. [Block Patterns](#block-patterns)
6. [Accessibility](#accessibility)
7. [Performance](#performance)
8. [Testing](#testing)

## Core Principles

### 1. Always Preserve Universal Editor Instrumentation

**Critical**: Use `moveInstrumentation()` whenever you create new elements or transform the DOM.

```javascript
import { moveInstrumentation } from '../../scripts/scripts.js';

// ✅ Correct - Preserves data-aue-* attributes
const newElement = document.createElement('div');
moveInstrumentation(oldElement, newElement);

// ❌ Wrong - Loses Universal Editor functionality
const newElement = document.createElement('div');
newElement.innerHTML = oldElement.innerHTML;
```

### 2. Always Optimize Images

Use `createOptimizedPicture()` for all images to enable WebP conversion and responsive sizing.

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

// Optimize images
block.querySelectorAll('picture > img').forEach((img) => {
  const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  moveInstrumentation(img, optimizedPic.querySelector('img'));
  img.closest('picture').replaceWith(optimizedPic);
});
```

### 3. Use Semantic HTML

Prefer semantic HTML elements over generic divs:

```javascript
// ✅ Good - Semantic
const article = document.createElement('article');
const nav = document.createElement('nav');
const header = document.createElement('header');

// ❌ Bad - Generic
const div1 = document.createElement('div');
const div2 = document.createElement('div');
```

## Required Imports

Every block should import necessary utilities:

```javascript
// For image optimization
import { createOptimizedPicture } from '../../scripts/aem.js';

// For Universal Editor support
import { moveInstrumentation } from '../../scripts/scripts.js';

// Optional: For utility functions
import { toClassName, toCamelCase } from '../../scripts/aem.js';
```

## Universal Editor Instrumentation

### moveInstrumentation() Usage Patterns

#### Pattern 1: Simple Element Replacement

```javascript
export default function decorate(block) {
  const newContainer = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Transfer data-aue-* attributes
    moveInstrumentation(row, li);

    while (row.firstElementChild) li.append(row.firstElementChild);
    newContainer.append(li);
  });

  block.replaceChildren(newContainer);
}
```

#### Pattern 2: Image Optimization

```javascript
// Always preserve instrumentation when optimizing images
const img = picture.querySelector('img');
const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);

// Transfer data-aue-* from original to optimized
moveInstrumentation(img, optimizedPic.querySelector('img'));

img.closest('picture').replaceWith(optimizedPic);
```

#### Pattern 3: Complex DOM Transformation

```javascript
export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'block-wrapper';

  [...block.children].forEach((row) => {
    const item = document.createElement('article');

    // Preserve instrumentation first
    moveInstrumentation(row, item);

    // Then transform content
    const heading = row.querySelector('h1, h2, h3');
    const content = row.querySelector('p');

    if (heading) item.append(heading);
    if (content) item.append(content);

    wrapper.append(item);
  });

  block.replaceChildren(wrapper);
}
```

## Image Optimization

### Basic Image Optimization

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false, // eager loading (use true for lazy)
      [{ width: '750' }] // breakpoints
    );

    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
```

### Multiple Breakpoints

```javascript
// Responsive images with multiple breakpoints
const breakpoints = [
  { media: '(min-width: 400px)', width: '2000' },
  { width: '750' }
];

const optimizedPic = createOptimizedPicture(img.src, img.alt, false, breakpoints);
```

### Eager vs Lazy Loading

```javascript
// Eager loading (for hero images, above the fold)
createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);

// Lazy loading (for images below the fold)
createOptimizedPicture(img.src, img.alt, true, [{ width: '750' }]);
```

## Block Patterns

### Pattern 1: Cards/Grid Layout

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Preserve instrumentation
    moveInstrumentation(row, li);

    // Move content
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Add semantic classes
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}
```

### Pattern 2: Hero/Banner

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Optimize hero image
  const picture = block.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // Eager loading for hero image
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { media: '(min-width: 600px)', width: '2000' },
        { width: '750' }
      ]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);
    }
  }

  // Add semantic structure
  const content = block.querySelector('div:nth-child(2)');
  if (content) {
    content.classList.add('hero-content');
  }
}
```

### Pattern 3: Accordion/Collapsible

```javascript
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // Create semantic details/summary
    const details = document.createElement('details');
    const summary = document.createElement('summary');

    // Preserve instrumentation on details
    moveInstrumentation(row, details);

    // Build structure
    const label = row.children[0];
    const body = row.children[1];

    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    body.className = 'accordion-item-body';

    details.className = 'accordion-item';
    details.append(summary, body);

    row.replaceWith(details);
  });
}
```

### Pattern 4: Tabs

```javascript
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].map((child) => child.firstElementChild);

  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);
    const tabpanel = block.children[i];

    // Store original for instrumentation
    const originalPanel = tabpanel.cloneNode(true);

    // Configure tabpanel
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('role', 'tabpanel');

    // Preserve instrumentation
    moveInstrumentation(originalPanel, tabpanel);

    // Create tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);

    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}
```

### Pattern 5: Columns

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Add column count class
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Identify image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
```

## Accessibility

### ARIA Attributes

Always add proper ARIA attributes for interactive components:

```javascript
// Tabs
tablist.setAttribute('role', 'tablist');
button.setAttribute('role', 'tab');
tabpanel.setAttribute('role', 'tabpanel');
tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
button.setAttribute('aria-controls', `tabpanel-${id}`);

// Accordion
details.setAttribute('role', 'region');
summary.setAttribute('role', 'button');

// Carousel
block.setAttribute('role', 'region');
block.setAttribute('aria-roledescription', 'Carousel');
```

### Keyboard Navigation

Ensure keyboard accessibility:

```javascript
button.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    button.click();
  }
});
```

### Focus Management

Manage focus for dynamic content:

```javascript
// When showing a tab
tabpanel.setAttribute('aria-hidden', false);
tabpanel.querySelector('a, button, input')?.focus();
```

## Performance

### Lazy Loading

Defer non-critical content:

```javascript
// Load block dependencies lazily
const module = await import('./dependencies.js');

// Lazy load images below the fold
const optimizedPic = createOptimizedPicture(img.src, img.alt, true, breakpoints);
```

### Minimize DOM Manipulation

```javascript
// ✅ Good - Single reflow
const fragment = document.createDocumentFragment();
items.forEach(item => fragment.append(item));
container.append(fragment);

// ❌ Bad - Multiple reflows
items.forEach(item => container.append(item));
```

### Avoid Layout Thrashing

```javascript
// ✅ Good - Batch reads and writes
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => el.style.height = `${heights[i]}px`);

// ❌ Bad - Interleaved reads and writes
elements.forEach(el => {
  const height = el.offsetHeight; // read
  el.style.height = `${height}px`; // write
});
```

## Testing

### Manual Testing Checklist

- [ ] Universal Editor: Open page in Universal Editor and verify in-context editing works
- [ ] Instrumentation: Check that `data-aue-*` attributes are preserved after decoration
- [ ] Images: Verify images are optimized (check for `<source>` with WebP)
- [ ] Responsive: Test on mobile, tablet, and desktop viewports
- [ ] Accessibility: Test with screen reader and keyboard navigation
- [ ] Performance: Check Lighthouse score (should be 90+)

### Testing in Universal Editor

1. Open your page in AEM Universal Editor
2. Click on block elements
3. Verify properties panel shows correct fields
4. Make edits and verify they persist to JCR
5. Refresh page and verify edits are preserved

### Testing Image Optimization

```bash
# Check if images are optimized
curl -I https://your-site.hlx.page/image.jpg
# Should redirect to WebP format

# Verify responsive images
# Inspect HTML - should see <picture> with multiple <source>
```

## Common Mistakes to Avoid

### ❌ Don't: Forget moveInstrumentation

```javascript
// This breaks Universal Editor
const newElement = document.createElement('div');
newElement.innerHTML = oldElement.innerHTML;
```

### ❌ Don't: Skip Image Optimization

```javascript
// Missing optimization - images won't be WebP or responsive
const img = block.querySelector('img');
// ... use img directly
```

### ❌ Don't: Use innerHTML for Complex Structures

```javascript
// Loses event listeners and instrumentation
block.innerHTML = '<div>...</div>';
```

### ❌ Don't: Ignore Accessibility

```javascript
// Missing ARIA attributes
const button = document.createElement('button');
// ... no role, aria-label, etc.
```

## Block Template

Use this template for new blocks:

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the [block-name] block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // 1. Transform DOM structure
  const container = document.createElement('div');
  container.className = '[block-name]-container';

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    item.className = '[block-name]-item';

    // Preserve Universal Editor instrumentation
    moveInstrumentation(row, item);

    // Move content
    while (row.firstElementChild) {
      item.append(row.firstElementChild);
    }

    container.append(item);
  });

  // 2. Optimize images
  container.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false, // eager (use true for lazy)
      [{ width: '750' }]
    );
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // 3. Replace block content
  block.replaceChildren(container);

  // 4. Add event listeners (if needed)
  // block.addEventListener('click', handleClick);
}
```

## Resources

- [AEM Edge Delivery Services](https://www.aem.live/developer/tutorial)
- [Block Collection](https://www.aem.live/developer/block-collection)
- [Universal Editor Blocks](https://www.aem.live/developer/universal-editor-blocks)
- [adobe-rnd/aem-boilerplate-xwalk](https://github.com/adobe-rnd/aem-boilerplate-xwalk)

---

**Remember**: Every block must:
1. ✅ Use `moveInstrumentation()` for all DOM transformations
2. ✅ Use `createOptimizedPicture()` for all images
3. ✅ Include proper ARIA attributes for accessibility
4. ✅ Use semantic HTML elements
5. ✅ Test in Universal Editor before committing

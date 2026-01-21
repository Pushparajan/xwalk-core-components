# Starbucks Design System

Complete Starbucks brand guidelines applied to XWalk Core Components.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Border Radius](#border-radius)
5. [Shadows](#shadows)
6. [Buttons](#buttons)
7. [Section Styles](#section-styles)
8. [Component Styling](#component-styling)

## Color Palette

### Primary Colors

**Starbucks Green** - The iconic brand color
```css
--starbucks-green: #00704a;
--starbucks-green-dark: #00522e;  /* Hover states */
--starbucks-green-light: #00865a; /* Lighter variant */
```

**Usage:**
- Primary buttons
- Links
- Call-to-action elements
- Brand accents

### Neutral Colors

**Starbucks Black** - Deep, warm black for text
```css
--starbucks-black: #1e3932;
```

**Usage:**
- Body text
- Headings
- Dark sections

**Starbucks Cream** - Warm off-white background
```css
--starbucks-cream: #f2f0eb;
```

**Usage:**
- Light section backgrounds
- Card backgrounds
- Alternating sections

### Accent Colors

**Starbucks Tan**
```css
--starbucks-tan: #d4c5a9;
```

**Usage:**
- Disabled states
- Subtle accents

**Starbucks Gold**
```css
--starbucks-gold: #cba258;
```

**Usage:**
- Premium features
- Rewards
- Special callouts

### Color Usage Examples

```html
<!-- Green section -->
<div class="section green">
  <h2>Welcome to Our Store</h2>
  <p>Premium coffee experience</p>
</div>

<!-- Dark section -->
<div class="section dark">
  <h2>About Our Coffee</h2>
</div>

<!-- Cream background -->
<div class="section light">
  <h2>Our Menu</h2>
</div>
```

## Typography

### Font Families

**Primary Font Stack**
```css
--body-font-family: 'Helvetica Neue', helvetica, arial, sans-serif;
--heading-font-family: 'Helvetica Neue', helvetica, arial, sans-serif;
```

Starbucks uses custom fonts (SoDo Sans, Lander, Pike) but we use Helvetica Neue as the web fallback which closely matches their aesthetic.

### Font Sizes

**Headings**
```css
--heading-font-size-xxl: 50px;  /* h1 - Mobile */
--heading-font-size-xl: 40px;   /* h2 */
--heading-font-size-l: 32px;    /* h3 */
--heading-font-size-m: 24px;    /* h4 */
--heading-font-size-s: 20px;    /* h5 */
--heading-font-size-xs: 18px;   /* h6 */
```

**Desktop (900px+)**
```css
--heading-font-size-xxl: 48px;
--heading-font-size-xl: 36px;
--heading-font-size-l: 28px;
```

**Body Text**
```css
--body-font-size-m: 19px;   /* Mobile */
--body-font-size-s: 16px;
--body-font-size-xs: 14px;

/* Desktop */
--body-font-size-m: 16px;
--body-font-size-s: 14px;
--body-font-size-xs: 12px;
```

### Font Weights

- **Headings:** 600-700 (Semi-bold to Bold)
- **Body:** 400 (Regular)
- **Buttons:** 600 (Semi-bold)
- **Emphasis:** 600 (Semi-bold)

### Typography Best Practices

```html
<!-- Large heading -->
<h1>Discover Your Perfect Cup</h1>

<!-- Accent text with color -->
<p class="accent-text">New Seasonal Favorites</p>

<!-- Gold text for premium -->
<p class="gold-text">Starbucks Rewards</p>
```

## Spacing

Consistent spacing system based on 8px grid:

```css
--spacing-xs: 8px;    /* Tight spacing */
--spacing-s: 16px;    /* Small spacing */
--spacing-m: 24px;    /* Medium spacing */
--spacing-l: 40px;    /* Large spacing */
--spacing-xl: 64px;   /* Extra large spacing */
```

### Usage

```css
/* Section padding */
padding: var(--spacing-xl) 0;

/* Card margin */
margin: var(--spacing-m);

/* Button padding */
padding: 12px 24px; /* Custom for buttons */
```

## Border Radius

Starbucks uses generous rounded corners throughout their design:

```css
--border-radius-s: 8px;     /* Small elements */
--border-radius-m: 16px;    /* Cards, sections */
--border-radius-l: 24px;    /* Large containers */
--border-radius-full: 50px; /* Buttons, pills */
```

### Examples

```css
/* Button - fully rounded */
border-radius: var(--border-radius-full);

/* Card - medium rounded */
border-radius: var(--border-radius-m);

/* Hero section - large rounded */
border-radius: var(--border-radius-l);
```

## Shadows

Three-tier shadow system for depth:

```css
--shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
--shadow-heavy: 0 8px 24px rgba(0, 0, 0, 0.2);
```

### Usage

- **Light:** Default cards, buttons
- **Medium:** Hover states, elevated cards
- **Heavy:** Modals, dropdowns

```css
/* Card default state */
box-shadow: var(--shadow-light);

/* Card hover state */
box-shadow: var(--shadow-medium);
```

## Buttons

### Primary Button (Green)

```html
<a href="#" class="button">Order Now</a>
<button>Add to Cart</button>
```

**Style:**
- Background: Starbucks Green (#00704a)
- Text: White
- Border radius: 50px (fully rounded)
- Padding: 12px 24px
- Font weight: 600
- Shadow: Light
- Hover: Darker green with medium shadow and slight lift

### Secondary Button (Outlined)

```html
<a href="#" class="button secondary">Learn More</a>
<button class="secondary">View Details</button>
```

**Style:**
- Background: Transparent
- Border: 2px solid Starbucks Green
- Text: Starbucks Green
- Hover: Filled with Starbucks Green

### Tertiary Button (Black)

```html
<a href="#" class="button tertiary">Join Rewards</a>
<button class="tertiary">Sign In</button>
```

**Style:**
- Background: Starbucks Black (#1e3932)
- Text: White
- Hover: Slightly lighter black

### Button Interactions

```css
/* Hover effect */
transform: translateY(-1px);
box-shadow: var(--shadow-medium);

/* Disabled state */
background-color: var(--starbucks-tan);
opacity: 0.6;
cursor: not-allowed;
```

## Section Styles

### Default Section

```html
<div class="section">
  <h2>Our Coffee</h2>
  <p>Content goes here</p>
</div>
```

**Style:**
- Background: White
- Max-width: 1440px
- Padding: 64px 24px

### Light/Cream Section

```html
<div class="section light">
  <h2>Featured Products</h2>
</div>
```

**Style:**
- Background: Starbucks Cream (#f2f0eb)
- Full-width
- Padding: 64px 0

### Dark Section

```html
<div class="section dark">
  <h2>Premium Experience</h2>
  <p>White text on dark background</p>
</div>
```

**Style:**
- Background: Starbucks Black (#1e3932)
- Text: White
- All headings: White

### Green Section

```html
<div class="section green">
  <h2>Sustainability</h2>
  <p>Our commitment to the planet</p>
</div>
```

**Style:**
- Background: Starbucks Green (#00704a)
- Text: White
- All headings: White

## Component Styling

### Cards

```html
<div class="cards">
  <ul>
    <li>
      <div class="cards-card-image">
        <img src="product.jpg" alt="Product">
      </div>
      <div class="cards-card-body">
        <h3>Product Name</h3>
        <p>Description goes here</p>
        <a href="#" class="button">Shop Now</a>
      </div>
    </li>
  </ul>
</div>
```

**Features:**
- Rounded corners (16px)
- Light shadow
- Hover: Lift effect with medium shadow
- Image zoom on hover
- Responsive grid

### Hero Banner

```html
<div class="hero">
  <div class="hero-content">
    <h1>Welcome to Starbucks</h1>
    <p>Your daily coffee ritual starts here</p>
    <div class="button-container">
      <a href="#" class="button">Order Now</a>
    </div>
  </div>
  <picture>
    <img src="hero-bg.jpg" alt="Coffee">
  </picture>
</div>
```

**Features:**
- Full-width with max constraints
- Rounded corners on desktop
- Green overlay on image
- Centered white text
- Large, bold typography
- Text shadow for readability

### Accordion

```css
.accordion-item {
  border-radius: var(--border-radius-s);
  background: var(--starbucks-cream);
  margin-bottom: var(--spacing-s);
}
```

### Navigation

```css
header {
  background: white;
  box-shadow: var(--shadow-light);
  height: 80px; /* Mobile */
  height: 100px; /* Desktop */
}
```

## Utility Classes

### Text Alignment

```html
<div class="text-center">Centered text</div>
<div class="text-left">Left-aligned text</div>
<div class="text-right">Right-aligned text</div>
```

### Text Colors

```html
<p class="accent-text">Green accent text</p>
<p class="gold-text">Gold premium text</p>
```

### Responsive Utilities

```html
<div class="hide-mobile">Desktop only</div>
<div class="hide-desktop">Mobile only</div>
```

## Best Practices

### Do's ✅

- Use Starbucks Green (#00704a) as primary brand color
- Apply generous rounded corners (50px for buttons)
- Use cream backgrounds (#f2f0eb) for alternating sections
- Implement smooth transitions (0.3s ease)
- Add hover effects with lift and shadow
- Use white text on dark/green backgrounds
- Maintain consistent spacing (8px grid)

### Don'ts ❌

- Don't use sharp corners on primary elements
- Don't use pure black (#000) - use Starbucks Black (#1e3932)
- Don't mix button styles inconsistently
- Don't use bright, saturated colors outside brand palette
- Don't ignore hover states and transitions
- Don't use thin font weights (<400)

## Responsive Breakpoints

```css
/* Mobile first - default styles */

/* Tablet and up */
@media (width >= 900px) {
  /* Adjusted typography */
  /* Increased spacing */
  /* Larger nav height */
}

/* Desktop */
@media (width >= 1200px) {
  /* Maximum spacing */
  /* Largest typography */
}
```

## Accessibility

- Minimum contrast ratio: 4.5:1 for normal text
- Green (#00704a) on white: Passes WCAG AA
- White on green: Passes WCAG AA
- White on black (#1e3932): Passes WCAG AAA
- Focus states: Visible outline on interactive elements
- Button hover states clearly distinguish from default

## Brand References

This design system is based on official Starbucks brand guidelines:

- **Primary Color**: #00704a (Starbucks Green / PMS 3425 C)
- **Typography**: SoDo Sans family (using Helvetica Neue as fallback)
- **Design Philosophy**: Warm, welcoming, premium, approachable

### Sources

- [Starbucks Creative Expression](https://creative.starbucks.com/)
- [Starbucks Color Palette](https://usbrandcolors.com/starbucks-colors/)
- [Starbucks Typography](https://creative.starbucks.com/typography/)
- [Starbucks Brand Guidelines](https://creative.starbucks.com/color/)

## Quick Reference

```css
/* Colors */
--starbucks-green: #00704a;
--starbucks-black: #1e3932;
--starbucks-cream: #f2f0eb;
--starbucks-gold: #cba258;

/* Spacing */
--spacing-s: 16px;
--spacing-m: 24px;
--spacing-l: 40px;

/* Border Radius */
--border-radius-m: 16px;
--border-radius-full: 50px;

/* Shadows */
--shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
```

---

Built with Starbucks design principles for a premium, welcoming digital experience.

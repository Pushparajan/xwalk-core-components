# XWalk Core Components

AEM Edge Delivery Services implementation with a comprehensive block collection for building modern, performant websites with WYSIWYG authoring capabilities.

## Features

- 🚀 **Edge Delivery Services** - Lightning-fast page loads with server-side rendering
- 🎨 **Universal Editor Support** - WYSIWYG authoring experience
- 🧩 **17 Production-Ready Blocks** - Comprehensive component library
- ♿ **Accessibility First** - WCAG compliant components
- 📱 **Mobile Responsive** - Optimized for all screen sizes
- 🎯 **SEO Optimized** - Semantic HTML and performance-focused

## Content Repository

This project uses **AEM JCR (Java Content Repository)** for content storage instead of Google Drive:

- **Local Development**: `http://localhost:4502` (AEM Author instance)
- **Content Path**: `/content/xwalk/` in JCR repository
- **Universal Editor**: Real-time WYSIWYG editing with AEM
- **Assets**: Stored in AEM DAM (`/content/dam/xwalk/`)

See [AEM-SETUP.md](./AEM-SETUP.md) for complete setup instructions.

## Block Collection

### Content Blocks
- **Hero** - Eye-catching banner sections with images and CTAs
- **Cards** - Flexible card layouts for content display
- **Columns** - Multi-column responsive layouts
- **Quote** - Styled blockquotes and testimonials

### Interactive Blocks
- **Accordion** - Collapsible content sections
- **Tabs** - Tabbed content navigation
- **Carousel** - Image and content sliders
- **Modal** - Dialog overlays and popups

### Media Blocks
- **Video** - Responsive video embeds with optimization
- **Embed** - Third-party content embedding
- **Table** - Data tables with styling

### Form Blocks
- **Form** - Custom forms with validation and submission
- **Search** - Site-wide search functionality

### Navigation Blocks
- **Header** - Site header and navigation
- **Footer** - Site footer with links
- **Breadcrumbs** - Navigation hierarchy display

### Layout Blocks
- **Fragment** - Reusable content fragments
- **Table** - Structured data display

## Project Structure

```
xwalk-core-components/
├── blocks/              # Component blocks
│   ├── accordion/
│   ├── breadcrumbs/
│   ├── cards/
│   ├── carousel/
│   ├── columns/
│   ├── embed/
│   ├── footer/
│   ├── form/
│   ├── fragment/
│   ├── header/
│   ├── hero/
│   ├── modal/
│   ├── quote/
│   ├── search/
│   ├── table/
│   ├── tabs/
│   └── video/
├── scripts/             # Core JavaScript
│   ├── aem.js          # AEM utilities
│   └── scripts.js      # Main application logic
├── styles/              # Global styles
│   └── styles.css
├── component-definition.json  # Component definitions for Universal Editor
├── component-models.json      # Component data models
├── component-filters.json     # Component filtering rules
├── fstab.yaml          # File system table
├── paths.json          # URL path mappings
└── head.html           # Common head elements
```

## Getting Started

### Prerequisites
- **Node.js 18 or higher**
- **Git**
- **Java JDK 11 or 17** (for AEM)
- **AEM SDK** (download from Adobe Software Distribution)

### Quick Start

#### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Pushparajan/xwalk-core-components.git
cd xwalk-core-components

# Install dependencies
npm install
```

#### 2. Setup AEM Author Instance

```bash
# Start AEM on port 4502
java -jar aem-sdk-quickstart-*.jar -gui

# Wait for AEM to start (5-10 minutes first time)
# Access at: http://localhost:4502
# Default credentials: admin / admin
```

**Detailed Setup**: See [AEM-SETUP.md](./AEM-SETUP.md) for complete AEM configuration.

#### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# AEM_AUTHOR_URL=http://localhost:4502
```

#### 4. Create Content in AEM

1. Open CRXDE Lite: http://localhost:4502/crx/de
2. Create content structure:
   ```
   /content/xwalk/en/jcr:content/root/
   ```
3. Add your first component using Universal Editor

#### 5. Start Development Server

```bash
# Using AEM CLI
npm install -g @adobe/aem-cli
aem up

# Or simple HTTP server
npx http-server -p 3000
```

### Development

1. **Local Development**
   - AEM Author runs on port 4502
   - Dev server on port 3000
   - Content stored in AEM JCR
   - Code from GitHub repository

2. **Code Quality**
   ```bash
   npm run lint:js   # JavaScript linting
   npm run lint:css  # CSS linting
   npm run lint      # All linting
   ```

3. **Universal Editor**
   - Open: https://experience.adobe.com/#/aem
   - Edit content visually
   - Changes save to AEM JCR automatically

## Block Development

### Creating a New Block

1. Create a new directory in `/blocks/` with your block name
2. Add `blockname.js` and `blockname.css` files
3. Implement the `decorate` function:

```javascript
export default function decorate(block) {
  // Transform the block DOM
  // Add event listeners
  // Apply functionality
}
```

### Block Anatomy

```html
<!-- Authored content -->
<div class="blockname">
  <div>
    <div>Content Cell 1</div>
    <div>Content Cell 2</div>
  </div>
</div>
```

Each block receives a DOM element with class matching the block name. The `decorate` function transforms this into the final rendered component.

## Universal Editor Integration

This project supports the AEM Universal Editor for WYSIWYG authoring:

- Component definitions in `component-definition.json`
- Data models in `component-models.json`
- Component filters in `component-filters.json`

## Architecture

### Progressive Enhancement

The architecture follows a three-phase loading strategy:

1. **Eager Phase** - Critical content and first section
2. **Lazy Phase** - Remaining sections and non-critical blocks
3. **Delayed Phase** - Analytics and optional enhancements

### Performance Optimization

- Lazy loading for images and blocks
- Minimal JavaScript payload
- CSS optimization and tree-shaking
- Edge Delivery for sub-second page loads

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Run linting before committing
5. Submit a pull request

## License

Apache License 2.0

## Resources

- [AEM Edge Delivery Documentation](https://www.aem.live/developer/tutorial)
- [Block Collection](https://www.aem.live/developer/block-collection)
- [Universal Editor](https://www.aem.live/developer/universal-editor-blocks)
- [Component Models](https://www.aem.live/developer/component-model-definitions)

## Support

For issues and questions:
- GitHub Issues: https://github.com/Pushparajan/xwalk-core-components/issues
- AEM Community: https://www.aem.live/

---

Built with ❤️ using Adobe Experience Manager Edge Delivery Services

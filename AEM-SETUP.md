# AEM Local Development Setup

Complete guide for setting up local AEM development with JCR repository integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AEM Author Setup](#aem-author-setup)
3. [Project Configuration](#project-configuration)
4. [Content Structure in JCR](#content-structure-in-jcr)
5. [Universal Editor Setup](#universal-editor-setup)
6. [Development Workflow](#development-workflow)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Java JDK 11 or 17** - Required for AEM
- **Node.js 18+** - For local development tools
- **AEM SDK** - Download from Adobe Software Distribution
- **Git** - For version control

### AEM SDK Download

1. Visit [Adobe Software Distribution](https://experience.adobe.com/#/downloads/content/software-distribution/en/aemcloud.html)
2. Download **AEM SDK** for your version
3. Extract the QuickStart JAR file

## AEM Author Setup

### 1. Start AEM Author Instance

```bash
# Create AEM directory
mkdir -p ~/aem/author
cd ~/aem/author

# Copy the AEM SDK JAR file
cp /path/to/aem-sdk-quickstart-*.jar aem-author-p4502.jar

# Start AEM on port 4502
java -jar aem-author-p4502.jar -gui
```

**First Launch:**
- AEM will install (takes 5-10 minutes)
- Default credentials: `admin` / `admin`
- Access at: http://localhost:4502

### 2. Install Required Packages

Once AEM is running, install:

1. **AEM Core Components**
   - Navigate to Package Manager: http://localhost:4502/crx/packmgr
   - Upload and install Core Components package

2. **Universal Editor Service Pack** (if using Universal Editor)
   - Download from Adobe Software Distribution
   - Install via Package Manager

### 3. Enable CORS for Local Development

Create CORS configuration in AEM:

1. Go to Configuration Manager: http://localhost:4502/system/console/configMgr
2. Find "Adobe Granite Cross-Origin Resource Sharing Policy"
3. Create new configuration:
   - **Allowed Origins**: `http://localhost:3000`, `https://experience.adobe.com`
   - **Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
   - **Allowed Headers**: `*`
   - **Exposed Headers**: `*`
   - **Supports Credentials**: `true`

## Project Configuration

### 1. Update fstab.yaml

The `fstab.yaml` file configures the content source:

```yaml
mountpoints:
  /: aem:http://localhost:4502
```

**For AEM Cloud:**
```yaml
mountpoints:
  /: aem:https://author-p12345-e67890.adobeaemcloud.com
```

### 2. Update head.html

The `head.html` file includes Universal Editor metadata:

```html
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="urn:adobe:aem:editor:aemconnection" content="aem:http://localhost:4502">
<script src="/scripts/aem.js" type="module"></script>
<script src="/scripts/scripts.js" type="module"></script>
<link rel="stylesheet" href="/styles/styles.css"/>
```

### 3. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Local Development
AEM_AUTHOR_URL=http://localhost:4502
AEM_ADMIN_USER=admin
AEM_ADMIN_PASSWORD=admin
AEM_CONTENT_ROOT=/content/xwalk
NODE_ENV=development
```

### 4. Component Registration in AEM

Components must be registered in AEM's component library:

1. Navigate to CRXDE Lite: http://localhost:4502/crx/de
2. Create component definitions under:
   ```
   /apps/xwalk/components/
   ```

## Content Structure in JCR

### Create Content Root

1. Open CRXDE Lite: http://localhost:4502/crx/de
2. Navigate to `/content`
3. Create folder structure:

```
/content/
└── xwalk/                    [sling:Folder]
    ├── en/                   [cq:Page]
    │   ├── jcr:content       [cq:PageContent]
    │   │   ├── jcr:title: "English Home"
    │   │   └── root/         [nt:unstructured]
    │   │       ├── section1/ [nt:unstructured]
    │   │       │   └── hero/ [nt:unstructured]
    │   │       │       ├── image: "/content/dam/xwalk/hero.jpg"
    │   │       │       ├── imageAlt: "Hero image"
    │   │       │       └── text: "<h1>Welcome</h1>"
    │   │       └── section2/ [nt:unstructured]
    │   │           └── cards/ [nt:unstructured]
    │   └── products/         [cq:Page]
    └── fr/                   [cq:Page]
```

### Node Types Reference

- **`cq:Page`** - Page container node
- **`cq:PageContent`** - Page content (jcr:content)
- **`nt:unstructured`** - Generic content node
- **`sling:Folder`** - Folder node
- **`dam:Asset`** - DAM asset node

### Set Resource Types

For each block component in JCR:

```xml
<hero
  jcr:primaryType="nt:unstructured"
  sling:resourceType="core/franklin/components/block/v1/block"
  image="/content/dam/xwalk/hero.jpg"
  imageAlt="Hero image"
  text="<h1>Welcome to XWalk</h1><p>Build amazing experiences.</p>"/>
```

## Universal Editor Setup

### 1. Access Universal Editor

1. Open Universal Editor: https://experience.adobe.com/#/aem
2. Or direct URL: https://experience.adobe.com/#/aem/editor.html/content/xwalk/en

### 2. Configure Connection

Universal Editor requires proper metadata in HTML:

```html
<meta name="urn:adobe:aem:editor:aemconnection"
      content="aem:http://localhost:4502">
```

### 3. Enable Instrumentation

Ensure all blocks have proper `data-aue-*` attributes:

```html
<div class="hero"
     data-aue-resource="urn:aemconnection:/content/xwalk/en/home/jcr:content/root/hero"
     data-aue-type="component"
     data-aue-model="hero"
     data-aue-label="Hero Banner">
  <!-- Content -->
</div>
```

### 4. Test Universal Editor

1. Open page in Universal Editor
2. Click on components
3. Verify property panel appears
4. Make edits and save
5. Check changes persist in JCR

## Development Workflow

### 1. Local Development Server

Start local development server:

```bash
# Using AEM CLI
npm install -g @adobe/aem-cli
aem up

# Or using simple HTTP server
npx http-server -p 3000
```

### 2. Watch for Changes

```bash
# Watch and rebuild
npm run dev
```

### 3. Content Authoring Workflow

**Option A: Direct JCR Editing**
1. Edit content in CRXDE Lite
2. Refresh browser to see changes
3. Changes immediate (no build needed)

**Option B: Universal Editor**
1. Open page in Universal Editor
2. Edit content visually
3. Save changes
4. Changes persist to JCR automatically

**Option C: Content Packages**
1. Create content in AEM
2. Build content package
3. Install package in other environments

### 4. Code Deployment

```bash
# 1. Develop blocks locally
cd blocks/my-block
# Edit my-block.js and my-block.css

# 2. Test in browser
# http://localhost:3000

# 3. Commit to Git
git add blocks/my-block/
git commit -m "Add new block"

# 4. Push to GitHub
git push origin main

# 5. Deploy via AEM Cloud Manager (production)
```

## AEM Content Sync

### Export Content from AEM

```bash
# Using VLT (Vault Tool)
vlt --credentials admin:admin checkout http://localhost:4502/crx /content/xwalk

# Export specific paths
curl -u admin:admin "http://localhost:4502/content/xwalk.infinity.json" > content-export.json
```

### Import Content to AEM

```bash
# Create package via API
curl -u admin:admin -X POST \
  "http://localhost:4502/crx/packmgr/service.jsp" \
  -F cmd=create \
  -F packageName=xwalk-content \
  -F groupName=xwalk

# Build and install package
curl -u admin:admin -X POST \
  "http://localhost:4502/crx/packmgr/service/.json/etc/packages/xwalk/xwalk-content.zip?cmd=build"

curl -u admin:admin -X POST \
  "http://localhost:4502/crx/packmgr/service/.json/etc/packages/xwalk/xwalk-content.zip?cmd=install"
```

### Content Replication

Set up replication agents for publish environment:

1. Navigate to: http://localhost:4502/etc/replication/agents.author.html
2. Configure publish agent to point to publish instance
3. Test connection

## Component Development in AEM

### Create Component Definition

Create `/apps/xwalk/components/hero/.content.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          jcr:primaryType="cq:Component"
          jcr:title="Hero"
          jcr:description="Hero banner component"
          componentGroup="XWalk Components"/>
```

### Create Component Dialog

Create `/apps/xwalk/components/hero/_cq_dialog/.content.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
          jcr:primaryType="nt:unstructured"
          jcr:title="Hero Properties">
    <content jcr:primaryType="nt:unstructured">
        <items jcr:primaryType="nt:unstructured">
            <tabs jcr:primaryType="nt:unstructured">
                <items jcr:primaryType="nt:unstructured">
                    <properties jcr:primaryType="nt:unstructured">
                        <items jcr:primaryType="nt:unstructured">
                            <image
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="cq/gui/components/authoring/dialog/fileupload"
                                fieldLabel="Image"
                                name="./image"/>
                            <imageAlt
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                                fieldLabel="Image Alt Text"
                                name="./imageAlt"/>
                            <text
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="cq/gui/components/authoring/dialog/richtext"
                                fieldLabel="Text"
                                name="./text"/>
                        </items>
                    </properties>
                </items>
            </tabs>
        </items>
    </content>
</jcr:root>
```

## Troubleshooting

### AEM Won't Start

**Check Java version:**
```bash
java -version
# Should be Java 11 or 17
```

**Check port availability:**
```bash
lsof -i :4502
# Kill process if needed
```

**Increase heap size:**
```bash
java -Xmx4g -jar aem-author-p4502.jar
```

### CORS Errors

1. Check CORS configuration in AEM Config Manager
2. Verify allowed origins include your dev server
3. Clear browser cache
4. Check browser console for specific error

### Universal Editor Can't Connect

1. **Check metadata tag:**
   ```html
   <meta name="urn:adobe:aem:editor:aemconnection" content="aem:http://localhost:4502">
   ```

2. **Verify AEM is running:**
   ```bash
   curl http://localhost:4502
   ```

3. **Check network tab** in browser dev tools for connection errors

4. **Verify credentials** in Universal Editor

### Content Not Updating

1. **Clear AEM cache:**
   ```bash
   curl -u admin:admin -X POST \
     "http://localhost:4502/system/console/jmx/org.apache.jackrabbit.oak%3Aid%3D*%2Cname%3D*%2Ctype%3DSegmentNodeStore/op/cleanup"
   ```

2. **Check replication queue:**
   - http://localhost:4502/etc/replication/agents.author.html

3. **Verify JCR permissions:**
   - User must have read/write access to `/content/xwalk`

### Images Not Loading

1. **Check DAM path:**
   ```
   /content/dam/xwalk/images/
   ```

2. **Verify image exists in JCR:**
   - Navigate to CRXDE Lite
   - Check path exists

3. **Check permissions:**
   - Anonymous user needs read access to `/content/dam`

## Advanced Configuration

### Custom Workflow

Create custom workflow for content approval:

1. Navigate to Workflow Console: http://localhost:4502/libs/cq/workflow/admin/console/content/models.html
2. Create new workflow model
3. Add approval steps
4. Configure on `/content/xwalk` path

### Custom Servlets

Create servlet to expose content as JSON:

```java
@Component(service = Servlet.class)
@SlingServletPaths("/bin/xwalk/content")
public class ContentServlet extends SlingSafeMethodsServlet {
    @Override
    protected void doGet(SlingHttpServletRequest request,
                        SlingHttpServletResponse response) {
        // Return JSON content
    }
}
```

### Publish Event Handler

Create event handler for content publication:

```java
@Component(service = EventHandler.class, immediate = true)
@Property(name = EventConstants.EVENT_TOPIC,
          value = ReplicationAction.EVENT_TOPIC)
public class PublishEventHandler implements EventHandler {
    @Override
    public void handleEvent(Event event) {
        // Trigger Edge Delivery Services update
    }
}
```

## Production Deployment

### AEM Cloud Service

1. Configure Cloud Manager
2. Set up pipeline
3. Deploy code to cloud environment
4. Update fstab.yaml with cloud URL:
   ```yaml
   mountpoints:
     /: aem:https://author-p12345-e67890.adobeaemcloud.com
   ```

### Edge Delivery Services

1. Push code to GitHub
2. Content syncs from AEM via Admin API
3. Edge Delivery renders using GitHub code
4. CDN caches globally

## Resources

- [AEM Documentation](https://experienceleague.adobe.com/docs/experience-manager-cloud-service.html)
- [AEM Developer Console](http://localhost:4502/crx/de)
- [Package Manager](http://localhost:4502/crx/packmgr)
- [System Console](http://localhost:4502/system/console)
- [Universal Editor Docs](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/)

## Quick Reference

### Essential URLs

- **AEM Author**: http://localhost:4502
- **CRXDE Lite**: http://localhost:4502/crx/de
- **Package Manager**: http://localhost:4502/crx/packmgr
- **Config Manager**: http://localhost:4502/system/console/configMgr
- **Universal Editor**: https://experience.adobe.com/#/aem
- **AEM Sites Admin**: http://localhost:4502/sites.html

### Common AEM Commands

```bash
# Start AEM
java -jar aem-author-p4502.jar

# Start with custom heap
java -Xmx4g -jar aem-author-p4502.jar

# Stop AEM (find process and kill)
lsof -i :4502
kill <PID>

# Clear cache
curl -u admin:admin -X POST \
  "http://localhost:4502/system/console/jmx/com.adobe.granite.platform%3Atype%3DRuntime/op/clearCache"
```

---

**Ready to Start?**

1. ✅ Install AEM SDK
2. ✅ Start AEM on port 4502
3. ✅ Configure CORS
4. ✅ Create content structure in JCR
5. ✅ Start local dev server
6. ✅ Open in Universal Editor
7. ✅ Start authoring!

# 🎯 OptiKit Web Service

Custom web service for business-specific JavaScript and CSS modifications. Allows any business to customize OptiKit files through a third-party interface, with each change saved as a custom file per business ID.

## 🚀 Features

- **Business-specific customization**: Each business gets their own customized files
- **Template-based system**: Uses `{{VARIABLE}}` placeholders for easy customization
- **RESTful API**: Simple POST endpoint for generating custom files
- **Static file serving**: Serves both original and customized files
- **No file conflicts**: Custom files are prefixed with business ID

## 📁 Project Structure

```
optikit/
├── public/                 # Static files served by the web service
│   ├── css/               # Original and generated CSS files
│   ├── js/                # Original and generated JS files
│   ├── img/               # Images and assets
│   ├── index.html         # Default page
│   └── demo.html          # Customization demo
├── templates/             # Template files with {{VARIABLE}} placeholders
│   ├── css/              # CSS templates
│   └── js/               # JavaScript templates
├── server/               # Node.js Express server
│   └── index.js          # Main server file
├── package.json          # Node.js dependencies and scripts
└── README.md            # This file
```

## 🔧 API Usage

### Build Custom Files

**Endpoint:** `POST /build/:businessId`

**Example Request:**
```bash
curl -X POST http://localhost:3000/build/optione-crm \
  -H "Content-Type: application/json" \
  -d '{
    "replacements": {
      "BASE_URL": "https://crm.optione.ai",
      "TIMEOUT": "5000",
      "MAIN_COLOR": "#ff02ff",
      "SIDEBAR_TEXT_COLOR": "#ffffff",
      "BUSINESS_NAME": "Optione CRM",
      "ENVIRONMENT": "production",
      "DEBUG": "false",
      "VERSION": "1.0.0"
    },
    "files": [
      "js/config.js",
      "css/optione.css"
    ]
  }'
```

**Response:**
```json
{
  "businessId": "optione-crm",
  "results": [
    {
      "file": "js/config.js",
      "status": "success",
      "outputFile": "js/optione-crm_config.js",
      "url": "http://localhost:3000/js/optione-crm_config.js"
    },
    {
      "file": "css/optione.css",
      "status": "success",
      "outputFile": "css/optione-crm_optione.css",
      "url": "http://localhost:3000/css/optione-crm_optione.css"
    }
  ],
  "timestamp": "2025-08-05T07:28:45.713Z"
}
```

## 🌍 Usage in Production

After deployment, load customized files like this:

```html
<!-- Load customized CSS -->
<link rel="stylesheet" href="https://optikit.onrender.com/css/optione-crm_optione.css" />

<!-- Load customized JavaScript -->
<script src="https://optikit.onrender.com/js/optione-crm_config.js"></script>
<script src="https://optikit.onrender.com/js/optione-crm_api.js"></script>
```

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm start
```

Server will run on `http://localhost:3000`

### Test the API
```bash
node test-api.js
```

### View Demo
Open `http://localhost:3000/demo.html` to see the customization in action.

## 📋 Available Template Variables

### JavaScript Templates
- `{{BASE_URL}}` - API base URL
- `{{TIMEOUT}}` - Request timeout in milliseconds
- `{{BUSINESS_NAME}}` - Business display name
- `{{ENVIRONMENT}}` - Environment (development/production)
- `{{DEBUG}}` - Debug mode (true/false)
- `{{VERSION}}` - Version string

### CSS Templates
- `{{MAIN_COLOR}}` - Primary brand color
- `{{SIDEBAR_TEXT_COLOR}}` - Sidebar text color
- Add more variables as needed in template files

## 🚀 Deployment

This project is configured for deployment on Render.com as a Web Service.

### Render Configuration
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node.js
- **Port:** 3000 (automatically configured)

## 📝 Rules & Guidelines

- ✅ Only work with existing files in `templates/` directory
- ✅ Generated files follow naming: `[businessId]_[originalFileName]`
- ❌ Don't create new template files without adding them to templates/
- ❌ Don't edit files that don't exist in templates/
- 🔒 Original files in `public/` remain unchanged

## 🎯 Goal

Create a Node.js-based infrastructure that supports custom configurations for each business, without separate servers per client and without affecting the original code.

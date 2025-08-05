const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Function to apply replacements to template
function applyReplacements(template, replacements) {
  return Object.entries(replacements).reduce((acc, [key, val]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    return acc.replace(regex, val);
  }, template);
}

// API Endpoint: POST /build/:businessId
app.post('/build/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { replacements, files } = req.body;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }

    if (!replacements || !files || !Array.isArray(files)) {
      return res.status(400).json({ 
        error: 'Invalid request body. Expected replacements object and files array' 
      });
    }

    const results = [];

    // Process each file
    for (const filePath of files) {
      try {
        // Read template file
        const templatePath = path.join(__dirname, '../templates', filePath);
        
        if (!await fs.pathExists(templatePath)) {
          results.push({
            file: filePath,
            status: 'error',
            message: `Template file not found: ${filePath}`
          });
          continue;
        }

        const template = await fs.readFile(templatePath, 'utf8');
        
        // Apply replacements
        const processedContent = applyReplacements(template, replacements);
        
        // Generate output filename: [businessId]_[originalFileName]
        const fileName = path.basename(filePath);
        const fileDir = path.dirname(filePath);
        const outputFileName = `${businessId}_${fileName}`;
        const outputPath = path.join(__dirname, '../public', fileDir, outputFileName);
        
        // Ensure output directory exists
        await fs.ensureDir(path.dirname(outputPath));
        
        // Write processed file
        await fs.writeFile(outputPath, processedContent, 'utf8');
        
        results.push({
          file: filePath,
          status: 'success',
          outputFile: `${fileDir}/${outputFileName}`,
          url: `${req.protocol}://${req.get('host')}/${fileDir}/${outputFileName}`
        });

      } catch (fileError) {
        results.push({
          file: filePath,
          status: 'error',
          message: fileError.message
        });
      }
    }

    res.json({
      businessId,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Build error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'OptiKit Web Service',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// List available template files
app.get('/templates', async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../templates');
    const jsFiles = await fs.readdir(path.join(templatesDir, 'js')).catch(() => []);
    const cssFiles = await fs.readdir(path.join(templatesDir, 'css')).catch(() => []);
    
    res.json({
      available_templates: {
        js: jsFiles.filter(f => f.endsWith('.js')),
        css: cssFiles.filter(f => f.endsWith('.css'))
      },
      usage: {
        endpoint: 'POST /build/:businessId',
        example_files: [
          'js/config.js',
          'css/optione.css'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list templates', message: error.message });
  }
});

// List generated files for a business
app.get('/files/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const publicDir = path.join(__dirname, '../public');
    
    const jsDir = path.join(publicDir, 'js');
    const cssDir = path.join(publicDir, 'css');
    
    const jsFiles = await fs.readdir(jsDir).catch(() => []);
    const cssFiles = await fs.readdir(cssDir).catch(() => []);
    
    const businessFiles = {
      js: jsFiles.filter(f => f.startsWith(`${businessId}_`)),
      css: cssFiles.filter(f => f.startsWith(`${businessId}_`))
    };
    
    const fileUrls = {
      js: businessFiles.js.map(f => `${req.protocol}://${req.get('host')}/js/${f}`),
      css: businessFiles.css.map(f => `${req.protocol}://${req.get('host')}/css/${f}`)
    };
    
    res.json({
      businessId,
      files: businessFiles,
      urls: fileUrls,
      total: businessFiles.js.length + businessFiles.css.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list business files', message: error.message });
  }
});

// API routes (before static middleware)
app.get('/api', (req, res) => {
  res.json({
    service: 'OptiKit Web Service',
    version: '1.0.0',
    endpoints: {
      build: 'POST /build/:businessId',
      health: 'GET /health',
      templates: 'GET /templates',
      files: 'GET /files/:businessId'
    },
    documentation: {
      demo: '/demo.html',
      github: 'https://github.com/rotem-ziv21/optikit'
    }
  });
});

// Serve static files from public directory (after API routes)
app.use(express.static(path.join(__dirname, '../public')));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OptiKit Web Service running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../public')}`);
  console.log(`📋 Templates directory: ${path.join(__dirname, '../templates')}`);
});

module.exports = app;

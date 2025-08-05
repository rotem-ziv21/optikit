// OptiKit Configuration Template
// This file contains customizable variables for business-specific configurations

window.OPTIKIT_CONFIG = {
    // Base URL for API calls
    BASE_URL: '{{BASE_URL}}',
    
    // Request timeout in milliseconds
    TIMEOUT: {{TIMEOUT}},
    
    // Main brand color
    MAIN_COLOR: '{{MAIN_COLOR}}',
    
    // Business name
    BUSINESS_NAME: '{{BUSINESS_NAME}}',
    
    // Environment
    ENVIRONMENT: '{{ENVIRONMENT}}',
    
    // Debug mode
    DEBUG: {{DEBUG}},
    
    // Version
    VERSION: '{{VERSION}}'
};

// Initialize configuration
console.log('OptiKit Config loaded for:', window.OPTIKIT_CONFIG.BUSINESS_NAME);
console.log('Environment:', window.OPTIKIT_CONFIG.ENVIRONMENT);
console.log('Base URL:', window.OPTIKIT_CONFIG.BASE_URL);

// Test script for all OptiKit Web Service endpoints

const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing OptiKit Web Service Endpoints\n');
  
  // Test 1: Health check
  try {
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 2: Templates list
  try {
    console.log('\n2️⃣ Testing Templates List...');
    const templatesResponse = await fetch(`${baseUrl}/templates`);
    const templatesData = await templatesResponse.json();
    console.log('✅ Templates:', templatesData);
  } catch (error) {
    console.log('❌ Templates list failed:', error.message);
  }
  
  // Test 3: Build custom files
  try {
    console.log('\n3️⃣ Testing Build API...');
    const buildResponse = await fetch(`${baseUrl}/build/test-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        replacements: {
          BASE_URL: 'https://test.example.com',
          TIMEOUT: '3000',
          MAIN_COLOR: '#00ff00',
          SIDEBAR_TEXT_COLOR: '#000000',
          BUSINESS_NAME: 'Test Company',
          ENVIRONMENT: 'development',
          DEBUG: 'true',
          VERSION: '1.0.0'
        },
        files: ['js/config.js', 'css/optione.css']
      })
    });
    const buildData = await buildResponse.json();
    console.log('✅ Build:', buildData);
  } catch (error) {
    console.log('❌ Build failed:', error.message);
  }
  
  // Test 4: List business files
  try {
    console.log('\n4️⃣ Testing Business Files List...');
    const filesResponse = await fetch(`${baseUrl}/files/test-company`);
    const filesData = await filesResponse.json();
    console.log('✅ Business Files:', filesData);
  } catch (error) {
    console.log('❌ Business files list failed:', error.message);
  }
  
  // Test 5: API info endpoint
  try {
    console.log('\n5️⃣ Testing API Info Endpoint...');
    const apiResponse = await fetch(`${baseUrl}/api`);
    const apiData = await apiResponse.json();
    console.log('✅ API Info:', apiData);
  } catch (error) {
    console.log('❌ API info endpoint failed:', error.message);
  }
  
  console.log('\n🎉 All endpoint tests completed!');
};

// Run tests
testEndpoints();

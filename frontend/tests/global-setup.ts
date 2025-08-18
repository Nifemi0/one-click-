import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test backend connectivity before running tests
  try {
    console.log('🔍 Testing backend connectivity...');
    const response = await page.request.get('https://one-click-c308.onrender.com/health');
    
    if (response.ok()) {
      const data = await response.json();
      console.log('✅ Backend is accessible:', data.status);
    } else {
      console.log('⚠️ Backend returned status:', response.status());
    }
  } catch (error) {
    console.log('❌ Backend connectivity test failed:', error.message);
  }
  
  // Test frontend accessibility
  try {
    console.log('🔍 Testing frontend accessibility...');
    const response = await page.request.get('https://oneclick1.netlify.app');
    
    if (response.ok()) {
      console.log('✅ Frontend is accessible');
    } else {
      console.log('⚠️ Frontend returned status:', response.status());
    }
  } catch (error) {
    console.log('❌ Frontend accessibility test failed:', error.message);
  }
  
  await browser.close();
}

export default globalSetup;

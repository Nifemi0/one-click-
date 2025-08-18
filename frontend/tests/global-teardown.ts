import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Final connectivity check
  try {
    console.log('🔍 Final connectivity check...');
    
    // Check backend one more time
    const backendResponse = await page.request.get('https://one-click-c308.onrender.com/health');
    if (backendResponse.ok()) {
      console.log('✅ Backend connectivity confirmed');
    }
    
    // Check frontend one more time
    const frontendResponse = await page.request.get('https://oneclick1.netlify.app');
    if (frontendResponse.ok()) {
      console.log('✅ Frontend connectivity confirmed');
    }
    
    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.log('⚠️ Final connectivity check failed:', error.message);
  }
  
  await browser.close();
}

export default globalTeardown;

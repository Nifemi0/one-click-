#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build process...');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('out')) {
  fs.rmSync('out', { recursive: true, force: true });
}

// Install dependencies
console.log('📦 Installing dependencies...');
const { execSync } = require('child_process');
execSync('npm install', { stdio: 'inherit' });

// Build the project
console.log('🔨 Building project...');
execSync('npm run build', { stdio: 'inherit' });

// Verify build output
console.log('✅ Build completed!');
console.log('📁 Build output contents:');
execSync('ls -la out/', { stdio: 'inherit' });

console.log('📁 CSS files:');
execSync('ls -la out/_next/static/css/', { stdio: 'inherit' });

console.log('📁 JS files:');
execSync('ls -la out/_next/static/chunks/', { stdio: 'inherit' });

// Copy CSS to root for easier access (backup)
console.log('📋 Creating CSS backup in root...');
if (fs.existsSync('out/_next/static/css')) {
  const cssFiles = fs.readdirSync('out/_next/static/css');
  cssFiles.forEach(file => {
    if (file.endsWith('.css')) {
      const sourcePath = path.join('out/_next/static/css', file);
      const destPath = path.join('out', file);
      const fallbackPath = path.join('out', 'fallback.css');
      fs.copyFileSync(sourcePath, destPath);
      fs.copyFileSync(sourcePath, fallbackPath);
      console.log(`📄 Copied ${file} to root and created fallback.css`);
    }
  });
}

console.log('🎉 Netlify build process completed successfully!');
console.log('📝 Next steps:');
console.log('   1. Deploy the "out" folder to Netlify');
console.log('   2. Check that CSS files are accessible');
console.log('   3. Verify routing works correctly');
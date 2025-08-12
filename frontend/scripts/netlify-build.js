#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build...');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the application
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Copy static files
  console.log('📁 Copying static files...');
  if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
  }

  // Copy public files
  if (fs.existsSync('public')) {
    execSync('cp -r public/* out/', { stdio: 'inherit' });
  }

  // Copy .next files for static export
  if (fs.existsSync('.next')) {
    execSync('cp -r .next out/', { stdio: 'inherit' });
  }

  console.log('✅ Netlify build completed successfully!');
  console.log('📁 Build output directory: out/');

} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
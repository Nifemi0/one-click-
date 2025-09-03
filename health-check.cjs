#!/usr/bin/env node

console.log('🏥 One Click Project Health Check');
console.log('================================');

// Check Node.js version
const nodeVersion = process.version;
console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if running in correct directory
const fs = require('fs');
const path = require('path');

const requiredDirs = ['frontend', 'backend'];
const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));

if (missingDirs.length === 0) {
  console.log('✅ Project structure: Valid');
} else {
  console.log(`❌ Missing directories: ${missingDirs.join(', ')}`);
}

// Check package.json files
const packageFiles = ['package.json', 'frontend/package.json', 'backend/package.json'];
packageFiles.forEach(pkg => {
  if (fs.existsSync(pkg)) {
    console.log(`✅ ${pkg}: Found`);
  } else {
    console.log(`❌ ${pkg}: Missing`);
  }
});

console.log('\n🎯 Health check completed!');
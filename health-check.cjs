#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏥 Drosera Project Health Check');
console.log('================================\n');

let issues = [];
let warnings = [];
let successes = [];

// Check Node.js version
function checkNodeVersion() {
  try {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0]);
    
    if (major >= 18) {
      successes.push(`✅ Node.js version: ${version}`);
    } else {
      issues.push(`❌ Node.js version ${version} is too old. Required: 18+`);
    }
  } catch (error) {
    issues.push(`❌ Could not check Node.js version: ${error.message}`);
  }
}

// Check npm version
function checkNpmVersion() {
  try {
    const version = execSync('npm --version', { encoding: 'utf8' }).trim();
    const major = parseInt(version.split('.')[0]);
    
    if (major >= 9) {
      successes.push(`✅ npm version: ${version}`);
    } else {
      warnings.push(`⚠️  npm version ${version} is old. Recommended: 9+`);
    }
  } catch (error) {
    issues.push(`❌ Could not check npm version: ${error.message}`);
  }
}

// Check dependencies
function checkDependencies() {
  console.log('📦 Checking dependencies...');
  
  // Check root dependencies
  if (fs.existsSync('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      if (pkg.dependencies && pkg.dependencies['@openzeppelin/contracts']) {
        successes.push('✅ OpenZeppelin contracts in dependencies');
      } else {
        issues.push('❌ OpenZeppelin contracts missing from dependencies');
      }
      
      if (pkg.devDependencies && pkg.devDependencies.hardhat) {
        successes.push('✅ Hardhat in devDependencies');
      } else {
        issues.push('❌ Hardhat missing from devDependencies');
      }
    } catch (error) {
      issues.push(`❌ Could not parse root package.json: ${error.message}`);
    }
  } else {
    issues.push('❌ Root package.json not found');
  }
  
  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    successes.push('✅ Root node_modules exists');
  } else {
    issues.push('❌ Root node_modules missing - run npm install');
  }
  
  // Check frontend dependencies
  if (fs.existsSync('frontend/package.json')) {
    try {
      const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
      
      if (frontendPkg.dependencies && frontendPkg.dependencies.next) {
        successes.push('✅ Next.js in frontend dependencies');
      } else {
        issues.push('❌ Next.js missing from frontend dependencies');
      }
    } catch (error) {
      issues.push(`❌ Could not parse frontend package.json: ${error.message}`);
    }
  } else {
    warnings.push('⚠️  Frontend package.json not found');
  }
  
  // Check backend dependencies
  if (fs.existsSync('backend/package.json')) {
    try {
      const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
      
      if (backendPkg.dependencies && backendPkg.dependencies.express) {
        successes.push('✅ Express in backend dependencies');
      } else {
        issues.push('❌ Express missing from backend dependencies');
      }
    } catch (error) {
      issues.push(`❌ Could not parse backend package.json: ${error.message}`);
    }
  } else {
    warnings.push('⚠️  Backend package.json not found');
  }
}

// Check configuration files
function checkConfigFiles() {
  console.log('⚙️  Checking configuration files...');
  
  // Check Hardhat config
  if (fs.existsSync('hardhat.config.cjs')) {
    successes.push('✅ Hardhat configuration exists');
  } else if (fs.existsSync('hardhat.config.ts')) {
    successes.push('✅ Hardhat configuration exists');
  } else if (fs.existsSync('hardhat.config.js')) {
    successes.push('✅ Hardhat configuration exists');
  } else {
    issues.push('❌ Hardhat configuration missing');
  }
  
  // Check TypeScript configs
  if (fs.existsSync('tsconfig.json')) {
    successes.push('✅ Root TypeScript configuration exists');
  } else {
    warnings.push('⚠️  Root TypeScript configuration missing');
  }
  
  if (fs.existsSync('frontend/tsconfig.json')) {
    successes.push('✅ Frontend TypeScript configuration exists');
  } else {
    warnings.push('⚠️  Frontend TypeScript configuration missing');
  }
  
  if (fs.existsSync('backend/tsconfig.json')) {
    successes.push('✅ Backend TypeScript configuration exists');
  } else {
    warnings.push('⚠️  Backend TypeScript configuration missing');
  }
  
  // Check ESLint config
  if (fs.existsSync('eslint.config.js')) {
    successes.push('✅ Root ESLint configuration exists');
  } else {
    warnings.push('⚠️  Root ESLint configuration missing');
  }
}

// Check environment configuration
function checkEnvironment() {
  console.log('🌍 Checking environment configuration...');
  
  if (fs.existsSync('.env')) {
    successes.push('✅ .env file exists');
    
    try {
      const envContent = fs.readFileSync('.env', 'utf8');
      
      if (envContent.includes('OPENAI_API_KEY')) {
        successes.push('✅ OpenAI API key configured');
      } else {
        warnings.push('⚠️  OpenAI API key not configured');
      }
      
      if (envContent.includes('GEMINI_API_KEY')) {
        successes.push('✅ Gemini API key configured');
      } else {
        warnings.push('⚠️  Gemini API key not configured');
      }
      
      if (envContent.includes('DATABASE_URL')) {
        successes.push('✅ Database URL configured');
      } else {
        warnings.push('⚠️  Database URL not configured');
      }
      
    } catch (error) {
      issues.push(`❌ Could not read .env file: ${error.message}`);
    }
  } else {
    if (fs.existsSync('.env.example')) {
      warnings.push('⚠️  .env file missing - copy from .env.example');
    } else {
      issues.push('❌ .env and .env.example files missing');
    }
  }
}

// Check smart contracts
function checkSmartContracts() {
  console.log('📜 Checking smart contracts...');
  
  if (fs.existsSync('contracts/')) {
    const contractFiles = fs.readdirSync('contracts/').filter(file => file.endsWith('.sol'));
    
    if (contractFiles.length > 0) {
      successes.push(`✅ Found ${contractFiles.length} Solidity contracts`);
      
      // Check for OpenZeppelin imports
      let hasOpenZeppelinImports = false;
      contractFiles.forEach(file => {
        try {
          const content = fs.readFileSync(`contracts/${file}`, 'utf8');
          if (content.includes('@openzeppelin/contracts')) {
            hasOpenZeppelinImports = true;
          }
        } catch (error) {
          // Ignore read errors
        }
      });
      
      if (hasOpenZeppelinImports) {
        successes.push('✅ Contracts use OpenZeppelin imports');
      } else {
        warnings.push('⚠️  No OpenZeppelin imports found in contracts');
      }
    } else {
      warnings.push('⚠️  No Solidity contracts found');
    }
  } else {
    warnings.push('⚠️  Contracts directory not found');
  }
}

// Check build artifacts
function checkBuildArtifacts() {
  console.log('🔨 Checking build artifacts...');
  
  if (fs.existsSync('artifacts/')) {
    successes.push('✅ Hardhat artifacts directory exists');
  } else {
    warnings.push('⚠️  Hardhat artifacts directory missing - run npx hardhat compile');
  }
  
  if (fs.existsSync('cache/')) {
    successes.push('✅ Hardhat cache directory exists');
  } else {
    warnings.push('⚠️  Hardhat cache directory missing');
  }
  
  if (fs.existsSync('dist/')) {
    successes.push('✅ Build output directory exists');
  } else {
    warnings.push('⚠️  Build output directory missing - run npm run build:all');
  }
}

// Check project structure
function checkProjectStructure() {
  console.log('📁 Checking project structure...');
  
  const requiredDirs = ['frontend', 'backend', 'contracts', 'scripts'];
  const requiredFiles = ['package.json', 'README.md', 'hardhat.config.cjs'];
  
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      successes.push(`✅ ${dir}/ directory exists`);
    } else {
      issues.push(`❌ ${dir}/ directory missing`);
    }
  });
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      successes.push(`✅ ${file} exists`);
    } else {
      issues.push(`❌ ${file} missing`);
    }
  });
  
  // Check for duplicate directories
  if (fs.existsSync('smart-contracts/') && fs.existsSync('contracts/')) {
    warnings.push('⚠️  Both smart-contracts/ and contracts/ directories exist - consider consolidating');
  }
}

// Test compilation
function testCompilation() {
  console.log('🔧 Testing compilation...');
  
  try {
    // Test Hardhat compilation
    if (fs.existsSync('hardhat.config.ts')) {
      try {
        execSync('npx hardhat compile --quiet', { stdio: 'pipe' });
        successes.push('✅ Smart contracts compile successfully');
      } catch (error) {
        issues.push('❌ Smart contract compilation failed - check Hardhat configuration');
      }
    }
  } catch (error) {
    warnings.push('⚠️  Could not test compilation - Hardhat may not be installed');
  }
}

// Generate report
function generateReport() {
  console.log('\n📊 Health Check Report');
  console.log('======================\n');
  
  if (successes.length > 0) {
    console.log('✅ Successes:');
    successes.forEach(success => console.log(`  ${success}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(warning => console.log(`  ${warning}`));
    console.log('');
  }
  
  if (issues.length > 0) {
    console.log('❌ Critical Issues:');
    issues.forEach(issue => console.log(`  ${issue}`));
    console.log('');
  }
  
  // Summary
  const totalChecks = successes.length + warnings.length + issues.length;
  const healthScore = Math.round((successes.length / totalChecks) * 100);
  
  console.log(`🏥 Overall Health Score: ${healthScore}%`);
  
  if (healthScore >= 80) {
    console.log('🎉 Project is in good health!');
  } else if (healthScore >= 60) {
    console.log('⚠️  Project has some issues but is mostly functional');
  } else {
    console.log('🚨 Project has critical issues that need immediate attention');
  }
  
  // Recommendations
  if (issues.length > 0) {
    console.log('\n🔧 Immediate Actions Required:');
    console.log('1. Run: ./setup-project.sh');
    console.log('2. Check environment variables');
    console.log('3. Install missing dependencies');
    console.log('4. Fix configuration issues');
  }
  
  if (warnings.length > 0) {
    console.log('\n💡 Recommendations:');
    console.log('1. Update outdated dependencies');
    console.log('2. Configure missing environment variables');
    console.log('3. Run: npm run build:all');
  }
}

// Run all checks
async function runHealthCheck() {
  checkNodeVersion();
  checkNpmVersion();
  checkDependencies();
  checkConfigFiles();
  checkEnvironment();
  checkSmartContracts();
  checkBuildArtifacts();
  checkProjectStructure();
  testCompilation();
  generateReport();
}

// Run the health check
runHealthCheck().catch(error => {
  console.error('❌ Health check failed:', error.message);
  process.exit(1);
});
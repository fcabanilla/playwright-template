#!/usr/bin/env node

/**
 * Azure Playwright Testing Setup Validator
 * 
 * This script validates the Azure Playwright Testing setup and configuration.
 * Run this script to ensure all components are properly configured.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Helper functions
const log = (message, color = colors.reset) => console.log(`${color}${message}${colors.reset}`);
const success = (message) => log(`✓ ${message}`, colors.green);
const error = (message) => log(`✗ ${message}`, colors.red);
const warning = (message) => log(`⚠ ${message}`, colors.yellow);
const info = (message) => log(`ℹ ${message}`, colors.blue);

// Validation functions
const validateEnvironment = () => {
  info('Validating environment variables...');
  
  // Check if .env file exists
  if (!fs.existsSync('.env')) {
    error('.env file not found');
    return false;
  }
  
  // Read .env file
  const envContent = fs.readFileSync('.env', 'utf8');
  
  // Check for required variables
  const requiredVars = ['PLAYWRIGHT_SERVICE_URL'];
  let isValid = true;
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      error(`${varName} not found in .env file`);
      isValid = false;
    } else {
      success(`${varName} found in .env file`);
    }
  });
  
  // Validate URL format
  const urlMatch = envContent.match(/PLAYWRIGHT_SERVICE_URL=(.+)/);
  if (urlMatch) {
    const url = urlMatch[1];
    if (url.startsWith('wss://')) {
      success('PLAYWRIGHT_SERVICE_URL format is valid');
    } else {
      error('PLAYWRIGHT_SERVICE_URL must start with wss://');
      isValid = false;
    }
  }
  
  return isValid;
};

const validateConfigFiles = () => {
  info('Validating configuration files...');
  
  const requiredFiles = [
    'playwright.config.ts',
    'playwright.service.config.ts',
    'package.json'
  ];
  
  let isValid = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      success(`${file} found`);
    } else {
      error(`${file} not found`);
      isValid = false;
    }
  });
  
  return isValid;
};

const validateAzureCLI = () => {
  info('Validating Azure CLI...');
  
  try {
    const version = execSync('az --version', { encoding: 'utf8', stdio: 'pipe' });
    success('Azure CLI is installed and accessible');
    
    // Check if logged in
    try {
      const account = execSync('az account show', { encoding: 'utf8', stdio: 'pipe' });
      success('Azure CLI is authenticated');
      
      // Parse account info
      const accountInfo = JSON.parse(account);
      info(`Logged in as: ${accountInfo.user.name}`);
      info(`Subscription: ${accountInfo.name}`);
      info(`Tenant: ${accountInfo.tenantId}`);
      
      return true;
    } catch (e) {
      error('Azure CLI is not authenticated. Run: az login');
      return false;
    }
  } catch (e) {
    error('Azure CLI is not installed or not accessible');
    return false;
  }
};

const validatePackageJson = () => {
  info('Validating package.json scripts...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const scripts = packageJson.scripts || {};
    
    const requiredScripts = [
      'test:azure',
      'test:azure:navbar',
      'test:azure:seatpicker',
      'test:azure:movies'
    ];
    
    let isValid = true;
    
    requiredScripts.forEach(script => {
      if (scripts[script]) {
        success(`Script "${script}" found`);
      } else {
        error(`Script "${script}" not found in package.json`);
        isValid = false;
      }
    });
    
    // Check for Azure package dependency
    const devDeps = packageJson.devDependencies || {};
    if (devDeps['@azure/microsoft-playwright-testing']) {
      success('Azure Playwright Testing package found in dependencies');
    } else {
      error('Azure Playwright Testing package not found in dependencies');
      isValid = false;
    }
    
    return isValid;
  } catch (e) {
    error('Error reading package.json');
    return false;
  }
};

const validatePlaywrightServiceConfig = () => {
  info('Validating playwright.service.config.ts...');
  
  try {
    const configContent = fs.readFileSync('playwright.service.config.ts', 'utf8');
    
    // Check for required imports
    const requiredImports = [
      'dotenv/config',
      '@azure/microsoft-playwright-testing'
    ];
    
    let isValid = true;
    
    requiredImports.forEach(importName => {
      if (configContent.includes(importName)) {
        success(`Import "${importName}" found`);
      } else {
        error(`Import "${importName}" not found`);
        isValid = false;
      }
    });
    
    // Check for worker configuration
    if (configContent.includes('workers:')) {
      success('Worker configuration found');
    } else {
      warning('Worker configuration not found');
    }
    
    return isValid;
  } catch (e) {
    error('Error reading playwright.service.config.ts');
    return false;
  }
};

const runConnectivityTest = () => {
  info('Running connectivity test...');
  
  try {
    // Try to run a simple Azure test
    const result = execSync('npm run test:azure:navbar', { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 30000
    });
    
    if (result.includes('Running tests using Microsoft Playwright Testing service')) {
      success('Azure connectivity test passed');
      return true;
    } else {
      warning('Azure connectivity test completed but results unclear');
      return false;
    }
  } catch (e) {
    error('Azure connectivity test failed');
    console.log('Error details:', e.message);
    return false;
  }
};

// Main validation function
const validateSetup = async () => {
  log('\n🔍 Azure Playwright Testing Setup Validator\n', colors.blue);
  
  const validations = [
    { name: 'Environment Variables', fn: validateEnvironment },
    { name: 'Configuration Files', fn: validateConfigFiles },
    { name: 'Azure CLI', fn: validateAzureCLI },
    { name: 'Package.json', fn: validatePackageJson },
    { name: 'Playwright Service Config', fn: validatePlaywrightServiceConfig }
  ];
  
  let allValid = true;
  
  for (const validation of validations) {
    log(`\n--- ${validation.name} ---`);
    const result = validation.fn();
    if (!result) {
      allValid = false;
    }
  }
  
  // Summary
  log('\n--- Summary ---');
  if (allValid) {
    success('All validations passed! Setup is ready for use.');
    info('You can now run: npm run test:azure');
  } else {
    error('Some validations failed. Please fix the issues above.');
  }
  
  // Optional connectivity test
  if (allValid) {
    log('\n--- Optional Connectivity Test ---');
    warning('This will run a real test. Press Ctrl+C to skip.');
    
    setTimeout(() => {
      runConnectivityTest();
    }, 3000);
  }
};

// Run validation
validateSetup().catch(console.error);

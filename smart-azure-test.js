#!/usr/bin/env node

/**
 * Smart Azure Test Runner
 * Automatically detects environment and runs tests with appropriate configuration
 * - Local development: Uses local browsers with Azure reporting
 * - CI/Pipeline: Attempts cloud browsers, falls back to local if needed
 */

import { execSync } from 'child_process';
import path from 'path';

// Detect if we're in CI environment
const isCI = process.env.CI === 'true' || 
             process.env.GITHUB_ACTIONS === 'true' || 
             process.env.AZURE_PIPELINES === 'True' ||
             process.env.BUILD_BUILDID; // Azure DevOps

// Get test file from command line args
const testFile = process.argv[2] || 'tests/cinesa/navbar/navbar.spec.ts';
const workers = process.argv[3] || '5';

console.log(`🔍 Environment detected: ${isCI ? 'CI/Pipeline' : 'Local Development'}`);
console.log(`📁 Test file: ${testFile}`);
console.log(`⚡ Workers: ${workers}`);

function runTest(config, description) {
  console.log(`\n🚀 ${description}`);
  const command = `npx playwright test ${testFile} --config=${config} --workers=${workers}`;
  console.log(`📝 Command: ${command}`);
  
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} - SUCCESS`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} - FAILED`);
    return false;
  }
}

async function main() {
  if (isCI) {
    console.log('\n🔧 CI Environment - Attempting cloud browsers first...');
    
    // Try cloud browsers first in CI
    const cloudSuccess = runTest('playwright.service.cloud.config.ts', 'Cloud Browser Execution');
    
    if (!cloudSuccess) {
      console.log('\n🔄 Cloud browsers failed, falling back to local browsers...');
      const localSuccess = runTest('playwright.local.config.ts', 'Local Browser Execution (Fallback)');
      
      if (!localSuccess) {
        console.log('\n💥 Both cloud and local execution failed!');
        process.exit(1);
      }
    }
  } else {
    console.log('\n🏠 Local Environment - Using local browsers with Azure reporting...');
    const success = runTest('playwright.local.config.ts', 'Local Browser Execution');
    
    if (!success) {
      console.log('\n💥 Local execution failed!');
      process.exit(1);
    }
  }
  
  console.log('\n🎉 Test execution completed successfully!');
}

main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});

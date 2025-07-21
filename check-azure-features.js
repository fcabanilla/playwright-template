#!/usr/bin/env node

/**
 * Azure Playwright Testing Feature Status Checker
 * 
 * This script checks the registration status of Azure Playwright Testing features
 * and provides guidance on when cloud browsers will be available.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const REQUIRED_FEATURES = [
    'Microsoft.AzurePlaywrightService/playwrightServiceBetaAccess',
    'Microsoft.AzurePlaywrightService/PlaywrightServicePublicPreviewRegions'
];

async function checkFeatureStatus() {
    console.log('🔍 Checking Azure Playwright Testing feature registration status...\n');
    
    try {
        // Check feature registration status
        const { stdout } = await execAsync(
            'az feature list --namespace Microsoft.AzurePlaywrightService --query "[].{name: name, state: properties.state}" -o json'
        );
        
        const features = JSON.parse(stdout);
        
        console.log('📋 Feature Registration Status:');
        console.log('='.repeat(60));
        
        let allRegistered = true;
        
        for (const requiredFeature of REQUIRED_FEATURES) {
            const feature = features.find(f => f.name === requiredFeature);
            const status = feature ? feature.state : 'Not Found';
            const emoji = status === 'Registered' ? '✅' : status === 'Pending' ? '⏳' : '❌';
            
            console.log(`${emoji} ${requiredFeature.split('/')[1]}: ${status}`);
            
            if (status !== 'Registered') {
                allRegistered = false;
            }
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (allRegistered) {
            console.log('🎉 All features are registered! Cloud browsers should be available.');
            console.log('\n📝 Next steps:');
            console.log('1. Update playwright.service.config.ts:');
            console.log('   useCloudHostedBrowsers: true');
            console.log('2. Test with: npm run test:azure:navbar');
        } else {
            console.log('⏳ Features are still registering. This can take 24-48 hours.');
            console.log('\n📊 Current status:');
            console.log('• Local execution + Azure reporting: ✅ Working');
            console.log('• Cloud browser execution: ⏳ Waiting for feature registration');
            console.log('\n🔄 Check again later with: node check-azure-features.js');
        }
        
        // Check workspace status
        console.log('\n🏢 Checking workspace status...');
        await checkWorkspaceStatus();
        
    } catch (error) {
        console.error('❌ Error checking feature status:', error.message);
        console.log('\n💡 Make sure you are logged in to Azure CLI:');
        console.log('   az login');
    }
}

async function checkWorkspaceStatus() {
    try {
        const subscriptionId = 'c1022cb9-166f-4b5c-b301-557dab5f2ff4';
        const resourceGroup = 'playwright-testing-rg';
        const workspaceName = 'playwrightTestingWithFeatures';
        
        const { stdout } = await execAsync(
            `az rest --method get --url "https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.AzurePlaywrightService/accounts/${workspaceName}?api-version=2023-10-01-preview"`
        );
        
        const workspace = JSON.parse(stdout);
        const properties = workspace.properties;
        
        console.log('📊 Workspace Properties:');
        console.log(`   • Reporting: ${properties.reporting} ${properties.reporting === 'Enabled' ? '✅' : '❌'}`);
        console.log(`   • Scalable Execution: ${properties.scalableExecution} ${properties.scalableExecution === 'Enabled' ? '✅' : '❌'}`);
        console.log(`   • Regional Affinity: ${properties.regionalAffinity} ${properties.regionalAffinity === 'Enabled' ? '✅' : '❌'}`);
        console.log(`   • Local Auth: ${properties.localAuth} ${properties.localAuth === 'Enabled' ? '✅' : '⏳'}`);
        
        if (properties.localAuth === 'Enabled') {
            console.log('\n🎯 Local Auth is enabled! You can now use cloud browsers.');
        } else {
            console.log('\n⏳ Local Auth is still disabled. Waiting for feature registration to complete.');
        }
        
    } catch (error) {
        console.log('   ⚠️  Could not fetch workspace details:', error.message);
    }
}

// Run the check
checkFeatureStatus();

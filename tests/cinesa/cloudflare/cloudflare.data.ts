/**
 * Cloudflare test data and URL configurations
 * Following architectural pattern from copilot-instructions.md
 */

import { CinesaEnvironment } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';

/**
 * Environment-specific URLs for Cloudflare testing
 * Uses dynamic configuration based on TEST_ENV
 */
export const cloudflareUrls = {
  production: 'https://www.cinesa.es/',
  preprod: 'https://preprod-web.ocgtest.es/',
  lab: 'https://lab-web.ocgtest.es/',
  staging: 'https://stage-web.ocgtest.es/',
  development: 'https://dev.cinesa.es/',
} as const;

/**
 * Gets the target URL based on current environment
 */
export function getTargetUrl(): string {
  return cloudflareUrls[env] || cloudflareUrls.production;
}

/**
 * Expected User-Agent for automation suite
 */
export const expectedUserAgent =
  'QA-AutomationSuite/1.0 (+https://cinesa.es) / 7f4c3d1b9a6e4a08';

/**
 * Cloudflare-related domains for detection
 */
export const cloudflareIdentifiers = {
  accessDomain: 'cloudflareaccess.com',
  loginPath: '/cdn-cgi/access/login/',
  signInTitle: 'Sign in ・ Cloudflare Access',
} as const;

/**
 * Test scenarios and expected results
 */
export const testScenarios = {
  bypassWorking: {
    description: 'User-Agent whitelisting is working correctly',
    expectedCloudflare: false,
    expectedTargetDomain: true,
  },
  bypassBlocked: {
    description: 'Server-side whitelisting problem detected',
    expectedCloudflare: true,
    expectedTargetDomain: true,
  },
} as const;

/**
 * Diagnostic messages and conclusions
 */
export const diagnosticMessages = {
  success: {
    conclusion: '🎉 SUCCESS: User-Agent whitelisting is working correctly!',
    recommendation: '✅ Recommendation: No action needed, bypass is functional',
  },
  serverSideIssue: {
    conclusion: '❌ ISSUE: Server-side whitelisting problem detected',
    rootCause:
      '🔧 Root Cause: User-Agent is correct but not whitelisted on server',
    action:
      '📧 Action Required: Submit support ticket for server configuration',
    evidence: '📋 Evidence: All client-side settings are correct',
  },
  clientSideIssue: {
    conclusion: '⚠️  ISSUE: Client-side configuration problem detected',
    userAgentFix: '🔧 Fix: Update User-Agent configuration',
    webdriverFix: '🔧 Fix: Remove webdriver detection signals',
    action: '📋 Action Required: Fix browser/Playwright configuration',
  },
  unknown: {
    conclusion: '❓ UNKNOWN: Unexpected navigation behavior',
    action: '🔧 Action Required: Manual investigation needed',
  },
} as const;

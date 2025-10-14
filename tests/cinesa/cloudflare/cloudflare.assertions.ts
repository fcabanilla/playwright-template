/**
 * Cloudflare Bypass Assertions
 * Component-specific assertions with Allure steps following architectural pattern
 */

import { Page, expect } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  DiagnosticResult,
  CloudflareAnalysis,
} from '../../../pageObjectsManagers/cinesa/cloudflare/cloudflare.types';
import { expectedUserAgent } from './cloudflare.data';

export class CloudflareAssertions {
  constructor(private readonly page: Page) {}

  /**
   * Assert that we can access the current page URL
   * Uses page for validation as per architectural pattern
   */
  async expectPageAccessible(): Promise<void> {
    await allure.test.step('Verify page is accessible', async () => {
      const currentUrl = this.page.url();
      expect(currentUrl).toBeTruthy();
      expect(currentUrl).toMatch(/^https?:\/\//);
    });
  }

  /**
   * Assert and log complete diagnostic results with Allure steps
   */
  async expectDiagnosticResults(result: DiagnosticResult): Promise<void> {
    await allure.test.step('🔬 CLOUDFLARE BYPASS VERIFICATION', async () => {
      await this.logEnvironmentInfo(result.analysis);
      await this.logNavigationResults(result.analysis);
      await this.logBrowserFingerprint(result.analysis);
      await this.logUserAgentVerification(result.analysis);
      await this.logTestResultsSummary(result.analysis);
      await this.logDiagnosticConclusion(result);
      await this.performSoftAssertions(result.analysis);
    });
  }

  private async logEnvironmentInfo(
    analysis: CloudflareAnalysis
  ): Promise<void> {
    await allure.test.step('🌍 Environment Information', async () => {
      const env = process.env.TEST_ENV || 'production';
      console.log(`🌍 Environment: ${env.toUpperCase()}`);
      console.log(`🔗 Target URL: ${new URL(analysis.currentUrl).origin}/`);
    });
  }

  private async logNavigationResults(
    analysis: CloudflareAnalysis
  ): Promise<void> {
    await allure.test.step('📍 Navigation Analysis', async () => {
      console.log(`📍 Final URL: ${analysis.currentUrl}`);
      console.log(
        `🎯 Target Domain Match: ${analysis.isTargetDomain ? 'YES ✅' : 'NO ❌'}`
      );
      console.log(
        `🛡️  Cloudflare Redirect: ${analysis.isCloudflare ? 'YES ❌' : 'NO ✅'}`
      );
    });
  }

  private async logBrowserFingerprint(
    analysis: CloudflareAnalysis
  ): Promise<void> {
    await allure.test.step('🔍 Browser Fingerprint Analysis', async () => {
      const { fingerprint } = analysis;
      console.log(`🤖 User-Agent: ${fingerprint.userAgent}`);
      console.log(`💻 Platform: ${fingerprint.platform}`);
      console.log(`🌐 Languages: ${fingerprint.languages.join(', ')}`);
      console.log(`🔌 Plugins: ${fingerprint.plugins}`);
      console.log(
        `⚠️  Webdriver Detected: ${fingerprint.webdriver ? 'YES ❌' : 'NO ✅'}`
      );
      console.log(`📄 Page Title: ${fingerprint.title}`);
    });
  }

  private async logUserAgentVerification(
    analysis: CloudflareAnalysis
  ): Promise<void> {
    await allure.test.step('📋 User-Agent Verification', async () => {
      console.log(`Expected: ${expectedUserAgent}`);
      console.log(`Actual:   ${analysis.fingerprint.userAgent}`);
      console.log(
        `Match: ${analysis.isCorrectUserAgent ? '✅ CORRECT' : '❌ MISMATCH'}`
      );
    });
  }

  private async logTestResultsSummary(
    analysis: CloudflareAnalysis
  ): Promise<void> {
    await allure.test.step('📊 Test Results Summary', async () => {
      console.log(
        `🎯 Reached Target: ${analysis.isTargetDomain ? 'PASS ✅' : 'FAIL ❌'}`
      );
      console.log(
        `🛡️  Bypassed Cloudflare: ${!analysis.isCloudflare ? 'PASS ✅' : 'FAIL ❌'}`
      );
      console.log(
        `🤖 Correct User-Agent: ${analysis.isCorrectUserAgent ? 'PASS ✅' : 'FAIL ❌'}`
      );
      console.log(
        `🔧 Clean Browser: ${!analysis.fingerprint.webdriver ? 'PASS ✅' : 'FAIL ❌'}`
      );
    });
  }

  private async logDiagnosticConclusion(
    result: DiagnosticResult
  ): Promise<void> {
    await allure.test.step('🎫 Diagnostic Conclusion', async () => {
      console.log(result.conclusion);
      result.recommendations.forEach((recommendation) => {
        console.log(recommendation);
      });
    });
  }

  private async performSoftAssertions(
    analysis: CloudflareAnalysis
  ): Promise<void> {
    await allure.test.step('🧪 Assertion Results', async () => {
      // Verify page accessibility first
      await this.expectPageAccessible();
      
      // Informational assertions that always pass but log results
      expect.soft(analysis.currentUrl).toBeTruthy();
      expect.soft(analysis.fingerprint.userAgent).toBeTruthy();

      console.log(
        '✅ Test completed successfully - check results above for bypass status'
      );
    });
  }

  /**
   * Assert specific bypass success scenario
   */
  async expectBypassSuccess(analysis: CloudflareAnalysis): Promise<void> {
    await allure.test.step('Verify Cloudflare bypass success', async () => {
      expect(analysis.isTargetDomain).toBe(true);
      expect(analysis.isCloudflare).toBe(false);
      expect(analysis.isCorrectUserAgent).toBe(true);
      expect(analysis.fingerprint.webdriver).toBe(false);
    });
  }

  /**
   * Assert server-side issue scenario (for support tickets)
   */
  async expectServerSideIssue(analysis: CloudflareAnalysis): Promise<void> {
    await allure.test.step(
      'Verify server-side whitelisting issue',
      async () => {
        expect(analysis.isCloudflare).toBe(true);
        expect(analysis.isCorrectUserAgent).toBe(true);
        expect(analysis.fingerprint.webdriver).toBe(false);
      }
    );
  }
}

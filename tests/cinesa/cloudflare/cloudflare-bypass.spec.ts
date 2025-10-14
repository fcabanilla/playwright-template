/**
 * Cloudflare Bypass Verification
 *
 * Tests if User-Agent whitelisting is working correctly across environments
 * Provides detailed analysis when bypass fails
 *
 * Usage:
 * - TEST_ENV=preprod npx playwright test tests/cinesa/cloudflare/cloudflare-bypass.spec.ts
 * - TEST_ENV=lab npx playwright test tests/cinesa/cloudflare/cloudflare-bypass.spec.ts
 * - TEST_ENV=staging npx playwright test tests/cinesa/cloudflare/cloudflare-bypass.spec.ts
 *
 * Architecture: Follows clean code patterns from copilot-instructions.md
 * - Uses fixtures for dependency injection
 * - Separates data, page objects, and assertions
 * - WebActions abstraction for Playwright API access
 */

import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { CloudflareAssertions } from './cloudflare.assertions';

test.describe('Cloudflare Bypass Verification', () => {
  test('should verify User-Agent whitelisting works', async ({
    page,
    cloudflare,
  }) => {
    // Create assertions instance following architectural pattern
    const assertions = new CloudflareAssertions(page);

    // Perform complete diagnostic using Page Object
    const diagnosticResult = await cloudflare.performDiagnostic();

    // Assert and log results with Allure steps
    await assertions.expectDiagnosticResults(diagnosticResult);
  });

  test('should handle production environment bypass', async ({
    page,
    cloudflare,
  }) => {
    const env = process.env.TEST_ENV || 'production';

    if (env === 'production') {
      const assertions = new CloudflareAssertions(page);
      const analysis = await cloudflare.navigateAndAnalyze();

      // Production should have working bypass
      await assertions.expectBypassSuccess(analysis);
    }
  });

  test('should detect server-side issues in non-production environments', async ({
    page,
    cloudflare,
  }) => {
    const env = process.env.TEST_ENV || 'production';

    if (env !== 'production') {
      const assertions = new CloudflareAssertions(page);
      const analysis = await cloudflare.navigateAndAnalyze();

      // Non-production environments should show server-side whitelisting issues
      await assertions.expectServerSideIssue(analysis);
    }
  });
});

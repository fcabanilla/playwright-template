import { defineConfig } from '@playwright/test';
import * as os from 'node:os';
import * as dotenv from 'dotenv';
import {
  getUCICinemasProject,
  getCinesaProject,
  getCinesaPortugalProject,
  getCloudflareOnlyProject,
  getCinesaCloudflareProject,
  getPraetorCinesaProject,
} from './config/projects';
import {
  shouldUsePlaywrightService,
  getServiceConnectionOptions,
  playwrightServiceConfig,
} from './config/azure/playwright-service.config';
import { testPlanFilter } from 'allure-playwright/dist/testplan.js';
import { getCinesaStorageStatePath } from './config/projects/storageState.helper';
import getCloudflareHeaders from './core/cloudflare/cloudflareHeaders';

// Load environment variables from .env file
dotenv.config();

// Debug testplan
const _tp = testPlanFilter();
if (_tp)
  console.log(
    '[TESTPLAN DEBUG] grep filters:',
    _tp.length,
    'regexes. First:',
    _tp[0]?.toString().slice(0, 100)
  );
else console.log('[TESTPLAN DEBUG] no testplan active');

export default defineConfig({
  // Allure TestPlan filtering: when ALLURE_TESTPLAN_PATH env var is set,
  // only tests listed in the testplan.json are executed.
  // When not set, testPlanFilter() returns undefined → no filtering applied.
  grep: _tp,
  name: 'Multi-Cinema Test Suite',
  // Global timeout for each test (90 seconds - for complete E2E flows)
  timeout: 90000,

  // Output directory for videos, screenshots, and traces
  outputDir: '.allure/playwright-artifacts',

  // Base configuration that will be applied to all projects
  use: {
    headless: false, // Default headless (can be overridden with --headed in command)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', // Record and retain only on failure (more efficient than 'on')
    trace: 'retain-on-failure', // Traces only on failure
    actionTimeout: 30000, // Reduced to 30s (sufficient with auto-waiting)
    navigationTimeout: 30000, // Reduced to 30s

    // Microsoft Playwright Testing Service Configuration
    // When enabled, tests run in cloud with online reporting
    ...(getServiceConnectionOptions()
      ? {
          connectOptions: getServiceConnectionOptions(),
        }
      : {}),

    // Browser configuration
    userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36${
      process.env.USER_AGENT_SUFFIX ? ` ${process.env.USER_AGENT_SUFFIX}` : ''
    }`,
    viewport: { width: 1920, height: 1080 },
    locale: 'es-ES',
    permissions: ['clipboard-read', 'clipboard-write'],
    javaScriptEnabled: true,
    bypassCSP: true,
    extraHTTPHeaders: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'sec-ch-ua':
        '"Google Chrome";v="120", "Not_A Brand";v="8", "Chromium";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      DNT: '1',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
    },
    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--disable-extensions',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--start-maximized',
        '--window-size=1920,1080',
      ],
    },
  },

  fullyParallel: true,
  workers: process.env.CI ? 2 : 3, // CI: 2 workers, Local: 3 workers (stability/speed balance)

  // Separate projects for UCI, Cinesa Spain, Cinesa Portugal and a specific project for
  // Cloudflare diagnostics (tests only in ./tests/cinesa/cloudflare)
  projects: [
    // Setup project - runs FIRST to generate storageState files with cookie consent
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Showtimes discovery — run independently to refresh showtime IDs
    // Usage: TEST_ENV=preprod npx playwright test --project=showtimes-setup
    {
      name: 'showtimes-setup',
      testMatch: /showtimes\.setup\.ts/,
      use: {
        storageState: getCinesaStorageStatePath(process.env.TEST_ENV),
        extraHTTPHeaders: getCloudflareHeaders() || {},
        // CF headers via extraHTTPHeaders are sent to ALL requests including
        // cross-origin Vista API (preprod-vwc.ocgtest.es). CORS preflight
        // rejects them → all API calls fail. Disable web security to bypass.
        launchOptions: {
          args: ['--disable-web-security'],
        },
      },
    },

    // Main projects - storageState files persist across runs
    // Run `npx playwright test --project=setup` manually if consent states expire
    getUCICinemasProject(),
    getCinesaProject(),
    getCinesaPortugalProject(),
    getCloudflareOnlyProject(),
    getCinesaCloudflareProject(),
    getPraetorCinesaProject(),
  ],

  // Reporter configured to differentiate projects
  reporter: [
    ['list'], // Console reporter cleaner than 'line'
    [
      'allure-playwright',
      {
        outputFolder: '.allure/results',
        detail: false, // Hides internal Playwright steps (browser, context, page, evaluate) for cleaner reports
        suiteTitle: true, // Groups tests by file in the report (default: true)
        links: {
          // Templates for links to JIRA, GitHub Issues, etc.
          issue: {
            urlTemplate: 'https://se-ocg.atlassian.net/browse/%s',
            nameTemplate: 'Issue #%s',
          },
          tms: {
            urlTemplate: 'https://se-ocg.atlassian.net/browse/%s',
            nameTemplate: 'Test Case %s',
          },
        },
        // Categories are defined in .allure/categories.json (copied to results/ before report generation)
        // See docs/ALLURE_CATEGORIES.md for details
        environmentInfo: {
          Project: 'Multi-Cinema Test Suite',
          Platform: process.env.TEST_PLATFORM || 'Cinesa',
          Environment: process.env.TEST_ENV || 'production',
          'Base URL': process.env.BASE_URL || 'https://www.cinesa.es',
          Browser: 'Chromium',
          Workers: String(process.env.WORKERS || '3'),
          'Node Version': process.version,
          OS: `${os.platform()} ${os.release()}`,
          'Run Date': new Date().toISOString(),
          'Playwright Service': shouldUsePlaywrightService()
            ? 'Enabled (Cloud)'
            : 'Disabled (Local)',
          'Service Region': shouldUsePlaywrightService()
            ? playwrightServiceConfig.region
            : 'N/A',
        },
      },
    ],
  ],
});

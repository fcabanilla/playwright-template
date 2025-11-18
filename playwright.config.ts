import { defineConfig } from '@playwright/test';
import * as os from 'node:os';
import * as dotenv from 'dotenv';
import {
  getUCICinemasProject,
  getCinesaProject,
  getCinesaPortugalProject,
  getCloudflareOnlyProject,
  getCinesaCloudflareProject,
} from './config/projects';
import { 
  shouldUsePlaywrightService, 
  getServiceConnectionOptions,
  playwrightServiceConfig 
} from './config/azure/playwright-service.config';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  name: 'Multi-Cinema Test Suite',
  // Timeout global para cada test (90 segundos - para flujos E2E completos)
  timeout: 90000,

  // Directorio de salida para videos, screenshots y traces
  outputDir: '.allure/playwright-artifacts',

  // Configuración base que se aplicará a todos los proyectos
  use: {
    headless: true, // Default headless (puedes override con --headed en comando)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', // Graba y retiene solo si falla (más eficiente que 'on')
    trace: 'retain-on-failure', // Traces solo en fallos
    actionTimeout: 30000, // Reducido a 30s (suficiente con auto-waiting)
    navigationTimeout: 30000, // Reducido a 30s

    // Microsoft Playwright Testing Service Configuration
    // When enabled, tests run in cloud with online reporting
    ...(getServiceConnectionOptions() ? {
      connectOptions: getServiceConnectionOptions()
    } : {}),

    // Configuraciones agresivas para evadir Cloudflare
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
  workers: process.env.CI ? 2 : 3, // CI: 2 workers, Local: 3 workers (balance estabilidad/velocidad)

  // Proyectos separados para UCI, Cinesa España, Cinesa Portugal y un proyecto específico para
  // diagnósticos de Cloudflare (solo tests en ./tests/cinesa/cloudflare)
  projects: [
    // Setup project - runs FIRST to generate storageState files with cookie consent
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Main projects - depend on setup to have storageState ready
    {
      ...getUCICinemasProject(),
      dependencies: ['setup'],
    },
    {
      ...getCinesaProject(),
      //dependencies: ['setup'],
    },
    {
      ...getCinesaPortugalProject(),
      dependencies: ['setup'],
    },
    {
      ...getCloudflareOnlyProject(),
      dependencies: ['setup'],
    },
    {
      ...getCinesaCloudflareProject(),
      dependencies: ['setup'],
    },
  ],

  // Reporter configurado para diferenciar proyectos
  reporter: [
    ['list'], // Console reporter más limpio que 'line'
    [
      'allure-playwright',
      {
        resultsDir: '.allure/results',
        detail: false, // Oculta steps internos de Playwright (browser, context, page, evaluate) para reportes más limpios
        suiteTitle: true, // Agrupa tests por archivo en el reporte (default: true)
        links: {
          // Plantillas para enlaces a JIRA, GitHub Issues, etc.
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
          Environment: process.env.TEST_ENV || 'production',
          Browser: 'Chromium',
          'Node Version': process.version,
          OS: `${os.platform()} ${os.release()}`,
          'Playwright Service': shouldUsePlaywrightService() ? 'Enabled (Cloud)' : 'Disabled (Local)',
          'Service Region': shouldUsePlaywrightService() ? playwrightServiceConfig.region : 'N/A',
        },
      },
    ],
  ],
});

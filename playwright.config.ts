import { defineConfig } from '@playwright/test';
import * as os from 'node:os';
import * as dotenv from 'dotenv';
import {
  getUCICinemasProject,
  getCinesaProject,
  getCloudflareOnlyProject,
  getCinesaCloudflareProject,
} from './config/projects';

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
    video: 'retain-on-failure', // Solo guarda videos de tests fallidos (ahorra espacio)
    actionTimeout: 30000, // Reducido a 30s (suficiente con auto-waiting)
    navigationTimeout: 30000, // Reducido a 30s

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

  // Proyectos separados para UCI, Cinesa y un proyecto específico para
  // diagnósticos de Cloudflare (solo tests en ./tests/cinesa/cloudflare)
  projects: [
    getUCICinemasProject(),
    getCinesaProject(),
    getCloudflareOnlyProject(),
    getCinesaCloudflareProject(),
  ],

  // Reporter configurado para diferenciar proyectos
  reporter: [
    ['list'], // Console reporter más limpio que 'line'
    [
      'allure-playwright',
      {
        resultsDir: '.allure/results',
        detail: true, // Genera steps automáticos para llamadas Playwright, hooks y assertions
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
        categories: [
          {
            name: '🔒 Cloudflare Protection Issues',
            messageRegex: '.*(cloudflare|protection|challenge|captcha).*',
            traceRegex: '.*(cloudflare|TimeoutError|Navigation timeout).*',
            matchedStatuses: ['failed', 'broken'], // lowercase en v3
          },
          {
            name: '🎭 Modal & Overlay Issues',
            messageRegex: '.*(modal|overlay|popup|banner|promotional).*',
            traceRegex: '.*(click intercepted|element not found|not visible).*',
            matchedStatuses: ['failed', 'broken'],
          },
          {
            name: '🧭 Navigation & URL Issues',
            messageRegex: '.*(navigation|url|redirect|timeout).*',
            traceRegex: '.*(goto|navigate|waitForURL|expect.*toHaveURL).*',
            matchedStatuses: ['failed', 'broken'],
          },
          {
            name: '🎬 Film Content Issues',
            messageRegex: '.*(film|movie|title|card).*',
            traceRegex: '.*(getFilmTitles|selectFilm|film.*not found).*',
            matchedStatuses: ['failed', 'broken'],
          },
          {
            name: '🏢 Cinema Selection Issues',
            messageRegex: '.*(cinema|location|venue).*',
            traceRegex: '.*(getCinemaNames|selectCinema|cinema.*not found).*',
            matchedStatuses: ['failed', 'broken'],
          },
        ],
        environmentInfo: {
          Project: 'Multi-Cinema Test Suite',
          Environment: process.env.TEST_ENV || 'production',
          Browser: 'Chromium',
          'Node Version': process.version,
          OS: `${os.platform()} ${os.release()}`,
        },
      },
    ],
  ],
});

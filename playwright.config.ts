import { defineConfig } from '@playwright/test';
import * as os from 'node:os';

export default defineConfig({
  name: 'UCI Cinemas',
  // Timeout global para cada test (60 segundos)
  timeout: 60000,

  // Directorio de salida para videos, screenshots y traces
  outputDir: '.allure/playwright-artifacts',

  // Configuración base que se aplicará a todos los proyectos
  use: {
    headless: false, // Ejecuta el navegador con interfaz gráfica para parecer más humano
    screenshot: 'only-on-failure',
    video: 'on',
    actionTimeout: 60000,
    navigationTimeout: 60000,

    // User-Agent whitelisteado para Cloudflare (Cinesa ES/PT, stage, preprod, prod)
    userAgent: 'QA-AutomationSuite/1.0 (+https://cinesa.es) / 7f4c3d1b9a6e4a08',
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
  workers: 5, // Optimized for stability and performance balance

  // Proyectos separados para UCI y Cinesa
  projects: [
    {
      name: 'UCI Cinemas',
      testDir: './tests/uci',
      use: {
        ...{
          headless: true,
          screenshot: 'only-on-failure',
          video: 'on',
          actionTimeout: 60000,
          navigationTimeout: 60000,
          // Usa el estado guardado para saltar login/cloudflare
          storageState:
            process.env.TEST_ENV === 'preprod'
              ? 'loggedInState.preprod.json'
              : process.env.TEST_ENV === 'lab'
                ? 'loggedInState.lab.json'
                : 'loggedInState.json',
          // Configuraciones específicas para evadir detección
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
            ],
          },
        },
      },
    },
    {
      name: 'Cinesa',
      testDir: './tests/cinesa',
      use: {
        ...{
          headless: true,
          screenshot: 'only-on-failure',
          video: 'on',
          actionTimeout: 60000,
          navigationTimeout: 60000,
          // Usa el estado guardado para saltar login/cloudflare en preprod
          storageState:
            process.env.TEST_ENV === 'preprod'
              ? 'loggedInState.preprod.json'
              : process.env.TEST_ENV === 'lab'
                ? 'loggedInState.lab.json'
                : 'loggedInState.json',
          // Configuraciones específicas para evadir detección
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
            ],
          },
        },
      },
    },
  ],

  // Reporter configurado para diferenciar proyectos
  reporter: [
    ['line'],
    [
      'allure-playwright',
      {
        resultsDir: '.allure/results',
        detail: true,
        suiteTitle: false,
        categories: [
          {
            name: '🔒 Cloudflare Protection Issues',
            messageRegex: '.*(cloudflare|protection|challenge|captcha).*',
            traceRegex: '.*(cloudflare|TimeoutError|Navigation timeout).*',
            matchedStatuses: ['FAILED', 'BROKEN'],
          },
          {
            name: '🎭 Modal & Overlay Issues',
            messageRegex: '.*(modal|overlay|popup|banner|promotional).*',
            traceRegex: '.*(click intercepted|element not found|not visible).*',
            matchedStatuses: ['FAILED', 'BROKEN'],
          },
          {
            name: '🧭 Navigation & URL Issues',
            messageRegex: '.*(navigation|url|redirect|timeout).*',
            traceRegex: '.*(goto|navigate|waitForURL|expect.*toHaveURL).*',
            matchedStatuses: ['FAILED', 'BROKEN'],
          },
          {
            name: '🎬 Film Content Issues',
            messageRegex: '.*(film|movie|title|card).*',
            traceRegex: '.*(getFilmTitles|selectFilm|film.*not found).*',
            matchedStatuses: ['FAILED', 'BROKEN'],
          },
          {
            name: '🏢 Cinema Selection Issues',
            messageRegex: '.*(cinema|location|venue).*',
            traceRegex: '.*(getCinemaNames|selectCinema|cinema.*not found).*',
            matchedStatuses: ['FAILED', 'BROKEN'],
          },
        ],
        environmentInfo: {
          Project: 'Multi-Cinema Test Suite',
          Environment: 'Test',
          Browser: 'Chromium (Headless)',
          Note: 'UCI Phase 1 Automation - Clean Test Names',
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
          arch: os.arch(),
        },
      },
    ],
  ],
});

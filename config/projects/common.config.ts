/**
 * Common project configuration values
 * Centralized constants to avoid hardcoding across project configs
 */

export const COMMON_TIMEOUTS = {
  action: 60000,
  navigation: 60000,
} as const;

export const COMMON_SCREENSHOTS = {
  screenshot: 'only-on-failure' as const,
  video: 'on' as const,
};

export const COMMON_BROWSER_ARGS = [
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
] as const;

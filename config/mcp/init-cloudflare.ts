/**
 * Playwright MCP init-page script for Cloudflare-protected environments (preprod/lab).
 *
 * Injects CF-Access headers + anti-detection HTTP headers into the browser context.
 * Used via: --init-page config/mcp/init-cloudflare.ts
 *
 * Reads credentials directly from .env file (self-contained, no external deps).
 * Required .env keys: CF_ACCESS_CLIENT_ID_PREPROD, CF_ACCESS_CLIENT_SECRET_PREPROD
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Parse a .env file and return a key-value map.
 * Handles comments, empty lines, quoted values, and inline comments.
 */
function parseEnvFile(filePath: string): Record<string, string> {
  const vars: Record<string, string> = {};
  try {
    const content = readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      // Strip surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
  } catch {
    // .env file not found — fall back to process.env
  }
  return vars;
}

/**
 * Resolve a Cloudflare Access env var using the same precedence as
 * core/cloudflare/cloudflareHeaders.ts:
 *   1) CF_ACCESS_CLIENT_ID_<ENV>_<DEPLOYMENT>_*
 *   2) CF_ACCESS_CLIENT_ID_<ENV>
 *   3) CF_ACCESS_CLIENT_ID
 */
function findVar(
  baseName: string,
  env: string,
  envVars: Record<string, string>
): string | undefined {
  const e = env.toUpperCase().replace(/-/g, '_');

  // 1) per-deployment pattern
  for (const k of Object.keys(envVars)) {
    if (k.startsWith(`${baseName}_${e}_`) && envVars[k]) {
      return envVars[k];
    }
  }

  // 2) per-environment
  const perEnv = `${baseName}_${e}`;
  if (envVars[perEnv]) return envVars[perEnv];

  // 3) generic fallback
  return envVars[baseName] || undefined;
}

export default async ({ page }: { page: import('playwright').Page }) => {
  const envFilePath = resolve(process.cwd(), '.env');
  const envVars = {
    ...parseEnvFile(envFilePath),
    ...process.env,
  } as Record<string, string>;

  const env = envVars['TEST_ENV'] || 'preprod';

  // --- Cloudflare Access headers ---
  const cfHeaders: Record<string, string> = {};
  const clientId = findVar('CF_ACCESS_CLIENT_ID', env, envVars);
  const clientSecret = findVar('CF_ACCESS_CLIENT_SECRET', env, envVars);

  if (clientId) cfHeaders['CF-Access-Client-Id'] = clientId;
  if (clientSecret) cfHeaders['CF-Access-Client-Secret'] = clientSecret;

  // --- Anti-detection headers (mirrors playwright.config.ts extraHTTPHeaders) ---
  const antiDetectionHeaders: Record<string, string> = {
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
  };

  // Merge: anti-detection + Cloudflare Access (CF headers take priority)
  const mergedHeaders = { ...antiDetectionHeaders, ...cfHeaders };

  await page.context().setExtraHTTPHeaders(mergedHeaders);
};

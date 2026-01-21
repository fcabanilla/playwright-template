/**
 * Consent Seeds Registry
 *
 * Resolves OneTrust consent cookies to pre-seed browsers and avoid UI banners.
 * Instead of hardcoded constants, this module now loads cookies directly from
 * the generated storageState files (state/consented.<env>.<region>.json).
 *
 * Flow:
 * 1) Resolve env/host from config
 * 2) Read storageState if it exists
 * 3) Extract Optanon* cookies into ConsentCookie shape
 * 4) Fall back to static seeds only when state files are missing
 *
 * Regenerate states with:
 *   npx playwright test --project=setup
 *
 * @see docs/adrs/0014-cookie-consent-persistence-with-storage-state.md
 * @see tests/setup/auth.setup.ts
 * @since 1.0.0
 */

import * as fs from 'node:fs';
import { getCinesaConfig, getUCIConfig, CinesaEnvironment, UCIEnvironment } from '../../config/environments';
import { getConsentStorageStatePath } from '../../config/projects/storageState.helper';

/**
 * Consent Cookie structure compatible with Playwright's BrowserContext.addCookies()
 *
 * @see https://playwright.dev/docs/api/class-browsercontext#browser-context-add-cookies
 */
export interface ConsentCookie {
  /** Cookie name (e.g., 'OptanonConsent') */
  name: string;

  /** Cookie value (OneTrust consent string) */
  value: string;

  /**
   * Cookie domain (must start with . for subdomains)
   * @example '.cinesa.es' (applies to www.cinesa.es, cdn.cinesa.es, etc.)
   */
  domain: string;

  /** Cookie path (usually '/') */
  path: string;

  /**
   * Expiration timestamp in Unix seconds (NOT milliseconds)
   * @example Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60 // 1 year
   */
  expires: number;

  /** Whether cookie is HTTP-only (usually false for OneTrust) */
  httpOnly: boolean;

  /** Whether cookie requires HTTPS (usually true for production) */
  secure: boolean;

  /** SameSite policy ('Strict' | 'Lax' | 'None') */
  sameSite: 'Strict' | 'Lax' | 'None';
}

/**
 * Registry of consent cookies by hostname.
 *
 * **Key Format:** Hostname (e.g., 'www.cinesa.es', 'www.ucicinemas.it')
 * **Value Format:** Array of ConsentCookie objects
 *
 * **Cookie Sources:**
 * - **OptanonConsent:** Main OneTrust consent string (groups, datestamp, version)
 * - **OptanonAlertBoxClosed:** Timestamp when user closed banner
 *
 * **Update Frequency:**
 * - When OneTrust CMP version changes
 * - When cookie structure/names change
 * - When new hosts/regions are added
 *
 * @example
 * ```typescript
 * const seeds = consentSeeds['www.cinesa.es'];
 * ```
 */
export const consentSeeds: Record<string, ConsentCookie[]> = buildConsentSeeds();

/**
 * Get consent cookies for a given URL.
 *
 * **Resolution Strategy:**
 * 1. Parse URL to extract hostname
 * 2. Look up hostname in consentSeeds registry
 * 3. Return cookies array or undefined
 *
 * **Hostname Extraction:**
 * - https://www.cinesa.es/peliculas → 'www.cinesa.es'
 * - www.cinesa.es → 'www.cinesa.es' (passthrough)
 *
 * @param {string} url - Full URL or hostname
 * @returns {ConsentCookie[] | undefined} Consent cookies array, or undefined if no seeds for this host
 *
 * @example
 * ```typescript
 * const seeds = getConsentSeedsFor('https://www.cinesa.es/peliculas');
 * if (seeds) {
 *   await page.context().addCookies(seeds);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Works with hostname too
 * const seeds = getConsentSeedsFor('www.cinesa.es');
 * ```
 *
 * @since 1.0.0
 */
export function getConsentSeedsFor(url: string): ConsentCookie[] | undefined {
  try {
    const hostname = new URL(url).hostname;
    return consentSeeds[hostname];
  } catch {
    // If URL parsing fails, assume it's already a hostname
    return consentSeeds[url];
  }
}

/**
 * Get all registered hostnames in consent seeds registry.
 *
 * @returns {string[]} Array of hostnames with consent seeds configured
 *
 * @example
 * ```typescript
 * const hosts = getRegisteredHosts();
 * // => ['www.cinesa.es', 'www.ucicinemas.it', 'preprod-web.ocgtest.es', ...]
 * ```
 *
 * @since 1.0.0
 */
export function getRegisteredHosts(): string[] {
  return Object.keys(consentSeeds);
}

/**
 * Check if consent seeds are available for a given URL/hostname.
 *
 * @param {string} url - Full URL or hostname
 * @returns {boolean} True if seeds available, false otherwise
 *
 * @example
 * ```typescript
 * if (hasConsentSeeds('https://www.cinesa.es')) {
 *   console.log('Consent seeds available, no banner interaction needed');
 * }
 * ```
 *
 * @since 1.0.0
 */
export function hasConsentSeeds(url: string): boolean {
  const seeds = getConsentSeedsFor(url);
  return seeds !== undefined && seeds.length > 0;
}

/**
 * Build consent seeds dynamically from storageState files.
 * Falls back to static seeds if no state is present.
 */
function buildConsentSeeds(): Record<string, ConsentCookie[]> {
  const env =
    (process.env.TEST_ENV as CinesaEnvironment | UCIEnvironment) ||
    'production';

  const registry: Record<string, ConsentCookie[]> = {};

  const cinesaConfig = getCinesaConfig(env as CinesaEnvironment);
  const cinesaHost = safeHostname(cinesaConfig.baseUrl);
  const cinesaState = getConsentStorageStatePath(env, cinesaConfig.region || 'es');
  const cinesaSeeds = extractSeedsFromState(cinesaState);
  if (cinesaHost && cinesaSeeds) {
    registry[cinesaHost] = cinesaSeeds;
  }

  const uciConfig = getUCIConfig(env as UCIEnvironment);
  const uciHost = safeHostname(uciConfig.baseUrl);
  const uciState = getConsentStorageStatePath(env, uciConfig.region || 'it');
  const uciSeeds = extractSeedsFromState(uciState);
  if (uciHost && uciSeeds) {
    registry[uciHost] = uciSeeds;
  }

  // Static fallback (empty) keeps API stable if no state files exist yet.
  return registry;
}

type StorageStateCookie = {
  name: string;
  value: string;
  domain: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
};

function extractSeedsFromState(statePath?: string): ConsentCookie[] | undefined {
  if (!statePath || !fs.existsSync(statePath)) return undefined;

  try {
    const raw = fs.readFileSync(statePath, 'utf-8');
    const parsed = JSON.parse(raw) as { cookies?: StorageStateCookie[] };
    const cookies = parsed.cookies ?? [];

    const optanonCookies = cookies.filter((cookie) =>
      cookie.name.startsWith('Optanon')
    );

    if (!optanonCookies.length) return undefined;

    return optanonCookies.map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path || '/',
      expires:
        cookie.expires ??
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      httpOnly: Boolean(cookie.httpOnly),
      secure: Boolean(cookie.secure),
      sameSite: cookie.sameSite || 'Lax',
    }));
  } catch (error) {
    console.warn(
      `[Consent Seeds] Failed to parse storageState at ${statePath}: ${String(
        error
      )}`
    );
    return undefined;
  }
}

function safeHostname(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

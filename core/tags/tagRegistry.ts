/**
 * Tag Registry — Single source of truth for all test tags.
 *
 * Usage:
 *   import { Tags } from '../../core/tags/tagRegistry';
 *   test('...', { tag: [Tags.smoke, Tags.cinesa, Tags.navbar] }, async () => { ... });
 *
 * Benefits:
 * - Autocomplete in IDE
 * - Compile-time validation (typos caught immediately)
 * - Single place to discover all available tags
 * - `npx playwright test --grep "@smoke"` still works (values are plain strings)
 */

// ─── Priority & Speed ────────────────────────────────────────────────
export const PriorityTags = {
  smoke: '@smoke',
  critical: '@critical',
  fast: '@fast',
  medium: '@medium',
  slow: '@slow',
  high: '@high',
} as const;

// ─── Test Type ───────────────────────────────────────────────────────
export const TypeTags = {
  regression: '@regression',
  e2e: '@e2e',
  display: '@display',
  navigation: '@navigation',
  validation: '@validation',
  schema: '@schema',
  seo: '@seo',
  accessibility: '@accessibility',
  type: '@type',
} as const;

// ─── Platform ────────────────────────────────────────────────────────
export const PlatformTags = {
  cinesa: '@cinesa',
  uci: '@uci',
  praetor: '@praetor',
} as const;

// ─── Component ───────────────────────────────────────────────────────
export const ComponentTags = {
  navbar: '@navbar',
  footer: '@footer',
  movies: '@movies',
  cinemas: '@cinemas',
  booking: '@booking',
  checkout: '@checkout',
  seatpicker: '@seatpicker',
  ticketpicker: '@ticketpicker',
  bar: '@bar',
  login: '@login',
  signup: '@signup',
  programs: '@programs',
  promotions: '@promotions',
  coupons: '@coupons',
  experiences: '@experiences',
  analytics: '@analytics',
  blog: '@blog',
  modal: '@modal',
  giftcard: '@giftcard',
} as const;

// ─── Feature / Sub-component ─────────────────────────────────────────
export const FeatureTags = {
  dbox: '@dbox',
  overCapacity: '@over-capacity',
  oasiz: '@oasiz',
  multiple: '@multiple',
  ga4: '@ga4',
  apps: '@apps',
  social: '@social',
  promo: '@promo',
} as const;

// ─── Footer Sub-sections ─────────────────────────────────────────────
export const FooterTags = {
  events: '@events',
  infantil: '@infantil',
  salaspremium: '@salaspremium',
  transparency: '@transparency',
  whoarewe: '@whoarewe',
  codeofconduct: '@codeofconduct',
  cookiespolicy: '@cookiespolicy',
  legalnotice: '@legalnotice',
  purchaseconditions: '@purchaseconditions',
  unlimitedconditions: '@unlimitedconditions',
  legal: '@legal',
  company: '@company',
} as const;

// ─── Environment Status ──────────────────────────────────────────────
export const EnvTags = {
  labPass: '@lab-pass',
  labFail: '@lab-fail',
  preprodPass: '@preprod-pass',
  preprodFail: '@preprod-fail',
  preprodBroken: '@preprod-broken',
  brokenProd: '@broken-prod',
  failedProd: '@failed-prod',
  fixTest: '@fix-test',
  rerunCf: '@rerun-cf',
} as const;

// ─── Merged flat namespace for convenience ───────────────────────────
export const Tags = {
  ...PriorityTags,
  ...TypeTags,
  ...PlatformTags,
  ...ComponentTags,
  ...FeatureTags,
  ...FooterTags,
  ...EnvTags,
} as const;

/** Union of all valid tag values */
export type Tag = (typeof Tags)[keyof typeof Tags];

/**
 * Helper to build a JIRA tag from a ticket ID.
 * @example jiraTag('OCG-3316') // '@OCG-3316'
 */
export function jiraTag(ticketId: string): string {
  return `@${ticketId}`;
}

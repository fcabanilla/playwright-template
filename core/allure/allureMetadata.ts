/**
 * Shared Allure metadata utilities for test enrichment.
 *
 * Provides DRY functions to infer severity from Playwright tags,
 * auto-link JIRA tickets from story strings, and mirror tags
 * into Allure's tag system for report filtering.
 *
 * Usage in spec files:
 * ```ts
 * import { enrichTestMetadata, linkJiraTickets } from '../../core/allure/allureMetadata';
 *
 * test.beforeEach(async ({}, testInfo) => {
 *   await enrichTestMetadata(testInfo);
 * });
 *
 * test('...', async () => {
 *   const storyName = 'OCG-3316 - Validate movie schema';
 *   await allure.story(storyName);
 *   await linkJiraTickets(storyName);
 * });
 * ```
 */

import { allure } from 'allure-playwright';
import type { TestInfo } from '@playwright/test';

/** Allure severity levels (Allure 2) */
type AllureSeverity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

/**
 * Maps Playwright tags to Allure severity levels.
 * First match wins — order matters (most severe first).
 */
const TAG_SEVERITY_MAP: ReadonlyArray<{
  tag: string;
  severity: AllureSeverity;
}> = [
  { tag: '@critical', severity: 'blocker' },
  { tag: '@smoke', severity: 'critical' },
  { tag: '@e2e', severity: 'critical' },
  { tag: '@regression', severity: 'normal' },
  { tag: '@fast', severity: 'normal' },
  { tag: '@medium', severity: 'normal' },
  { tag: '@low-priority', severity: 'minor' },
];

const DEFAULT_SEVERITY: AllureSeverity = 'normal';

/** Regex to extract JIRA ticket keys like OCG-1234 from strings */
const JIRA_KEY_REGEX = /\b(OCG-\d+)\b/g;

/**
 * Infers Allure severity from an array of Playwright tags.
 * Returns the severity of the first matching tag (most severe wins).
 */
export function inferSeverityFromTags(tags: readonly string[]): AllureSeverity {
  for (const mapping of TAG_SEVERITY_MAP) {
    if (tags.includes(mapping.tag)) {
      return mapping.severity;
    }
  }
  return DEFAULT_SEVERITY;
}

/**
 * Extracts OCG-XXXX JIRA keys from a story string and calls
 * allure.issue() for each — generating clickable links in the report.
 * Uses the urlTemplate already configured in playwright.config.ts.
 */
export async function linkJiraTickets(storyName: string): Promise<void> {
  const matches = storyName.match(JIRA_KEY_REGEX);
  if (!matches) return;

  const uniqueKeys = [...new Set(matches)];
  for (const key of uniqueKeys) {
    await allure.issue(key, key);
  }
}

/**
 * Enriches the current test with Allure metadata inferred from TestInfo:
 * - Severity (from tags)
 * - Allure tags (mirrors Playwright tags for report filtering)
 * - Owner (default: 'QA Team')
 *
 * Call this in test.beforeEach() to apply to all tests in a describe block.
 */
export async function enrichTestMetadata(
  testInfo: TestInfo,
  owner: string = 'QA Team'
): Promise<void> {
  const tags = testInfo.tags;

  // Severity from tag mapping
  await allure.severity(inferSeverityFromTags(tags));

  // Mirror Playwright tags into Allure for report filtering
  if (tags.length > 0) {
    await allure.tags(...tags);
  }

  // Owner
  await allure.owner(owner);
}

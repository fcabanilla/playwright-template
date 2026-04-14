/**
 * Showtimes Setup — Discovers live showtimes and writes allocation file.
 *
 * Runs before E2E checkout tests to eliminate hardcoded showtime IDs.
 * Navigates to the cinema detail page, scrapes available sessions,
 * and writes `state/showtimes.{env}.json` with allocated IDs.
 *
 * **Usage:**
 * ```bash
 * TEST_ENV=preprod npx playwright test --project=showtimes-setup
 * ```
 *
 * **Output:** `state/showtimes.{env}.json`
 *
 * @see core/services/showtimeDiscovery.ts
 */

import { test as setup, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  discoverShowtimes,
  allocateShowtimes,
  type DiscoveredShowtime,
} from '../../core/services/showtimeDiscovery';
import {
  getCinesaConfig,
  type CinesaEnvironment,
} from '../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const baseUrl = config.baseUrl;
const cinemaPath = '/cines/oasiz/';

setup.describe('Showtime Discovery', () => {
  setup(
    'Discover and allocate Oasiz showtimes',
    async ({ page }) => {
      setup.setTimeout(90_000);

      // Navigate to cinema page with retry (Omnia API can be intermittent)
      const maxPageRetries = 3;
      let pageLoaded = false;

      for (let retry = 0; retry < maxPageRetries; retry++) {
        await page.goto(`${baseUrl}${cinemaPath}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });

        // Dismiss cookie banner if visible
        const cookieAcceptBtn = page.locator('#onetrust-accept-btn-handler');
        if (await cookieAcceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await cookieAcceptBtn.click();
        }

        // Dismiss blocking modals
        const blockingModal = page.locator(
          'dialog[open], aside.v-modal.secondary-attribute-message-modal'
        );
        if (await blockingModal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const closeBtn = page.locator(
            'dialog button:has-text("Close modal"), aside.v-modal .v-modal-header__close-button'
          );
          if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await closeBtn.click();
          }
        }

        // Wait for page to settle
        await page.waitForLoadState('networkidle').catch(() => {});

        // Check if showtime picker loaded (date picker or film list visible)
        const datePickerVisible = await page
          .locator('.v-date-picker')
          .first()
          .isVisible({ timeout: 5000 })
          .catch(() => false);
        const filmListVisible = await page
          .locator('.v-showtime-picker-film-list')
          .first()
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        if (datePickerVisible || filmListVisible) {
          pageLoaded = true;
          break;
        }

        // Check for API error message
        const errorMsg = await page
          .locator('.v-showtime-picker-message')
          .innerText()
          .catch(() => '');
        console.log(
          `[showtimes-setup] Attempt ${retry + 1}/${maxPageRetries}: ${errorMsg || 'No showtime picker found'}`
        );

        if (retry < maxPageRetries - 1) {
          await page.waitForTimeout(3000); // brief pause before retry
        }
      }

      if (!pageLoaded) {
        console.log('[showtimes-setup] Showtime picker never loaded after retries');
      }

      // Scroll to ensure showtime picker is in viewport
      const showtimePickerLocator = page.locator(
        '.v-showtime-picker, .v-date-showtime-picker'
      );
      if (
        await showtimePickerLocator
          .first()
          .isVisible({ timeout: 2000 })
          .catch(() => false)
      ) {
        await showtimePickerLocator.first().scrollIntoViewIfNeeded();
      }

      console.log(`[showtimes-setup] URL: ${page.url()}`);

      // Iterate through available days to find one with enough showtimes
      const dayButtons = page.locator('.v-date-picker-date__button');
      const dayCount = await dayButtons.count();
      console.log(`[showtimes-setup] Day buttons available: ${dayCount}`);

      let showtimes: DiscoveredShowtime[] = [];
      const maxDays = Math.min(dayCount || 1, 5);

      for (let dayIndex = 0; dayIndex < maxDays; dayIndex++) {
        let dayText = `Day ${dayIndex}`;

        if (dayCount > 0) {
          dayText = (
            await dayButtons.nth(dayIndex).innerText().catch(() => dayText)
          ).trim();

          // Check if already selected
          const isSelected = await dayButtons
            .nth(dayIndex)
            .evaluate((el) =>
              el.classList.contains('v-date-picker-date__button--selected')
            )
            .catch(() => false);

          if (!isSelected) {
            await dayButtons.nth(dayIndex).click({ force: true });
            await page.waitForTimeout(2000);
          }
        }

        const dayShowtimes = await discoverShowtimes(page);
        console.log(
          `[showtimes-setup] Day "${dayText}": ${dayShowtimes.length} showtimes`
        );

        // Use this day if it has enough showtimes
        if (dayShowtimes.length >= 5) {
          showtimes = dayShowtimes;
          console.log(
            `[showtimes-setup] Using day "${dayText}" with ${dayShowtimes.length} showtimes`
          );
          break;
        }

        // Keep the best day so far
        if (dayShowtimes.length > showtimes.length) {
          showtimes = dayShowtimes;
        }

        // Log message if no showtimes
        if (dayShowtimes.length === 0) {
          const msg = await page
            .locator('.v-showtime-picker-message')
            .innerText()
            .catch(() => '');
          if (msg) console.log(`[showtimes-setup]   Message: "${msg}"`);
        }
      }

      expect(
        showtimes.length,
        `Expected at least 3 showtimes on ${baseUrl}${cinemaPath} — ` +
          `checked ${maxDays} day(s), found ${showtimes.length}`
      ).toBeGreaterThanOrEqual(3);

      // Log discovered showtimes
      for (const s of showtimes) {
        console.log(
          `  [${s.showtimeId}] ${s.room} ${s.time} — ${s.filmTitle} (${s.formats.join(', ') || 'standard'})`
        );
      }

      // Allocate showtimes to test roles
      const allocation = allocateShowtimes(showtimes);
      expect(allocation, 'Showtime allocation failed').not.toBeNull();

      console.log('[showtimes-setup] Allocation:', allocation);

      // Check D-BOX availability
      const hasDbox = showtimes.some((s) =>
        s.formats.some((f) => /d-?box/i.test(f))
      );
      if (!hasDbox) {
        console.warn(
          '[showtimes-setup] WARNING: No D-BOX showtimes — D-BOX tests will use fallback'
        );
      }

      // Write allocation to state file
      const outputPath = path.join('state', `showtimes.${env}.json`);
      const output = {
        discoveredAt: new Date().toISOString(),
        environment: env,
        cinema: 'oasiz',
        baseUrl,
        totalShowtimes: showtimes.length,
        hasDbox,
        allocation: allocation!,
        raw: showtimes,
      };

      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

      console.log(`[showtimes-setup] Written to ${outputPath}`);
    }
  );
});

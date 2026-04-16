/**
 * Showtime Discovery Service — Dynamic showtime scraping from cinema pages.
 *
 * Eliminates hardcoded showtime IDs by scraping available sessions
 * from the cinema detail page (e.g., `/cines/oasiz/`).
 *
 * Runs as a Playwright setup project BEFORE test execution.
 * Writes discovered showtimes to `state/showtimes.{env}.json`.
 *
 * @see tests/setup/showtimes.setup.ts
 * @see docs/adrs/0018-checkout-showtime-isolation.md
 */

import type { Page } from '@playwright/test';

/** A single discovered showtime from the cinema page */
export interface DiscoveredShowtime {
  showtimeId: string;
  room: string;
  time: string;
  formats: string[];
  filmTitle: string;
}

/** Showtime allocation for all E2E test roles */
export interface ShowtimeAllocation {
  /** Standard showtime — seatPickerComplete + barSingleSeat */
  seatPicker: string;
  /** Standard showtime — barSingleSeat (may reuse seatPicker if sequential) */
  bar: string;
  /** Standard showtime — checkoutCreditCard */
  checkout: string;
  /** D-BOX showtime — D-BOX specific tests */
  dbox: string;
  /** iSense showtime — premium format tests */
  isense: string;
  /** Any showtime — barMultipleSeats */
  reserve1: string;
  /** Standard showtime — checkoutGiftCard */
  reserve2: string;
  /** Any showtime — overCapacity test */
  reserve3: string;
  /** Spare showtime */
  reserve4: string;
}

/**
 * Scrapes all available showtimes from a cinema detail page.
 *
 * Parses showtime links (pattern: `?showtimeId=XXX`) and extracts
 * room name, time, and format badges from the surrounding DOM.
 *
 * @param page - Playwright Page already navigated to the cinema page
 * @returns Array of discovered showtimes
 */
export async function discoverShowtimes(
  page: Page
): Promise<DiscoveredShowtime[]> {
  // Wait for film list to load — may not exist if no sessions today
  const filmListLocator = page.locator('.v-showtime-picker-film-list');
  try {
    await filmListLocator
      .first()
      .waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    // Film list not visible — no sessions for this day
    return [];
  }

  // Enable "Show all movies" if available
  const checkbox = page.locator(
    '.v-showtime-picker-show-all-movies input[type="checkbox"]'
  );
  if ((await checkbox.count()) > 0) {
    const isChecked = await checkbox.isChecked({ timeout: 2000 }).catch(() => true);
    if (!isChecked) await checkbox.check();
  }

  // Extract all showtimes via DOM evaluation
  return await page.evaluate(() => {
    const results: Array<{
      showtimeId: string;
      room: string;
      time: string;
      formats: string[];
      filmTitle: string;
    }> = [];

    const filmItems = document.querySelectorAll(
      '.v-showtime-picker-film-list__item'
    );

    for (const filmItem of filmItems) {
      const titleEl = filmItem.querySelector(
        '.v-showtime-picker-film-details .v-film-title__text'
      );
      const filmTitle = titleEl?.textContent?.trim() || 'Unknown';

      const showtimeButtons = filmItem.querySelectorAll(
        '.v-showtime-picker-site-list .v-showtime-button'
      );

      for (const btn of showtimeButtons) {
        const link = btn.closest('a');
        if (!link) continue;

        const href = link.getAttribute('href') || '';
        const idMatch = href.match(/showtimeId=([^&]+)/);
        if (!idMatch) continue;

        const showtimeId = idMatch[1];

        // Extract room from screen name text
        const screenNameEl = btn.querySelector(
          '.v-showtime-button__screen-name'
        );
        const screenText = screenNameEl?.textContent?.trim() || '';
        const roomMatch = screenText.match(/sala\s*[a-z0-9-]+/i);
        const room = roomMatch ? roomMatch[0] : screenText;

        // Extract time
        const timeEl = btn.querySelector('time');
        const time = timeEl?.textContent?.trim() || '';

        // Extract format badges from img alt text within the showtime button
        const formatImgs = btn.querySelectorAll('img');
        const formats: string[] = [];
        for (const img of formatImgs) {
          const alt = img.getAttribute('alt') || '';
          if (alt) formats.push(alt.trim());
        }

        // Also check parent link for format images (some are outside the button)
        const parentFormatImgs = link.querySelectorAll(
          ':scope > div img, :scope > span img'
        );
        for (const img of parentFormatImgs) {
          const alt = img.getAttribute('alt') || '';
          if (alt && !formats.includes(alt.trim())) formats.push(alt.trim());
        }

        results.push({ showtimeId, room, time, formats, filmTitle });
      }
    }

    return results;
  });
}

/**
 * Allocates discovered showtimes to test roles.
 *
 * Rules:
 * - Each role gets a UNIQUE showtime when possible (avoids seat contention)
 * - D-BOX role MUST get a D-BOX showtime (skips if none available)
 * - iSense role prefers iSense format
 * - Standard roles avoid 3D (simplifies ticket picker — no glasses modal)
 * - Falls back to reusing showtimes if not enough unique sessions
 *
 * @param showtimes - All discovered showtimes
 * @returns Allocation mapping, or null if insufficient showtimes
 */
export function allocateShowtimes(
  showtimes: DiscoveredShowtime[]
): ShowtimeAllocation | null {
  if (showtimes.length === 0) return null;

  const isDbox = (s: DiscoveredShowtime) =>
    s.formats.some((f) => /d-?box/i.test(f));
  const isIsense = (s: DiscoveredShowtime) =>
    s.formats.some((f) => /isense/i.test(f));
  const isScreenX = (s: DiscoveredShowtime) =>
    s.formats.some((f) => /screenx/i.test(f));
  const is3D = (s: DiscoveredShowtime) =>
    s.formats.some((f) => /3d/i.test(f));
  const hasVideoModal = (s: DiscoveredShowtime) => isDbox(s) || isScreenX(s);
  const isStandard = (s: DiscoveredShowtime) => !hasVideoModal(s) && !is3D(s);

  // Categorize
  const dboxShowtimes = showtimes.filter(isDbox);
  const isenseShowtimes = showtimes.filter(
    (s) => isIsense(s) && !isDbox(s)
  );
  const standardShowtimes = showtimes.filter(isStandard);
  const nonDboxShowtimes = showtimes.filter((s) => !hasVideoModal(s));

  // Track assigned IDs to avoid duplicates when possible
  const assigned = new Set<string>();

  function pickFrom(
    pool: DiscoveredShowtime[],
    fallback: DiscoveredShowtime[]
  ): string {
    // First try unassigned from pool
    for (const s of pool) {
      if (!assigned.has(s.showtimeId)) {
        assigned.add(s.showtimeId);
        return s.showtimeId;
      }
    }
    // Then try unassigned from fallback
    for (const s of fallback) {
      if (!assigned.has(s.showtimeId)) {
        assigned.add(s.showtimeId);
        return s.showtimeId;
      }
    }
    // Last resort: reuse first from pool or fallback
    return pool[0]?.showtimeId || fallback[0]?.showtimeId || showtimes[0].showtimeId;
  }

  // Allocate in priority order
  const dbox = dboxShowtimes.length > 0 ? pickFrom(dboxShowtimes, dboxShowtimes) : '';
  const isense = pickFrom(isenseShowtimes, nonDboxShowtimes);
  const seatPicker = pickFrom(standardShowtimes, nonDboxShowtimes);
  const checkout = pickFrom(standardShowtimes, nonDboxShowtimes);
  const reserve1 = pickFrom(standardShowtimes, nonDboxShowtimes); // barMultipleSeats — needs standard ticket types
  const reserve2 = pickFrom(standardShowtimes, nonDboxShowtimes);
  const reserve3 = pickFrom(nonDboxShowtimes, showtimes);
  const reserve4 = pickFrom(showtimes, showtimes);

  return {
    seatPicker,
    bar: seatPicker, // Reuse OK — sequential tests
    checkout,
    dbox: dbox || seatPicker, // Fallback if no D-BOX available
    isense,
    reserve1,
    reserve2,
    reserve3,
    reserve4,
  };
}

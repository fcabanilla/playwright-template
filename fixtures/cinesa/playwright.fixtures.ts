// fixtures/playwright.fixtures.ts
import { test as base, Page } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookieBanner';

type MyFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
};

export const test = base.extend<MyFixtures>({
  navbar: async ({ page }, use) => {
    const navbar = new Navbar(page);
    await use(navbar);
  },
  cookieBanner: async ({ page }, use) => {
    const cookieBanner = new CookieBanner(page);
    await use(cookieBanner);
  },
});

export { expect } from '@playwright/test';
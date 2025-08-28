import { test as base } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/uci/navbar/navbar.page';
import { CookieBanner } from '../../pageObjectsManagers/uci/cookies/cookieBanner.page';
import { PromoModal } from '../../pageObjectsManagers/uci/promoModal/promoModal.page';

type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
  promoModal: PromoModal;
};

export const test = base.extend<CustomFixtures>({
  navbar: async ({ page }, use) => {
    const navbar = new Navbar(page);
    await use(navbar);
  },
  cookieBanner: async ({ page }, use) => {
    const cookieBanner = new CookieBanner(page);
    await use(cookieBanner);
  },
  promoModal: async ({ page }, use) => {
    const promoModal = new PromoModal(page);
    await use(promoModal);
  },
});

export { expect } from '@playwright/test';

import { test as base } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookieBanner';
import { SeatPicker } from '../../pageObjectsManagers/cinesa/seatPicker';
import { Blog } from '../../pageObjectsManagers/cinesa/blog';
// Definir un tipo para nuestros fixtures personalizados
type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
  seatPicker: SeatPicker;
  blog: Blog;
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
  seatPicker: async ({ page }, use) => {
    const seatPicker = new SeatPicker(page);
    await use(seatPicker);
  },
  blog: async ({ page }, use) => {
    const navbar = new Navbar(page);
    await use(navbar);
  },
});

export { expect } from '@playwright/test';

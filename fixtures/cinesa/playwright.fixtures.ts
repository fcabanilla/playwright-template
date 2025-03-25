import { test as base } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookieBanner';
import { SeatPicker } from '../../pageObjectsManagers/cinesa/seatPicker';
import { Blog } from '../../pageObjectsManagers/cinesa/blog/blog';
import { Footer } from '../../pageObjectsManagers/cinesa/footer';

// Definir un tipo para nuestros fixtures personalizados
type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
  seatPicker: SeatPicker;
  blog: Blog; // ...nueva propiedad...
  footer: Footer; // ...nueva propiedad...
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
    const blog = new Blog(page);
    await use(blog);
  },
  footer: async ({ page }, use) => {
    const footer = new Footer(page);
    await use(footer);
  },
});

export { expect } from '@playwright/test';

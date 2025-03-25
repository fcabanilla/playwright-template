import { test as base } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar/navbar';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookies/cookieBanner';
import { SeatPicker } from '../../pageObjectsManagers/cinesa/seatPicker/seatPicker';
import { Blog } from '../../pageObjectsManagers/cinesa/blog/blog.page';
import { Footer } from '../../pageObjectsManagers/cinesa/footer/footer';
import { BlogLanding } from '../../pageObjectsManagers/cinesa/blog/blogLanding.page';

// Definir un tipo para nuestros fixtures personalizados
type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
  seatPicker: SeatPicker;
  blog: Blog;
  footer: Footer;
  blogLanding: BlogLanding;
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
  blogLanding: async ({ page }, use) => {
    const blogLandingPage = new BlogLanding(page);
    await use(blogLandingPage);
  },
});

export { expect } from '@playwright/test';

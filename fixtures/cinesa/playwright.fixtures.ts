import { test as base } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar/navbar.page';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookies/cookieBanner';
import { SeatPicker } from '../../pageObjectsManagers/cinesa/seatPicker/seatPicker';
import { Footer } from '../../pageObjectsManagers/cinesa/footer/footer';
import { BlogLanding } from '../../pageObjectsManagers/cinesa/blog/blogLanding.page';
import { Cinema } from '../../pageObjectsManagers/cinesa/cinemas/cinema.page';
import { CinemaDetail } from '../../pageObjectsManagers/cinesa/cinemas/cinemaDetail.page';

// Definir un tipo para nuestros fixtures personalizados
type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
  seatPicker: SeatPicker;
  footer: Footer;
  blogLanding: BlogLanding;
  cinema: Cinema;
  cinemaDetail: CinemaDetail;
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
  footer: async ({ page }, use) => {
    const footer = new Footer(page);
    await use(footer);
  },
  blogLanding: async ({ page }, use) => {
    const blogLandingPage = new BlogLanding(page);
    await use(blogLandingPage);
  },
  cinema: async ({ page }, use) => {
    const cinema = new Cinema(page);
    await use(cinema);
  },
  cinemaDetail: async ({ page }, use) => {
    const cinemaDetail = new CinemaDetail(page);
    await use(cinemaDetail);
  },
});

export { expect } from '@playwright/test';

import { test as base } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/uci/navbar/navbar.page';
import { getUCIConfig, UCIEnvironment } from '../../config/environments';
import { CookieBanner } from '../../pageObjectsManagers/uci/cookies/cookieBanner.page';
import { PromoModal } from '../../pageObjectsManagers/uci/promoModal/promoModal.page';
import { Cinema } from '../../pageObjectsManagers/uci/cinemas/cinema.page';
import { CinemaDetail } from '../../pageObjectsManagers/uci/cinemas/cinemaDetail.page';
import { Films } from '../../pageObjectsManagers/uci/films/films.page';
import { FilmsAssertions } from '../../tests/uci/films/films.assertions';
import { NavbarAssertions } from '../../tests/uci/navbar/navbar.assertions';
import { CinemasAssertions } from '../../tests/uci/cinemas/cinemas.assertions';

type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
  promoModal: PromoModal;
  cinema: Cinema;
  cinemaDetail: CinemaDetail;
  films: Films;
  filmsAssertions: FilmsAssertions;
  navbarAssertions: NavbarAssertions;
  cinemasAssertions: CinemasAssertions;
};

export const test = base.extend<CustomFixtures>({
  navbar: async ({ page }, use) => {
    const env = process.env.TEST_ENV as UCIEnvironment || 'production';
    const config = getUCIConfig(env);
    const navbar = new Navbar(page, config.baseUrl);
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
  cinema: async ({ page }, use) => {
    const cinema = new Cinema(page);
    await use(cinema);
  },
  cinemaDetail: async ({ page }, use) => {
    const cinemaDetail = new CinemaDetail(page);
    await use(cinemaDetail);
  },
  films: async ({ page }, use) => {
    const films = new Films(page);
    await use(films);
  },
  filmsAssertions: async ({ films }, use) => {
    const filmsAssertions = new FilmsAssertions(films);
    await use(filmsAssertions);
  },
  navbarAssertions: async ({ page }, use) => {
    const navbarAssertions = new NavbarAssertions(page);
    await use(navbarAssertions);
  },
  cinemasAssertions: async ({ page, cinema, cinemaDetail }, use) => {
    const cinemasAssertions = new CinemasAssertions(page, cinema, cinemaDetail);
    await use(cinemasAssertions);
  },
});

export { expect } from '@playwright/test';

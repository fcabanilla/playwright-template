import { test as base } from '@playwright/test';
import { WebActions } from '../../core/webactions/webActions';
import { createCinesaContext } from '../shared/contextFactory';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar/navbar.page';
import { getCinesaConfig, CinesaEnvironment } from '../../config/environments';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookies/cookieBanner.page';
import { PromotionalModal } from '../../pageObjectsManagers/cinesa/promotionalModal/promotionalModal.page';
import { SeatPicker } from '../../pageObjectsManagers/cinesa/seatPicker/seatPicker.page';
import { Footer } from '../../pageObjectsManagers/cinesa/footer/footer.page';
import { BlogLanding } from '../../pageObjectsManagers/cinesa/blog/blogLanding.page';
import { Cinema } from '../../pageObjectsManagers/cinesa/cinemas/cinema.page';
import { CinemaDetail } from '../../pageObjectsManagers/cinesa/cinemas/cinemaDetail.page';
import { LoginPage } from '../../pageObjectsManagers/cinesa/login/login.page';
import { TicketPicker } from '../../pageObjectsManagers/cinesa/ticketPicker/ticketPicker.page';
import { BarPage } from '../../pageObjectsManagers/cinesa/bar/bar.page';
import { PurchaseSummary } from '../../pageObjectsManagers/cinesa/purchaseSummary/purchaseSummary.page';
import { PaymentPage } from '../../pageObjectsManagers/cinesa/paymentPage/paymentPage.page';
import { ProgramsPage } from '../../pageObjectsManagers/cinesa/programs/programs.page';
import { UnlimitedProgramsPage } from '../../pageObjectsManagers/cinesa/programs/unlimitedPrograms.page';
import { SignupPage } from '../../pageObjectsManagers/cinesa/signup/signup.page';
import { Mailing } from '../../pageObjectsManagers/cinesa/mailing/mailing.page';
import { AnalyticsPage } from '../../pageObjectsManagers/cinesa/analytics/analytics.page';
import { MovieList } from '../../pageObjectsManagers/cinesa/movies/movies.page';
import { MoviePage } from '../../pageObjectsManagers/cinesa/movie/movie.page';
import { BookingConfirmationPage } from '../../pageObjectsManagers/cinesa/bookingConfirmation/bookingConfirmation.page';
import { BookingConfirmationAssertions } from '../../tests/cinesa/bookingConfirmation/bookingConfirmation.assertions';
import { LivingTicketPage } from '../../pageObjectsManagers/cinesa/livingTicket/livingTicket.page';
import { LivingTicketAssertions } from '../../tests/cinesa/livingTicket/livingTicket.assertions';
import { RedsysPage } from '../../pageObjectsManagers/cinesa/paymentProviders/redsys/redsys.page';
import { acquireLock } from '../../core/semaphore/fileSemaphore';

type CustomFixtures = {
  dboxLock: void;
  navbar: Navbar;
  cookieBanner: CookieBanner;
  promotionalModal: PromotionalModal;
  seatPicker: SeatPicker;
  footer: Footer;
  blogLanding: BlogLanding;
  cinema: Cinema;
  cinemaDetail: CinemaDetail;
  loginPage: LoginPage;
  ticketPicker: TicketPicker;
  barPage: BarPage;
  purchaseSummary: PurchaseSummary;
  paymentPage: PaymentPage;
  analyticsPage: AnalyticsPage;
  programsPage: ProgramsPage;
  unlimitedProgramsPage: UnlimitedProgramsPage;
  signupPage: SignupPage;
  mailing: Mailing;
  movieList: MovieList;
  moviePage: MoviePage;
  bookingConfirmation: BookingConfirmationPage;
  bookingConfirmationAssertions: BookingConfirmationAssertions;
  livingTicket: LivingTicketPage;
  livingTicketAssertions: LivingTicketAssertions;
  redsysPage: RedsysPage;
  webActions: WebActions;
};

export const test = base.extend<CustomFixtures>({
  // D-BOX semaphore: serializes access to the single D-BOX showtime across workers
  // Only acquired when a test destructures `dboxLock` — no impact on non-D-BOX tests
  dboxLock: [
    async ({}, use) => {
      const release = await acquireLock('dbox-showtime');
      await use();
      release();
    },
    { timeout: 90_000 },
  ],

  // Shared context: Cloudflare + consent + storageState
  context: async ({ browser }, use) => {
    const context = await createCinesaContext(browser);
    await use(context);
    await context.close();
  },

  // Shared WebActions instance
  webActions: async ({ page }, use) => {
    const webActions = new WebActions(page);
    await use(webActions);
  },

  navbar: async ({ page }, use) => {
    const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
    const config = getCinesaConfig(env);
    const navbar = new Navbar(page, config.baseUrl);
    await use(navbar);
  },
  cookieBanner: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const cookieBanner = new CookieBanner(webActions);
    await use(cookieBanner);
  },
  promotionalModal: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const promotionalModal = new PromotionalModal(webActions);
    await use(promotionalModal);
  },
  seatPicker: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const seatPicker = new SeatPicker(webActions);
    await use(seatPicker);
  },
  footer: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
    const config = getCinesaConfig(env);
    const footer = new Footer(webActions, config.baseUrl);
    await use(footer);
  },
  blogLanding: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const blogLandingPage = new BlogLanding(webActions);
    await use(blogLandingPage);
  },
  cinema: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const cinema = new Cinema(webActions);
    await use(cinema);
  },
  cinemaDetail: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const cinemaDetail = new CinemaDetail(webActions);
    await use(cinemaDetail);
  },
  loginPage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const loginPage = new LoginPage(webActions);
    await use(loginPage);
  },
  ticketPicker: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const ticketPicker = new TicketPicker(webActions);
    await use(ticketPicker);
  },
  barPage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const barPage = new BarPage(webActions);
    await use(barPage);
  },
  purchaseSummary: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const purchaseSummary = new PurchaseSummary(webActions);
    await use(purchaseSummary);
  },
  paymentPage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const paymentPage = new PaymentPage(webActions);
    await use(paymentPage);
  },
  redsysPage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const redsysPage = new RedsysPage(webActions);
    await use(redsysPage);
  },
  analyticsPage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const analyticsPage = new AnalyticsPage(webActions);
    await use(analyticsPage);
  },
  programsPage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const programsPage = new ProgramsPage(webActions);
    await use(programsPage);
  },
  unlimitedProgramsPage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const unlimitedProgramsPage = new UnlimitedProgramsPage(webActions);
    await use(unlimitedProgramsPage);
  },
  signupPage: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const signupPage = new SignupPage(webActions);
    await use(signupPage);
  },
  mailing: async ({ page }, use) => {
    const mailing = new Mailing(page);
    await use(mailing);
  },
  movieList: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const movieList = new MovieList(webActions);
    await use(movieList);
  },
  moviePage: async ({ page }, use) => {
    const moviePage = new MoviePage(page);
    await use(moviePage);
  },
  bookingConfirmation: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const bookingConfirmation = new BookingConfirmationPage(webActions);
    await use(bookingConfirmation);
  },
  bookingConfirmationAssertions: async ({ bookingConfirmation }, use) => {
    const assertions = new BookingConfirmationAssertions(bookingConfirmation);
    await use(assertions);
  },
  livingTicket: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const livingTicket = new LivingTicketPage(webActions);
    await use(livingTicket);
  },
  livingTicketAssertions: async ({ livingTicket }, use) => {
    const assertions = new LivingTicketAssertions(livingTicket);
    await use(assertions);
  },
});

export { expect } from '@playwright/test';

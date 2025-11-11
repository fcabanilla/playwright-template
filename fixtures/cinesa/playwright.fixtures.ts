import { test as base } from '@playwright/test';
import { WebActions } from '../../core/webactions/webActions';
import { getCloudflareHeaders } from '../../core/cloudflare/cloudflareHeaders';
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

type CustomFixtures = {
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
  webActions: WebActions;
  whoarewe: Footer;
  workwithus: Footer;
  cinesabusiness: Footer;
  customerservice: Footer;
  transparency: Footer;
  events: Footer;
  cinesaluxe: Footer;
  salaspremium: Footer;
  infantil: Footer;
  ciclos: Footer;
  blogcinesa: Footer;
  legalNotice: Footer;
  purchaseConditions: Footer;
  unlimitedConditions: Footer;
  privacypolicy: Footer;
  cookiespolicy: Footer;
  modernSlavery: Footer;
  codeOfConduct: Footer;
  whistleblowing: Footer;
  androidAppDownload: Footer;
  appleAppDownload: Footer;
};

export const test = base.extend<CustomFixtures>({
  // Override context fixture to auto-inject Cloudflare headers when credentials exist
  // AND apply consent seeds when storageState is not available
  context: async ({ browser }, use) => {
    const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
    const config = getCinesaConfig(env);
    const headers = getCloudflareHeaders(env);

    const context = await browser.newContext();

    // Auto-inject Cloudflare headers if credentials are available for this environment
    if (headers) {
      await context.setExtraHTTPHeaders(headers);
      console.log(`✅ [Cloudflare] Headers auto-injected for env=${env}`);
    } else {
      console.log(
        `ℹ️  [Cloudflare] No credentials found for env=${env}, skipping header injection`
      );
    }

    // Apply consent seeds if NO storageState is configured
    // This eliminates cookie banner interaction when storageState files don't exist
    const hasStorageState = context.storageState !== undefined;
    if (!hasStorageState) {
      const page = await context.newPage();
      const webActions = new WebActions(page);

      // Pre-seed consent cookies for baseUrl
      await webActions.applyConsentSeedsFor(
        config.baseUrl,
        `[Fixture] Pre-seeding consent cookies for ${config.baseUrl}`
      );

      await page.close();
      console.log(
        `✅ [Consent Seeds] Applied for ${config.baseUrl} (no storageState found)`
      );
    } else {
      console.log(`ℹ️  [Consent Seeds] Skipped - storageState already loaded`);
    }

    await use(context);
    await context.close();
  },

  // Shared WebActions instance - this will be used by all components
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
  whoarewe: async ({ footer }, use) => {
    await use(footer);
  },
  workwithus: async ({ footer }, use) => {
    await use(footer);
  },
  cinesabusiness: async ({ footer }, use) => {
    await use(footer);
  },
  customerservice: async ({ footer }, use) => {
    await use(footer);
  },
  transparency: async ({ footer }, use) => {
    await use(footer);
  },
  events: async ({ footer }, use) => {
    await use(footer);
  },
  cinesaluxe: async ({ footer }, use) => {
    await use(footer);
  },
  salaspremium: async ({ footer }, use) => {
    await use(footer);
  },
  infantil: async ({ footer }, use) => {
    await use(footer);
  },
  ciclos: async ({ footer }, use) => {
    await use(footer);
  },
  blogcinesa: async ({ footer }, use) => {
    await use(footer);
  },
  legalNotice: async ({ footer }, use) => {
    await use(footer);
  },
  purchaseConditions: async ({ footer }, use) => {
    await use(footer);
  },
  unlimitedConditions: async ({ footer }, use) => {
    await use(footer);
  },
  privacypolicy: async ({ footer }, use) => {
    await use(footer);
  },
  cookiespolicy: async ({ footer }, use) => {
    await use(footer);
  },
  modernSlavery: async ({ footer }, use) => {
    await use(footer);
  },
  codeOfConduct: async ({ footer }, use) => {
    await use(footer);
  },
  whistleblowing: async ({ footer }, use) => {
    await use(footer);
  },
  androidAppDownload: async ({ footer }, use) => {
    await use(footer);
  },
  appleAppDownload: async ({ footer }, use) => {
    await use(footer);
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
});

export { expect } from '@playwright/test';

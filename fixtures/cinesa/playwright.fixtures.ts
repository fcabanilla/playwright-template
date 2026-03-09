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
import { BookingConfirmationPage } from '../../pageObjectsManagers/cinesa/bookingConfirmation/bookingConfirmation.page';
import { BookingConfirmationAssertions } from '../../tests/cinesa/bookingConfirmation/bookingConfirmation.assertions';
import { LivingTicketPage } from '../../pageObjectsManagers/cinesa/livingTicket/livingTicket.page';
import { LivingTicketAssertions } from '../../tests/cinesa/livingTicket/livingTicket.assertions';

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
  bookingConfirmation: BookingConfirmationPage;
  bookingConfirmationAssertions: BookingConfirmationAssertions;
  livingTicket: LivingTicketPage;
  livingTicketAssertions: LivingTicketAssertions;
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
  context: async ({ browser }, use, testInfo) => {
    const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
    const config = getCinesaConfig(env);
    const headers = getCloudflareHeaders(env);

    // Get storageState path from project configuration
    const { getCinesaStorageStatePath } = await import(
      '../../config/projects/storageState.helper'
    );
    const storageStatePath = getCinesaStorageStatePath(env);

    // 1. Get native User Agent from the current browser (Chrome, Firefox, or WebKit)
    // We launch a temporary context to get the default UA string
    const tempContext = await browser.newContext();
    const tempPage = await tempContext.newPage();
    const originalUA = await tempPage.evaluate(() => navigator.userAgent);
    await tempContext.close();

    // 2. Dynamic User Agent Injection
    // Append the suffix (if needed for Cloudflare bypass) to the NATIVE User Agent
    // This ensures we don't force a Chrome UA on Firefox/Safari
    const suffix = process.env.USER_AGENT_SUFFIX
      ? ` ${process.env.USER_AGENT_SUFFIX}`
      : '';
    const finalUserAgent = originalUA + suffix;

    // Create context WITH storageState if available AND injected User Agent
    const context = await browser.newContext({
      userAgent: finalUserAgent,
      ...(storageStatePath ? { storageState: storageStatePath } : {}),
    });

    // CLOUDFLARE BYPASS: Inject credentials as BOTH cookies AND headers
    // Per Joey Lee:
    // - Cookie with secret only → bypasses Cloudflare WAF
    // - Headers with Id + Secret → bypasses Cloudflare Access
    // Official credentials work for Spain environments (preprod, lab, production)
    if (headers) {
      // 1) Inject as HTTP HEADERS (for Cloudflare Access) - BOTH Id and Secret
      await context.setExtraHTTPHeaders(headers);
      console.log(`✅ [Cloudflare] Headers auto-injected for env=${env}`);

      // 2) Inject as COOKIE (for Cloudflare WAF bypass) - SECRET ONLY
      const clientSecret = headers['CF-Access-Client-Secret'];

      if (clientSecret) {
        await context.addCookies([
          {
            name: 'CF-Access-Client-Secret',
            value: clientSecret,
            domain: '.ocgtest.es', // Preprod/Lab/Staging
            path: '/',
            httpOnly: false,
            secure: true,
            sameSite: 'Lax',
          },
        ]);
        console.log(
          `✅ [Cloudflare Bypass] Cookie injected (Secret only) for .ocgtest.es`
        );
      }
    } else {
      console.log(
        `ℹ️  [Cloudflare] No credentials found for env=${env}, skipping injection`
      );
    }

    // Apply consent seeds if NO storageState is configured
    // This eliminates cookie banner interaction when storageState files don't exist
    const hasStorageState = storageStatePath !== undefined;
    if (!hasStorageState) {
      const page = await context.newPage();
      const webActions = new WebActions(page);

      // Pre-seed consent cookies for baseUrl
      await webActions.applyConsentSeedsFor(config.baseUrl);

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

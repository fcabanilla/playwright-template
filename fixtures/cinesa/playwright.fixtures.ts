import { test as base } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/cinesa/navbar/navbar.page';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookies/cookieBanner.page';
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
import { UnlimitedProgramsPage } from '../../pageObjectsManagers/cinesa/programs/unlimitedPrograms.page';
import { SignupPage } from '../../pageObjectsManagers/cinesa/signup/signup.page';

type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
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
  unlimitedProgramsPage: UnlimitedProgramsPage;
  signupPage: SignupPage;
  whoarewe: Footer;
  workwithus: Footer;
  cinesabusiness: Footer;
  customerservice: Footer;
  institutionalsupport: Footer;
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
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  ticketPicker: async ({ page }, use) => {
    const ticketPicker = new TicketPicker(page);
    await use(ticketPicker);
  },
  barPage: async ({ page }, use) => {
    const barPage = new BarPage(page);
    await use(barPage);
  },
  purchaseSummary: async ({ page }, use) => {
    const purchaseSummary = new PurchaseSummary(page);
    await use(purchaseSummary);
  },
  paymentPage: async ({ page }, use) => {
    const paymentPage = new PaymentPage(page);
    await use(paymentPage);
  },
  unlimitedProgramsPage: async ({ page }, use) => {
    const programsPage = new UnlimitedProgramsPage(page);
    await use(programsPage);
  },
  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
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
  institutionalsupport: async ({ footer }, use) => {
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
});

export { expect } from '@playwright/test';

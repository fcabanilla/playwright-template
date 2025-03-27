import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { navbarSelectors, NavbarSelectors } from './navbar.selectors';

/**
 * Represents the Cinesa website navigation bar component.
 * Provides methods to interact with navigation elements and navigate to different sections.
 */
export class Navbar {
  /**
   * Base URL for the Cinesa website.
   * @private
   */
  private readonly url: string = 'https://www.cinesa.es/';

  /**
   * Playwright page instance to interact with.
   */
  readonly page: Page;

  /**
   * Selectors for navbar elements.
   */
  readonly selectors: NavbarSelectors;

  /**
   * Creates a new Navbar instance.
   *
   * @param page - The Playwright page object to interact with.
   */
  constructor(page: Page) {
    this.page = page;
    this.selectors = navbarSelectors;
  }

  /**
   * Navigates to the Cinesa homepage.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToHome(): Promise<void> {
    await allure.test.step('Navigating to Cinesa home', async () => {
      await this.page.goto(this.url);
    });
  }

  /**
   * Clicks on the Cinesa logo in the navbar (usually returns to the homepage).
   *
   * @returns Promise que se resuelve cuando se completa la acción.
   */
  async clickLogo(): Promise<void> {
    await allure.test.step('Clicking on navbar logo', async () => {
      await this.page.click(this.selectors.logo);
    });
  }

  /**
   * Navigates to the Cinemas section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToCinemas(): Promise<void> {
    await allure.test.step('Navigating to Cinemas page', async () => {
      await this.page.click(this.selectors.cines);
    });
  }

  /**
   * Navigates to the Movies section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToMovies(): Promise<void> {
    await allure.test.step('Navigating to Movies page', async () => {
      await this.page.click(this.selectors.peliculas);
    });
  }

  /**
   * Navigates to the Promotions section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToPromotions(): Promise<void> {
    await allure.test.step('Navigating to Promotions page', async () => {
      await this.page.click(this.selectors.promociones);
    });
  }

  /**
   * Navigates to the Experiences section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToExperiences(): Promise<void> {
    await allure.test.step('Navigating to Experiences page', async () => {
      await this.page.click(this.selectors.experiencias);
    });
  }

  /**
   * Navigates to the Programs section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToPrograms(): Promise<void> {
    await allure.test.step('Navigating to Programs page', async () => {
      await this.page.click(this.selectors.programas);
    });
  }

  /**
   * Navigates to the Coupons section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToCoupons(): Promise<void> {
    await allure.test.step('Navigating to Coupons page', async () => {
      await this.page.click(this.selectors.bonos);
    });
  }
}

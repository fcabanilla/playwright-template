import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { navbarSelectors, NavbarSelectors } from './navbar.selectors';
import { WebActions } from '../../../core/webActions/webActions';
import { EnvironmentConfig } from '../../../config/environments';

/**
 * Represents the Cinesa website navigation bar component.
 * Provides methods to interact with navigation elements and navigate to different sections.
 * This class should only use WebActions, never directly access Playwright API.
 */
export class Navbar {
  /**
   * Base URL for the Cinesa website, injected from environment config.
   * @private
   */
    private url: string;

  /**
   * WebActions instance for all browser interactions.
   */
  readonly webActions: WebActions;

  /**
   * Selectors for navbar elements.
   */
  readonly selectors: NavbarSelectors;

  /**
   * Creates a new Navbar instance.
   *
   * @param page - The Playwright page object to interact with.
   */
  constructor(page: Page, baseUrl?: string) {
    this.webActions = new WebActions(page);
    this.selectors = navbarSelectors;
    this.url = baseUrl || 'https://www.cinesa.es/';
  }

  /**
   * Navigates to the Cinesa homepage.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToHome(): Promise<void> {
    await allure.test.step('Navigating to Cinesa home', async () => {
      await this.webActions.navigateTo(this.url);
    });
  }


  /**
   * Clicks on the Cinesa logo in the navbar (usually returns to the homepage).
   *
   * @returns Promise que se resuelve cuando se completa la acción.
   */
  async clickLogo(): Promise<void> {
    await allure.test.step('Clicking on navbar logo', async () => {
      await this.webActions.click(this.selectors.logo);
    });
  }

  /**
   * Navigates to the Cinemas section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToCinemas(): Promise<void> {
    await allure.test.step('Navigating to Cinemas page', async () => {
      await this.webActions.click(this.selectors.cines);
    });
  }

  /**
   * Navigates to the Movies section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToMovies(): Promise<void> {
    await allure.test.step('Navigating to Movies page', async () => {
      await this.webActions.click(this.selectors.peliculas);
    });
  }

  /**
   * Navigates to the Promotions section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToPromotions(): Promise<void> {
    await allure.test.step('Navigating to Promotions page', async () => {
      await this.webActions.click(this.selectors.promociones);
    });
  }

  /**
   * Navigates to the Experiences section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToExperiences(): Promise<void> {
    await allure.test.step('Navigating to Experiences page', async () => {
      await this.webActions.click(this.selectors.experiencias);
    });
  }

  /**
   * Navigates to the Programs section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToPrograms(): Promise<void> {
    await allure.test.step('Navigating to Programs page', async () => {
      await this.webActions.click(this.selectors.programas);
    });
  }

  /**
   * Navigates to the Coupons section.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToCoupons(): Promise<void> {
    await allure.test.step('Navigating to Coupons page', async () => {
      await this.webActions.click(this.selectors.bonos);
    });
  }

  /**
   * Hace clic en el botón "Inicia sesión".
   *
   * @returns Promise que se resuelve cuando se completa la acción.
   */
  async clickSignin(): Promise<void> {
    await allure.test.step('Clicking on Sign In button', async () => {
      await this.webActions.click(this.selectors.signin);
    });
  }

  /**
   * Navega a la página de inicio de sesión (sign in).
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToSignIn(): Promise<void> {
    await this.clickSignin();
  }

  /**
   * Navega a la página de registro (signup).
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigateToSignup(): Promise<void> {
    await allure.test.step('Clicking on Signup button', async () => {
      await this.webActions.click(this.selectors.signup);
    });
  }
}

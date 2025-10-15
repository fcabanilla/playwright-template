import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  navbarSelectors,
  NavbarSelectors,
  NAVBAR_SELECTORS,
} from './navbar.selectors';
import { WebActions } from '../../../core/webactions/webActions';
import { getCinesaUrls } from '../../../config/urls';

/**
 * Unified Navbar Page Object for both authenticated and unauthenticated states.
 * Automatically detects authentication state and provides appropriate methods.
 *
 * Following ADR-0009: Page Objects delegate to WebActions, never access Playwright API directly.
 *
 * The navbar displays different elements based on authentication:
 * - Unauthenticated: Shows "Inicia sesión" and "Regístrate" buttons
 * - Authenticated: Shows user name, "Mi cuenta" link, and "Cerrar sesión" button
 *
 * Methods automatically check authentication state and throw errors if called in wrong state.
 *
 * @example
 * ```typescript
 * // Check authentication state
 * const isAuth = await navbar.isAuthenticated();
 *
 * // Navigate based on state
 * if (isAuth) {
 *   await navbar.navigateToMyAccount();
 * } else {
 *   await navbar.clickSignIn();
 * }
 * ```
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
   * Legacy selectors for backward compatibility.
   * @deprecated Use NAVBAR_SELECTORS instead
   */
  readonly selectors: NavbarSelectors;

  /**
   * Creates a new Navbar instance.
   *
   * @param page - The Playwright page object to interact with.
   * @param baseUrl - Optional base URL for the website
   */
  constructor(page: Page, baseUrl?: string) {
    this.webActions = new WebActions(page);
    this.selectors = navbarSelectors;
    this.url = baseUrl || 'https://www.cinesa.es/';
  }

  // ============================================================
  // AUTHENTICATION STATE DETECTION
  // ============================================================

  /**
   * Detects if the user is currently authenticated.
   * Checks for the presence of .header-member container (more reliable than member-name).
   *
   * The .header-member class is added to .header-sign only when user is authenticated.
   * This is more reliable than checking .member-name which might be hidden/not visible.
   *
   * @returns Promise resolving to true if authenticated, false otherwise
   */
  async isAuthenticated(): Promise<boolean> {
    // Check for .header-member class which is only present when authenticated
    return await this.webActions.isVisible(
      NAVBAR_SELECTORS.authenticated.headerMember
    );
  }

  /**
   * Ensures user is authenticated before proceeding.
   * Throws error if not authenticated.
   *
   * @throws Error if user is not authenticated
   */
  private async ensureAuthenticated(): Promise<void> {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      throw new Error(
        'Operation requires authentication. User is not logged in.'
      );
    }
  }

  /**
   * Ensures user is NOT authenticated before proceeding.
   * Throws error if authenticated.
   *
   * @throws Error if user is authenticated
   */
  private async ensureNotAuthenticated(): Promise<void> {
    const isAuth = await this.isAuthenticated();
    if (isAuth) {
      throw new Error(
        'Operation requires unauthenticated state. User is already logged in.'
      );
    }
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

  // ============================================================
  // AUTHENTICATED USER METHODS (require login)
  // ============================================================

  /**
   * Navigates to My Account overview page.
   * Only works when user is authenticated.
   *
   * Opens the member context menu first, then clicks "Mi cuenta" link.
   *
   * @throws Error if user is not authenticated
   * @returns Promise that resolves when navigation is complete
   *
   * @example
   * ```typescript
   * if (await navbar.isAuthenticated()) {
   *   await navbar.navigateToMyAccount();
   * }
   * ```
   */
  async navigateToMyAccount(): Promise<void> {
    await this.ensureAuthenticated();
    await allure.test.step('Navigating to My Account', async () => {
      // Get the expected My Account URL from config
      const urls = getCinesaUrls();
      const expectedUrl = urls.myAccount.overview;

      // Click on the member context icon - this navigates directly (no dropdown)
      await this.webActions.clickWithOverlayHandling(
        NAVBAR_SELECTORS.authenticated.memberContext
      );

      // Wait for navigation to My Account overview page
      await this.webActions.waitForUrl(`**${new URL(expectedUrl).pathname}`, {
        timeout: 10000,
        waitUntil: 'domcontentloaded',
      });
    });
  }

  /**
   * Logs out the current user.
   * Only works when user is authenticated.
   *
   * @throws Error if user is not authenticated
   * @returns Promise that resolves when logout is complete
   *
   * @example
   * ```typescript
   * await navbar.logout();
   * ```
   */
  async logout(): Promise<void> {
    await this.ensureAuthenticated();
    await allure.test.step('Logging out', async () => {
      await this.webActions.clickWithOverlayHandling(
        NAVBAR_SELECTORS.authenticated.logoutButton
      );
      // Wait for redirect to home (sign in button visible again)
      await this.webActions.waitForVisible(
        NAVBAR_SELECTORS.unauthenticated.signInButton,
        5000
      );
    });
  }

  /**
   * Gets the displayed user name from navbar.
   * Only works when user is authenticated.
   *
   * @throws Error if user is not authenticated
   * @returns Promise resolving to user name
   *
   * @example
   * ```typescript
   * const name = await navbar.getUserName();
   * console.log(`Logged in as: ${name}`);
   * ```
   */
  async getUserName(): Promise<string> {
    await this.ensureAuthenticated();
    return await this.webActions.getText(
      NAVBAR_SELECTORS.authenticated.userName
    );
  }

  /**
   * Gets the user name if authenticated, otherwise returns null.
   * Safe version that doesn't throw errors.
   *
   * @returns Promise resolving to user name or null
   */
  async getUserNameSafe(): Promise<string | null> {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      return null;
    }
    try {
      return await this.webActions.getText(
        NAVBAR_SELECTORS.authenticated.userName
      );
    } catch {
      return null;
    }
  }

  /**
   * Gets the member tier badge text (if visible).
   * Returns null if not authenticated or tier not displayed.
   *
   * @returns Promise resolving to tier name or null
   */
  async getMemberTier(): Promise<string | null> {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      return null;
    }
    try {
      return await this.webActions.getText(
        NAVBAR_SELECTORS.authenticated.memberTier
      );
    } catch {
      return null;
    }
  }

  /**
   * Gets the points balance displayed in navbar (if visible).
   * Returns null if not authenticated or points not displayed.
   *
   * @returns Promise resolving to points balance or null
   */
  async getPointsBalance(): Promise<string | null> {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      return null;
    }
    try {
      return await this.webActions.getText(
        NAVBAR_SELECTORS.authenticated.pointsBalance
      );
    } catch {
      return null;
    }
  }

  // ============================================================
  // UNAUTHENTICATED USER METHODS (require NOT logged in)
  // ============================================================

  /**
   * Clicks the Sign In button to open login modal/page.
   * Only works when user is NOT authenticated.
   *
   * @throws Error if user is already authenticated
   * @returns Promise that resolves when click is complete
   *
   * @example
   * ```typescript
   * if (!await navbar.isAuthenticated()) {
   *   await navbar.clickSignInButton();
   * }
   * ```
   */
  async clickSignInButton(): Promise<void> {
    await this.ensureNotAuthenticated();
    await allure.test.step('Clicking Sign In button', async () => {
      await this.webActions.click(
        NAVBAR_SELECTORS.unauthenticated.signInButton
      );
    });
  }

  /**
   * Clicks the Sign Up button to open registration modal/page.
   * Only works when user is NOT authenticated.
   *
   * @throws Error if user is already authenticated
   * @returns Promise that resolves when click is complete
   */
  async clickSignUpButton(): Promise<void> {
    await this.ensureNotAuthenticated();
    await allure.test.step('Clicking Sign Up button', async () => {
      await this.webActions.click(
        NAVBAR_SELECTORS.unauthenticated.signUpButton
      );
    });
  }

  /**
   * Checks if login button is visible (user NOT authenticated).
   * Alternative way to check authentication state.
   *
   * @returns Promise resolving to true if login button visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.webActions.isVisible(
      NAVBAR_SELECTORS.unauthenticated.signInButton
    );
  }
}

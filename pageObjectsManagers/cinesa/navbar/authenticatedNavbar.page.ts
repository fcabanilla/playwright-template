/**
 * Page Object for authenticated user navigation
 * Following ADR-0009: Page Objects delegate to WebActions, never access Playwright API directly
 *
 * This Page Object handles navigation for authenticated users, including:
 * - Opening account menu
 * - Navigating to My Account sections
 * - Verifying authentication state
 * - Logout
 *
 * @module AuthenticatedNavbarPage
 */

import { Page } from '@playwright/test';
import { WebActions } from '../../../core/webactions/webActions';
import { AuthenticatedNavbarSelectors } from './authenticatedNavbar.selectors';

/**
 * Page Object for authenticated navigation bar
 * Delegates all Playwright API calls to WebActions
 */
export class AuthenticatedNavbarPage {
  private readonly webActions: WebActions;

  constructor(page: Page) {
    this.webActions = new WebActions(page);
  }

  /**
   * Opens the account dropdown menu by clicking the account button/icon
   *
   * @returns Promise that resolves when menu is opened and visible
   * @throws Error if account button is not found or menu fails to open
   */
  async openAccountMenu(): Promise<void> {
    // Try primary selector first
    const accountButtonSelector =
      AuthenticatedNavbarSelectors.accountButton.iconButton;

    await this.webActions.clickWithOverlayHandling(accountButtonSelector);

    // Wait for menu to be visible
    await this.webActions.waitForVisible(
      AuthenticatedNavbarSelectors.accountMenu.container,
      5000
    );
  }

  /**
   * Navigates to My Account overview page
   * Opens account menu first if not already open
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToMyAccount(): Promise<void> {
    // First, try to open menu (will fail gracefully if already open)
    try {
      await this.openAccountMenu();
    } catch (error) {
      // Menu might already be open, continue
    }

    // Click "Mi área de cliente" link
    await this.webActions.clickWithOverlayHandling(
      AuthenticatedNavbarSelectors.accountMenu.myAccountLink
    );

    // Wait for navigation to complete
    await this.webActions.expectUrl('/mycinesa/mi-area-de-cliente/');
  }

  /**
   * Navigates to My Bookings page
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToMyBookings(): Promise<void> {
    await this.openAccountMenu();
    await this.webActions.clickWithOverlayHandling(
      AuthenticatedNavbarSelectors.accountMenu.myBookingsLink
    );
    await this.webActions.expectUrl('/mycinesa/mis-entradas/');
  }

  /**
   * Navigates to My Profile page
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToMyProfile(): Promise<void> {
    await this.openAccountMenu();
    await this.webActions.clickWithOverlayHandling(
      AuthenticatedNavbarSelectors.accountMenu.myProfileLink
    );
    await this.webActions.expectUrl('/mycinesa/mi-perfil/');
  }

  /**
   * Navigates to Preferences page
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToPreferences(): Promise<void> {
    await this.openAccountMenu();
    await this.webActions.clickWithOverlayHandling(
      AuthenticatedNavbarSelectors.accountMenu.myPreferencesLink
    );
    await this.webActions.expectUrl('/mycinesa/preferencias/');
  }

  /**
   * Navigates to Membership page
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToMembership(): Promise<void> {
    await this.openAccountMenu();
    await this.webActions.clickWithOverlayHandling(
      AuthenticatedNavbarSelectors.accountMenu.myMembershipLink
    );
    await this.webActions.expectUrl('/mycinesa/mis-suscripciones/');
  }

  /**
   * Logs out the current user
   *
   * @returns Promise that resolves when logout is complete
   */
  async logout(): Promise<void> {
    await this.openAccountMenu();
    await this.webActions.clickWithOverlayHandling(
      AuthenticatedNavbarSelectors.accountMenu.logoutButton
    );

    // Wait for redirect to home (login button visible again)
    await this.webActions.waitForVisible(
      AuthenticatedNavbarSelectors.loginButton,
      5000
    );
  }

  /**
   * Verifies that user is authenticated by checking for account button presence
   *
   * @returns Promise resolving to true if authenticated, false otherwise
   */
  async isUserAuthenticated(): Promise<boolean> {
    try {
      await this.webActions.waitForVisible(
        AuthenticatedNavbarSelectors.accountButton.iconButton,
        3000
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifies that login button is visible (user NOT authenticated)
   *
   * @returns Promise resolving to true if login button visible, false otherwise
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.webActions.isVisible(
      AuthenticatedNavbarSelectors.loginButton
    );
  }

  /**
   * Gets the displayed user name from navbar (if visible)
   *
   * @returns Promise resolving to user name or null if not found
   */
  async getUserName(): Promise<string | null> {
    try {
      return await this.webActions.getText(
        AuthenticatedNavbarSelectors.userInfo.userName
      );
    } catch {
      return null;
    }
  }

  /**
   * Gets the member tier badge text (if visible)
   *
   * @returns Promise resolving to tier name or null if not found
   */
  async getMemberTier(): Promise<string | null> {
    try {
      return await this.webActions.getText(
        AuthenticatedNavbarSelectors.userInfo.memberTier
      );
    } catch {
      return null;
    }
  }

  /**
   * Gets the points balance displayed in navbar (if visible)
   *
   * @returns Promise resolving to points balance or null if not found
   */
  async getPointsBalance(): Promise<string | null> {
    try {
      return await this.webActions.getText(
        AuthenticatedNavbarSelectors.userInfo.pointsBalance
      );
    } catch {
      return null;
    }
  }
}

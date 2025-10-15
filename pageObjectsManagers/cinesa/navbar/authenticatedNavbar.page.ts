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
   * Navigates to My Account overview page by clicking the "Mi cuenta" link
   * This link appears directly in the navbar after authentication
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToMyAccount(): Promise<void> {
    // Click the "Mi cuenta" link that appears in navbar after login
    await this.webActions.clickWithOverlayHandling(
      AuthenticatedNavbarSelectors.myAccountNavLink
    );

    // Wait for navigation to complete (URL contains /mycinesa/)
    await this.webActions.expectUrl('/mycinesa/');
  }

  /**
   * Logs out the current user by clicking the "Cerrar sesión" button
   *
   * @returns Promise that resolves when logout is complete
   */
  async logout(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(
      AuthenticatedNavbarSelectors.logoutButton
    );

    // Wait for redirect to home (login button visible again)
    await this.webActions.waitForVisible(
      AuthenticatedNavbarSelectors.loginButton,
      5000
    );
  }

  /**
   * Verifies that user is authenticated by checking for member name presence
   *
   * @returns Promise resolving to true if authenticated, false otherwise
   */
  async isUserAuthenticated(): Promise<boolean> {
    try {
      await this.webActions.waitForVisible(
        AuthenticatedNavbarSelectors.memberContext.memberName,
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

/**
 * Page Object for My Account Overview page
 * Following ADR-0009: Page Objects delegate to WebActions, never access Playwright API directly
 *
 * This is the main landing page at /mycinesa/mi-area-de-cliente/
 * Reference: ADR-0008 - My Account Area Testing Strategy (Section 1: Overview)
 *
 * @module MyAccountOverviewPage
 */

import { Page } from '@playwright/test';
import { WebActions } from '../../../core/webactions/webActions';
import { MyAccountOverviewSelectors } from './myAccountOverview.selectors';
import type { MyAccountSection, MyAccountDashboard } from './myAccount.types';

/**
 * Page Object for My Account Overview
 * Entry point to all My Account subsections
 */
export class MyAccountOverviewPage {
  private readonly webActions: WebActions;

  constructor(page: Page) {
    this.webActions = new WebActions(page);
  }

  /**
   * Navigates directly to My Account overview page
   *
   * @param baseUrl - Base URL of the application (e.g., 'https://lab-web.ocgtest.es')
   * @returns Promise that resolves when page loads
   */
  async navigateTo(baseUrl: string): Promise<void> {
    await this.webActions.navigateTo(`${baseUrl}/mycinesa/mi-area-de-cliente/`);
    await this.waitForPageLoad();
  }

  /**
   * Waits for the My Account overview page to finish loading
   *
   * @returns Promise that resolves when page is fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.webActions.waitForVisible(
      MyAccountOverviewSelectors.page.container,
      10000
    );
  }

  /**
   * Verifies that My Account page is displayed
   *
   * @returns Promise resolving to true if on My Account page
   */
  async isOnMyAccountPage(): Promise<boolean> {
    return await this.webActions.isVisible(
      MyAccountOverviewSelectors.page.container
    );
  }

  /**
   * Gets the page title text
   *
   * @returns Promise resolving to page title
   */
  async getPageTitle(): Promise<string> {
    return await this.webActions.getText(MyAccountOverviewSelectors.page.title);
  }

  /**
   * Gets the welcome message displayed to user
   *
   * @returns Promise resolving to welcome message or null if not found
   */
  async getWelcomeMessage(): Promise<string | null> {
    try {
      return await this.webActions.getText(
        MyAccountOverviewSelectors.page.welcomeMessage
      );
    } catch {
      return null;
    }
  }

  // ============================================================
  // NAVIGATION TO SUBSECTIONS
  // ============================================================

  /**
   * Navigates to Bookings section (Mis Entradas)
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToBookings(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(
      MyAccountOverviewSelectors.navigation.bookingsCard
    );
    await this.webActions.expectUrl('/mycinesa/mis-entradas/');
  }

  /**
   * Navigates to Preferences section (Preferencias)
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToPreferences(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(
      MyAccountOverviewSelectors.navigation.preferencesCard
    );
    await this.webActions.expectUrl('/mycinesa/preferencias/');
  }

  /**
   * Navigates to Membership section (Suscripciones)
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToMembership(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(
      MyAccountOverviewSelectors.navigation.membershipCard
    );
    await this.webActions.expectUrl('/mycinesa/mis-suscripciones/');
  }

  /**
   * Navigates to Offers & Rewards section
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToOffers(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(
      MyAccountOverviewSelectors.navigation.offersCard
    );
    await this.webActions.expectUrl('/mycinesa/ofertas-y-recompensas/');
  }

  /**
   * Navigates to Card Wallet section (Mis Tarjetas)
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToCardWallet(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(
      MyAccountOverviewSelectors.navigation.cardWalletCard
    );
    await this.webActions.expectUrl('/mycinesa/mis-tarjetas/');
  }

  /**
   * Navigates to Profile section (Mi Perfil)
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToProfile(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(
      MyAccountOverviewSelectors.navigation.profileCard
    );
    await this.webActions.expectUrl('/mycinesa/mi-perfil/');
  }

  /**
   * Generic navigation to any My Account section
   *
   * @param section - The section to navigate to
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToSection(section: MyAccountSection): Promise<void> {
    const navigationMap: Record<MyAccountSection, () => Promise<void>> = {
      overview: async () => {
        /* Already on overview */
      },
      bookings: () => this.navigateToBookings(),
      preferences: () => this.navigateToPreferences(),
      membership: () => this.navigateToMembership(),
      offers: () => this.navigateToOffers(),
      cardWallet: () => this.navigateToCardWallet(),
      profile: () => this.navigateToProfile(),
    };

    await navigationMap[section]();
  }

  // ============================================================
  // DASHBOARD DATA
  // ============================================================

  /**
   * Gets the user's loyalty points balance from dashboard
   *
   * @returns Promise resolving to points value or null if not found
   */
  async getPointsBalance(): Promise<number | null> {
    try {
      const pointsText = await this.webActions.getText(
        MyAccountOverviewSelectors.dashboard.pointsValue
      );
      // Extract numeric value (e.g., "1,234 puntos" -> 1234)
      const numericValue = pointsText.replace(/[^\d]/g, '');
      return parseInt(numericValue, 10);
    } catch {
      return null;
    }
  }

  /**
   * Gets the membership tier displayed on dashboard
   *
   * @returns Promise resolving to membership tier text or null
   */
  async getMembershipTier(): Promise<string | null> {
    try {
      return await this.webActions.getText(
        MyAccountOverviewSelectors.dashboard.membershipTier
      );
    } catch {
      return null;
    }
  }

  /**
   * Gets the membership expiry date
   *
   * @returns Promise resolving to expiry date string or null
   */
  async getMembershipExpiry(): Promise<string | null> {
    try {
      return await this.webActions.getText(
        MyAccountOverviewSelectors.dashboard.membershipExpiry
      );
    } catch {
      return null;
    }
  }

  /**
   * Gets the count of recent bookings displayed
   *
   * @returns Promise resolving to number of booking items
   */
  async getRecentBookingsCount(): Promise<number> {
    return await this.webActions.getElementCount(
      MyAccountOverviewSelectors.dashboard.bookingItem
    );
  }

  /**
   * Gets the count of active offers displayed
   *
   * @returns Promise resolving to number of offer items
   */
  async getActiveOffersCount(): Promise<number> {
    return await this.webActions.getElementCount(
      MyAccountOverviewSelectors.dashboard.offerItem
    );
  }

  /**
   * Gets all dashboard data in a single call
   *
   * @returns Promise resolving to dashboard data object
   */
  async getDashboardData(): Promise<Partial<MyAccountDashboard>> {
    return {
      pointsBalance: (await this.getPointsBalance()) || undefined,
      membershipTier: ((await this.getMembershipTier()) as any) || 'none',
      membershipExpiry: (await this.getMembershipExpiry()) || undefined,
      activeBookingsCount: await this.getRecentBookingsCount(),
      availableOffersCount: await this.getActiveOffersCount(),
    };
  }

  // ============================================================
  // VERIFICATION METHODS
  // ============================================================

  /**
   * Verifies that a specific section card is visible
   *
   * @param section - The section to verify
   * @returns Promise resolving to true if card is visible
   */
  async isSectionVisible(section: MyAccountSection): Promise<boolean> {
    const selectorMap: Record<MyAccountSection, string> = {
      overview: MyAccountOverviewSelectors.navigation.overviewCard,
      bookings: MyAccountOverviewSelectors.navigation.bookingsCard,
      preferences: MyAccountOverviewSelectors.navigation.preferencesCard,
      membership: MyAccountOverviewSelectors.navigation.membershipCard,
      offers: MyAccountOverviewSelectors.navigation.offersCard,
      cardWallet: MyAccountOverviewSelectors.navigation.cardWalletCard,
      profile: MyAccountOverviewSelectors.navigation.profileCard,
    };

    return await this.webActions.isVisible(selectorMap[section]);
  }

  /**
   * Verifies that page is in loading state
   *
   * @returns Promise resolving to true if loading indicator visible
   */
  async isLoading(): Promise<boolean> {
    return await this.webActions.isVisible(
      MyAccountOverviewSelectors.loading.spinner
    );
  }

  /**
   * Verifies that page shows an error state
   *
   * @returns Promise resolving to true if error message visible
   */
  async hasError(): Promise<boolean> {
    return await this.webActions.isVisible(
      MyAccountOverviewSelectors.error.container
    );
  }

  /**
   * Gets the error message displayed (if any)
   *
   * @returns Promise resolving to error message or null
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.hasError()) {
      return await this.webActions.getText(
        MyAccountOverviewSelectors.error.description
      );
    }
    return null;
  }
}

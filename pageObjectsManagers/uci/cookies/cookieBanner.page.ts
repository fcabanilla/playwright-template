import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  CookieBannerSelectors,
  cookieBannerSelectors,
} from './cookieBanner.selectors';

export class CookieBanner {
  private readonly page: Page;
  private readonly selectors: CookieBannerSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = cookieBannerSelectors;
  }

  async acceptCookies(): Promise<void> {
    if (await this.page.isVisible(this.selectors.acceptButton)) {
      await allure.test.step('Accepting cookies', async () => {
        await this.page.click(this.selectors.acceptButton);
      });
    }
  }

  async rejectCookies(): Promise<void> {
    if (await this.page.isVisible(this.selectors.rejectButton)) {
      await allure.test.step('Rejecting cookies', async () => {
        await this.page.click(this.selectors.rejectButton);
      });
    }
  }

  async openCookieSettings(): Promise<void> {
    if (await this.page.isVisible(this.selectors.settingsButton)) {
      await allure.test.step('Opening cookie settings', async () => {
        await this.page.click(this.selectors.settingsButton);
      });
    }
  }

  async isCookieBannerVisible(): Promise<boolean> {
    return await this.page.isVisible(this.selectors.banner);
  }
}

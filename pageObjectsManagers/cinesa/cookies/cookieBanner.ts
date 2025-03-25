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
    await allure.test.step('Accepting cookies', async () => {
      await this.page.click(this.selectors.acceptButton);
    });
  }
}

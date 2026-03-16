import { WebActions } from '../../../core/webactions/webActions';
import { allure } from 'allure-playwright';
import {
  CookieBannerSelectors,
  cookieBannerSelectors,
} from './cookieBanner.selectors';

export class CookieBanner {
  private readonly webActions: WebActions;
  private readonly selectors: CookieBannerSelectors;

  constructor(webActions: WebActions) {
    this.webActions = webActions;
    this.selectors = cookieBannerSelectors;
  }

  async acceptCookies(): Promise<void> {
    if (await this.webActions.isVisible(this.selectors.acceptButton)) {
      await allure.step('Accepting cookies', async () => {
        await this.webActions.click(this.selectors.acceptButton);
      });
    }
  }

  async rejectCookies(): Promise<void> {
    if (await this.webActions.isVisible(this.selectors.rejectButton)) {
      await allure.step('Rejecting cookies', async () => {
        await this.webActions.click(this.selectors.rejectButton);
      });
    }
  }

  async openCookieSettings(): Promise<void> {
    if (await this.webActions.isVisible(this.selectors.settingsButton)) {
      await allure.step('Opening cookie settings', async () => {
        await this.webActions.click(this.selectors.settingsButton);
      });
    }
  }

  async isCookieBannerVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.banner);
  }
}

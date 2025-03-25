import { Page, ElementHandle } from '@playwright/test';
import * as allure from 'allure-playwright';
import { RelatedArticlesSelectors, relatedArticlesSelectors } from './relatedArticles.selectors';

export class RelatedArticles {
  private readonly page: Page;
  private container?: ElementHandle;
  public selectors: RelatedArticlesSelectors;
  constructor(page: Page, container?: ElementHandle) {
    this.page = page;
    this.container = container;
    this.selectors = relatedArticlesSelectors;
  }

  async clickArticleByIndex(index: number): Promise<void> {
    await allure.test.step(`Clicking article at index ${index}`, async () => {
      const articleSelector = this.selectors.articleLinkByIndex(index);
      if (this.container) {
        await this.container.$eval(articleSelector, el => (el as HTMLElement).click());
      } else {
        await this.page.click(articleSelector);
      }
    });
  }

  async getArticleTitles(): Promise<string[]> {
    if (this.container) {
      return await this.container.$$eval(this.selectors.articleTitles, articles =>
        articles.map(article => article.textContent || '')
      );
    }
    return await this.page.$$eval(this.selectors.articleTitles, articles =>
      articles.map(article => article.textContent || '')
    );
  }
}

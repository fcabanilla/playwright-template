import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { RelatedArticlesSelectors, relatedArticlesSelectors } from './relatedArticles.selectors';

export class RelatedArticles {
  private readonly page: Page;
  public selectors: RelatedArticlesSelectors;
  constructor(page: Page) {
    this.page = page;
    this.selectors = relatedArticlesSelectors;
  }

  async clickArticleByIndex(index: number): Promise<void> {
    await allure.test.step(`Clicking article at index ${index}`, async () => {
      const articleSelector = this.selectors.articleLinkByIndex(index);
      await this.page.click(articleSelector);
    });
  }

  async getArticleTitles(): Promise<string[]> {
    return await this.page.$$eval(this.selectors.articleTitles, articles => articles.map(article => article.textContent || ''));
  }
}

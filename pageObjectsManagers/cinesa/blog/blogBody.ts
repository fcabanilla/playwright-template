import { Page } from '@playwright/test';
import { BlogBodySelectors, blogBodySelectors } from './blogBody.selectors';
import { RelatedArticles } from './relatedArticles';

export class BlogBody {
  private readonly page: Page;
  public selectors: BlogBodySelectors;
  public relatedArticles: RelatedArticles[];
  constructor(page: Page) {
    this.page = page;
    this.selectors = blogBodySelectors;
    this.relatedArticles = [];
  }

  async getRelatedArticles(): Promise<void> {
    const sections = await this.page.$$(this.selectors.relatedArticlesWrapper);
    this.relatedArticles = sections.map(section => new RelatedArticles(this.page, section));
  }
}

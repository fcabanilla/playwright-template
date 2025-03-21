import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { BlogSelectors, blogSelectors } from './blog.selectors';
import { BlogBody } from './blogBody';
import { Navbar } from '../navbar';
import { Footer } from '../footer';

export class Blog {
  private readonly page: Page;
  public selectors: BlogSelectors;
  public navbar: Navbar;
  public footer: Footer;
  public body: BlogBody;
  private readonly url: string = 'https://www.cinesa.es/blog-cinesa/';
  constructor(page: Page) {
    this.page = page;
    this.selectors = blogSelectors;
    this.navbar = new Navbar(page);
    this.footer = new Footer(page);
    this.body = new BlogBody(page);
  }

  async navigateToBlog(): Promise<void> {
    await allure.test.step('Navigating to Blog de Cinesa', async () => {
      await this.page.goto(this.url);
    });
  }

  async clickLogo(): Promise<void> {
    await allure.test.step('Clicking blog logo', async () => {
      await this.page.click(this.selectors.blogLogo);
    });
  }

  async clickPromoBannerLink(): Promise<void> {
    await allure.test.step('Clicking promo banner link', async () => {
      await this.page.click(this.selectors.promoBannerLink);
    });
  }

  getUrl(): string {
    return this.url;
  }

  async getSections(): Promise<BlogBody[]> {
    const sections = await this.page.$$(this.selectors.sectionWrapper);
    return sections.map(() => new BlogBody(this.page));
  }
}

import { Page, expect } from '@playwright/test';
import { Blog } from '../../pageObjectsManagers/cinesa/blog/blog';

export async function assertFirstRelatedArticleRedirection(page: Page, blog: Blog): Promise<void> {
  await blog.body.getRelatedArticles();
  const firstSection = blog.body.relatedArticles[0];
  let firstArticleLink = await page.getAttribute(firstSection.selectors.articleLinkByIndex(0), 'href');
  if (firstArticleLink?.startsWith('/blog-cinesa/')) {
    firstArticleLink = firstArticleLink.replace('/blog-cinesa/', '');
  }
  const expectedUrl = `${blog.getUrl()}${firstArticleLink}`;
  await firstSection.clickArticleByIndex(0);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(expectedUrl);
}

export async function assertAllRelatedArticlesRedirection(page: Page, blog: Blog): Promise<void> {
  await blog.body.getRelatedArticles();
  for (const section of blog.body.relatedArticles) {
    const articleCount = await page.$$eval(section.selectors.articleTitles, articles => articles.length);
    for (let i = 0; i < articleCount; i++) {
      let articleLink = await page.getAttribute(section.selectors.articleLinkByIndex(i), 'href');
      if (articleLink?.startsWith('/blog-cinesa/')) {
        articleLink = articleLink.replace('/blog-cinesa/', '');
      }
      const expectedUrl = `${blog.getUrl()}${articleLink}`;
      await section.clickArticleByIndex(i);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(expectedUrl);
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await blog.body.getRelatedArticles();
    }
  }
}

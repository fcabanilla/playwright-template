import { test } from '@playwright/test';
import { Blog } from '../../../pageObjectsManagers/cinesa/blog/blog';
import { assertFirstRelatedArticleRedirection, assertAllRelatedArticlesRedirection } from './blog.assertions';

test.describe('Cinesa Blog Tests', () => {
  let blog: Blog;

  test.beforeEach(async ({ page }) => {
    blog = new Blog(page);
    await blog.navigateToBlog();
  });

  // test('should click on the first related article in the first section and verify redirection', async ({ page }) => {
  //   await assertFirstRelatedArticleRedirection(page, blog);
  // });

  test('should click on all related articles in all sections and verify redirection', async ({ page }) => {
    await assertAllRelatedArticlesRedirection(page, blog);
  });
});

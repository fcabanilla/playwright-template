/**
 * Interface that defines the selectors used on the Blog Landing Page.
 */
export interface BlogLandingSelectors {
  /**
   * Selector for the blog logo image.
   */
  logo: string;
  /**
   * Selector for the main grid container.
   */
  grid: string;
  /**
   * Selector for the container grouping all related articles.
   */
  allRelatedArticles: string;
  /**
   * Selector for each article card within the related articles section.
   */
  articleCard: string;
  /**
   * Selector for the article link within each card.
   */
  articleLink: string;
}

/**
 * Get environment-specific selectors for Blog Landing Page.
 * @param env - Environment (production, preprod, lab)
 */
function getBlogLandingSelectorsForEnvironment(env: string = 'production'): BlogLandingSelectors {
  const baseSelectors = {
    logo: '.blog-landing-page-logo picture img',
    grid: '.grid',
    allRelatedArticles: '.all-related-article-groups',
    articleCard: '.blog-article-card',
  };

  // Environment-specific article link selectors
  const articleLinkSelectors = {
    production: 'a.article-card-hero-link',
    preprod: 'a.article-card-hero-link',
    lab: 'a.article-card-hero-link',
  };

  return {
    ...baseSelectors,
    articleLink: articleLinkSelectors[env as keyof typeof articleLinkSelectors] || articleLinkSelectors.production,
  };
}

/**
 * Set of selectors for the Blog Landing Page.
 */
export const blogLandingSelectors: BlogLandingSelectors = getBlogLandingSelectorsForEnvironment(
  process.env.TEST_ENV || 'production'
);

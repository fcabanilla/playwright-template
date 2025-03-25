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
}

/**
 * Set of selectors for the Blog Landing Page.
 */
export const blogLandingSelectors: BlogLandingSelectors = {
  logo: '.blog-landing-page-logo picture img',
  grid: '.grid',
  allRelatedArticles: '.all-related-article-groups',
  articleCard: '.blog-article-card',
};

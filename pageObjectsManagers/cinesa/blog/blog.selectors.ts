export interface BlogSelectors {
  blogLogo: string;
  promoBannerLink: string;
  sectionWrapper: string;
}

export const blogSelectors: BlogSelectors = {
  blogLogo: '.blog-landing-page-logo',
  promoBannerLink: 'a.promo-banner--content-link',
  sectionWrapper: '.related-articles-wrapper',
};

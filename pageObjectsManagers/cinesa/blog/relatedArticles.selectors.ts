export interface RelatedArticlesSelectors {
  articleLinkByIndex: (index: number) => string;
  articleTitles: string;
}

export const relatedArticlesSelectors: RelatedArticlesSelectors = {
  articleLinkByIndex: (index: number) => `.related-articles-container .blog-article-card-container:nth-child(${index + 1}) a.article-card-hero-link`,
  articleTitles: `.related-articles-container .blog-article-card--content h4`,
};

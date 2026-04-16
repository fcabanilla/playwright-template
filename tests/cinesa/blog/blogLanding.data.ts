import { CinesaEnvironment } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';

/**
 * Expected article card counts per environment.
 * Production and lab have full blog content; preprod has reduced content.
 */
const articleCardsCountByEnv: Record<string, number> = {
  production: 11,
  preprod: 5,
  lab: 11,
};

/**
 * Contains test data for the Blog Landing Page tests.
 */
export const blogLandingData = {
  /**
   * Expected number of related article cards on the Blog Landing Page.
   */
  expectedArticleCardsCount: articleCardsCountByEnv[env] ?? 11,
  // Additional test data can be added here as needed.
};

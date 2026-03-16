import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';
import {
  CinemaConfig,
  getCinemasForEnvironment,
} from '../../../config/cinemas.config';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const MOVIES_URL = `${config.baseUrl}/peliculas/`;

/**
 * Get available cinemas for movie schema tests based on current environment
 * Excludes Grancasa due to environment-specific issues per user instruction
 */
export function getCinemasForMovieTests(env?: string): CinemaConfig[] {
  return getCinemasForEnvironment(env).filter(cinema => cinema.name !== 'Grancasa');
}

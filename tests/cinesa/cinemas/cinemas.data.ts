import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';
import {
  CinemaConfig,
  getCinemasForEnvironment,
} from '../../../config/cinemas.config';

export const cinemasData = {
  oasiz: 'oasiz',
  santander: 'santander',
  grancasa: 'grancasa',
  puertoVenecia: 'puerto venecia',
};

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const CINEMAS_URL = `${config.baseUrl}/cines/`;

/**
 * Get available cinemas for cinema schema tests based on current environment
 * Uses centralized cinema configuration from config/cinemas.config.ts
 */
export function getCinemasForSchemaTests(env?: string): CinemaConfig[] {
  return getCinemasForEnvironment(env);
}

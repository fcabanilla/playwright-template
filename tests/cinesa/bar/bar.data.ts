import {
  CinemaConfig,
  getCinemasForEnvironment,
} from '../../../config/cinemas.config';

/**
 * Get available cinemas for bar tests based on current environment
 * Uses centralized cinema configuration from config/cinemas.config.ts
 */
export function getCinemasForBarTests(env?: string): CinemaConfig[] {
  return getCinemasForEnvironment(env);
}

/**
 * Bar menu types available per cinema
 */
export interface BarMenuConfig {
  cinema: CinemaConfig;
  menuMethod: 'buyClassicMenuOasiz' | 'buyClassicMenuGrancasa';
  menuType: string;
}

/**
 * Get bar menu configurations for available cinemas
 */
export function getBarMenuConfigs(env?: string): BarMenuConfig[] {
  const cinemas = getCinemasForBarTests(env);

  return cinemas.map((cinema) => ({
    cinema,
    menuMethod:
      cinema.name === 'Oasiz'
        ? 'buyClassicMenuOasiz'
        : 'buyClassicMenuGrancasa',
    menuType: 'Classic',
  }));
}

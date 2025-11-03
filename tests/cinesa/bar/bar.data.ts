import { CinemaConfig } from '../seatPicker/seatPicker.data';

/**
 * Get available cinemas for bar tests based on current environment
 * Grancasa is NOT available in preprod environment
 */
export function getCinemasForBarTests(env?: string): CinemaConfig[] {
  const currentEnv = env || process.env.TEST_ENV || 'production';

  const AVAILABLE_CINEMAS: CinemaConfig[] = [
    {
      name: 'Oasiz',
      selectMethod: 'selectOasizCinema',
      tags: ['@oasiz'],
      availableInEnvironments: ['production', 'lab', 'preprod'],
    },
    {
      name: 'Grancasa',
      selectMethod: 'selectGrancasaCinema',
      tags: ['@grancasa'],
      availableInEnvironments: ['production', 'lab'], // NOT in preprod
    },
  ];

  return AVAILABLE_CINEMAS.filter((cinema) =>
    cinema.availableInEnvironments.includes(currentEnv)
  );
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

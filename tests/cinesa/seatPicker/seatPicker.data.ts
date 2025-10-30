export interface LegendData {
  expectedLegendItems: string[];
}

export interface SeatData {
  seatIdentifier: string;
  expectedState: boolean;
  seatType: 'normal' | 'vip' | 'wheelchair';
}

export const seatTestData: SeatData[] = [
  { seatIdentifier: 'A1', expectedState: true, seatType: 'normal' },
  // { seatIdentifier: 'B2', expectedState: false, seatType: 'vip' },
  // ...otros casos...
];

export const legendData: LegendData = {
  expectedLegendItems: [
    'Seleccionada',
    'No disponible',
    'VIP',
    'Espacio Silla Ruedas',
    'Acompañante',
    'Bloqueada',
  ],
};

/**
 * Cinema configuration for parametrized tests
 */
export interface CinemaConfig {
  name: string;
  selectMethod: 'selectOasizCinema' | 'selectGrancasaCinema';
  tags: string[];
  availableInEnvironments: string[]; // ['production', 'lab', 'preprod']
}

/**
 * Available cinemas for testing
 * Note: Grancasa is not available in preprod environment
 */
export const AVAILABLE_CINEMAS: CinemaConfig[] = [
  {
    name: 'Oasiz',
    selectMethod: 'selectOasizCinema',
    tags: ['@oasiz'],
    availableInEnvironments: ['production', 'lab', 'preprod'],
  },
  {
    name: 'Grancasa',
    selectMethod: 'selectGrancasaCinema',
    tags: ['@grancasa', '@skip-no-programming'],
    availableInEnvironments: ['production', 'lab'], // Not available in preprod
  },
];

/**
 * Get cinemas available for current environment
 */
export function getCinemasForEnvironment(env?: string): CinemaConfig[] {
  const currentEnv = env || process.env.TEST_ENV || 'production';
  return AVAILABLE_CINEMAS.filter((cinema) =>
    cinema.availableInEnvironments.includes(currentEnv)
  );
}

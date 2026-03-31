/**
 * Centralized Cinema Configuration
 *
 * Single source of truth for cinema availability across different environments.
 * All test files should import from here instead of duplicating the configuration.
 */

/**
 * Cinema configuration for parametrized tests
 */
export interface CinemaConfig {
  name: string;
  selectMethod:
    | 'selectOasizCinema'
    | 'selectGrancasaCinema'
    | 'selectPuertoVeneciaCinema'; // Extend as needed
  tags: string[];
  availableInEnvironments: string[]; // ['production', 'lab', 'preprod']
  isDefault?: boolean;
}

/**
 * Available cinemas for testing
 *
 * @important Grancasa is NOT available in preprod environment
 *
 * When adding a new cinema:
 * 1. Add the cinema configuration to this array
 * 2. Ensure the selectMethod matches the method name in Cinema page object
 * 3. Add appropriate tags for test filtering
 * 4. Specify which environments the cinema is available in
 */
export const AVAILABLE_CINEMAS: CinemaConfig[] = [
  {
    name: 'Oasiz',
    selectMethod: 'selectOasizCinema',
    tags: ['@oasiz'],
    availableInEnvironments: ['production', 'lab', 'preprod'],
    isDefault: true,
  },
  // Grancasa removed as per requirement (TIM-1260 / user request)
  // {
  //   name: 'Grancasa',
  //   selectMethod: 'selectGrancasaCinema',
  //   tags: ['@grancasa'],
  //   availableInEnvironments: ['production', 'lab'], // NOT in preprod
  // },
  // Puerto Venecia Cinema — removed from lab (only Oasiz is available in lab)
  // {
  //   name: 'Puerto Venecia',
  //   selectMethod: 'selectPuertoVeneciaCinema',
  //   tags: ['@puerto-venecia'],
  //   availableInEnvironments: ['production'],
  // },
];

/**
 * Get cinemas available for current environment
 *
 * @param env - Optional environment override. Defaults to TEST_ENV or 'production'
 * @returns Array of cinema configurations available in the specified environment
 *
 * @example
 * ```typescript
 * // Get cinemas for current environment
 * const CINEMAS = getCinemasForEnvironment();
 *
 * // Get cinemas for specific environment
 * const preprodCinemas = getCinemasForEnvironment('preprod'); // Returns only Oasiz
 * const prodCinemas = getCinemasForEnvironment('production'); // Returns Oasiz + Grancasa
 * ```
 */
export function getCinemasForEnvironment(env?: string): CinemaConfig[] {
  const currentEnv = env || process.env.TEST_ENV || 'production';
  return AVAILABLE_CINEMAS.filter((cinema) =>
    cinema.availableInEnvironments.includes(currentEnv)
  );
}

/**
 * Get the default cinema to use for tests that don't need parametrized runs
 * (e.g. smoke tests or single-run checks)
 *
 * @param env - Optional environment override. Defaults to TEST_ENV or 'production'
 * @returns The default cinema config for the environment
 * @throws Error if no cinemas are available in the environment
 */
export function getDefaultCinema(env?: string): CinemaConfig {
  const availableCinemas = getCinemasForEnvironment(env);

  if (availableCinemas.length === 0) {
    const currentEnv = env || process.env.TEST_ENV || 'production';
    throw new Error(
      `No cinemas available for environment: ${currentEnv}. Check your configuration. Ensure cinemas are configured in config/cinemas.config.ts`
    );
  }

  // Try to find one marked as default, otherwise return the first one
  const defaultCinema = availableCinemas.find((c) => c.isDefault);
  return defaultCinema ?? availableCinemas[0];
}

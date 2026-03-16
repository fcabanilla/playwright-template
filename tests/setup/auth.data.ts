/**
 * Auth Setup Data
 *
 * Configurations for generating storageState files with cookie consent.
 * Used by auth.setup.ts to accept OneTrust banners before main test execution.
 *
 * @see tests/setup/auth.setup.ts
 * @since 1.0.0
 */

import {
  getCinesaConfig,
  getUCIConfig,
  CinesaEnvironment,
  UCIEnvironment,
} from '../../config/environments';

/**
 * Configuration for a single auth setup operation
 */
export interface AuthSetupConfig {
  /** Platform identifier */
  platform: 'cinesa' | 'uci';

  /** Environment identifier */
  environment: string;

  /** Base URL to navigate */
  baseUrl: string;

  /** Output path for storageState file */
  outputPath: string;

  /** Browser locale */
  locale: string;

  /** Region code (es, it, pt) */
  region: string;
}

/**
 * Get auth setup configurations based on TEST_ENV and active project.
 *
 * **Smart Detection:**
 * - If running specific project (e.g., --project=Cinesa), only generates for that platform
 * - If running all projects, generates for all platforms
 *
 * @returns {AuthSetupConfig[]} Array of configurations to process
 *
 * @example
 * ```bash
 * # Only generates Cinesa storageState
 * npx playwright test --project=Cinesa
 *
 * # Only generates UCI storageState
 * npx playwright test --project=UCI
 *
 * # Generates all storageStates
 * npx playwright test
 * ```
 */
export function getAuthSetupConfigs(): AuthSetupConfig[] {
  const env =
    (process.env.TEST_ENV as CinesaEnvironment | UCIEnvironment) ||
    'production';

  // Detect which project is being run by checking test path or CLI args
  const testPath = process.argv.join(' ');
  const isCinesaOnly =
    testPath.includes('tests/cinesa') ||
    testPath.includes('--project=Cinesa') ||
    testPath.includes("--project='Cinesa'");
  const isUCIOnly =
    testPath.includes('tests/uci') ||
    testPath.includes('--project=UCI') ||
    testPath.includes("--project='UCI'");

  const configs: AuthSetupConfig[] = [];

  // Cinesa configurations - only if needed
  if (!isUCIOnly) {
    try {
      const cinesaConfig = getCinesaConfig(env as CinesaEnvironment);
      configs.push({
        platform: 'cinesa',
        environment: env,
        baseUrl: cinesaConfig.baseUrl,
        outputPath: `state/consented.${env}.${cinesaConfig.region || 'es'}.json`,
        locale: cinesaConfig.locale || 'es-ES',
        region: cinesaConfig.region || 'es',
      });
    } catch (error) {
      console.warn(`⚠️  Skipping Cinesa setup for env=${env} (not configured)`);
    }
  }

  // UCI configurations - only if needed
  if (!isCinesaOnly && configs.length === 0) {
    try {
      const uciConfig = getUCIConfig(env as UCIEnvironment);
      configs.push({
        platform: 'uci',
        environment: env,
        baseUrl: uciConfig.baseUrl,
        outputPath: `state/consented.${env}.${uciConfig.region || 'it'}.json`,
        locale: uciConfig.locale || 'it-IT',
        region: uciConfig.region || 'it',
      });
    } catch (error) {
      console.warn(`⚠️  Skipping UCI setup for env=${env} (not configured)`);
    }
  }

  return configs;
}

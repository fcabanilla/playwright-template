/**
 * Environment configuration for both Cinesa and UCI namespaces.
 * This file centralizes all URLs and environment-specific settings.
 */

export interface EnvironmentConfig {
  /** Base URL for the website */
  baseUrl: string;
  /** API endpoints if any */
  apiBaseUrl?: string;
  /** Region/locale identifier (es, pt, it) */
  region?: string;
  /** Locale for the environment (es-ES, pt-PT, it-IT) */
  locale?: string;
  /** Timeout configurations */
  timeouts: {
    /** Default timeout for page loads */
    pageLoad: number;
    /** Default timeout for element interactions */
    element: number;
    /** Timeout for modal handling */
    modal: number;
  };
  /** Feature flags */
  features: {
    /** Whether analytics tracking is enabled */
    analytics: boolean;
    /** Whether promotional modals are expected */
    promotionalModals: boolean;
    /** Whether GDPR cookie banners are present */
    cookieBanners: boolean;
  };
}

/**
 * Cinesa environment configurations (España + Portugal)
 */
export const cinesaEnvironments = {
  // España - Environments
  production: {
    baseUrl: 'https://www.cinesa.es',
    region: 'es',
    locale: 'es-ES',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: true,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  staging: {
    baseUrl: 'https://stage-web.ocgtest.es',
    region: 'es',
    locale: 'es-ES',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  preprod: {
    baseUrl: 'https://preprod-web.ocgtest.es',
    region: 'es',
    locale: 'es-ES',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  lab: {
    baseUrl: 'https://lab-web.ocgtest.es',
    region: 'es',
    locale: 'es-ES',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  development: {
    baseUrl: 'https://dev.cinesa.es',
    region: 'es',
    locale: 'es-ES',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: false,
      cookieBanners: true,
    },
  },
  // Portugal - Environments
  'production-pt': {
    baseUrl: 'https://www.ucicinemas.pt',
    region: 'pt',
    locale: 'pt-PT',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: true,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  'preprod-pt': {
    baseUrl: 'https://preprod-web.ocgtest.pt',
    region: 'pt',
    locale: 'pt-PT',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  'lab-pt': {
    baseUrl: 'https://lab-web.cinesa.pt',
    region: 'pt',
    locale: 'pt-PT',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
} as const satisfies Record<string, EnvironmentConfig>;

/**
 * UCI environment configurations
 */
export const uciEnvironments = {
  production: {
    baseUrl: 'https://ucicinemas.it',
    region: 'it',
    locale: 'it-IT',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: true,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  staging: {
    baseUrl: 'https://staging.ucicinemas.it',
    region: 'it',
    locale: 'it-IT',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  development: {
    baseUrl: 'https://dev.ucicinemas.it',
    region: 'it',
    locale: 'it-IT',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: false,
      cookieBanners: true,
    },
  },
} as const satisfies Record<string, EnvironmentConfig>;

/**
 * Type definitions for environment names
 */
export type CinesaEnvironment = keyof typeof cinesaEnvironments;
export type UCIEnvironment = keyof typeof uciEnvironments;
export type Environment = CinesaEnvironment | UCIEnvironment;

/**
 * Region types
 */
export type Region = 'es' | 'pt' | 'it';

/**
 * Extracts region from environment name
 * @example 'production-pt' -> 'pt', 'production' -> 'es', 'staging' -> 'it' (for UCI)
 */
export function getRegionFromEnvironment(
  env: Environment,
  namespace: 'cinesa' | 'uci'
): Region {
  if (namespace === 'uci') return 'it';

  // For Cinesa: extract region suffix from environment name
  if (env.endsWith('-pt')) return 'pt';
  return 'es'; // Default to Spain for Cinesa
}

/**
 * Gets the current environment from environment variables or defaults to production
 */
export function getCurrentEnvironment(): Environment {
  return (process.env.TEST_ENV as Environment) || 'production';
}

/**
 * Gets configuration for Cinesa based on environment
 */
export function getCinesaConfig(env?: CinesaEnvironment): EnvironmentConfig {
  const environment = env || getCurrentEnvironment();
  return (
    cinesaEnvironments[environment as CinesaEnvironment] ||
    cinesaEnvironments.production
  );
}

/**
 * Gets configuration for UCI based on environment
 */
export function getUCIConfig(env?: UCIEnvironment): EnvironmentConfig {
  const environment = env || getCurrentEnvironment();
  return (
    uciEnvironments[environment as UCIEnvironment] || uciEnvironments.production
  );
}

/**
 * Runtime configuration override support
 * Allows overriding URLs via environment variables at runtime
 */
export function getConfigWithOverrides(
  baseConfig: EnvironmentConfig,
  namespace: 'cinesa' | 'uci'
): EnvironmentConfig {
  const envVarPrefix = namespace.toUpperCase();

  return {
    ...baseConfig,
    baseUrl: process.env[`${envVarPrefix}_BASE_URL`] || baseConfig.baseUrl,
    apiBaseUrl: process.env[`${envVarPrefix}_API_URL`] || baseConfig.apiBaseUrl,
    timeouts: {
      pageLoad:
        parseInt(process.env[`${envVarPrefix}_TIMEOUT_PAGE`] || '') ||
        baseConfig.timeouts.pageLoad,
      element:
        parseInt(process.env[`${envVarPrefix}_TIMEOUT_ELEMENT`] || '') ||
        baseConfig.timeouts.element,
      modal:
        parseInt(process.env[`${envVarPrefix}_TIMEOUT_MODAL`] || '') ||
        baseConfig.timeouts.modal,
    },
    features: {
      analytics:
        process.env[`${envVarPrefix}_FEATURE_ANALYTICS`] === 'true' ||
        baseConfig.features.analytics,
      promotionalModals:
        process.env[`${envVarPrefix}_FEATURE_MODALS`] === 'true' ||
        baseConfig.features.promotionalModals,
      cookieBanners:
        process.env[`${envVarPrefix}_FEATURE_COOKIES`] === 'true' ||
        baseConfig.features.cookieBanners,
    },
  };
}

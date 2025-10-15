/**
 * Environment configuration for both Cinesa and UCI namespaces.
 * This file centralizes all URLs and environment-specific settings.
 */

export interface EnvironmentConfig {
  /** Base URL for the website */
  baseUrl: string;
  /** API endpoints if any */
  apiBaseUrl?: string;
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
 * Cinesa environment configurations
 */
export const cinesaEnvironments = {
  production: {
    baseUrl: 'https://www.cinesa.es',
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
    baseUrl: 'https://staging.cinesa.es',
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
 * UCI environment configurations
 */
export const uciEnvironments = {
  production: {
    baseUrl: 'https://ucicinemas.it',
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

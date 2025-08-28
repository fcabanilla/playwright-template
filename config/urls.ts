/**
 * URL configurations and navigation paths for both Cinesa and UCI namespaces.
 * This centralizes all navigation URLs and makes them easily configurable.
 */

import {
  getCinesaConfig,
  getUCIConfig,
  getConfigWithOverrides,
} from './environments';

/**
 * Interface for navigation URLs structure
 */
export interface NavigationUrls {
  /** Base URL */
  base: string;
  /** Main navigation sections */
  navigation: {
    cinemas: string;
    movies: string;
    promotions: string;
    experiences: string;
    membership: string;
    eShop?: string;
    blog?: string;
  };
  /** Footer links */
  footer: {
    about: string;
    careers: string;
    contact: string;
    privacy: string;
    terms: string;
    transparency?: string;
  };
  /** Authentication related URLs */
  auth: {
    signIn: string;
    signUp: string;
    forgotPassword: string;
  };
  /** App download links */
  apps: {
    android: string;
    ios: string;
  };
  /** Social media links */
  social: {
    facebook: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

/**
 * Generates Cinesa navigation URLs based on configuration
 */
export function getCinesaUrls(): NavigationUrls {
  const config = getConfigWithOverrides(getCinesaConfig(), 'cinesa');
  const baseUrl = config.baseUrl;

  return {
    base: baseUrl,
    navigation: {
      cinemas: `${baseUrl}/cines`,
      movies: `${baseUrl}/cartelera`,
      promotions: `${baseUrl}/promociones`,
      experiences: `${baseUrl}/experiencias`,
      membership: `${baseUrl}/unlimited`,
      blog: `${baseUrl}/blog`,
    },
    footer: {
      about: `${baseUrl}/quienes-somos/`,
      careers: 'https://cinesa-uci.jobtrain.co.uk/cinesajobs/Home/Job',
      contact: `${baseUrl}/contacto`,
      privacy: `${baseUrl}/privacy`,
      terms: `${baseUrl}/terminos`,
      transparency: `${baseUrl}/quienes-somos/transparencia/`,
    },
    auth: {
      signIn: `${baseUrl}/login`,
      signUp: `${baseUrl}/registro`,
      forgotPassword: `${baseUrl}/recuperar-password`,
    },
    apps: {
      android:
        'https://play.google.com/store/apps/details?id=nz.co.vista.android.movie.cinesa',
      ios: 'https://apps.apple.com/es/app/cinesa-app/id6444631578?l=ca',
    },
    social: {
      facebook: 'https://www.facebook.com/cinesa.es',
      twitter: 'https://twitter.com/cinesa_es',
      instagram: 'https://www.instagram.com/cinesa_es',
      youtube: 'https://www.youtube.com/user/CinesaEspana',
    },
  };
}

/**
 * Generates UCI navigation URLs based on configuration
 */
export function getUCIUrls(): NavigationUrls {
  const config = getConfigWithOverrides(getUCIConfig(), 'uci');
  const baseUrl = config.baseUrl;

  return {
    base: baseUrl,
    navigation: {
      cinemas: `${baseUrl}/cinema`,
      movies: `${baseUrl}/film`,
      promotions: `${baseUrl}/offerte`,
      experiences: `${baseUrl}/esperienze`,
      membership: `${baseUrl}/membership`,
      eShop: `${baseUrl}/e-shop`,
    },
    footer: {
      about: `${baseUrl}/chi-siamo`,
      careers: `${baseUrl}/lavora-con-noi`,
      contact: `${baseUrl}/contatti`,
      privacy: `${baseUrl}/privacy`,
      terms: `${baseUrl}/termini`,
    },
    auth: {
      signIn: `${baseUrl}/accedi`,
      signUp: `${baseUrl}/registrati`,
      forgotPassword: `${baseUrl}/recupera-password`,
    },
    apps: {
      android: 'https://play.google.com/store/apps/details?id=com.uci.cinemas',
      ios: 'https://apps.apple.com/it/app/uci-cinemas/id123456789',
    },
    social: {
      facebook: 'https://www.facebook.com/ucicinemas.it',
      instagram: 'https://www.instagram.com/ucicinemas_it',
    },
  };
}

/**
 * Helper function to get URLs by namespace
 */
export function getUrlsByNamespace(
  namespace: 'cinesa' | 'uci'
): NavigationUrls {
  return namespace === 'cinesa' ? getCinesaUrls() : getUCIUrls();
}

/**
 * Type guards for URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper to build dynamic URLs with parameters
 */
export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string>
): string {
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

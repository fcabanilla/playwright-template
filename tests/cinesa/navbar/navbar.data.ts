import { NavbarSelectors } from '../../../pageObjectsManagers/cinesa/navbar/navbar.selectors';
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

// Interface to represent a navigation element and its expected URL
export interface NavItem {
  selectorKey: keyof NavbarSelectors;
  expectedUrl: string;
}

// Get the current environment configuration
const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const cleanBaseUrl = config.baseUrl.endsWith('/')
  ? config.baseUrl.slice(0, -1)
  : config.baseUrl;

// Base URL of the site (dynamic based on environment)
export const baseUrl = cleanBaseUrl;

// Internal navigation elements (dynamic URLs based on environment)
export const internalNavItems: NavItem[] = [
  { selectorKey: 'cines', expectedUrl: `${cleanBaseUrl}/cines/` },
  { selectorKey: 'peliculas', expectedUrl: `${cleanBaseUrl}/peliculas/` },
  { selectorKey: 'promociones', expectedUrl: `${cleanBaseUrl}/promociones/` },
  { selectorKey: 'experiencias', expectedUrl: `${cleanBaseUrl}/experiencias/` },
  { selectorKey: 'programas', expectedUrl: `${cleanBaseUrl}/programas/` },
];

// External navigation element
export const externalNavItem: NavItem = {
  selectorKey: 'bonos',
  expectedUrl: 'https://www.cinesabusiness.es/promociones.html',
};

// Function to get navbar data (returns dynamic values based on current environment)
export function getNavbarData() {
  return {
    baseUrl,
    internalNavItems,
    externalNavItem,
  };
}

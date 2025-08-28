import { NavbarSelectors } from '../../../pageObjectsManagers/uci/navbar/navbar.selectors';
import { getUCIUrls } from '../../../config/urls';

// Interface for representing a navigation element and its expected URL
export interface NavItem {
  selectorKey: keyof NavbarSelectors;
  expectedUrl: string;
  displayName: string;
}

// Get URLs from centralized configuration
const urls = getUCIUrls();

// Base URL for UCI Cinemas
export const baseUrl = urls.base;

// Internal navigation items that should always be present
export const internalNavItems = [
  'Cinema',
  'Film',
  'Offerte',
  'Esperienze',
  'Membership',
  'e-Shop',
] as const;

// External navigation items (sign in button, etc.)
export const externalNavItems = ['Accedi'] as const;

// All navigation items combined
export const allNavItems = [...internalNavItems, ...externalNavItems] as const;

// Specific URLs for navigation tests
export const testUrls = {
  home: baseUrl,
  cinema: urls.navigation.cinemas,
  film: urls.navigation.movies,
  offerte: urls.navigation.promotions,
  esperienze: urls.navigation.experiences,
  membership: urls.navigation.membership,
  eShop: urls.navigation.eShop!,
} as const;

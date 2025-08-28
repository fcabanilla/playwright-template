import { NavbarSelectors } from '../../../pageObjectsManagers/uci/navbar/navbar.selectors';

// Interface for representing a navigation element and its expected URL
export interface NavItem {
  selectorKey: keyof NavbarSelectors;
  expectedUrl: string;
  displayName: string;
}

// Base site URL
export const baseUrl = 'https://ucicinemas.it';

// UCI internal navigation elements
export const internalNavItems: NavItem[] = [
  {
    selectorKey: 'cinemas',
    expectedUrl: `${baseUrl}/cinema`,
    displayName: 'Cinema',
  },
  {
    selectorKey: 'movies',
    expectedUrl: `${baseUrl}/film`,
    displayName: 'Film',
  },
  {
    selectorKey: 'experiences',
    expectedUrl: `${baseUrl}/esperienze`,
    displayName: 'Esperienze',
  },
  {
    selectorKey: 'membership',
    expectedUrl: `${baseUrl}/membership`,
    displayName: 'Membership',
  },
];

// Specific URLs for navigation tests
export const testUrls = {
  home: baseUrl,
  cinema: `${baseUrl}/cinema`,
  film: `${baseUrl}/film`,
  esperienze: `${baseUrl}/esperienze`,
  membership: `${baseUrl}/membership`,
} as const;

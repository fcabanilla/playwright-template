/**
 * My Account test data
 * Following architectural pattern from copilot-instructions.md
 */

import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';
import { cinesaTestAccounts } from '../../../config/testAccounts';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

/**
 * Test account configurations
 */
export const testAccounts = {
  // No-membership account (basic user without loyalty/unlimited)
  // LAB environment: fcabanilla+lab-basic@cinesa.es
  noMembership: cinesaTestAccounts.valid.noMembership,

  // Loyalty member (with loyalty program)
  loyaltyMember: cinesaTestAccounts.valid.loyalty,
};

/**
 * My Account URLs
 */
export const myAccountUrls = {
  overview: `${config.baseUrl}/mycinesa/`,
  profile: `${config.baseUrl}/mycinesa/mi-perfil/`,
  preferences: `${config.baseUrl}/mycinesa/preferencias/`,
  bookings: `${config.baseUrl}/mycinesa/mis-entradas/`,
  offers: `${config.baseUrl}/mycinesa/ofertas/`,
  achievements: `${config.baseUrl}/mycinesa/logros/`,
  help: `${config.baseUrl}/mycinesa/ayuda/`,
};

/**
 * Expected navigation cards for My Account overview
 * COMS-11711: Member's area display and layout
 */
export const expectedNavigationCards = {
  bookings: 'Mis entradas',
  offers: 'Ofertas',
  achievements: 'Logros',
  help: 'Ayuda',
} as const;

/**
 * Manual test case references
 */
export const manualTestCases = {
  COMS_6033: 'Overview display and layout',
  COMS_11711: "Member's area display and layout",
  OCG_2454: 'Dashboard watched films total matches loyalty balance',
  OCG_3356: 'Verify BBVA modal not displayed after signup',
} as const;

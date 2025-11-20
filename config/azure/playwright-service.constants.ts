/**
 * Microsoft Playwright Testing Service - Essential Constants Only
 */

export const PLAYWRIGHT_WORKSPACE = {
  id: '9a9f6272-8172-4490-a5c6-156fc12ff7da',
  region: 'westeurope'
} as const;

export function getBrowserEndpoint(): string {
  return `wss://westeurope.api.playwright.microsoft.com/playwrightworkspaces/${PLAYWRIGHT_WORKSPACE.id}/browsers`;
}

export function getApiBaseUrl(): string {
  return `https://westeurope.api.playwright.microsoft.com/playwrightworkspaces/${PLAYWRIGHT_WORKSPACE.id}`;
}
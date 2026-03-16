/**
 * Microsoft Playwright Testing Service Configuration
 * 
 * This configuration enables:
 * - Cloud-based test execution
 * - Online reporting via Playwright portal
 * - Parallel execution across multiple browsers
 * - Team collaboration through shared reports
 */

export interface PlaywrightServiceConfig {
  /** Base API endpoint for Playwright Testing Service */
  baseEndpoint: string;
  
  /** WebSocket endpoint for browser connections */
  browserEndpoint: string;
  
  /** Service workspace ID */
  workspaceId: string;
  
  /** Azure region */
  region: string;
  
  /** Whether service is enabled */
  enabled: boolean;
}

/** Production Playwright Testing Service Configuration */
export const playwrightServiceConfig: PlaywrightServiceConfig = {
  baseEndpoint: 'https://westeurope.api.playwright.microsoft.com/playwrightworkspaces/9a9f6272-8172-4490-a5c6-156fc12ff7da',
  browserEndpoint: 'wss://westeurope.api.playwright.microsoft.com/playwrightworkspaces/9a9f6272-8172-4490-a5c6-156fc12ff7da/browsers',
  workspaceId: '9a9f6272-8172-4490-a5c6-156fc12ff7da',
  region: 'westeurope',
  enabled: process.env.USE_PLAYWRIGHT_SERVICE === 'true'
};

/** Check if Playwright Testing Service should be used */
export function shouldUsePlaywrightService(): boolean {
  return playwrightServiceConfig.enabled && 
         !!process.env.PLAYWRIGHT_SERVICE_URL;
}

/** Get service URL for connection */
export function getServiceUrl(): string | undefined {
  if (!shouldUsePlaywrightService()) {
    return undefined;
  }
  
  return playwrightServiceConfig.browserEndpoint;
}

/** Get access token for authentication */
export function getAccessToken(): string | undefined {
  return process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN;
}

/** Get connection options with authentication */
export function getServiceConnectionOptions() {
  if (!shouldUsePlaywrightService() || !getServiceUrl()) {
    return undefined;
  }

  // Add required parameters to the URL
  const baseUrl = getServiceUrl()!;
  const url = new URL(baseUrl);
  
  // Required query parameters for Microsoft Playwright Testing
  url.searchParams.set('os', 'Windows'); // Operating system
  url.searchParams.set('runId', `test-run-${Date.now()}`); // Unique run identifier
  
  const options: any = {
    wsEndpoint: url.toString(),
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    options.headers = {
      'Authorization': `Bearer ${accessToken}`,
    };
  }

  return options;
}
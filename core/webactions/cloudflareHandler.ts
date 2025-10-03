import { Page } from '@playwright/test';
import type { Browser, BrowserContext } from '@playwright/test';

// Generic utility to bypass Cloudflare and restore session
export async function bypassCloudflareAndRestoreSession(
  browser: Browser,
  storageStatePath: string,
  url: string
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ storageState: storageStatePath });
  const page = await context.newPage();
  await page.goto(url);
  return { context, page };
}

// Placeholder class for future advanced Cloudflare utilities
export class CloudflareHandler {
  // @ts-expect-error - page will be used when implementing setupAntiDetection() and navigateWithCloudflareHandling()
  constructor(private page: Page) {}
}

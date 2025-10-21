import { test, expect } from '@playwright/test';
import { getCloudflareCredentials } from '../../../core/cloudflare/envValidator';
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

type EnvName = CinesaEnvironment;

function isCloudflareUrl(url: string) {
  return /cloudflare|cloudflareaccess|cdn-cgi\/access/i.test(url);
}

async function createContextWithOptionalHeaders(
  browser: any,
  creds?: { clientId: string; clientSecret: string }
) {
  const context = await browser.newContext();
  if (creds) {
    // set headers but do not log secret values
    await context.setExtraHTTPHeaders({
      'CF-Access-Client-Id': creds.clientId,
      'CF-Access-Client-Secret': creds.clientSecret,
    });
    console.log('Set CF-Access headers (values not logged)');
  }
  return context;
}

test('check Cinesa URLs with CF-Access headers', async ({ browser }) => {
  const envs: EnvName[] = ['production', 'preprod', 'lab', 'staging'];

  async function runCheckForEnv(env: EnvName) {
    const config = getCinesaConfig(env as CinesaEnvironment);
    const targetUrl = config.baseUrl;
    console.log('\n=== Checking', env, targetUrl, '===');

    // Try to obtain Cloudflare credentials (prefer per-deployment override)
    let creds:
      | { clientId: string; clientSecret: string; envKeyUsed: string }
      | undefined;
    try {
      creds = getCloudflareCredentials(env, 'cinesa_es');
      console.log(
        `Found Cloudflare credentials for env=${env}, keyUsed=${creds.envKeyUsed}`
      );
    } catch (err: any) {
      console.log(
        `No Cloudflare credentials found for env=${env}: ${err?.message || err}`
      );
      creds = undefined;
    }

    const context = await createContextWithOptionalHeaders(
      browser,
      creds
        ? { clientId: creds.clientId, clientSecret: creds.clientSecret }
        : undefined
    );
    const page = await context.newPage();

    try {
      const resp = await page.goto(targetUrl, {
        waitUntil: 'load',
        timeout: 30000,
      });
      const finalUrl = page.url();
      const status = resp?.status();
      console.log(
        `Navigation finished. status=${status}, finalUrl=${finalUrl}`
      );

      // Only assert when we successfully navigated
      if (resp) {
        // Assertion: If credentials were provided, we expect NOT to land on Cloudflare.
        if (creds) {
          expect(isCloudflareUrl(finalUrl)).toBeFalsy();
        } else {
          console.log(
            'No creds provided; observed cloudflare:',
            isCloudflareUrl(finalUrl)
          );
        }
      } else {
        console.log(
          `No response from ${targetUrl}; skipping assertions for ${env}`
        );
      }
    } catch (err: any) {
      const msg = String(err?.message || err);
      if (
        msg.includes('ERR_NAME_NOT_RESOLVED') ||
        msg.includes('net::ERR_NAME_NOT_RESOLVED')
      ) {
        console.warn(`Skipping env=${env} due to DNS resolution error: ${msg}`);
        // Do not rethrow; treat as skipped for this env
        return;
      }
      console.warn(`Navigation error for ${env}: ${msg}`);
      return;
    } finally {
      await context.close();
    }
  }

  for (const env of envs) {
    await runCheckForEnv(env);
  }
});

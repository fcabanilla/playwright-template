import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { getCloudflareCredentials } from '../../../core/cloudflare/envValidator';
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

type EnvName = CinesaEnvironment;

function artifactDir() {
  const dir = path.join(process.cwd(), 'artifacts', 'cloudflare-check');
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    /* ignore */
  }
  return dir;
}

test('check Cinesa URLs with CF-Access headers', async ({ browser }) => {
  const envs: EnvName[] = [
    'production',
    'preprod',
    'lab',
    'staging',
    'development',
  ];

  for (const env of envs) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const runId = `${env}-${ts}`;
    const config = getCinesaConfig(env as CinesaEnvironment);
    const targetUrl = config.baseUrl;
    console.log('\n=== Checking', env, targetUrl, '===');

    // Try to obtain Cloudflare credentials (prefer per-deployment override)
    let creds;
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

    const context = await browser.newContext();
    const page = await context.newPage();

    // If creds present, set headers on context
    if (creds) {
      const headers: Record<string, string> = {
        'CF-Access-Client-Id': creds.clientId,
        'CF-Access-Client-Secret': creds.clientSecret,
      };
      // Log header keys only
      console.log(
        'Setting extra HTTP headers:',
        Object.keys(headers).join(', ')
      );
      await context.setExtraHTTPHeaders(headers);
    } else {
      console.log('No CF headers set for this run.');
    }

    let finalUrl = '';
    let status: number | undefined = undefined;
    try {
      const resp = await page.goto(targetUrl, {
        waitUntil: 'load',
        timeout: 30000,
      });
      finalUrl = page.url();
      status = resp?.status();
      console.log(
        `Navigation finished. status=${status}, finalUrl=${finalUrl}`
      );
    } catch (err: any) {
      console.log(`Navigation error for ${env}:`, err.message || err);
      // try to capture whatever is available
      try {
        finalUrl = page.url();
        console.log('page.url() after error:', finalUrl);
      } catch (e) {
        /* ignore */
      }
    }

    // Check for Cloudflare patterns in finalUrl
    const isCloudflare = /cloudflare|cloudflareaccess|cdn-cgi\/access/i.test(
      finalUrl
    );
    console.log(`isCloudflareDetected=${isCloudflare}`);

    // Save artifacts: screenshot and HTML
    const dir = artifactDir();
    const screenshotPath = path.join(dir, `check-${runId}.png`);
    const htmlPath = path.join(dir, `check-${runId}.html`);
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      const html = await page.content();
      fs.writeFileSync(htmlPath, html, { encoding: 'utf8' });
      console.log(`Saved artifacts: ${screenshotPath}, ${htmlPath}`);
    } catch (err) {
      console.log('Error saving artifacts:', err);
    }

    // Clean up context
    await context.close();
  }
});

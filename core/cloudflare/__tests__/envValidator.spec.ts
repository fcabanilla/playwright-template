import { test, expect } from '@playwright/test';
import * as envValidator from '../envValidator';

test.describe('Cloudflare envValidator', () => {
  const ORIGINAL_ENV = { ...process.env };

  let originalConsoleInfo: any;

  test.afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    if (originalConsoleInfo) console.info = originalConsoleInfo;
    process.env.CF_ACCESS_DEBUG = 'false';
  });

  test('returns credentials when per-environment variables present', () => {
    process.env['CF_ACCESS_CLIENT_ID_LAB'] = 'lab-id';
    process.env['CF_ACCESS_CLIENT_SECRET_LAB'] = 'lab-secret';
    process.env.CF_ACCESS_DEBUG = 'true';

    const logs: string[] = [];
    originalConsoleInfo = console.info;
    console.info = (m: string) => logs.push(m);

    const creds = envValidator.getCloudflareCredentials('lab');
    expect(creds.clientId).toBe('lab-id');
    expect(creds.clientSecret).toBe('lab-secret');
    expect(creds.envKeyUsed).toBe('CF_ACCESS_CLIENT_ID_LAB');
    // assert we logged lookup info
    expect(
      logs.some((l) => l.includes('lookup CF_ACCESS_CLIENT_ID'))
    ).toBeTruthy();
  });

  test('prefers deployment-specific variables over env ones', () => {
    process.env['CF_ACCESS_CLIENT_ID_LAB'] = 'lab-id';
    process.env['CF_ACCESS_CLIENT_SECRET_LAB'] = 'lab-secret';
    process.env['CF_ACCESS_CLIENT_ID_LAB_CINESA_ES'] = 'lab-cinesa-id';
    process.env['CF_ACCESS_CLIENT_SECRET_LAB_CINESA_ES'] = 'lab-cinesa-secret';
    process.env.CF_ACCESS_DEBUG = 'true';

    const logs: string[] = [];
    originalConsoleInfo = console.info;
    console.info = (m: string) => logs.push(m);

    const creds = envValidator.getCloudflareCredentials('lab', 'cinesa_es');
    expect(creds.clientId).toBe('lab-cinesa-id');
    expect(creds.clientSecret).toBe('lab-cinesa-secret');
    expect(creds.envKeyUsed).toBe('CF_ACCESS_CLIENT_ID_LAB_CINESA_ES');
    expect(logs.some((l) => l.includes('using keys'))).toBeTruthy();
  });

  test('throws clear error when missing variables', () => {
    delete process.env['CF_ACCESS_CLIENT_ID_LAB'];
    delete process.env['CF_ACCESS_CLIENT_SECRET_LAB'];
    process.env.CF_ACCESS_DEBUG = 'true';

    const logs: string[] = [];
    originalConsoleInfo = console.info;
    console.info = (m: string) => logs.push(m);

    expect(() => envValidator.getCloudflareCredentials('lab')).toThrowError(
      /Missing required Cloudflare Access environment variables/
    );
    expect(
      logs.some((l) =>
        l.includes('Missing required Cloudflare Access environment variables')
      )
    ).toBeTruthy();
  });
});

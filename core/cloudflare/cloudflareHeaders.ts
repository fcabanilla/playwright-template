export interface EnvVarMatch {
  key: string;
  value: string | undefined;
}

/**
 * Build extra HTTP headers for Cloudflare Access based on environment variables.
 * Lookup precedence:
 * 1) Per-deployment: CF_ACCESS_CLIENT_ID_<ENV>_<DEPLOYMENT>_* (any suffix)
 * 2) Per-environment: CF_ACCESS_CLIENT_ID_<ENV>
 * 3) Generic: CF_ACCESS_CLIENT_ID
 */
export function getCloudflareHeaders(
  env?: string
): Record<string, string> | undefined {
  const e = env || (process.env.TEST_ENV as string) || 'lab';

  const findVar = (baseName: string): EnvVarMatch | undefined => {
    // 1) per-deployment pattern: any env var that starts with `${baseName}_${e}_`
    for (const k of Object.keys(process.env)) {
      if (k.startsWith(`${baseName}_${e}_`)) {
        return { key: k, value: process.env[k] };
      }
    }

    // 2) per-environment
    const perEnv = `${baseName}_${e}`;
    if (process.env[perEnv]) return { key: perEnv, value: process.env[perEnv] };

    // 3) generic
    if (process.env[baseName])
      return { key: baseName, value: process.env[baseName] };

    return undefined;
  };

  const headers: Record<string, string> = {};
  const idVar = findVar('CF_ACCESS_CLIENT_ID');
  const secretVar = findVar('CF_ACCESS_CLIENT_SECRET');

  if (idVar && idVar.value) {
    headers['CF-Access-Client-Id'] = idVar.value as string;
  }
  if (secretVar && secretVar.value) {
    headers['CF-Access-Client-Secret'] = secretVar.value as string;
  }

  return Object.keys(headers).length ? headers : undefined;
}

export default getCloudflareHeaders;

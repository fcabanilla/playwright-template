import { CloudflareCredentials, CloudflareEnv, Deployment } from './types';

function buildKey(
  base: 'CF_ACCESS_CLIENT_ID' | 'CF_ACCESS_CLIENT_SECRET',
  env: CloudflareEnv,
  deployment?: Deployment
) {
  if (deployment)
    return `${base}_${env.toUpperCase()}_${deployment.toUpperCase()}`;
  return `${base}_${env.toUpperCase()}`;
}

function lookupSecret(
  base: 'CF_ACCESS_CLIENT_ID' | 'CF_ACCESS_CLIENT_SECRET',
  env: CloudflareEnv,
  deployment?: Deployment
) {
  const specificKey = buildKey(base, env, deployment);
  const envKey = buildKey(base, env);

  const specificPresent = !!process.env[specificKey];
  const envPresent = !!process.env[envKey];

  return {
    specific: { key: specificKey, present: specificPresent },
    env: { key: envKey, present: envPresent },
    value: specificPresent
      ? process.env[specificKey]
      : envPresent
        ? process.env[envKey]
        : undefined,
  };
}

type Logger = (msg: string) => void;

export function getCloudflareCredentials(
  env: CloudflareEnv,
  deployment?: Deployment,
  opts?: { logger?: Logger }
): CloudflareCredentials {
  if (!env) throw new Error('getCloudflareCredentials: env is required');

  const logger: Logger | undefined =
    opts?.logger ||
    (process.env.CF_ACCESS_DEBUG === 'true'
      ? (m: string) => console.info(`[CF-ACCESS] ${m}`)
      : undefined);

  const idLookup = lookupSecret('CF_ACCESS_CLIENT_ID', env, deployment);
  const secretLookup = lookupSecret('CF_ACCESS_CLIENT_SECRET', env, deployment);

  if (logger) {
    logger(
      `lookup CF_ACCESS_CLIENT_ID: tried ${idLookup.specific.key} (present=${idLookup.specific.present}), ${idLookup.env.key} (present=${idLookup.env.present})`
    );
    logger(
      `lookup CF_ACCESS_CLIENT_SECRET: tried ${secretLookup.specific.key} (present=${secretLookup.specific.present}), ${secretLookup.env.key} (present=${secretLookup.env.present})`
    );
  }

  if (!idLookup.value || !secretLookup.value) {
    const missing = [] as string[];
    if (!idLookup.value) missing.push(idLookup.env.key);
    if (!secretLookup.value) missing.push(secretLookup.env.key);
    const msg = `Missing required Cloudflare Access environment variables: ${missing.join(', ')}. Please provide them via your CI secret manager or local .env (see docs/adrs/0010-cloudflare-access-tokens.md)`;
    if (logger) logger(msg);
    throw new Error(msg);
  }

  const usedKey = idLookup.specific.present
    ? idLookup.specific.key
    : idLookup.env.key;
  if (logger)
    logger(
      `using keys: ${usedKey} (id) and ${secretLookup.specific.present ? secretLookup.specific.key : secretLookup.env.key} (secret)`
    );

  return {
    clientId: idLookup.value,
    clientSecret: secretLookup.value,
    envKeyUsed: usedKey,
  };
}

export function hasCloudflareCredentials(
  env: CloudflareEnv,
  deployment?: Deployment
): boolean {
  try {
    const creds = getCloudflareCredentials(env, deployment);
    return !!(creds.clientId && creds.clientSecret);
  } catch (e) {
    return false;
  }
}

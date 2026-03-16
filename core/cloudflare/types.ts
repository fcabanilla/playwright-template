export interface CloudflareCredentials {
  clientId: string;
  clientSecret: string;
  envKeyUsed: string; // the env var key that satisfied the lookup (for debugging, not secret)
}

export type CloudflareEnv = string;
export type Deployment = string;

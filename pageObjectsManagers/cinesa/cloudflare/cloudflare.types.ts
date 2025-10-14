/**
 * Cloudflare diagnosis types
 * Following architectural pattern: types in separate files
 */

export interface BrowserFingerprint {
  userAgent: string;
  platform: string;
  languages: string[];
  webdriver: boolean;
  plugins: number;
  url: string;
  title: string;
}

export interface CloudflareAnalysis {
  currentUrl: string;
  isCloudflare: boolean;
  isTargetDomain: boolean;
  fingerprint: BrowserFingerprint;
  isCorrectUserAgent: boolean;
}

export interface DiagnosticResult {
  status: 'success' | 'server-side-issue' | 'client-side-issue' | 'unknown';
  analysis: CloudflareAnalysis;
  conclusion: string;
  recommendations: string[];
}

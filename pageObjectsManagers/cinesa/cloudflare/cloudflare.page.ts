/**
 * Cloudflare Access Page Object
 * Follows architectural rules: uses WebActions ONLY, no direct page access
 */

import { WebActions } from '../../../core/webactions/webActions';
import { cloudflareSelectors } from './cloudflare.selectors';
import {
  BrowserFingerprint,
  CloudflareAnalysis,
  DiagnosticResult,
} from './cloudflare.types';
import {
  getTargetUrl,
  expectedUserAgent,
  cloudflareIdentifiers,
  diagnosticMessages,
} from '../../../tests/cinesa/cloudflare/cloudflare.data';

export class CloudflarePage {
  constructor(private readonly webActions: WebActions) {}
  private readonly selectors = cloudflareSelectors;

  /**
   * Navigate to target URL and analyze Cloudflare bypass
   */
  async navigateAndAnalyze(): Promise<CloudflareAnalysis> {
    const targetUrl = getTargetUrl();

    await this.webActions.navigateTo(targetUrl);
    await this.webActions.waitForLoad();

    const currentUrl = this.webActions.getCurrentUrl();
    const isCloudflare = currentUrl.includes(
      cloudflareIdentifiers.accessDomain
    );
    const targetDomain = new URL(targetUrl).hostname;
    const isTargetDomain = currentUrl.includes(targetDomain);

    const fingerprint = await this.getBrowserFingerprint();

    const isCorrectUserAgent = fingerprint.userAgent === expectedUserAgent;

    return {
      currentUrl,
      isCloudflare,
      isTargetDomain,
      fingerprint,
      isCorrectUserAgent,
    };
  }

  /**
   * Get browser fingerprint information
   * Uses WebActions evaluateScript for browser context evaluation
   */
  private async getBrowserFingerprint(): Promise<BrowserFingerprint> {
    return await this.webActions.evaluateScript(() => {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        languages: Array.from(navigator.languages),
        webdriver: !!navigator.webdriver,
        plugins: Array.from(navigator.plugins).length,
        url: window.location.href,
        title: document.title,
      };
    });
  }

  /**
   * Perform complete diagnostic analysis
   */
  async performDiagnostic(): Promise<DiagnosticResult> {
    const analysis = await this.navigateAndAnalyze();

    let status: DiagnosticResult['status'];
    let conclusion: string;
    let recommendations: string[];

    if (analysis.isTargetDomain && !analysis.isCloudflare) {
      status = 'success';
      conclusion = diagnosticMessages.success.conclusion;
      recommendations = [diagnosticMessages.success.recommendation];
    } else if (
      analysis.isCloudflare &&
      analysis.isCorrectUserAgent &&
      !analysis.fingerprint.webdriver
    ) {
      status = 'server-side-issue';
      conclusion = diagnosticMessages.serverSideIssue.conclusion;
      recommendations = [
        diagnosticMessages.serverSideIssue.rootCause,
        diagnosticMessages.serverSideIssue.action,
        diagnosticMessages.serverSideIssue.evidence,
      ];
    } else if (
      analysis.isCloudflare &&
      (!analysis.isCorrectUserAgent || analysis.fingerprint.webdriver)
    ) {
      status = 'client-side-issue';
      conclusion = diagnosticMessages.clientSideIssue.conclusion;
      recommendations = [];

      if (!analysis.isCorrectUserAgent) {
        recommendations.push(diagnosticMessages.clientSideIssue.userAgentFix);
      }
      if (analysis.fingerprint.webdriver) {
        recommendations.push(diagnosticMessages.clientSideIssue.webdriverFix);
      }
      recommendations.push(diagnosticMessages.clientSideIssue.action);
    } else {
      status = 'unknown';
      conclusion = diagnosticMessages.unknown.conclusion;
      recommendations = [diagnosticMessages.unknown.action];
    }

    return {
      status,
      analysis,
      conclusion,
      recommendations,
    };
  }

  /**
   * Check if page title indicates Cloudflare access
   */
  async isCloudflareAccessPage(): Promise<boolean> {
    const title = await this.webActions.getText(this.selectors.pageTitle);
    return title.includes(cloudflareIdentifiers.signInTitle);
  }
}

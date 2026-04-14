#!/usr/bin/env node

/**
 * Generates executor.json for Allure reports.
 * In CI (Azure DevOps), populates with build metadata and pipeline link.
 * Locally, generates a "Local Run" entry with machine info.
 *
 * Usage: node scripts/generate-executor.js
 * Runs automatically as part of `npm run report` chain.
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const RESULTS_DIR = path.resolve(__dirname, '..', '.allure', 'results');
const OUTPUT_FILE = path.join(RESULTS_DIR, 'executor.json');

function generateExecutor() {
  const isCI = Boolean(
    process.env.TF_BUILD || process.env.BUILD_BUILDID || process.env.CI
  );

  let executor;

  if (isCI && process.env.TF_BUILD) {
    // Azure DevOps
    const buildId = process.env.BUILD_BUILDID || 'unknown';
    const buildNumber = process.env.BUILD_BUILDNUMBER || buildId;
    const serverUri = process.env.SYSTEM_TEAMFOUNDATIONSERVERURI || '';
    const project = process.env.SYSTEM_TEAMPROJECT || '';
    const buildUri = `${serverUri}${project}/_build/results?buildId=${buildId}`;

    executor = {
      reportName: `Azure DevOps Build #${buildNumber}`,
      buildOrder: parseInt(buildId, 10) || 0,
      reportUrl: '',
      name: 'Azure DevOps',
      type: 'azure',
      buildName: `Build #${buildNumber}`,
      buildUrl: buildUri,
    };
  } else if (isCI) {
    // Generic CI (GitHub Actions, etc.)
    const runId = process.env.GITHUB_RUN_ID || process.env.BUILD_BUILDID || '0';
    const runNumber =
      process.env.GITHUB_RUN_NUMBER || process.env.BUILD_BUILDNUMBER || runId;
    const serverUrl = process.env.GITHUB_SERVER_URL || '';
    const repo = process.env.GITHUB_REPOSITORY || '';
    const buildUrl = serverUrl && repo ? `${serverUrl}/${repo}/actions/runs/${runId}` : '';

    executor = {
      reportName: `CI Build #${runNumber}`,
      buildOrder: parseInt(runId, 10) || 0,
      reportUrl: '',
      name: 'GitHub Actions',
      type: 'github',
      buildName: `Run #${runNumber}`,
      buildUrl: buildUrl,
    };
  } else {
    // Local execution
    executor = {
      reportName: `Local Run — ${os.hostname()}`,
      buildOrder: Date.now(),
      reportUrl: '',
      name: `Local (${os.userInfo().username}@${os.hostname()})`,
      type: 'github',
      buildName: `Local — ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
      buildUrl: '',
    };
  }

  // Ensure results directory exists
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(executor, null, 2));

  console.log(`[executor] Generated ${OUTPUT_FILE}`);
  console.log(`[executor] Type: ${executor.name} | Build: ${executor.buildName}`);
}

generateExecutor();

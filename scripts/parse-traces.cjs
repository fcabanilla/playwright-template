#!/usr/bin/env node
/**
 * Playwright Trace Parser
 *
 * Parses trace.zip files from .allure/playwright-artifacts/ and outputs
 * structured JSON summaries: action sequence, errors, network responses.
 *
 * Usage: node scripts/parse-traces.cjs [--dir <artifacts-dir>] [--filter <substring>]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const ARTIFACTS_DIR = process.argv.includes('--dir')
  ? process.argv[process.argv.indexOf('--dir') + 1]
  : path.join(__dirname, '..', '.allure', 'playwright-artifacts');

const FILTER = process.argv.includes('--filter')
  ? process.argv[process.argv.indexOf('--filter') + 1]
  : null;

function findTraceZips(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir)) {
    const traceZip = path.join(dir, entry, 'trace.zip');
    if (fs.existsSync(traceZip)) {
      if (!FILTER || entry.toLowerCase().includes(FILTER.toLowerCase())) {
        results.push({ dir: entry, path: traceZip });
      }
    }
  }
  return results;
}

function parseJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  return content
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function extractActionSummary(events) {
  const actions = [];
  const beforeEvents = new Map();

  for (const event of events) {
    if (event.type === 'before') {
      beforeEvents.set(event.callId, event);
      actions.push({
        callId: event.callId,
        apiName: event.apiName || event.method,
        params: summarizeParams(event.params),
        startTime: event.startTime,
        error: null,
        duration: null,
      });
    }
    if (event.type === 'after') {
      const action = actions.find((a) => a.callId === event.callId);
      if (action) {
        action.error = event.error ? event.error.message || event.error : null;
        action.duration = event.endTime
          ? event.endTime - (action.startTime || 0)
          : null;
      }
    }
  }
  return actions;
}

function summarizeParams(params) {
  if (!params) return {};
  const summary = {};
  if (params.url) summary.url = params.url;
  if (params.selector) summary.selector = truncate(params.selector, 120);
  if (params.text) summary.text = truncate(params.text, 80);
  if (params.value) summary.value = truncate(String(params.value), 80);
  if (params.expression) summary.expression = truncate(params.expression, 200);
  if (params.name) summary.name = params.name;
  if (params.timeout) summary.timeout = params.timeout;
  if (params.state) summary.state = params.state;
  return summary;
}

function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  return str.substring(0, maxLen) + '...';
}

function extractNetworkSummary(networkEvents) {
  const requests = [];
  for (const event of networkEvents) {
    if (event.type === 'resource-snapshot') {
      const req = event.snapshot?.request;
      const res = event.snapshot?.response;
      if (req) {
        const entry = {
          method: req.method,
          url: truncate(req.url, 200),
          status: res?.status || null,
          statusText: res?.statusText || null,
        };
        // Highlight non-2xx responses
        if (entry.status && (entry.status >= 400 || entry.status === 0)) {
          entry.flagged = true;
        }
        requests.push(entry);
      }
    }
  }
  return requests;
}

function extractErrors(actions) {
  return actions
    .filter((a) => a.error)
    .map((a) => ({
      action: a.apiName,
      params: a.params,
      error: a.error,
    }));
}

function extractLastActions(actions, count = 10) {
  return actions.slice(-count).map((a) => ({
    action: a.apiName,
    params: a.params,
    error: a.error,
    durationMs: a.duration ? Math.round(a.duration) : null,
  }));
}

function parseTrace(traceZip) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-'));
  try {
    execSync(`unzip -q -o "${traceZip}" -d "${tmpDir}"`, {
      stdio: 'pipe',
    });

    // Find .trace and .network files
    const files = fs.readdirSync(tmpDir);
    const traceFile = files.find((f) => f.endsWith('.trace'));
    const networkFile = files.find((f) => f.endsWith('.network'));

    const traceEvents = traceFile
      ? parseJsonl(path.join(tmpDir, traceFile))
      : [];
    const networkEvents = networkFile
      ? parseJsonl(path.join(tmpDir, networkFile))
      : [];

    const actions = extractActionSummary(traceEvents);
    const network = extractNetworkSummary(networkEvents);
    const errors = extractErrors(actions);
    const lastActions = extractLastActions(actions);
    const flaggedNetwork = network.filter((r) => r.flagged);

    return {
      totalActions: actions.length,
      totalNetworkRequests: network.length,
      errors,
      lastActions,
      flaggedNetworkRequests: flaggedNetwork,
      allActions: actions.map((a) => ({
        action: a.apiName,
        params: a.params,
        error: a.error,
      })),
      allFlaggedNetwork: flaggedNetwork,
    };
  } finally {
    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function main() {
  const traces = findTraceZips(ARTIFACTS_DIR);
  if (traces.length === 0) {
    console.error(`No trace.zip files found in ${ARTIFACTS_DIR}`);
    if (FILTER) console.error(`  (filter: "${FILTER}")`);
    process.exit(1);
  }

  console.log(`Found ${traces.length} trace(s) in ${ARTIFACTS_DIR}\n`);

  const results = {};

  for (const trace of traces) {
    console.log(`Parsing: ${trace.dir}`);
    try {
      const summary = parseTrace(trace.path);
      results[trace.dir] = {
        status: 'parsed',
        ...summary,
      };
      if (summary.errors.length > 0) {
        console.log(`  ❌ ${summary.errors.length} error(s):`);
        for (const err of summary.errors) {
          console.log(`     → ${err.action}: ${truncate(err.error, 150)}`);
        }
      } else {
        console.log(`  ✅ No errors found`);
      }
      if (summary.flaggedNetworkRequests.length > 0) {
        console.log(
          `  ⚠️  ${summary.flaggedNetworkRequests.length} flagged network request(s):`
        );
        for (const req of summary.flaggedNetworkRequests.slice(0, 5)) {
          console.log(`     → ${req.method} ${req.status} ${req.url}`);
        }
      }
    } catch (err) {
      results[trace.dir] = {
        status: 'error',
        message: err.message,
      };
      console.log(`  ⚠️ Parse error: ${err.message}`);
    }
    console.log('');
  }

  // Write full results to file
  const outputPath = path.join(
    __dirname,
    '..',
    '.allure',
    'trace-analysis.json'
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nFull results written to ${outputPath}`);
}

main();

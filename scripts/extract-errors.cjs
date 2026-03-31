// Temporary script to validate category regex patterns against real Allure results
const fs = require('fs');
const path = require('path');

// Proposed categories (order matters — first match wins)
const CATEGORIES = [
  {
    name: 'Network / Environment',
    matchedStatuses: ['failed', 'broken'],
    messageRegex: 'net::ERR_|ECONNRESET|ETIMEDOUT|ECONNREFUSED|socket hang up',
  },
  {
    name: 'Data / Content Availability',
    matchedStatuses: ['failed'],
    messageRegex: 'No D-BOX films|No suitable seats found|No .* found on the cinema',
  },
  {
    name: 'Test Timeouts',
    matchedStatuses: ['broken'],
    messageRegex: 'Test timeout of \\d+ms exceeded',
  },
  {
    name: 'UI: Interaction Timeouts',
    matchedStatuses: ['failed', 'broken'],
    messageRegex: 'Timeout \\d+ms exceeded',
  },
  {
    name: 'UI: Selectors / Strict Mode',
    matchedStatuses: ['failed', 'broken'],
    messageRegex: 'strict mode violation|resolved to \\d+ elements|detached from DOM',
  },
  {
    name: 'Infra / Browser',
    matchedStatuses: ['broken'],
    messageRegex: 'Target page, context or browser has been closed|Target closed|Context closed|browserType\\.launch',
  },
  {
    name: 'Product Defects',
    matchedStatuses: ['failed'],
  },
];

// Load all failed/broken results
const dir = '.allure/results';
const files = fs.readdirSync(dir).filter(f => f.endsWith('-result.json'));
const results = [];

for (const f of files) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (data.status === 'failed' || data.status === 'broken') {
      results.push({
        status: data.status,
        name: (data.name || '').substring(0, 80),
        message: (data.statusDetails && data.statusDetails.message) || '',
        trace: (data.statusDetails && data.statusDetails.trace) || '',
      });
    }
  } catch (e) { /* skip */ }
}

// Classify each result
const classification = {};
for (const cat of CATEGORIES) classification[cat.name] = [];

for (const r of results) {
  let matched = false;
  for (const cat of CATEGORIES) {
    if (!cat.matchedStatuses.includes(r.status)) continue;
    if (cat.messageRegex) {
      const re = new RegExp(cat.messageRegex);
      if (!re.test(r.message)) continue;
    }
    classification[cat.name].push(r.name);
    matched = true;
    break;
  }
  if (!matched) {
    console.log('UNCLASSIFIED:', r.status, '|', r.name, '|', r.message.substring(0, 120));
  }
}

// Print summary
console.log('\n=== CATEGORY CLASSIFICATION RESULTS ===\n');
for (const [name, tests] of Object.entries(classification)) {
  if (tests.length > 0) {
    console.log(`${name}: ${tests.length} tests`);
    for (const t of tests.slice(0, 5)) console.log(`  - ${t}`);
    if (tests.length > 5) console.log(`  ... and ${tests.length - 5} more`);
  }
}

const total = Object.values(classification).reduce((s, t) => s + t.length, 0);
console.log(`\nTotal classified: ${total}/${results.length}`);
console.log(`Unclassified: ${results.length - total}`);

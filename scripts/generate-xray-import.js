#!/usr/bin/env node
/**
 * Generates Xray Test Case Import from Allure test-cases
 * Reads from .allure/report/data/test-cases/ (consolidated test data)
 *
 * Usage: node scripts/generate-xray-import-v2.js
 * Output: xray-import.json + xray-import.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_CASES_DIR = path.join(
  __dirname,
  '..',
  '.allure',
  'report',
  'data',
  'test-cases'
);
const OUTPUT_JSON = path.join(__dirname, '..', 'xray-import.json');
const OUTPUT_CSV = path.join(__dirname, '..', 'xray-import.csv');

// Read all test case files
function readTestCases() {
  if (!fs.existsSync(TEST_CASES_DIR)) {
    throw new Error(
      `Directory not found: ${TEST_CASES_DIR}\nRun: npm run report`
    );
  }

  return fs
    .readdirSync(TEST_CASES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) =>
      JSON.parse(fs.readFileSync(path.join(TEST_CASES_DIR, f), 'utf8'))
    );
}

// Extract labels as object
function getLabels(testCase) {
  const labels = {};
  testCase.labels?.forEach((l) => (labels[l.name] = l.value));
  return labels;
}

// Extract JIRA keys
function getJiraKeys(testCase, labels) {
  const keys = new Set();
  const text = `${labels.story || ''} ${testCase.name || ''}`;
  const matches = text.match(/([A-Z]+-\d+)/g);
  matches?.forEach((k) => keys.add(k));
  return Array.from(keys);
}

// Convert steps to Xray format
function convertSteps(steps) {
  if (!steps || steps.length === 0) return [];

  const xraySteps = [];

  function processStep(step) {
    // Skip hooks
    if (step.name.match(/before|after|hook/i)) {
      step.steps?.forEach(processStep);
      return;
    }

    // Skip internal Playwright steps
    if (step.name.includes('locator.') || step.name.includes('page.')) {
      return;
    }

    // Process nested steps
    if (step.steps && step.steps.length > 0) {
      step.steps.forEach(processStep);
    } else {
      // Leaf step - add to xray
      const expected = extractExpected(step.name);
      xraySteps.push({
        action: step.name,
        data: '',
        expected: expected,
      });
    }
  }

  steps.forEach(processStep);
  return xraySteps;
}

// Extract expected result from step name
function extractExpected(stepName) {
  const lower = stepName.toLowerCase();

  // Assertions
  if (lower.includes('visible')) return 'Element should be visible';
  if (lower.includes('enabled')) return 'Element should be enabled';
  if (lower.includes('disabled')) return 'Element should be disabled';
  if (lower.includes('url') || lower.includes('navigation'))
    return 'Navigation completes successfully';
  if (lower.includes('click')) return 'Click action completes';
  if (lower.includes('select')) return 'Selection completes successfully';
  if (lower.includes('wait')) return 'Page loads successfully';
  if (
    lower.includes('verify') ||
    lower.includes('assert') ||
    lower.includes('expect')
  ) {
    return (
      stepName.replace(/verify|assert|expect/gi, '').trim() + ' is correct'
    );
  }

  return 'Step completes successfully';
}

// Convert test case to Xray format
function convertToXray(testCase) {
  const labels = getLabels(testCase);
  const jiraKeys = getJiraKeys(testCase, labels);
  const steps = convertSteps(testCase.testStage?.steps || []);

  const xrayTest = {
    testtype: 'Automated', // Changed from Manual to Automated
    project: 'OCG',
    summary: testCase.name,
    description: buildDescription(testCase, labels),
    precondition: `Feature ${labels.feature || 'N/A'} must be available\nTest environment is properly configured`,
    labels: [
      labels.epic && `epic:${labels.epic}`,
      labels.feature && `feature:${labels.feature}`,
      labels.story && `story:${labels.story}`,
      ...jiraKeys.map((k) => `jira:${k}`),
    ].filter(Boolean),
    testsets: labels.feature ? [labels.feature] : [], // Use feature name as test set
    steps:
      steps.length > 0
        ? steps
        : [
            {
              action: 'Execute automated test',
              data: testCase.fullName || testCase.name,
              expected: 'Test passes successfully',
            },
          ],
  };

  // Add JIRA links
  if (jiraKeys.length > 0) {
    xrayTest.issuelinks = jiraKeys.map((key) => ({
      type: 'Tests',
      inwardIssue: key,
    }));
  }

  return xrayTest;
}

// Build description
function buildDescription(testCase, labels) {
  const parts = [
    `*Epic:* ${labels.epic || 'N/A'}`,
    `*Feature:* ${labels.feature || 'N/A'}`,
    `*Story:* ${labels.story || 'N/A'}`,
    '',
    `*Test File:* ${labels.suite || 'N/A'}`,
    `*Full Name:* ${testCase.fullName || 'N/A'}`,
    `*Status (Last Run):* ${testCase.status || 'unknown'}`,
  ];

  if (testCase.parameters && testCase.parameters.length > 0) {
    parts.push('', '*Parameters:*');
    testCase.parameters.forEach((p) => parts.push(`- ${p.name}: ${p.value}`));
  }

  return parts.join('\n');
}

// Generate CSV
// Xray uses semicolon (;) as step delimiter within cells
// See: https://docs.getxray.app/display/XRAYCLOUD/Importing+Manual+Test+Cases+from+CSV
function generateCSV(tests) {
  const headers = [
    'Summary',
    'Test Type',
    'Epic',
    'Feature',
    'Story',
    'Test Sets',
    'JIRA Keys',
    'Step Action',
    'Step Data',
    'Step Expected',
  ];

  const rows = tests.map((test) => {
    const labels = {};
    test.labels?.forEach((l) => {
      const [key, val] = l.split(':');
      labels[key] = val;
    });

    const jiraKeys =
      test.issuelinks?.map((l) => l.inwardIssue).join(', ') || '';
    const testSets = Array.isArray(test.testsets)
      ? test.testsets.join(', ')
      : '';

    // Combine all steps using semicolon (;) as delimiter for Xray
    const actions = test.steps.map((s) => s.action).join(';');
    const data = test.steps.map((s) => s.data || '').join(';');
    const expected = test.steps.map((s) => s.expected).join(';');

    return [
      test.summary,
      test.testtype,
      labels.epic || '',
      labels.feature || '',
      labels.story || '',
      testSets,
      jiraKeys,
      actions,
      data,
      expected,
    ];
  });

  return [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');
}

// Main
function main() {
  console.log('📊 Reading test cases from:', TEST_CASES_DIR);

  const testCases = readTestCases();
  console.log(`✅ Found ${testCases.length} test cases`);

  console.log('\n🔄 Converting to Xray format...');
  const xrayTests = testCases.map(convertToXray);

  // JSON output
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(xrayTests, null, 2));
  console.log(`\n✅ JSON: ${OUTPUT_JSON}`);
  console.log(`   Tests: ${xrayTests.length}`);

  // CSV output
  const csv = generateCSV(xrayTests);
  fs.writeFileSync(OUTPUT_CSV, csv);
  console.log(`✅ CSV: ${OUTPUT_CSV}`);

  // Stats
  const stats = {
    total: xrayTests.length,
    withJira: xrayTests.filter((t) => t.issuelinks).length,
    byFeature: {},
  };

  xrayTests.forEach((t) => {
    const feature = t.labels
      ?.find((l) => l.startsWith('feature:'))
      ?.split(':')[1];
    if (feature) {
      stats.byFeature[feature] = (stats.byFeature[feature] || 0) + 1;
    }
  });

  console.log('\n📈 Statistics:');
  console.log(`   Total: ${stats.total}`);
  console.log(`   With JIRA: ${stats.withJira}`);
  console.log('\n   By Feature:');
  Object.entries(stats.byFeature)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([f, c]) => console.log(`   - ${f}: ${c}`));

  console.log('\n✨ Done! Import files ready for Xray.');
}

try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

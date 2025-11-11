#!/usr/bin/env node
/**
 * Generates Xray Test Case Import JSON/CSV from Allure test-cases
 * 
 * Xray Test Case Importer format documentation:
 * https://docs.getxray.app/space/XRAYCLOUD/44565495/Examples+using+Test+Case+Importer
 * 
 * Usage:
 *   node scripts/generate-xray-import.js
 * 
 * Output:
 *   - xray-import.json (for Xray Cloud)
 *   - xray-import.csv (alternative format)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLURE_TEST_CASES_DIR = path.join(__dirname, '..', '.allure', 'report', 'data', 'test-cases');
const OUTPUT_JSON = path.join(__dirname, '..', 'xray-import.json');
const OUTPUT_CSV = path.join(__dirname, '..', 'xray-import.csv');

/**
 * Read all Allure test-case JSON files
 */
function readAllureTestCases() {
  if (!fs.existsSync(ALLURE_TEST_CASES_DIR)) {
    throw new Error(`Test cases directory not found: ${ALLURE_TEST_CASES_DIR}\nPlease run: npm run report`);
  }
  
  const files = fs.readdirSync(ALLURE_TEST_CASES_DIR);
  const testCaseFiles = files.filter(f => f.endsWith('.json'));
  
  const testCases = [];
  for (const file of testCaseFiles) {
    const filePath = path.join(ALLURE_TEST_CASES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      const data = JSON.parse(content);
      testCases.push(data);
    } catch (error) {
      console.warn(`Warning: Failed to parse ${file}:`, error.message);
    }
  }
  
  return testCases;
}

/**
 * Extract labels from Allure result
 */
function extractLabels(result) {
  const labels = {};
  if (result.labels) {
    result.labels.forEach(label => {
      labels[label.name] = label.value;
    });
  }
  return labels;
}

/**
 * Extract JIRA issue keys from tags and story
 */
function extractJiraKeys(result, labels) {
  const jiraKeys = new Set();
  
  // From story (e.g., "OCG-3316 - Movie Schema URL validation")
  if (labels.story) {
    const storyMatch = labels.story.match(/([A-Z]+-\d+)/g);
    if (storyMatch) {
      storyMatch.forEach(key => jiraKeys.add(key));
    }
  }
  
  // From test name
  if (result.name) {
    const nameMatch = result.name.match(/([A-Z]+-\d+)/g);
    if (nameMatch) {
      nameMatch.forEach(key => jiraKeys.add(key));
    }
  }
  
  return Array.from(jiraKeys);
}

/**
 * Convert Allure steps to Xray test steps
 */
function convertStepsToXray(steps, level = 0) {
  if (!steps || steps.length === 0) return [];
  
  const xraySteps = [];
  let stepNumber = 1;
  
  for (const step of steps) {
    // Skip internal Playwright steps and hook steps
    if (step.name.includes('page.') || 
        step.name.includes('locator.') ||
        step.name.includes('beforeEach') ||
        step.name.includes('Before Hooks') ||
        step.name.includes('After Hooks')) {
      continue;
    }
    
    // Recursively process nested steps
    if (step.steps && step.steps.length > 0) {
      const nestedSteps = convertStepsToXray(step.steps, level + 1);
      xraySteps.push(...nestedSteps);
    } else {
      // Extract expected result from step name
      const expected = extractExpectedResult(step.name);
      
      // Add step with expected result (not execution result)
      xraySteps.push({
        action: step.name,
        data: step.parameters ? step.parameters.map(p => `${p.name}: ${p.value}`).join(', ') : '',
        expected: expected
      });
      stepNumber++;
    }
  }
  
  return xraySteps;
}

/**
 * Extract expected result from step name or assertion
 */
function extractExpectedResult(stepName) {
  // Common assertion patterns
  if (stepName.includes('assert') || stepName.includes('verify') || stepName.includes('expect')) {
    // Examples:
    // "Verify navbar elements are visible" → "Navbar elements should be visible"
    // "assertWarningMessageDisplayed" → "Warning message should be displayed"
    // "expectNavbarElementsVisible" → "Navbar elements should be visible"
    
    if (stepName.includes('Visible') || stepName.includes('visible')) {
      return 'Element should be visible';
    }
    if (stepName.includes('Disabled') || stepName.includes('disabled')) {
      return 'Element should be disabled';
    }
    if (stepName.includes('Enabled') || stepName.includes('enabled')) {
      return 'Element should be enabled';
    }
    if (stepName.includes('URL') || stepName.includes('url') || stepName.includes('navigation')) {
      return 'URL should be correct';
    }
    if (stepName.includes('Schema') || stepName.includes('validation')) {
      return 'Data should be valid';
    }
    
    return 'Assertion should pass';
  }
  
  // Navigation steps
  if (stepName.includes('Navigate to') || stepName.includes('Navigating to')) {
    return 'Page should load successfully';
  }
  
  // Click/interaction steps
  if (stepName.includes('Click') || stepName.includes('click')) {
    return 'Element should be clickable and action should complete';
  }
  
  // Selection steps
  if (stepName.includes('Select') || stepName.includes('select')) {
    return 'Element should be selected';
  }
  
  // Wait steps
  if (stepName.includes('Wait for')) {
    return 'Element/condition should be met';
  }
  
  // Input/fill steps
  if (stepName.includes('Fill') || stepName.includes('Type') || stepName.includes('Enter')) {
    return 'Input should be accepted';
  }
  
  // Screenshot/capture steps (no assertion needed)
  if (stepName.includes('screenshot') || stepName.includes('capture')) {
    return 'Screenshot captured for documentation';
  }
  
  // Default expected result
  return 'Step should complete successfully';
}

/**
 * Convert Allure result to Xray test case format
 */
function convertToXrayTestCase(result) {
  const labels = extractLabels(result);
  const jiraKeys = extractJiraKeys(result, labels);
  const steps = convertStepsToXray(result.steps);
  
  // Extract test type from tags
  let testType = 'Manual'; // Default
  if (labels.story && labels.story.toLowerCase().includes('automation')) {
    testType = 'Cucumber';
  }
  
  // Build test case
  const testCase = {
    testtype: testType,
    project: 'OCG', // Adjust to your Jira project key
    summary: result.name || 'Unnamed Test',
    description: buildDescription(result, labels),
    precondition: buildPrecondition(labels),
    labels: buildLabels(labels, jiraKeys),
    steps: steps.length > 0 ? steps : [
      {
        action: 'Execute automated test',
        data: result.fullName || result.name,
        expected: 'Test completes successfully with all assertions passing'
      }
    ]
  };
  
  // Add JIRA issue links if found
  if (jiraKeys.length > 0) {
    testCase.issuelinks = jiraKeys.map(key => ({
      type: 'Tests',
      inwardIssue: key
    }));
  }
  
  return testCase;
}

/**
 * Build test description
 */
function buildDescription(result, labels) {
  const parts = [];
  
  parts.push(`*Epic:* ${labels.epic || 'N/A'}`);
  parts.push(`*Feature:* ${labels.feature || 'N/A'}`);
  parts.push(`*Story:* ${labels.story || 'N/A'}`);
  parts.push('');
  parts.push(`*Test File:* ${labels.suite || result.fullName || 'N/A'}`);
  parts.push(`*Status:* ${result.status || 'unknown'}`);
  
  if (result.parameters && result.parameters.length > 0) {
    parts.push('');
    parts.push('*Parameters:*');
    result.parameters.forEach(param => {
      parts.push(`- ${param.name}: ${param.value}`);
    });
  }
  
  if (result.statusDetails && result.statusDetails.message) {
    parts.push('');
    parts.push('*Last Execution Details:*');
    parts.push(result.statusDetails.message);
  }
  
  return parts.join('\n');
}

/**
 * Build precondition text
 */
function buildPrecondition(labels) {
  const preconditions = [];
  
  if (labels.feature) {
    preconditions.push(`Feature ${labels.feature} must be available`);
  }
  
  preconditions.push('User has access to the application');
  preconditions.push('Test environment is properly configured');
  
  return preconditions.join('\n');
}

/**
 * Build labels array
 */
function buildLabels(labels, jiraKeys) {
  const labelArray = [];
  
  if (labels.epic) labelArray.push(`epic:${labels.epic}`);
  if (labels.feature) labelArray.push(`feature:${labels.feature}`);
  if (labels.story) labelArray.push(`story:${labels.story}`);
  
  // Add JIRA keys as labels
  jiraKeys.forEach(key => labelArray.push(`jira:${key}`));
  
  return labelArray;
}

/**
 * Generate CSV format - One row per step
 */
function generateCSV(testCases) {
  const headers = [
    'Test Summary',
    'Test Priority',
    'Test Type',
    'Epic',
    'Feature',
    'Story',
    'JIRA Keys',
    'Step Number',
    'Step Action',
    'Step Data',
    'Step Expected Result'
  ];
  
  const rows = [];
  
  testCases.forEach(tc => {
    const labels = extractLabelsFromTestCase(tc);
    const baseRow = [
      tc.summary,
      'Medium',
      tc.testtype,
      labels.epic || '',
      labels.feature || '',
      labels.story || '',
      tc.issuelinks ? tc.issuelinks.map(l => l.inwardIssue).join('; ') : ''
    ];
    
    // Add one row per step
    if (tc.steps && tc.steps.length > 0) {
      tc.steps.forEach((step, index) => {
        rows.push([
          ...baseRow,
          (index + 1).toString(),
          step.action || '',
          step.data || '',
          step.expected || ''
        ]);
      });
    } else {
      // Test without explicit steps
      rows.push([
        ...baseRow,
        '1',
        'Execute automated test',
        tc.summary,
        'Test completes successfully'
      ]);
    }
  });
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape quotes and wrap in quotes
      const escaped = String(cell).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(','))
  ].join('\n');
  
  return csvContent;
}

function extractLabelsFromTestCase(tc) {
  const labels = {};
  if (tc.labels) {
    tc.labels.forEach(label => {
      const [key, ...valueParts] = label.split(':');
      labels[key] = valueParts.join(':'); // Handle labels with multiple colons
    });
  }
  return labels;
}

/**
 * Main execution
 */
function main() {
  console.log('📊 Reading Allure results from:', ALLURE_RESULTS_DIR);
  
  const allureResults = readAllureResults();
  console.log(`✅ Found ${allureResults.length} test results`);
  
  console.log('\n🔄 Converting to Xray format...');
  const xrayTestCases = allureResults.map(convertToXrayTestCase);
  
  // Generate JSON output - Direct array format for Xray
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(xrayTestCases, null, 2));
  console.log(`\n✅ JSON export saved to: ${OUTPUT_JSON}`);
  console.log(`   Total test cases: ${xrayTestCases.length}`);
  
  // Generate CSV output
  const csvOutput = generateCSV(xrayTestCases);
  fs.writeFileSync(OUTPUT_CSV, csvOutput);
  console.log(`✅ CSV export saved to: ${OUTPUT_CSV}`);
  
  // Statistics
  const stats = {
    total: xrayTestCases.length,
    byStatus: {},
    byEpic: {},
    byFeature: {},
    withJiraLinks: 0
  };
  
  xrayTestCases.forEach(tc => {
    const labels = extractLabelsFromTestCase(tc);
    
    if (labels.epic) {
      stats.byEpic[labels.epic] = (stats.byEpic[labels.epic] || 0) + 1;
    }
    
    if (labels.feature) {
      stats.byFeature[labels.feature] = (stats.byFeature[labels.feature] || 0) + 1;
    }
    
    if (tc.issuelinks && tc.issuelinks.length > 0) {
      stats.withJiraLinks++;
    }
  });
  
  console.log('\n📈 Statistics:');
  console.log(`   Total tests: ${stats.total}`);
  console.log(`   Tests with JIRA links: ${stats.withJiraLinks}`);
  console.log('\n   By Epic:');
  Object.entries(stats.byEpic).forEach(([epic, count]) => {
    console.log(`   - ${epic}: ${count}`);
  });
  
  console.log('\n   Top Features:');
  Object.entries(stats.byFeature)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([feature, count]) => {
      console.log(`   - ${feature}: ${count}`);
    });
  
  console.log('\n✨ Export complete! You can now import these files into Xray.');
  console.log('\nNext steps:');
  console.log('1. Review the generated files');
  console.log('2. Go to Jira > Xray > Import');
  console.log('3. Select "Test Case Importer" format');
  console.log('4. Upload xray-import.json or xray-import.csv');
}

// Run
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}

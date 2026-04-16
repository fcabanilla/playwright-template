#!/usr/bin/env node

/**
 * Generates a testplan.json for selective test execution via ALLURE_TESTPLAN_PATH.
 *
 * Reads Allure result JSON files from .allure/results/ and creates a testplan
 * containing only the tests matching the specified filters. Playwright will then
 * execute ONLY those tests when run with ALLURE_TESTPLAN_PATH=./testplan.json.
 *
 * Usage:
 *   node scripts/generate-testplan.cjs --failed                 # Re-run failed/broken tests
 *   node scripts/generate-testplan.cjs --passed                 # Only passed tests
 *   node scripts/generate-testplan.cjs --status failed,broken   # Custom status filter
 *   node scripts/generate-testplan.cjs --tag @smoke             # Filter by Allure tag
 *   node scripts/generate-testplan.cjs --tag @smoke --tag @e2e  # Multiple tags (OR)
 *   node scripts/generate-testplan.cjs --component seatPicker   # Filter by file path
 *   node scripts/generate-testplan.cjs --file signup/signup.spec.ts  # Exact file match
 *   node scripts/generate-testplan.cjs --output custom-plan.json     # Custom output path
 *
 * Combine filters (AND logic between different filter types):
 *   node scripts/generate-testplan.cjs --failed --component seatPicker
 *   node scripts/generate-testplan.cjs --tag @smoke --component navbar
 *
 * Runs as part of: npm run testplan:failed, npm run testplan:smoke, etc.
 *
 * @see docs/ALLURE_TESTPLAN.md for complete documentation
 * @see https://allurereport.org/docs/playwright/#select-tests-via-a-test-plan-file
 */

const fs = require('node:fs');
const path = require('node:path');

// ─── Configuration ───────────────────────────────────────────────────────────

const RESULTS_DIR = path.resolve(__dirname, '..', '.allure', 'results');
const DEFAULT_OUTPUT = path.resolve(__dirname, '..', 'testplan.json');

// ─── CLI Argument Parsing ────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    statuses: [],
    tags: [],
    component: null,
    file: null,
    output: DEFAULT_OUTPUT,
    help: false,
    list: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--failed':
        options.statuses = ['failed', 'broken'];
        break;
      case '--passed':
        options.statuses = ['passed'];
        break;
      case '--status':
        options.statuses = (args[++i] || '').split(',').map((s) => s.trim());
        break;
      case '--tag':
        options.tags.push(args[++i] || '');
        break;
      case '--component':
        options.component = args[++i] || '';
        break;
      case '--file':
        options.file = args[++i] || '';
        break;
      case '--output':
      case '-o':
        options.output = path.resolve(args[++i] || DEFAULT_OUTPUT);
        break;
      case '--list':
        options.list = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        console.error(`Unknown argument: ${args[i]}`);
        options.help = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: node scripts/generate-testplan.cjs [options]

Generates a testplan.json for selective test execution via ALLURE_TESTPLAN_PATH.
Reads Allure result files from .allure/results/ and filters them.

Filter options (combine for AND logic):
  --failed                   Include only failed/broken tests
  --passed                   Include only passed tests
  --status <s1,s2>           Include tests with specific statuses (comma-separated)
                             Valid: passed, failed, broken, skipped
  --tag <tag>                Include tests with this Allure tag (repeatable, OR logic)
                             Example: --tag @smoke --tag @critical
  --component <name>         Include tests whose file path contains <name>
                             Example: --component seatPicker
  --file <path>              Include tests from a specific spec file (partial match)
                             Example: --file signup/signup.spec.ts

Output options:
  --output, -o <path>        Output file path (default: ./testplan.json)
  --list                     Print matching tests to stdout instead of writing file

Other:
  --help, -h                 Show this help message

Examples:
  # Re-run failed tests from last execution
  node scripts/generate-testplan.cjs --failed

  # Generate plan with only smoke tests that passed
  node scripts/generate-testplan.cjs --passed --tag @smoke

  # List failed seatPicker tests (dry run)
  node scripts/generate-testplan.cjs --failed --component seatPicker --list

  # Run the generated plan
  ALLURE_TESTPLAN_PATH=./testplan.json npx playwright test --project='Cinesa'
`);
}

// ─── Result File Processing ──────────────────────────────────────────────────

function readAllureResults() {
  if (!fs.existsSync(RESULTS_DIR)) {
    console.error(`Error: Results directory not found: ${RESULTS_DIR}`);
    console.error('Run tests first to generate Allure results.');
    process.exit(1);
  }

  const files = fs
    .readdirSync(RESULTS_DIR)
    .filter((f) => f.endsWith('-result.json'));

  if (files.length === 0) {
    console.error('Error: No result files found in .allure/results/');
    console.error('Run tests first to generate Allure results.');
    process.exit(1);
  }

  const results = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(RESULTS_DIR, file), 'utf8');
      const result = JSON.parse(content);
      if (result.fullName) {
        results.push(result);
      }
    } catch {
      // Skip malformed files silently
    }
  }

  return results;
}

function getResultTags(result) {
  if (!result.labels || !Array.isArray(result.labels)) return [];
  return result.labels.filter((l) => l.name === 'tag').map((l) => l.value);
}

// ─── Filtering ───────────────────────────────────────────────────────────────

function filterResults(results, options) {
  return results.filter((result) => {
    // Status filter
    if (options.statuses.length > 0) {
      if (!options.statuses.includes(result.status)) return false;
    }

    // Tag filter (OR logic: match ANY of the specified tags)
    if (options.tags.length > 0) {
      const resultTags = getResultTags(result);
      const hasMatchingTag = options.tags.some((tag) =>
        resultTags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    // Component filter (file path contains component name)
    if (options.component) {
      if (
        !result.fullName.toLowerCase().includes(options.component.toLowerCase())
      ) {
        return false;
      }
    }

    // File filter (exact file path match)
    if (options.file) {
      const filePart = result.fullName.split('#')[0] || '';
      if (!filePart.includes(options.file)) return false;
    }

    return true;
  });
}

// ─── Deduplication ───────────────────────────────────────────────────────────

/**
 * Deduplicates results by testCaseId, preferring real execution results
 * (passed/failed/broken) over "skipped" status, then most recent by timestamp.
 *
 * This prevents a partial run (which skips most tests) from hiding
 * real failures from a previous full regression.
 */
function deduplicateByTestCaseId(results) {
  const seen = new Map();
  const realStatuses = new Set(['passed', 'failed', 'broken']);

  for (const result of results) {
    const key = result.testCaseId || result.fullName;
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, result);
      continue;
    }

    const existingIsReal = realStatuses.has(existing.status);
    const newIsReal = realStatuses.has(result.status);

    if (newIsReal && !existingIsReal) {
      // Prefer real result over skipped
      seen.set(key, result);
    } else if (existingIsReal && !newIsReal) {
      // Keep existing real result over new skipped
      continue;
    } else {
      // Both real or both skipped → keep most recent
      if ((result.stop || 0) > (existing.stop || 0)) {
        seen.set(key, result);
      }
    }
  }
  return Array.from(seen.values());
}

// ─── Testplan Generation ─────────────────────────────────────────────────────

/**
 * Builds the testplan JSON from filtered results.
 *
 * The `selector` must use the file path as seen by Playwright's grep
 * (relative to project root, from the `suite` label) instead of the
 * allure fullName path (relative to testDir). Without this, the regex
 * generated by testPlanFilter() won't match Playwright's title path.
 */
function buildTestplan(results) {
  return {
    version: '1.0',
    tests: results.map((result) => ({
      id: result.testCaseId || result.fullName,
      selector: buildSelector(result),
    })),
  };
}

/**
 * Builds a selector that matches Playwright's title path format.
 *
 * Allure fullName: "checkout/checkout.smoke.spec.ts#Checkout Smoke Tests ..."
 * Suite label:     "tests/cinesa/checkout/checkout.smoke.spec.ts"
 * Result selector: "tests/cinesa/checkout/checkout.smoke.spec.ts#Checkout Smoke Tests ..."
 */
function buildSelector(result) {
  const suiteLabel = (result.labels || []).find((l) => l.name === 'suite');
  if (!suiteLabel || !suiteLabel.value) {
    return result.fullName; // Fallback to original
  }

  // Replace the file path portion (before #) with the suite label
  const hashIndex = result.fullName.indexOf('#');
  if (hashIndex === -1) {
    return result.fullName; // Fallback if no # separator
  }

  return suiteLabel.value + result.fullName.slice(hashIndex);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  // Require at least one filter
  const hasFilter =
    options.statuses.length > 0 ||
    options.tags.length > 0 ||
    options.component ||
    options.file;

  if (!hasFilter) {
    console.error('Error: At least one filter is required.');
    console.error(
      'Use --failed, --passed, --status, --tag, --component, or --file.'
    );
    console.error('Run with --help for usage details.');
    process.exit(1);
  }

  // Read and process results
  const allResults = readAllureResults();
  const deduplicated = deduplicateByTestCaseId(allResults);
  const filtered = filterResults(deduplicated, options);

  if (filtered.length === 0) {
    console.error('Warning: No tests matched the specified filters.');
    console.error(
      `  Filters: ${JSON.stringify({ statuses: options.statuses, tags: options.tags, component: options.component, file: options.file })}`
    );
    console.error(`  Total results scanned: ${deduplicated.length}`);
    process.exit(1);
  }

  // List mode: print to stdout and exit
  if (options.list) {
    console.log(
      `\nMatching tests (${filtered.length}/${deduplicated.length}):\n`
    );
    for (const result of filtered) {
      const statusIcon =
        result.status === 'passed'
          ? '✅'
          : result.status === 'failed'
            ? '❌'
            : result.status === 'broken'
              ? '💥'
              : result.status === 'skipped'
                ? '⏭️'
                : '❓';
      console.log(`  ${statusIcon} [${result.status}] ${result.name}`);
      console.log(`     → ${result.fullName}`);
    }
    console.log('');
    return;
  }

  // Generate testplan
  const testplan = buildTestplan(filtered);

  fs.writeFileSync(
    options.output,
    JSON.stringify(testplan, null, 2) + '\n',
    'utf8'
  );

  // Summary
  const filterDesc = [];
  if (options.statuses.length > 0)
    filterDesc.push(`status=[${options.statuses.join(',')}]`);
  if (options.tags.length > 0)
    filterDesc.push(`tags=[${options.tags.join(',')}]`);
  if (options.component) filterDesc.push(`component=${options.component}`);
  if (options.file) filterDesc.push(`file=${options.file}`);

  console.log(
    `✅ Testplan generated: ${path.relative(process.cwd(), options.output)}`
  );
  console.log(
    `   Tests: ${filtered.length} (from ${deduplicated.length} total results)`
  );
  console.log(`   Filters: ${filterDesc.join(', ')}`);
  console.log(
    `\n   Run with: ALLURE_TESTPLAN_PATH=${path.relative(process.cwd(), options.output)} npx playwright test`
  );
}

main();

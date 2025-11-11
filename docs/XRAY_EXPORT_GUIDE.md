# Xray Test Case Import Guide

This guide explains how to export Playwright test cases from Allure results and import them into Jira Xray.

## Overview

The `scripts/generate-xray-import.js` script converts Allure test results into Xray Test Case Importer format, allowing you to create Jira test cases automatically from your automated tests.

## Generated Files

Two formats are generated:

1. **`xray-import.json`** - JSON format (recommended for Xray Cloud)
2. **`xray-import.csv`** - CSV format (alternative, easier to review in spreadsheets)

## Usage

### Step 1: Run Your Tests

First, execute your test suite and generate Allure results:

```bash
# Run tests
npm run test:cinesa

# Generate Allure report
npm run report
```

This creates test results in `.allure/results/` directory.

### Step 2: Generate Xray Export Files

Run the export script:

```bash
node scripts/generate-xray-import.js
```

**Output:**

```
📊 Reading Allure results from: .allure/results
✅ Found 123 test results

🔄 Converting to Xray format...

✅ JSON export saved to: xray-import.json
   Total test cases: 123
✅ CSV export saved to: xray-import.csv

📈 Statistics:
   Total tests: 123
   Tests with JIRA links: 13

   By Epic:
   - Cinesa Platform: 123

   Top Features:
   - Footer - Site Navigation: 50
   - Seat Picker - Seat Selection: 36
   - Movies - Content Catalog: 10
```

### Step 3: Import into Jira Xray

#### Option A: Xray Cloud (JSON format)

1. Go to your Jira project
2. Navigate to **Xray** → **Import**
3. Select **Test Case Importer** format
4. Choose **JSON** as file type
5. Upload `xray-import.json`
6. Click **Import**

#### Option B: Xray Server/Data Center (CSV format)

1. Go to your Jira project
2. Navigate to **Xray** → **Import**
3. Select **Test Case Importer** format
4. Choose **CSV** as file type
5. Upload `xray-import.csv`
6. Map columns if prompted:
   - Test Summary → Summary
   - Test Type → Test Type
   - Epic → Epic
   - Feature → Feature
   - Story → Story
   - Steps → Manual Test Steps
7. Click **Import**

## Generated Test Case Structure

Each test case includes:

### Basic Information

- **Summary**: Test name from Playwright
- **Test Type**: Manual (can be changed to Cucumber/Automated in Xray)
- **Project**: OCG (configurable in script)
- **Priority**: Medium (default)

### Traceability

- **Epic**: From `allure.epic()`
- **Feature**: From `allure.feature()`
- **Story**: From `allure.story()`
- **JIRA Links**: Automatically extracted from test tags (e.g., `@OCG-3316`)

### Test Steps

Converted from Playwright/Allure test steps:

- **Action**: Step description
- **Data**: Parameters used
- **Expected Result**: Step outcome

### Additional Metadata

- **Description**: Detailed test context including epic/feature/story, file path, last execution status
- **Preconditions**: Automatically generated based on feature requirements
- **Labels**: Tags for filtering (epic, feature, story, JIRA keys)

## Example Test Case

```json
{
  "testtype": "Manual",
  "project": "OCG",
  "summary": "OCG-3316 - Movie Schema URL validation",
  "description": "*Epic:* Cinesa Platform\n*Feature:* Movies - Content Catalog\n*Story:* OCG-3316 - Movie Schema URL validation\n\n*Test File:* tests/cinesa/movies/movies.spec.ts\n*Status:* failed",
  "precondition": "Feature Movies - Content Catalog must be available\nUser has access to the application\nTest environment is properly configured",
  "labels": [
    "epic:Cinesa Platform",
    "feature:Movies - Content Catalog",
    "story:OCG-3316 - Movie Schema URL validation",
    "jira:OCG-3316"
  ],
  "issuelinks": [
    {
      "type": "Tests",
      "inwardIssue": "OCG-3316"
    }
  ],
  "steps": [
    {
      "action": "Navigate to movies page",
      "data": "Cinema: Oasiz",
      "result": "Expected result achieved"
    },
    {
      "action": "Extract movie schema from page",
      "data": "",
      "result": "Expected result achieved"
    },
    {
      "action": "Validate schema URLs",
      "data": "",
      "result": "Failed: Schema validation error"
    }
  ]
}
```

## Customization

### Change Project Key

Edit `scripts/generate-xray-import.js`:

```javascript
project: 'OCG', // Change to your Jira project key
```

### Modify Test Type

By default, all tests are imported as "Manual". To change:

```javascript
// In convertToXrayTestCase function
let testType = 'Cucumber'; // or 'Automated', 'Generic'
```

### Filter Tests

To export only specific tests:

```javascript
// In main() function
const xrayTestCases = allureResults
  .filter((result) => {
    const labels = extractLabels(result);
    return labels.feature === 'Seat Picker - Seat Selection'; // Example filter
  })
  .map(convertToXrayTestCase);
```

## JIRA Issue Linking

The script automatically extracts JIRA issue keys from:

1. **Test tags**: `@OCG-3316`, `@COMS-16843`
2. **Story labels**: "OCG-3316 - Description"
3. **Test names**: Test names containing issue keys

These are linked as "Tests" relationship in Xray.

## Statistics Output

The script provides statistics about exported tests:

- **Total tests**: Number of test cases exported
- **Tests with JIRA links**: Tests linked to existing JIRA issues
- **By Epic**: Distribution across epics
- **Top Features**: Most common features

## Troubleshooting

### No results found

```
✅ Found 0 test results
```

**Solution**: Run tests first to generate Allure results

### Invalid JSON error in Xray

**Solution**: Ensure project key in script matches your Jira project

### Missing test steps

**Solution**: Tests without explicit `test.step()` will have generic "Execute automated test" step

### JIRA links not created

**Solution**: Ensure issue keys in tags follow pattern `@PROJECT-NUMBER` (e.g., `@OCG-3316`)

## Best Practices

1. **Run full test suite** before export to get complete coverage
2. **Review generated files** before importing (especially CSV for readability)
3. **Use JIRA tags** consistently in tests for automatic linking
4. **Add allure labels** (epic, feature, story) to all tests for better organization
5. **Export regularly** after major test updates to keep Jira in sync

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/export-to-xray.yml
- name: Run tests
  run: npm run test:cinesa

- name: Generate Xray export
  run: node scripts/generate-xray-import.js

- name: Upload to Xray
  uses: xray-cloud-action@v1
  with:
    file: xray-import.json
    project: OCG
```

## References

- [Xray Test Case Importer Documentation](https://docs.getxray.app/space/XRAYCLOUD/44565495/Examples+using+Test+Case+Importer)
- [Allure Playwright Integration](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
- [Xray Cloud REST API](https://docs.getxray.app/display/XRAYCLOUD/Import+Execution+Results+-+REST)

---

**Generated by:** `scripts/generate-xray-import.js`  
**Last Updated:** $(date)

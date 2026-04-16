#!/usr/bin/env node

/**
 * One-time migration: Adds enrichTestMetadata + linkJiraTickets to all spec files.
 * 
 * What it does:
 * 1. Adds import for { enrichTestMetadata, linkJiraTickets } from core/allure/allureMetadata
 * 2. Adds testInfo parameter to beforeEach callbacks
 * 3. Adds await enrichTestMetadata(testInfo) after the last allure.feature/allure.epic call
 * 4. Adds await linkJiraTickets(storyName) after allure.story() calls that contain OCG-XXXX
 *
 * Run: node scripts/migrate-allure-metadata.js [--dry-run]
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = path.resolve(__dirname, '..');

// Find all spec files
const specFiles = execSync('find tests -name "*.spec.ts" -type f', {
  cwd: ROOT,
  encoding: 'utf-8',
})
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((f) => path.join(ROOT, f));

console.log(`Found ${specFiles.length} spec files${DRY_RUN ? ' (DRY RUN)' : ''}\n`);

let modified = 0;
let skipped = 0;
let errors = 0;

for (const filePath of specFiles) {
  const relPath = path.relative(ROOT, filePath);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Skip setup spec files (no allure usage)
  if (!content.includes("from 'allure-playwright'") && !content.includes('from "allure-playwright"')) {
    console.log(`  SKIP (no allure import): ${relPath}`);
    skipped++;
    continue;
  }

  // Skip if already migrated
  if (content.includes('enrichTestMetadata')) {
    console.log(`  SKIP (already migrated): ${relPath}`);
    skipped++;
    continue;
  }

  // --- Step 1: Add import ---
  // Calculate relative path from spec file to core/allure/allureMetadata
  const specDir = path.dirname(filePath);
  let relImportPath = path.relative(specDir, path.join(ROOT, 'core/allure/allureMetadata'));
  if (!relImportPath.startsWith('.')) relImportPath = './' + relImportPath;
  // Normalize to forward slashes
  relImportPath = relImportPath.replace(/\\/g, '/');

  const importLine = `import { enrichTestMetadata, linkJiraTickets } from '${relImportPath}';`;

  // Add after the allure-playwright import
  const allureImportRegex = /import\s*\{[^}]*allure[^}]*\}\s*from\s*['"]allure-playwright['"];?\s*\n/;
  const allureMatch = content.match(allureImportRegex);
  if (allureMatch) {
    content = content.replace(allureImportRegex, allureMatch[0] + importLine + '\n');
    changed = true;
  } else {
    console.log(`  WARN (can't find allure import): ${relPath}`);
    errors++;
    continue;
  }

  // --- Step 2: Add testInfo to beforeEach + enrichTestMetadata call ---
  // Pattern: test.beforeEach(async ({ fixtures... }) => {
  // Need to add testInfo as second param and enrichTestMetadata call

  // Match beforeEach with destructured params
  const beforeEachRegex = /(test\.beforeEach\(async\s*\(\s*\{[^}]*\})\s*\)\s*=>\s*\{/g;
  let beMatch;
  while ((beMatch = beforeEachRegex.exec(content)) !== null) {
    const fullMatch = beMatch[0];
    const paramsSection = beMatch[1];

    // Add testInfo as second arg if not already present
    if (!fullMatch.includes('testInfo')) {
      const newMatch = fullMatch.replace(
        paramsSection + ')',
        paramsSection + ', testInfo)'
      );
      content = content.replace(fullMatch, newMatch);
      changed = true;
    }
  }

  // Also handle beforeEach with no destructured params: test.beforeEach(async () => {
  const emptyBeforeEachRegex = /test\.beforeEach\(async\s*\(\s*\)\s*=>\s*\{/g;
  content = content.replace(emptyBeforeEachRegex, (match) => {
    changed = true;
    return 'test.beforeEach(async ({}, testInfo) => {';
  });

  // Now insert enrichTestMetadata call after the last allure.feature() line in each beforeEach
  // Find allure.feature(...) lines and add enrichTestMetadata after the last one in each block
  const lines = content.split('\n');
  const newLines = [];
  let inBeforeEach = false;
  let lastFeatureLineIndex = -1;
  let braceDepth = 0;
  let enrichInserted = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track entering beforeEach
    if (line.includes('test.beforeEach(')) {
      inBeforeEach = true;
      braceDepth = 0;
      lastFeatureLineIndex = -1;
      enrichInserted = false;
    }

    if (inBeforeEach) {
      // Count braces
      for (const ch of line) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }

      // Track the last allure.feature or allure.epic line
      if (line.includes('allure.feature(') || line.includes('allure.epic(')) {
        lastFeatureLineIndex = newLines.length; // current position in newLines
      }

      // If braceDepth drops to 0 and we haven't inserted yet, it means end of beforeEach
      if (braceDepth === 0 && inBeforeEach && !enrichInserted && lastFeatureLineIndex >= 0) {
        // Insert after the last feature line
        // We need to scan newLines to find the right spot
        // The lastFeatureLineIndex points to where allure.feature was pushed
        // We'll handle insertion below after pushing current line
      }

      newLines.push(line);

      // Check if we just closed the beforeEach
      if (braceDepth <= 0 && line.includes('}') && inBeforeEach && !enrichInserted && lastFeatureLineIndex >= 0) {
        // Insert enrichTestMetadata after the last allure.feature/epic line
        const indent = newLines[lastFeatureLineIndex].match(/^(\s*)/)?.[1] || '    ';
        newLines.splice(lastFeatureLineIndex + 1, 0, `${indent}await enrichTestMetadata(testInfo);`);
        enrichInserted = true;
        changed = true;
        inBeforeEach = false;
      }
    } else {
      newLines.push(line);
    }
  }

  // If beforeEach block was found but enrich wasn't inserted (complex nesting), try simpler approach
  if (!enrichInserted && content.includes('test.beforeEach(') && content.includes('allure.feature(')) {
    // Simpler: insert after the FIRST allure.feature line
    const featureRegex = /([ \t]*await allure\.feature\([^)]+\);)\n/;
    const featureMatch = content.match(featureRegex);
    if (featureMatch) {
      const indent = featureMatch[1].match(/^(\s*)/)?.[1] || '    ';
      content = content.replace(
        featureMatch[0],
        featureMatch[0] + `${indent}await enrichTestMetadata(testInfo);\n`
      );
      changed = true;
    }
  } else if (enrichInserted) {
    content = newLines.join('\n');
  }

  // --- Step 3: Add linkJiraTickets after allure.story() calls containing OCG- ---
  const storyWithJiraRegex = /([ \t]*await allure\.story\(\s*['"`])((?:[^'"`]*OCG-\d+[^'"`]*))['"`)]+;?\s*\n/g;
  let storyMatch;
  const replacements = [];
  while ((storyMatch = storyWithJiraRegex.exec(content)) !== null) {
    const fullLine = storyMatch[0];
    const indent = fullLine.match(/^(\s*)/)?.[1] || '      ';
    const storyText = storyMatch[2];
    // Extract the variable/string used
    const replacement = fullLine + `${indent}await linkJiraTickets('${storyText.replace(/'/g, "\\'")}');\n`;
    replacements.push({ from: fullLine, to: replacement });
  }
  for (const r of replacements) {
    content = content.replace(r.from, r.to);
    changed = true;
  }

  if (changed) {
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
    console.log(`  ✅ MODIFIED: ${relPath}`);
    modified++;
  } else {
    console.log(`  SKIP (no changes needed): ${relPath}`);
    skipped++;
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${modified} modified, ${skipped} skipped, ${errors} errors`);
if (DRY_RUN) console.log('(DRY RUN — no files were actually modified)');

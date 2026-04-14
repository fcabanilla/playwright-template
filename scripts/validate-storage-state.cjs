/**
 * Validates that Cloudflare cookies in storage state files are not expired.
 * Run before test execution to avoid wasting 60s+ per test on CF challenge timeouts.
 *
 * Usage:
 *   node scripts/validate-storage-state.cjs                    # Validates current env (TEST_ENV or production)
 *   node scripts/validate-storage-state.cjs production es      # Explicit env + region
 *   node scripts/validate-storage-state.cjs --all              # Validates all state files
 *
 * Exit codes:
 *   0 = valid (or no CF cookies found — first run)
 *   1 = expired CF cookies detected — regenerate with: npx playwright test --project=setup
 */

const fs = require('fs');
const path = require('path');

const STATE_DIR = path.join(__dirname, '..', 'state');
const CF_COOKIE_NAMES = ['__cf_bm', '_cfuvid', 'cf_clearance'];
const EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes buffer

function validateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ File not found: ${path.basename(filePath)} → run: npx playwright test --project=setup`);
    return { valid: false, missing: true };
  }

  const state = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const cookies = state.cookies || [];
  const nowSec = Date.now() / 1000;
  const bufferSec = EXPIRY_BUFFER_MS / 1000;
  let hasExpired = false;
  let hasCfCookie = false;

  for (const cookie of cookies) {
    if (!CF_COOKIE_NAMES.includes(cookie.name)) continue;
    hasCfCookie = true;

    if (cookie.expires > 0 && cookie.expires < nowSec + bufferSec) {
      const expDate = new Date(cookie.expires * 1000).toISOString();
      console.log(`  ✗ ${cookie.name} expired at ${expDate} (domain: ${cookie.domain})`);
      hasExpired = true;
    } else if (cookie.expires > 0) {
      const expDate = new Date(cookie.expires * 1000).toISOString();
      console.log(`  ✓ ${cookie.name} valid until ${expDate}`);
    } else {
      console.log(`  ✓ ${cookie.name} session cookie (no expiry)`);
    }
  }

  if (!hasCfCookie) {
    console.log('  ⚠ No Cloudflare cookies found — first run or CF not active');
    return { valid: true, noCfCookies: true };
  }

  return { valid: !hasExpired };
}

function resolveStateFile(env, region) {
  return path.join(STATE_DIR, `consented.${env}.${region}.json`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--all')) {
    console.log('Validating all storage state files:\n');
    const files = fs.readdirSync(STATE_DIR).filter(f => f.startsWith('consented.') && f.endsWith('.json'));
    let anyExpired = false;

    for (const file of files.sort()) {
      console.log(`📁 ${file}`);
      const result = validateFile(path.join(STATE_DIR, file));
      if (!result.valid) anyExpired = true;
      console.log('');
    }

    if (anyExpired) {
      console.log('❌ Some storage states have expired CF cookies.');
      console.log('   Fix: npx playwright test --project=setup\n');
      process.exit(1);
    }
    console.log('✅ All storage states are valid.\n');
    process.exit(0);
  }

  // Single env validation
  const env = args[0] || process.env.TEST_ENV || 'production';
  const region = args[1] || (env.includes('-pt') ? 'pt' : env.includes('-it') || env === 'uci' ? 'it' : 'es');
  const filePath = resolveStateFile(env, region);

  console.log(`Validating: ${path.basename(filePath)}\n`);
  const result = validateFile(filePath);

  if (!result.valid) {
    console.log('\n❌ Storage state has expired Cloudflare cookies.');
    console.log('   Fix: npx playwright test --project=setup');
    console.log('   Then re-run your tests.\n');
    process.exit(1);
  }

  console.log('\n✅ Storage state is valid.\n');
  process.exit(0);
}

main();

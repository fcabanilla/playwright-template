/**
 * Extract storageState from MCP browser evaluate result.
 * Usage: node scripts/extract-storage-state.cjs <input-file>
 */
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: node scripts/extract-storage-state.cjs <input-file>');
  process.exit(1);
}

const raw = fs.readFileSync(inputFile, 'utf-8');
const lines = raw.split('\n');

// Line 2 (index 1) contains the JSON string wrapped in quotes
let jsonStr = lines[1];
if (jsonStr.startsWith('"')) jsonStr = jsonStr.slice(1);
if (jsonStr.endsWith('"')) jsonStr = jsonStr.slice(0, -1);

const parsed = JSON.parse(jsonStr);

console.log('Cookies:', parsed.cookies.length);
console.log('Origins:', parsed.origins.length);
console.log('localStorage keys:', parsed.origins[0].localStorage.length);

const authKeys = parsed.origins[0].localStorage
  .filter(e =>
    e.name.includes('token') ||
    e.name.includes('auth') ||
    e.name.includes('member') ||
    e.name.includes('user') ||
    e.name.includes('session') ||
    e.name.includes('loyalty')
  )
  .map(e => e.name);
console.log('Auth-related localStorage keys:', authKeys);

const outPath = path.join(__dirname, '..', 'state', 'authenticated.preprod.es.json');
fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2));
console.log('Saved to:', outPath);
console.log('File size:', (fs.statSync(outPath).size / 1024).toFixed(1), 'KB');

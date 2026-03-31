const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const dotenv = {};
fs.readFileSync(envPath, 'utf-8')
  .split('\n')
  .forEach(function (l) {
    var t = l.trim();
    if (!t || t.startsWith('#')) return;
    var i = t.indexOf('=');
    if (i === -1) return;
    dotenv[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  });

var config = {
  browser: {
    // Disable CORS enforcement so CF headers can be sent to cross-origin APIs
    // (e.g., preprod-vwc.ocgtest.es) without preflight rejection.
    // Safe for MCP debug browser — not used in production tests.
    launchOptions: {
      args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
    },
    contextOptions: {
      extraHTTPHeaders: {
        // Cloudflare Access bypass — requires BOTH Id + Secret as headers
        // All CF environments (preprod, lab, staging) share the same credentials
        'CF-Access-Client-Id':
          dotenv.CF_ACCESS_CLIENT_ID_PREPROD ||
          dotenv.CF_ACCESS_CLIENT_ID_LAB ||
          dotenv.CF_ACCESS_CLIENT_ID_STAGING,
        'CF-Access-Client-Secret':
          dotenv.CF_ACCESS_CLIENT_SECRET_PREPROD ||
          dotenv.CF_ACCESS_CLIENT_SECRET_LAB ||
          dotenv.CF_ACCESS_CLIENT_SECRET_STAGING,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'sec-ch-ua':
          '"Google Chrome";v="120", "Not_A Brand";v="8", "Chromium";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        DNT: '1',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
    },
  },
};

var outPath = path.resolve(
  __dirname,
  '..',
  'config',
  'mcp',
  'mcp-cloudflare.config.json'
);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(config, null, 2));

var cfId = config.browser.contextOptions.extraHTTPHeaders['CF-Access-Client-Id'];
var cfSecret = config.browser.contextOptions.extraHTTPHeaders['CF-Access-Client-Secret'];
console.log('Generated: ' + outPath);
console.log('CF ID present: ' + !!cfId);
console.log('CF Secret present: ' + !!cfSecret);

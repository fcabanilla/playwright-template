const c = require('../config/mcp/mcp-preprod.config.json');
const h = c.browser.contextOptions.extraHTTPHeaders;
console.log('Headers count:', Object.keys(h).length);
console.log('Header keys:', Object.keys(h).join(', '));
console.log('CF-ID present:', h['CF-Access-Client-Id'] ? 'YES' : 'NO');
console.log('CF-Secret present:', h['CF-Access-Client-Secret'] ? 'YES' : 'NO');

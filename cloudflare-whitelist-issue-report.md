Subject: User-Agent Whitelist Not Working - PREPROD Environment (Follow-up on Cloudflare Access Request)

Hello Joey,

I hope this email finds you well. I'm following up on our previous request for User-Agent whitelisting for Cloudflare Access in our testing environments.

## Issue Summary

Despite implementing the approved User-Agent string, our automated tests are still being blocked by Cloudflare Access in the PREPROD environment. This is preventing us from executing our QA automation suite.

## Technical Details

**Environment:** PREPROD (https://preprod-web.ocgtest.es/)  
**User-Agent Implemented:** `QA-AutomationSuite/1.0 (+https://cinesa.es) / 7f4c3d1b9a6e4a08`  
**Expected Behavior:** Direct access to the application  
**Actual Behavior:** 302 redirect to Cloudflare Access login

### Request Details

```
Method: GET
URL: https://preprod-web.ocgtest.es/
User-Agent: QA-AutomationSuite/1.0 (+https://cinesa.es) / 7f4c3d1b9a6e4a08
```

### Server Response

```
Status: 302 Found
Location: https://cinesa.cloudflareaccess.com/cdn-cgi/access/login/preprod-web.ocgtest.es?kid=...
CF-Ray: 98e69862b8fdcc1e-LIS
Server: cloudflare
```

## Technical Analysis

We've conducted comprehensive fingerprinting analysis to rule out technical issues on our side:

**✅ CONFIRMED WORKING:**

- User-Agent correctly set and transmitted: `QA-AutomationSuite/1.0 (+https://cinesa.es) / 7f4c3d1b9a6e4a08`
- No automation detection signals (`navigator.webdriver = false`)
- Normal browser fingerprint (Canvas, WebGL, plugins all natural)
- Proper TLS/HTTP2 configuration

**❌ ISSUE CONFIRMED:**

- Despite correct technical setup, server returns 302 to Cloudflare Access
- This confirms the User-Agent is NOT whitelisted on the server side

## Evidence Attached

I've attached screenshots and logs showing:

1. The exact User-Agent being sent in the request headers
2. The Cloudflare Access challenge page being displayed
3. Complete request/response cycle for troubleshooting

## Impact

This is blocking our automation pipeline for:

- My Account functionality testing
- End-to-end purchase flow validation
- Regression testing suite execution

## Request

Could you please verify that the User-Agent `QA-AutomationSuite/1.0 (+https://cinesa.es) / 7f4c3d1b9a6e4a08` is properly whitelisted for the PREPROD environment (preprod-web.ocgtest.es)?

If additional configuration is needed on our side, please let us know the required steps.

## Next Steps

While we await the resolution, we'll continue using our authentication state management as a workaround, but this significantly slows down our testing cycles.

Please let me know if you need any additional information or logs to troubleshoot this issue.

Thank you for your assistance!

Best regards,  
[Your Name]  
IT QA Lead | SE Digital & Agile Testing Specialist

---

**Original Thread Reference:**  
Subject: User-Agent whitelist request for Cloudflare stage, preprod and prod environments  
Date: Tuesday, August 26, 2025 4:49 PM

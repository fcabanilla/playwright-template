---
description: 'Diagnose and resolve Cloudflare protection issues on preprod/lab environments'
---

# Debug Cloudflare Protection

Diagnose and fix Cloudflare-related test failures on preprod/lab environments.

## Environment: ${input:environment}

### Quick Diagnostics

1. **Check if environment uses Cloudflare:**

   - `preprod` / `lab` / `preprod-pt` / `lab-pt` → YES (`.ocgtest.es` domain)
   - `production` / `production-pt` → NO (`.cinesa.es` domain)
   - UCI → NO

2. **Required test flags for Cloudflare environments:**

   ```bash
   npx playwright test --headed --workers=1
   # Or use the shortcut:
   npm run test:cinesa:cloudflare
   ```

3. **Check if `cf_clearance` cookie is present:**
   Look in `state/consented.{env}.es.json` for the clearance cookie.

### Common Issues and Solutions

| Symptom                  | Cause                                  | Fix                                                              |
| ------------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| Tests hang on blank page | Cloudflare challenge not solved        | Run `--headed --workers=1`, solve manually on first run          |
| 403 Forbidden            | Missing cf_clearance cookie            | Re-generate storage state: `npx playwright test --project=setup` |
| Intermittent timeouts    | Parallel workers trigger rate limiting | Use `--workers=1`                                                |
| "Access denied" in logs  | IP/User-Agent blocked                  | Check `core/webactions/cloudflareHandler.ts` headers             |

### Architecture Reference

- `core/webactions/cloudflareHandler.ts` — Injects Cloudflare headers and cookies into browser context
- `fixtures/cinesa/playwright.fixtures.ts` — Context override applies CF handling for `.ocgtest.es` domains
- `docs/CLOUDFLARE_HANDLING.md` — Complete bypass strategies documentation

### Storage State Regeneration

```bash
# Generate fresh consent + Cloudflare state
npx playwright test --project=setup --headed
# This creates: state/consented.{env}.{region}.json
```

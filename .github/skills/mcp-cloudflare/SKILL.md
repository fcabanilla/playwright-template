---
name: mcp-cloudflare
description: 'Configure and troubleshoot Playwright MCP/CLI browser for Cloudflare-protected environments (preprod/lab/staging). Use when: MCP browser gets blocked by Cloudflare Access, need to regenerate CF credentials config, setting up MCP for a new environment, or debugging CF bypass failures. Requires: .env file with CF credentials (CF_ACCESS_CLIENT_ID_PREPROD, etc.).'
---

# Playwright MCP & CLI — Cloudflare Bypass Configuration

## When to Use

- MCP browser navigates to preprod/lab/staging and gets redirected to `cinesa.cloudflareaccess.com/cdn-cgi/access/login/`
- Need to regenerate MCP config after CF credential changes
- Debugging why CF bypass stopped working
- Setting up Playwright CLI for Cloudflare environments

## Architecture

The MCP/CLI Cloudflare bypass uses a **single unified config** for all CF environments (preprod, lab, staging share the same credentials):

```
.env (secrets) → scripts/generate-mcp-config.cjs → config/mcp/mcp-cloudflare.config.json → --config flag in mcp.json or playwright-cli
```

### Why a Single Config?

All CF-protected environments share:
1. **Same CF credentials** (`CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET`)
2. **Same user-agent suffix** (`ocgtest.es`) for domain allowlisting
3. **Same `.ocgtest.es` domain** pattern (preprod-web, lab-web, stage-web)

### Why This Approach (Not --init-page)

- `--init-page` runs in a sandboxed VM that blocks `require()`, dynamic `import()`, and `fs` access
- `--secrets .env` masks values in output but does NOT export them to `process.env` for init-page scripts
- `--config` with `browser.contextOptions.extraHTTPHeaders` injects headers at context creation time (before first navigation) — this is the most reliable method

### Why `--disable-web-security` in launchOptions?

CF credentials are injected via `extraHTTPHeaders`, which sends them to ALL requests including cross-origin API calls (e.g., `preprod-vwc.ocgtest.es` Vista API). Without `--disable-web-security`, CORS preflight rejects the `CF-Access-Client-Id` header → ALL cross-origin API calls fail with `net::ERR_FAILED`. This flag disables CORS enforcement in the debug browser only.

### Key Files

| File                                   | Purpose                                                        | In .gitignore? |
| -------------------------------------- | -------------------------------------------------------------- | -------------- |
| `.vscode/mcp.json`                     | MCP server entries (vanilla + CF-enabled)                      | No             |
| `config/mcp/mcp-cloudflare.config.json`| Generated config with CF secrets + anti-detection headers      | **YES** (glob) |
| `config/mcp/init-cloudflare.ts`        | Init-page script (reference, not used currently)               | No             |
| `scripts/generate-mcp-config.cjs`      | Reads .env and generates the config JSON                       | No             |
| `.env`                                 | Source of CF credentials (per-env vars)                        | **YES**        |

## Procedure

### Regenerate Config (After Credential Changes)

```bash
node scripts/generate-mcp-config.cjs
```

Then restart the `playwright-cf` MCP server from VS Code MCP panel (refresh icon).

### Using with Playwright CLI

```bash
# Open a CF-protected environment in headed mode
npx playwright-cli --config config/mcp/mcp-cloudflare.config.json open https://lab-web.ocgtest.es/ --headed

# Or any other CF environment
npx playwright-cli --config config/mcp/mcp-cloudflare.config.json open https://preprod-web.ocgtest.es/ --headed
npx playwright-cli --config config/mcp/mcp-cloudflare.config.json open https://stage-web.ocgtest.es/ --headed
```

### Troubleshooting

#### Still blocked by Cloudflare after config generation

1. **Verify config has credentials:**

   ```bash
   node -e "const c=require('./config/mcp/mcp-cloudflare.config.json'); console.log('CF-ID:', !!c.browser.contextOptions.extraHTTPHeaders['CF-Access-Client-Id'])"
   ```

2. **Check credentials are valid** — CF tokens can expire. Get fresh ones from Cloudflare Access dashboard or your security team.

3. **Restart MCP server** — Config is read at startup. Changes require a restart (refresh icon in VS Code MCP panel).

4. **Check if `--isolated` is present** — Required for `contextOptions` to work. Without it, the config's contextOptions may be ignored (uses persistent profile instead).

#### MCP navigates but page loads Cloudflare interstitial (not Access login)

This means the `cf_clearance` challenge isn't passing. Try adding `--storage-state`:

```json
"args": [
  "@playwright/mcp@latest",
  "--config", "config/mcp/mcp-cloudflare.config.json",
  "--storage-state", "state/consented.preprod.es.json",
  "--isolated", "--no-sandbox", "--ignore-https-errors"
]
```

Note: Storage state cookies (`__cf_bm`) expire in ~30 minutes. Regenerate with:

```bash
TEST_ENV=preprod npx playwright test --project=setup
```

## Config File Schema

The generated `mcp-cloudflare.config.json` uses CF headers + `--disable-web-security` to bypass both CF Access and CORS:

```json
{
  "browser": {
    "launchOptions": {
      "args": ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"]
    },
    "contextOptions": {
      "extraHTTPHeaders": {
        "CF-Access-Client-Id": "<from .env>",
        "CF-Access-Client-Secret": "<from .env>",
        "Accept": "text/html,...",
        "Accept-Language": "es-ES,...",
        "sec-ch-ua": "...",
        "...": "anti-detection headers"
      }
    }
  }
}
```

> **IMPORTANT:** CF credentials are in `extraHTTPHeaders` (required by CF Access).
> `--disable-web-security` in `launchOptions.args` prevents CORS preflight failures
> when these headers are sent to cross-origin API endpoints (e.g., `preprod-vwc.ocgtest.es`).
> Safe for MCP/CLI debug browsers — production tests use CDP-level header injection which
> doesn't trigger browser CORS enforcement.

## MCP CLI Flags Reference

| Flag                     | Purpose                                                  | Used?                              |
| ------------------------ | -------------------------------------------------------- | ---------------------------------- |
| `--config <path>`        | JSON config with browser.contextOptions.extraHTTPHeaders | **Yes**                            |
| `--user-agent <string>`  | Custom UA (appended suffix `ocgtest.es`)                 | **Yes**                            |
| `--isolated`             | In-memory profile, required for contextOptions           | **Yes**                            |
| `--no-sandbox`           | Disable Chrome sandbox                                   | **Yes**                            |
| `--ignore-https-errors`  | Skip TLS errors (useful for preprod certs)               | **Yes**                            |
| `--init-page <path>`     | TypeScript evaluated on Page object                      | No (sandbox limitations)           |
| `--secrets <path>`       | Dotenv secrets masking                                   | No (doesn't export to process.env) |
| `--storage-state <path>` | Load cookies/localStorage                                | Optional (for cf_clearance)        |

## Lessons Learned

1. **`--init-page` sandbox is restrictive**: No `require()`, no dynamic `import()`, no `fs` access. Only Playwright page API works.
2. **`--secrets` only masks output**: It does NOT inject values into `process.env` for init-page scripts.
3. **`--config browser.contextOptions.extraHTTPHeaders` is the reliable path**: Headers are set at context creation, before any navigation.
4. **Generated config must be in .gitignore**: It contains CF-Access secrets from `.env`.
5. **`--isolated` is mandatory**: Without it, `contextOptions` from config may be ignored in favor of persistent profile settings.
6. **Cookies alone don't bypass CF Access**: CF Access specifically requires HTTP headers, not cookies. Cookie-based approach → redirects to CF login page.
7. **`--disable-web-security` solves CORS**: CF headers in `extraHTTPHeaders` get sent to all requests. Cross-origin APIs reject them in CORS preflight. Disabling web security in the debug browser is the simplest fix.

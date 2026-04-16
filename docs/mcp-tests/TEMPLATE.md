# MCP Test: [Title]

**Date**: YYYY-MM-DD
**Environment**: [production | preprod | lab] (`https://...`)
**Bug Reference**: [Link to bug report or JIRA ticket]
**Playwright Equivalent**: [Link to `.spec.ts` file and test name]
**Tester**: [Agent name or human]

---

## Objective

Brief description of what this MCP test session aims to verify.

## Steps Executed

| #   | Action           | Target / URL   | Result  | Notes                     |
| --- | ---------------- | -------------- | ------- | ------------------------- |
| 1   | Navigate to home | `https://...`  | ✅ OK   | Page loaded, title: "..." |
| 2   | Click element    | `link "Cines"` | ✅ OK   |                           |
| 3   | ...              | ...            | ❌ FAIL | Error description         |

## What Worked

- Effective navigation strategies (e.g., `PageDown` for scrolling vs `End`)
- Selectors that were easy to find in snapshot
- Steps that matched the Playwright test flow

## What Didn't Work

- Approaches that were abandoned (e.g., trying `End` key overshoots content)
- Elements that were hard to locate (needed grep in snapshot)
- Timing issues or unexpected state

## API Evidence

### Network Requests

```
[GET] https://... => [STATUS]
[GET] https://... => [FAILED] reason
```

### Console Errors

```
[ERROR] Description @ URL
```

## Screenshots

| Step | Description        | File                                           |
| ---- | ------------------ | ---------------------------------------------- |
| 3    | Cinema detail page | `.playwright-mcp/page-YYYY-MM-DDTHH-mm-ss.png` |

## Comparison with Playwright Suite

| Aspect                    | Playwright (headless)           | MCP (interactive)                          |
| ------------------------- | ------------------------------- | ------------------------------------------ |
| **Result**                | Failed/Broken                   | Same failure confirmed                     |
| **Duration**              | ~90s (timeout)                  | ~30s (manual navigation)                   |
| **Error**                 | `TimeoutError: locator.waitFor` | "Error al cargar los datos" visible in DOM |
| **Root Cause Visibility** | Trace file needed               | Console + Network immediately visible      |

## Verdict

**[REPRODUCIBLE | NOT REPRODUCIBLE | PARTIALLY REPRODUCIBLE]**

Summary of findings and recommended next steps.

---

_Generated from MCP browser session. Template: `docs/mcp-tests/TEMPLATE.md`_

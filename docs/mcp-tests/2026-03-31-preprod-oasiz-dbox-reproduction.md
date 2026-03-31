# MCP Test: Preprod Oasiz D-BOX — Bug Reproduction

**Date**: 2026-03-31
**Environment**: Preprod (`https://preprod-web.ocgtest.es/`)
**Bug Reference**: [BUG-preprod-oasiz-api-404-403-no-films.md](../jira-bugs/BUG-preprod-oasiz-api-404-403-no-films.md)
**Playwright Equivalent**: `tests/cinesa/seatPicker/seatPicker.spec.ts` — "Seat Picker · D-BOX · Select sofa · Single seat — Oasiz" (line 367)
**Tester**: GitHub Copilot (MCP browser via `playwright-preprod` server)

---

## Objective

Verify if the bug reported on 2025-07-22 (Oasiz cinema API returning 404/403 on preprod, causing 6 D-BOX tests to fail) is still reproducible on 2026-03-31.

## Steps Executed

| #   | Action                           | Target / URL                      | Result  | Notes                                                                                                                        |
| --- | -------------------------------- | --------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | Navigate to home                 | `https://preprod-web.ocgtest.es/` | ✅ OK   | Title: "Cartelera, horarios y compra \| Cinesa". Cloudflare bypass working. Build: `2.8.0-prerelease-2ed12f3`                |
| 2   | Take snapshot                    | Page DOM                          | ✅ OK   | Navbar visible: Cines, Películas, Promociones, Experiencias, Programas, Bonos                                                |
| 3   | Click "Cines" link               | `link "Cines" (ref=e10)`          | ✅ OK   | Navigated to `/cines/`. Title: "Todos los cines Cinesa"                                                                      |
| 4   | Take snapshot + search for Oasiz | Full page snapshot                | ✅ OK   | Oasiz not visible in first viewport. Needed to read full snapshot to find `ref=e432`                                         |
| 5   | Click "Cinesa Oasiz"             | `link "Cinesa Oasiz" (ref=e432)`  | ✅ OK   | Navigated to `/cines/oasiz/`. Title: "Cinesa LUXE Oasiz". **63 console errors**                                              |
| 6   | Inspect page content             | DOM snapshot                      | ❌ FAIL | Film list section shows: "Error al cargar los datos" / "Lo sentimos, hubo un error al cargar los datos. Inténtalo de nuevo." |
| 7   | Check console errors             | Console messages                  | ❌ FAIL | CORS errors blocking all Vista API calls. See API Evidence below                                                             |
| 8   | Check network requests           | Network log                       | ❌ FAIL | All `preprod-vwc.ocgtest.es` endpoints return `ERR_FAILED`                                                                   |
| 9   | Screenshot: error visible        | Full page screenshot              | ✅ OK   | "Error al cargar los datos" clearly visible with film clapper icon                                                           |

## What Worked

- **Cloudflare bypass**: `--config` approach with pre-generated headers worked perfectly
- **Snapshot reading**: Taking a full DOM snapshot and reading through it was the most reliable way to find elements (e.g., finding Oasiz cinema card at `ref=e432`)
- **Console messages tool**: Immediately showed CORS errors without needing to open DevTools
- **Network requests tool**: Gave a clean summary of all failed requests with status codes
- **PageDown for scrolling**: More predictable than `End` key which overshoots to footer

## What Didn't Work

- **`End` key for scrolling**: Jumped directly to footer, missing the "Error al cargar los datos" section in the middle of the page
- **grep in snapshot file**: The snapshot output file path had spaces which made terminal commands time out. Reading the file directly via `read_file` was more reliable
- **`browser_evaluate`**: Syntax errors when trying to use `window.scrollTo()` — parameter naming mismatch
- **`browser_run_code`**: Cannot use `page` variable directly, requires different syntax

## API Evidence

### Network Requests (from `/cines/oasiz/` page)

**Omnia API (preprod-web.ocgtest.es)** — Mixed results:

```
[GET] /api/omnia/v1/page?friendly=/cines/oasiz/&components=DateShowtimePicker... => [200] ✅
[GET] /api/omnia/v1/extensions/cinemaRegionalAnnouncement/2354 => [404] ❌
[GET] /api/omnia/v1/extensions/offersAndCompetitions/ => [200] ✅
[GET] /api/omnia/v1/pageList?friendly=/cines/... => [200] ✅
```

**Vista API (preprod-vwc.ocgtest.es)** — ALL FAILED:

```
[GET] /ocapi/v1/sites => [FAILED] net::ERR_FAILED (CORS)
[GET] /ocapi/v1/films => [FAILED] net::ERR_FAILED (CORS)
[GET] /ocapi/v1/films/availability => [FAILED] net::ERR_FAILED (CORS)
[GET] /ocapi/v1/film-screening-dates?siteIds=138 => [FAILED] net::ERR_FAILED (CORS)
[GET] /ocapi/v1/sites/138 => [FAILED] net::ERR_FAILED (CORS)
[GET] /ocapi/v1/showtimes/by-business-date/first?siteIds=138 => [FAILED] net::ERR_FAILED (CORS)
```

**External API** — Failed:

```
[POST] https://rulesengine.vistacxm.co/api/v2/experiences/get => [403]
```

### Console Errors (key entries)

```
[ERROR] Access to fetch at 'https://preprod-vwc.ocgtest.es/WSVistaWebClient/ocapi/v1/sites'
  from origin 'https://preprod-web.ocgtest.es' has been blocked by CORS policy:
  Request header field cf-access-client-id is not allowed by
  Access-Control-Allow-Headers in preflight response.

[ERROR] Access to fetch at 'https://preprod-vwc.ocgtest.es/WSVistaWebClient/ocapi/v1/films'
  from origin 'https://preprod-web.ocgtest.es' has been blocked by CORS policy:
  Request header field cf-access-client-id is not allowed by
  Access-Control-Allow-Headers in preflight response.

[ERROR] %c[OCC, LoadDataFromApi]%c Error loading data from domain api {error: HTTP 403}
[ERROR] %c[OCC]%c Failed to load CXM films for componentId: "Top Film List".
```

### Root Cause (Updated from original bug report)

The original bug report mentioned HTTP 404 on Omnia and HTTP 403 on Vista. The **actual root cause** is now more precise:

The Cloudflare Access headers (`cf-access-client-id`, `cf-access-client-secret`) are injected by the browser into ALL requests. When the frontend makes cross-origin requests to `preprod-vwc.ocgtest.es`, the CORS preflight fails because `cf-access-client-id` is NOT listed in `Access-Control-Allow-Headers` on the VWC backend. This blocks the request before it even reaches the server.

**This is a Cloudflare + CORS configuration issue**, not simply a 403/404 from the API itself.

## Screenshots

| Step | Description                         | File                                                |
| ---- | ----------------------------------- | --------------------------------------------------- |
| 5    | Oasiz cinema detail — hero banner   | `.playwright-mcp/page-2026-03-31T17-26-41-486Z.png` |
| 9    | "Error al cargar los datos" visible | `.playwright-mcp/page-2026-03-31T17-27-54-528Z.png` |
| 9b   | Footer (End key overshoot)          | `.playwright-mcp/page-2026-03-31T17-27-36-669Z.png` |

## Comparison with Playwright Suite

| Aspect                    | Playwright (headless)                                    | MCP (interactive)                                              |
| ------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- |
| **Result**                | Broken (90s timeout) / Failed (60s locator timeout)      | Same failure confirmed manually                                |
| **Duration**              | 60–95s (waiting for timeout)                             | ~45s (immediate visual confirmation)                           |
| **Error type**            | `TimeoutError: locator.waitFor` on `.v-film-title__text` | "Error al cargar los datos" visible in DOM + 63 console errors |
| **Root cause visibility** | Requires trace.zip analysis                              | Console + Network immediately show CORS blocking               |
| **Evidence quality**      | 1 useful screenshot + 1 blank                            | 3 targeted screenshots at key moments                          |
| **API detail**            | Not visible in test output                               | Full network log with all failing endpoints + CORS details     |

## Verdict

**REPRODUCIBLE** — Bug is still active as of 2026-03-31.

The Oasiz cinema detail page on preprod shows no films. All Vista API endpoints are blocked by CORS due to `cf-access-client-id` header not being allowed in preflight responses. The page displays "Error al cargar los datos" where the film list should be.

**Additional finding**: The Omnia API page endpoint (`/api/omnia/v1/page?friendly=/cines/oasiz/`) now returns HTTP 200 (was 404 in original report), but the cinema regional announcement endpoint still returns 404. The Vista API failures are the primary blocker — even if Omnia works, no films or showtimes can load without Vista data.

**Recommended**: Report to DevOps team that `preprod-vwc.ocgtest.es` needs `cf-access-client-id` and `cf-access-client-secret` added to `Access-Control-Allow-Headers` in the CORS configuration.

---

_Generated from MCP browser session. Template: `docs/mcp-tests/TEMPLATE.md`_

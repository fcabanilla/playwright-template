# ☁️ Remote Browser Execution Strategy

## 📋 Context & Problem Statement

As the test suite grows, running tests locally or on a single CI machine becomes a bottleneck.
- **Local Runs:** Limited by developer machine resources.
- **CI Runs:** Limited by agent CPU/Memory, causing flaky tests when parallelism > 4.
- **Network:** Cloudflare triggers on high-volume traffic from single IPs.

**Solution:** Azure Playwright Service (Remote Browsers).
This decouples the "client" (our CI runner) from the "browser" (managed by Azure), allowing massive parallelism (50+ workers) without CPU saturation.

---

## 🏗️ Architecture

- **Service:** Azure Playwright Workspaces (West Europe).
- **Configuration:** `playwright.service.config.ts` (Extends base config).
- **Authentication:**
  - Local: Azure CLI (`az login`).
  - CI: Access Token (`PLAYWRIGHT_SERVICE_ACCESS_TOKEN`).

### ⚠️ Critical Constraints & Solutions

#### 1. Cloudflare & WAF Protection (CORE)
Cinema sites (Cinesa/UCI) have strict WAF rules.
- **Problem:** Remote browsers use "HeadlessChrome" User Agents which are blocked 403.
- **Solution:** We implemented a `userAgent` override in `fixtures/` that appends a dynamic suffix (e.g., `+Azure/1.0`) to the *real* browser User Agent. This allows the WAF to whitelist our traffic while maintaining realistic browser signatures.

#### 2. Network Latency
- **Constraint:** Remote browsers introduce 100-200ms latency per action.
- **Solution:** All timeouts in `playwright.service.config.ts` are increased by 50% compared to local config.

---

## 🚀 Execution Entrypoints

Use the dedicated NPM scripts defined in `package.json`.

| Script | Purpose | Workers |
|--------|---------|---------|
| `npm run test:cloud:cinesa` | Full regression on Cinesa (Cloud) | 20 |
| `npm run test:cloud:uci` | Full regression on UCI (Cloud) | 20 |
| `npm run test:cloud:smoke` | Fast verification of connection | 1 |
| `npm run test:cloud:full` | All platforms combined | 30 |

**Example Command:**
```bash
# Run Cinesa regression on the cloud
npm run test:cloud:cinesa
```

---

## 📦 Artifact Management

Artifacts (Traces, Videos, Screenshots) are handled differently in remote mode:
1. **Streaming:** Video/Trace acts are streamed to the local client.
2. **Storage:** Stored in `.allure/results` and `.allure/playwright-artifacts` just like local runs.
3. **CI Integration:** No special step needed; the existing Allure report generator works because the artifacts are downloaded to the runner during execution.

---

## 📝 Backlog Draft (CORE vs MAINTENANCE)

### 🔴 CORE (P0 - Blockers)
1. **[DONE] Infrastructure Setup:** Configure `playwright.service.config.ts` and Auth.
2. **[DONE] WAF Bypass:** Implement correct User Agent suffixing in `playwright.fixtures.ts`.
3. **[TODO] CI Pipeline Integration:** Add `azure-pipelines.cloud.yml` dedicated to remote execution.
4. **[TODO] Secret Management:** Rotate and secure `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` in Key Vault.
5. **[TODO] Timeout Tuning:** Baseline performance run to fine-tune `actionTimeout` for remote latency.

### 🟡 MAINTENANCE (P1 - Optimization)
6. **[TODO] Cost Control:** Implement worker limits based on branch type (dev=5, main=50).
7. **[TODO] Flakiness Dashboard:** Separate Allure history for Cloud vs Local to spot "network-only" flakes.
8. **[TODO] Regional Testing:** Configure specific Azure regions for Cinesa (EU-West) vs Other markets.

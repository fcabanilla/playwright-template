# ADR-0011: Multi-Tenant / Market / Environment Refactor

**Status**: Proposed
**Date**: 2025-10-15
**Authors**: [@fcabanilla]
**Reviewers**: [@qa-team]

## Context

We test multiple cinema brands (**tenants**) across different countries (**markets**) and across several lifecycle **environments** (dev/staging/preprod/prod). Cinesa (ES/PT) shares the same codebase and release stream, differing mostly by content, domains, and i18n; UCI (IT) has an independent rollout and divergent flows. Prior ADRs established platform namespaces and unified environment configuration, plus strict Page Object rules (WebActions, separated selectors). This refactor consolidates those lines into a single, explicit multi-tenant/market/environment model while keeping tests free from configuration noise.   

### Background

* **Platform separation** (Cinesa/UCI) already documented; shared vs specific components by namespace. 
* **Environment unification** accepted; Cinesa pattern adopted for UCI (config injection, `TEST_ENV`, overrides). 
* **Architecture rules**: Page Objects never access Playwright API directly, selectors live in `*.selectors.ts`, all browser ops via **WebActions**; assertions may access `page`.   
* **Team conventions** in `copilot-instructions.md` reinforce these boundaries and discourage hardcoded URLs in tests. 

### Forces at Play

* **Clarity & Scalability**: Make tenant/market/env explicit and discoverable; adding a market must not touch tests. 
* **Test Cleanliness**: Specs must read as business scenarios (no env vars, no URL plumbing). 
* **Consistency**: Single pattern across namespaces; reuse the proven environment approach. 
* **Compliance**: Must preserve ADR-0009 rules (WebActions, selector separation). 

## Decision

Adopt a **Runtime Context + URL Factory + Tenant Fixtures** pattern:

1. **Typed Runtime Context** resolved once (e.g., `TENANT`, `MARKET`, `TEST_ENV`), exposed to the framework—not to specs.
2. **URL Factory per tenant** (with optional market) returning typed navigational endpoints; tenant files can override path rules without touching tests.
3. **Tenant-aware Fixtures (DI)** providing the correct Page Objects already bound to **WebActions** and resolved URLs.
4. **Playwright Project Matrix** defining combinations like `cinesa-es`, `cinesa-pt`, `uci-it` per environment, setting env vars centrally.
5. **Clean Specs**: tests import only business fixtures/assertions; no `process.env`, no direct URL building, no conditional branches.

This consolidates ADR-003 (multi-cinema namespaces) + ADR-004 (unified env config) under ADR-0009’s access rules.   

### Considered Alternatives

#### Option A — Keep scattered platform-specific configs

* **Pros**: No refactor now.
* **Cons**: Inconsistencies, config leakage into specs, poor scalability to new markets.
* **Reason for rejection**: Violates DRY and increases cognitive load; ADR-004 already rejected this pattern. 

#### Option B — Monolithic config with `if/else` in tests

* **Pros**: “Simple” visibility of differences.
* **Cons**: Dirty tests, conditional explosions, brittle maintenance; breaks ADR-0009.
* **Reason for rejection**: Opposes clean tests and architectural rules. 

#### Option C — New global abstraction replacing namespaces

* **Pros**: Single façade across brands.
* **Cons**: Over-engineering; duplicates benefits of existing namespaces with limited upside.
* **Reason for rejection**: Unnecessary complexity vs current scope. 

## Consequences

### Positive

* **Spec hygiene**: zero env/URL plumbing inside tests. 
* **Scalability**: add a market by editing config/URL factory only. 
* **Consistency**: single environment pattern across namespaces. 
* **Compliance**: preserves WebActions and selector separation. 

### Negative

* Initial refactor of fixtures/bootstrap and small learning curve for contributors. 

### Neutral

* More Playwright projects (matrix) but improved targeting and reporting by tenant/market.

## Implementation

### Implementation Plan

1. **Define Types & Runtime Context**

   * Add unions for `Tenant`, `Market`, `Environment`; validate inputs once and expose typed values to framework layers (not to specs).
   * Source of truth for base URL/flags (aligned with ADR-004 precedence rules). 

2. **URL Factory**

   * Implement `getUrls(tenant, env, market?)` producing a typed map of routes; keep per-tenant modules for path quirks. (No hardcoded URLs in specs per `copilot-instructions`.) 

3. **Tenant Fixtures (DI)**

   * Create fixtures that instantiate tenant-specific Page Objects using **WebActions** only; assertions may hold `page` (ADR-0009). 

4. **Playwright Project Matrix**

   * Configure projects for `cinesa-es`, `cinesa-pt`, `uci-it` per environment; set env vars centrally so specs remain pure. (Works with your current reporting/debug flows.) 

5. **Spec Cleanup & Lint**

   * Migrate specs to consume fixtures/assertions only; forbid `process.env` reads and URL builders in `tests/**/*.spec.ts`. (Matches your Do/Don’t rules.) 

6. **Docs & Cross-links**

   * Update README and usage docs; cross-reference ADR-003/004/0009 for rationale and enforcement.   

### Success Criteria

* ✅ Specs contain **no** env/URL branching or hardcoded domains. 
* ✅ Switching `TENANT|MARKET|TEST_ENV` changes targets without modifying tests. 
* ✅ New market addition requires config + URL factory edits only (zero spec edits).
* ✅ ADR-0009 rules remain enforced (no `page` in POs, selectors separated). 

### Rollback Plan

* Keep legacy fixtures behind a `LEGACY_FIXTURES=true` toggle for a release; revert branch if instability appears (same mitigation approach used in prior env unification). 

## Notes

### Related Links

* ADR-003: Multi-Cinema Architecture (platform namespaces). 
* ADR-004: Unified Environment Configuration Across Namespaces. 
* ADR-0009: Page Object Architecture and Access Control Rules. 
* Copilot instructions (Do/Don’t; test cleanliness and URL policy). 

### Update

* **Last review**: 2025-10-15 by [@fcabanilla]
* **Next review**: 2025-11-15
* **Implementation status**: Not started

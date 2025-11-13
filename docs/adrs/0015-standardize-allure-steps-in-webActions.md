ADR-0015: Standardize Allure Steps in WebActions

Status: Accepted
Date: 2025-11-12
Authors: @fcabanilla
Reviewers: @cinema-qa-team, @teamlead

Context

Allure steps were authored ad-hoc across the codebase, with inconsistent wording, languages, and structure. This inconsistency hurts:

Diagnostics/Triage (hard to grep, noisy messages).

Observability (steps mix actions, waits and assertions).

Security (sensitive values occasionally exposed).

Traceability (selectors are not referenced by logical keys).

This ADR focuses only on the step format and the WebActions API that emits them. Titles/taxonomy for test names are explicitly out of scope and will be handled by a separate ADR.

Background

WebActions is the single layer allowed to call Playwright APIs (per project rules).

copilot-instructions

Reporting relies on Allure 2 with results in .allure/results and reports in .allure/report.

copilot-instructions

The repository already documents ADR usage and structure.

readme

\_template

Forces at Play

Need for consistent, grep-friendly messages.

Masking of sensitive inputs by default.

Minimal API to avoid friction and keep step authoring centralized.

Non-breaking adoption path for existing suites.

Decision

Adopt a uniform step taxonomy and a thin wrapper API in WebActions enforcing a fixed message format and default masking rules.

Chosen Option

“Taxonomy + Thin Wrapper API”

Step taxonomy (prefixes)

[NAV] – navigation (goto, reload).

[ACT] – user actions (click, fill, select).

[WAIT] – waits/conditions (visible, hidden, enabled).

[ASSERT] – verifications (text, count, url, attribute).

[DATA] – app/test data changes (cookies, storage, flags, seeding).

Canonical message format

[PREFIX] <Verb> | Target=<selectorKey> | <Key=Value>...

Target must be the logical selector key from \*.selectors.ts, never a raw CSS/XPath. (Aligns with our selector location rule.)

copilot-instructions

Extra fields per type:

ACT: Reason=...

FILL: Value=<masked>

WAIT: Timeout=10s

ASSERT: Expected="..."

NAV: URL=/path and optional Via=Navbar

One intention per step (do not mix action + assertion in a single message).

Style rules

English, imperative verbs (consistent with manual test design guidance).

Test Case Design Guidelines

Time units normalized (10s, 500ms).

Sensitive values masked by default.

API (TypeScript)

// core/webactions/steps.ts
import { allure } from 'allure-playwright';

export async function step<T>(title: string, fn: () => Promise<T>): Promise<T> {
return allure.step(title, fn);
}

export function mask(value: string, keepEnd = 4): string {
if (!value) return value;
const tail = value.slice(-keepEnd);
return '•'.repeat(Math.max(0, value.length - keepEnd)) + tail;
}

// core/webactions/webActions.ts (excerpt)
import { Locator, Page, expect } from '@playwright/test';
import { step, mask } from './steps';

export class WebActions {
constructor(private readonly page: Page) {}

async goto(url: string, via?: string) {
const viaStr = via ? ` | Via=${via}` : '';
await step(`[NAV] Goto | URL=${url}${viaStr}`, async () => {
await this.page.goto(url);
});
}

async click(target: Locator, selectorKey: string, reason: string) {
await step(`[ACT] Click | Target=${selectorKey} | Reason=${reason}`, async () => {
await target.click();
});
}

async fill(target: Locator, selectorKey: string, value: string, reason?: string) {
const trimmed = value.length > 80 ? value.slice(0, 80) + '…' : value;
const suffix = reason ? ` | Reason=${reason}` : '';
await step(`[ACT] Fill | Field=${selectorKey} | Value=${mask(trimmed)}${suffix}`, async () => {
await target.fill(value);
});
}

async waitVisible(target: Locator, selectorKey: string, timeoutMs = 10000) {
await step(`[WAIT] Visible | Target=${selectorKey} | Timeout=${(timeoutMs/1000).toFixed(1)}s`, async () => {
await expect(target).toBeVisible({ timeout: timeoutMs });
});
}

async assertText(target: Locator, selectorKey: string, expected: string) {
await step(`[ASSERT] TextEquals | Target=${selectorKey} | Expected="${expected}"`, async () => {
await expect(target).toHaveText(expected);
});
}
}

Considered Alternatives
A) Free-form steps authored in tests

Pros: maximum flexibility.

Cons: inconsistency, hard triage, weak masking discipline.

Reason for rejection: not scalable; contradicts our “single API access via WebActions”.

copilot-instructions

B) Auto-generated steps inferred from POM method names

Pros: less authoring effort.

Cons: poor semantics (no Reason, no explicit Expected, no consistent Target), difficult masking.

Reason for rejection: loses clarity; weakens observability.

Consequences
Positive

Faster triage via consistent, grep-friendly messages.

Better observability: clear separation of NAV/ACT/WAIT/ASSERT/DATA.

Safer logs: default masking for sensitive inputs.

Alignment with architecture: WebActions remains the single Playwright API gateway.

copilot-instructions

Negative

Initial refactor to wrap legacy calls.

Team must follow the message format strictly.

Neutral

No change in test naming/taxonomy (covered in a separate ADR).

Fully compatible with existing Allure workflow and directories.

copilot-instructions

Implementation
Implementation Plan

Add core/webactions/steps.ts; extend core/webactions/webActions.ts with the wrappers above.

Incremental refactor: migrate critical flows first (Seat Picker, F&B, GA4).

Lint guard: introduce a lightweight rule/check that fails CI if step() titles don’t start with one of [NAV], [ACT], [WAIT], [ASSERT], [DATA].

Masking: ensure fill() always masks; add dedicated helpers when partial reveals are required.

Docs: add a short “Good vs Bad” example table in docs/ALLURE_WORKFLOW_CRITICAL.md (appendix) referencing the new format.

copilot-instructions

Success Criteria

100% of Allure steps created via step() and using a valid prefix.

0 occurrences of unmasked sensitive values (spot-check in reports).

Measurable reduction in mean time to classify failures (target: −30%).

All ACT/WAIT/ASSERT steps include Target=<selectorKey>.

Rollback Plan

Keep previous WebActions methods in a fallback branch.

If regressions appear, temporarily relax the lint rule while keeping the API.

Notes
Related Links

ADR template (project) – structure and sections.

\_template

Copilot/Architecture rules enforcing WebActions as single Playwright API surface.

copilot-instructions

Allure directories & workflow (results/report/history).

copilot-instructions

copilot-instructions

Manual test design guidelines (imperative wording).

Test Case Design Guidelines

Update

Last review: 2025-11-12 by @teamlead

Next review: 2026-02-01

Implementation status: In progress

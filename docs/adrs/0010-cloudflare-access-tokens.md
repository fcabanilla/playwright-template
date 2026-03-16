# ADR-0010: Secure Handling of Cloudflare Access Tokens (CF-Access)

**Status**: Proposed (provisionally accepted)
**Date**: 2025-10-15
**Authors**: [@team-qa, @devops]
**Reviewers**: [@security, @release-manager]

## Context

Automated browser tests require Cloudflare Access credentials (`CF-Access-Client-Id`, `CF-Access-Client-Secret`) to authenticate when running against non-production targets (e.g., lab, preprod, staging). These credentials are sensitive and must not be stored in the repository or leaked in logs.

Two concepts must be explicit:

- **Environments**: lifecycle targets where a build/version runs (lab, preprod, staging, production).
- **Deployments / Tenants / Sites**: site instances that may share the same application version but differ in content/configuration (e.g., Cinesa Spain, Cinesa Portugal, Odeon, UCI).

This distinction matters because credentials may be scoped per environment, per deployment, or both. (Environment unification is described in ADR-004.)

## Decision

### Chosen Option

Use **environment variables** for Cloudflare Access credentials and store real values **only** in a secret manager (CI platform or external vault). Adopt a naming convention that supports **per-environment** secrets and, when needed, **per-deployment** overrides.

**Per-environment (single token for all deployments in that env):**

- `CF_ACCESS_CLIENT_ID_<ENV>`
- `CF_ACCESS_CLIENT_SECRET_<ENV>`

**Per-deployment (when required):**

- `CF_ACCESS_CLIENT_ID_<ENV>_<DEPLOYMENT>`
- `CF_ACCESS_CLIENT_SECRET_<ENV>_<DEPLOYMENT>`

**Examples:**

- `CF_ACCESS_CLIENT_ID_LAB`, `CF_ACCESS_CLIENT_SECRET_PREPROD`
- `CF_ACCESS_CLIENT_ID_LAB_CINESA_ES`, `CF_ACCESS_CLIENT_SECRET_PREPROD_CINESA_PT`

**Implementation notes:**

1. Provide `.env.example` documenting variable names (no secret values).
2. Ensure `*.env` y `loggedInState*.json` están en `.gitignore`.
3. In CI, source secrets from the platform’s secret store (e.g., GitHub Actions Secrets) and **map** them to the expected env vars for tests.
4. Code must **read from `process.env` only**, validate presence early, and **fail fast** with a clear error if required variables are missing.
5. Prefer the most specific key (ENV + DEPLOYMENT) and **fallback** to per-environment if the specific one is absent.
6. Define ownership and rotation workflows for each stored secret.

(Cloudflare handling constraints—headed mode, workers=1—remain process guidance, not part of secret storage; see project instructions.)

## Considered Alternatives

**A — Store tokens in repo (encrypted or not)**

- **Pros**: Simpler local setup.
- **Cons**: High leakage risk, key reuse, audit gaps.
- **Rejection**: Violates security best practices.

**B — Single global token for all envs and deployments**

- **Pros**: Minimal setup.
- **Cons**: Blast radius too large; complicates revocation.
- **Rejection**: Poor isolation; operational risk.

**C — Runtime prompts / manual input**

- **Pros**: Zero at-rest storage.
- **Cons**: Breaks CI; error-prone; no audit trail.
- **Rejection**: Incompatible with automated pipelines.

## Consequences

### Positive

- Clear scoping (env vs deployment); easier rotation and revocation.
- CI-friendly; no secrets in repo or logs.
- Early validation reduces flaky runs.

### Negative

- Slightly more naming/management overhead (matrix of env × deployment).

### Neutral

- Local dev requires minimal secret bootstrapping (via `.env` excluded from VCS).

## Implementation

### Implementation Plan

1. **Secret Naming & Storage**

   - Create secrets in the chosen secret manager following the conventions above.
   - Record owner, purpose, creation/rotation dates.

2. **Repository Setup**

   - Add `.env.example` with all expected keys (no values).
   - Confirm `.gitignore` includes `*.env` y `loggedInState*.json`.

3. **CI Mapping**

   - Map platform secrets (e.g., `secrets.CF_ACCESS_CLIENT_ID_LAB`) to env vars consumed by tests/jobs.

4. **Code Changes**

   - Read keys from `process.env`. Prefer `<ENV>_<DEPLOYMENT>`; fallback to `<ENV>`.
   - Fail fast with a clear message if missing (do not log secret values).
   - Keep Cloudflare usage patterns outside of secret storage logic (see framework guidance).

5. **Docs**

   - Update project docs with variable list and rotation playbook.
   - Cross-link ADR-004 (env model) and Cloudflare testing guidance.

### Success Criteria

- `.env.example` present and accurate.
- Secrets consumed from secret manager in CI; none stored in repo.
- Test startup fails clearly when secrets are missing.
- No secret values in logs or artifacts.

### Rollback Plan

- If the mapping breaks CI, temporarily disable Cloudflare-protected suites or inject per-job temporary tokens while fixing mapping. No repo commits with secrets.

## Rotation & Incident Handling

- **Rotation**: At least every 90 days or on ownership change.
- **Incident**: If exposure is suspected, **revoke and rotate immediately**, audit usage, and notify security/on-call per process.

## Notes

### Related Links

- ADR-004: Unified Environment Configuration Across Namespaces.
- Project guidance on Cloudflare handling (headed mode, workers=1).

### Update

- **Last review**: 2025-10-15 by [@team-qa]
- **Next review**: 2025-11-15
- **Implementation status**: Not started

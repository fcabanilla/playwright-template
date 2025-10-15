# Cloudflare diagnostics and test helpers

This folder contains diagnostic Playwright tests and helpers used to validate
Cloudflare Access behavior across environments and to provide safe, repeatable
ways to inject Cloudflare Access headers when credentials are available.

## Overview

- Purpose: verify whether target environments are protected by Cloudflare Access
   and, when credentials are present, exercise the site while injecting the
   required HTTP headers to bypass Cloudflare Access.
- Tests are designed to be safe for CI: they never print secret values and they
   tolerate missing session files or DNS resolution errors.

## Key files

- `check-cf-headers.spec.ts` - Iterates a list of environments, optionally
   injects Cloudflare Access headers (CF-Access-Client-Id / CF-Access-Client-Secret)
   when credentials exist in environment variables, and asserts whether the
   navigation gets redirected to a Cloudflare challenge page.

- `test-lab-storage.spec.ts` - Minimal storageState checks and navigation
   smoke tests used during diagnostics. Uses guarded storageState logic to avoid
   failing when `loggedInState*.json` files are not present (these files are
   intentionally gitignored and usually generated locally).

## Design notes

- Environment variables for Cloudflare Access are documented in the project
   `.env.example`. The lookup precedence is:

   1. Per-deployment: `CF_ACCESS_CLIENT_ID_<ENV>_<DEPLOYMENT>` and
       `CF_ACCESS_CLIENT_SECRET_<ENV>_<DEPLOYMENT>`
   2. Per-environment: `CF_ACCESS_CLIENT_ID_<ENV>` and
       `CF_ACCESS_CLIENT_SECRET_<ENV>`

- Secrets are never logged. Tests will log which environment variable key was
   used (if any), but will not print the secret value itself.

- Storage state files (`loggedInState*.json`) are gitignored. The test suite
   will only pass a `storageState` option to Playwright if the corresponding
   file exists on disk. This prevents ENOENT failures in CI when state files
   are not present.

## How to run locally

1. Populate a local `.env` with any Cloudflare Access credentials you want to
    test with (do not commit this file):

```text
CF_ACCESS_CLIENT_ID_lab=c0ffee...
CF_ACCESS_CLIENT_SECRET_lab=deadbeef...
```

1. Run the specific tests in headed mode so you can observe the browser:

```bash
# Load .env then run in headed mode
TEST_ENV=lab npx playwright test tests/cinesa/cloudflare/check-cf-headers.spec.ts --headed
```

1. If you prefer headless runs for CI, ensure CI secrets are configured using
    the same env var names and run without `--headed`.

## Expected behavior

- If Cloudflare Access is active and no credentials are provided, tests will
   detect redirection to a Cloudflare page and report the environment as
   protected.
- If credentials are provided via environment variables and valid, the tests
   will inject the headers and navigation should proceed without the Cloudflare
   challenge.
- If DNS for an environment is not resolvable from the runner, the test will
   log the resolution error and skip that environment rather than failing the
   entire suite.

## Notes for CI

- Add the appropriate `CF_ACCESS_*` secrets to the CI environment variables
   following the precedence used by the validator. The tests will fail fast
   during fixture setup if a required credential is missing only when the test
   explicitly requires it.

## Contact

If you need help adding credentials or integrating the validator into the
Playwright fixtures, ping the automation team.
 # Cloudflare diagnostics and test helpers

 This folder contains diagnostic Playwright tests and helpers used to validate
 Cloudflare Access behavior across environments and to provide safe, repeatable
 ways to inject Cloudflare Access headers when credentials are available.

 ## Overview

 - Purpose: verify whether target environments are protected by Cloudflare Access
 and, when credentials are present, exercise the site while injecting the
 required HTTP headers to bypass Cloudflare Access.
 - Tests are designed to be safe for CI: they never print secret values and they
 tolerate missing session files or DNS resolution errors.

 ## Key files

 - `check-cf-headers.spec.ts` - Iterates a list of environments, optionally
 injects Cloudflare Access headers (CF-Access-Client-Id / CF-Access-Client-Secret)
 when credentials exist in environment variables, and asserts whether the
 navigation gets redirected to a Cloudflare challenge page.

 - `test-lab-storage.spec.ts` - Minimal storageState checks and navigation
 smoke tests used during diagnostics. Uses guarded storageState logic to avoid
 failing when `loggedInState*.json` files are not present (these files are
 intentionally gitignored and usually generated locally).

 ## Design notes

 - Environment variables for Cloudflare Access are documented in the project
 `.env.example`. The lookup precedence is:

   1. Per-deployment: `CF_ACCESS_CLIENT_ID_<ENV>_<DEPLOYMENT>` and
      `CF_ACCESS_CLIENT_SECRET_<ENV>_<DEPLOYMENT>`
   2. Per-environment: `CF_ACCESS_CLIENT_ID_<ENV>` and
      `CF_ACCESS_CLIENT_SECRET_<ENV>`

 - Secrets are never logged. Tests will log which environment variable key was
 used (if any), but will not print the secret value itself.

 - Storage state files (`loggedInState*.json`) are gitignored. The test suite
 will only pass a `storageState` option to Playwright if the corresponding
 file exists on disk. This prevents ENOENT failures in CI when state files
 are not present.

 ## How to run locally

 1. Populate a local `.env` with any Cloudflare Access credentials you want to
    test with (do not commit this file):

    ```text
    CF_ACCESS_CLIENT_ID_lab=c0ffee...
    CF_ACCESS_CLIENT_SECRET_lab=deadbeef...
    ```

 1. Run the specific tests in headed mode so you can observe the browser:

    ```bash
    # Load .env then run in headed mode
    TEST_ENV=lab npx playwright test tests/cinesa/cloudflare/check-cf-headers.spec.ts --headed
    ```

 1. If you prefer headless runs for CI, ensure CI secrets are configured using
    the same env var names and run without `--headed`.

 ## Expected behavior

 - If Cloudflare Access is active and no credentials are provided, tests will
 detect redirection to a Cloudflare page and report the environment as
 protected.
 - If credentials are provided via environment variables and valid, the tests
 will inject the headers and navigation should proceed without the Cloudflare
 challenge.
 - If DNS for an environment is not resolvable from the runner, the test will
 log the resolution error and skip that environment rather than failing the
 entire suite.

 ## Notes for CI

 - Add the appropriate `CF_ACCESS_*` secrets to the CI environment variables
 following the precedence used by the validator. The tests will fail fast
 during fixture setup if a required credential is missing only when the test
 explicitly requires it.

 ## Contact

 If you need help adding credentials or integrating the validator into the
 Playwright fixtures, ping the automation team.

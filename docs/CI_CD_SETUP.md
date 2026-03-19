# Azure DevOps CI/CD Setup

This project is prepared to run on Azure DevOps using Playwright Workspaces inside Azure App Testing.

## What this pipeline does

- Runs Playwright tests on cloud-hosted browsers through Playwright Workspaces.
- Uses Microsoft Entra authentication through an Azure Resource Manager service connection.
- Publishes `.allure/results`, `.allure/report`, and `.allure/playwright-artifacts` as pipeline artifacts.
- Supports production by default, with optional preprod and lab jobs.

## Files involved

- `azure-pipelines.yml`
- `playwright.service.config.ts`
- `package.json`

## Azure prerequisites

1. Create or reuse a Playwright Workspace in Azure App Testing.
2. Create an Azure DevOps Azure Resource Manager service connection with access to that workspace.
3. Define pipeline or variable group secrets for:
   - `PLAYWRIGHT_SERVICE_URL`
   - `CF_ACCESS_CLIENT_ID_PREPROD`
   - `CF_ACCESS_CLIENT_SECRET_PREPROD`
   - `CF_ACCESS_CLIENT_ID_LAB`
   - `CF_ACCESS_CLIENT_SECRET_LAB`

`PLAYWRIGHT_SERVICE_ACCESS_TOKEN` is optional. The pipeline is designed to use Microsoft Entra authentication by default.

## Environment variables in Azure DevOps

Do not copy the full local `.env` file into Azure DevOps.

Use only the subset required by the jobs you want to run:

- Always required for cloud execution: `PLAYWRIGHT_SERVICE_URL`
- Recommended for consistent runtime metadata: `USE_PLAYWRIGHT_SERVICE=true`
- Required only for `preprod` jobs: `CF_ACCESS_CLIENT_ID_PREPROD`, `CF_ACCESS_CLIENT_SECRET_PREPROD`
- Required only for `lab` jobs: `CF_ACCESS_CLIENT_ID_LAB`, `CF_ACCESS_CLIENT_SECRET_LAB`
- Optional only if you choose token auth instead of Microsoft Entra: `PLAYWRIGHT_SERVICE_ACCESS_TOKEN`

Only replicate test-account variables from the local `.env` if the suites you plan to run in Azure DevOps actually need login, checkout, or identity data.

## Recommended Azure DevOps variable groups

Create one shared variable group for cloud execution:

- `PLAYWRIGHT_SERVICE_URL`

Create one secret variable group for non-production environments:

- `CF_ACCESS_CLIENT_ID_PREPROD`
- `CF_ACCESS_CLIENT_SECRET_PREPROD`
- `CF_ACCESS_CLIENT_ID_LAB`
- `CF_ACCESS_CLIENT_SECRET_LAB`

If Portugal or deployment-specific Cloudflare credentials are needed later, add the more specific variables already supported by the repo naming convention.

## Recommended first runs

### Pull requests

- `grep = @smoke`
- `workers = 10`
- `runPreprod = false`
- `runLab = false`

### Manual validation before release

- `grep = @critical`
- `workers = 10` or `15`
- `runPreprod = true`
- `runLab = false`

### Full non-production validation

- `grep = @smoke|@critical`
- `workers = 5` to `10`
- `runPreprod = true`
- `runLab = true`

## Important implementation notes

1. `report:ci` must be used in CI because `report` ends with `report:open`, which is only valid on a developer machine.
2. The pipeline sets `PLAYWRIGHT_RUN_ID` from Azure DevOps build metadata so cloud executions can be correlated back to the job.
3. `PLAYWRIGHT_SERVICE_URL` is still required even when authentication uses Microsoft Entra.
4. Preprod and lab jobs require Cloudflare credentials.

## After adding the YAML to the repo

1. Push the branch containing `azure-pipelines.yml`.
2. Create a new pipeline in Azure DevOps pointing to `azure-pipelines.yml` in the repository root.
3. Select the Azure service connection expected by the `azureServiceConnection` parameter, or override the parameter with your actual connection name.
4. Link the required variable groups or add the variables directly to the pipeline.
5. Run the pipeline manually with production only first.

## Current limitations of the MVP

- The YAML duplicates job steps per environment to keep the first version explicit and easy to debug.
- Allure history is generated locally from current artifacts only; long-term trend persistence can be improved later by downloading artifacts from previous runs.
- The pipeline assumes Microsoft-hosted Ubuntu agents.

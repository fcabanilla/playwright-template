# Prompt Files

Prompt files are **reusable, guided workflows** for common tasks. They provide structured, step-by-step instructions to Copilot for generating code or performing analysis with full project-specific context.

## How to Use

In **Copilot Chat**, type `#` followed by the prompt name:

```text
# new-component
```

Copilot will prompt you for any required inputs (marked with `${input:variableName}` in the file) and then execute the workflow.

## Available Prompts

### Scaffolding & Creation

| Prompt                  | Command                 | Inputs                      | Description                                                                                                                                                        |
| ----------------------- | ----------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **New Component**       | `# new-component`       | `componentName`, `platform` | Scaffolds a complete component: POM, selectors, spec, assertions, data, and fixture registration. Follows all architecture rules automatically.                    |
| **Add Cinema Config**   | `# add-cinema-config`   | `cinemaName`                | Adds a new cinema to `config/cinemas.config.ts` with POM method, selector, and environment availability. Existing parametrized tests auto-discover the new cinema. |
| **Create Booking Test** | `# create-booking-test` | `cinemaName`, `testType`    | Generates a parametrized E2E booking flow test covering the full Movies → Cinema → Seats → Tickets → Bar → Summary → Payment journey.                              |

### Refactoring & Migration

| Prompt                  | Command                 | Inputs          | Description                                                                                                                                                                        |
| ----------------------- | ----------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Migrate Page Object** | `# migrate-page-object` | `componentPath` | Step-by-step guide to migrate a legacy POM from direct `page` access to the WebActions-only pattern (ADR-0009). Includes selector extraction, method mapping, and fixture updates. |

### Debugging & Operations

| Prompt                     | Command                    | Inputs                    | Description                                                                                                                                                       |
| -------------------------- | -------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Allure Report Workflow** | `# allure-report-workflow` | `environment`, `testPath` | The correct step-by-step workflow for Allure report generation: clean results → run tests → copy history → generate → open. Prevents the common accumulation bug. |
| **Debug Cloudflare**       | `# debug-cloudflare`       | `environment`             | Diagnostic guide for Cloudflare protection issues on preprod/lab environments. Includes symptom → cause → fix table and storage state regeneration steps.         |

### Analysis & Quality

| Prompt                   | Command                  | Inputs     | Description                                                                                                                                                                                   |
| ------------------------ | ------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Review Test Coverage** | `# review-test-coverage` | `platform` | Comprehensive coverage analysis: scans test files, counts test cases, checks assertions/data file existence, evaluates tag distribution, Allure label compliance, and generates a gap report. |

### Traceability & Project Management

| Prompt                 | Command                | Inputs                               | Description                                                                                                                                                                                                                                        |
| ---------------------- | ---------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create JIRA Ticket** | `# create-jira-ticket` | `ticketType`, `component`, `summary` | Generates structured, copy-paste-ready JIRA ticket text with Description, Acceptance Criteria, Technical Notes, Test Strategy, and Definition of Done — all aligned with project conventions. Supports Epic, Story, Task, Bug, and Sub-task types. |

### Documentation

| Prompt        | Command       | Inputs     | Description                                                                                                                                                   |
| ------------- | ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Add JSDoc** | `# add-jsdoc` | `filePath` | Adds or fixes JSDoc for all public methods in a WebActions or Page Object file. Enforces the project standard: `@param`, `@returns`, `@throws`, English only. |

### Setup & Onboarding

| Prompt                          | Command                         | Inputs                                                | Description                                                                                                                                                                                                                                                              |
| ------------------------------- | ------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Replicate Copilot Ecosystem** | `# replicate-copilot-ecosystem` | `projectName`, `techStack`, `architectureDescription` | Designs and generates a complete Copilot customization ecosystem for any new project from scratch — global instructions, path-specific rules, reusable prompts, and custom agents. Pure plan mode: output is fully copy-pasteable code blocks, no file editing required. |

## Input Variables

Prompts use `${input:variableName}` for dynamic inputs. When you invoke a prompt, Copilot asks you to fill in each variable:

| Variable                           | Example Values                                            | Used By                                  |
| ---------------------------------- | --------------------------------------------------------- | ---------------------------------------- |
| `${input:componentName}`           | `loyaltyCard`, `giftCards`                                | new-component                            |
| `${input:platform}`                | `cinesa`, `uci`                                           | new-component, review-test-coverage      |
| `${input:environment}`             | `production`, `preprod`, `lab`                            | allure-report-workflow, debug-cloudflare |
| `${input:cinemaName}`              | `Grancasa`, `Oasiz`                                       | add-cinema-config, create-booking-test   |
| `${input:testPath}`                | `seatPicker/seatPicker.spec.ts`                           | allure-report-workflow                   |
| `${input:componentPath}`           | `movies`, `bar`                                           | migrate-page-object                      |
| `${input:testType}`                | `smoke`, `e2e`                                            | create-booking-test                      |
| `${input:ticketType}`              | `Epic`, `Story`, `Task`, `Bug`                            | create-jira-ticket                       |
| `${input:summary}`                 | `Add loyalty card component tests`                        | create-jira-ticket                       |
| `${input:filePath}`                | `pageObjectsManagers/cinesa/navbar/navbar.page.ts`        | add-jsdoc                                |
| `${input:techStack}`               | `React + TypeScript + Vitest`, `Node.js + Express + Jest` | replicate-copilot-ecosystem              |
| `${input:architectureDescription}` | `Feature-based monorepo with services/hooks/components/`  | replicate-copilot-ecosystem              |

## Usage Examples

### Scaffold a new "Gift Cards" component for Cinesa

```text
# In Copilot Chat:
# new-component

# When prompted:
# componentName → giftCards
# platform → cinesa
```

Copilot generates all 6 files (POM, selectors, spec, assertions, data, fixture registration) following all architecture rules.

### Add a new cinema called "Nassica"

```text
# In Copilot Chat:
# add-cinema-config

# When prompted:
# cinemaName → Nassica
```

Copilot updates `cinemas.config.ts`, adds the POM method, updates selectors, and all parametrized tests auto-discover it.

### Debug a Cloudflare issue on preprod

```text
# In Copilot Chat:
# debug-cloudflare

# When prompted:
# environment → preprod
```

Copilot runs diagnostics and provides a targeted fix based on symptoms.

## Creating a New Prompt

1. Create a `*.prompt.md` file in this directory
2. Add YAML frontmatter with a `description`:

```yaml
---
description: 'Short description shown in the prompt picker'
---
```

1. Use `${input:varName}` for any values the user should provide
1. Write step-by-step instructions in markdown
1. Reference specific file paths and real patterns from the codebase for best results
1. The prompt appears in the `#` picker immediately — no registration needed

## Tips

- **Combine prompts:** Scaffold with `# new-component`, then verify with `# review-test-coverage`
- **Reference models:** Prompts that mention specific reference files (like `navbar.page.ts`) produce better results
- **Include architecture rules:** The more constraints you specify, the more compliant the output
- **Be specific with paths:** Use exact paths like `pageObjectsManagers/cinesa/{componentName}/` rather than generic references

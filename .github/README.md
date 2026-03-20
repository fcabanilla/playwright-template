# GitHub Copilot Customization Ecosystem

This directory contains the complete **GitHub Copilot customization ecosystem** for the Cinema Multi-Platform Test Automation framework. It provides AI-assisted tooling across multiple layers to help the team write, debug, review, and maintain Playwright tests faster and with architectural consistency.

## Directory Structure

```text
.github/
├── README.md                    ← You are here
├── copilot-instructions.md      ← Global instructions (all interactions)
├── CODEOWNERS                   ← Code ownership rules
├── instructions/                ← Path-specific instructions (10 files)
├── prompts/                     ← Reusable prompt files (10 files)
└── agents/                      ← Custom AI agents (8 files)
```

## How It Works

GitHub Copilot supports multiple customization mechanisms. This project uses 3 of them:

| Mechanism                      | Directory                 | Activation                                 | Purpose                                              |
| ------------------------------ | ------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Global Instructions**        | `copilot-instructions.md` | Always active                              | Base rules for every Copilot interaction             |
| **Path-Specific Instructions** | `instructions/`           | Auto-activated when editing matching files | Layer-specific rules (POMs, tests, selectors, etc.)  |
| **Prompt Files**               | `prompts/`                | Invoked manually via `#` in chat           | Guided workflows (scaffold component, debug, report) |
| **Custom Agents**              | `agents/`                 | Invoked via `@agent-name` in chat          | Specialized AI agents for complex tasks              |

## Quick Start

### Path-Specific Instructions (automatic)

Just edit any file — Copilot automatically loads the matching instructions:

- Edit a `*.page.ts` → WebActions-only rules load automatically
- Edit a `*.spec.ts` → Fixture imports, Allure labels, tag rules load automatically
- Edit a `*.selectors.ts` → Selector strategy rules load automatically

No setup required. See [`instructions/README.md`](instructions/README.md) for the full list.

### Prompt Files (manual — `#` command)

In Copilot Chat, type `#` and select a prompt:

| Command                         | Description                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `# new-component`               | Scaffold a complete new component (POM, selectors, spec, assertions, data, fixture) |
| `# add-cinema-config`           | Add a cinema to the parametrized test configuration                                 |
| `# create-booking-test`         | Generate an E2E booking flow test                                                   |
| `# migrate-page-object`         | Migrate a legacy POM from `page` to WebActions pattern                              |
| `# allure-report-workflow`      | Step-by-step Allure report generation workflow                                      |
| `# debug-cloudflare`            | Diagnose Cloudflare protection issues                                               |
| `# review-test-coverage`        | Analyze test coverage gaps across components                                        |
| `# create-jira-ticket`          | Generate structured JIRA ticket text ready to copy-paste                            |
| `# add-jsdoc`                   | Add or fix JSDoc for all public methods in a WebActions or Page Object file         |
| `# replicate-copilot-ecosystem` | Design and generate a complete Copilot ecosystem for any new project (plan only)    |

See [`prompts/README.md`](prompts/README.md) for details and input variables.

### Custom Agents (manual — `@` command)

In Copilot Chat, type `@` and select an agent:

| Command                   | Specialty                                                              |
| ------------------------- | ---------------------------------------------------------------------- |
| `@test-architect`         | Design test strategy & review coverage                                 |
| `@page-object-refactorer` | Migrate legacy POMs to WebActions pattern                              |
| `@allure-specialist`      | Fix Allure labels, steps, and report issues                            |
| `@booking-flow-tester`    | Specialist in the Movies → Payment booking flow                        |
| `@docs-auditor`           | Audit documentation staleness & consistency (plan-first)               |
| `@pr-reviewer`            | In-depth Pull Request code review (Claude Sonnet 4)                    |
| `@test-debugger`          | Diagnose and fix failing Playwright tests                              |
| `@jsdoc-specialist`       | Audit and fix JSDoc coverage in WebActions & Page Objects (plan-first) |

See [`agents/README.md`](agents/README.md) for detailed descriptions and use cases.

## Architecture Alignment

All customization files enforce the project's strict layered architecture:

```text
Tests/Assertions → Page Objects → WebActions → Playwright API
```

Key rules enforced across all tools:

- Page Objects **NEVER** access `page` directly — only through `WebActions`
- Selectors live in separate `*.selectors.ts` files — no inline selectors
- Tests import `test` from **fixtures**, never from `@playwright/test`
- Allure 2 API only — `import { allure }` (not `import * as allure`)
- All code in **English**
- Middot (·) test naming convention

## For New Team Members

1. **Install VS Code** with the **GitHub Copilot extension** (ensure Chat is enabled)
2. Path-specific instructions activate **automatically** — no configuration needed
3. Try a prompt: type `# new-component` in Copilot Chat to scaffold a component
4. Read the README in each subdirectory for in-depth documentation
5. Review `copilot-instructions.md` to understand all project conventions

## Maintenance Guide

| Task                        | Action                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------- |
| Add layer-specific rules    | Create/edit a file in `instructions/` with `applyTo` frontmatter                   |
| Add a new guided workflow   | Create a `.prompt.md` in `prompts/` with `description` frontmatter                 |
| Add a new AI specialist     | Create an `.agent.md` in `agents/` with `name`, `description`, `tools` frontmatter |
| Change global project rules | Update `copilot-instructions.md`                                                   |

## References

- [GitHub Docs — Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [GitHub Docs — Prompt Files](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-prompt-files)
- [GitHub Docs — Custom Agents](https://docs.github.com/en/copilot/customizing-copilot/building-copilot-agent-mode-agents)
- [GitHub Docs — Customization Cheat Sheet](https://docs.github.com/en/copilot/customizing-copilot/customization-cheat-sheet)

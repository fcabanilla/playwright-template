# Custom Agents

Custom agents are **specialized AI assistants** with deep domain knowledge and access to specific tools. Unlike prompts (one-shot workflows), agents maintain conversation context and can perform multi-step autonomous work — reading files, searching code, running commands, and even editing files.

## How to Use

In **Copilot Chat**, type `@` followed by the agent name, then your question:

```
@test-architect What tests should I write for the new loyalty card component?
```

The agent uses its configured tools (file search, terminal, code editing) to research the codebase and provide expert, context-aware guidance.

## Available Agents

### @test-architect

> Designs test strategy, proposes test cases, validates architecture compliance, and reviews test coverage.

**Best for:**

- "What tests should I write for component X?"
- "Review the test coverage for the booking flow"
- "Does this test follow our architecture rules?"
- "Propose a test strategy for the new feature"

**Tools:** `search/codebase`, `read/readFile`, `search/textSearch`, `search/fileSearch`, `execute/runInTerminal`

**Domain knowledge:** Layered architecture (ADR-0009), Allure label hierarchy, middot naming convention, tag system (`@smoke`, `@critical`, `@e2e`), data-driven parametrization patterns, component structure, booking flow sequence.

---

### @page-object-refactorer

> Migrates legacy Page Objects from direct `page` access to the WebActions-only pattern.

**Best for:**

- "Refactor MoviePage to use WebActions instead of page"
- "Extract selectors from this POM into a separate selectors file"
- "Is this Page Object compliant with ADR-0009?"
- "Show me all POMs that still use `this.page` directly"

**Tools:** `search/codebase`, `read/readFile`, `search/textSearch`, `search/fileSearch`, `edit/editFiles`, `edit/createFile`

**Domain knowledge:** WebActions method-to-Playwright mapping, selector extraction patterns, `allure.step()` wrapping, fixture update procedures. Uses `navbar.page.ts` as the gold-standard reference.

**Can edit files:** Yes — this agent can create selectors files and refactor POM code directly.

---

### @allure-specialist

> Manages Allure 2 reporting — fixes label hierarchies, validates step taxonomy, troubleshoots report generation.

**Best for:**

- "Tests appear 'loose' in the Allure report — fix the labels"
- "Add proper epic/feature/story to all tests in this component"
- "The Allure report shows accumulated results — how do I fix it?"
- "Validate the step taxonomy in WebActions"
- "What's the correct report generation workflow?"

**Tools:** `search/codebase`, `read/readFile`, `search/textSearch`, `search/fileSearch`, `execute/runInTerminal`, `edit/editFiles`

**Domain knowledge:** Allure 2 API (not v3), step taxonomy `[NAV]/[ACT]/[WAIT]/[ASSERT]/[DATA]`, standardized feature names per component, directory structure (`.allure/results/`, `.allure/report/`, `.allure/report/history/`), history preservation, results accumulation behavior.

**Can edit files:** Yes — can add missing Allure labels to test files.

---

### @booking-flow-tester

> Specialist in the complete cinema booking flow from movie selection through payment.

**Best for:**

- "Debug why the seat picker test fails on Oasiz cinema"
- "Create a new booking flow test for Grancasa"
- "Which booking steps have implicit vs explicit test coverage?"
- "The payment step times out on preprod — help diagnose"
- "How does cinema parametrization work?"

**Tools:** `search/codebase`, `read/readFile`, `search/textSearch`, `search/fileSearch`, `execute/runInTerminal`

**Domain knowledge:** Full booking sequence (Movies → Cinemas → SeatPicker → TicketPicker → Bar → PurchaseSummary → Payment), cinema parametrization via `getCinemasForEnvironment()`, environment differences (production vs preprod/lab), Cloudflare handling, fixture dependencies, test card usage.

---

### @docs-auditor

> Audits all Markdown documentation for staleness, broken references, inconsistencies, and outdated information — proposes fixes but never modifies without explicit approval.

**Best for:**

- "Are there any dead links or ghost references in the docs?"
- "Which ADRs have overdue review dates?"
- "Audit all README files for accuracy against the actual codebase"
- "Find duplicate or contradictory information across docs"
- "Is the fixture count in AGENTS.md still accurate?"

**Tools:** `search/codebase`, `read/readFile`, `search/textSearch`, `search/fileSearch`, `execute/runInTerminal`, `edit/createFile`, `edit/editFiles`

**Domain knowledge:** 8 staleness categories (ghost references, stale dates, counter drift, version drift, empty/stub files, duplicates, unresolved TODOs, cross-doc inconsistencies), project documentation map (89+ `.md` files), sources of truth (`package.json`, fixtures, config files, test directories).

**Can edit files:** Yes — but **only after presenting a plan and receiving explicit user approval**. Follows a strict 3-phase workflow: Audit (read-only) → Plan (propose fixes) → Execute (apply approved changes).

---

### @pr-reviewer

> Performs in-depth Pull Request code reviews with structured, checklist-based analysis using Claude Sonnet 4.

**Best for:**

- "Review this PR for architectural violations"
- "Check if the changes follow SOLID principles"
- "Are there any security issues in this diff?"
- "Do the changes have adequate test coverage?"

**Tools:** `search/codebase`, `search/fileSearch`, `read/readFile`, `search/textSearch`, `web/githubRepo`, `search`, `search/usages`, `search/changes`

**GitHub PR tools:** `github/assign_copilot_to_issue`, `github/create_pull_request`, `github/create_pull_request_with_copilot`, `github/list_pull_requests`, `github/merge_pull_request`, `github/request_copilot_review`, `github/search_pull_requests`, `github/update_pull_request`, `github/update_pull_request_branch`

**Domain knowledge:** Clean code principles, design patterns (Repository, Factory, Strategy, Observer), SOLID/DRY, security review (injection, secrets, dependencies), performance analysis (N+1, O(n²)), structured review output (Summary → Architectural → Technical → Testing → Next Steps).

**Can edit files:** No — read-only analysis with max 15 comments per review.

---

### @test-debugger

> Diagnoses failing Playwright tests by analyzing error logs, traces, and Allure reports with environment-aware context.

**Best for:**

- "This test fails with TimeoutError on preprod but passes on production"
- "Help me debug the seat picker test for Oasiz"
- "I'm getting strict mode violation in my selectors"
- "Navigation timeout on lab environment — Cloudflare issue?"

**Tools:** `search/codebase`, `read/readFile`, `search/textSearch`, `search/fileSearch`, `execute/runInTerminal`

**Domain knowledge:** Common Playwright failure patterns (TimeoutError, strict mode, navigation), environment-specific issues (Cloudflare on preprod/lab, stale data on production), component chain tracing (spec → fixture → POM → webActions → selector), debugging commands (`--debug`, `--trace on`, `--headed`).

---

### @jsdoc-specialist

> Audits JSDoc coverage and quality across WebActions and Page Objects — detects missing docs, incomplete tags, and Spanish text — proposes fixes before applying.

**Best for:**

- "Audit all Page Objects for missing JSDoc"
- "Fix the incomplete @param and @returns in seatPicker.page.ts"
- "Some JSDoc comments are in Spanish — find and fix them all"
- "What percentage of public methods in WebActions are documented?"
- "Add JSDoc to navbar.page.ts following the project standard"

**Tools:** `search/codebase`, `read/readFile`, `search/textSearch`, `search/fileSearch`, `execute/runInTerminal`, `edit/editFiles`

**Domain knowledge:** 5 issue categories (missing class JSDoc, undocumented public methods, missing tags, Spanish in docs, incomplete private docs), project JSDoc standard (based on `webActions.ts` gold standard), required tags (`@param`, `@returns`, `@throws`), English-only rule.

**Can edit files:** Yes — but **only after presenting the audit report and receiving explicit user approval**. Follows the same 3-phase workflow as `@docs-auditor`: Audit → Plan → Execute.

## Agent vs Prompt — When to Use Which?

| Use Case                                | Agent (`@`) | Prompt (`#`) |
| --------------------------------------- | :---------: | :----------: |
| Complex multi-step research             |     ✅      |              |
| Generate a specific file/component      |             |      ✅      |
| Ongoing conversation about architecture |     ✅      |              |
| Quick scaffold with guided inputs       |             |      ✅      |
| Debug a failing test interactively      |     ✅      |              |
| One-shot report or analysis             |             |      ✅      |
| Refactor existing code                  |     ✅      |              |
| Follow a predefined workflow            |             |      ✅      |

**Rule of thumb:** Use **prompts** for predictable, template-based tasks. Use **agents** for open-ended investigation, debugging, and refactoring.

## Usage Examples

### Ask test-architect to design tests

```
@test-architect I'm adding a new "Gift Cards" component to Cinesa.
It has a list page, a detail page, and a redemption flow.
What tests should I write and how should I structure them?
```

### Ask page-object-refactorer to migrate a POM

```
@page-object-refactorer Please refactor pageObjectsManagers/cinesa/mailing/mailing.page.ts
to use WebActions instead of direct page access. It's currently a legacy POM.
```

### Ask allure-specialist to fix labels

```
@allure-specialist The seatPicker tests appear loose in the Allure report.
They're missing allure.story() labels. Can you add them?
```

### Ask booking-flow-tester to debug

```
@booking-flow-tester The seat selection test for Oasiz fails with
"TimeoutError: locator.click" on preprod. The same test passes on production.
Help me figure out why.
```

### Ask docs-auditor to audit the docs

```
@docs-auditor Run a full audit of all Markdown files in the project.
I want to know about dead links, stale dates, and any information
that contradicts what's actually in the codebase.
```

### Ask pr-reviewer to review a PR

```
@pr-reviewer Review the current PR changes. Focus on architectural
compliance with our layered architecture and check for any
security issues or missing tests.
```

### Ask test-debugger to diagnose a failure

```
@test-debugger The seat selection test for Oasiz fails with
"TimeoutError: locator.click" on preprod. The same test passes
on production. Help me figure out why.
```

### Ask jsdoc-specialist to audit documentation

```
@jsdoc-specialist Audit all Page Object files in pageObjectsManagers/cinesa/
for missing or incomplete JSDoc. I want to know which public methods
have no documentation and which have Spanish text in their comments.
```

## Creating a New Agent

1. Create a `*.agent.md` file in this directory
2. Add YAML frontmatter:

```yaml
---
name: agent-name
description: "Short description of the agent's specialty"
tools:
  - search/codebase
  - read/readFile
  - search/textSearch
  - search/fileSearch
  - execute/runInTerminal
  # Add edit/editFiles and edit/createFile if the agent should edit code
---
```

3. Write the agent's system prompt in markdown — include:
   - Role description and responsibilities
   - Domain-specific knowledge and rules
   - Reference files and architecture patterns
   - What it should and should NOT do
4. The agent is immediately available via `@agent-name` in chat

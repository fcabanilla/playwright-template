---
description: 'Generate structured JIRA ticket text (Epic, Story, Task, Bug) ready to copy-paste'
---

# Create JIRA Ticket

Generate a complete, copy-paste-ready JIRA ticket for the following work:

- **Type**: ${input:ticketType} (Epic | Story | Task | Bug | Sub-task)
- **Component**: ${input:component} (e.g., navbar, seatPicker, infrastructure, ci-cd, documentation)
- **Summary**: ${input:summary}

## Instructions

1. Read the workspace to understand the project context (cinema multi-platform Playwright test automation for Cinesa/UCI).
2. If the summary references a specific component, read its files to gather accurate technical details.
3. Generate a complete JIRA ticket in the format below.

## Output Format

Generate the ticket using this exact structure:

```markdown
## [TYPE] Summary

**Type:** Epic | Story | Task | Bug
**Priority:** Critical | High | Medium | Low
**Labels:** automation, playwright, [component], [platform], [additional]
**Sprint/Epic Link:** [suggest appropriate epic if applicable]
**Story Points:** [estimate: 1, 2, 3, 5, 8, 13]

---

### Description

[2-3 paragraphs explaining WHAT needs to be done and WHY. Include business context and technical motivation.]

### Background / Context

- [Relevant technical context]
- [Current state of the component/feature]
- [Links to ADRs, docs, or related tickets if known]

### Acceptance Criteria

- [ ] AC1: [Specific, testable criterion]
- [ ] AC2: [Specific, testable criterion]
- [ ] AC3: [Specific, testable criterion]

### Technical Notes

- [Architecture constraints (WebActions-only, fixture injection, etc.)]
- [Files to create or modify]
- [Dependencies on other components]

### Test Strategy

- [ ] Unit/integration tests covering the change
- [ ] Allure labels (epic/feature/story) included
- [ ] Tags added (@smoke, @critical, etc.)
- [ ] Tested on relevant environments (production, preprod, lab)

### Definition of Done

- [ ] Code follows project architecture (ADR-0009)
- [ ] All selectors in `*.selectors.ts` files
- [ ] Page Objects use WebActions only (no direct `page` access)
- [ ] Tests import `test` from fixtures
- [ ] Allure hierarchical labels present
- [ ] ESLint passes (`npm run lint`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] PR reviewed and approved
```

## Rules

- Write ALL ticket content in **English** (project standard).
- Use project-specific terminology: WebActions, Page Objects, fixtures, Allure steps, selectors files.
- Reference actual file paths from the workspace when applicable.
- For Bugs: include "Steps to Reproduce", "Expected Behavior", "Actual Behavior", and "Environment" sections.
- For Epics: include a "Child Stories/Tasks" breakdown section listing suggested sub-tickets.
- Story points estimation guide: 1=trivial, 2=small, 3=medium, 5=large, 8=very large, 13=epic-level.
- Suggest appropriate labels from: `automation`, `playwright`, `cinesa`, `uci`, `infrastructure`, `documentation`, `allure`, `webactions`, `fixtures`, `cloudflare`, `booking-flow`, `refactoring`.

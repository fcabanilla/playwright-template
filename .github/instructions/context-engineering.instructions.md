---
applyTo: '**'
---

# Context Engineering Principles

When writing or modifying code in this project, follow these principles to maximize AI-assisted development quality:

## Naming & Readability

- Use **semantic names** that convey purpose: `selectAvailableSeat` not `doAction`
- Prefer **explicit types** over inference for public APIs
- Use **named constants** instead of magic values: `MAX_RETRY_COUNT` not `3`
- Keep functions **small and single-purpose** — one function, one responsibility

## Code Organization

- Place each concern in the correct architectural layer (Tests → POMs → WebActions → Playwright)
- Co-locate related files: selectors with page objects, assertions with specs
- Export only what is consumed — minimize public surface area

## Patterns

- Prefer **composition** over inheritance
- Use **early returns** to reduce nesting
- Prefer **declarative** over imperative when intent is clearer
- Avoid premature abstraction — extract only when a pattern repeats 3+ times

## Planning Discipline

- **Assess before acting**: determine if a task is simple (execute directly) or complex (plan first)
- **Ask, don't guess**: when vital information is missing, ask clarifying questions
- **Plan complex changes**: multi-file edits, new components, and architectural decisions require a written plan before implementation
- **Cite what you find**: reference specific files and line numbers when analyzing the codebase

## Continuous Learning Protocol

When you discover something new during a session — a pattern that works, a gotcha to avoid, a framework behavior, or any insight that could prevent future mistakes:

1. **Complete your current task first** — don't interrupt the workflow
2. **At the end of the response**, append a learning suggestion block:

> 💡 **Suggested improvement to project customization**
> **What was learned**: [Brief description of the discovery]
> **Where to apply it**: [Specific files — e.g., `copilot-instructions.md` → Prohibitions, `plan.agent.md`, a `.instructions.md`, a skill `SKILL.md`, an agent]
> **Proposed change**: [Exact text to add/modify]
>
> _Should I apply this improvement?_

3. **Scope is broad** — this applies to ANY learning, not just prohibitions:
   - New architectural patterns discovered
   - Framework gotchas (SPA navigation, Cloudflare quirks, timing issues)
   - Better selector strategies found during debugging
   - Environment-specific behaviors
   - Test data patterns that proved reliable
   - Agent or skill instructions that could be improved
   - New prohibitions that should be added

4. **The user decides** — never auto-apply customization changes. Always present the suggestion and wait for approval.

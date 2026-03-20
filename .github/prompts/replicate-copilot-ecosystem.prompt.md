```prompt
---
description: 'Design and generate a complete GitHub Copilot customization ecosystem for any project — global instructions, path-specific rules, reusable prompts, and custom agents. Pure plan mode: all output is copy-pasteable code blocks, no file editing.'
---

# Replicate Copilot Ecosystem for a New Project

You are an expert in GitHub Copilot customization. Your task is to design and generate a **complete, production-ready Copilot ecosystem** tailored to the project described below.

**This is a PLAN-ONLY task.** You will NOT edit files or run commands. Everything you generate must be output as labeled code blocks that the user can copy-paste into their project.

---

## Project Details

**Project name:** ${input:projectName}

**Tech stack:** ${input:techStack}

**Architecture & conventions:**
${input:architectureDescription}

---

## What You Will Generate

GitHub Copilot supports 4 customization mechanisms. You will generate all of them:

| Mechanism | File Format | Activation | Purpose |
|---|---|---|---|
| **Global Instructions** | `copilot-instructions.md` | Always active | Base rules for every Copilot interaction |
| **Path-Specific Instructions** | `*.instructions.md` | Auto-activated by file glob | Layer-specific rules per file type |
| **Prompt Files** | `*.prompt.md` | Manual `#` command in chat | Guided workflows for recurring tasks |
| **Custom Agents** | `*.agent.md` | Manual `@` command in chat | Specialist AI roles for complex tasks |

---

## Phase 1 — Understand the Project

Before generating any files, reason through the following. Output this analysis as a numbered list under the heading `## Project Analysis`.

**1. Identify the architectural layers**
From the architecture description, extract the distinct layers of the codebase (e.g., services, controllers, components, tests, models). For each layer, identify:
- The typical file name pattern (e.g., `*.service.ts`, `*.component.tsx`)
- The key rules that apply to that layer (e.g., "never import UI in services", "all components must use design system primitives")

**2. Identify the critical architectural boundaries**
What are the most common violations or mistakes developers make in this codebase? These become the backbone of `copilot-instructions.md` and the path-specific instruction files.

**3. Identify recurring tasks**
What tasks does the team do repeatedly that follow a predictable pattern? (e.g., creating a new CRUD module, writing integration tests, adding a new API endpoint, generating a migration). These become prompt files (`*.prompt.md`).

**4. Identify specialist domains**
What areas of the codebase require deep, contextual knowledge for Copilot to be truly useful? (e.g., a complex domain model, specific testing patterns, a reporting subsystem, a deployment process). These become custom agents (`*.agent.md`).

**5. Identify file organization**
Where should the `.github/` directory live? What relative paths will be used in `applyTo` globs?

---

## Phase 2 — Design the Ecosystem

Based on the Phase 1 analysis, design the complete ecosystem. Output this plan under the heading `## Ecosystem Design`.

Format the design as:

### Global Instructions
- What always applies across all files (language rules, architectural principles, naming conventions, forbidden patterns)

### Path-Specific Instructions (list each file to create)
For each layer identified in Phase 1, one instruction file. Format:
```
File: instructions/{layerName}.instructions.md
applyTo: {glob pattern}
Rules: [list the 4-6 most important rules for that layer]
```

### Prompt Files (list each prompt to create)
For each recurring task identified in Phase 1, one prompt file. Format:
```
File: prompts/{taskName}.prompt.md
Inputs: ${input:varName} — description
Purpose: one sentence
```
Always include at minimum:
- A "create new [primary unit]" scaffold prompt
- A "refactor/migrate to new pattern" prompt (if the project has a migration need)
- A "review [quality dimension]" analysis prompt

### Custom Agents (list each agent to create)
For each specialist domain identified in Phase 1, one agent. Format:
```
Agent: @{agentName}
Specialty: one sentence
Tools: list of tool names needed
Can edit files: yes/no
```
Always include at minimum:
- An architecture enforcer / refactorer agent
- A documentation auditor agent (plan-first — never edits without approval)
- A code reviewer agent
- A debugging specialist agent

---

## Phase 3 — Generate All Files

Generate every file designed in Phase 2 as a complete, copy-pasteable code block. Use this structure for each file:

```
### `{relative path from project root}`
{code block with correct language tag}
```

### File generation rules

#### `copilot-instructions.md`
- 500–900 lines. This is the primary reference for all Copilot interactions.
- Structure: Project Context → Critical Architecture Rules → Layer-specific quick rules → Test/Quality standards → Code style → Forbidden patterns → Key files table → Documentation update reminders
- Every rule must be actionable: ✅ DO / ❌ DON'T format for the most important constraints
- Reference real file paths from the project (inferred from the architecture description)
- Include a "Quick Reference" section at the end with Do's and Don'ts

#### `instructions/*.instructions.md`
- YAML frontmatter with `applyTo` glob
- 30–80 lines each. Focused and specific.
- Lead with the most critical rule for that layer
- Include a positive example and a negative (forbidden) example for the top 2 rules
- Reference specific methods, interfaces, or patterns relevant to that layer

#### `prompts/*.prompt.md`
- YAML frontmatter with `description`
- Use `${input:varName}` for all required inputs
- Structure: context paragraph → numbered steps → each step has specific file path and code block template
- Keep generic variable placeholders like `${input:name}` in the generated output templates
- Instruct Copilot to follow all rules from `copilot-instructions.md`

#### `agents/*.agent.md`
- YAML frontmatter with `name`, `description`, and `tools` array
- Tools must use the prefixed format: `search/codebase`, `read/readFile`, `search/textSearch`, `search/fileSearch`, `edit/editFiles`, `edit/createFile`, `execute/runInTerminal`
- Structure: Role description → "Best for" bullet list → Tools list → Domain knowledge section → Can edit files? (yes/no + conditions)
- Documentation auditor and other plan-first agents: include explicit rule "Never edits files without presenting a plan and receiving explicit user approval"
- Code reviewer: set model to `claude-sonnet-4` in frontmatter if available

#### `.github/README.md`
- Generate a complete README for the `.github/` directory
- Include: directory structure tree, how-it-works table (4 mechanisms), quick-start section, tables of all prompts and agents with one-line descriptions, architecture alignment section, maintenance guide table, links to GitHub Copilot documentation

---

## Phase 4 — Onboarding Instructions

After generating all files, output a final section `## Getting Started` with:

1. The exact directory structure to create (as a shell snippet showing `mkdir` commands or a tree)
2. The files to create and their order (start with `copilot-instructions.md`, then instructions, then prompts, then agents, then README)
3. Verification checklist: 5 bullet points the developer can check to confirm everything is working
4. One concrete example of using each mechanism (global instructions, path-specific, prompt, agent) with the real file names generated above

---

## Output Constraints

- **Language:** ALL generated code and documentation in **English** — no exceptions
- **No hallucinated paths:** Only reference file paths and patterns that are consistent with the architecture description provided
- **No tool-specific coupling:** Generated files must not reference tools, libraries, or frameworks not mentioned in `${input:techStack}` or the architecture description
- **Completeness over brevity:** Every file must be complete and immediately usable — no `// TODO` placeholders or `... rest of file` shortcuts
- **Consistent naming:** Use camelCase for file name prefixes, kebab-case for agent names and prompt names
- **Proportionate scope:** Number of files should be proportionate to project complexity — a simple REST API needs 3–4 instruction files and 3–4 prompts; a large monorepo may need 8–10
```

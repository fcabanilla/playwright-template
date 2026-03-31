---
name: trace-analysis
description: 'Analyze Playwright trace.zip files using the MCP browser tools and trace.playwright.dev. Use when: diagnosing test failures, inspecting DOM snapshots at each test step, understanding race conditions, debugging masked inputs, verifying element visibility/state changes during test execution. Requires: Playwright MCP server running.'
---

# Playwright Trace Analysis

## When to Use

- Diagnosing why a Playwright test failed (timeout, element not found, wrong state)
- Inspecting the DOM state at any point during test execution
- Understanding race conditions between actions
- Debugging form interactions (masked inputs, iframes, auto-completing fields)
- Verifying visual state of the page at each test step

## Prerequisites

- Playwright MCP server must be running (`mcp_microsoft_pla_browser_*` tools available)
- A `trace.zip` file from a test run (located in `.allure/playwright-artifacts/`)

## Procedure

### Step 1: Locate the Trace File

Find the trace.zip for the failed test:

```bash
find .allure/playwright-artifacts -name "trace.zip" -path "*<test-name-fragment>*"
```

### Step 2: Open Trace Viewer

1. Navigate to trace viewer:

   ```
   mcp_microsoft_pla_browser_navigate → https://trace.playwright.dev
   ```

2. Click "Select file" button:

   ```
   mcp_microsoft_pla_browser_click → ref for "Select file" button
   ```

3. Upload the trace.zip:
   ```
   mcp_microsoft_pla_browser_file_upload → paths: ["/absolute/path/to/trace.zip"]
   ```

### Step 3: Read the Action Tree

After loading, the snapshot shows a **tree of actions** (treeitem elements). Each action shows:

- **Name**: The Allure step or Playwright action (e.g., "Fill Redsys credit card details 3.9s")
- **Duration**: Time taken
- **Status**: Selected/failed items are highlighted

The **iframe** in the snapshot shows the page state at the currently selected action.

### Step 4: Navigate Actions

Click on a treeitem to select it and see the DOM snapshot at that point:

```
mcp_microsoft_pla_browser_click → ref for the treeitem's inner div
```

### Step 5: Expand Composite Steps

Steps with sub-actions (like Allure steps wrapping multiple Playwright calls) can be expanded:

```
mcp_microsoft_pla_browser_click → ref for the expand icon (codicon arrow)
```

This reveals low-level Playwright actions: Click, Type, Fill, waitFor, etc.

### Step 6: Inspect Before/After States

Use the tab bar above the snapshot to switch between:

- **Action**: DOM state during the action execution
- **Before**: DOM state before the action started
- **After**: DOM state after the action completed

```
mcp_microsoft_pla_browser_click → ref for "Before" or "After" tab
```

### Step 7: Read the Call Panel

When an action is selected, the bottom panel shows:

- **Call** tab: Parameters (locator, text, delay, timeout)
- **Log** tab: Playwright's internal log for that action
- **Errors** tab: Error details if the action failed
- **Network** tab: Network requests during the action
- **Source** tab: Source code location

### Step 8: Analyze DOM Snapshots

The iframe snapshot shows the actual DOM state. Key things to look for:

- **Element visibility**: Is the target element present in the snapshot?
- **Text content**: Does the input have the expected value?
- **Disabled state**: Are buttons disabled/enabled?
- **Error messages**: Are validation errors visible?
- **Iframe nesting**: Is the content inside an iframe? (look for `iframe [ref=...]` in the snapshot tree)

## Key Patterns to Identify

### Masked Input Failure

- `Type "value"` action completes (shows duration) but the textbox has no `text:` property after
- Solution: Use `fill()` instead of `pressSequentially()` — it sets the value directly

### Race Condition

- Action succeeds initially (element found, state correct) but subsequent action fails
- Compare "After" state of one action with "Before" state of the next
- Look for `aria-pressed`, `disabled`, or class changes between snapshots

### Iframe Context Issue

- Element is inside `iframe [ref=...]` in the snapshot
- Direct `page.locator()` may not resolve correctly
- Use `page.frameLocator('iframe').locator(...)` or ensure WebActions handles frames

### Auto-Redirect

- Action snapshot shows blank/white page
- Previous action triggered a navigation
- Use `waitForURL` or conditional checks instead of hard waits

## Tips

- The snapshot YAML is the accessibility tree, not raw HTML
- `text:` property on an input shows its current value
- `[disabled]` attribute shows the element is not interactive
- `[selected]` on a treeitem means it's the currently viewed action
- `[expanded]` on a treeitem means its children are visible
- Compare timestamps between actions to identify delays
- Use the timeline at the top to see the overall test duration

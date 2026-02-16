---
name: feature
description: Fetch the Notion ticket for the current branch and summarize its implementation details
allowed-tools: Bash, mcp__notion__notion-fetch, mcp__notion__notion-search
---

## Feature Context Workflow

This skill reads the current git branch, extracts the ticket number, fetches the corresponding Notion page, and summarizes the implementation details.

### 1. Get the ticket number from the current branch

```bash
git branch --show-current
```

The branch follows the pattern `feature/WK-<TICKET_NUMBER>`. Extract `<TICKET_NUMBER>` from the branch name.

- If the current branch does **not** match the `feature/WK-*` pattern, inform the user and stop.

### 2. Fetch the Notion ticket

Use the `mcp__notion__notion-fetch` tool with the id `https://www.notion.so/sammy-elsherif/WP-<TICKET_NUMBER>` (note: the Notion page uses the `WP-` prefix, not `WK-`).

- If the fetch **fails**, try searching for the ticket using `mcp__notion__notion-search` with the query `WP-<TICKET_NUMBER>`.
- If the search also returns no results, inform the user that the ticket was not found.

### 3. Summarize the ticket

Present the ticket details to the user in a clear, structured format:

- **Title** — the page title
- **Status** — any status or stage property
- **Description** — the main content / summary of the ticket
- **Acceptance Criteria** — if present
- **Implementation Details** — any technical notes, specs, or sub-tasks
- **Dependencies** — any linked pages, blockers, or related tickets

Only include sections that have content. Do not fabricate details that are not on the page.

### 4. Respond to follow-up

If `$ARGUMENTS` is provided, use it to focus the summary on a specific aspect of the ticket (e.g. "just the acceptance criteria" or "what APIs are needed").

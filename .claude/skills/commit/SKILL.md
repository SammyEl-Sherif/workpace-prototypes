---
name: commit
description: Format, build, and commit code following the project workflow
disable-model-invocation: true
allowed-tools: Bash
---

## Commit Workflow

Follow these steps in order to commit code. Do not skip steps.

### 1. Format code

```bash
NODE_ENV=development npm run format
```

If formatting fails, fix the issues and re-run until it passes.

### 2. Build

```bash
NODE_ENV=production npm run build
```

- If the build **fails**, fix all errors and re-run the build until it passes.
- If the build **succeeds**, continue to step 3.

### 3. Reset NODE_ENV

```bash
export NODE_ENV=development
```

### 4. Commit

```bash
npm run commit
```

This runs the project's commit script (interactive commitizen prompt).

### Notes

- Always format before building — the build may fail on unformatted code.
- Never skip the build step. Broken builds should not be committed.
- If `$ARGUMENTS` is provided, use it as context for what was changed (e.g. to help write the commit message).

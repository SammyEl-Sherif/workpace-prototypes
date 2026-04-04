---
name: deploy-db
description: Generate a migration from local schema changes and push it to the remote Supabase database
disable-model-invocation: true
allowed-tools: Bash
---

## Deploy Database Workflow

Follow these steps in order. Do not skip steps.

### 1. Generate migration from schema changes

```bash
npm run supabase:diff:local
```

- If the diff shows **no changes**, inform the user and stop — there is nothing to deploy.
- If the diff **fails**, report the error and stop.
- If changes are detected, show the user what was generated and continue to step 2.

### 2. Push migration to remote

```bash
echo "Y" | npm run supabase:push
```

This pipes `Y` to confirm the migration push.

- If the push **fails**, report the error to the user.
- If the push **succeeds**, confirm to the user that the migration was applied successfully.

### Notes

- Always generate the diff before pushing — never push without reviewing what changed.
- If `$ARGUMENTS` is provided, use it as additional context (e.g. which schema files were changed).

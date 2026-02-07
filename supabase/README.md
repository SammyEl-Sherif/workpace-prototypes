# Supabase Configuration

This directory contains Supabase CLI configuration and declarative schema files.

## Quick Start

1. **Link your project** (first time only):
   ```bash
   export SUPABASE_PROJECT_REF=your-project-ref-id
   npm run supabase:link
   ```

2. **Generate migration from schema changes**:
   ```bash
   npm run supabase:diff migration_name
   ```

3. **Deploy to production**:
   ```bash
   npm run supabase:push
   ```

## Basic Operations

### Linking Your Project

Link your local project to a remote Supabase project:

```bash
export SUPABASE_PROJECT_REF=your-project-ref-id
npm run supabase:link
```

### Generating Migrations

When you modify schema files in `supabase/schemas/`, generate a migration:

```bash
# Generate migration with a descriptive name
# The -f flag requires the migration name as an argument
supabase db diff --linked -f initialize_databases
```

**Important**: Before generating the migration, make sure:

1. The tables don't exist in your remote database (delete them first if they do)
2. Your schema files in `supabase/schemas/` define the desired final state
3. Docker is running (required for shadow database creation)

**If `-f` doesn't capture everything:**

If you see a full diff when running `supabase db diff` but the migration file is
incomplete, you can manually capture the diff:

```bash
# 1. Get the full diff output
supabase db diff --linked > /tmp/full_diff.sql

# 2. Create a new migration file with timestamp
MIGRATION_NAME="initialize_databases"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
touch supabase/migrations/${TIMESTAMP}_${MIGRATION_NAME}.sql

# 3. Copy the diff content to the migration file
# (Review and edit as needed)
cat /tmp/full_diff.sql > supabase/migrations/${TIMESTAMP}_${MIGRATION_NAME}.sql
```

This creates a migration file in `supabase/migrations/` that contains the SQL
needed to update your database.

**Note**: If you encounter Docker/container errors when running `supabase:diff`,
you can use the alternative approach below.

### Reviewing Generated Migrations

After generating a migration, review it before deploying:

```bash
# List migrations
ls -la supabase/migrations/

# View a migration file
cat supabase/migrations/YYYYMMDDHHMMSS_migration_name.sql
```

### Deploying Migrations

Push migrations to your linked Supabase project:

```bash
npm run supabase:push
```

This applies all pending migrations to your remote database.

### Checking Status

Check the status of your Supabase setup:

```bash
npm run supabase:status
```

### Resetting Local Database (if using local Supabase)

If you're running Supabase locally and need to reset:

```bash
npm run supabase:reset
```

**Warning**: This will delete all local data and reapply all migrations.

### Viewing Current Database State

Compare your schema files with the current database:

```bash
# See what differences exist
supabase db diff
```

## Directory Structure

- `config.toml` - Supabase CLI configuration
- `schemas/` - Declarative schema files (desired final state)
  - `good_things.sql` - Schema for goals and good_things tables
  - `prototypes.sql` - Schema for prototypes table
  - `user_roles.sql` - Schema for user_roles table
- `migrations/` - Generated migration files (auto-generated, do not edit
  manually)

## Workflow Example

1. **Edit schema file**:
   ```bash
   # Edit supabase/schemas/good_things.sql
   # Add or modify table definitions
   ```

2. **Generate migration**:
   ```bash
   npm run supabase:diff update_good_things_schema
   ```

3. **Review migration**:
   ```bash
   cat supabase/migrations/*_update_good_things_schema.sql
   ```

4. **Commit changes**:
   ```bash
   git add supabase/
   git commit -m "Update good things schema"
   ```

5. **Deploy**:
   ```bash
   npm run supabase:push
   ```

## Available Scripts

| Script                | Command                                             | Description                                    |
| --------------------- | --------------------------------------------------- | ---------------------------------------------- |
| `supabase:init`       | `supabase init`                                     | Initialize Supabase in your project            |
| `supabase:link`       | `supabase link --project-ref $SUPABASE_PROJECT_REF` | Link to your remote Supabase project           |
| `supabase:diff`       | `supabase db diff --linked -f <name>`               | Generate migration from schema differences     |
| `supabase:diff:local` | `supabase db diff -f <name>`                        | Generate migration using local database        |
| `supabase:push`       | `supabase db push --linked`                         | Push migrations to remote database             |
| `supabase:reset`      | `supabase db reset`                                 | Reset local database (if using local Supabase) |
| `supabase:status`     | `supabase status`                                   | Check Supabase status                          |
| `supabase:update`     | `npm install -g supabase@latest`                    | Update Supabase CLI to latest version          |

## Best Practices

1. ✅ **Always review generated migrations** before deploying
2. ✅ **Use descriptive migration names** (e.g., `add_user_preferences`, not
   `migration1`)
3. ✅ **Commit schema files** to version control
4. ✅ **Don't edit generated migration files** - edit schema files instead
5. ✅ **Test locally first** if possible using `supabase start`

## Troubleshooting

### Docker Requirement for Auto-Generation

The `supabase db diff -f` command (declarative schema feature) **requires
Docker** to work. It creates a temporary shadow database container to compare
your schema file against your remote database.

**Setup Steps:**

1. **Update Supabase CLI** (recommended - you're on v2.53.6, latest is v2.72.7):
   ```bash
   npm run supabase:update
   # or
   brew upgrade supabase/tap/supabase
   ```

2. **Ensure Docker is running**:
   ```bash
   docker ps  # Should show running containers
   ```

3. **Clean up any conflicting containers**:
   ```bash
   # Stop any existing Supabase instances
   supabase stop

   # Clean up Docker
   docker container prune -f
   ```

4. **Try the diff command**:
   ```bash
   npm run supabase:diff create_good_things_tables
   ```

**If you still encounter errors:**

The shadow database creation might fail due to storage migration issues. In this
case, the CLI will still try to create the container but it may error out. You
have these options:

**Option 3: Create migration manually** If the diff command continues to fail,
you can create the migration manually:

1. Copy your schema file content from `supabase/schemas/good_things.sql`
2. Create a new migration file:
   ```bash
   # Create migration file
   touch supabase/migrations/$(date +%Y%m%d%H%M%S)_create_good_things_tables.sql
   ```
3. Paste your schema SQL into the migration file
4. Review and deploy with `npm run supabase:push`

**Option 4: Use Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/schemas/good_things.sql`
4. Run it directly in the SQL Editor
5. This applies the schema changes immediately

### Migration Conflicts

If you have conflicts between your schema and database:

```bash
# Check current database state
supabase db diff

# Reset and regenerate
npm run supabase:reset
npm run supabase:diff fix_schema
```

### Unlinking and Re-linking

If you need to change projects:

```bash
supabase unlink
npm run supabase:link
```

## Documentation

See
[docs/SUPABASE-DECLARATIVE-SCHEMA.md](../docs/SUPABASE-DECLARATIVE-SCHEMA.md)
for detailed workflow instructions and advanced usage.

# Supabase Declarative Schema Workflow

This project uses Supabase's declarative schema approach for database migrations. This allows you to define the desired final state of your schema and let Supabase generate the migration steps automatically.

## Prerequisites

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   # or
   brew install supabase/tap/supabase
   ```

2. **Link your Supabase project**:
   ```bash
   # Get your project reference ID from Supabase dashboard
   export SUPABASE_PROJECT_REF=your-project-ref-id
   npm run supabase:link
   ```

## Directory Structure

```
supabase/
├── config.toml          # Supabase CLI configuration
└── schemas/
    └── good_things.sql  # Declarative schema for good things feature
```

## Workflow

### 1. Define Your Schema

Create or edit schema files in `supabase/schemas/`. These files define the **desired final state** of your database using `CREATE TABLE` statements.

Example: `supabase/schemas/good_things.sql`

```sql
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ...
);
```

### 2. Generate Migrations from Schema

When you modify a schema file, generate a migration that will bring your database to that state:

```bash
# Generate migration from schema differences
npm run supabase:diff create_good_things_tables

# This will create a migration file in supabase/migrations/
# The migration contains the ALTER TABLE statements needed
```

The CLI will:
- Compare your schema file with the current database state
- Generate `ALTER TABLE` statements for any differences
- Create a new migration file in `supabase/migrations/`

### 3. Review Generated Migration

Check the generated migration file in `supabase/migrations/` to ensure it looks correct:

```bash
# View the generated migration
cat supabase/migrations/YYYYMMDDHHMMSS_create_good_things_tables.sql
```

### 4. Test Locally (Optional)

If you're running Supabase locally:

```bash
# Start local Supabase
supabase start

# Apply migrations locally
supabase db reset

# Check status
npm run supabase:status
```

### 5. Deploy to Production

Once tested and committed to your repository:

```bash
# Push migrations to your linked Supabase project
npm run supabase:push
```

This will:
- Apply all pending migrations to your remote database
- Update your database schema to match your declarative schema files

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `supabase:init` | `supabase init` | Initialize Supabase in your project |
| `supabase:link` | `supabase link --project-ref $SUPABASE_PROJECT_REF` | Link to your remote Supabase project |
| `supabase:diff` | `supabase db diff -f <name>` | Generate migration from schema differences |
| `supabase:push` | `supabase db push --linked` | Push migrations to remote database |
| `supabase:reset` | `supabase db reset` | Reset local database (if using local Supabase) |
| `supabase:status` | `supabase status` | Check Supabase status |

## Example Workflow

### Adding a New Feature

1. **Create/Edit Schema File**:
   ```bash
   # Edit supabase/schemas/good_things.sql
   # Add your new table definitions
   ```

2. **Generate Migration**:
   ```bash
   npm run supabase:diff add_new_feature
   ```

3. **Review Migration**:
   ```bash
   # Check the generated migration file
   ls -la supabase/migrations/
   ```

4. **Commit Changes**:
   ```bash
   git add supabase/
   git commit -m "Add new feature schema"
   ```

5. **Deploy**:
   ```bash
   npm run supabase:push
   ```

## CI/CD Integration

For automated deployments, you can set up GitHub Actions:

```yaml
# .github/workflows/supabase-deploy.yml
name: Deploy Supabase Migrations

on:
  push:
    branches: [main]
    paths:
      - 'supabase/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
      - run: supabase db push --linked
```

## Best Practices

1. **Always review generated migrations** before deploying
2. **Test locally first** if possible using `supabase start`
3. **Commit schema files** to version control
4. **Use descriptive migration names** when running `supabase:diff`
5. **Don't edit generated migration files** - edit the schema files instead
6. **Keep schema files in sync** with your actual database state

## Troubleshooting

### Migration Conflicts

If you have conflicts between your schema and database:

```bash
# Check current database state
supabase db diff

# Reset and regenerate
supabase db reset
npm run supabase:diff fix_schema
```

### Schema Out of Sync

If your schema file doesn't match your database:

1. Update your schema file to match the current database state
2. Or generate a migration to bring the database to the schema state

### Linking Issues

If you have trouble linking:

```bash
# Unlink and re-link
supabase unlink
npm run supabase:link
```

## Current Schema Files

- `supabase/schemas/good_things.sql` - Good Things List feature (goals and good_things tables)

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Declarative Schema Workflow](https://supabase.com/docs/guides/cli/managing-environments#declarative-schemas)

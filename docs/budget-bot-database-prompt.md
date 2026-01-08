# Database Schema Prompt for Budget Bot

Create PostgreSQL database tables for the Budget Bot feature based on the following requirements:

## Overview

The Budget Bot is a personal finance management tool that allows users to track their monthly income, expenses, savings, debts, reserves, and emergency fund goals. Each user should have their own budget data.

## Database Requirements

### 1. Main Budget Table (`budget_budgets`)

This table stores the main budget configuration for each user:

- `id` (UUID, PRIMARY KEY) - Unique identifier for the budget
- `user_id` (UUID, FOREIGN KEY) - References `users(id)` with ON DELETE CASCADE
- `monthly_income` (DECIMAL(12, 2)) - User's net monthly income (default: 0)
- `emergency_fund_months` (INTEGER) - Target number of months for emergency fund (default: 6, range: 1-24)
- `current_emergency_fund` (DECIMAL(12, 2)) - Current amount in emergency fund (default: 0)
- `created_at` (TIMESTAMP WITH TIME ZONE) - Record creation timestamp (default: NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE) - Record last update timestamp (default: NOW())

**Constraints:**

- One budget record per user (UNIQUE constraint on user_id)
- `emergency_fund_months` should be between 1 and 24
- All monetary values should be non-negative (CHECK constraints)

### 2. Budget Items Table (`budget_items`)

This table stores all budget line items (expenses, savings, debts, and reserves):

- `id` (UUID, PRIMARY KEY) - Unique identifier for the item
- `budget_id` (UUID, FOREIGN KEY) - References `budget_budgets(id)` with ON DELETE CASCADE
- `type` (VARCHAR(20)) - Item type: 'expense', 'savings', 'debt', or 'reserve' (NOT NULL)
- `name` (VARCHAR(255)) - Item name/description (e.g., "Rent", "Credit Card", "401k")
- `amount` (DECIMAL(12, 2)) - Item amount (default: 0, NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE) - Record creation timestamp (default: NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE) - Record last update timestamp (default: NOW())

**Constraints:**

- `type` must be one of: 'expense', 'savings', 'debt', 'reserve' (CHECK constraint)
- `amount` should be non-negative (CHECK constraint)
- Index on `budget_id` and `type` for efficient queries

## Database Conventions to Follow

1. **UUID Primary Keys**: Use `uuid_generate_v4()` as default for all primary keys
2. **Timestamps**: Use `TIMESTAMP WITH TIME ZONE` for all date/time fields
3. **Foreign Keys**: Always include `ON DELETE CASCADE` for user-related tables
4. **Updated At Trigger**: Create a trigger to automatically update `updated_at` when records are modified (use the existing `update_updated_at_column()` function if available)
5. **Indexes**: Create indexes on:
   - `budget_budgets.user_id` (for user lookups)
   - `budget_items.budget_id` (for budget item lookups)
   - `budget_items.type` (for filtering by item type)
   - Composite index on `budget_items(budget_id, type)` for efficient filtering
6. **Permissions**: Grant all privileges to `workpace_user` (if this user exists in your database)

## Example Usage

The Budget Bot UI allows users to:

- Set their monthly income
- Add/edit/remove multiple expenses (e.g., Rent, Groceries, Utilities)
- Add/edit/remove multiple savings items (e.g., Roth IRA, Emergency Fund)
- Add/edit/remove multiple debts (e.g., Credit Card, Student Loan)
- Add/edit/remove multiple reserves (e.g., 401k, Brokerage Account)
- Configure emergency fund target (months) and current amount

All calculations (totals, percentages, net worth) are computed in the application layer based on the stored data.

## Notes

- The application currently uses client-side state management, but we need to persist this data to the database
- Each user should have exactly one budget record (enforced by UNIQUE constraint)
- Budget items can be added/removed dynamically, so the schema should support multiple items per type per user
- Monetary values are stored as DECIMAL to ensure precision for financial calculations

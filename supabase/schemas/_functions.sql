-- Shared Functions
-- This file is prefixed with _ so it sorts FIRST alphabetically,
-- ensuring these functions exist before any table schema references them.

-- Function to update updated_at timestamp (used by multiple tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

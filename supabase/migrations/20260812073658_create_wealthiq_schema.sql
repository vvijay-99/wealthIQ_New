/*
# WealthIQ — Complete Database Schema

## Overview
Creates the full database schema for the WealthIQ educational AI financial health platform.
All user-specific tables are owner-scoped via `user_id` referencing `auth.users(id)`.
Row Level Security is enabled on every table with per-verb policies using `auth.uid()`.

## Tables Created

### 1. profiles
Stores user demographic and financial preference information.
- `id` (uuid PK, defaults to gen_random_uuid)
- `user_id` (uuid, NOT NULL, DEFAULT auth.uid(), FK to auth.users ON DELETE CASCADE)
- `full_name` (text)
- `age` (integer)
- `country` (text)
- `employment_type` (text)
- `income_stability` (text)
- `financial_goal` (text)
- `risk_tolerance` (text)
- `created_at`, `updated_at` (timestamptz)

### 2. income_records
Monthly income entries.
- `id`, `user_id` (DEFAULT auth.uid()), `amount` (numeric), `income_type` (text), `record_date` (date), `created_at`

### 3. expense_records
Categorized monthly expenses.
- `id`, `user_id` (DEFAULT auth.uid()), `category` (text), `amount` (numeric), `expense_type` (text: essential/discretionary), `record_date` (date), `description` (text), `created_at`

### 4. savings_records
Savings and emergency fund entries.
- `id`, `user_id` (DEFAULT auth.uid()), `amount` (numeric), `record_date` (date), `savings_type` (text), `created_at`

### 5. debts
Loan and EMI tracking.
- `id`, `user_id` (DEFAULT auth.uid()), `debt_type` (text), `original_principal` (numeric), `remaining_balance` (numeric), `interest_rate` (numeric), `monthly_emi` (numeric), `remaining_months` (integer), `created_at`, `updated_at`

### 6. investments
Portfolio holdings.
- `id`, `user_id` (DEFAULT auth.uid()), `asset_type` (text), `symbol` (text), `quantity` (numeric), `purchase_price` (numeric), `current_value` (numeric), `created_at`, `updated_at`

### 7. fixed_deposits
FD records.
- `id`, `user_id` (DEFAULT auth.uid()), `bank_name` (text), `principal` (numeric), `interest_rate` (numeric), `tenure_months` (integer), `start_date` (date), `maturity_date` (date), `senior_citizen` (boolean), `created_at`

### 8. financial_scores
Computed health scores and ML predictions.
- `id`, `user_id` (DEFAULT auth.uid()), `health_score` (numeric), `health_category` (text), `spending_risk` (text), `savings_rate` (numeric), `expense_ratio` (numeric), `debt_to_income` (numeric), `emergency_fund_months` (numeric), `model_version` (text), `created_at`

### 9. recommendations
Ranked financial recommendations.
- `id`, `user_id` (DEFAULT auth.uid()), `category` (text), `priority` (text), `title` (text), `reason` (text), `suggested_action` (text), `created_at`

### 10. financial_history
Monthly financial snapshots for forecasting.
- `id`, `user_id` (DEFAULT auth.uid()), `month` (text), `income` (numeric), `expenses` (numeric), `savings` (numeric), `debt` (numeric), `investments` (numeric), `fd_value` (numeric), `net_worth` (numeric), `created_at`

## Security
- RLS enabled on ALL tables.
- Each table has 4 policies: SELECT, INSERT, UPDATE, DELETE — all scoped to `TO authenticated` with `auth.uid() = user_id`.
- `user_id` defaults to `auth.uid()` so inserts that omit `user_id` still pass the WITH CHECK.
- No service-role keys are exposed; all access is via the anon-key client with authenticated sessions.

## Indexes
- `user_id` indexed on all user-specific tables for fast ownership checks.
- `record_date` indexed on income_records, expense_records, savings_records.
- `month` indexed on financial_history.

## Important Notes
1. All `user_id` columns have `DEFAULT auth.uid()` — the frontend can insert without passing user_id.
2. `ON DELETE CASCADE` on the `user_id` FK ensures user data is cleaned up when an auth account is deleted.
3. `updated_at` columns use a trigger to auto-update on row modification.
4. Policies are dropped before creation to ensure idempotency.
*/

-- ============================================================
-- Helper: updated_at trigger function (idempotent)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text,
  age integer,
  country text,
  employment_type text,
  income_stability text,
  financial_goal text,
  risk_tolerance text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profiles" ON profiles;
CREATE POLICY "select_own_profiles" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profiles" ON profiles;
CREATE POLICY "insert_own_profiles" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profiles" ON profiles;
CREATE POLICY "update_own_profiles" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profiles" ON profiles;
CREATE POLICY "delete_own_profiles" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 2. income_records
-- ============================================================
CREATE TABLE IF NOT EXISTS income_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  income_type text NOT NULL DEFAULT 'Salary',
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_income_records_user_id ON income_records(user_id);
CREATE INDEX IF NOT EXISTS idx_income_records_record_date ON income_records(record_date);

ALTER TABLE income_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_income_records" ON income_records;
CREATE POLICY "select_own_income_records" ON income_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_income_records" ON income_records;
CREATE POLICY "insert_own_income_records" ON income_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_income_records" ON income_records;
CREATE POLICY "update_own_income_records" ON income_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_income_records" ON income_records;
CREATE POLICY "delete_own_income_records" ON income_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 3. expense_records
-- ============================================================
CREATE TABLE IF NOT EXISTS expense_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  expense_type text NOT NULL DEFAULT 'essential' CHECK (expense_type IN ('essential', 'discretionary')),
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expense_records_user_id ON expense_records(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_records_record_date ON expense_records(record_date);

ALTER TABLE expense_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_expense_records" ON expense_records;
CREATE POLICY "select_own_expense_records" ON expense_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_expense_records" ON expense_records;
CREATE POLICY "insert_own_expense_records" ON expense_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_expense_records" ON expense_records;
CREATE POLICY "update_own_expense_records" ON expense_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_expense_records" ON expense_records;
CREATE POLICY "delete_own_expense_records" ON expense_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 4. savings_records
-- ============================================================
CREATE TABLE IF NOT EXISTS savings_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  savings_type text NOT NULL DEFAULT 'Total Savings',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_savings_records_user_id ON savings_records(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_records_record_date ON savings_records(record_date);

ALTER TABLE savings_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_savings_records" ON savings_records;
CREATE POLICY "select_own_savings_records" ON savings_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_savings_records" ON savings_records;
CREATE POLICY "insert_own_savings_records" ON savings_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_savings_records" ON savings_records;
CREATE POLICY "update_own_savings_records" ON savings_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_savings_records" ON savings_records;
CREATE POLICY "delete_own_savings_records" ON savings_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 5. debts
-- ============================================================
CREATE TABLE IF NOT EXISTS debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  debt_type text NOT NULL,
  original_principal numeric NOT NULL DEFAULT 0,
  remaining_balance numeric NOT NULL DEFAULT 0,
  interest_rate numeric NOT NULL DEFAULT 0,
  monthly_emi numeric NOT NULL DEFAULT 0,
  remaining_months integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);

ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_debts" ON debts;
CREATE POLICY "select_own_debts" ON debts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_debts" ON debts;
CREATE POLICY "insert_own_debts" ON debts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_debts" ON debts;
CREATE POLICY "update_own_debts" ON debts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_debts" ON debts;
CREATE POLICY "delete_own_debts" ON debts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_debts_updated_at ON debts;
CREATE TRIGGER trg_debts_updated_at BEFORE UPDATE ON debts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. investments
-- ============================================================
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type text NOT NULL,
  symbol text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  purchase_price numeric NOT NULL DEFAULT 0,
  current_value numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_investments" ON investments;
CREATE POLICY "select_own_investments" ON investments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_investments" ON investments;
CREATE POLICY "insert_own_investments" ON investments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_investments" ON investments;
CREATE POLICY "update_own_investments" ON investments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_investments" ON investments;
CREATE POLICY "delete_own_investments" ON investments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_investments_updated_at ON investments;
CREATE TRIGGER trg_investments_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. fixed_deposits
-- ============================================================
CREATE TABLE IF NOT EXISTS fixed_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name text NOT NULL,
  principal numeric NOT NULL DEFAULT 0,
  interest_rate numeric NOT NULL DEFAULT 0,
  tenure_months integer NOT NULL DEFAULT 12,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  maturity_date date,
  senior_citizen boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_id ON fixed_deposits(user_id);

ALTER TABLE fixed_deposits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_fixed_deposits" ON fixed_deposits;
CREATE POLICY "select_own_fixed_deposits" ON fixed_deposits FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_fixed_deposits" ON fixed_deposits;
CREATE POLICY "insert_own_fixed_deposits" ON fixed_deposits FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_fixed_deposits" ON fixed_deposits;
CREATE POLICY "update_own_fixed_deposits" ON fixed_deposits FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_fixed_deposits" ON fixed_deposits;
CREATE POLICY "delete_own_fixed_deposits" ON fixed_deposits FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 8. financial_scores
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  health_score numeric NOT NULL DEFAULT 0,
  health_category text NOT NULL DEFAULT 'Moderate',
  spending_risk text NOT NULL DEFAULT 'Medium',
  savings_rate numeric NOT NULL DEFAULT 0,
  expense_ratio numeric NOT NULL DEFAULT 0,
  debt_to_income numeric NOT NULL DEFAULT 0,
  emergency_fund_months numeric NOT NULL DEFAULT 0,
  model_version text NOT NULL DEFAULT 'v0.1',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financial_scores_user_id ON financial_scores(user_id);

ALTER TABLE financial_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_financial_scores" ON financial_scores;
CREATE POLICY "select_own_financial_scores" ON financial_scores FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_financial_scores" ON financial_scores;
CREATE POLICY "insert_own_financial_scores" ON financial_scores FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_financial_scores" ON financial_scores;
CREATE POLICY "update_own_financial_scores" ON financial_scores FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_financial_scores" ON financial_scores;
CREATE POLICY "delete_own_financial_scores" ON financial_scores FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 9. recommendations
-- ============================================================
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  priority text NOT NULL DEFAULT 'Medium',
  title text NOT NULL,
  reason text,
  suggested_action text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_recommendations" ON recommendations;
CREATE POLICY "select_own_recommendations" ON recommendations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_recommendations" ON recommendations;
CREATE POLICY "insert_own_recommendations" ON recommendations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_recommendations" ON recommendations;
CREATE POLICY "update_own_recommendations" ON recommendations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_recommendations" ON recommendations;
CREATE POLICY "delete_own_recommendations" ON recommendations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 10. financial_history
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  month text NOT NULL,
  income numeric NOT NULL DEFAULT 0,
  expenses numeric NOT NULL DEFAULT 0,
  savings numeric NOT NULL DEFAULT 0,
  debt numeric NOT NULL DEFAULT 0,
  investments numeric NOT NULL DEFAULT 0,
  fd_value numeric NOT NULL DEFAULT 0,
  net_worth numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financial_history_user_id ON financial_history(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_history_month ON financial_history(month);

ALTER TABLE financial_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_financial_history" ON financial_history;
CREATE POLICY "select_own_financial_history" ON financial_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_financial_history" ON financial_history;
CREATE POLICY "insert_own_financial_history" ON financial_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_financial_history" ON financial_history;
CREATE POLICY "update_own_financial_history" ON financial_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_financial_history" ON financial_history;
CREATE POLICY "delete_own_financial_history" ON financial_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

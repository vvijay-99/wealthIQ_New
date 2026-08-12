// ============================================================
// Supabase Database Types — generated from schema
// ============================================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          age: number | null;
          country: string | null;
          employment_type: string | null;
          income_stability: string | null;
          financial_goal: string | null;
          risk_tolerance: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          full_name?: string;
          age?: number;
          country?: string;
          employment_type?: string;
          income_stability?: string;
          financial_goal?: string;
          risk_tolerance?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          age?: number;
          country?: string;
          employment_type?: string;
          income_stability?: string;
          financial_goal?: string;
          risk_tolerance?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      income_records: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          income_type: string;
          record_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          amount: number;
          income_type: string;
          record_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          income_type?: string;
          record_date?: string;
          created_at?: string;
        };
      };
      expense_records: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          amount: number;
          expense_type: 'essential' | 'discretionary';
          record_date: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          category: string;
          amount: number;
          expense_type?: 'essential' | 'discretionary';
          record_date: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          amount?: number;
          expense_type?: 'essential' | 'discretionary';
          record_date?: string;
          description?: string;
          created_at?: string;
        };
      };
      savings_records: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          record_date: string;
          savings_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          amount: number;
          record_date: string;
          savings_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          record_date?: string;
          savings_type?: string;
          created_at?: string;
        };
      };
      debts: {
        Row: {
          id: string;
          user_id: string;
          debt_type: string;
          original_principal: number;
          remaining_balance: number;
          interest_rate: number;
          monthly_emi: number;
          remaining_months: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          debt_type: string;
          original_principal: number;
          remaining_balance: number;
          interest_rate: number;
          monthly_emi: number;
          remaining_months: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          debt_type?: string;
          original_principal?: number;
          remaining_balance?: number;
          interest_rate?: number;
          monthly_emi?: number;
          remaining_months?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          asset_type: string;
          symbol: string;
          quantity: number;
          purchase_price: number;
          current_value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          asset_type: string;
          symbol: string;
          quantity: number;
          purchase_price: number;
          current_value: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          asset_type?: string;
          symbol?: string;
          quantity?: number;
          purchase_price?: number;
          current_value?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      fixed_deposits: {
        Row: {
          id: string;
          user_id: string;
          bank_name: string;
          principal: number;
          interest_rate: number;
          tenure_months: number;
          start_date: string;
          maturity_date: string | null;
          senior_citizen: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          bank_name: string;
          principal: number;
          interest_rate: number;
          tenure_months: number;
          start_date: string;
          maturity_date?: string;
          senior_citizen?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bank_name?: string;
          principal?: number;
          interest_rate?: number;
          tenure_months?: number;
          start_date?: string;
          maturity_date?: string;
          senior_citizen?: boolean;
          created_at?: string;
        };
      };
      financial_scores: {
        Row: {
          id: string;
          user_id: string;
          health_score: number;
          health_category: string;
          spending_risk: string;
          savings_rate: number;
          expense_ratio: number;
          debt_to_income: number;
          emergency_fund_months: number;
          model_version: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          health_score: number;
          health_category: string;
          spending_risk: string;
          savings_rate: number;
          expense_ratio: number;
          debt_to_income: number;
          emergency_fund_months: number;
          model_version: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          health_score?: number;
          health_category?: string;
          spending_risk?: string;
          savings_rate?: number;
          expense_ratio?: number;
          debt_to_income?: number;
          emergency_fund_months?: number;
          model_version?: string;
          created_at?: string;
        };
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          priority: string;
          title: string;
          reason: string | null;
          suggested_action: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          category: string;
          priority: string;
          title: string;
          reason?: string;
          suggested_action?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          priority?: string;
          title?: string;
          reason?: string;
          suggested_action?: string;
          created_at?: string;
        };
      };
      financial_history: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          income: number;
          expenses: number;
          savings: number;
          debt: number;
          investments: number;
          fd_value: number;
          net_worth: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          month: string;
          income: number;
          expenses: number;
          savings: number;
          debt: number;
          investments: number;
          fd_value: number;
          net_worth: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          income?: number;
          expenses?: number;
          savings?: number;
          debt?: number;
          investments?: number;
          fd_value?: number;
          net_worth?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

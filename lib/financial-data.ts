import { supabase } from '@/lib/supabase/client'

export type FinancialRecord = Record<string, unknown> & { id: string; user_id: string; created_at?: string }

export type FinancialTable =
  | 'income_records'
  | 'expense_records'
  | 'savings_records'
  | 'debts'
  | 'investments'
  | 'fixed_deposits'

export function toNumber(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function validateAmount(value: string) {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0
}

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Please sign in to manage your finances.')
  return data.user.id
}

export async function listRecords(table: FinancialTable) {
  const userId = await getCurrentUserId()
  const { data, error } = await (supabase.from(table) as any).select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as FinancialRecord[]
}

export async function addRecord(table: FinancialTable, payload: Record<string, unknown>) {
  const userId = await getCurrentUserId()
  const { data, error } = await (supabase.from(table) as any).insert({ ...payload, user_id: userId }).select().single()
  if (error) throw error
  return data as FinancialRecord
}

export async function deleteRecord(table: FinancialTable, id: string) {
  const userId = await getCurrentUserId()
  const { error } = await (supabase.from(table) as any).delete().eq('id', id).eq('user_id', userId)
  if (error) throw error
}

export function sumBy(records: FinancialRecord[], key: string) {
  return records.reduce((total, record) => total + toNumber(record[key]), 0)
}

export function formatRecordError(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return 'We could not save that record. Please check the values and try again.'
}

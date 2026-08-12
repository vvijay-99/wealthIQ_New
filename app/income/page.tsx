'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/state-components'
import { Plus, Wallet, Trash2 } from 'lucide-react'
import { addRecord, deleteRecord, formatRecordError, listRecords, toNumber, validateAmount, type FinancialRecord } from '@/lib/financial-data'
import { formatCurrency, formatDate } from '@/lib/format'

export default function IncomePage() {
  const [records, setRecords] = useState<FinancialRecord[]>([])
  const [source, setSource] = useState('Salary')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { void listRecords('income_records').then(setRecords).catch((e) => setError(formatRecordError(e))).finally(() => setLoading(false)) }, [])
  async function save(event: React.FormEvent) { event.preventDefault(); if (!validateAmount(amount) || !date) { setError('Enter a positive amount and valid date.'); return }; setSaving(true); setError(''); try { const record = await addRecord('income_records', { source: source.trim(), amount: Number(amount), record_date: date }); setRecords((current) => [record, ...current]); setAmount('') } catch (e) { setError(formatRecordError(e)) } finally { setSaving(false) } }
  async function remove(id: string) { try { await deleteRecord('income_records', id); setRecords((current) => current.filter((item) => item.id !== id)) } catch (e) { setError(formatRecordError(e)) } }
  return <DashboardLayout><PageHeader title="Income" description="Track your income sources and monthly cash inflows." /><Card className="mt-6"><CardHeader><CardTitle className="text-base">Add Income</CardTitle></CardHeader><CardContent><form onSubmit={save} className="grid gap-4 sm:grid-cols-3"><div className="space-y-2"><Label htmlFor="income-source">Source</Label><Input id="income-source" value={source} onChange={(e) => setSource(e.target.value)} required /></div><div className="space-y-2"><Label htmlFor="income-amount">Amount (₹)</Label><Input id="income-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div><div className="space-y-2"><Label htmlFor="income-date">Date</Label><Input id="income-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div><Button type="submit" disabled={saving} className="sm:col-span-3"><Plus className="mr-2 h-4 w-4" />{saving ? 'Saving…' : 'Save Income'}</Button></form></CardContent></Card>{error && <p role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}<Card className="mt-6"><CardHeader><CardTitle className="text-base">Income History</CardTitle></CardHeader><CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading income…</p> : records.length === 0 ? <EmptyState icon={<Wallet className="h-6 w-6" />} title="No income recorded" description="Add your first income record to begin." /> : <Table><TableHeader><TableRow><TableHead>Source</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{records.map((record) => <TableRow key={record.id}><TableCell className="font-medium">{String(record.source ?? record.income_type ?? 'Income')}</TableCell><TableCell>{formatCurrency(toNumber(record.amount))}</TableCell><TableCell>{formatDate(String(record.record_date ?? record.created_at ?? ''))}</TableCell><TableCell className="text-right"><Button type="button" variant="ghost" size="icon" onClick={() => void remove(record.id)} aria-label="Delete income"><Trash2 className="h-4 w-4 text-danger" /></Button></TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card></DashboardLayout>
}

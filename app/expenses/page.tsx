'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExpenseChart } from '@/components/expense-chart';
import { EmptyState } from '@/components/state-components';
import { Plus, TrendingDown, Trash2 } from 'lucide-react';
import { addRecord, deleteRecord, formatRecordError, listRecords, toNumber, validateAmount, type FinancialRecord } from '@/lib/financial-data';
import { formatCurrency, formatDate } from '@/lib/format';

const expenseCategories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Healthcare', 'Education', 'Entertainment', 'Shopping', 'Other'];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<FinancialRecord[]>([]);
  const [category, setCategory] = useState('Housing');
  const [amount, setAmount] = useState('');
  const [expenseType, setExpenseType] = useState<'essential' | 'discretionary'>('essential');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    void listRecords('expense_records').then(setExpenses).catch((err) => setError(formatRecordError(err))).finally(() => setLoading(false));
  }, []);

  const totalEssential = useMemo(() => expenses.filter((e) => e.expense_type === 'essential').reduce((sum, e) => sum + toNumber(e.amount), 0), [expenses]);
  const totalDiscretionary = useMemo(() => expenses.filter((e) => e.expense_type === 'discretionary').reduce((sum, e) => sum + toNumber(e.amount), 0), [expenses]);
  const chartData = useMemo(() => expenses.map((expense) => ({ category: String(expense.category), amount: toNumber(expense.amount), type: String(expense.expense_type) as 'essential' | 'discretionary' })), [expenses]);

  async function saveExpense() {
    if (!validateAmount(amount) || !recordDate) { setError('Enter a positive amount and a valid date.'); return; }
    setSaving(true); setError('');
    try {
      const record = await addRecord('expense_records', { category, amount: Number(amount), expense_type: expenseType, record_date: recordDate, description: description.trim() || null });
      setExpenses((current) => [record, ...current]); setAmount(''); setDescription('');
    } catch (err) { setError(formatRecordError(err)); } finally { setSaving(false); }
  }

  async function removeExpense(id: string) {
    try { await deleteRecord('expense_records', id); setExpenses((current) => current.filter((expense) => expense.id !== id)); } catch (err) { setError(formatRecordError(err)); }
  }

  return <DashboardLayout><PageHeader title="Expenses" description="Track and categorize your expenses."><Button onClick={saveExpense} disabled={saving}><Plus className="mr-2 h-4 w-4" />{saving ? 'Saving…' : 'Add Expense'}</Button></PageHeader>
    {error && <p role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
    <div className="mt-6 grid gap-4 sm:grid-cols-3"><Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total</p><p className="mt-1 text-2xl font-bold">{formatCurrency(totalEssential + totalDiscretionary)}</p></CardContent></Card><Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Essential</p><p className="mt-1 text-2xl font-bold text-chart-1">{formatCurrency(totalEssential)}</p></CardContent></Card><Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Discretionary</p><p className="mt-1 text-2xl font-bold text-chart-3">{formatCurrency(totalDiscretionary)}</p></CardContent></Card></div>
    <Card className="mt-6"><CardHeader><CardTitle className="text-base">Add New Expense</CardTitle></CardHeader><CardContent><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="space-y-2"><Label htmlFor="category">Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger id="category"><SelectValue /></SelectTrigger><SelectContent>{expenseCategories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="amount">Amount (₹)</Label><Input id="amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="type">Type</Label><Select value={expenseType} onValueChange={(value) => setExpenseType(value as typeof expenseType)}><SelectTrigger id="type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="essential">Essential</SelectItem><SelectItem value="discretionary">Discretionary</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={recordDate} onChange={(e) => setRecordDate(e.target.value)} /></div></div><div className="mt-4 space-y-2"><Label htmlFor="description">Description (optional)</Label><Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} /></div><Button className="mt-4" onClick={saveExpense} disabled={saving}><Plus className="mr-2 h-4 w-4" />Save Expense</Button></CardContent></Card>
    {chartData.length > 0 && <Card className="mt-6"><CardHeader><CardTitle className="text-base">Expense Breakdown by Category</CardTitle></CardHeader><CardContent><ExpenseChart data={chartData} type="bar" /></CardContent></Card>}
    <Card className="mt-6"><CardHeader><CardTitle className="text-base">Expense History</CardTitle></CardHeader><CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading expenses…</p> : expenses.length === 0 ? <EmptyState icon={<TrendingDown className="h-6 w-6" />} title="No expenses recorded" description="Add your first expense to start tracking your spending." /> : <Table><TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{expenses.map((expense) => <TableRow key={expense.id}><TableCell className="font-medium">{String(expense.category)}</TableCell><TableCell>{formatCurrency(toNumber(expense.amount))}</TableCell><TableCell>{String(expense.expense_type)}</TableCell><TableCell>{formatDate(String(expense.record_date))}</TableCell><TableCell className="text-muted-foreground">{String(expense.description || '—')}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => removeExpense(expense.id)} aria-label="Delete expense"><Trash2 className="h-4 w-4 text-danger" /></Button></TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
  </DashboardLayout>;
}

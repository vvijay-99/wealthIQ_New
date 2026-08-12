'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MetricCard } from '@/components/metric-card';
import { Plus, CreditCard, Trash2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { addRecord, deleteRecord, formatRecordError, listRecords, sumBy, toNumber, updateRecord, validateAmount, validateInteger, validateRate, type FinancialRecord } from '@/lib/financial-data';
import { formatCurrency, formatPercent } from '@/lib/format';

const debtTypes = [
  'Home Loan',
  'Car Loan',
  'Personal Loan',
  'Education Loan',
  'Credit Card',
  'Other',
];

export default function DebtsPage() {
  const [debts, setDebts] = useState<FinancialRecord[]>([]);
  const [form, setForm] = useState({ debt_type: 'Home Loan', original_principal: '', remaining_balance: '', interest_rate: '', monthly_emi: '', remaining_months: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  useEffect(() => { void listRecords('debts').then(setDebts).catch((err) => setError(formatRecordError(err))); }, []);
  const totalDebt = sumBy(debts, 'remaining_balance');
  const totalEMI = sumBy(debts, 'monthly_emi');
  const income = 0;
  const debtToIncome = income ? totalEMI / income : 0;
  async function saveDebt(event: React.FormEvent) { event.preventDefault(); setError(''); const numeric = ['original_principal', 'remaining_balance', 'interest_rate', 'monthly_emi', 'remaining_months'].reduce((acc, key) => ({ ...acc, [key]: Number(form[key as keyof typeof form]) }), {}); if (!form.debt_type || !validateAmount(form.original_principal) || !validateAmount(form.remaining_balance) || !validateRate(form.interest_rate) || !validateAmount(form.monthly_emi) || !validateInteger(form.remaining_months, 0)) { setError('Enter valid non-negative debt values.'); return } try { const record = await addRecord('debts', { ...numeric, debt_type: form.debt_type }); setDebts((current) => [record, ...current]); setForm({ debt_type: 'Home Loan', original_principal: '', remaining_balance: '', interest_rate: '', monthly_emi: '', remaining_months: '' }); } catch (err) { setError(formatRecordError(err)) } }
  async function removeDebt(id: string) { if (!window.confirm('Delete this debt?')) return; try { await deleteRecord('debts', id); setDebts((current) => current.filter((debt) => debt.id !== id)); } catch (err) { setError(formatRecordError(err)) } }

  return (
    <DashboardLayout>
      <PageHeader
        title="Debts"
        description="Manage your loans, EMIs, and debt obligations."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Debt
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Outstanding Debt"
          value={formatCurrency(totalDebt)}
          icon={<CreditCard className="h-4 w-4" />}
          accent="danger"
        />
        <MetricCard
          title="Monthly EMI Total"
          value={formatCurrency(totalEMI)}
          accent="danger"
        />
        <MetricCard
          title="Debt-to-Income Ratio"
          value={formatPercent(debtToIncome)}
          subtitle={debtToIncome < 0.4 ? 'Healthy' : 'High'}
          accent={debtToIncome < 0.4 ? 'success' : 'danger'}
        />
        <MetricCard
          title="Active Loans"
          value={String(debts.length)}
          accent="warning"
        />
      </div>

      {/* Add form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Add New Debt</CardTitle>
        </CardHeader>
        <CardContent><form onSubmit={saveDebt}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="debt-type">Loan Type</Label>
              <Select defaultValue="Home Loan">
                <SelectTrigger id="debt-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {debtTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="principal">Original Principal (₹)</Label>
              <Input id="principal" type="number" placeholder="2500000" value={form.original_principal} onChange={(e) => setForm({ ...form, original_principal: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remaining">Remaining Balance (₹)</Label>
              <Input id="remaining" type="number" placeholder="280000" value={form.remaining_balance} onChange={(e) => setForm({ ...form, remaining_balance: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest">Interest Rate (%)</Label>
              <Input id="interest" type="number" step="0.1" placeholder="8.5" value={form.interest_rate} onChange={(e) => setForm({ ...form, interest_rate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emi">Monthly EMI (₹)</Label>
              <Input id="emi" type="number" placeholder="12000" value={form.monthly_emi} onChange={(e) => setForm({ ...form, monthly_emi: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenure">Remaining Months</Label>
              <Input id="tenure" type="number" placeholder="28" value={form.remaining_months} onChange={(e) => setForm({ ...form, remaining_months: e.target.value })} />
            </div>
          </div>
          <Button className="mt-4" type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Save Debt
          </Button>{error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
        </form></CardContent>
      </Card>

      {/* Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Debt Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Type</TableHead>
                <TableHead>Original Principal</TableHead>
                <TableHead>Remaining Balance</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Monthly EMI</TableHead>
                <TableHead>Months Left</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell className="font-medium">{String(debt.debt_type)}</TableCell>
                  <TableCell>{formatCurrency(toNumber(debt.original_principal))}</TableCell>
                  <TableCell className="font-semibold text-danger">
                    {formatCurrency(toNumber(debt.remaining_balance))}
                  </TableCell>
                  <TableCell>{toNumber(debt.interest_rate)}%</TableCell>
                  <TableCell>{formatCurrency(toNumber(debt.monthly_emi))}</TableCell>
                  <TableCell>{toNumber(debt.remaining_months)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" type="button" onClick={() => void removeDebt(debt.id)} aria-label={`Delete ${String(debt.debt_type)}`}>
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4">
        <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/80">
          A debt-to-income ratio above 40% is generally considered high. Focus
          on reducing high-interest debt first.
        </p>
      </div>
    </DashboardLayout>
  );
}

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
import { MOCK_DEBT_RECORDS, MOCK_FEATURES } from '@/lib/mock-data';
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
  const debts = MOCK_DEBT_RECORDS;
  const totalDebt = debts.reduce((sum, d) => sum + d.remaining_balance, 0);
  const totalEMI = debts.reduce((sum, d) => sum + d.monthly_emi, 0);

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
          value={formatPercent(MOCK_FEATURES.debt_to_income)}
          subtitle={MOCK_FEATURES.debt_to_income < 0.4 ? 'Healthy' : 'High'}
          accent={MOCK_FEATURES.debt_to_income < 0.4 ? 'success' : 'danger'}
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
        <CardContent>
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
              <Input id="principal" type="number" placeholder="2500000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remaining">Remaining Balance (₹)</Label>
              <Input id="remaining" type="number" placeholder="280000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest">Interest Rate (%)</Label>
              <Input id="interest" type="number" step="0.1" placeholder="8.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emi">Monthly EMI (₹)</Label>
              <Input id="emi" type="number" placeholder="12000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenure">Remaining Months</Label>
              <Input id="tenure" type="number" placeholder="28" />
            </div>
          </div>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Save Debt
          </Button>
        </CardContent>
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
                  <TableCell className="font-medium">{debt.debt_type}</TableCell>
                  <TableCell>{formatCurrency(debt.original_principal)}</TableCell>
                  <TableCell className="font-semibold text-danger">
                    {formatCurrency(debt.remaining_balance)}
                  </TableCell>
                  <TableCell>{debt.interest_rate}%</TableCell>
                  <TableCell>{formatCurrency(debt.monthly_emi)}</TableCell>
                  <TableCell>{debt.remaining_months}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
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

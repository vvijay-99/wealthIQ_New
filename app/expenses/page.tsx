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
import { ExpenseChart } from '@/components/expense-chart';
import { EmptyState } from '@/components/state-components';
import { Plus, TrendingDown, Trash2 } from 'lucide-react';
import { MOCK_EXPENSE_RECORDS, MOCK_EXPENSE_CHART } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/format';
import type { ExpenseType } from '@/lib/types';

const expenseCategories = [
  'Housing',
  'Food',
  'Transportation',
  'Utilities',
  'Healthcare',
  'Education',
  'Entertainment',
  'Shopping',
  'Other',
];

export default function ExpensesPage() {
  const expenses = MOCK_EXPENSE_RECORDS;
  const totalEssential = expenses
    .filter((e) => e.expense_type === 'essential')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalDiscretionary = expenses
    .filter((e) => e.expense_type === 'discretionary')
    .reduce((sum, e) => sum + e.amount, 0);
  const total = totalEssential + totalDiscretionary;

  return (
    <DashboardLayout>
      <PageHeader
        title="Expenses"
        description="Track and categorize your monthly expenses."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </PageHeader>

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Monthly</p>
            <p className="mt-1 text-2xl font-bold">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Essential</p>
            <p className="mt-1 text-2xl font-bold text-chart-1">
              {formatCurrency(totalEssential)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Discretionary</p>
            <p className="mt-1 text-2xl font-bold text-chart-3">
              {formatCurrency(totalDiscretionary)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add expense form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select defaultValue="Housing">
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" placeholder="5000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select defaultValue="essential">
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essential">Essential</SelectItem>
                  <SelectItem value="discretionary">Discretionary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input id="description" placeholder="e.g., Monthly rent" />
          </div>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Save Expense
          </Button>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Expense Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseChart data={MOCK_EXPENSE_CHART} type="bar" />
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <EmptyState
              icon={<TrendingDown className="h-6 w-6" />}
              title="No expenses recorded"
              description="Add your first expense to start tracking your spending."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.category}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          expense.expense_type === 'essential'
                            ? 'bg-chart-1/10 text-chart-1'
                            : 'bg-chart-3/10 text-chart-3'
                        }`}
                      >
                        {expense.expense_type}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(expense.record_date)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {expense.description || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

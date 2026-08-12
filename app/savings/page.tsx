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
import { Plus, PiggyBank, Shield, Trash2, TrendingUp } from 'lucide-react';
import { MOCK_SAVINGS_RECORDS, MOCK_FEATURES } from '@/lib/mock-data';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format';

export default function SavingsPage() {
  const savings = MOCK_SAVINGS_RECORDS;
  const features = MOCK_FEATURES;

  return (
    <DashboardLayout>
      <PageHeader
        title="Savings"
        description="Track your savings and emergency fund."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Savings Record
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Savings"
          value={formatCurrency(features.current_savings)}
          icon={<PiggyBank className="h-4 w-4" />}
          accent="success"
        />
        <MetricCard
          title="Emergency Fund"
          value={formatCurrency(features.emergency_fund)}
          subtitle={`${formatNumber(features.emergency_fund_months, 1)} months coverage`}
          icon={<Shield className="h-4 w-4" />}
          accent={
            features.emergency_fund_months >= 3 ? 'success' : 'warning'
          }
        />
        <MetricCard
          title="Savings Rate"
          value={formatPercent(features.savings_rate)}
          subtitle="Income saved monthly"
          icon={<TrendingUp className="h-4 w-4" />}
          accent="primary"
        />
        <MetricCard
          title="Monthly Savings"
          value={formatCurrency(33000)}
          accent="primary"
        />
      </div>

      {/* Add form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Add Savings Record</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sav-amount">Amount (₹)</Label>
              <Input id="sav-amount" type="number" placeholder="50000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sav-type">Savings Type</Label>
              <Select defaultValue="Total Savings">
                <SelectTrigger id="sav-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Total Savings">Total Savings</SelectItem>
                  <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                  <SelectItem value="Monthly Savings">Monthly Savings</SelectItem>
                  <SelectItem value="Goal Savings">Goal Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sav-date">Date</Label>
              <Input id="sav-date" type="date" />
            </div>
          </div>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Save Record
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Savings Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savings.map((sav) => (
                <TableRow key={sav.id}>
                  <TableCell className="font-medium">{sav.savings_type}</TableCell>
                  <TableCell>{formatCurrency(sav.amount)}</TableCell>
                  <TableCell>{sav.record_date}</TableCell>
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
    </DashboardLayout>
  );
}

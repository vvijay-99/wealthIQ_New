'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Landmark, Trash2, Calendar } from 'lucide-react';
import { MOCK_FD_RECORDS, MOCK_FD_RATES } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/format';

export default function FDPage() {
  const fds = MOCK_FD_RECORDS;
  const totalPrincipal = fds.reduce((sum, fd) => sum + fd.principal, 0);
  const totalValue = fds.reduce((sum, fd) => {
    const interest = fd.principal * (fd.interest_rate / 100) * (fd.tenure_months / 12);
    return sum + fd.principal + interest;
  }, 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Fixed Deposits"
        description="Track your FDs and compare bank rates."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add FD
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total FD Principal"
          value={formatCurrency(totalPrincipal)}
          icon={<Landmark className="h-4 w-4" />}
          accent="primary"
        />
        <MetricCard
          title="Estimated Maturity Value"
          value={formatCurrency(totalValue)}
          subtitle="Approx. with interest"
          accent="success"
        />
        <MetricCard
          title="Active FDs"
          value={String(fds.length)}
          accent="neutral"
        />
        <MetricCard
          title="Avg. Interest Rate"
          value={`${(fds.reduce((s, f) => s + f.interest_rate, 0) / fds.length).toFixed(1)}%`}
          accent="primary"
        />
      </div>

      {/* Add form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Add New Fixed Deposit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fd-bank">Bank Name</Label>
              <Select defaultValue="HDFC">
                <SelectTrigger id="fd-bank">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_FD_RATES.map((r) => (
                    <SelectItem key={r.bank_name} value={r.bank_name}>
                      {r.bank_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fd-principal">Principal (₹)</Label>
              <Input id="fd-principal" type="number" placeholder="100000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fd-rate">Interest Rate (%)</Label>
              <Input id="fd-rate" type="number" step="0.1" placeholder="7.0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fd-tenure">Tenure (months)</Label>
              <Input id="fd-tenure" type="number" placeholder="12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fd-start">Start Date</Label>
              <Input id="fd-start" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fd-maturity">Maturity Date</Label>
              <Input id="fd-maturity" type="date" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Switch id="senior" />
            <Label htmlFor="senior">Senior Citizen (higher rate)</Label>
          </div>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Save FD
          </Button>
        </CardContent>
      </Card>

      {/* Your FDs */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Your Fixed Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Tenure</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Maturity</TableHead>
                <TableHead>Senior</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fds.map((fd) => {
                const maturityValue =
                  fd.principal +
                  fd.principal * (fd.interest_rate / 100) * (fd.tenure_months / 12);
                return (
                  <TableRow key={fd.id}>
                    <TableCell className="font-medium">{fd.bank_name}</TableCell>
                    <TableCell>{formatCurrency(fd.principal)}</TableCell>
                    <TableCell>{fd.interest_rate}%</TableCell>
                    <TableCell>{fd.tenure_months} months</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(fd.start_date)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(fd.maturity_date)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {fd.senior_citizen ? (
                        <span className="text-xs font-medium text-success">Yes</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* FD Rate Comparison */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">FD Rate Comparison (12-month tenure)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank</TableHead>
                <TableHead>Regular Rate</TableHead>
                <TableHead>Senior Citizen Rate</TableHead>
                <TableHead>Min. Amount</TableHead>
                <TableHead>Premature Withdrawal</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_FD_RATES.map((rate) => (
                <TableRow key={rate.bank_name}>
                  <TableCell className="font-medium">{rate.bank_name}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {rate.regular_interest_rate}%
                  </TableCell>
                  <TableCell>{rate.senior_citizen_interest_rate}%</TableCell>
                  <TableCell>{formatCurrency(rate.minimum_amount)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {rate.premature_withdrawal_notes}
                  </TableCell>
                  <TableCell className="text-xs">{rate.last_updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-xs text-muted-foreground">
            Rates shown are for reference only. Verify current rates with the
            bank before making a financial decision.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

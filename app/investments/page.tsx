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
import { Plus, LineChart, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { MOCK_INVESTMENT_RECORDS, MOCK_FEATURES } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/format';

const assetTypes = ['Stock', 'Mutual Fund', 'ETF', 'Bond', 'Gold', 'Crypto', 'Other'];

export default function InvestmentsPage() {
  const investments = MOCK_INVESTMENT_RECORDS;
  const totalValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.purchase_price * inv.quantity,
    0
  );
  const totalGain = totalValue - totalInvested;
  const gainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return (
    <DashboardLayout>
      <PageHeader
        title="Investments"
        description="Track your investment portfolio and allocation."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Portfolio Value"
          value={formatCurrency(totalValue)}
          icon={<LineChart className="h-4 w-4" />}
          accent="primary"
        />
        <MetricCard
          title="Total Invested"
          value={formatCurrency(totalInvested)}
          accent="neutral"
        />
        <MetricCard
          title="Total Gain/Loss"
          value={formatCurrency(totalGain)}
          subtitle={`${gainPercent >= 0 ? '+' : ''}${gainPercent.toFixed(1)}%`}
          trend={gainPercent >= 0 ? 'up' : 'down'}
          trendValue={`${gainPercent >= 0 ? '+' : ''}${gainPercent.toFixed(1)}%`}
          accent={gainPercent >= 0 ? 'success' : 'danger'}
        />
        <MetricCard
          title="Asset Types"
          value={String(new Set(investments.map((i) => i.asset_type)).size)}
          accent="primary"
        />
      </div>

      {/* Add form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Add New Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="asset-type">Asset Type</Label>
              <Select defaultValue="Stock">
                <SelectTrigger id="asset-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol / Name</Label>
              <Input id="symbol" placeholder="RELIANCE" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase">Purchase Price (₹)</Label>
              <Input id="purchase" type="number" placeholder="2400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current">Current Value (₹)</Label>
              <Input id="current" type="number" placeholder="2890" />
            </div>
          </div>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Save Investment
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Type</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Gain/Loss</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((inv) => {
                const invested = inv.purchase_price * inv.quantity;
                const gain = inv.current_value - invested;
                const gainPct = invested > 0 ? (gain / invested) * 100 : 0;
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.asset_type}</TableCell>
                    <TableCell>{inv.symbol}</TableCell>
                    <TableCell>{inv.quantity}</TableCell>
                    <TableCell>{formatCurrency(inv.purchase_price)}</TableCell>
                    <TableCell>{formatCurrency(inv.current_value)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          gain >= 0 ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {gain >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {formatCurrency(gain)} ({gainPct >= 0 ? '+' : ''}
                        {gainPct.toFixed(1)}%)
                      </span>
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
    </DashboardLayout>
  );
}

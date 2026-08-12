'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { PageHeader } from '@/components/page-header';
import { MetricCard } from '@/components/metric-card';
import { HealthScoreCard } from '@/components/health-score-card';
import { RiskBadge } from '@/components/risk-badge';
import { RecommendationCard } from '@/components/recommendation-card';
import { ForecastChart } from '@/components/forecast-chart';
import { ExpenseChart } from '@/components/expense-chart';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Shield,
  CircleDollarSign,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  MOCK_SCORE,
  MOCK_SCORE_BREAKDOWN,
  MOCK_FEATURES,
  MOCK_RECOMMENDATIONS,
  MOCK_FORECAST,
  MOCK_EXPENSE_CHART,
} from '@/lib/mock-data';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format';
import Link from 'next/link';

export default function DashboardPage() {
  const score = MOCK_SCORE;
  const features = MOCK_FEATURES;
  const recs = MOCK_RECOMMENDATIONS.slice(0, 3);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Your financial health at a glance."
      >
        <Button asChild>
          <Link href="/expenses">
            Add Transaction
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      <div className="mt-4">
        <DisclaimerBanner />
      </div>

      {/* Top row — Health Score + Key Metrics */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <HealthScoreCard
          score={score.health_score}
          category={score.health_category}
          className="lg:col-span-1"
        />

        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-3">
          <MetricCard
            title="Health Category"
            value={score.health_category}
            subtitle="ML Classification"
            icon={<Sparkles className="h-4 w-4" />}
            accent="primary"
          />
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Spending Risk
            </p>
            <div className="mt-3">
              <RiskBadge level={score.spending_risk} size="lg" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              ML-based classification
            </p>
          </div>
          <MetricCard
            title="Net Worth"
            value={formatCurrency(features.net_worth)}
            subtitle="Cash + Investments + FD - Debt"
            icon={<CircleDollarSign className="h-4 w-4" />}
            accent="primary"
          />
          <MetricCard
            title="Monthly Income"
            value={formatCurrency(features.monthly_income)}
            icon={<Wallet className="h-4 w-4" />}
            accent="success"
          />
          <MetricCard
            title="Monthly Expenses"
            value={formatCurrency(features.monthly_expenses)}
            subtitle={`${formatPercent(features.expense_ratio)} of income`}
            icon={<TrendingDown className="h-4 w-4" />}
            accent="warning"
          />
          <MetricCard
            title="Savings Rate"
            value={formatPercent(features.savings_rate)}
            subtitle={formatCurrency(features.current_savings) + ' saved'}
            icon={<PiggyBank className="h-4 w-4" />}
            accent="success"
          />
        </div>
      </div>

      {/* Financial Ratios Row */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Expense Ratio"
          value={formatPercent(features.expense_ratio)}
          subtitle="Expenses / Income"
          accent="warning"
        />
        <MetricCard
          title="Debt-to-Income"
          value={formatPercent(features.debt_to_income)}
          subtitle={formatCurrency(features.monthly_emi) + '/month EMI'}
          icon={<CreditCard className="h-4 w-4" />}
          accent="danger"
        />
        <MetricCard
          title="Emergency Fund"
          value={`${formatNumber(features.emergency_fund_months, 1)} months`}
          subtitle="Essential expenses coverage"
          icon={<Shield className="h-4 w-4" />}
          accent={
            features.emergency_fund_months >= 3
              ? 'success'
              : features.emergency_fund_months >= 1
              ? 'warning'
              : 'danger'
          }
        />
        <MetricCard
          title="Discretionary Ratio"
          value={formatPercent(features.discretionary_expense_ratio)}
          subtitle="Non-essential spending"
          accent="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Financial Forecast</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/forecast">
                View Details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ForecastChart data={MOCK_FORECAST} />
            <p className="mt-2 text-xs text-muted-foreground">
              Solid line: historical data. Dashed line: forecast estimates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Expense Breakdown</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/expenses">
                View Details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={MOCK_EXPENSE_CHART} type="bar" />
            <div className="mt-3 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-chart-1" />
                <span className="text-muted-foreground">Essential</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-chart-3" />
                <span className="text-muted-foreground">Discretionary</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Breakdown */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">
            How Your Health Score Is Calculated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scoreBreakdownItems.map((item) => {
              const value = MOCK_SCORE_BREAKDOWN[item.key as keyof typeof MOCK_SCORE_BREAKDOWN] as number;
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-bold text-primary">
                      {value}/100
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Weight: {item.weight}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/80">
              <span className="font-medium">Hybrid Financial Health Score</span> —
              This is a deterministic weighted score, not a machine learning
              prediction. The ML Health Category is a separate output shown
              above.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top Recommendations */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Recommendations</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recommendations">
              View All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recs.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>

      {/* Mock data notice */}
      <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Phase 1: Displaying clearly marked mock UI data. Financial calculations,
          ML predictions, and recommendations will be connected to the FastAPI
          backend in later phases.
        </p>
      </div>
    </DashboardLayout>
  );
}

const scoreBreakdownItems = [
  { key: 'savings_score', label: 'Savings Health', weight: '25%' },
  { key: 'expense_score', label: 'Expense Management', weight: '20%' },
  { key: 'debt_score', label: 'Debt Health', weight: '20%' },
  { key: 'emergency_score', label: 'Emergency Fund', weight: '15%' },
  { key: 'investment_score', label: 'Investment Diversification', weight: '10%' },
  { key: 'income_score', label: 'Income Stability', weight: '10%' },
];

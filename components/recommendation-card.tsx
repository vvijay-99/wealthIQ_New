'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getPriorityColor } from '@/lib/format';
import type { Recommendation } from '@/lib/types';
import {
  PiggyBank,
  TrendingDown,
  Shield,
  CreditCard,
  LineChart,
  Landmark,
  Target,
  AlertCircle,
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  Savings: <PiggyBank className="h-5 w-5" />,
  Expenses: <TrendingDown className="h-5 w-5" />,
  'Emergency Fund': <Shield className="h-5 w-5" />,
  Debt: <CreditCard className="h-5 w-5" />,
  'Investment Diversification': <LineChart className="h-5 w-5" />,
  FD: <Landmark className="h-5 w-5" />,
  'Financial Planning': <Target className="h-5 w-5" />,
};

const categoryColors: Record<string, string> = {
  Savings: 'bg-success/10 text-success',
  Expenses: 'bg-warning/10 text-warning',
  'Emergency Fund': 'bg-danger/10 text-danger',
  Debt: 'bg-danger/10 text-danger',
  'Investment Diversification': 'bg-primary/10 text-primary',
  FD: 'bg-primary/10 text-primary',
  'Financial Planning': 'bg-primary/10 text-primary',
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  className?: string;
}

export function RecommendationCard({
  recommendation,
  className,
}: RecommendationCardProps) {
  const { category, priority, severity, title, reason, suggested_action } =
    recommendation;

  return (
    <Card className={cn('transition-colors hover:bg-muted/30', className)}>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
        <div
          className={cn(
            'rounded-lg p-2.5 shrink-0',
            categoryColors[category] || 'bg-muted text-muted-foreground'
          )}
        >
          {categoryIcons[category] || <AlertCircle className="h-5 w-5" />}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold',
                getPriorityColor(priority)
              )}
            >
              {priority} Priority
            </span>
            <span className="text-xs text-muted-foreground">{category}</span>
          </div>
          <h4 className="text-sm font-semibold leading-snug">{title}</h4>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Reason</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{reason}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Suggested Action
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {suggested_action}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground">Severity</span>
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                severity >= 0.7
                  ? 'bg-danger'
                  : severity >= 0.4
                  ? 'bg-warning'
                  : 'bg-success'
              )}
              style={{ width: `${severity * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono font-medium">
            {(severity * 100).toFixed(0)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

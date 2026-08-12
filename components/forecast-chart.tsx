'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import type { ForecastPoint } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

interface ForecastChartProps {
  data: ForecastPoint[];
  className?: string;
}

export function ForecastChart({ data, className }: ForecastChartProps) {
  const lastHistoricalMonth = [...data]
    .reverse()
    .find((d) => !d.isForecast)?.month;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCurrency(value).replace(/\s/g, '')}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          {lastHistoricalMonth && (
            <ReferenceLine
              x={lastHistoricalMonth}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              label={{
                value: 'Forecast →',
                position: 'top',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="net_worth"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2.5}
            fill="url(#netWorthGradient)"
            dot={{ fill: 'hsl(var(--chart-1))', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="savings"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';
import { getRiskColor } from '@/lib/format';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function RiskBadge({ level, className, size = 'md' }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        getRiskColor(level),
        sizeClasses[size],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level} Risk
    </span>
  );
}

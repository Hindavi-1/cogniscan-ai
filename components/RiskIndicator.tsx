'use client';

import { RiskLevel } from '@/context/AssessmentContext';

interface RiskIndicatorProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const riskConfig = {
  Low: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', label: 'Low Risk', icon: '✓' },
  Medium: { color: '#EAB308', bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.3)', label: 'Medium Risk', icon: '!' },
  High: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', label: 'High Risk', icon: '!!' },
};

export default function RiskIndicator({ level, size = 'md', showLabel = true }: RiskIndicatorProps) {
  if (!level) return null;
  const config = riskConfig[level];

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-600 ${sizeClasses[size]}`}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: config.color }}
      />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

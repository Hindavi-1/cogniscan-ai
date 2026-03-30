'use client';

import { RiskLevel } from '@/context/AssessmentContext';
import styles from './RiskIndicator.module.css';

interface RiskIndicatorProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const riskConfig = {
  Low: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', label: 'Low Risk' },
  Medium: { color: '#EAB308', bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.3)', label: 'Medium Risk' },
  High: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', label: 'High Risk' },
};

export default function RiskIndicator({ level, size = 'md', showLabel = true }: RiskIndicatorProps) {
  if (!level) return null;
  const config = riskConfig[level];

  return (
    <div
      className={`${styles.indicator} ${styles[size]}`}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <div
        className={styles.dot}
        style={{ backgroundColor: config.color }}
      />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

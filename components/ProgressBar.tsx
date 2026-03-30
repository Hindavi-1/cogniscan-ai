'use client';

import { useEffect, useState } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  label?: string;
  animated?: boolean;
  height?: string;
}

export default function ProgressBar({
  value,
  color = '#00D2FF',
  label,
  animated = true,
  height = '8px',
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setWidth(value), 100);
      return () => clearTimeout(timer);
    } else {
      setWidth(value);
    }
  }, [value, animated]);

  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value} style={{ color }}>{value}%</span>
        </div>
      )}
      <div className={styles.track} style={{ height }}>
        <div
          className={styles.fill}
          style={{ width: `${width}%`, backgroundColor: color }}
        >
          <div className={styles.shimmer} />
        </div>
      </div>
    </div>
  );
}

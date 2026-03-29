'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  label?: string;
  animated?: boolean;
  height?: string;
}

export default function ProgressBar({
  value,
  color = '#00B4D8',
  label,
  animated = true,
  height = 'h-2',
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
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-slate-400">{label}</span>
          <span className="text-xs font-mono text-accent">{value}%</span>
        </div>
      )}
      <div className={`w-full bg-white/5 rounded-full ${height} overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{ width: `${width}%`, backgroundColor: color }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
    </div>
  );
}

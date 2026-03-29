'use client';

import { useEffect, useState } from 'react';
import { RiskLevel } from '@/context/AssessmentContext';

interface CircularScoreProps {
  score: number;
  riskLevel: RiskLevel;
  size?: number;
}

const riskColors: Record<string, string> = {
  Low: '#22C55E',
  Medium: '#EAB308',
  High: '#EF4444',
};

export default function CircularScore({ score, riskLevel, size = 220 }: CircularScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [progress, setProgress] = useState(0);

  const color = riskLevel ? riskColors[riskLevel] : '#00B4D8';
  const radius = (size / 2) - 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    // Animate score number
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, score);
      setAnimatedScore(Math.round(current));
      setProgress(Math.round(current));
      if (current >= score) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer pulse rings */}
      <div
        className="absolute rounded-full border opacity-20 ring-pulse"
        style={{ width: size + 20, height: size + 20, borderColor: color }}
      />
      <div
        className="absolute rounded-full border opacity-10 ring-pulse"
        style={{ width: size + 40, height: size + 40, borderColor: color, animationDelay: '0.5s' }}
      />

      {/* SVG circle */}
      <svg width={size} height={size} className="absolute">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-ring-circle"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
        {/* Tick marks */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const x1 = size / 2 + (radius - 18) * Math.cos(rad);
          const y1 = size / 2 + (radius - 18) * Math.sin(rad);
          const x2 = size / 2 + (radius - 10) * Math.cos(rad);
          const y2 = size / 2 + (radius - 10) * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div className="relative z-10 text-center">
        <div
          className="font-display font-800 leading-none"
          style={{ fontSize: size * 0.22, color }}
        >
          {animatedScore}
        </div>
        <div className="text-slate-400 text-xs mt-1 font-mono">/ 100</div>
        <div className="text-slate-300 text-xs mt-2 font-500 uppercase tracking-widest">
          {riskLevel} Risk
        </div>
      </div>
    </div>
  );
}

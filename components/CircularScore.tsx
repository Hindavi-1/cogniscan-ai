'use client';

import { useEffect, useState } from 'react';
import { RiskLevel } from '@/context/AssessmentContext';
import styles from './CircularScore.module.css';

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

  const color = riskLevel ? riskColors[riskLevel] : '#00D2FF';
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
    <div className={styles.container} style={{ width: size, height: size }}>
      {/* Outer pulse rings */}
      <div
        className={`${styles.pulseRing} ${styles.pulseRing1}`}
        style={{ width: size + 20, height: size + 20, borderColor: color, borderWidth: '2px' }}
      />
      <div
        className={`${styles.pulseRing} ${styles.pulseRing2}`}
        style={{ width: size + 40, height: size + 40, borderColor: color, borderWidth: '1px' }}
      />

      {/* SVG circle */}
      <svg width={size} height={size} className={styles.svg}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={styles.bgTrack}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={styles.progressArc}
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
              className={styles.tick}
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div className={styles.content}>
        <div className={styles.score} style={{ fontSize: size * 0.22, color }}>
          {animatedScore}
        </div>
        <div className={styles.max}>/ 100</div>
        <div className={styles.label}>
          {riskLevel} Risk
        </div>
      </div>
    </div>
  );
}

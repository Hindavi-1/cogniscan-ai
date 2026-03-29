'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  completed: boolean;
  score: number | null;
  delay?: number;
}

export default function ModuleCard({ title, description, icon, href, completed, score, delay = 0 }: ModuleCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`glass-card rounded-2xl p-6 hover-lift transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${completed ? 'border-accent/30' : 'border-white/5'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl">
          {icon}
        </div>
        {completed ? (
          <div className="flex items-center gap-1.5 text-xs text-risk-low bg-risk-low/10 border border-risk-low/20 rounded-full px-3 py-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Completed
          </div>
        ) : (
          <div className="text-xs text-slate-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            Pending
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="font-display font-700 text-white text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">{description}</p>

      {/* Score preview if completed */}
      {completed && score !== null && (
        <div className="mb-5 p-3 rounded-xl bg-accent/5 border border-accent/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Score</span>
            <span className="font-mono text-accent font-500">{score}/100</span>
          </div>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href={href}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-600 transition-all duration-200 btn-press ${
          completed
            ? 'bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20'
            : 'bg-accent text-bg hover:bg-highlight'
        }`}
      >
        {completed ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Retake Test
          </>
        ) : (
          <>
            Start Test
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </Link>
    </div>
  );
}

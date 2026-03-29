'use client';

import { useState } from 'react';
import Link from 'next/link';
import RiskIndicator from '@/components/RiskIndicator';
import { RiskLevel } from '@/context/AssessmentContext';

interface HistoryEntry {
  id: string;
  date: string;
  finalScore: number;
  speechScore: number;
  facialScore: number;
  cognitiveScore: number;
  riskLevel: RiskLevel;
  duration: string;
}

// Dummy historical data
const historyData: HistoryEntry[] = [
  { id: '1', date: '2026-03-15', finalScore: 82, speechScore: 85, facialScore: 80, cognitiveScore: 81, riskLevel: 'Low', duration: '4m 32s' },
  { id: '2', date: '2026-02-28', finalScore: 71, speechScore: 68, facialScore: 74, cognitiveScore: 71, riskLevel: 'Medium', duration: '5m 10s' },
  { id: '3', date: '2026-02-01', finalScore: 75, speechScore: 78, facialScore: 72, cognitiveScore: 75, riskLevel: 'Medium', duration: '4m 55s' },
  { id: '4', date: '2026-01-10', finalScore: 88, speechScore: 90, facialScore: 87, cognitiveScore: 87, riskLevel: 'Low', duration: '4m 20s' },
  { id: '5', date: '2025-12-20', finalScore: 55, speechScore: 52, facialScore: 58, cognitiveScore: 55, riskLevel: 'High', duration: '6m 01s' },
  { id: '6', date: '2025-11-30', finalScore: 78, speechScore: 80, facialScore: 76, cognitiveScore: 78, riskLevel: 'Low', duration: '4m 48s' },
];

const riskColors: Record<string, string> = { Low: '#22C55E', Medium: '#EAB308', High: '#EF4444' };

function ScoreTrend({ scores }: { scores: number[] }) {
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min || 1;
  const w = 80;
  const h = 30;
  const pts = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * w;
    const y = h - ((s - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {scores.map((s, i) => {
        const x = (i / (scores.length - 1)) * w;
        const y = h - ((s - min) / range) * h;
        return <circle key={i} cx={x} cy={y} r="3" fill="#00B4D8" />;
      })}
    </svg>
  );
}

export default function HistoryPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const trendScores = [...historyData].reverse().map(h => h.finalScore);

  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg">
      <div className="orb orb-blue w-72 h-72 top-10 right-10 float" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            Assessment History
          </div>
          <h1 className="font-display font-800 text-4xl text-white mb-3">Cognitive Timeline</h1>
          <p className="text-slate-400">Track your cognitive health trends over time.</p>
        </div>

        {/* Trend chart */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-700 text-white text-lg">Score Trend</h3>
              <p className="text-slate-500 text-xs mt-0.5">Last {historyData.length} assessments</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-display font-800 text-accent">{trendScores[trendScores.length - 1]}</div>
              <div className="text-slate-500 text-xs">Latest score</div>
            </div>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end gap-3 h-24">
            {historyData.slice().reverse().map((entry, i) => {
              const color = riskColors[entry.riskLevel ?? 'Medium'];
              const heightPct = (entry.finalScore / 100) * 100;
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs font-mono text-slate-500">{entry.finalScore}</div>
                  <div className="w-full rounded-t-lg transition-all duration-500 relative overflow-hidden"
                    style={{ height: `${heightPct * 0.7}px`, backgroundColor: `${color}30`, border: `1px solid ${color}50` }}>
                    <div className="absolute inset-0 shimmer opacity-50" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-2">
            {historyData.slice().reverse().map((entry) => (
              <div key={entry.id} className="flex-1 text-center text-xs text-slate-600 font-mono">
                {entry.date.slice(5)}
              </div>
            ))}
          </div>
        </div>

        {/* History list */}
        <div className="space-y-4 mb-8">
          {historyData.map((entry, i) => {
            const isExpanded = expanded === entry.id;
            const isLatest = i === 0;
            const color = riskColors[entry.riskLevel ?? 'Medium'];

            return (
              <div
                key={entry.id}
                className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isLatest ? 'border-accent/20' : 'border-white/5'}`}
              >
                {/* Main row */}
                <button
                  className="w-full px-6 py-5 flex items-center gap-4 hover:bg-white/2 transition-colors text-left"
                  onClick={() => setExpanded(isExpanded ? null : entry.id)}
                >
                  {/* Score circle */}
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-700 text-sm flex-shrink-0"
                    style={{ borderColor: color, color, backgroundColor: `${color}15` }}
                  >
                    {entry.finalScore}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-500 text-sm">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      {isLatest && (
                        <span className="text-xs bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 rounded-full font-mono">Latest</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskIndicator level={entry.riskLevel} size="sm" />
                      <span className="text-slate-500 text-xs">{entry.duration}</span>
                    </div>
                  </div>

                  {/* Expand arrow */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    className={`text-slate-500 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-6 pb-5 border-t border-white/5">
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {[
                        { label: 'Speech', score: entry.speechScore, icon: '🎤' },
                        { label: 'Facial', score: entry.facialScore, icon: '📷' },
                        { label: 'Cognitive', score: entry.cognitiveScore, icon: '🧩' },
                      ].map((m, mi) => (
                        <div key={mi} className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-lg mb-1">{m.icon}</div>
                          <div className="font-mono font-600 text-accent">{m.score}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{m.label}</div>
                          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${m.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h3 className="font-display font-700 text-white text-lg mb-6">Overall Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Assessments', value: historyData.length.toString() },
              { label: 'Average Score', value: `${Math.round(historyData.reduce((a, h) => a + h.finalScore, 0) / historyData.length)}` },
              { label: 'Best Score', value: `${Math.max(...historyData.map(h => h.finalScore))}` },
              { label: 'Low Risk Sessions', value: `${historyData.filter(h => h.riskLevel === 'Low').length}` },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-800 text-3xl text-accent mb-1">{s.value}</div>
                <div className="text-slate-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/assessment"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg font-700 text-lg hover:bg-highlight transition-all duration-200 btn-press"
        >
          Start New Assessment
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

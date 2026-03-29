'use client';

import Link from 'next/link';
import { useAssessment } from '@/context/AssessmentContext';
import ModuleCard from '@/components/ModuleCard';

const modules = [
  {
    title: 'Speech Analysis',
    description: 'Describe your day for 30 seconds. Our AI analyzes your speech patterns, pauses, and fluency to detect early markers of cognitive change.',
    icon: '🎤',
    href: '/assessment/speech',
    key: 'speech' as const,
  },
  {
    title: 'Facial Analysis',
    description: 'Your camera captures facial micro-expressions and engagement patterns. AI models detect subtle behavioral changes correlated with cognitive health.',
    icon: '📷',
    href: '/assessment/facial',
    key: 'facial' as const,
  },
  {
    title: 'Cognitive Test',
    description: 'A standardized memory recall test. You\'ll be shown 5 words to memorize, then asked to recall them — a proven early indicator of cognitive function.',
    icon: '🧩',
    href: '/assessment/cognitive',
    key: 'cognitive' as const,
  },
];

export default function AssessmentPage() {
  const {
    speechScore, facialScore, cognitiveScore,
    speechCompleted, facialCompleted, cognitiveCompleted,
    allCompleted,
    resetAssessment,
  } = useAssessment();

  const completedCount = [speechCompleted, facialCompleted, cognitiveCompleted].filter(Boolean).length;
  const progressPct = Math.round((completedCount / 3) * 100);

  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg">
      <div className="orb orb-blue w-72 h-72 top-20 right-10 float" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Assessment Hub
          </div>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-white mb-3">
            Cognitive Assessment
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Complete all three modules to receive your comprehensive cognitive health report.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass-card rounded-2xl p-6 mb-8 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-400 mb-1">Overall Progress</div>
              <div className="font-display font-700 text-2xl text-white">
                {completedCount} <span className="text-slate-500 text-lg font-400">of 3 modules</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl font-600 text-accent">{progressPct}%</div>
              <div className="text-xs text-slate-500">Complete</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-highlight rounded-full transition-all duration-700 relative overflow-hidden"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
          {/* Module indicators */}
          <div className="flex gap-4 mt-4">
            {[
              { label: 'Speech', done: speechCompleted },
              { label: 'Facial', done: facialCompleted },
              { label: 'Cognitive', done: cognitiveCompleted },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${m.done ? 'bg-risk-low' : 'bg-white/20'}`} />
                <span className={m.done ? 'text-slate-300' : 'text-slate-500'}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {modules.map((mod, i) => (
            <ModuleCard
              key={mod.key}
              title={mod.title}
              description={mod.description}
              icon={mod.icon}
              href={mod.href}
              completed={
                mod.key === 'speech' ? speechCompleted :
                mod.key === 'facial' ? facialCompleted :
                cognitiveCompleted
              }
              score={
                mod.key === 'speech' ? speechScore :
                mod.key === 'facial' ? facialScore :
                cognitiveScore
              }
              delay={i * 100}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {allCompleted ? (
            <Link
              href="/result"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg font-700 text-lg hover:bg-highlight transition-all duration-200 btn-press glow-accent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Full Results
            </Link>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/10 text-slate-500 font-500 cursor-not-allowed">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Complete all tests to unlock results
            </div>
          )}
          {completedCount > 0 && (
            <button
              onClick={resetAssessment}
              className="px-6 py-4 rounded-2xl border border-risk-high/30 text-risk-high text-sm font-500 hover:bg-risk-high/10 transition-all duration-200"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Information note */}
        <div className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/10 flex gap-3">
          <div className="text-accent mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            This assessment is powered by simulated AI for demonstration. Complete all three modules to receive your cognitive health score and personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}

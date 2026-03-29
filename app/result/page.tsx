'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAssessment, RiskLevel } from '@/context/AssessmentContext';
import CircularScore from '@/components/CircularScore';
import ProgressBar from '@/components/ProgressBar';
import RiskIndicator from '@/components/RiskIndicator';

// Generate a dynamic AI insight based on scores
function generateInsight(speechScore: number, facialScore: number, cognitiveScore: number, riskLevel: RiskLevel): string {
  const insights: Record<string, string[]> = {
    Low: [
      `Your assessment reveals strong cognitive health indicators. Speech fluency, facial engagement, and memory recall all fall within optimal ranges. Continue your current lifestyle habits for sustained cognitive wellness.`,
      `Excellent cognitive profile detected. No significant markers of decline were found across all three modalities. Your memory recall and speech patterns indicate high neurological efficiency.`,
    ],
    Medium: [
      `Mild irregularities detected in ${speechScore < facialScore && speechScore < cognitiveScore ? 'speech fluency patterns' : cognitiveScore < 70 ? 'memory recall accuracy' : 'facial engagement metrics'}. Occasional word-finding pauses and slight memory gaps suggest early monitoring is advisable. A follow-up assessment in 4–6 weeks is recommended.`,
      `Moderate cognitive variance observed. Speech patterns show occasional hesitancy, and memory recall scored slightly below optimal thresholds. Lifestyle interventions such as brain training and improved sleep may help maintain cognitive health.`,
    ],
    High: [
      `Significant cognitive markers detected across multiple modalities. Frequent pauses in speech, reduced facial engagement, and below-average memory recall collectively indicate elevated risk. Consultation with a neurologist is strongly recommended.`,
      `Your results show notable deviations in speech fluency, memory recall, and facial behavioral patterns — all indicators requiring clinical follow-up. Early intervention can significantly improve long-term outcomes.`,
    ],
  };

  if (!riskLevel) return '';
  const pool = insights[riskLevel];
  return pool[Math.floor(Math.random() * pool.length)];
}

const scoreLabels: Record<string, { color: string; label: string }> = {
  Low: { color: '#22C55E', label: 'Healthy Range' },
  Medium: { color: '#EAB308', label: 'Borderline' },
  High: { color: '#EF4444', label: 'Elevated Risk' },
};

export default function ResultPage() {
  const router = useRouter();
  const { speechScore, facialScore, cognitiveScore, finalScore, riskLevel, allCompleted, resetAssessment } = useAssessment();
  const [insight, setInsight] = useState('');
  const [showScores, setShowScores] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (!allCompleted) {
      router.push('/assessment');
      return;
    }
    if (speechScore !== null && facialScore !== null && cognitiveScore !== null) {
      setInsight(generateInsight(speechScore, facialScore, cognitiveScore, riskLevel));
    }
    // Stagger reveal animations
    const t1 = setTimeout(() => setShowScores(true), 600);
    const t2 = setTimeout(() => setShowInsight(true), 1200);
    const t3 = setTimeout(() => setShowActions(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [allCompleted]);

  if (!allCompleted || finalScore === null) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-accent/30 border-t-accent animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading results...</p>
        </div>
      </div>
    );
  }

  const riskConfig = riskLevel ? scoreLabels[riskLevel] : { color: '#00B4D8', label: '' };
  const moduleScores = [
    { label: 'Speech Analysis', score: speechScore ?? 0, icon: '🎤', desc: 'Fluency, pauses & articulation' },
    { label: 'Facial Analysis', score: facialScore ?? 0, icon: '📷', desc: 'Engagement & micro-expressions' },
    { label: 'Cognitive Recall', score: cognitiveScore ?? 0, icon: '🧩', desc: 'Memory retention & recall' },
  ];

  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg">
      <div className="orb orb-blue w-96 h-96 top-0 right-0 float" />
      <div className="orb orb-indigo w-72 h-72 bottom-20 left-0 float" style={{ animationDelay: '3s' }} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="#00B4D8" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            Assessment Complete — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-white mb-3">
            Cognitive Health Report
          </h1>
          <p className="text-slate-400">AI-powered analysis across 3 assessment modules</p>
        </div>

        {/* Main score card */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-6 border border-white/5 relative overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-5 rounded-3xl"
            style={{ background: `radial-gradient(circle at 50% 50%, ${riskConfig.color}, transparent 70%)` }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Circular score */}
            <div className="flex-shrink-0">
              <CircularScore score={finalScore} riskLevel={riskLevel} size={220} />
            </div>

            {/* Score details */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <RiskIndicator level={riskLevel} size="lg" />
              </div>
              <h2 className="font-display font-800 text-3xl text-white mb-2">
                Cognitive Risk Score: <span style={{ color: riskConfig.color }}>{finalScore}%</span>
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Score reflects overall cognitive performance across speech, facial, and memory assessments.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                {moduleScores.map((m, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-lg mb-1">{m.icon}</div>
                    <div className="font-mono font-600 text-accent text-lg">{m.score}</div>
                    <div className="text-slate-500 text-xs mt-1">{m.label.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div
          className={`glass-card rounded-2xl p-8 mb-6 transition-all duration-700 ${
            showScores ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h3 className="font-display font-700 text-xl text-white mb-6">Score Breakdown</h3>
          <div className="space-y-6">
            {moduleScores.map((m, i) => {
              const level = m.score >= 76 ? 'Low' : m.score >= 60 ? 'Medium' : 'High';
              const barColor = level === 'Low' ? '#22C55E' : level === 'Medium' ? '#EAB308' : '#EF4444';
              return (
                <div key={i}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-white font-500 text-sm">{m.label}</span>
                          <span className="text-slate-500 text-xs ml-2">{m.desc}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RiskIndicator level={level as RiskLevel} size="sm" />
                          <span className="font-mono text-sm font-600" style={{ color: barColor }}>{m.score}/100</span>
                        </div>
                      </div>
                      <ProgressBar value={m.score} color={barColor} animated />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insight */}
        <div
          className={`glass-card rounded-2xl p-8 mb-6 border border-accent/10 transition-all duration-700 ${
            showInsight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="#00B4D8" strokeWidth="1.5"/>
                <path d="M12 16v-4M12 8h.01" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-display font-700 text-white text-lg">AI Clinical Insight</h3>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Generated
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">{insight}</p>
            </div>
          </div>
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Assessment Date', value: new Date().toLocaleDateString() },
            { label: 'Duration', value: '~5 minutes' },
            { label: 'Modules Completed', value: '3 / 3' },
            { label: 'Analysis Engine', value: 'CogniNet v2.1' },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-xl p-4 text-center">
              <div className="text-slate-500 text-xs mb-1">{item.label}</div>
              <div className="text-slate-200 text-sm font-500 font-mono">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${
            showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link
            href="/recommendations"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg font-700 text-lg hover:bg-highlight transition-all duration-200 btn-press glow-accent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Recommendations
          </Link>
          <button
            onClick={() => { resetAssessment(); router.push('/assessment'); }}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/10 text-slate-300 font-500 hover:border-accent/40 hover:text-white transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retake Assessment
          </button>
          <button className="sm:w-auto px-6 py-4 rounded-2xl border border-white/10 text-slate-300 font-500 hover:border-accent/40 hover:text-white transition-all duration-200 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export PDF
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-slate-600 text-xs mt-8 leading-relaxed max-w-2xl mx-auto">
          This report is generated by a simulated AI system for demonstration purposes only and should not be used as a medical diagnosis. Consult a qualified healthcare professional for clinical evaluation.
        </p>
      </div>
    </div>
  );
}

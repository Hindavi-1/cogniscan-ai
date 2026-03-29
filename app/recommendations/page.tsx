'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAssessment, RiskLevel } from '@/context/AssessmentContext';
import RiskIndicator from '@/components/RiskIndicator';

interface Recommendation {
  icon: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  action?: string;
}

const recommendations: Record<string, Recommendation[]> = {
  Low: [
    {
      icon: '🏃',
      title: 'Maintain Physical Activity',
      description: 'Continue regular aerobic exercise — 30 minutes per day significantly supports long-term neuroplasticity and memory consolidation.',
      priority: 'low',
      category: 'Lifestyle',
      action: 'Track Activity',
    },
    {
      icon: '🧩',
      title: 'Cognitive Enrichment',
      description: 'Engage in mentally stimulating activities — puzzles, learning a new skill, reading complex material — to build cognitive reserve.',
      priority: 'low',
      category: 'Brain Health',
      action: 'Explore Exercises',
    },
    {
      icon: '😴',
      title: 'Optimize Sleep Quality',
      description: 'Maintain consistent 7–9 hours of quality sleep. The brain consolidates memories and clears neurotoxic waste during deep sleep.',
      priority: 'low',
      category: 'Sleep',
      action: 'Sleep Tips',
    },
    {
      icon: '📅',
      title: 'Routine Monitoring',
      description: 'Reassess every 3–6 months. Tracking cognitive trends over time is the best way to catch gradual changes early.',
      priority: 'medium',
      category: 'Monitoring',
      action: 'Schedule',
    },
    {
      icon: '🥗',
      title: 'Brain-Healthy Diet',
      description: 'Mediterranean and MIND diets have strong evidence for reducing cognitive decline risk. Prioritize omega-3s, leafy greens, and berries.',
      priority: 'low',
      category: 'Nutrition',
    },
  ],
  Medium: [
    {
      icon: '🧠',
      title: 'Structured Brain Training',
      description: 'Start a daily cognitive training regimen. Evidence-based programs like dual n-back, processing speed, and memory exercises show measurable improvement.',
      priority: 'high',
      category: 'Brain Health',
      action: 'Start Training',
    },
    {
      icon: '😴',
      title: 'Improve Sleep Routine',
      description: 'Address sleep hygiene immediately. Poor sleep is strongly correlated with accelerated cognitive decline. Aim for consistent bedtimes and reduced screen exposure.',
      priority: 'high',
      category: 'Sleep',
      action: 'Sleep Protocol',
    },
    {
      icon: '📅',
      title: 'Monthly Monitoring',
      description: 'Increase assessment frequency to monthly. Your current results warrant closer tracking to identify trends and catch any further changes.',
      priority: 'medium',
      category: 'Monitoring',
      action: 'Set Reminder',
    },
    {
      icon: '🩺',
      title: 'Primary Care Visit',
      description: 'Schedule a check-in with your primary care physician. Mention your cognitive assessment results — they can rule out treatable underlying causes.',
      priority: 'high',
      category: 'Medical',
      action: 'Find Doctor',
    },
    {
      icon: '🤝',
      title: 'Social Engagement',
      description: 'Maintain active social connections. Social interaction is a powerful protective factor against cognitive decline and has effects comparable to cognitive training.',
      priority: 'medium',
      category: 'Lifestyle',
    },
    {
      icon: '🏃',
      title: 'Increase Physical Activity',
      description: 'Aim for 150 minutes of moderate aerobic exercise weekly. Increased blood flow to the brain has measurable positive effects on memory and processing speed.',
      priority: 'medium',
      category: 'Lifestyle',
      action: 'Activity Plan',
    },
  ],
  High: [
    {
      icon: '🚨',
      title: 'Consult a Neurologist',
      description: 'Your results indicate elevated risk markers across multiple modalities. Schedule an appointment with a neurologist as soon as possible for comprehensive clinical evaluation.',
      priority: 'urgent',
      category: 'Medical',
      action: 'Find Specialist',
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Notify a Caregiver or Family Member',
      description: 'Share your assessment results with a trusted family member or caregiver. Having support and oversight is critical during this monitoring period.',
      priority: 'urgent',
      category: 'Support',
      action: 'Share Report',
    },
    {
      icon: '📊',
      title: 'Continuous Tracking',
      description: 'Begin weekly assessments to monitor for further changes. Trend data is invaluable for your neurologist and can accelerate diagnosis.',
      priority: 'high',
      category: 'Monitoring',
      action: 'Start Weekly',
    },
    {
      icon: '💊',
      title: 'Medication Review',
      description: 'Ask your doctor to review current medications. Several common drugs have cognitive side effects — a simple medication adjustment can sometimes improve scores significantly.',
      priority: 'high',
      category: 'Medical',
    },
    {
      icon: '🧠',
      title: 'Intensive Brain Training',
      description: 'Begin daily structured cognitive exercises immediately. While not a replacement for medical care, evidence suggests training can slow progression.',
      priority: 'high',
      category: 'Brain Health',
      action: 'Start Now',
    },
    {
      icon: '🏥',
      title: 'Clinical Memory Assessment',
      description: 'Request a formal neuropsychological battery from your healthcare provider. Standard tests like MoCA and MMSE provide clinical-grade cognitive baselines.',
      priority: 'urgent',
      category: 'Medical',
      action: 'Learn More',
    },
  ],
};

const priorityConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  urgent: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Urgent' },
  high: { color: '#EAB308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', label: 'High Priority' },
  medium: { color: '#00B4D8', bg: 'rgba(0,180,216,0.1)', border: 'rgba(0,180,216,0.3)', label: 'Recommended' },
  low: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', label: 'Beneficial' },
};

export default function RecommendationsPage() {
  const { riskLevel, finalScore, allCompleted } = useAssessment();
  const [visible, setVisible] = useState<boolean[]>([]);
  const effectiveRisk: RiskLevel = riskLevel ?? 'Medium';
  const recs = recommendations[effectiveRisk] ?? recommendations.Medium;

  useEffect(() => {
    recs.forEach((_, i) => {
      setTimeout(() => {
        setVisible(prev => { const next = [...prev]; next[i] = true; return next; });
      }, 200 + i * 120);
    });
  }, [recs.length]);

  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg">
      <div className="orb orb-blue w-80 h-80 top-10 right-0 float" />
      <div className="orb orb-indigo w-64 h-64 bottom-10 left-0 float" style={{ animationDelay: '4s' }} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/result" className="text-slate-500 hover:text-accent transition-colors text-sm flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Results
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-accent text-sm font-mono">Recommendations</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-800 text-4xl text-white mb-2">Your Action Plan</h1>
              <p className="text-slate-400">Personalized recommendations based on your cognitive assessment results.</p>
            </div>
            <div className="flex items-center gap-3">
              <RiskIndicator level={effectiveRisk} size="md" />
              {finalScore !== null && (
                <div className="glass-card rounded-xl px-4 py-2 text-sm">
                  <span className="text-slate-400">Score: </span>
                  <span className="font-mono font-600 text-accent">{finalScore}/100</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary banner */}
        <div className="glass-card rounded-2xl p-6 mb-8 border border-accent/10">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {effectiveRisk === 'Low' ? '✅' : effectiveRisk === 'Medium' ? '⚠️' : '🚨'}
            </div>
            <div>
              <h2 className="font-display font-600 text-white text-lg mb-1">
                {effectiveRisk === 'Low' && 'Great news — your cognitive health looks strong.'}
                {effectiveRisk === 'Medium' && 'Mild indicators detected. Proactive steps are advised.'}
                {effectiveRisk === 'High' && 'Elevated risk detected. Immediate action is recommended.'}
              </h2>
              <p className="text-slate-400 text-sm">
                {recs.length} personalized recommendations generated for your {effectiveRisk.toLowerCase()} risk profile.
              </p>
            </div>
          </div>
        </div>

        {/* Recommendation cards */}
        <div className="space-y-4 mb-10">
          {recs.map((rec, i) => {
            const pConf = priorityConfig[rec.priority];
            return (
              <div
                key={i}
                className={`glass-card rounded-2xl p-6 hover-lift transition-all duration-500 ${
                  visible[i] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                }`}
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {rec.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-display font-700 text-white text-lg">{rec.title}</h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-500"
                        style={{ color: pConf.color, backgroundColor: pConf.bg, border: `1px solid ${pConf.border}` }}
                      >
                        {pConf.label}
                      </span>
                      <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{rec.description}</p>
                    {rec.action && (
                      <button
                        className="text-sm font-500 text-accent border border-accent/30 rounded-lg px-4 py-1.5 hover:bg-accent/10 transition-all duration-200"
                      >
                        {rec.action} →
                      </button>
                    )}
                  </div>

                  {/* Priority indicator */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-1"
                      style={{ backgroundColor: pConf.color, boxShadow: `0 0 8px ${pConf.color}80` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resources section */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h3 className="font-display font-700 text-white text-xl mb-6">Trusted Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Alzheimer\'s Association', url: 'alz.org', icon: '🏥', desc: 'Research & support' },
              { name: 'NIH Brain Health', url: 'nia.nih.gov', icon: '🔬', desc: 'Evidence-based guidance' },
              { name: 'BrainHQ Training', url: 'brainhq.com', icon: '🧩', desc: 'Cognitive exercises' },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-accent/30 transition-all duration-200 cursor-pointer group">
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="font-500 text-white text-sm group-hover:text-accent transition-colors">{r.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{r.desc}</div>
                <div className="text-accent text-xs font-mono mt-2">{r.url}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/assessment"
            onClick={() => {}}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-accent/30 text-accent font-600 hover:bg-accent/10 transition-all duration-200"
          >
            Schedule Next Assessment
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg font-700 hover:bg-highlight transition-all duration-200 btn-press"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const stats = [
  { value: '94%', label: 'Detection Accuracy' },
  { value: '3', label: 'Analysis Modules' },
  { value: '<5min', label: 'Assessment Time' },
  { value: 'Real-time', label: 'AI Processing' },
];

const features = [
  {
    icon: '🎤',
    title: 'Speech Analysis',
    desc: 'AI detects pauses, word finding difficulties, and speech rhythm anomalies using NLP models.',
  },
  {
    icon: '📷',
    title: 'Facial Behavior',
    desc: 'Computer vision analyzes micro-expressions, eye tracking, and facial engagement patterns.',
  },
  {
    icon: '🧩',
    title: 'Cognitive Tests',
    desc: 'Standardized memory and recall assessments calibrated to clinical benchmarks.',
  },
];

export default function HomePage() {
  const [glowPhase, setGlowPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setGlowPhase(p => (p + 1) % 3), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-blue w-96 h-96 top-20 -left-20 float" style={{ animationDelay: '0s' }} />
      <div className="orb orb-indigo w-80 h-80 top-40 right-0 float" style={{ animationDelay: '2s' }} />
      <div className="orb orb-blue w-64 h-64 bottom-40 right-20 float" style={{ animationDelay: '4s' }} />

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          AI-Powered Cognitive Health Platform
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="font-display font-800 text-5xl md:text-7xl text-white mb-6 leading-none tracking-tight">
          Cogni<span className="text-accent text-glow">scan</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-highlight to-accent text-4xl md:text-6xl">
            AI
          </span>
        </h1>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          Early detection of cognitive decline using multimodal AI analysis.
          <br />
          <span className="text-slate-400 text-base">Powered by speech, facial behavior, and cognitive assessment.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
          <Link
            href="/assessment"
            className="group relative px-8 py-4 rounded-2xl bg-accent text-bg font-600 text-lg hover:bg-highlight transition-all duration-300 btn-press glow-accent-intense"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Assessment
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 rounded-2xl border border-white/10 text-slate-300 font-500 text-lg hover:border-accent/40 hover:text-white transition-all duration-300"
          >
            Learn More
          </Link>
        </div>

        {/* Brain visualization placeholder */}
        <div className="relative mt-20 flex justify-center">
          <div className="relative w-80 h-80">
            {/* Outer rings */}
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border border-accent/10"
                style={{
                  transform: `scale(${1 + i * 0.15})`,
                  animation: `spin ${10 + i * 5}s linear infinite ${i % 2 === 0 ? 'reverse' : ''}`,
                }}
              />
            ))}
            {/* Center brain card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card rounded-3xl w-48 h-48 flex flex-col items-center justify-center glow-accent">
                <div className="text-6xl mb-2 float">🧠</div>
                <div className="text-accent text-xs font-mono text-center">
                  Neural Analysis<br />Active
                </div>
              </div>
            </div>
            {/* Orbiting dots */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-accent/60"
                style={{
                  top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                  left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse ${1.5 + i * 0.3}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-white/5 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display font-800 text-3xl text-accent mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display font-700 text-3xl md:text-4xl text-white mb-4">
            Multimodal AI Analysis
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Three independent assessment modules, combined into a single comprehensive cognitive health score.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-8 hover-lift border border-white/5 hover:border-accent/30 transition-all duration-300"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="font-display font-700 text-white text-xl mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              <div className="mt-5 h-px bg-gradient-to-r from-accent/30 to-transparent" />
              <div className="mt-4 flex items-center gap-2 text-xs text-accent font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                Module Active
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="glass-card rounded-3xl p-12 text-center glow-accent border-accent/20">
          <div className="text-4xl mb-4">🔬</div>
          <h2 className="font-display font-700 text-3xl text-white mb-4">
            Ready to begin your assessment?
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            A 5-minute assessment that could provide early insights into your cognitive health.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-bg font-600 text-lg hover:bg-highlight transition-all duration-300 btn-press"
          >
            Start Free Assessment
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

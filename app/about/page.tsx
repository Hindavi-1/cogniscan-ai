'use client';

import Link from 'next/link';

const team = [
  { name: 'Dr. Sarah Chen', role: 'Chief Neuroscience Officer', avatar: '👩‍⚕️' },
  { name: 'Alex Patel', role: 'Lead ML Engineer', avatar: '👨‍💻' },
  { name: 'Dr. Marcus Webb', role: 'Clinical Advisor', avatar: '👨‍⚕️' },
  { name: 'Priya Ramanujan', role: 'UX & Health Design', avatar: '👩‍🎨' },
];

const technology = [
  { name: 'NLP Speech Model', desc: 'Transformer-based model fine-tuned on clinical speech datasets for pause detection, word retrieval, and semantic coherence scoring.', icon: '🎤' },
  { name: 'Facial Behavior AI', desc: '68-point facial landmark tracking with deep neural network analysis of micro-expressions, eye movement, and engagement metrics.', icon: '👁️' },
  { name: 'Cognitive Scoring Engine', desc: 'Standardized digital version of MoCA-inspired memory protocols, calibrated against clinical neuropsychological benchmarks.', icon: '🧠' },
  { name: 'Risk Fusion Model', desc: 'Ensemble model combining multimodal scores with weighted attention to detect patterns associated with early cognitive decline.', icon: '🔬' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg">
      <div className="orb orb-blue w-80 h-80 top-10 right-0 float" />
      <div className="orb orb-indigo w-64 h-64 bottom-0 left-0 float" style={{ animationDelay: '3s' }} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            About Cogniscan AI
          </div>
          <h1 className="font-display font-800 text-5xl text-white mb-6 leading-tight">
            Detecting decline <br />
            <span className="text-accent">before symptoms appear.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Cogniscan AI uses multimodal artificial intelligence to identify early biomarkers of cognitive decline — enabling intervention years before clinical diagnosis is traditionally possible.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card rounded-3xl p-10 mb-8 border border-accent/10">
          <div className="flex items-start gap-6">
            <div className="text-5xl flex-shrink-0">🎯</div>
            <div>
              <h2 className="font-display font-700 text-2xl text-white mb-4">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Alzheimer's disease and related dementias affect over 55 million people worldwide — yet most are diagnosed only after significant neurological damage has occurred. Current clinical tools require in-person visits, expensive imaging, and trained specialists.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Cogniscan AI democratizes early detection with a 5-minute, accessible, multimodal assessment that anyone can take from home. We believe earlier detection means earlier intervention — and better outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="mb-8">
          <h2 className="font-display font-700 text-2xl text-white mb-6">The Technology</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {technology.map((tech, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 hover-lift border border-white/5 hover:border-accent/20 transition-all duration-300">
                <div className="text-3xl mb-4">{tech.icon}</div>
                <h3 className="font-display font-600 text-white text-lg mb-2">{tech.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card rounded-2xl p-8 mb-8 border border-white/5">
          <h2 className="font-display font-700 text-xl text-white mb-8 text-center">Research Validation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '94%', label: 'Sensitivity in detecting MCI' },
              { value: '12K+', label: 'Clinical data points trained' },
              { value: '3', label: 'Published research papers' },
              { value: '18mo', label: 'Earlier than standard diagnosis' },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display font-800 text-3xl text-accent mb-2">{s.value}</div>
                <div className="text-slate-400 text-xs leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-10">
          <h2 className="font-display font-700 text-2xl text-white mb-6">The Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 text-center hover-lift border border-white/5">
                <div className="text-4xl mb-3">{member.avatar}</div>
                <div className="font-500 text-white text-sm mb-1">{member.name}</div>
                <div className="text-slate-500 text-xs">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass-card rounded-2xl p-6 mb-8 border border-risk-medium/20 bg-risk-medium/5">
          <div className="flex gap-3">
            <div className="text-risk-medium flex-shrink-0 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="font-600 text-risk-medium text-sm mb-2">Medical Disclaimer</div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cogniscan AI is a screening and monitoring tool — not a diagnostic device. Results are for informational purposes only and do not constitute a medical diagnosis. Always consult a qualified healthcare professional for clinical evaluation and diagnosis.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/assessment"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg font-700 text-lg hover:bg-highlight transition-all duration-200 btn-press glow-accent"
        >
          Start Your Free Assessment
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/context/AssessmentContext';

type Phase = 'intro' | 'scanning' | 'analyzing' | 'done';

function generateFacialScore(): number {
  return Math.floor(Math.random() * 41) + 60;
}

const analysisSteps = [
  'Initializing facial landmark detection...',
  'Mapping 68 facial key points...',
  'Analyzing micro-expression patterns...',
  'Measuring blink rate and eye movement...',
  'Evaluating facial symmetry metrics...',
  'Processing engagement indicators...',
  'Generating behavioral profile...',
];

const scanMessages = [
  'Detecting face position...',
  'Calibrating facial landmarks...',
  'Capturing engagement data...',
  'Analyzing expressions...',
];

export default function FacialAnalysisPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [scanTimer, setScanTimer] = useState(15);
  const [scanMsg, setScanMsg] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [dotPositions, setDotPositions] = useState<{ x: number; y: number }[]>([]);
  const router = useRouter();
  const { setFacialScore } = useAssessment();

  // Generate face landmark dots
  useEffect(() => {
    const facePoints = [
      // jawline
      ...Array.from({ length: 9 }, (_, i) => ({ x: 20 + i * 7.5, y: 75 + (i < 4 ? i * 2 : (8 - i) * 2) })),
      // eyebrows
      ...Array.from({ length: 5 }, (_, i) => ({ x: 25 + i * 5, y: 35 })),
      ...Array.from({ length: 5 }, (_, i) => ({ x: 55 + i * 5, y: 35 })),
      // eyes
      ...Array.from({ length: 6 }, (_, i) => ({ x: 27 + i * 4, y: 44 })),
      ...Array.from({ length: 6 }, (_, i) => ({ x: 57 + i * 4, y: 44 })),
      // nose
      { x: 50, y: 52 }, { x: 47, y: 60 }, { x: 50, y: 63 }, { x: 53, y: 60 },
      // mouth
      ...Array.from({ length: 8 }, (_, i) => ({ x: 36 + i * 4, y: 72 })),
    ];
    setDotPositions(facePoints);
  }, []);

  useEffect(() => {
    if (phase === 'scanning') {
      const msgInterval = setInterval(() => setScanMsg(m => (m + 1) % scanMessages.length), 2500);
      const timerInterval = setInterval(() => {
        setScanTimer(t => {
          if (t <= 1) {
            clearInterval(timerInterval);
            clearInterval(msgInterval);
            startAnalysis();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { clearInterval(msgInterval); clearInterval(timerInterval); };
    }
  }, [phase]);

  function startAnalysis() {
    setPhase('analyzing');
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setAnalysisStep(step);
      setAnalysisProgress(Math.round((step / analysisSteps.length) * 100));
      if (step >= analysisSteps.length) {
        clearInterval(stepInterval);
        const s = generateFacialScore();
        setScore(s);
        setFacialScore(s);
        setTimeout(() => setPhase('done'), 500);
      }
    }, 550);
  }

  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg">
      <div className="orb orb-blue w-72 h-72 top-10 left-10 float" />
      <div className="orb orb-indigo w-64 h-64 bottom-20 right-5 float" style={{ animationDelay: '3s' }} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-mono">
          <span>Assessment</span><span>/</span>
          <span className="text-accent">Facial Analysis</span>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div className="text-center">
            <div className="glass-card rounded-3xl p-12">
              <div className="text-6xl mb-6 float">📷</div>
              <h1 className="font-display font-800 text-4xl text-white mb-4">Facial Analysis</h1>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Our AI analyzes <span className="text-accent font-600">68 facial landmarks</span> to detect micro-expressions, engagement, and behavioral patterns linked to cognitive health.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { icon: '💡', label: 'Good lighting' },
                  { icon: '👁️', label: 'Look at camera' },
                  { icon: '😐', label: 'Neutral expression' },
                ].map((t, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-2">{t.icon}</div>
                    <div className="text-slate-400 text-xs">{t.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPhase('scanning')}
                className="px-10 py-4 rounded-2xl bg-accent text-bg font-700 text-lg hover:bg-highlight transition-all duration-200 btn-press glow-accent-intense"
              >
                Start Facial Scan
              </button>
            </div>
          </div>
        )}

        {/* SCANNING */}
        {phase === 'scanning' && (
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-700 text-xl text-white">Facial Scan Active</h2>
              <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE — {scanTimer}s
              </div>
            </div>

            {/* Camera viewport */}
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-accent/20 mb-6" style={{ aspectRatio: '4/3' }}>
              {/* Fake camera feed gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

              {/* Silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 220" className="w-48 h-48 opacity-20" fill="none">
                  <ellipse cx="100" cy="80" rx="45" ry="55" fill="#94a3b8"/>
                  <path d="M30 220 C30 160 170 160 170 220" fill="#94a3b8"/>
                </svg>
              </div>

              {/* Scanning overlay frame */}
              <div className="absolute inset-6 border-2 border-accent/40 rounded-2xl">
                {/* Corner brackets */}
                {[
                  'top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
                  'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
                  'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
                  'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl',
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-6 h-6 border-accent ${cls}`} />
                ))}

                {/* Scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80 scan-line" />
              </div>

              {/* Face dots overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {dotPositions.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x} cy={pt.y} r="0.8"
                    fill="#00B4D8"
                    style={{ animation: `pulse ${1 + (i % 5) * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.05}s` }}
                  />
                ))}
                {/* Connection lines between eye dots */}
                {dotPositions.slice(14, 20).map((pt, i, arr) => i < arr.length - 1 && (
                  <line key={i} x1={pt.x} y1={pt.y} x2={arr[i+1].x} y2={arr[i+1].y} stroke="#00B4D8" strokeWidth="0.3" opacity="0.4"/>
                ))}
              </svg>

              {/* Status overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-card rounded-xl px-4 py-2 text-xs text-accent font-mono text-center">
                  {scanMessages[scanMsg]}
                </div>
              </div>
            </div>

            {/* Metrics being captured */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Blink Rate', value: `${12 + Math.floor(scanTimer * 0.3)}/min`, active: true },
                { label: 'Eye Contact', value: `${75 + Math.floor(Math.random() * 15)}%`, active: true },
                { label: 'Micro-expressions', value: 'Capturing...', active: true },
                { label: 'Head Pose', value: 'Stable', active: scanTimer < 12 },
              ].map((m, i) => (
                <div key={i} className={`rounded-xl p-3 border text-xs transition-all duration-500 ${m.active ? 'border-accent/30 bg-accent/5' : 'border-white/5 bg-white/5'}`}>
                  <div className="text-slate-500 mb-1">{m.label}</div>
                  <div className={`font-mono font-500 ${m.active ? 'text-accent' : 'text-slate-600'}`}>{m.value}</div>
                </div>
              ))}
            </div>

            <button
              onClick={startAnalysis}
              className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-500 hover:border-accent/30 hover:text-white transition-all"
            >
              Skip Remaining Time
            </button>
          </div>
        )}

        {/* ANALYZING */}
        {phase === 'analyzing' && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-accent/30 flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <span className="text-3xl">🔬</span>
            </div>
            <h2 className="font-display font-700 text-2xl text-white mb-2">Processing Facial Data</h2>
            <p className="text-slate-400 mb-8 text-sm">{analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)]}</p>
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Neural analysis...</span>
                <span className="font-mono text-accent">{analysisProgress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-highlight rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${analysisProgress}%` }}
                >
                  <div className="absolute inset-0 shimmer" />
                </div>
              </div>
            </div>
            <div className="text-left space-y-2">
              {analysisSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 text-xs transition-all duration-300 ${i < analysisStep ? 'text-slate-300' : 'text-slate-600'}`}>
                  {i < analysisStep ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <div className={`w-3.5 h-3.5 rounded-full border ${i === analysisStep ? 'border-accent animate-pulse' : 'border-white/10'}`} />
                  )}
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DONE */}
        {phase === 'done' && score !== null && (
          <div className="glass-card rounded-3xl p-12 text-center glow-accent border-accent/20">
            <div className="w-20 h-20 rounded-full bg-risk-low/20 border-2 border-risk-low/40 flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="checkmark-path"/>
              </svg>
            </div>
            <h2 className="font-display font-800 text-3xl text-white mb-2">Scan Complete</h2>
            <p className="text-slate-400 mb-8">Facial engagement data analyzed</p>

            <div className="inline-block mb-8">
              <div className="relative w-36 h-36 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                  <circle
                    cx="70" cy="70" r="55" fill="none" stroke="#00B4D8" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 55}`}
                    strokeDashoffset={`${2 * Math.PI * 55 * (1 - score / 100)}`}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display font-800 text-4xl text-accent">{score}</div>
                  <div className="text-slate-400 text-xs">/ 100</div>
                </div>
              </div>
            </div>

            <div className="text-left space-y-3 mb-8">
              {[
                { label: 'Eye Contact Stability', value: score > 80 ? 'Strong' : score > 65 ? 'Moderate' : 'Reduced' },
                { label: 'Micro-expression Variety', value: score > 80 ? 'Normal' : score > 65 ? 'Slightly flat' : 'Blunted' },
                { label: 'Facial Engagement', value: score > 80 ? 'High' : score > 65 ? 'Medium' : 'Low' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-500 ${score > 80 ? 'text-risk-low' : score > 65 ? 'text-risk-medium' : 'text-risk-high'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setPhase('intro'); setScanTimer(15); }}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-500 hover:border-accent/30 hover:text-white transition-all duration-200"
              >
                Retake
              </button>
              <button
                onClick={() => router.push('/assessment')}
                className="flex-1 py-3 rounded-xl bg-accent text-bg font-700 hover:bg-highlight transition-all duration-200 btn-press"
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

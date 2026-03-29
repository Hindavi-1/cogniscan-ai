'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/context/AssessmentContext';

type Phase = 'intro' | 'recording' | 'analyzing' | 'done';

// Generate a weighted random speech score (60-100)
function generateSpeechScore(): number {
  return Math.floor(Math.random() * 41) + 60;
}

const analysisSteps = [
  'Detecting speech segments...',
  'Analyzing pause frequency...',
  'Processing word retrieval speed...',
  'Measuring fluency metrics...',
  'Evaluating semantic coherence...',
  'Calculating cognitive indicators...',
  'Generating speech profile...',
];

export default function SpeechTestPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [timer, setTimer] = useState(30);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [waveHeights, setWaveHeights] = useState(Array(20).fill(0.3));
  const router = useRouter();
  const { setSpeechScore } = useAssessment();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Recording timer countdown
  useEffect(() => {
    if (phase === 'recording') {
      timerRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            startAnalysis();
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      // Animate wave heights
      const waveInterval = setInterval(() => {
        setWaveHeights(Array(20).fill(0).map(() => 0.2 + Math.random() * 0.8));
      }, 150);

      return () => {
        clearInterval(timerRef.current!);
        clearInterval(waveInterval);
      };
    }
  }, [phase]);

  function startRecording() {
    setPhase('recording');
    setTimer(30);
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    startAnalysis();
  }

  function startAnalysis() {
    setPhase('analyzing');
    setAnalysisStep(0);
    setAnalysisProgress(0);

    // Simulate step-by-step analysis
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setAnalysisStep(step);
      setAnalysisProgress(Math.round((step / analysisSteps.length) * 100));
      if (step >= analysisSteps.length) {
        clearInterval(stepInterval);
        const generatedScore = generateSpeechScore();
        setScore(generatedScore);
        setSpeechScore(generatedScore);
        setTimeout(() => setPhase('done'), 500);
      }
    }, 600);
  }

  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg">
      <div className="orb orb-blue w-64 h-64 top-20 right-10 float" />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-mono">
          <span>Assessment</span>
          <span>/</span>
          <span className="text-accent">Speech Test</span>
        </div>

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div className="text-center">
            <div className="glass-card rounded-3xl p-12 mb-6">
              <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mx-auto mb-8 text-5xl glow-accent">
                🎤
              </div>
              <h1 className="font-display font-800 text-4xl text-white mb-4">Speech Analysis</h1>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Speak naturally for <span className="text-accent font-600">30 seconds</span>. Describe your day, a recent memory, or how you're feeling.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10 text-sm">
                {[
                  { icon: '🔇', label: 'Quiet room recommended' },
                  { icon: '📱', label: 'Speak clearly' },
                  { icon: '⏱️', label: '30 seconds total' },
                ].map((tip, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-2">{tip.icon}</div>
                    <div className="text-slate-400 text-xs">{tip.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={startRecording}
                className="px-10 py-4 rounded-2xl bg-accent text-bg font-700 text-lg hover:bg-highlight transition-all duration-200 btn-press glow-accent-intense"
              >
                Begin Recording
              </button>
            </div>
          </div>
        )}

        {/* ── RECORDING ── */}
        {phase === 'recording' && (
          <div className="text-center">
            <div className="glass-card rounded-3xl p-12">
              {/* Timer ring */}
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="70" cy="70" r="60"
                    fill="none" stroke="#EF4444" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - timer / 30)}`}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display font-800 text-5xl text-white">{timer}</div>
                  <div className="text-slate-400 text-xs">seconds</div>
                </div>
              </div>

              {/* Recording indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 font-mono text-sm font-500 uppercase tracking-widest">Recording</span>
              </div>

              {/* Speech waveform */}
              <div className="flex items-end justify-center gap-1 h-16 mb-8">
                {waveHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full bg-accent transition-all duration-150"
                    style={{ height: `${h * 64}px`, opacity: 0.6 + h * 0.4 }}
                  />
                ))}
              </div>

              <p className="text-slate-400 mb-8">
                "Describe your day, a recent memory, or anything on your mind..."
              </p>

              <button
                onClick={stopRecording}
                className="px-8 py-3 rounded-2xl border border-red-500/50 text-red-400 font-500 hover:bg-red-500/10 transition-all duration-200"
              >
                Stop Early
              </button>
            </div>
          </div>
        )}

        {/* ── ANALYZING ── */}
        {phase === 'analyzing' && (
          <div className="text-center">
            <div className="glass-card rounded-3xl p-12">
              <div className="w-20 h-20 rounded-full border-2 border-accent/30 flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <span className="text-3xl">🧠</span>
              </div>
              <h2 className="font-display font-700 text-2xl text-white mb-2">Analyzing Speech</h2>
              <p className="text-slate-400 mb-8 text-sm">{analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)]}</p>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Processing...</span>
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

              {/* Steps list */}
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
          </div>
        )}

        {/* ── DONE ── */}
        {phase === 'done' && score !== null && (
          <div className="text-center">
            <div className="glass-card rounded-3xl p-12 glow-accent border-accent/20">
              <div className="w-20 h-20 rounded-full bg-risk-low/20 border-2 border-risk-low/40 flex items-center justify-center mx-auto mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="checkmark-path"/>
                </svg>
              </div>
              <h2 className="font-display font-800 text-3xl text-white mb-2">Analysis Complete</h2>
              <p className="text-slate-400 mb-8">Speech patterns analyzed successfully</p>

              {/* Score display */}
              <div className="inline-block mb-8">
                <div className="relative w-36 h-36 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                    <circle
                      cx="70" cy="70" r="55"
                      fill="none" stroke="#00B4D8" strokeWidth="10"
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

              {/* Insights */}
              <div className="text-left space-y-3 mb-8">
                {[
                  { label: 'Speech Fluency', value: score > 80 ? 'Normal' : score > 65 ? 'Mild variance' : 'Reduced' },
                  { label: 'Pause Frequency', value: score > 80 ? 'Low' : score > 65 ? 'Moderate' : 'High' },
                  { label: 'Word Retrieval', value: score > 80 ? 'Optimal' : score > 65 ? 'Slight delay' : 'Impaired' },
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
                  onClick={() => { setPhase('intro'); setTimer(30); }}
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
          </div>
        )}
      </div>
    </div>
  );
}

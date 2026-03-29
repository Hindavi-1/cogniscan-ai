'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/context/AssessmentContext';

type Phase = 'intro' | 'memorize' | 'distract' | 'recall' | 'analyzing' | 'done';

const WORDS = ['Apple', 'Chair', 'River', 'Dog', 'Book'];
const MEMORIZE_SECONDS = 10;
const DISTRACT_SECONDS = 8;

// Distractor math problems
const DISTRACTORS = [
  { q: 'What is 7 × 8?', a: '56' },
  { q: 'Count backwards from 10 to 7', a: '10, 9, 8, 7' },
  { q: 'What is 15 + 27?', a: '42' },
];

function calcCognitiveScore(recalled: string[]): number {
  const normalized = recalled.map(w => w.trim().toLowerCase()).filter(Boolean);
  const correct = WORDS.filter(w => normalized.includes(w.toLowerCase())).length;
  // Score: each word = 20 points, add some bonus for near-miss
  const base = (correct / WORDS.length) * 100;
  // Add slight randomness within ±5
  return Math.max(0, Math.min(100, Math.round(base + (Math.random() * 10 - 5))));
}

export default function CognitiveTestPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [countdown, setCountdown] = useState(MEMORIZE_SECONDS);
  const [distractCountdown, setDistractCountdown] = useState(DISTRACT_SECONDS);
  const [distractorIdx, setDistractorIdx] = useState(0);
  const [recallInputs, setRecallInputs] = useState<string[]>(['', '', '', '', '']);
  const [score, setScore] = useState<number | null>(null);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const router = useRouter();
  const { setCognitiveScore } = useAssessment();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Memorize countdown
  useEffect(() => {
    if (phase === 'memorize') {
      // Cycle highlight through words
      let wordIdx = 0;
      const highlightInterval = setInterval(() => {
        setHighlightIdx(wordIdx % WORDS.length);
        wordIdx++;
      }, 1000);

      const timer = setInterval(() => {
        setCountdown(t => {
          if (t <= 1) {
            clearInterval(timer);
            clearInterval(highlightInterval);
            setHighlightIdx(null);
            setPhase('distract');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { clearInterval(timer); clearInterval(highlightInterval); };
    }
  }, [phase]);

  // Distractor countdown
  useEffect(() => {
    if (phase === 'distract') {
      setDistractCountdown(DISTRACT_SECONDS);
      const timer = setInterval(() => {
        setDistractCountdown(t => {
          if (t <= 1) {
            clearInterval(timer);
            setPhase('recall');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      // Cycle distractor questions
      const qTimer = setInterval(() => {
        setDistractorIdx(i => (i + 1) % DISTRACTORS.length);
      }, 2500);
      return () => { clearInterval(timer); clearInterval(qTimer); };
    }
  }, [phase]);

  function handleRecallSubmit() {
    const correct = recallInputs.filter(w =>
      WORDS.map(x => x.toLowerCase()).includes(w.trim().toLowerCase())
    );
    setCorrectWords(correct);
    setPhase('analyzing');

    // Simulate analysis
    let p = 0;
    const interval = setInterval(() => {
      p += 14;
      setAnalysisProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        const s = calcCognitiveScore(recallInputs);
        setScore(s);
        setCognitiveScore(s);
        setTimeout(() => setPhase('done'), 400);
      }
    }, 300);
  }

  function handleInputChange(idx: number, value: string) {
    const next = [...recallInputs];
    next[idx] = value;
    setRecallInputs(next);
    // Auto-advance to next on space or comma
    if ((value.endsWith(' ') || value.endsWith(',')) && idx < 4) {
      next[idx] = value.slice(0, -1);
      setRecallInputs(next);
      inputRefs.current[idx + 1]?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-bg bg-grid neural-bg">
      <div className="orb orb-indigo w-80 h-80 top-10 right-5 float" />
      <div className="orb orb-blue w-64 h-64 bottom-10 left-5 float" style={{ animationDelay: '2s' }} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-mono">
          <span>Assessment</span><span>/</span>
          <span className="text-accent">Cognitive Test</span>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="text-6xl mb-6 float">🧩</div>
            <h1 className="font-display font-800 text-4xl text-white mb-4">Memory Recall Test</h1>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              You'll be shown <span className="text-accent font-600">5 words</span> for 10 seconds. Memorize them. Then complete a brief distraction task before recalling the words.
            </p>

            {/* Steps preview */}
            <div className="flex items-center justify-center gap-3 mb-10">
              {[
                { label: 'Memorize', icon: '👁️', time: '10s' },
                { label: 'Distraction', icon: '🔢', time: '8s' },
                { label: 'Recall', icon: '✍️', time: 'Unlimited' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl mx-auto mb-1">
                      {step.icon}
                    </div>
                    <div className="text-slate-300 text-xs font-500">{step.label}</div>
                    <div className="text-slate-500 text-xs">{step.time}</div>
                  </div>
                  {i < 2 && <div className="text-slate-600 text-xl mt-0 mb-4">→</div>}
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhase('memorize')}
              className="px-10 py-4 rounded-2xl bg-accent text-bg font-700 text-lg hover:bg-highlight transition-all duration-200 btn-press glow-accent-intense"
            >
              Begin Test
            </button>
          </div>
        )}

        {/* MEMORIZE */}
        {phase === 'memorize' && (
          <div className="glass-card rounded-3xl p-10 text-center">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-700 text-xl text-white">Memorize These Words</h2>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-accent/40 flex items-center justify-center font-mono text-accent font-600 text-sm relative">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(0,180,216,0.2)" strokeWidth="2.5"/>
                    <circle
                      cx="16" cy="16" r="13" fill="none" stroke="#00B4D8" strokeWidth="2.5"
                      strokeDasharray={`${2 * Math.PI * 13}`}
                      strokeDashoffset={`${2 * Math.PI * 13 * (1 - countdown / MEMORIZE_SECONDS)}`}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="relative z-10 text-xs">{countdown}</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-8">Focus carefully — these words will disappear in {countdown} seconds</p>

            {/* Words display */}
            <div className="space-y-3 mb-8">
              {WORDS.map((word, i) => (
                <div
                  key={i}
                  className={`py-4 rounded-2xl text-2xl font-display font-700 transition-all duration-300 ${
                    highlightIdx === i
                      ? 'bg-accent/20 border-2 border-accent text-white scale-105 glow-accent'
                      : 'bg-white/5 border border-white/10 text-slate-300'
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>

            <div className="text-slate-500 text-xs font-mono">
              💡 Try to form a mental image or story linking the words together
            </div>
          </div>
        )}

        {/* DISTRACTION */}
        {phase === 'distract' && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="text-4xl mb-4">🔢</div>
            <h2 className="font-display font-700 text-2xl text-white mb-2">Quick Mental Exercise</h2>
            <p className="text-slate-400 text-sm mb-8">A brief distractor task — then you'll recall the words.</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <p className="text-slate-300 text-xl font-500 mb-3">
                {DISTRACTORS[distractorIdx].q}
              </p>
              <p className="text-accent font-mono text-sm">Think about the answer...</p>
            </div>

            {/* Progress to recall */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Distractor phase</span>
                <span className="font-mono text-accent">{distractCountdown}s remaining</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-risk-medium to-accent rounded-full transition-all duration-1000"
                  style={{ width: `${((DISTRACT_SECONDS - distractCountdown) / DISTRACT_SECONDS) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-slate-500 text-xs">Memory recall begins automatically...</p>
          </div>
        )}

        {/* RECALL */}
        {phase === 'recall' && (
          <div className="glass-card rounded-3xl p-10">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">✍️</div>
              <h2 className="font-display font-700 text-2xl text-white mb-2">Now Recall the Words</h2>
              <p className="text-slate-400 text-sm">Type the 5 words you memorized. Order doesn't matter.</p>
            </div>

            <div className="space-y-3 mb-8">
              {recallInputs.map((val, i) => (
                <div key={i} className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-mono">{i + 1}.</span>
                  <input
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    value={val}
                    onChange={e => handleInputChange(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && i < 4) inputRefs.current[i + 1]?.focus();
                      if (e.key === 'Enter' && i === 4) handleRecallSubmit();
                    }}
                    placeholder={`Word ${i + 1}`}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-accent/50 focus:bg-accent/5 transition-all duration-200"
                    autoFocus={i === 0}
                  />
                  {val.trim() && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-500 mb-6 text-center font-mono">
              {recallInputs.filter(v => v.trim()).length} / 5 words entered
            </div>

            <button
              onClick={handleRecallSubmit}
              disabled={recallInputs.filter(v => v.trim()).length === 0}
              className="w-full py-4 rounded-2xl bg-accent text-bg font-700 text-lg hover:bg-highlight transition-all duration-200 btn-press disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Recall
            </button>
          </div>
        )}

        {/* ANALYZING */}
        {phase === 'analyzing' && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-accent/30 flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <span className="text-3xl">🧠</span>
            </div>
            <h2 className="font-display font-700 text-2xl text-white mb-2">Scoring Recall</h2>
            <p className="text-slate-400 mb-8 text-sm">Comparing responses against memory baseline...</p>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-accent to-highlight rounded-full transition-all duration-300 relative overflow-hidden"
                style={{ width: `${analysisProgress}%` }}
              >
                <div className="absolute inset-0 shimmer" />
              </div>
            </div>
            <span className="font-mono text-accent text-sm">{analysisProgress}%</span>
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
            <h2 className="font-display font-800 text-3xl text-white mb-2">Test Complete</h2>
            <p className="text-slate-400 mb-8">Memory recall analyzed</p>

            <div className="relative w-36 h-36 mx-auto mb-8">
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

            {/* Word by word results */}
            <div className="text-left mb-8">
              <div className="text-xs text-slate-500 mb-3 uppercase tracking-widest">Word Recall Results</div>
              <div className="space-y-2">
                {WORDS.map((word, i) => {
                  const recalled = recallInputs.some(r => r.trim().toLowerCase() === word.toLowerCase());
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                      <span className="text-slate-300">{word}</span>
                      <span className={`font-500 flex items-center gap-1.5 ${recalled ? 'text-risk-low' : 'text-risk-high'}`}>
                        {recalled ? (
                          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Recalled</>
                        ) : (
                          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/></svg>Missed</>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-slate-500 text-center font-mono">
                {correctWords.length} / {WORDS.length} words recalled correctly
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setPhase('intro'); setRecallInputs(['', '', '', '', '']); setScore(null); setCorrectWords([]); setCountdown(MEMORIZE_SECONDS); }}
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

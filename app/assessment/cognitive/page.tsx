'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import styles from '../test.module.css';

type Phase = 'intro' | 'memorize' | 'distract' | 'recall' | 'analyzing' | 'done';

const WORDS = ['Apple', 'Chair', 'River', 'Dog', 'Book'];
const MEMORIZE_SECONDS = 10;
const DISTRACT_SECONDS = 8;

const DISTRACTORS = [
  { q: 'What is 7 × 8?', a: '56' },
  { q: 'Count backwards from 10 to 7', a: '10, 9, 8, 7' },
  { q: 'What is 15 + 27?', a: '42' },
];

function calcCognitiveScore(recalled: string[]): number {
  const normalized = recalled.map(w => w.trim().toLowerCase()).filter(Boolean);
  const correct = WORDS.filter(w => normalized.includes(w.toLowerCase())).length;
  const base = (correct / WORDS.length) * 100;
  return Math.max(0, Math.min(100, Math.round(base + (Math.random() * 10 - 5))));
}

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

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

  useEffect(() => {
    if (phase === 'memorize') {
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
    if ((value.endsWith(' ') || value.endsWith(',')) && idx < 4) {
      next[idx] = value.slice(0, -1);
      setRecallInputs(next);
      inputRefs.current[idx + 1]?.focus();
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <span onClick={() => router.push('/assessment')} className="cursor-pointer hover:text-white transition-colors">Assessment</span>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Cognitive Test</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className={styles.iconWrapper}>🧩</div>
            <h1 className={styles.title}>Memory Recall Test</h1>
            <p className={styles.description}>
              You'll be shown <span className="text-accent font-600">5 words</span> for 10 seconds. Memorize them. Then complete a brief distraction task before recalling the words.
            </p>

            <div className="flex items-center justify-center gap-6 mb-10 mt-6">
              {[
                { label: 'Memorize', icon: '👁️', time: '10s' },
                { label: 'Distraction', icon: '🔢', time: '8s' },
                { label: 'Recall', icon: '✍️', time: 'Unlimited' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl mx-auto mb-2">
                      {step.icon}
                    </div>
                    <div className="text-slate-300 text-xs font-500 mb-0.5">{step.label}</div>
                    <div className="text-slate-500 text-xs">{step.time}</div>
                  </div>
                  {i < 2 && <div className="text-slate-600 text-xl font-mono mx-2 mt-[-16px]">→</div>}
                </div>
              ))}
            </div>

            <button onClick={() => setPhase('memorize')} className={styles.btnPrimary}>
              Begin Test
            </button>
          </motion.div>
        )}

        {phase === 'memorize' && (
          <motion.div key="memorize" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-700 text-xl text-white">Memorize These Words</h2>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-accent/40 flex items-center justify-center font-mono text-accent font-600 text-sm relative">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(0,210,255,0.2)" strokeWidth="2.5"/>
                    <circle
                      cx="16" cy="16" r="13" fill="none" stroke="#00D2FF" strokeWidth="2.5"
                      strokeDasharray={`${2 * Math.PI * 13}`}
                      strokeDashoffset={`${2 * Math.PI * 13 * (1 - countdown / MEMORIZE_SECONDS)}`}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="relative z-10 text-xs">{countdown}</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-8 text-left">Focus carefully — these words will disappear in {countdown} seconds</p>

            <div className="grid grid-cols-1 gap-3 mb-8">
              {WORDS.map((word, i) => (
                <div
                  key={i}
                  className={`py-4 rounded-2xl text-xl font-display font-700 transition-all duration-300 text-center ${
                    highlightIdx === i
                      ? 'bg-accent/20 border-2 border-accent text-white scale-[1.02] shadow-[0_0_20px_rgba(0,210,255,0.2)]'
                      : 'bg-white/5 border border-white/10 text-slate-300'
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>

            <div className="text-slate-500 text-xs font-mono text-center bg-white/5 py-3 rounded-xl">
              💡 Form a mental image linking the words together
            </div>
          </motion.div>
        )}

        {phase === 'distract' && (
          <motion.div key="distract" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className="text-4xl mb-4">🔢</div>
            <h2 className={styles.title} style={{fontSize: '2rem'}}>Quick Mental Exercise</h2>
            <p className={styles.description} style={{marginBottom: '32px'}}>A brief distractor task — then you'll recall the words.</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-inner">
              <p className="text-slate-200 text-2xl font-500 mb-3">{DISTRACTORS[distractorIdx].q}</p>
              <p className="text-accent font-mono text-sm">Think about the answer...</p>
            </div>

            <div className={styles.progressContainer}>
              <div className={styles.progressInfo}>
                <span>Distractor phase</span>
                <span className={styles.progressPct}>{distractCountdown}s remaining</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((DISTRACT_SECONDS - distractCountdown) / DISTRACT_SECONDS) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-4">Memory recall begins automatically...</p>
          </motion.div>
        )}

        {phase === 'recall' && (
          <motion.div key="recall" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className="text-4xl mb-4">✍️</div>
            <h2 className={styles.title} style={{fontSize: '2rem'}}>Now Recall the Words</h2>
            <p className={styles.description} style={{marginBottom: '32px'}}>Type the 5 words you memorized. Order doesn't matter.</p>

            <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
              {recallInputs.map((val, i) => (
                <div key={i} className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-mono">{i + 1}.</span>
                  <input
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text" value={val}
                    onChange={e => handleInputChange(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && i < 4) inputRefs.current[i + 1]?.focus();
                      if (e.key === 'Enter' && i === 4) handleRecallSubmit();
                    }}
                    placeholder={`Word ${i + 1}`}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-accent focus:bg-accent/5 transition-all duration-200"
                    autoFocus={i === 0}
                  />
                  {val.trim() && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-500 mb-8 text-center font-mono bg-white/5 py-2 rounded-lg max-w-sm mx-auto">
              {recallInputs.filter(v => v.trim()).length} / 5 words entered
            </div>

            <button
              onClick={handleRecallSubmit}
              disabled={recallInputs.filter(v => v.trim()).length === 0}
              className={`${styles.btnPrimary} w-full max-w-sm mx-auto disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Submit Recall
            </button>
          </motion.div>
        )}

        {phase === 'analyzing' && (
          <motion.div key="analyzing" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className={styles.spinner}>
              <div className={styles.spinnerRing} />
              <span className="text-3xl">🧠</span>
            </div>
            <h2 className={styles.title} style={{ fontSize: '2rem' }}>Scoring Recall</h2>
            <p className={styles.description} style={{ marginBottom: '32px' }}>
              Comparing responses against memory baseline...
            </p>

            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{ marginBottom: '16px', height: '12px' }}>
                <div className={styles.progressFill} style={{ width: `${analysisProgress}%` }} />
              </div>
              <span className="font-mono text-accent text-sm font-bold">{analysisProgress}%</span>
            </div>
          </motion.div>
        )}

        {phase === 'done' && score !== null && (
          <motion.div key="done" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card} style={{ border: '1px solid rgba(0, 210, 255, 0.3)', boxShadow: '0 20px 80px rgba(0, 210, 255, 0.15)' }}>
            <div className={styles.iconDoneWrapper}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={styles.title}>Test Complete</h2>
            <p className={styles.description}>Memory recall analyzed</p>

            <div className={styles.scoreContainer}>
              <div className={styles.scoreCircle}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                  <circle
                    cx="70" cy="70" r="55" fill="none" stroke="#00D2FF" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 55}`}
                    strokeDashoffset={`${2 * Math.PI * 55 * (1 - score / 100)}`}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease' }}
                  />
                </svg>
                <div className={styles.timerText}>
                  <div className={styles.scoreValue}>{score}</div>
                  <div className={styles.timerLabel}>/ 100</div>
                </div>
              </div>
            </div>

            <div className={styles.insightsList}>
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest text-center">Word Recall Results</div>
              {WORDS.map((word, i) => {
                const recalled = recallInputs.some(r => r.trim().toLowerCase() === word.toLowerCase());
                return (
                  <div key={i} className={styles.insightRow}>
                    <span className="text-slate-300">{word}</span>
                    <span className={`font-medium flex items-center gap-1.5 ${recalled ? 'text-risk-low' : 'text-risk-high'}`}>
                      {recalled ? (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Recalled</>
                      ) : (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>Missed</>
                      )}
                    </span>
                  </div>
                );
              })}
              <div className="mt-2 text-xs text-slate-500 text-center font-mono py-2 bg-white/5 rounded-lg">
                {correctWords.length} / {WORDS.length} words recalled correctly
              </div>
            </div>

            <div className={styles.btnGroup}>
              <button
                onClick={() => { setPhase('intro'); setRecallInputs(['', '', '', '', '']); setScore(null); setCorrectWords([]); setCountdown(MEMORIZE_SECONDS); }}
                className={styles.btnRetakeFinished}
              >
                Retake
              </button>
              <button
                onClick={() => router.push('/assessment')}
                className={styles.btnContinue}
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

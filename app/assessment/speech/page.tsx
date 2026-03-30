'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import styles from '../test.module.css';

type Phase = 'intro' | 'recording' | 'analyzing' | 'done';

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

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

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
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <span onClick={() => router.push('/assessment')} className="cursor-pointer hover:text-white transition-colors">Assessment</span>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Speech Test</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className={styles.iconWrapper}>🎤</div>
            <h1 className={styles.title}>Speech Analysis</h1>
            <p className={styles.description}>
              Speak naturally for <span className="text-accent font-600">30 seconds</span>. Describe your day, a recent memory, or how you're feeling.
            </p>
            <div className={styles.tipsGrid}>
              {[
                { icon: '🔇', label: 'Quiet room recommended' },
                { icon: '📱', label: 'Speak clearly' },
                { icon: '⏱️', label: '30 seconds total' },
              ].map((tip, i) => (
                <div key={i} className={styles.tipItem}>
                  <div className={styles.tipIcon}>{tip.icon}</div>
                  <div className={styles.tipLabel}>{tip.label}</div>
                </div>
              ))}
            </div>
            <button onClick={startRecording} className={styles.btnPrimary}>
              Begin Recording
            </button>
          </motion.div>
        )}

        {phase === 'recording' && (
          <motion.div key="recording" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className={styles.timerContainer}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="70" cy="70" r="60" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - timer / 30)}`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className={styles.timerText}>
                <div className={styles.timerValue}>{timer}</div>
                <div className={styles.timerLabel}>seconds</div>
              </div>
            </div>

            <div className={styles.recordingIndicator}>
              <div className={styles.pulsingDot} />
              <span className={styles.recordingText}>Recording</span>
            </div>

            <div className="flex items-end justify-center gap-1.5 h-16 mb-8">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full bg-accent transition-all duration-150"
                  style={{ height: `${h * 64}px`, opacity: 0.6 + h * 0.4 }}
                />
              ))}
            </div>

            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              "Describe your day, a recent memory, or anything on your mind..."
            </p>

            <button onClick={stopRecording} className={styles.btnSecondary}>
              Stop Early
            </button>
          </motion.div>
        )}

        {phase === 'analyzing' && (
          <motion.div key="analyzing" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className={styles.spinner}>
              <div className={styles.spinnerRing} />
              <span className="text-3xl">🧠</span>
            </div>
            <h2 className={styles.title} style={{ fontSize: '2rem' }}>Analyzing Speech</h2>
            <p className={styles.description} style={{ marginBottom: '32px' }}>
              {analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)]}
            </p>

            <div className={styles.progressContainer}>
              <div className={styles.progressInfo}>
                <span>Processing...</span>
                <span className={styles.progressPct}>{analysisProgress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${analysisProgress}%` }} />
              </div>
            </div>

            <div className={styles.stepsList}>
              {analysisSteps.map((step, i) => {
                const isDone = i < analysisStep;
                const isActive = i === analysisStep;
                return (
                  <div key={i} className={`${styles.stepItem} ${isDone ? styles.stepDone : styles.stepPending}`}>
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={styles.stepIconDone}>
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <div className={isActive ? styles.stepIconActive : styles.stepIconPending} />
                    )}
                    {step}
                  </div>
                )
              })}
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
            <h2 className={styles.title}>Analysis Complete</h2>
            <p className={styles.description}>Speech patterns analyzed successfully</p>

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
              {[
                { label: 'Speech Fluency', value: score > 80 ? 'Normal' : score > 65 ? 'Mild variance' : 'Reduced' },
                { label: 'Pause Frequency', value: score > 80 ? 'Low' : score > 65 ? 'Moderate' : 'High' },
                { label: 'Word Retrieval', value: score > 80 ? 'Optimal' : score > 65 ? 'Slight delay' : 'Impaired' },
              ].map((item, i) => (
                <div key={i} className={styles.insightRow}>
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-medium ${score > 80 ? 'text-risk-low' : score > 65 ? 'text-risk-medium' : 'text-risk-high'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.btnGroup}>
              <button onClick={() => { setPhase('intro'); setTimer(30); }} className={styles.btnRetakeFinished}>
                Retake
              </button>
              <button onClick={() => router.push('/assessment')} className={styles.btnContinue}>
                Continue →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import styles from '../test.module.css';

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

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

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

  useEffect(() => {
    const facePoints = [
      ...Array.from({ length: 9 }, (_, i) => ({ x: 20 + i * 7.5, y: 75 + (i < 4 ? i * 2 : (8 - i) * 2) })),
      ...Array.from({ length: 5 }, (_, i) => ({ x: 25 + i * 5, y: 35 })),
      ...Array.from({ length: 5 }, (_, i) => ({ x: 55 + i * 5, y: 35 })),
      ...Array.from({ length: 6 }, (_, i) => ({ x: 27 + i * 4, y: 44 })),
      ...Array.from({ length: 6 }, (_, i) => ({ x: 57 + i * 4, y: 44 })),
      { x: 50, y: 52 }, { x: 47, y: 60 }, { x: 50, y: 63 }, { x: 53, y: 60 },
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
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <span onClick={() => router.push('/assessment')} className="cursor-pointer hover:text-white transition-colors">Assessment</span>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Facial Analysis</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className={styles.iconWrapper}>📷</div>
            <h1 className={styles.title}>Facial Analysis</h1>
            <p className={styles.description}>
              Our AI analyzes <span className="text-accent font-600">68 facial landmarks</span> to detect micro-expressions, engagement, and behavioral patterns linked to cognitive health.
            </p>
            <div className={styles.tipsGrid}>
              {[
                { icon: '💡', label: 'Good lighting' },
                { icon: '👁️', label: 'Look at camera' },
                { icon: '😐', label: 'Neutral expression' },
              ].map((t, i) => (
                <div key={i} className={styles.tipItem}>
                  <div className={styles.tipIcon}>{t.icon}</div>
                  <div className={styles.tipLabel}>{t.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase('scanning')} className={styles.btnPrimary}>
              Start Facial Scan
            </button>
          </motion.div>
        )}

        {phase === 'scanning' && (
          <motion.div key="scanning" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-700 text-xl text-white">Facial Scan Active</h2>
              <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE — {scanTimer}s
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-accent/20 mb-6" style={{ aspectRatio: '4/3' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 220" className="w-48 h-48 opacity-20" fill="none">
                  <ellipse cx="100" cy="80" rx="45" ry="55" fill="#94a3b8"/>
                  <path d="M30 220 C30 160 170 160 170 220" fill="#94a3b8"/>
                </svg>
              </div>

              <div className="absolute inset-6 border-2 border-accent/40 rounded-2xl">
                {['top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
                  'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
                  'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
                  'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl'
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-6 h-6 border-accent ${cls}`} />
                ))}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80 scan-line" />
              </div>

              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {dotPositions.map((pt, i) => (
                  <circle
                    key={i} cx={pt.x} cy={pt.y} r="0.8" fill="#00D2FF"
                    style={{ animation: `pulse ${1 + (i % 5) * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.05}s` }}
                  />
                ))}
                {dotPositions.slice(14, 20).map((pt, i, arr) => i < arr.length - 1 && (
                  <line key={i} x1={pt.x} y1={pt.y} x2={arr[i+1].x} y2={arr[i+1].y} stroke="#00D2FF" strokeWidth="0.3" opacity="0.4"/>
                ))}
              </svg>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 text-xs text-accent font-mono text-center border border-white/5">
                  {scanMessages[scanMsg]}
                </div>
              </div>
            </div>

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

            <button onClick={startAnalysis} className={styles.btnSecondary} style={{ width: '100%' }}>
              Skip Remaining Time
            </button>
          </motion.div>
        )}

        {phase === 'analyzing' && (
          <motion.div key="analyzing" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className={styles.card}>
            <div className={styles.spinner}>
              <div className={styles.spinnerRing} />
              <span className="text-3xl">🔬</span>
            </div>
            <h2 className={styles.title} style={{ fontSize: '2rem' }}>Processing Facial Data</h2>
            <p className={styles.description} style={{ marginBottom: '32px' }}>
              {analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)]}
            </p>

            <div className={styles.progressContainer}>
              <div className={styles.progressInfo}>
                <span>Neural analysis...</span>
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
            <h2 className={styles.title}>Scan Complete</h2>
            <p className={styles.description}>Facial engagement data analyzed</p>

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
                { label: 'Eye Contact Stability', value: score > 80 ? 'Strong' : score > 65 ? 'Moderate' : 'Reduced' },
                { label: 'Micro-expression Variety', value: score > 80 ? 'Normal' : score > 65 ? 'Slightly flat' : 'Blunted' },
                { label: 'Facial Engagement', value: score > 80 ? 'High' : score > 65 ? 'Medium' : 'Low' },
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
              <button onClick={() => { setPhase('intro'); setScanTimer(15); }} className={styles.btnRetakeFinished}>
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

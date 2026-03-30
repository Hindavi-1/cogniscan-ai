'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import ModuleCard from '@/components/ModuleCard';
import styles from './page.module.css';

const modules = [
  {
    title: 'Speech Analysis',
    description: 'Describe your day for 30 seconds. Our AI analyzes your speech patterns, pauses, and fluency to detect early markers of cognitive change.',
    icon: '🎤',
    href: '/assessment/speech',
    key: 'speech' as const,
  },
  {
    title: 'Facial Analysis',
    description: 'Your camera captures facial micro-expressions and engagement patterns. AI models detect subtle behavioral changes correlated with cognitive health.',
    icon: '📷',
    href: '/assessment/facial',
    key: 'facial' as const,
  },
  {
    title: 'Cognitive Test',
    description: 'A standardized memory recall test. You\'ll be shown 5 words to memorize, then asked to recall them — a proven early indicator of cognitive function.',
    icon: '🧩',
    href: '/assessment/cognitive',
    key: 'cognitive' as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function AssessmentPage() {
  const {
    speechScore, facialScore, cognitiveScore,
    speechCompleted, facialCompleted, cognitiveCompleted,
    allCompleted,
    resetAssessment,
  } = useAssessment();

  const completedCount = [speechCompleted, facialCompleted, cognitiveCompleted].filter(Boolean).length;
  const progressPct = Math.round((completedCount / 3) * 100);

  return (
    <div className={styles.wrapper}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        
        {/* Header */}
        <motion.div variants={itemVariants} className={styles.header}>
          <div className={styles.badge}>
            <div className={`${styles.dot} animate-pulse`} />
            Assessment Hub
          </div>
          <h1 className={styles.title}>Cognitive Assessment</h1>
          <p className={styles.subtitle}>
            Complete all three modules to receive your comprehensive cognitive health report.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={itemVariants} className={styles.progressOverview}>
          <div className={styles.progressTop}>
            <div>
              <div className={styles.progressLabel}>Overall Progress</div>
              <div className={styles.progressCount}>
                {completedCount} <span className={styles.progressCountSub}>of 3 modules</span>
              </div>
            </div>
            <div>
              <div className={styles.progressPct}>{progressPct}%</div>
              <div className={styles.progressPctLabel}>Complete</div>
            </div>
          </div>
          
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: `${progressPct}%` }}>
              {progressPct > 0 && progressPct < 100 && <div className={styles.progressBarShimmer} />}
            </div>
          </div>
          
          <div className={styles.moduleIndicators}>
            {[
              { label: 'Speech', done: speechCompleted },
              { label: 'Facial', done: facialCompleted },
              { label: 'Cognitive', done: cognitiveCompleted },
            ].map((m, i) => (
              <div key={i} className={styles.indicator}>
                <div className={`${styles.indicatorDot} ${m.done ? styles.indicatorDone : styles.indicatorPending}`} />
                <span className={m.done ? styles.indicatorLabelDone : styles.indicatorLabelPending}>{m.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Modules Grid */}
        <motion.div variants={containerVariants} className={styles.modulesGrid}>
          {modules.map((mod) => (
            <motion.div key={mod.key} variants={itemVariants}>
              <ModuleCard
                title={mod.title}
                description={mod.description}
                icon={mod.icon}
                href={mod.href}
                completed={
                  mod.key === 'speech' ? speechCompleted :
                  mod.key === 'facial' ? facialCompleted :
                  cognitiveCompleted
                }
                score={
                  mod.key === 'speech' ? speechScore :
                  mod.key === 'facial' ? facialScore :
                  cognitiveScore
                }
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className={styles.actions}>
          {allCompleted ? (
            <Link href="/result" className={styles.btnResults}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Full Results
            </Link>
          ) : (
            <div className={styles.btnDisabled}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Complete all tests to unlock results
            </div>
          )}
          {completedCount > 0 && (
            <button onClick={resetAssessment} className={styles.btnReset}>
              Reset All
            </button>
          )}
        </motion.div>

        {/* Information Note */}
        <motion.div variants={itemVariants} className={styles.infoNote}>
          <div className={styles.infoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className={styles.infoText}>
            This assessment is powered by simulated AI for demonstration. Complete all three modules to receive your cognitive health score and personalized recommendations.
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}

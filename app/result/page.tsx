'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAssessment, RiskLevel } from '@/context/AssessmentContext';
import CircularScore from '@/components/CircularScore';
import ProgressBar from '@/components/ProgressBar';
import RiskIndicator from '@/components/RiskIndicator';
import styles from './page.module.css';

function generateInsight(speechScore: number, facialScore: number, cognitiveScore: number, riskLevel: RiskLevel): string {
  const insights: Record<string, string[]> = {
    Low: [
      `Your assessment reveals strong cognitive health indicators. Speech fluency, facial engagement, and memory recall all fall within optimal ranges. Continue your current lifestyle habits for sustained cognitive wellness.`,
      `Excellent cognitive profile detected. No significant markers of decline were found across all three modalities. Your memory recall and speech patterns indicate high neurological efficiency.`,
    ],
    Medium: [
      `Mild irregularities detected in ${speechScore < facialScore && speechScore < cognitiveScore ? 'speech fluency patterns' : cognitiveScore < 70 ? 'memory recall accuracy' : 'facial engagement metrics'}. Occasional word-finding pauses and slight memory gaps suggest early monitoring is advisable. A follow-up assessment in 4–6 weeks is recommended.`,
      `Moderate cognitive variance observed. Speech patterns show occasional hesitancy, and memory recall scored slightly below optimal thresholds. Lifestyle interventions such as brain training and improved sleep may help maintain cognitive health.`,
    ],
    High: [
      `Significant cognitive markers detected across multiple modalities. Frequent pauses in speech, reduced facial engagement, and below-average memory recall collectively indicate elevated risk. Consultation with a neurologist is strongly recommended.`,
      `Your results show notable deviations in speech fluency, memory recall, and facial behavioral patterns — all indicators requiring clinical follow-up. Early intervention can significantly improve long-term outcomes.`,
    ],
  };

  if (!riskLevel) return '';
  const pool = insights[riskLevel];
  return pool[Math.floor(Math.random() * pool.length)];
}

const scoreLabels: Record<string, { color: string; label: string }> = {
  Low: { color: '#22C55E', label: 'Healthy Range' },
  Medium: { color: '#EAB308', label: 'Borderline' },
  High: { color: '#EF4444', label: 'Elevated Risk' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function ResultPage() {
  const router = useRouter();
  const { speechScore, facialScore, cognitiveScore, finalScore, riskLevel, allCompleted, resetAssessment } = useAssessment();
  const [insight, setInsight] = useState('');

  useEffect(() => {
    if (!allCompleted) {
      router.push('/assessment');
      return;
    }
    if (speechScore !== null && facialScore !== null && cognitiveScore !== null) {
      setInsight(generateInsight(speechScore, facialScore, cognitiveScore, riskLevel));
    }
  }, [allCompleted, router, speechScore, facialScore, cognitiveScore, riskLevel]);

  if (!allCompleted || finalScore === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-accent/30 border-t-accent animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading results...</p>
        </div>
      </div>
    );
  }

  const riskConfig = riskLevel ? scoreLabels[riskLevel] : { color: '#00D2FF', label: '' };
  const moduleScores = [
    { label: 'Speech Analysis', score: speechScore ?? 0, icon: '🎤', desc: 'Fluency, pauses & articulation' },
    { label: 'Facial Analysis', score: facialScore ?? 0, icon: '📷', desc: 'Engagement & micro-expressions' },
    { label: 'Cognitive Recall', score: cognitiveScore ?? 0, icon: '🧩', desc: 'Memory retention & recall' },
  ];

  return (
    <div className={styles.wrapper}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        
        {/* Header */}
        <motion.div variants={childVariants} className={styles.header}>
          <div className={styles.badge}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            Assessment Complete — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className={styles.title}>Cognitive Health Report</h1>
          <p className={styles.subtitle}>AI-powered analysis across 3 assessment modules</p>
        </motion.div>

        {/* Main score card */}
        <motion.div variants={childVariants} className={styles.mainCard}>
          <div
            className={styles.glowBg}
            style={{ background: `radial-gradient(circle at 50% 50%, ${riskConfig.color}, transparent 70%)` }}
          />

          <div style={{ flexShrink: 0 }}>
            <CircularScore score={finalScore} riskLevel={riskLevel} size={220} />
          </div>

          <div className={styles.scoreInfo}>
            <div style={{ marginBottom: '16px' }}>
              <RiskIndicator level={riskLevel} size="lg" />
            </div>
            <h2 className={styles.scoreTitle}>
              Cognitive Risk Score: <span style={{ color: riskConfig.color }}>{finalScore}%</span>
            </h2>
            <p className={styles.scoreDesc}>
              Score reflects overall cognitive performance across speech, facial, and memory assessments.
            </p>

            <div className={styles.quickStats}>
              {moduleScores.map((m, i) => (
                <div key={i} className={styles.statBox}>
                  <div className={styles.statIcon}>{m.icon}</div>
                  <div className={styles.statScore} style={{ color: m.score >= 76 ? '#22C55E' : m.score >= 60 ? '#EAB308' : '#EF4444' }}>
                    {m.score}
                  </div>
                  <div className={styles.statLabel}>{m.label.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Score breakdown */}
        <motion.div variants={childVariants} className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Score Breakdown</h3>
          <div className={styles.breakdownList}>
            {moduleScores.map((m, i) => {
              const level = m.score >= 76 ? 'Low' : m.score >= 60 ? 'Medium' : 'High';
              const barColor = level === 'Low' ? '#22C55E' : level === 'Medium' ? '#EAB308' : '#EF4444';
              return (
                <div key={i} className={styles.breakdownRow}>
                  <span className={styles.breakdownIcon}>{m.icon}</span>
                  <div className={styles.breakdownContent}>
                    <div className={styles.breakdownHeader}>
                      <div>
                        <span className={styles.breakdownLabel}>{m.label}</span>
                        <span className={styles.breakdownDesc}>{m.desc}</span>
                      </div>
                      <div className={styles.breakdownScore}>
                        <RiskIndicator level={level as RiskLevel} size="sm" showLabel={false} />
                        <span className={styles.breakdownScoreNum} style={{ color: barColor }}>{m.score}/100</span>
                      </div>
                    </div>
                    <ProgressBar value={m.score} color={barColor} animated />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div variants={childVariants} className={styles.sectionCard} style={{ borderColor: 'rgba(0, 210, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div className={styles.insightIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className={styles.insightHeader}>
                <h3 className={styles.insightTitle}>AI Clinical Insight</h3>
                <div className={styles.insightBadge}>
                  <div className={styles.insightDot} />
                  Generated
                </div>
              </div>
              <p className={styles.insightText}>{insight}</p>
            </div>
          </div>
        </motion.div>

        {/* Metadata row */}
        <motion.div variants={childVariants} className={styles.metaGrid}>
          {[
            { label: 'Assessment Date', value: new Date().toLocaleDateString() },
            { label: 'Duration', value: '~5 minutes' },
            { label: 'Modules Completed', value: '3 / 3' },
            { label: 'Analysis Engine', value: 'CogniNet v2.1' },
          ].map((item, i) => (
            <div key={i} className={styles.metaBox}>
              <div className={styles.metaLabel}>{item.label}</div>
              <div className={styles.metaValue}>{item.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div variants={childVariants} className={styles.actions}>
          <Link href="/recommendations" className={styles.btnPrimary}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Recommendations
          </Link>
          <button
            onClick={() => { resetAssessment(); router.push('/assessment'); }}
            className={styles.btnSecondary}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retake Assessment
          </button>
          <button className={styles.btnOutline}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export PDF
          </button>
        </motion.div>

        <motion.p variants={childVariants} className={styles.disclaimer}>
          This report is generated by a simulated AI system for demonstration purposes only and should not be used as a medical diagnosis. Consult a qualified healthcare professional for clinical evaluation.
        </motion.p>
      </motion.div>
    </div>
  );
}

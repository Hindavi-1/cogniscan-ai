'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAssessment, RiskLevel } from '@/context/AssessmentContext';
import RiskIndicator from '@/components/RiskIndicator';
import styles from './page.module.css';

interface Recommendation {
  icon: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  action?: string;
}

const recommendations: Record<string, Recommendation[]> = {
  Low: [
    {
      icon: '🏃',
      title: 'Maintain Physical Activity',
      description: 'Continue regular aerobic exercise — 30 minutes per day significantly supports long-term neuroplasticity and memory consolidation.',
      priority: 'low',
      category: 'Lifestyle',
      action: 'Track Activity',
    },
    {
      icon: '🧩',
      title: 'Cognitive Enrichment',
      description: 'Engage in mentally stimulating activities — puzzles, learning a new skill, reading complex material — to build cognitive reserve.',
      priority: 'low',
      category: 'Brain Health',
      action: 'Explore Exercises',
    },
    {
      icon: '😴',
      title: 'Optimize Sleep Quality',
      description: 'Maintain consistent 7–9 hours of quality sleep. The brain consolidates memories and clears neurotoxic waste during deep sleep.',
      priority: 'low',
      category: 'Sleep',
      action: 'Sleep Tips',
    },
    {
      icon: '📅',
      title: 'Routine Monitoring',
      description: 'Reassess every 3–6 months. Tracking cognitive trends over time is the best way to catch gradual changes early.',
      priority: 'medium',
      category: 'Monitoring',
      action: 'Schedule',
    },
    {
      icon: '🥗',
      title: 'Brain-Healthy Diet',
      description: 'Mediterranean and MIND diets have strong evidence for reducing cognitive decline risk. Prioritize omega-3s, leafy greens, and berries.',
      priority: 'low',
      category: 'Nutrition',
    },
  ],
  Medium: [
    {
      icon: '🧠',
      title: 'Structured Brain Training',
      description: 'Start a daily cognitive training regimen. Evidence-based programs like dual n-back, processing speed, and memory exercises show measurable improvement.',
      priority: 'high',
      category: 'Brain Health',
      action: 'Start Training',
    },
    {
      icon: '😴',
      title: 'Improve Sleep Routine',
      description: 'Address sleep hygiene immediately. Poor sleep is strongly correlated with accelerated cognitive decline. Aim for consistent bedtimes and reduced screen exposure.',
      priority: 'high',
      category: 'Sleep',
      action: 'Sleep Protocol',
    },
    {
      icon: '📅',
      title: 'Monthly Monitoring',
      description: 'Increase assessment frequency to monthly. Your current results warrant closer tracking to identify trends and catch any further changes.',
      priority: 'medium',
      category: 'Monitoring',
      action: 'Set Reminder',
    },
    {
      icon: '🩺',
      title: 'Primary Care Visit',
      description: 'Schedule a check-in with your primary care physician. Mention your cognitive assessment results — they can rule out treatable underlying causes.',
      priority: 'high',
      category: 'Medical',
      action: 'Find Doctor',
    },
    {
      icon: '🤝',
      title: 'Social Engagement',
      description: 'Maintain active social connections. Social interaction is a powerful protective factor against cognitive decline and has effects comparable to cognitive training.',
      priority: 'medium',
      category: 'Lifestyle',
    },
    {
      icon: '🏃',
      title: 'Increase Physical Activity',
      description: 'Aim for 150 minutes of moderate aerobic exercise weekly. Increased blood flow to the brain has measurable positive effects on memory and processing speed.',
      priority: 'medium',
      category: 'Lifestyle',
      action: 'Activity Plan',
    },
  ],
  High: [
    {
      icon: '🚨',
      title: 'Consult a Neurologist',
      description: 'Your results indicate elevated risk markers across multiple modalities. Schedule an appointment with a neurologist as soon as possible for comprehensive clinical evaluation.',
      priority: 'urgent',
      category: 'Medical',
      action: 'Find Specialist',
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Notify a Caregiver or Family Member',
      description: 'Share your assessment results with a trusted family member or caregiver. Having support and oversight is critical during this monitoring period.',
      priority: 'urgent',
      category: 'Support',
      action: 'Share Report',
    },
    {
      icon: '📊',
      title: 'Continuous Tracking',
      description: 'Begin weekly assessments to monitor for further changes. Trend data is invaluable for your neurologist and can accelerate diagnosis.',
      priority: 'high',
      category: 'Monitoring',
      action: 'Start Weekly',
    },
    {
      icon: '💊',
      title: 'Medication Review',
      description: 'Ask your doctor to review current medications. Several common drugs have cognitive side effects — a simple medication adjustment can sometimes improve scores significantly.',
      priority: 'high',
      category: 'Medical',
    },
    {
      icon: '🧠',
      title: 'Intensive Brain Training',
      description: 'Begin daily structured cognitive exercises immediately. While not a replacement for medical care, evidence suggests training can slow progression.',
      priority: 'high',
      category: 'Brain Health',
      action: 'Start Now',
    },
    {
      icon: '🏥',
      title: 'Clinical Memory Assessment',
      description: 'Request a formal neuropsychological battery from your healthcare provider. Standard tests like MoCA and MMSE provide clinical-grade cognitive baselines.',
      priority: 'urgent',
      category: 'Medical',
      action: 'Learn More',
    },
  ],
};

const priorityConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  urgent: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Urgent' },
  high: { color: '#EAB308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', label: 'High Priority' },
  medium: { color: '#00D2FF', bg: 'rgba(0,210,255,0.1)', border: 'rgba(0,210,255,0.3)', label: 'Recommended' },
  low: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', label: 'Beneficial' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function RecommendationsPage() {
  const { riskLevel, finalScore } = useAssessment();
  const effectiveRisk: RiskLevel = riskLevel ?? 'Medium';
  const recs = recommendations[effectiveRisk] ?? recommendations.Medium;

  return (
    <div className={styles.wrapper}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header */}
        <motion.div variants={itemVariants} className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/result" className={styles.breadcrumbLink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Results
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Recommendations</span>
          </div>

          <div className={styles.headerTitleRow}>
            <div>
              <h1 className={styles.title}>Your Action Plan</h1>
              <p className={styles.subtitle}>Personalized recommendations based on your cognitive assessment results.</p>
            </div>
            <div className={styles.headerActions}>
              <RiskIndicator level={effectiveRisk} size="md" />
              {finalScore !== null && (
                <div className={styles.scoreBadge}>
                  <span className={styles.scoreLabel}>Score: </span>
                  <span className={styles.scoreValue}>{finalScore}/100</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Summary banner */}
        <motion.div variants={itemVariants} className={styles.summaryBanner}>
          <div className={styles.summaryIcon}>
            {effectiveRisk === 'Low' ? '✅' : effectiveRisk === 'Medium' ? '⚠️' : '🚨'}
          </div>
          <div>
            <h2 className={styles.summaryTitle}>
              {effectiveRisk === 'Low' && 'Great news — your cognitive health looks strong.'}
              {effectiveRisk === 'Medium' && 'Mild indicators detected. Proactive steps are advised.'}
              {effectiveRisk === 'High' && 'Elevated risk detected. Immediate action is recommended.'}
            </h2>
            <p className={styles.summaryDesc}>
              {recs.length} personalized recommendations generated for your {effectiveRisk.toLowerCase()} risk profile.
            </p>
          </div>
        </motion.div>

        {/* Recommendation cards */}
        <motion.div variants={containerVariants} className={styles.cardsContainer}>
          {recs.map((rec, i) => {
            const pConf = priorityConfig[rec.priority];
            return (
              <motion.div key={i} variants={itemVariants} className={styles.card}>
                <div className={styles.cardIcon}>{rec.icon}</div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{rec.title}</h3>
                    <span
                      className={styles.priorityBadge}
                      style={{ color: pConf.color, backgroundColor: pConf.bg, borderColor: pConf.border }}
                    >
                      {pConf.label}
                    </span>
                    <span className={styles.categoryBadge}>{rec.category}</span>
                  </div>
                  <p className={styles.cardDesc}>{rec.description}</p>
                  {rec.action && (
                    <button className={styles.cardAction}>
                      {rec.action}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                <div className={styles.priorityIndicator}>
                  <div
                    className={styles.priorityDot}
                    style={{ backgroundColor: pConf.color, boxShadow: `0 0 12px ${pConf.color}80` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Resources section */}
        <motion.div variants={itemVariants} className={styles.resourcesSection}>
          <h3 className={styles.resourcesTitle}>Trusted Resources</h3>
          <div className={styles.resourcesGrid}>
            {[
              { name: 'Alzheimer\'s Association', url: 'alz.org', icon: '🏥', desc: 'Research & support' },
              { name: 'NIH Brain Health', url: 'nia.nih.gov', icon: '🔬', desc: 'Evidence-based guidance' },
              { name: 'BrainHQ Training', url: 'brainhq.com', icon: '🧩', desc: 'Cognitive exercises' },
            ].map((r, i) => (
              <a key={i} href={`https://${r.url}`} target="_blank" rel="noopener noreferrer" className={styles.resourceCard}>
                <div className={styles.resourceIcon}>{r.icon}</div>
                <div className={styles.resourceName}>{r.name}</div>
                <div className={styles.resourceDesc}>{r.desc}</div>
                <div className={styles.resourceUrl}>{r.url}</div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className={styles.ctaContainer}>
          <Link href="/assessment" className={styles.btnSchedule}>
            Schedule Next Assessment
          </Link>
          <Link href="/" className={styles.btnHome}>
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

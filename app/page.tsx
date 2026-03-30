'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const stats = [
  { value: '94%', label: 'Detection Accuracy' },
  { value: '3', label: 'Analysis Modules' },
  { value: '<5min', label: 'Assessment Time' },
  { value: 'Real-time', label: 'AI Processing' },
];

const features = [
  {
    icon: '🎤',
    title: 'Speech Analysis',
    desc: 'AI detects pauses, word finding difficulties, and speech rhythm anomalies using NLP models.',
  },
  {
    icon: '📷',
    title: 'Facial Behavior',
    desc: 'Computer vision analyzes micro-expressions, eye tracking, and facial engagement patterns.',
  },
  {
    icon: '🧩',
    title: 'Cognitive Tests',
    desc: 'Standardized memory and recall assessments calibrated to clinical benchmarks.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function HomePage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Orbs */}
      <div className={`${styles.orb} ${styles.orbBlue}`} style={{ width: 400, height: 400, top: 80, left: -60, animationDelay: '0s' }} />
      <div className={`${styles.orb} ${styles.orbIndigo}`} style={{ width: 320, height: 320, top: 160, right: -40, animationDelay: '2s' }} />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          {/* Badge */}
          <motion.div variants={itemVariants} className={styles.badge}>
            <div className={`${styles.dot} animate-pulse`} />
            AI-Powered Cognitive Health Platform
            <div className={`${styles.dot} animate-pulse`} />
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className={styles.title}>
            Cogniscan <span className={styles.titleHighlight}>AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className={styles.subtitle}>
            Early detection of cognitive decline using multimodal AI analysis.
            <span className={styles.subtitleSub}>Powered by speech, facial behavior, and cognitive assessment.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className={styles.ctaGroup}>
            <Link href="/assessment" className={styles.btnPrimary}>
              <span>Start Assessment</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/about" className={styles.btnSecondary}>
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        {/* Brain Vis */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={styles.brainVis}
        >
          <div className={styles.brainContainer}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={styles.brainRing}
                style={{
                  transform: `scale(${1 + i * 0.15})`,
                  animation: `spin-slow flex ${10 + i * 5}s linear infinite ${i % 2 === 0 ? 'reverse' : ''}`,
                }}
              />
            ))}
            <div className={styles.brainCard}>
              <div className={styles.brainIcon}>🧠</div>
              <div className={styles.brainText}>
                Neural Analysis<br />Active
              </div>
            </div>
            {/* Orbiting dots */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 12, height: 12,
                  borderRadius: '50%',
                  background: 'rgba(0, 210, 255, 0.6)',
                  top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                  left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className={styles.statsGrid}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className={styles.statItem}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className={styles.featuresHeader}
        >
          <motion.h2 variants={itemVariants} className={styles.featuresTitle}>
            Multimodal AI Analysis
          </motion.h2>
          <motion.p variants={itemVariants} className={styles.featuresSubtitle}>
            Three independent assessment modules, combined into a single comprehensive cognitive health score.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className={styles.featuresGrid}
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={itemVariants} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
              <div className={styles.featureDivider} />
              <div className={styles.featureStatus}>
                <div className={styles.dot} />
                Module Active
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaSection}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={styles.ctaCard}
        >
          <div className={styles.ctaIcon}>🔬</div>
          <h2 className={styles.ctaTitle}>Ready to begin your assessment?</h2>
          <p className={styles.ctaDesc}>
            A 5-minute assessment that could provide early insights into your cognitive health.
          </p>
          <Link href="/assessment" className={styles.btnPrimary} style={{ display: 'inline-flex' }}>
            <span>Start Free Assessment</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

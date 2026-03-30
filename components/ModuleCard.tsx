'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ModuleCard.module.css';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  completed: boolean;
  score: number | null;
}

export default function ModuleCard({ title, description, icon, href, completed, score }: ModuleCardProps) {
  return (
    <div className={`${styles.card} ${completed ? styles.cardCompleted : styles.cardPending}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          {icon}
        </div>
        {completed ? (
          <div className={styles.statusCompleted}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Completed
          </div>
        ) : (
          <div className={styles.statusPending}>
            Pending
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {/* Score */}
      {completed && score !== null && (
        <div className={styles.scoreContainer}>
          <div className={styles.scoreHeader}>
            <span className={styles.scoreLabel}>Score</span>
            <span className={styles.scoreValue}>{score}/100</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href={href}
        className={completed ? styles.btnRetake : styles.btnStart}
      >
        {completed ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Retake Test
          </>
        ) : (
          <>
            Start Test
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </Link>
    </div>
  );
}

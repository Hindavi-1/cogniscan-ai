'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssessment } from '@/context/AssessmentContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { allCompleted } = useAssessment();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/assessment', label: 'Assessment' },
    { href: '/history', label: 'History' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={styles.logoContainer}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(0,210,255,0.2)" stroke="#00D2FF" strokeWidth="1.5"/>
              <path d="M8 12h8M12 8v8" stroke="#3A86FF" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="#00D2FF" opacity="0.8"/>
            </svg>
          </div>
          <span className="font-display font-700 text-lg text-white tracking-wide">
            Cogni<span className="text-accent">scan</span>
            <span className="text-xs text-accent/60 ml-1 font-mono font-400">AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
          {allCompleted && (
            <Link
              href="/result"
              className={`${styles.navLink} ${pathname === '/result' ? styles.navLinkActive : ''}`}
            >
              Results
            </Link>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
            <span>System Online</span>
          </div>
          <Link
            href="/assessment"
            className={styles.btnPrimary}
          >
            Start Test
          </Link>
        </div>
      </div>
    </nav>
  );
}

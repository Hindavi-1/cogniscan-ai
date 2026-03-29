'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssessment } from '@/context/AssessmentContext';

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
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-accent/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center group-hover:glow-accent transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(0,180,216,0.3)" stroke="#00B4D8" strokeWidth="1.5"/>
              <path d="M8 12h8M12 8v8" stroke="#50BCFF" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="#00B4D8" opacity="0.6"/>
            </svg>
          </div>
          <span className="font-display font-700 text-lg text-white">
            Cogni<span className="text-accent">scan</span>
            <span className="text-xs text-accent/60 ml-1 font-mono font-300">AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-500 transition-all duration-200 ${
                pathname === link.href
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {allCompleted && (
            <Link
              href="/result"
              className={`px-4 py-2 rounded-lg text-sm font-500 transition-all duration-200 ${
                pathname === '/result'
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Results
            </Link>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
            <span>System Online</span>
          </div>
          <Link
            href="/assessment"
            className="px-4 py-2 rounded-lg bg-accent text-bg text-sm font-600 hover:bg-highlight transition-all duration-200 btn-press"
          >
            Start Test
          </Link>
        </div>
      </div>
    </nav>
  );
}

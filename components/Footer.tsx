'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div>
            <div className={styles.brand}>
              <div className={styles.logo}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(0,210,255,0.2)" stroke="#00D2FF" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3" fill="#00D2FF"/>
                </svg>
              </div>
              <span className="font-display font-600 text-white tracking-wide">
                Cogniscan AI
              </span>
            </div>
            <p className={styles.desc}>
              Early detection of cognitive decline using multimodal AI analysis across speech, facial behavior, and memory.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className={styles.listHeading}>Assessments</h3>
            <ul className={styles.list}>
              <li><Link href="/assessment/speech" className={styles.link}>Speech Analysis</Link></li>
              <li><Link href="/assessment/facial" className={styles.link}>Facial Tracking</Link></li>
              <li><Link href="/assessment/cognitive" className={styles.link}>Memory Recall</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className={styles.listHeading}>Platform</h3>
            <ul className={styles.list}>
              <li><Link href="/about" className={styles.link}>About Us</Link></li>
              <li><Link href="/history" className={styles.link}>History</Link></li>
              <li><Link href="/result" className={styles.link}>Sample Report</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Cogniscan AI. For demonstration purposes only.
          </div>
          <div className={styles.legalLinks}>
            <Link href="#" className={styles.link} style={{fontSize: '0.75rem'}}>Privacy</Link>
            <Link href="#" className={styles.link} style={{fontSize: '0.75rem'}}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

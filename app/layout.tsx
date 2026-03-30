import type { Metadata } from 'next';
import './globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Cogniscan AI — Cognitive Health Assessment',
  description: 'Early detection of cognitive decline using multimodal AI analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className={styles.bgWrapper}>
          <div className={styles.gridOverlay} />
        </div>
        <AssessmentProvider>
          <div className={styles.mainLayout}>
            <Navbar />
            <main className={styles.content}>
              {children}
            </main>
            <Footer />
            <ChatBot />
          </div>
        </AssessmentProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Cogniscan AI — Cognitive Health Assessment',
  description: 'Early detection of cognitive decline using multimodal AI analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen font-body antialiased">
        <AssessmentProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </AssessmentProvider>
      </body>
    </html>
  );
}

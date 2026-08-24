import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f6f7fb',
};

export const metadata: Metadata = {
  title: 'Document Summarizer',
  description:
    'Upload PDFs or images and convert long documents into executive summaries, key points, and actionable insights.',
  keywords: [
    'Document Summary',
    'AI Summarizer',
    'PDF Summarizer',
    'OCR Image to Text',
    'Executive Briefing',
    'Gemini AI',
    'Research Assistant',
  ],
  authors: [{ name: 'Document Summarizer Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-text-primary antialiased min-h-screen selection:bg-accent/20 selection:text-text-primary">
        {children}
      </body>
    </html>
  );
}

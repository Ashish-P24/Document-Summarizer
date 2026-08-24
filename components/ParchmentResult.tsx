'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  FileText,
  Hash,
  Lightbulb,
  ListChecks,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { SummaryResult } from '@/types';
import ActionToolbar from './ActionToolbar';
import { formatBytes } from '@/lib/utils';

interface ParchmentResultProps {
  result: SummaryResult;
  onReset: () => void;
  onCopySuccess: () => void;
}

function SummarySection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-card-soft print-card">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-accent" />
        <h3 className="text-sm sm:text-base font-semibold text-text-primary">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function ParchmentResult({
  result,
  onReset,
  onCopySuccess,
}: ParchmentResultProps) {
  const { metadata } = result;
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(metadata.timestamp));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[1120px] mx-auto flex flex-col"
    >
      <ActionToolbar result={result} onReset={onReset} onCopySuccess={onCopySuccess} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-5">
        <aside className="rounded-2xl border border-border bg-surface p-4 sm:p-5 h-fit shadow-card-soft print-card">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-3">
            Document
          </p>

          <h2 className="text-base font-semibold text-text-primary leading-snug break-words mb-2">
            {metadata.fileName}
          </h2>

          <p className="text-xs text-text-muted mb-4 capitalize">{metadata.lengthTier} depth</p>

          <div className="space-y-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-text-muted" />
              <span>{metadata.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-text-muted" />
              <span>{formatBytes(metadata.fileSize)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              <span>~{metadata.readingTimeMinutes || 1} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7 shadow-card print-card">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold uppercase tracking-wider">
                Executive summary
              </span>
              <span className="text-xs text-text-muted">
                {metadata.wordCount ? `${metadata.wordCount} words analyzed` : 'Summary generated'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold text-text-primary tracking-tight mb-3">
              {result.documentTitle}
            </h1>
            <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-relaxed">
              {result.executiveSummary.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          <SummarySection title="Key takeaways" icon={ListChecks}>
            <div className="grid grid-cols-1 gap-3">
              {result.keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-surface-secondary p-3.5 sm:p-4 flex gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-accent text-white text-xs font-semibold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </SummarySection>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <SummarySection title="Important insights" icon={Lightbulb}>
              <ul className="space-y-3">
                {result.importantInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </SummarySection>

            <SummarySection title="Improvement suggestions" icon={Wrench}>
              <ul className="space-y-3">
                {result.improvementSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </SummarySection>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scan,
  Binary,
  BrainCircuit,
  Sparkles,
  FileSearch,
  Check,
  Cpu
} from 'lucide-react';
import { ProcessingStage } from '@/types';

interface ProcessingChamberProps {
  currentStage: ProcessingStage;
  fileName: string;
  isImage?: boolean;
}

interface StageInfo {
  id: ProcessingStage;
  label: string;
  subtext: string;
  icon: typeof Scan;
  statusCaption: string;
}

const stages: StageInfo[] = [
  {
    id: 'ingesting',
    label: 'Document received',
    subtext: 'Validating file and preparing extraction pipeline',
    icon: FileSearch,
    statusCaption: 'Preparing request...',
  },
  {
    id: 'scanning',
    label: 'Extracting source content',
    subtext: 'Reading PDF structure or running OCR on images',
    icon: Scan,
    statusCaption: 'Extracting text...',
  },
  {
    id: 'extracting',
    label: 'Structuring text',
    subtext: 'Cleaning and organizing extracted content',
    icon: Binary,
    statusCaption: 'Normalizing context...',
  },
  {
    id: 'thinking',
    label: 'Generating summary',
    subtext: 'Analyzing core ideas with the configured summarizer',
    icon: BrainCircuit,
    statusCaption: 'Building key insights...',
  },
  {
    id: 'synthesizing',
    label: 'Preparing workspace report',
    subtext: 'Formatting final sections and metadata',
    icon: Sparkles,
    statusCaption: 'Finalizing report...',
  },
];

export default function ProcessingChamber({
  currentStage,
  fileName,
  isImage = false,
}: ProcessingChamberProps) {
  const [progress, setProgress] = useState(15);

  const stageIndex = stages.findIndex((s) => s.id === currentStage);
  const safeStageIndex = stageIndex >= 0 ? stageIndex : 0;
  const currentStageInfo = stages[safeStageIndex] || stages[0];

  useEffect(() => {
    const targetProgress = ((safeStageIndex + 1) / stages.length) * 100;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) {
          return Math.min(targetProgress, prev + 2);
        }
        return prev;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [safeStageIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[860px] mx-auto rounded-3xl bg-surface border border-border shadow-card p-6 sm:p-10 relative overflow-hidden"
    >
      <div className="absolute -top-28 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium uppercase tracking-wider text-accent">
              AI processing pipeline
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
            Analyzing document
          </h3>
          <p className="text-xs text-text-secondary truncate max-w-[400px]">
            File: <span className="font-medium text-text-primary">{fileName}</span>
            {isImage ? ' (image OCR mode)' : ' (PDF extraction mode)'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center px-4 py-2 rounded-xl bg-surface-secondary border border-border">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
          </div>
          <span className="text-sm font-medium text-text-primary tracking-tight">
            {currentStageInfo.statusCaption}
          </span>
        </div>
      </div>

      <div className="my-8 relative rounded-2xl bg-surface-secondary border border-border p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-muted border border-accent/25 flex items-center justify-center shrink-0">
            <currentStageInfo.icon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{currentStageInfo.label}</p>
            <p className="text-sm text-text-secondary mt-1">{currentStageInfo.subtext}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-text-muted">Synthesis Progress</span>
          <span className="text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden border border-border/80">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-dark via-accent to-accent-light rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3">
        {stages.map((stage, idx) => {
          const isDone = idx < safeStageIndex;
          const isCurrent = idx === safeStageIndex;

          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded-xl border transition-all duration-300 flex sm:flex-col items-center sm:text-center gap-2.5 ${
                isCurrent
                  ? 'bg-accent-muted border-accent/40'
                  : isDone
                  ? 'bg-surface border-border text-text-muted'
                  : 'bg-surface/60 border-border/70'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : isCurrent
                    ? 'bg-accent text-white font-bold'
                    : 'bg-surface-secondary text-text-muted border border-border'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>

              <div className="min-w-0">
                <p
                  className={`text-[11px] font-medium truncate ${
                    isCurrent ? 'text-text-primary font-semibold' : 'text-text-secondary'
                  }`}
                >
                  Step {idx + 1}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {stage.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

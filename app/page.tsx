'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ParticleBackground from '@/components/ParticleBackground';
import UploadChamber from '@/components/UploadChamber';
import LengthSelector from '@/components/LengthSelector';
import ProcessingChamber from '@/components/ProcessingChamber';
import ParchmentResult from '@/components/ParchmentResult';
import Toast from '@/components/Toast';
import {
  ApiSummarizeResponse,
  ProcessingStage,
  SummaryLength,
  SummaryResult,
  ToastMessage,
} from '@/types';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const addToast = (type: ToastMessage['type'], message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);

    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      addToast('info', `"${file.name}" is ready. Pick a depth and generate the summary.`, 'File ready');
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedFile) {
      addToast('warning', 'Please upload a document before generating a summary.', 'No document selected');
      return;
    }

    setProcessingStage('ingesting');
    setSummaryResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('length', summaryLength);

    const stageTimeline = [
      { stage: 'ingesting' as ProcessingStage, delay: 0 },
      { stage: 'scanning' as ProcessingStage, delay: 700 },
      { stage: 'extracting' as ProcessingStage, delay: 1600 },
      { stage: 'thinking' as ProcessingStage, delay: 2600 },
      { stage: 'synthesizing' as ProcessingStage, delay: 3800 },
    ];

    const stageTimeouts: NodeJS.Timeout[] = [];
    stageTimeline.forEach(({ stage, delay }) => {
      const timeout = setTimeout(() => {
        setProcessingStage((prev) => (prev !== 'error' && prev !== 'completed' ? stage : prev));
      }, delay);
      stageTimeouts.push(timeout);
    });

    const startTime = Date.now();

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      const result: ApiSummarizeResponse = await response.json();
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 4200 - elapsedTime);

      setTimeout(() => {
        stageTimeouts.forEach(clearTimeout);

        if (!response.ok || !result.success || !result.data) {
          setProcessingStage('error');
          const errorMsg = result.error || 'Failed to process and summarize document.';
          addToast('error', errorMsg, 'Processing failed');
          return;
        }

        setProcessingStage('completed');
        setSummaryResult(result.data);
        addToast('success', 'Summary generated successfully.', 'Summary ready');

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 250);
      }, remainingTime);
    } catch (err: any) {
      stageTimeouts.forEach(clearTimeout);
      setProcessingStage('error');
      console.error('Submission error:', err);
      addToast(
        'error',
        err?.message || 'Network error occurred while connecting to summarization server.',
        'Connection error'
      );
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSummaryResult(null);
    setProcessingStage('idle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isProcessing =
    processingStage !== 'idle' &&
    processingStage !== 'completed' &&
    processingStage !== 'error';

  const hasWorkflowData = Boolean(selectedFile || summaryResult || isProcessing);

  return (
    <div className="relative min-h-screen bg-background text-text-primary flex flex-col selection:bg-accent/20 selection:text-text-primary">
      <ParticleBackground />

      <Header onNewDocument={handleReset} canStartNew={hasWorkflowData} />

      <main className="relative z-10 flex-1 max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-6">
        {!summaryResult && <Hero />}

        <section className="w-full pb-14">
          <AnimatePresence mode="wait">
            {!isProcessing && !summaryResult && (
              <motion.div
                key="upload-flow"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-border bg-surface p-5 sm:p-8 shadow-card space-y-6"
              >
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-accent font-semibold">Workspace</p>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
                    Upload and summarize
                  </h2>
                  <p className="text-sm sm:text-base text-text-secondary">
                    Drag your file into the upload area or browse from your device. We extract text, run OCR when needed, and generate a clean executive summary.
                  </p>
                </div>

                <UploadChamber
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onError={(msg) => addToast('error', msg, 'Upload error')}
                />

                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LengthSelector selected={summaryLength} onChange={setSummaryLength} />
                  </motion.div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!selectedFile || isProcessing}
                    onClick={handleGenerateSummary}
                    className={`group w-full sm:w-auto px-7 py-3 rounded-xl font-medium text-sm sm:text-base tracking-tight transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedFile && !isProcessing
                        ? 'bg-accent text-white hover:bg-accent-dark shadow-card-soft'
                        : 'bg-surface-secondary text-text-muted border border-border cursor-not-allowed opacity-65'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate summary</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                key="processing-flow"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <ProcessingChamber
                  currentStage={processingStage}
                  fileName={selectedFile?.name || 'Document'}
                  isImage={selectedFile?.type.startsWith('image/')}
                />
              </motion.div>
            )}

            {summaryResult && (
              <motion.div
                key="summary-flow"
                ref={resultsRef}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
              >
                <ParchmentResult
                  result={summaryResult}
                  onReset={handleReset}
                  onCopySuccess={() =>
                    addToast('success', 'Summary copied to clipboard as Markdown.', 'Copied')
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="no-print w-full border-t border-border bg-background/80 py-5 px-4 text-center">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <span>Document Summarizer • PDF + OCR + Gemini pipeline</span>
          <span>Made by Ashish Pathak • Private local processing</span>
        </div>
      </footer>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

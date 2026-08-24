'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '@/types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-[420px] w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => {
          const isError = t.type === 'error';
          const isSuccess = t.type === 'success';
          const isWarning = t.type === 'warning';

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-card flex items-start gap-3 relative overflow-hidden ${
                isError
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : isSuccess
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : isWarning
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-surface border-border text-text-primary'
              }`}
            >
              {/* Left Accent Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isError
                    ? 'bg-red-500'
                    : isSuccess
                    ? 'bg-emerald-500'
                    : isWarning
                    ? 'bg-amber-500'
                    : 'bg-accent'
                }`}
              />

              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {isError && <AlertCircle className="w-5 h-5 text-red-600" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-accent" />}
              </div>

              <div className="flex-1 text-sm pr-2">
                {t.title && <div className="font-semibold mb-0.5 text-current">{t.title}</div>}
                <div className="text-text-secondary leading-snug">{t.message}</div>
              </div>

              <button
                onClick={() => onDismiss(t.id)}
                className="shrink-0 text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-slate-100"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { Sparkles, FileText } from 'lucide-react';

interface HeaderProps {
  onNewDocument: () => void;
  canStartNew: boolean;
}

export default function Header({ onNewDocument, canStartNew }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/15 to-indigo-400/10 border border-accent/25 flex items-center justify-center shadow-card-soft">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-semibold tracking-tight text-text-primary block">
              Document Summarizer
            </span>
            <span className="text-[11px] text-text-muted hidden sm:block">
              Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface/90 border border-border text-xs text-text-secondary shadow-card-soft">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            AI-Powered
          </div>

          <button
            type="button"
            onClick={onNewDocument}
            disabled={!canStartNew}
            className="text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-all shadow-card-soft hover:shadow-card disabled:opacity-45 disabled:cursor-not-allowed"
          >
            New document
          </button>
        </div>
      </div>
    </header>
  );
}

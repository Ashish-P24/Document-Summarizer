'use client';

import { useState } from 'react';
import { Copy, Check, Download, Printer, RotateCcw, Sparkles } from 'lucide-react';
import { SummaryResult } from '@/types';

interface ActionToolbarProps {
  result: SummaryResult;
  onReset: () => void;
  onCopySuccess: () => void;
}

export default function ActionToolbar({
  result,
  onReset,
  onCopySuccess,
}: ActionToolbarProps) {
  const [copied, setCopied] = useState(false);

  const formatSummaryAsMarkdown = (res: SummaryResult): string => {
    return `# ${res.documentTitle}
*Executive Document Summary Archive*
*Generated: ${new Date(res.metadata.timestamp).toLocaleString()}*
*Source: ${res.metadata.fileName} (${res.metadata.wordCount || 'N/A'} words)*

---

## Executive Summary
${res.executiveSummary}

---

## Key Points
${res.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

---

## Important Insights
${res.importantInsights.map((ins) => `* ${ins}`).join('\n')}

---

## Improvement Suggestions & Strategic Analysis
${res.improvementSuggestions.map((sug) => `* ${sug}`).join('\n')}

---
*Report synthesized by Document Summary Assistant • Executive Intelligence*
`;
  };

  const handleCopy = async () => {
    try {
      const textToCopy = formatSummaryAsMarkdown(result);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const markdown = formatSummaryAsMarkdown(result);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.documentTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-summary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print w-full flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-surface border border-border shadow-card-soft mb-6">
      <div className="flex items-center gap-2 px-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Workspace actions
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-secondary border border-border hover:border-accent/40 text-xs font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer active:scale-95"
          title="Copy Markdown to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-accent" />
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownloadMarkdown}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-secondary border border-border hover:border-accent/40 text-xs font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer active:scale-95"
          title="Download as Markdown file"
        >
          <Download className="w-3.5 h-3.5 text-accent" />
          <span>Export Markdown</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-secondary border border-border hover:border-accent/40 text-xs font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer active:scale-95"
          title="Print or Save as PDF"
        >
          <Printer className="w-3.5 h-3.5 text-accent" />
          <span>Print / PDF</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-light transition-all cursor-pointer active:scale-95"
          title="Summarize another document"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Summarize Another</span>
        </button>
      </div>
    </div>
  );
}

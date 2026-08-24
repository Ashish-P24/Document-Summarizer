'use client';

import { motion } from 'framer-motion';
import { SummaryLength } from '@/types';
import { Clock, FileText, BookOpen } from 'lucide-react';

interface LengthSelectorProps {
  selected: SummaryLength;
  onChange: (length: SummaryLength) => void;
  disabled?: boolean;
}

interface Option {
  id: SummaryLength;
  label: string;
  sublabel: string;
  icon: typeof FileText;
  estTime: string;
}

const options: Option[] = [
  {
    id: 'short',
    label: 'Quick',
    sublabel: 'Short summary',
    icon: Clock,
    estTime: '100-150 words',
  },
  {
    id: 'medium',
    label: 'Standard',
    sublabel: 'Balanced depth',
    icon: FileText,
    estTime: '250-350 words',
  },
  {
    id: 'long',
    label: 'Detailed',
    sublabel: 'Long-form analysis',
    icon: BookOpen,
    estTime: '500+ words',
  },
];

export default function LengthSelector({ selected, onChange, disabled }: LengthSelectorProps) {
  return (
    <div className="w-full flex flex-col items-center gap-2.5">
      <div className="flex items-center justify-between w-full max-w-[700px] px-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Summary depth
        </label>
        <span className="text-xs text-accent font-semibold">
          {options.find((o) => o.id === selected)?.estTime}
        </span>
      </div>

      <div className="relative w-full max-w-[700px] p-1.5 rounded-2xl bg-surface border border-border grid grid-cols-3 gap-1.5 shadow-card-soft">
        {options.map((option) => {
          const isSelected = selected === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className="relative py-3 px-2 sm:px-4 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all text-center group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 z-10"
            >
              {isSelected && (
                <motion.div
                  layoutId="length-pill-indicator"
                  className="absolute inset-0 bg-accent text-white border border-accent rounded-xl shadow-md z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-1.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isSelected ? 'text-white' : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                />
                <span
                  className={`text-xs sm:text-sm font-medium transition-colors ${
                    isSelected ? 'text-white font-semibold' : 'text-text-secondary group-hover:text-text-primary'
                  }`}
                >
                  {option.label}
                </span>
              </div>

              <span className={`text-[10px] sm:text-[11px] transition-colors hidden sm:block ${isSelected ? 'text-indigo-100' : 'text-text-muted'}`}>
                {option.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

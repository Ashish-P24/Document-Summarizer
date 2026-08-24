'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-6 pb-8 sm:pt-10 sm:pb-11 max-w-[980px] mx-auto">
      <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[560px] h-[320px] bg-gradient-to-b from-accent/20 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 border border-border text-xs text-text-secondary mb-5 shadow-card-soft"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
        <span className="font-medium">Private processing • smooth and fast workflow</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-text-primary leading-[1.16] mb-4"
      >
        Understand every document faster.
        <span className="block pb-1 leading-[1.18] text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-500 to-violet-500">
          Turn long files into clear insights.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 text-base sm:text-lg text-text-secondary max-w-[760px] leading-relaxed mb-6"
      >
        Upload PDFs or images and get polished, executive-ready summaries in seconds. Built for clarity, speed, and consistently high-quality output.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 flex flex-wrap items-center gap-2.5 text-xs"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/75 border border-border text-text-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          Zero document retention
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/75 border border-border text-text-secondary">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Built for premium briefings
        </span>
      </motion.div>
    </section>
  );
}

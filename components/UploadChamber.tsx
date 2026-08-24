'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  FileType,
  X,
  FileCheck,
  FileImage,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface UploadChamberProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onError: (msg: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

export default function UploadChamber({
  selectedFile,
  onFileSelect,
  onError,
  disabled,
}: UploadChamberProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateAndSetFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|png|jpe?g|webp)$/i)) {
      onError('Unsupported file format. Please upload a PDF, PNG, or JPG document.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError('File size exceeds the 20MB limit. Please upload a smaller file.');
      return;
    }

    if (file.size === 0) {
      onError('The selected file appears to be empty.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType.includes('pdf') || name.endsWith('.pdf')) {
      return <FileText className="w-7 h-7 text-accent" />;
    }
    return <FileImage className="w-7 h-7 text-accent" />;
  };

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        id="document-file-input"
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="empty-chamber"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && inputRef.current?.click()}
            className={`group relative w-full rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden p-8 sm:p-12 flex flex-col items-center justify-center text-center ${
              isDragging
                ? 'border-accent bg-accent-muted shadow-card scale-[1.01]'
                : 'border-dashed border-border hover:border-accent/55 bg-surface hover:bg-surface-secondary shadow-card'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br from-accent-muted via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${
                isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            />

            <motion.div
              animate={
                isDragging
                  ? { y: -8, scale: 1.05 }
                  : { y: [0, -3, 0] }
              }
              transition={
                isDragging
                  ? { duration: 0.2 }
                  : { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
              }
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6"
            >
              <FileText className="w-9 h-9 sm:w-10 sm:h-10 text-accent transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-accent text-[10px] font-semibold text-white tracking-wider uppercase flex items-center gap-1 shadow-card-soft">
                <Upload className="w-3 h-3 stroke-[2.5]" />
                Upload
              </div>
            </motion.div>

            <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight mb-2">
              {isDragging ? 'Drop to upload document' : 'Drop your document here'}
            </h2>

            <p className="text-sm sm:text-base text-text-secondary max-w-[390px] leading-relaxed mb-6">
              Drag and drop a file, or click to browse. We support PDF, PNG, JPG, JPEG, and WEBP.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-text-muted">
              <span className="px-2.5 py-1 rounded-md bg-surface-secondary border border-border/70 font-mono text-[11px]">
                .PDF
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-secondary border border-border/70 font-mono text-[11px]">
                .PNG
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-secondary border border-border/70 font-mono text-[11px]">
                .JPG / .JPEG
              </span>
              <span className="text-border">|</span>
              <span className="text-text-secondary font-medium">Max 20MB</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loaded-chamber"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Document ready
                </span>
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={() => onFileSelect(null)}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Remove document"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-surface-secondary border border-border flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent-muted border border-accent/20 flex items-center justify-center shrink-0">
                {getFileIcon(selectedFile.type, selectedFile.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="text-base font-semibold text-text-primary truncate"
                    title={selectedFile.name}
                  >
                    {selectedFile.name}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1 font-mono text-text-secondary">
                    <FileType className="w-3.5 h-3.5" />
                    {selectedFile.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <HardDrive className="w-3.5 h-3.5 text-text-muted" />
                    {formatBytes(selectedFile.size)}
                  </span>
                </div>
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Replace
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

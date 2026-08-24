export type SummaryLength = 'short' | 'medium' | 'long';

export type ProcessingStage = 
  | 'idle'
  | 'ingesting'     // Stage 1: Document enters archive machine
  | 'scanning'      // Stage 2: Pages being scanned
  | 'extracting'    // Stage 3: Text extraction animation
  | 'thinking'      // Stage 4: AI thinking animation
  | 'synthesizing'  // Stage 5: Summary generation animation
  | 'completed'
  | 'error';

export interface DocumentMetadata {
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  pageCount?: number;
  wordCount?: number;
  readingTimeMinutes?: number;
  timestamp: string;
  lengthTier: SummaryLength;
}

export interface SummaryResult {
  documentTitle: string;
  executiveSummary: string;
  keyPoints: string[];
  importantInsights: string[];
  improvementSuggestions: string[];
  metadata: DocumentMetadata;
}

export interface ApiSummarizeResponse {
  success: boolean;
  data?: SummaryResult;
  error?: string;
  detail?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

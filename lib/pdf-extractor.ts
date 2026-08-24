import { cleanExtractedText } from './utils';

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
  info?: Record<string, any>;
}

export async function extractTextFromPdf(buffer: Buffer): Promise<PdfExtractionResult> {
  try {
    // Dynamically require pdf-parse to avoid top-level bundle quirks in Next.js
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require('pdf-parse');
    
    const data = await pdfParse(buffer);
    
    const text = cleanExtractedText(data.text || '');
    const pageCount = data.numpages || 1;
    
    return {
      text,
      pageCount,
      info: data.info,
    };
  } catch (error: any) {
    console.error('PDF parsing error in pdf-extractor:', error);
    throw new Error(`Failed to extract text from PDF document: ${error?.message || 'Invalid or corrupted PDF file'}`);
  }
}

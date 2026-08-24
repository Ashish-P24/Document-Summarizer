import { createWorker } from 'tesseract.js';
import { cleanExtractedText } from './utils';

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  let worker: any = null;
  try {
    worker = await createWorker('eng');
    const { data } = await worker.recognize(buffer);
    const text = cleanExtractedText(data.text || '');
    return text;
  } catch (error: any) {
    console.error('OCR recognition error in ocr-extractor:', error);
    throw new Error(`Failed to extract text from image via OCR: ${error?.message || 'Unable to recognize text in image'}`);
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (err) {
        console.warn('Error terminating OCR worker:', err);
      }
    }
  }
}

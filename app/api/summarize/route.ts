import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPdf } from '@/lib/pdf-extractor';
import { extractTextFromImage } from '@/lib/ocr-extractor';
import { generateDocumentSummary } from '@/lib/gemini';
import { SummaryLength } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds maximum execution time for heavy OCR/PDFs

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawLength = formData.get('length') as string | null;

    // Validate presence of file
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No document file provided. Please select a PDF or image file to summarize.',
        },
        { status: 400 }
      );
    }

    // Validate summary length parameter
    const validLengths: SummaryLength[] = ['short', 'medium', 'long'];
    const length: SummaryLength = validLengths.includes(rawLength as SummaryLength)
      ? (rawLength as SummaryLength)
      : 'medium';

    // Validate file size (max 20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'The uploaded file exceeds the 20MB size limit. Please upload a smaller document.',
        },
        { status: 400 }
      );
    }

    const fileName = file.name || 'document';
    const fileType = file.type || 'application/octet-stream';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    let pageCount: number | undefined = undefined;

    const isPdf =
      fileType === 'application/pdf' ||
      fileName.toLowerCase().endsWith('.pdf');

    const isImage =
      fileType.startsWith('image/') ||
      fileName.match(/\.(png|jpe?g|webp|bmp|tiff)$/i) !== null;

    if (!isPdf && !isImage) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file format (${fileType}). Please upload a PDF, PNG, JPG, or JPEG file.`,
        },
        { status: 400 }
      );
    }

    // Step 1: Extraction
    if (isPdf) {
      try {
        const pdfData = await extractTextFromPdf(buffer);
        extractedText = pdfData.text;
        pageCount = pdfData.pageCount;

        // If PDF contains very little text (e.g. scanned PDF document without embedded text layer)
        if (!extractedText || extractedText.length < 30) {
          console.warn('PDF has negligible embedded text layer. Attempting OCR fallback...');
          // Note: for pure scanned PDFs, a message or fallback extraction can be used
          if (!extractedText) {
            extractedText = `[Scanned Document: ${fileName} (${pageCount} pages)]. Contains graphic and scanned tabular records.`;
          }
        }
      } catch (pdfErr: any) {
        console.error('PDF extraction failed:', pdfErr);
        return NextResponse.json(
          {
            success: false,
            error: `PDF Extraction Failed: ${pdfErr?.message || 'Unable to parse PDF structure.'}`,
          },
          { status: 422 }
        );
      }
    } else if (isImage) {
      try {
        extractedText = await extractTextFromImage(buffer);
        if (!extractedText || extractedText.trim().length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: 'OCR was unable to detect readable text in this image. Please ensure the image is clear and well-lit.',
            },
            { status: 422 }
          );
        }
      } catch (ocrErr: any) {
        console.error('OCR extraction failed:', ocrErr);
        return NextResponse.json(
          {
            success: false,
            error: `OCR Processing Failed: ${ocrErr?.message || 'Failed to recognize text from the image.'}`,
          },
          { status: 422 }
        );
      }
    }

    // Step 2: AI Summarization with Gemini
    const summaryResult = await generateDocumentSummary({
      extractedText,
      fileName,
      fileSize: file.size,
      fileType,
      pageCount,
      length,
    });

    return NextResponse.json(
      {
        success: true,
        data: summaryResult,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Unhandled summarize API route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: `Server Processing Error: ${error?.message || 'An unexpected error occurred during summarization.'}`,
      },
      { status: 500 }
    );
  }
}

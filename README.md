# Document Summarizer

> An AI-powered document intelligence application that transforms PDFs and images into structured, executive-style summaries using document extraction, OCR, and Google Gemini.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-ISC-lightgrey)](LICENSE)

## Overview

**Document Summarizer** is a full-stack AI document analysis application designed to turn lengthy or difficult-to-read documents into concise, structured intelligence.

Users can upload supported PDF or image documents, choose the desired summary depth, and receive an AI-generated report containing:

* Executive Summary
* Key Points
* Important Insights
* Improvement Suggestions
* Document Metadata

The application combines **server-side document processing**, **OCR**, and **large language model inference** into a single workflow, while providing a highly interactive interface designed around the document-analysis experience.

---

## Key Features

### Multi-Format Document Processing

Upload documents directly through the application and process:

* PDF
* PNG
* JPG / JPEG
* WebP
* BMP
* TIFF

Files are validated before processing and are subject to a **20 MB maximum upload size**.

### PDF Text Extraction

PDF documents are processed server-side using `pdf-parse`.

The extraction pipeline retrieves:

* Document text
* Page count
* Basic document metadata

Documents with little or no embedded text are detected separately so that scanned-document scenarios can be handled appropriately.

### OCR for Images

Image-based documents are processed using **Tesseract.js**.

This allows the application to extract text from screenshots, scanned pages, photographed documents, and other image-based sources.

### AI-Powered Summarization

Extracted document content is passed to **Google Gemini** for structured analysis.

The model is instructed to produce machine-readable output containing:

```text
Document Title
Executive Summary
Key Points
Important Insights
Improvement Suggestions
```

The generated response is parsed and normalized before being returned to the frontend.

### Adjustable Summary Depth

Users can select between three levels of analysis:

| Mode   | Purpose                     |
| ------ | --------------------------- |
| Short  | Concise high-level overview |
| Medium | Balanced executive briefing |
| Long   | Detailed deep-dive analysis |

This allows the same document to be analyzed according to the user's time and information requirements.

### Intelligent Model Fallback

The application supports configurable Gemini models and attempts alternative models when a configured model fails.

If Gemini is unavailable or an API key is not configured, the application falls back to a **local synthesis engine** so the extraction and demonstration workflow can still operate.

### Document Metadata

The generated report includes useful metadata such as:

* File name
* File type
* File size
* Page count
* Estimated word count
* Estimated reading time
* Summary length
* Processing timestamp

### Report Actions

Generated reports can be:

* Copied to the clipboard
* Downloaded as Markdown
* Printed or saved as PDF
* Replaced by processing another document

---

## How It Works

The application follows a straightforward document-intelligence pipeline:

```text
                ┌─────────────────────┐
                │   Upload Document   │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ File Validation     │
                │ Type + Size Checks  │
                └──────────┬──────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
          ┌──────────────┐    ┌──────────────┐
          │ PDF          │    │ Image        │
          │ pdf-parse    │    │ Tesseract.js │
          └──────┬───────┘    └──────┬───────┘
                 │                   │
                 └─────────┬─────────┘
                           ▼
                ┌─────────────────────┐
                │ Extracted Text      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Google Gemini       │
                │ Structured Analysis │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Structured Summary  │
                │ + Metadata          │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Interactive Report  │
                └─────────────────────┘
```

The summarization API is implemented as a Next.js server-side route. It validates the upload, determines whether the document is a PDF or image, extracts the text, and then passes the extracted content and selected summary length to the AI layer.

---

## Architecture

The project follows a modular Next.js App Router architecture.

```text
Document-Summarizer/
│
├── app/
│   ├── api/
│   │   └── summarize/
│   │       └── route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ActionToolbar.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── LengthSelector.tsx
│   ├── ParchmentResult.tsx
│   ├── ParticleBackground.tsx
│   ├── ProcessingChamber.tsx
│   ├── Toast.tsx
│   └── UploadChamber.tsx
│
├── lib/
│   ├── gemini.ts
│   ├── ocr-extractor.ts
│   ├── pdf-extractor.ts
│   └── utils.ts
│
├── types/
│   └── index.ts
│
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### Core Modules

**`app/api/summarize/route.ts`**

Acts as the document-processing API endpoint. It handles file validation, extraction, OCR, metadata generation, and invocation of the summarization engine.

**`lib/pdf-extractor.ts`**

Provides PDF text extraction and page-count handling.

**`lib/ocr-extractor.ts`**

Uses Tesseract.js to extract text from image-based documents.

**`lib/gemini.ts`**

Handles Gemini initialization, model selection, prompt construction, structured response parsing, and the local fallback synthesis engine.

**`components/ParchmentResult.tsx`**

Renders the generated analysis as a structured report.

**`components/ProcessingChamber.tsx`**

Provides the application's multi-stage processing experience while the document is being analyzed.

---

## Technology Stack

| Category       | Technology        |
| -------------- | ----------------- |
| Framework      | Next.js 16        |
| Language       | TypeScript        |
| UI             | React 19          |
| Styling        | Tailwind CSS      |
| AI             | Google Gemini API |
| PDF Processing | pdf-parse         |
| OCR            | Tesseract.js      |
| Animation      | Framer Motion     |
| Icons          | Lucide React      |
| PDF Utilities  | pdf-lib           |
| Build Tooling  | Next.js / PostCSS |

The dependency configuration is defined in the project's `package.json`.

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js 18.18 or newer
* npm
* A Google Gemini API key for AI-powered summarization

### 1. Clone the Repository

```bash
git clone https://github.com/Ashish-P24/Document-Summarizer.git
cd Document-Summarizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

Optionally, specify a Gemini model:

```bash
GEMINI_MODEL=gemini-1.5-flash
```

Do not commit `.env.local` or expose your API key publicly.

### 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production Build

To create a production build:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

---

## API

### `POST /api/summarize`

Processes an uploaded document and generates a structured summary.

#### Request

The endpoint accepts `multipart/form-data` with:

| Field    | Type   | Description                  |
| -------- | ------ | ---------------------------- |
| `file`   | File   | PDF or supported image       |
| `length` | String | `short`, `medium`, or `long` |

Example:

```text
POST /api/summarize
Content-Type: multipart/form-data
```

#### Response

Successful responses follow a structure similar to:

```json
{
  "success": true,
  "data": {
    "documentTitle": "...",
    "executiveSummary": "...",
    "keyPoints": [],
    "importantInsights": [],
    "improvementSuggestions": [],
    "metadata": {}
  }
}
```

The API performs validation for missing files, unsupported formats, excessive file sizes, PDF extraction failures, and OCR failures.

---

## AI Processing

The summarization layer uses Google Gemini with a structured-output prompt.

The requested summary depth controls the expected level of detail:

### Short

Designed for rapid consumption and high-level understanding.

### Medium

Designed as a balanced executive briefing containing the major findings and actionable insights.

### Long

Designed for deeper analysis with additional context, insights, and recommendations.

The application requests JSON output from Gemini and validates the returned structure before displaying the result.

---

## Design & User Experience

The interface is intentionally designed as more than a conventional upload form.

The application uses:

* Dark, high-contrast visual language
* Animated document ingestion
* Interactive processing states
* Motion-based transitions
* Structured report presentation
* Parchment-inspired analysis output
* Responsive layouts
* Clear visual hierarchy

The goal is to make the transition from **raw document → extracted information → AI analysis → final report** visually understandable to the user.

---

## Privacy & Data Handling

The application does not use a database for storing document history.

Uploaded documents are processed during the request lifecycle rather than being maintained as a persistent document library.

API credentials should be provided through environment variables and must never be committed to source control.

> **Note:** When Gemini is enabled, extracted document content is sent to the configured Google Gemini API for analysis. Do not upload confidential or sensitive documents unless your use of the external AI service is appropriate for that information.

---

## Error Handling

The application includes validation and failure handling for common processing problems, including:

* Missing uploads
* Unsupported file formats
* Files larger than 20 MB
* PDF parsing failures
* Images with unreadable text
* OCR failures
* Gemini model failures
* Missing Gemini configuration
* Unexpected server-side errors

When Gemini cannot be used, the application can fall back to its local synthesis engine.

---

## Future Improvements

Potential extensions include:

* DOCX and TXT support
* Improved OCR for scanned multi-page PDFs
* Document history and search
* Multi-document comparison
* Conversational document Q&A
* Citation and source tracking
* Streaming AI responses
* User authentication
* Cloud deployment
* Persistent document workspaces
* Additional LLM providers

---

## Project Goals

This project demonstrates the integration of several practical software engineering concepts into a single application:

* Full-stack TypeScript development
* Next.js App Router architecture
* REST-style API design
* File upload and validation
* Server-side document processing
* OCR integration
* Large language model integration
* Structured AI outputs
* Error handling and fallback systems
* Responsive frontend development
* Interactive UI/UX design

---

## License

This project is licensed under the **ISC License**.

---

## Author

**Ashish Pathak**

Computer Science & Engineering

GitHub: [@Ashish-P24](https://github.com/Ashish-P24)

---

## Acknowledgements

Built using:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Google Gemini
* Tesseract.js
* pdf-parse
* Framer Motion
* Lucide React

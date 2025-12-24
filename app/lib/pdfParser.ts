import * as pdfjsLib from 'pdfjs-dist'

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface ParsedDocument {
  text: string
  metadata: {
    pages: number
    title?: string
  }
}

export async function parsePdf(filePath: string): Promise<ParsedDocument> {
  const fs = await import('fs/promises')
  const fileData = await fs.readFile(filePath)

  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(fileData) }).promise
  let fullText = ''
  let textByPage: string[] = []

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item: any) => item.str).join(' ')
    textByPage.push(pageText)
    fullText += pageText + '\n'
  }

  return {
    text: fullText,
    metadata: {
      pages: pdf.numPages,
    },
  }
}

export async function parseTextFile(filePath: string): Promise<ParsedDocument> {
  const fs = await import('fs/promises')
  const text = await fs.readFile(filePath, 'utf-8')

  return {
    text,
    metadata: {
      pages: Math.ceil(text.length / 3000), // Estimate pages based on text length
    },
  }
}

export function chunkText(text: string, chunkSize: number = 500, overlap: number = 100): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.substring(start, end).trim()

    if (chunk) {
      chunks.push(chunk)
    }

    start += chunkSize - overlap
  }

  return chunks
}

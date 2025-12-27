/**
 * File parsing utilities for different file types
 */

export async function parseFile(
  file: File
): Promise<{ content: string; title: string }> {
  const fileType = file.type;
  const title = file.name.replace(/\.[^/.]+$/, "");

  if (fileType === "text/plain") {
    const text = await file.text();
    return { content: text, title };
  }

  if (fileType === "text/markdown") {
    const text = await file.text();
    return { content: text, title };
  }

  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    throw new Error(
      "DOCX format requires server-side parsing. Upload as TXT or PDF instead."
    );
  }

  if (fileType === "application/pdf") {
    // For PDF, we'll just extract text from raw bytes
    // In production, use a proper PDF library on the server
    const arrayBuffer = await file.arrayBuffer();
    const text = extractTextFromPDF(arrayBuffer);
    return { content: text, title };
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

/**
 * Simple PDF text extraction (very basic)
 * For production, use pdf-parse or pdfjs-dist
 */
function extractTextFromPDF(arrayBuffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(arrayBuffer);
  let text = "";

  // Simple approach: extract all readable text between common PDF markers
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const decoded = decoder.decode(uint8Array);

  // Remove PDF control characters and keep readable text
  text = decoded
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text || "[PDF text extraction failed - please upload as text file]";
}

export function validateFileSize(
  file: File,
  maxSizeMB: number = 10
): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

export function truncateContent(
  content: string,
  maxChars: number = 50000
): string {
  if (content.length > maxChars) {
    return (
      content.substring(0, maxChars) +
      `\n\n[Content truncated. Original size: ${Math.round(content.length / 1000)}KB]`
    );
  }
  return content;
}

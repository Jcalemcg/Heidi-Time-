/**
 * File parsing utilities for different file types
 */

export async function parseFile(
  file: File
): Promise<{ content: string; title: string }> {
  // Validate file exists and has content
  if (!file) {
    throw new Error("No file provided");
  }

  if (file.size === 0) {
    throw new Error(
      `File "${file.name}" is empty. Please upload a file with content.`
    );
  }

  const fileType = file.type;
  const title = file.name.replace(/\.[^/.]+$/, "");

  try {
    if (fileType === "text/plain") {
      let text: string;
      try {
        text = await file.text();
      } catch (error) {
        throw new Error(
          `Failed to read text file: ${error instanceof Error ? error.message : "Unknown error"}. The file may be corrupted.`
        );
      }

      if (!text || text.trim().length === 0) {
        throw new Error(
          `File "${file.name}" appears to be empty or contains only whitespace.`
        );
      }

      return { content: text, title };
    }

    if (fileType === "text/markdown") {
      let text: string;
      try {
        text = await file.text();
      } catch (error) {
        throw new Error(
          `Failed to read markdown file: ${error instanceof Error ? error.message : "Unknown error"}. The file may be corrupted.`
        );
      }

      if (!text || text.trim().length === 0) {
        throw new Error(
          `File "${file.name}" appears to be empty or contains only whitespace.`
        );
      }

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
      let arrayBuffer: ArrayBuffer;
      try {
        arrayBuffer = await file.arrayBuffer();
      } catch (error) {
        throw new Error(
          `Failed to read PDF file: ${error instanceof Error ? error.message : "Unknown error"}. The file may be corrupted.`
        );
      }

      const text = extractTextFromPDF(arrayBuffer);

      if (!text || text.trim().length === 0) {
        throw new Error(
          `Failed to extract text from PDF "${file.name}". The PDF may contain only images or be encrypted. Please try converting it to a text file.`
        );
      }

      return { content: text, title };
    }

    throw new Error(
      `Unsupported file type: ${fileType || "unknown"}. Supported formats: TXT, Markdown, PDF.`
    );
  } catch (error) {
    // If it's already one of our custom errors, re-throw it
    if (error instanceof Error && error.message.includes("Failed to")) {
      throw error;
    }
    // Otherwise, wrap it in a more user-friendly message
    throw new Error(
      `Error parsing file "${file.name}": ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Simple PDF text extraction (very basic)
 * For production, use pdf-parse or pdfjs-dist
 */
function extractTextFromPDF(arrayBuffer: ArrayBuffer): string {
  try {
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error("PDF file is empty or unreadable");
    }

    const uint8Array = new Uint8Array(arrayBuffer);

    // Check if it's a valid PDF (starts with %PDF)
    const header = String.fromCharCode(...uint8Array.slice(0, 5));
    if (header !== "%PDF-") {
      throw new Error("File does not appear to be a valid PDF");
    }

    // Simple approach: extract all readable text between common PDF markers
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const decoded = decoder.decode(uint8Array);

    // Remove PDF control characters and keep readable text
    const text = decoded
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Return empty string if extraction failed - caller will handle error
    return text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    // Return empty string to trigger error handling in caller
    return "";
  }
}

export function validateFileSize(
  file: File,
  maxSizeMB: number = 10
): boolean {
  if (!file) {
    throw new Error("No file provided for size validation");
  }

  if (maxSizeMB <= 0) {
    throw new Error("Maximum file size must be greater than 0");
  }

  const maxBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxBytes) {
    const actualSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File "${file.name}" is too large (${actualSizeMB}MB). Maximum allowed size is ${maxSizeMB}MB.`
    );
  }

  return true;
}

export function truncateContent(
  content: string,
  maxChars: number = 50000
): string {
  if (!content) {
    return "";
  }

  if (maxChars <= 0) {
    throw new Error("Maximum character limit must be greater than 0");
  }

  if (content.length > maxChars) {
    const truncated = content.substring(0, maxChars);
    const originalSizeKB = Math.round(content.length / 1000);
    const truncatedSizeKB = Math.round(maxChars / 1000);

    return (
      truncated +
      `\n\n[Content truncated from ${originalSizeKB}KB to ${truncatedSizeKB}KB to stay within processing limits]`
    );
  }

  return content;
}

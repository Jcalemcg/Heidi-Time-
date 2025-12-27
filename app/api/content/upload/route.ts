import { NextRequest, NextResponse } from "next/server";
import { storeContent } from "@/lib/contentStorage";
import { parseFile, validateFileSize, truncateContent } from "@/lib/fileParser";

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      return NextResponse.json(
        {
          error: `Failed to parse form data: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please select a file to upload." },
        { status: 400 }
      );
    }

    // Validate file is actually a File object
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Invalid file format in upload request" },
        { status: 400 }
      );
    }

    // Validate file size (now throws error if too large)
    try {
      validateFileSize(file);
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }
      );
    }

    // Parse file
    let content: string;
    let title: string;
    try {
      const parsed = await parseFile(file);
      content = parsed.content;
      title = parsed.title;
    } catch (error) {
      console.error("File parsing error:", error);
      return NextResponse.json(
        {
          error: `File parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
        { status: 400 }
      );
    }

    // Truncate if needed (to stay within API limits)
    const truncatedContent = truncateContent(content, 50000);

    // Store content
    let stored;
    try {
      stored = storeContent(title, truncatedContent, file.type);
    } catch (error) {
      console.error("Storage error:", error);
      return NextResponse.json(
        {
          error: `Failed to store content: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return NextResponse.json(
      {
        error: `Upload failed: ${error instanceof Error ? error.message : "An unexpected error occurred"}`,
      },
      { status: 500 }
    );
  }
}

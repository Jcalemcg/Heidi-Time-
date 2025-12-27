import { NextRequest, NextResponse } from "next/server";
import { storeContent } from "@/lib/contentStorage";
import { parseFile, validateFileSize, truncateContent } from "@/lib/fileParser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(file)) {
      return NextResponse.json(
        { error: "File is too large (max 10MB)" },
        { status: 400 }
      );
    }

    // Parse file
    const { content, title } = await parseFile(file);

    // Truncate if needed (to stay within API limits)
    const truncatedContent = truncateContent(content, 50000);

    // Store content
    const stored = storeContent(title, truncatedContent, file.type);

    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

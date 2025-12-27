import { NextResponse } from "next/server";
import { listContent } from "@/lib/contentStorage";

export async function GET() {
  try {
    const content = listContent();

    // Validate the result
    if (!Array.isArray(content)) {
      console.error("listContent did not return an array");
      return NextResponse.json(
        { error: "Internal error: Invalid content list format" },
        { status: 500 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      {
        error: `Failed to retrieve content list: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

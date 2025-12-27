import { NextResponse } from "next/server";
import { listContent } from "@/lib/contentStorage";

export async function GET() {
  try {
    const content = listContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { error: "Failed to list content" },
      { status: 500 }
    );
  }
}

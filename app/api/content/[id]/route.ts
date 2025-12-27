import { NextRequest, NextResponse } from "next/server";
import { getContent, deleteContent } from "@/lib/contentStorage";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const content = getContent(params.id);
    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error("Get error:", error);
    return NextResponse.json(
      { error: "Failed to get content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    deleteContent(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getContent, deleteContent } from "@/lib/contentStorage";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate params exist
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    // Validate ID format
    if (typeof params.id !== "string" || params.id.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid content ID format" },
        { status: 400 }
      );
    }

    const content = getContent(params.id);
    if (!content) {
      return NextResponse.json(
        {
          error: `Content not found with ID: ${params.id}. The content may have been deleted or never existed.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Get content error:", error);
    return NextResponse.json(
      {
        error: `Failed to retrieve content: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate params exist
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    // Validate ID format
    if (typeof params.id !== "string" || params.id.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid content ID format" },
        { status: 400 }
      );
    }

    // Check if content exists before deleting
    const content = getContent(params.id);
    if (!content) {
      return NextResponse.json(
        {
          error: `Content not found with ID: ${params.id}. It may have already been deleted.`,
        },
        { status: 404 }
      );
    }

    // Perform deletion
    const deleted = deleteContent(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete content. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Content "${content.title}" has been successfully deleted.`,
    });
  } catch (error) {
    console.error("Delete content error:", error);
    return NextResponse.json(
      {
        error: `Failed to delete content: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

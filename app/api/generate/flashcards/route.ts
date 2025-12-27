import { NextRequest, NextResponse } from "next/server";
import { getContent, getMaterials, storeMaterials } from "@/lib/contentStorage";
import { generateFlashcards } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid request body. Expected JSON with contentId and optional count fields.",
        },
        { status: 400 }
      );
    }

    const { contentId, count } = body;

    // Validate required fields
    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    // Validate field types
    if (typeof contentId !== "string") {
      return NextResponse.json(
        { error: "Content ID must be a string" },
        { status: 400 }
      );
    }

    // Validate count if provided
    if (count !== undefined && count !== null) {
      if (typeof count !== "number") {
        return NextResponse.json(
          { error: "Count must be a number" },
          { status: 400 }
        );
      }
      if (count < 1 || count > 20) {
        return NextResponse.json(
          { error: "Count must be between 1 and 20" },
          { status: 400 }
        );
      }
    }

    // Validate content exists
    const content = getContent(contentId);
    if (!content) {
      return NextResponse.json(
        {
          error: `Content not found with ID: ${contentId}. The content may have been deleted or never existed.`,
        },
        { status: 404 }
      );
    }

    // Generate flashcards using HuggingFace
    let flashcards;
    try {
      flashcards = await generateFlashcards(content.content, count || 5);
    } catch (error) {
      console.error("AI service error:", error);
      // Return user-friendly error message (the huggingface lib already provides good messages)
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to generate flashcards. Please try again.",
        },
        { status: 500 }
      );
    }

    // Update stored materials
    try {
      let materials = getMaterials(contentId);
      if (!materials) {
        materials = {
          contentId,
          questions: [],
          flashcards: [],
          summary: "",
        };
      }
      materials.flashcards = flashcards;
      storeMaterials(materials);
    } catch (error) {
      console.error("Storage error:", error);
      // Still return flashcards even if storage fails
      console.warn("Failed to store materials, but returning generated flashcards");
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Unexpected generation error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while generating flashcards. Please try again.",
      },
      { status: 500 }
    );
  }
}

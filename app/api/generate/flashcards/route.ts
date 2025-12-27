import { NextRequest, NextResponse } from "next/server";
import { getContent, getMaterials, storeMaterials } from "@/lib/contentStorage";
import { generateFlashcards } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    const { contentId, count } = await request.json();

    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID required" },
        { status: 400 }
      );
    }

    const content = getContent(contentId);
    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // Generate flashcards using HuggingFace
    const flashcards = await generateFlashcards(content.content, count || 5);

    // Update stored materials
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

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

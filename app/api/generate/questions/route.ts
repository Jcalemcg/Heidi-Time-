import { NextRequest, NextResponse } from "next/server";
import { getContent, storeMaterials } from "@/lib/contentStorage";
import { generateQuestions } from "@/lib/huggingface";

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

    // Generate questions using HuggingFace
    const questions = await generateQuestions(content.content, count || 5);

    // Store materials
    const materials = {
      contentId,
      questions,
      flashcards: [],
      summary: "",
    };
    storeMaterials(materials);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

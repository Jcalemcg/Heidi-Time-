import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/contentStorage";
import { answerQuestion } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid request body. Expected JSON with contentId and question fields.",
        },
        { status: 400 }
      );
    }

    const { contentId, question } = body;

    // Validate required fields
    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
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

    if (typeof question !== "string") {
      return NextResponse.json(
        { error: "Question must be a string" },
        { status: 400 }
      );
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

    // Get answer from HuggingFace
    let answer: string;
    try {
      answer = await answerQuestion(question, content.content);
    } catch (error) {
      console.error("AI service error:", error);
      // Return user-friendly error message (the huggingface lib already provides good messages)
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to generate answer. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      question,
      answer: answer.trim(),
      contentTitle: content.title,
    });
  } catch (error) {
    console.error("Unexpected chat error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing your question. Please try again.",
      },
      { status: 500 }
    );
  }
}

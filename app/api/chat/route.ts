import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/contentStorage";
import { answerQuestion } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    const { contentId, question } = await request.json();

    if (!contentId || !question) {
      return NextResponse.json(
        { error: "Content ID and question required" },
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

    // Get answer from HuggingFace
    const answer = await answerQuestion(question, content.content);

    return NextResponse.json({
      question,
      answer: answer.trim(),
      contentTitle: content.title,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

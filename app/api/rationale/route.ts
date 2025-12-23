import { NextRequest, NextResponse } from "next/server";
import CacheManager from "@/lib/cache";
import { generateRationale } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, selectedAnswer, correctAnswer } = body;

    if (!question || !selectedAnswer || !correctAnswer) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cache = new CacheManager();

    // Check cache first
    const cacheKey = `rationale_${Buffer.from(question).toString("base64").substring(0, 20)}`;
    let rationale = cache.get(cacheKey);

    if (!rationale) {
      // Generate new rationale
      rationale = await generateRationale(
        question,
        selectedAnswer,
        correctAnswer
      );

      // Cache for 30 days
      cache.set(cacheKey, rationale, 30 * 24 * 60);
    }

    cache.close();

    return NextResponse.json({ success: true, rationale });
  } catch (error) {
    console.error("Error generating rationale:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate rationale" },
      { status: 500 }
    );
  }
}

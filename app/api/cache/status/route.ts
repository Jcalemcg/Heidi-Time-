import { NextRequest, NextResponse } from "next/server";
import CacheManager from "@/lib/cache";
import * as fs from "fs";
import * as path from "path";

export async function GET(request: NextRequest) {
  try {
    const cache = new CacheManager();

    const courses = cache.getAllCourses();
    const flashcards = cache.getAllFlashcards();
    const allQuestions = (courses as any[]).flatMap((c) =>
      cache.getQuestionsByCourse(c.code)
    );

    // Get database file size
    const dbPath = path.join(process.cwd(), "data", "cache.db");
    let dbSize = 0;
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      dbSize = stats.size;
    }

    const status = {
      coursesCount: courses.length,
      flashcardsCount: flashcards.length,
      questionsCount: allQuestions.length,
      databaseSize: `${(dbSize / 1024).toFixed(2)} KB`,
      lastUpdated: new Date().toISOString(),
    };

    cache.close();

    return NextResponse.json({ success: true, ...status });
  } catch (error) {
    console.error("Error getting cache status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get cache status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cache = new CacheManager();
    cache.clear();
    cache.close();

    return NextResponse.json({
      success: true,
      message: "Cache cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear cache" },
      { status: 500 }
    );
  }
}

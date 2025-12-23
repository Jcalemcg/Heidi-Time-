import { NextRequest, NextResponse } from "next/server";
import CacheManager from "@/lib/cache";
import { generateFlashcards } from "@/lib/huggingface";

export async function GET(request: NextRequest) {
  try {
    const cache = new CacheManager();
    const courseCode = request.nextUrl.searchParams.get("courseCode");

    // Check cache first
    let flashcards: any;
    const cacheKey = "all_flashcards";

    if (courseCode) {
      const courseCacheKey = `flashcards_${courseCode}`;
      flashcards = cache.get(courseCacheKey);

      if (!flashcards) {
        flashcards = cache.getFlashcardsByCourse(courseCode);

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
          const course = cache.getCourse(courseCode) as any;
          if (!course) {
            cache.close();
            return NextResponse.json(
              { success: false, error: "Course not found" },
              { status: 404 }
            );
          }

          const mockContent = `${course.name}. Key concepts and definitions.`;

          // Generate flashcards via HF
          flashcards = await generateFlashcards(mockContent, courseCode);

          // Save to database
          for (const card of flashcards) {
            cache.saveFlashcard({
              ...card,
              courseCode,
            });
          }

          // Cache for 12 hours
          cache.set(courseCacheKey, flashcards, 12 * 60);
        }
      }
    } else {
      flashcards = cache.get(cacheKey);

      if (!flashcards) {
        flashcards = cache.getAllFlashcards();

        if (flashcards && flashcards.length > 0) {
          cache.set(cacheKey, flashcards, 24 * 60);
        }
      }
    }

    cache.close();

    return NextResponse.json({ success: true, flashcards: flashcards || [] });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseCode } = body;

    const cache = new CacheManager();

    const course = cache.getCourse(courseCode) as any;
    if (!course) {
      cache.close();
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    const mockContent = `${course.name}. Key concepts and definitions.`;

    const flashcards = await generateFlashcards(mockContent, courseCode);

    // Save to database
    for (const card of flashcards) {
      cache.saveFlashcard({
        ...card,
        courseCode,
      });
    }

    cache.delete(`flashcards_${courseCode}`);
    cache.delete("all_flashcards");

    cache.close();

    return NextResponse.json({ success: true, flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}

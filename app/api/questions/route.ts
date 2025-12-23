import { NextRequest, NextResponse } from "next/server";
import CacheManager from "@/lib/cache";
import { generateQuestions } from "@/lib/huggingface";

export async function GET(request: NextRequest) {
  try {
    const cache = new CacheManager();
    const courseCode = request.nextUrl.searchParams.get("courseCode");
    const domain = request.nextUrl.searchParams.get("domain");

    if (!courseCode) {
      return NextResponse.json(
        { success: false, error: "courseCode parameter required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `questions_${courseCode}_${domain || "all"}`;
    let questions: any = cache.get(cacheKey);

    if (!questions) {
      // Get from database
      questions = cache.getQuestionsByCourse(courseCode);

      // If not in database, generate new ones
      if (!Array.isArray(questions) || questions.length === 0) {
        const course = cache.getCourse(courseCode) as any;
        if (!course) {
          cache.close();
          return NextResponse.json(
            { success: false, error: "Course not found" },
            { status: 404 }
          );
        }

        const domains = [
          "Scientific Foundation",
          "Diagnosis & Treatment Planning",
        ];
        const selectedDomain = domain || domains[0];

        const mockContent = `${course.name}. Topics include diagnostic criteria, assessment methods, and clinical management.`;

        // Generate questions via HF
        questions = await generateQuestions(
          mockContent,
          courseCode,
          selectedDomain
        );

        // Save to cache
        for (const q of questions) {
          cache.saveQuestion({
            ...q,
            courseCode,
          });
        }

        // Cache in memory for 12 hours
        cache.set(cacheKey, questions, 12 * 60);
      } else if (domain) {
        // Filter by domain if specified
        questions = questions.filter((q: any) => q.domain === domain);
      }
    }

    cache.close();

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseCode } = body;

    const cache = new CacheManager();

    // Force regenerate
    const course = cache.getCourse(courseCode) as any;
    if (!course) {
      cache.close();
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    const mockContent = `${course.name}. Topics include diagnostic criteria, assessment methods, and clinical management.`;

    const questions = await generateQuestions(
      mockContent,
      courseCode,
      "Diagnosis & Treatment Planning"
    );

    // Save to database
    for (const q of questions) {
      cache.saveQuestion({
        ...q,
        courseCode,
      });
    }

    // Invalidate cache
    cache.delete(`questions_${courseCode}_all`);

    cache.close();

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}

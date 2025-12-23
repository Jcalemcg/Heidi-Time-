import { NextRequest, NextResponse } from "next/server";
import CacheManager from "@/lib/cache";

export async function GET(request: NextRequest) {
  try {
    const cache = new CacheManager();

    // Try to get from cache first
    let courses: any = cache.get("all_courses");

    if (!courses) {
      // Get from database
      courses = cache.getAllCourses();

      // If empty, seed with default data
      if (!Array.isArray(courses) || courses.length === 0) {
        const defaultCourses = [
          {
            code: "NR501",
            name: "Theoretical Foundations for Nursing",
            credits: 3,
            clinicalHours: 0,
          },
          {
            code: "NR503",
            name: "Pathophysiology for Advanced Practice",
            credits: 3,
            clinicalHours: 0,
          },
          {
            code: "NR505",
            name: "Pharmacology for Advanced Practice",
            credits: 4,
            clinicalHours: 0,
          },
          {
            code: "NR507",
            name: "Healthcare Policy & Systems",
            credits: 3,
            clinicalHours: 0,
          },
          {
            code: "NR601",
            name: "Assessment & Management of Psychiatric Disorders I",
            credits: 5,
            clinicalHours: 200,
          },
          {
            code: "NR602",
            name: "Assessment & Management of Psychiatric Disorders II",
            credits: 5,
            clinicalHours: 200,
          },
          {
            code: "NR651",
            name: "Advanced Pharmacology for Psychiatric Disorders",
            credits: 4,
            clinicalHours: 0,
          },
          {
            code: "NR667",
            name: "Psychiatric Mental Health Nursing Practicum I",
            credits: 4,
            clinicalHours: 300,
          },
          {
            code: "NR668",
            name: "Psychiatric Mental Health Nursing Practicum II",
            credits: 4,
            clinicalHours: 300,
          },
        ];

        for (const course of defaultCourses) {
          cache.saveCourse(
            course.code,
            course.name,
            course.credits,
            course.clinicalHours,
            `Default description for ${course.name}`
          );
        }

        courses = defaultCourses;
      }

      // Cache for 24 hours
      cache.set("all_courses", courses, 24 * 60);
    }

    cache.close();

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

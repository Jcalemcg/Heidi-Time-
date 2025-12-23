import { NextRequest, NextResponse } from "next/server";
import CacheManager from "@/lib/cache";
import { scrapeChamberlainsyllabi } from "@/lib/scraper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    const cache = new CacheManager();

    // Check cache to prevent re-scraping
    const cacheKey = `scrape_${url}`;
    let cached = cache.get(cacheKey);

    if (cached) {
      cache.close();
      return NextResponse.json({
        success: true,
        message: "Using cached result",
        cached: true,
        content: cached,
      });
    }

    // Trigger scraping
    const results = await scrapeChamberlainsyllabi();

    if (results.length > 0) {
      for (const result of results) {
        cache.recordScrape(result.url, "success", result.content);
        cache.set(`scrape_${result.url}`, result, 24 * 60); // 24 hour TTL
      }
    }

    cache.close();

    return NextResponse.json({
      success: true,
      message: "Scraping completed",
      results,
    });
  } catch (error) {
    console.error("Error during scraping:", error);
    const cache = new CacheManager();
    if (error instanceof Error) {
      cache.recordScrape(
        request.nextUrl.searchParams.get("url") || "unknown",
        "error",
        error.message
      );
    }
    cache.close();

    return NextResponse.json(
      { success: false, error: "Scraping failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cache = new CacheManager();

    // Return scraping instructions
    const status = {
      message: "POST to this endpoint with { url: 'target-url' } to trigger scraping",
      supportedUrls: [
        "https://www.chamberlain.edu",
        "https://www.ancc.org",
      ],
    };

    cache.close();

    return NextResponse.json({ success: true, ...status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get scraping status" },
      { status: 500 }
    );
  }
}

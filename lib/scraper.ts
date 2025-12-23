import * as cheerio from "cheerio";
import axios from "axios";

export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  description?: string;
  scrapedAt: Date;
}

// Chamberlain PMHNP course information (public data)
export const CHAMBERLAIN_COURSES = [
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

// ANCC domains with weights
export const ANCC_DOMAINS = [
  { domain: "Scientific Foundation", weight: 20 },
  { domain: "Diagnosis & Treatment Planning", weight: 35 },
  { domain: "Implementation & Evaluation", weight: 30 },
  { domain: "Competency in Specialty Practice", weight: 15 },
];

async function scrapeUrl(url: string): Promise<ScrapedContent | null> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Extract title
    const title =
      $("h1").first().text() ||
      $("title").text() ||
      "Unknown Title";

    // Extract main content
    const content = $("article, .content, main")
      .text()
      .substring(0, 5000);

    // Extract meta description
    const description = $('meta[name="description"]').attr("content") || "";

    return {
      url,
      title,
      content,
      description,
      scrapedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

async function scrapeChamberlainsyllabi(): Promise<ScrapedContent[]> {
  const urls = [
    "https://www.chamberlain.edu/programs/masters/psychiatric-mental-health-nurse-practitioner",
    "https://www.ancc.org/certifications/specialty-certification-options/psychiatric-mental-health-nurse-practitioner-pmhnp",
  ];

  const results: ScrapedContent[] = [];

  for (const url of urls) {
    const content = await scrapeUrl(url);
    if (content) {
      results.push(content);
    }
  }

  return results;
}

// Generate mock course syllabus (since real syllabi are usually behind login)
export function generateMockSyllabus(courseCode: string, courseName: string): string {
  return `
Course Code: ${courseCode}
Course Title: ${courseName}

Learning Objectives:
- Understand and apply theoretical concepts
- Develop clinical assessment skills
- Evaluate evidence-based interventions
- Synthesize knowledge in practice

Course Description:
This course provides foundational or advanced knowledge in ${courseName.toLowerCase()}.
Students will engage in evidence-based learning activities and clinical practice to develop
competency in psychiatric mental health nursing.

Key Topics:
- Diagnostic criteria and classification
- Pharmacological interventions
- Psychotherapeutic approaches
- Clinical assessment and management
- Evidence-based practice guidelines

Assessment Methods:
- Exams (30%)
- Quizzes (20%)
- Case studies (25%)
- Clinical practicum (25%)

Resources:
- DSM-5-TR
- Psychiatric Mental Health Nursing textbook
- ANCC certification study guides
- Primary research articles
`;
}

export { scrapeUrl, scrapeChamberlainsyllabi };

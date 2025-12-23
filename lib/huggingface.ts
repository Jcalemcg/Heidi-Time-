import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);
const MODEL = process.env.HF_MODEL || "mistral-7b-instruct-v0.1";

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  domain: string;
  rationale?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

async function generateQuestions(
  courseContent: string,
  courseCode: string,
  domain: string
): Promise<GeneratedQuestion[]> {
  const prompt = `You are a Chamberlain University PMHNP educator. Generate 3 ANCC certification-style multiple choice questions for the following course content.

Course Code: ${courseCode}
Domain: ${domain}
Content: ${courseContent}

Format your response as JSON array with this structure:
[
  {
    "question": "The question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "rationale": "Explanation of why this answer is correct..."
  }
]

Ensure questions are clinically relevant and test knowledge application, not just recall.`;

  try {
    const response = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9,
      },
    });

    const generatedText =
      typeof response === "string" ? response : response.generated_text;
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      console.error("No JSON found in response:", generatedText);
      return [];
    }

    const questions = JSON.parse(jsonMatch[0]);
    return questions.map((q: any, idx: number) => ({
      id: `q-${courseCode}-${idx}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      domain,
      rationale: q.rationale,
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

async function generateFlashcards(
  courseContent: string,
  courseCode: string
): Promise<Flashcard[]> {
  const prompt = `You are a Chamberlain University PMHNP educator. Generate 5 high-yield flashcards for the following course content.

Course Code: ${courseCode}
Content: ${courseContent}

Format your response as JSON array with this structure:
[
  {
    "front": "Question or term",
    "back": "Answer or definition"
  }
]

Focus on clinically relevant concepts, diagnostic criteria, and drug mechanisms.`;

  try {
    const response = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
      },
    });

    const generatedText =
      typeof response === "string" ? response : response.generated_text;
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      console.error("No JSON found in response:", generatedText);
      return [];
    }

    const flashcards = JSON.parse(jsonMatch[0]);
    return flashcards.map((card: any, idx: number) => ({
      id: `fc-${courseCode}-${idx}`,
      front: card.front,
      back: card.back,
      category: courseCode,
    }));
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return [];
  }
}

async function generateRationale(
  question: string,
  selectedAnswer: string,
  correctAnswer: string
): Promise<string> {
  const prompt = `As a Chamberlain PMHNP educator, explain why the answer is correct or incorrect.

Question: ${question}
Selected Answer: ${selectedAnswer}
Correct Answer: ${correctAnswer}

Provide a brief clinical rationale (2-3 sentences) for the correct answer.`;

  try {
    const response = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.5,
      },
    });

    return typeof response === "string"
      ? response
      : response.generated_text || "";
  } catch (error) {
    console.error("Error generating rationale:", error);
    return "Unable to generate rationale at this time.";
  }
}

async function summarizeContent(text: string): Promise<string> {
  const prompt = `Summarize the following content in 3-4 key points for a PMHNP student:

${text}`;

  try {
    const response = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.5,
      },
    });

    return typeof response === "string"
      ? response
      : response.generated_text || "";
  } catch (error) {
    console.error("Error summarizing content:", error);
    return text.substring(0, 200);
  }
}

export {
  generateQuestions,
  generateFlashcards,
  generateRationale,
  summarizeContent,
};

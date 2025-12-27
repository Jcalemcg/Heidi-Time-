import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface GeneratedFlashcard {
  question: string;
  answer: string;
}

/**
 * Generate multiple-choice questions from content
 */
export async function generateQuestions(
  content: string,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  const prompt = `Based on the following content, generate ${count} multiple-choice questions with explanations.

Content:
${content}

Return ONLY valid JSON array with no markdown formatting. Each question should have:
- question: string
- options: array of 4 strings
- correctAnswer: number (0-3 index of correct option)
- explanation: string explaining the correct answer

Example format:
[{"question":"What is...?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]

JSON:`;

  try {
    const response = await hf.textGeneration({
      model: "mistral-7b-instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
      },
    });

    // Extract JSON from response
    const text =
      typeof response === "string" ? response : response.generated_text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");

    const questions = JSON.parse(jsonMatch[0]) as GeneratedQuestion[];
    return questions.slice(0, count);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

/**
 * Generate flashcards from content
 */
export async function generateFlashcards(
  content: string,
  count: number = 5
): Promise<GeneratedFlashcard[]> {
  const prompt = `Based on the following content, generate ${count} study flashcards. Each flashcard should have a question/prompt on one side and answer on the other.

Content:
${content}

Return ONLY valid JSON array. Each flashcard should have:
- question: string (the prompt/question)
- answer: string (the answer/explanation)

Example:
[{"question":"What is X?","answer":"X is..."}]

JSON:`;

  try {
    const response = await hf.textGeneration({
      model: "mistral-7b-instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1500,
        temperature: 0.7,
      },
    });

    const text =
      typeof response === "string" ? response : response.generated_text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");

    const flashcards = JSON.parse(jsonMatch[0]) as GeneratedFlashcard[];
    return flashcards.slice(0, count);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
}

/**
 * Answer a question based on provided content
 */
export async function answerQuestion(
  question: string,
  content: string
): Promise<string> {
  const prompt = `You are a helpful study assistant. Using ONLY the following content, answer the user's question accurately and clearly. If the answer cannot be found in the content, say "I cannot find the answer to this question in the provided material."

Content:
${content}

User Question: ${question}

Answer:`;

  try {
    const response = await hf.textGeneration({
      model: "mistral-7b-instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.5,
      },
    });

    return typeof response === "string" ? response : response.generated_text;
  } catch (error) {
    console.error("Error answering question:", error);
    throw error;
  }
}

/**
 * Summarize content
 */
export async function summarizeContent(content: string): Promise<string> {
  const prompt = `Summarize the following content in 3-5 key points:

Content:
${content}

Summary:`;

  try {
    const response = await hf.textGeneration({
      model: "mistral-7b-instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.5,
      },
    });

    return typeof response === "string" ? response : response.generated_text;
  } catch (error) {
    console.error("Error summarizing content:", error);
    throw error;
  }
}

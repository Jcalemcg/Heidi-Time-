import { HfInference } from "@huggingface/inference";

// Helper function to validate and get API key
function getHfClient(): HfInference {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error(
      "HUGGINGFACE_API_KEY environment variable is not set. Please add it to your .env.local file."
    );
  }
  return new HfInference(process.env.HUGGINGFACE_API_KEY);
}

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
    // Validate inputs
    if (!content || content.trim().length === 0) {
      throw new Error("Content cannot be empty");
    }
    if (count < 1 || count > 20) {
      throw new Error("Question count must be between 1 and 20");
    }

    const hf = getHfClient();
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

    if (!text || text.trim().length === 0) {
      throw new Error("AI model returned an empty response. Please try again.");
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error(
        "AI model response was not in the expected format. The model may be overloaded. Please try again."
      );
    }

    let questions: GeneratedQuestion[];
    try {
      questions = JSON.parse(jsonMatch[0]) as GeneratedQuestion[];
    } catch (parseError) {
      throw new Error(
        "Failed to parse AI model response. The response format was invalid. Please try again."
      );
    }

    // Validate question structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error(
        "AI model did not generate any valid questions. Please try again with different content."
      );
    }

    // Validate each question has required fields
    const validQuestions = questions.filter(
      (q) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === "number" &&
        q.correctAnswer >= 0 &&
        q.correctAnswer < 4 &&
        q.explanation
    );

    if (validQuestions.length === 0) {
      throw new Error(
        "AI model generated invalid question format. Please try again."
      );
    }

    return validQuestions.slice(0, count);
  } catch (error) {
    console.error("Error generating questions:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for network/API errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        throw new Error(
          "Network error: Unable to connect to AI service. Please check your internet connection and try again."
        );
      }
      // Check for rate limiting
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        throw new Error(
          "Rate limit exceeded: Too many requests to AI service. Please wait a moment and try again."
        );
      }
      // Check for authentication errors
      if (error.message.includes("401") || error.message.includes("403") || error.message.includes("API key")) {
        throw new Error(
          "Authentication error: Invalid or missing API key. Please check your HUGGINGFACE_API_KEY configuration."
        );
      }
      // Re-throw our custom errors
      if (error.message.includes("cannot be empty") ||
          error.message.includes("must be between") ||
          error.message.includes("AI model")) {
        throw error;
      }
    }

    // Generic fallback
    throw new Error(
      `Failed to generate questions: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`
    );
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
    // Validate inputs
    if (!content || content.trim().length === 0) {
      throw new Error("Content cannot be empty");
    }
    if (count < 1 || count > 20) {
      throw new Error("Flashcard count must be between 1 and 20");
    }

    const hf = getHfClient();
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

    if (!text || text.trim().length === 0) {
      throw new Error("AI model returned an empty response. Please try again.");
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error(
        "AI model response was not in the expected format. The model may be overloaded. Please try again."
      );
    }

    let flashcards: GeneratedFlashcard[];
    try {
      flashcards = JSON.parse(jsonMatch[0]) as GeneratedFlashcard[];
    } catch (parseError) {
      throw new Error(
        "Failed to parse AI model response. The response format was invalid. Please try again."
      );
    }

    // Validate flashcard structure
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error(
        "AI model did not generate any valid flashcards. Please try again with different content."
      );
    }

    // Validate each flashcard has required fields
    const validFlashcards = flashcards.filter(
      (f) =>
        f.question &&
        typeof f.question === "string" &&
        f.question.trim().length > 0 &&
        f.answer &&
        typeof f.answer === "string" &&
        f.answer.trim().length > 0
    );

    if (validFlashcards.length === 0) {
      throw new Error(
        "AI model generated invalid flashcard format. Please try again."
      );
    }

    return validFlashcards.slice(0, count);
  } catch (error) {
    console.error("Error generating flashcards:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for network/API errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        throw new Error(
          "Network error: Unable to connect to AI service. Please check your internet connection and try again."
        );
      }
      // Check for rate limiting
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        throw new Error(
          "Rate limit exceeded: Too many requests to AI service. Please wait a moment and try again."
        );
      }
      // Check for authentication errors
      if (error.message.includes("401") || error.message.includes("403") || error.message.includes("API key")) {
        throw new Error(
          "Authentication error: Invalid or missing API key. Please check your HUGGINGFACE_API_KEY configuration."
        );
      }
      // Re-throw our custom errors
      if (error.message.includes("cannot be empty") ||
          error.message.includes("must be between") ||
          error.message.includes("AI model")) {
        throw error;
      }
    }

    // Generic fallback
    throw new Error(
      `Failed to generate flashcards: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`
    );
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
    // Validate inputs
    if (!question || question.trim().length === 0) {
      throw new Error("Question cannot be empty");
    }
    if (!content || content.trim().length === 0) {
      throw new Error("Content cannot be empty");
    }
    if (question.length > 500) {
      throw new Error("Question is too long (max 500 characters)");
    }

    const hf = getHfClient();
    const response = await hf.textGeneration({
      model: "mistral-7b-instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.5,
      },
    });

    const answer = typeof response === "string" ? response : response.generated_text;

    if (!answer || answer.trim().length === 0) {
      throw new Error("AI model returned an empty response. Please try again.");
    }

    return answer.trim();
  } catch (error) {
    console.error("Error answering question:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for network/API errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        throw new Error(
          "Network error: Unable to connect to AI service. Please check your internet connection and try again."
        );
      }
      // Check for rate limiting
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        throw new Error(
          "Rate limit exceeded: Too many requests to AI service. Please wait a moment and try again."
        );
      }
      // Check for authentication errors
      if (error.message.includes("401") || error.message.includes("403") || error.message.includes("API key")) {
        throw new Error(
          "Authentication error: Invalid or missing API key. Please check your HUGGINGFACE_API_KEY configuration."
        );
      }
      // Re-throw our custom errors
      if (error.message.includes("cannot be empty") ||
          error.message.includes("too long") ||
          error.message.includes("AI model")) {
        throw error;
      }
    }

    // Generic fallback
    throw new Error(
      `Failed to answer question: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`
    );
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
    // Validate inputs
    if (!content || content.trim().length === 0) {
      throw new Error("Content cannot be empty");
    }

    const hf = getHfClient();
    const response = await hf.textGeneration({
      model: "mistral-7b-instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.5,
      },
    });

    const summary = typeof response === "string" ? response : response.generated_text;

    if (!summary || summary.trim().length === 0) {
      throw new Error("AI model returned an empty response. Please try again.");
    }

    return summary.trim();
  } catch (error) {
    console.error("Error summarizing content:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for network/API errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        throw new Error(
          "Network error: Unable to connect to AI service. Please check your internet connection and try again."
        );
      }
      // Check for rate limiting
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        throw new Error(
          "Rate limit exceeded: Too many requests to AI service. Please wait a moment and try again."
        );
      }
      // Check for authentication errors
      if (error.message.includes("401") || error.message.includes("403") || error.message.includes("API key")) {
        throw new Error(
          "Authentication error: Invalid or missing API key. Please check your HUGGINGFACE_API_KEY configuration."
        );
      }
      // Re-throw our custom errors
      if (error.message.includes("cannot be empty") || error.message.includes("AI model")) {
        throw error;
      }
    }

    // Generic fallback
    throw new Error(
      `Failed to summarize content: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`
    );
  }
}

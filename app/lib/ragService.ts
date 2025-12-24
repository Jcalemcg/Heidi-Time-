import { HfInference } from '@huggingface/inference'
import { getDatabase } from './db'
import { generateEmbedding, findMostSimilarChunks } from './embeddings'

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN)

export interface GeneratedQuestion {
  question: string
  answers: string[]
  correctAnswer: string
  correctAnswerIndex: number
  explanation: string
  sourceChunkId: number
  sourceText: string
  topic?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export async function generateQuestionsFromMaterial(
  materialId: number,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  const db = getDatabase()

  // Get all chunks for this material with their embeddings
  const chunks = db.prepare(`
    SELECT id, content, embedding
    FROM chunks
    WHERE materialId = ?
    ORDER BY chunkIndex ASC
  `).all(materialId) as any[]

  if (chunks.length === 0) {
    throw new Error('No chunks found for material')
  }

  // Decode embeddings from blob
  const chunksWithDecodedEmbeddings = chunks
    .filter((chunk) => chunk.embedding !== null)
    .map((chunk) => ({
      chunkId: chunk.id,
      content: chunk.content,
      embedding: Array.from(new Float32Array(chunk.embedding)),
    }))

  if (chunksWithDecodedEmbeddings.length === 0) {
    // Fallback: use all chunks even without embeddings
    return generateQuestionsFromChunksBasic(chunks.slice(0, count))
  }

  const questions: GeneratedQuestion[] = []

  // Select a diverse set of chunks (spread across the document)
  const selectedChunks = selectDiverseChunks(chunksWithDecodedEmbeddings, Math.min(count, chunksWithDecodedEmbeddings.length))

  for (const chunk of selectedChunks) {
    try {
      const question = await generateQuestionFromChunk(chunk.content, chunk.chunkId)
      questions.push(question)
    } catch (error) {
      console.error('Error generating question from chunk:', error)
      // Continue with other chunks if one fails
    }
  }

  return questions
}

async function generateQuestionFromChunk(
  chunkText: string,
  chunkId: number
): Promise<GeneratedQuestion> {
  // Prepare the prompt for question generation
  const systemPrompt = `You are an expert medical educator creating accurate study questions for Psychiatric Mental Health Nursing (PMHNP) professionals.

Your task is to generate a high-quality multiple choice question based ONLY on the provided material.

CRITICAL RULES:
1. The question MUST be answerable from the provided text
2. All answer options must be plausible but only ONE is correct
3. The correct answer MUST be directly supported by the text
4. Provide a detailed explanation that cites the source material
5. Return ONLY valid JSON, no other text

Return JSON in this exact format:
{
  "question": "The question text here?",
  "answers": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": 0,
  "explanation": "Why this is correct based on the material...",
  "topic": "Main topic covered"
}

Base your question on this material:`

  const userPrompt = `${systemPrompt}\n\n${chunkText}`

  try {
    // Use Hugging Face text generation (Mistral or similar for reliability)
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: userPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3, // Lower temperature for consistency
        top_p: 0.9,
      },
    })

    // Extract the generated text
    const generatedText = response.generated_text
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Validate the response
    if (
      !parsed.question ||
      !Array.isArray(parsed.answers) ||
      parsed.answers.length < 2 ||
      parsed.correctAnswerIndex === undefined ||
      !parsed.explanation
    ) {
      throw new Error('Invalid response format')
    }

    return {
      question: parsed.question,
      answers: parsed.answers,
      correctAnswer: parsed.answers[parsed.correctAnswerIndex],
      correctAnswerIndex: parsed.correctAnswerIndex,
      explanation: parsed.explanation,
      sourceChunkId: chunkId,
      sourceText: chunkText.substring(0, 500), // Store first 500 chars as source
      topic: parsed.topic,
      difficulty: 'medium', // Can be enhanced with more sophisticated analysis
    }
  } catch (error) {
    console.error('Error in text generation:', error)
    // Fallback to template-based generation if LLM fails
    return generateQuestionTemplate(chunkText, chunkId)
  }
}

function generateQuestionTemplate(chunkText: string, chunkId: number): GeneratedQuestion {
  // Extract first sentence or key statement
  const sentences = chunkText.split(/[.!?]/).filter((s) => s.trim().length > 20)

  if (sentences.length === 0) {
    return {
      question: 'Based on the provided material, what is the main concept discussed?',
      answers: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correctAnswer: 'Concept A',
      correctAnswerIndex: 0,
      explanation: chunkText.substring(0, 300),
      sourceChunkId: chunkId,
      sourceText: chunkText.substring(0, 500),
      difficulty: 'medium',
    }
  }

  const keyStatement = sentences[0].trim()

  return {
    question: `Which of the following best describes: "${keyStatement.substring(0, 100)}..."?`,
    answers: [
      `${keyStatement.substring(0, 50)}...`,
      'An alternative perspective on the topic',
      'A different but related concept',
      'A contrasting viewpoint',
    ],
    correctAnswer: `${keyStatement.substring(0, 50)}...`,
    correctAnswerIndex: 0,
    explanation: `According to the material: ${keyStatement}`,
    sourceChunkId: chunkId,
    sourceText: chunkText.substring(0, 500),
    difficulty: 'medium',
  }
}

function generateQuestionsFromChunksBasic(chunks: any[]): GeneratedQuestion[] {
  return chunks.map((chunk, index) => {
    const text = chunk.content || chunk
    const firstSentence = text.split(/[.!?]/)[0]

    return {
      question: `Based on the material, what is the significance of: "${firstSentence.substring(0, 100)}"?`,
      answers: [
        'It represents the primary concept',
        'It is a secondary consideration',
        'It is not important',
        'It contradicts the main point',
      ],
      correctAnswer: 'It represents the primary concept',
      correctAnswerIndex: 0,
      explanation: firstSentence,
      sourceChunkId: chunk.id || index,
      sourceText: text.substring(0, 500),
      difficulty: 'medium',
    }
  })
}

function selectDiverseChunks(
  chunks: { chunkId: number; content: string; embedding: number[] }[],
  count: number
) {
  if (chunks.length <= count) {
    return chunks
  }

  const selected = []
  const step = Math.floor(chunks.length / count)

  for (let i = 0; i < count; i++) {
    const index = Math.min(i * step, chunks.length - 1)
    selected.push(chunks[index])
  }

  return selected
}

export async function validateAnswerAgainstMaterial(
  materialId: number,
  question: string,
  answer: string
): Promise<{ isValid: boolean; confidence: number; sources: string[] }> {
  const db = getDatabase()

  // Get all chunks for this material
  const chunks = db.prepare(`
    SELECT id, content, embedding
    FROM chunks
    WHERE materialId = ?
  `).all(materialId) as any[]

  if (chunks.length === 0) {
    return { isValid: false, confidence: 0, sources: [] }
  }

  // Get embedding for the question + answer combination
  const queryText = `${question} ${answer}`

  try {
    const queryEmbedding = await generateEmbedding(queryText)

    // Decode chunk embeddings and find similar ones
    const chunksWithEmbeddings = chunks
      .filter((c) => c.embedding !== null)
      .map((c) => ({
        chunkId: c.id,
        content: c.content,
        embedding: Array.from(new Float32Array(c.embedding)),
      }))

    if (chunksWithEmbeddings.length === 0) {
      // Fall back to keyword matching
      return validateAnswerKeywordMatch(answer, chunks)
    }

    const similarChunks = findMostSimilarChunks(queryEmbedding, chunksWithEmbeddings, 3)

    // Check if any of the similar chunks contain the answer (semantic validation)
    const validSources: string[] = []
    let totalSimilarity = 0

    for (const chunk of similarChunks) {
      if (chunk.similarity > 0.5) {
        // Threshold for relevance
        validSources.push(chunk.content.substring(0, 200))
        totalSimilarity += chunk.similarity
      }
    }

    const confidence = validSources.length > 0 ? Math.min(totalSimilarity / similarChunks.length, 1) : 0

    return {
      isValid: confidence > 0.6,
      confidence,
      sources: validSources,
    }
  } catch (error) {
    console.error('Error validating answer:', error)
    return validateAnswerKeywordMatch(answer, chunks)
  }
}

function validateAnswerKeywordMatch(
  answer: string,
  chunks: any[]
): { isValid: boolean; confidence: number; sources: string[] } {
  const answerWords = answer.toLowerCase().split(/\s+/).filter((w) => w.length > 3)

  const sources: string[] = []
  let matchCount = 0

  for (const chunk of chunks) {
    const chunkText = (chunk.content || chunk).toLowerCase()
    const wordMatches = answerWords.filter((word) => chunkText.includes(word)).length

    if (wordMatches > 0) {
      sources.push((chunk.content || chunk).substring(0, 200))
      matchCount += wordMatches
    }
  }

  const confidence = Math.min(matchCount / answerWords.length, 1)

  return {
    isValid: confidence > 0.5,
    confidence,
    sources: sources.slice(0, 3),
  }
}

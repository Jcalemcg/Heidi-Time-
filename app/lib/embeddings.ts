import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN)

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    })

    // Ensure it's a flat array of numbers
    if (Array.isArray(response)) {
      if (typeof response[0] === 'number') {
        return response as number[]
      }
      // If it's a nested array, flatten it
      return (response as any).flat()
    }

    throw new Error('Unexpected embedding format')
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function findMostSimilarChunks(
  queryEmbedding: number[],
  chunkEmbeddings: { embedding: number[]; chunkId: number; content: string }[],
  topK: number = 3
): { chunkId: number; content: string; similarity: number }[] {
  const similarities = chunkEmbeddings.map((chunk) => ({
    chunkId: chunk.chunkId,
    content: chunk.content,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
  }))

  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, topK)
}

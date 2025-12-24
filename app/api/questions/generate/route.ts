import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/app/lib/db'
import { generateQuestionsFromMaterial } from '@/app/lib/ragService'

export async function POST(request: NextRequest) {
  try {
    const { materialId, count = 5 } = await request.json()

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 })
    }

    const db = getDatabase()

    // Verify material exists
    const material = db.prepare('SELECT id, title, status FROM materials WHERE id = ?').get(materialId) as any

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    if (material.status !== 'ready') {
      return NextResponse.json(
        { error: 'Material is still processing. Please try again in a moment.' },
        { status: 400 }
      )
    }

    // Generate questions
    const questions = await generateQuestionsFromMaterial(materialId, Math.min(count, 10))

    // Save questions to database
    const insertQuestion = db.prepare(`
      INSERT INTO questions (materialId, chunkId, question, answers, correctAnswer, explanation, sourceText, topic, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const savedQuestions = []

    for (const question of questions) {
      const result = insertQuestion.run(
        materialId,
        question.sourceChunkId,
        question.question,
        JSON.stringify(question.answers),
        question.correctAnswer,
        question.explanation,
        question.sourceText,
        question.topic || 'General',
        question.difficulty
      )

      savedQuestions.push({
        id: result.lastInsertRowid,
        ...question,
      })
    }

    return NextResponse.json({
      success: true,
      count: savedQuestions.length,
      questions: savedQuestions,
    })
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate questions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

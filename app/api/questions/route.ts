import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('materialId')
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 })
    }

    const db = getDatabase()

    const questions = db.prepare(`
      SELECT
        id,
        question,
        answers,
        correctAnswer,
        explanation,
        sourceText,
        topic,
        difficulty
      FROM questions
      WHERE materialId = ?
      ORDER BY RANDOM()
      LIMIT ?
    `).all(materialId, limit) as any[]

    // Parse answers JSON
    const parsedQuestions = questions.map((q) => ({
      ...q,
      answers: JSON.parse(q.answers),
    }))

    return NextResponse.json({
      success: true,
      count: parsedQuestions.length,
      questions: parsedQuestions,
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

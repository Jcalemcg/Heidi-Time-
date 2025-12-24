import { NextRequest, NextResponse } from 'next/server'
import { validateAnswerAgainstMaterial } from '@/app/lib/ragService'

export async function POST(request: NextRequest) {
  try {
    const { materialId, question, answer, correctAnswer } = await request.json()

    if (!materialId || !question || !answer) {
      return NextResponse.json(
        { error: 'Material ID, question, and answer are required' },
        { status: 400 }
      )
    }

    // Check if answer matches the correct answer exactly (primary validation)
    const isCorrect = answer === correctAnswer

    // Get semantic validation against material
    const validation = await validateAnswerAgainstMaterial(materialId, question, answer)

    return NextResponse.json({
      success: true,
      isCorrect,
      validation,
      feedback: {
        correct: isCorrect,
        grounded: validation.isValid,
        groundingConfidence: validation.confidence,
        sources: validation.sources,
      },
    })
  } catch (error) {
    console.error('Error validating answer:', error)
    return NextResponse.json(
      {
        error: 'Failed to validate answer',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

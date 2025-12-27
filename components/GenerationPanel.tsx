'use client'

import { useState } from 'react'
import { Loader, Wand2 } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Flashcard {
  question: string
  answer: string
}

interface GenerationPanelProps {
  contentId: string
  onQuestionsGenerated?: (questions: Question[]) => void
  onFlashcardsGenerated?: (flashcards: Flashcard[]) => void
}

export function GenerationPanel({
  contentId,
  onQuestionsGenerated,
  onFlashcardsGenerated,
}: GenerationPanelProps) {
  const [questionCount, setQuestionCount] = useState(5)
  const [flashcardCount, setFlashcardCount] = useState(5)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([])

  const generateQuestions = async () => {
    setIsGeneratingQuestions(true)
    setError(null)

    try {
      const response = await fetch('/api/generate/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, count: questionCount }),
      })

      if (!response.ok) throw new Error('Failed to generate questions')

      const data = await response.json()
      setGeneratedQuestions(data.questions)
      onQuestionsGenerated?.(data.questions)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const generateFlashcards = async () => {
    setIsGeneratingFlashcards(true)
    setError(null)

    try {
      const response = await fetch('/api/generate/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, count: flashcardCount }),
      })

      if (!response.ok) throw new Error('Failed to generate flashcards')

      const data = await response.json()
      setGeneratedFlashcards(data.flashcards)
      onFlashcardsGenerated?.(data.flashcards)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsGeneratingFlashcards(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Questions Generation */}
      <Card animate="fade-in">
        <h3 className="text-xl font-bold mb-4">Generate Quiz Questions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Number of Questions: {questionCount}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              disabled={isGeneratingQuestions}
              className="w-full"
            />
          </div>

          <Button
            onClick={generateQuestions}
            disabled={isGeneratingQuestions}
            fullWidth
            icon={
              isGeneratingQuestions ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )
            }
          >
            {isGeneratingQuestions ? 'Generating...' : 'Generate Questions'}
          </Button>

          {generatedQuestions.length > 0 && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                Generated {generatedQuestions.length} questions ✓
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Flashcards Generation */}
      <Card animate="fade-in">
        <h3 className="text-xl font-bold mb-4">Generate Flashcards</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Number of Flashcards: {flashcardCount}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={flashcardCount}
              onChange={(e) => setFlashcardCount(parseInt(e.target.value))}
              disabled={isGeneratingFlashcards}
              className="w-full"
            />
          </div>

          <Button
            onClick={generateFlashcards}
            disabled={isGeneratingFlashcards}
            fullWidth
            icon={
              isGeneratingFlashcards ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )
            }
          >
            {isGeneratingFlashcards ? 'Generating...' : 'Generate Flashcards'}
          </Button>

          {generatedFlashcards.length > 0 && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                Generated {generatedFlashcards.length} flashcards ✓
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

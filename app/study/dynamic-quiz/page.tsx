'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, BookOpen, AlertCircle, Zap } from 'lucide-react'
import MaterialSelector from '@/app/components/MaterialSelector'

interface Question {
  id: number
  question: string
  answers: string[]
  correctAnswer: string
  explanation: string
  sourceText: string
  topic?: string
}

export default function DynamicQuiz() {
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleSelectMaterial = async (materialId: number) => {
    setSelectedMaterialId(materialId)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setError(null)
    setShowExplanation(false)

    // Fetch existing questions or generate new ones
    await loadQuestions(materialId)
  }

  const loadQuestions = async (materialId: number) => {
    setLoading(true)
    try {
      // First try to fetch existing questions
      const response = await fetch(`/api/questions?materialId=${materialId}&limit=10`)
      const data = await response.json()

      if (data.success && data.questions.length > 0) {
        setQuestions(data.questions)
      } else {
        // If no questions exist, generate them
        await generateQuestions(materialId)
      }
    } catch (err) {
      setError('Failed to load questions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateQuestions = async (materialId: number) => {
    setGenerating(true)
    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId, count: 10 }),
      })

      const data = await response.json()

      if (data.success) {
        setQuestions(data.questions)
        setError(null)
      } else {
        setError(data.error || 'Failed to generate questions')
      }
    } catch (err) {
      setError('Failed to generate questions. This may be due to Hugging Face API limits.')
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (!showExplanation) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: answer,
      })
    }
  }

  const handleSubmitAnswer = () => {
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowExplanation(false)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setShowExplanation(false)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  if (!selectedMaterialId) {
    return (
      <main className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AI-Powered Quiz
            </h1>
            <p className="text-slate-300">
              Select a curriculum material to generate and study AI-created questions
            </p>
          </div>

          <div className="glassmorphism p-8 rounded-2xl">
            <MaterialSelector onSelectMaterial={handleSelectMaterial} />
          </div>
        </div>
      </main>
    )
  }

  if (loading || generating) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="animate-spin w-12 h-12 border-4 border-slate-600 border-t-blue-400 rounded-full"></div>
          </div>
          <p className="text-slate-300">{generating ? 'Generating questions...' : 'Loading questions...'}</p>
          <p className="text-slate-500 text-sm mt-2">
            {generating && 'This may take a minute as we generate questions using AI.'}
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-red-300 mb-2">Error</h2>
              <p className="text-red-200">{error}</p>
              <button
                onClick={() => {
                  setError(null)
                  setSelectedMaterialId(null)
                }}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
              >
                Try Another Material
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400">No questions available for this material.</p>
        </div>
      </main>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <main className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="glassmorphism p-12 rounded-2xl text-center">
            <div className="mb-8">
              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {percentage}%
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
              <p className="text-xl text-slate-300">
                You got <span className="font-semibold text-green-400">{score}</span> out of{' '}
                <span className="font-semibold">{questions.length}</span> correct
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleRestart}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => setSelectedMaterialId(null)}
                className="w-full px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg text-white font-semibold transition"
              >
                Choose Different Material
              </button>
              <Link
                href="/"
                className="block px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg text-white font-semibold transition text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = selectedAnswers[currentQuestionIndex]
  const isCorrect = currentAnswer === currentQuestion.correctAnswer

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition mb-8"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-slate-500">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="glassmorphism p-8 rounded-2xl mb-8">
          <p className="text-slate-400 text-sm mb-4">{currentQuestion.topic && `Topic: ${currentQuestion.topic}`}</p>
          <h2 className="text-2xl font-bold text-white mb-8">{currentQuestion.question}</h2>

          {/* Answers */}
          <div className="space-y-3 mb-8">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(answer)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-lg text-left font-semibold transition ${
                  showExplanation
                    ? answer === currentQuestion.correctAnswer
                      ? 'bg-green-500/20 border border-green-400 text-green-300'
                      : currentAnswer === answer
                        ? 'bg-red-500/20 border border-red-400 text-red-300'
                        : 'bg-slate-800/30 border border-slate-700 text-slate-400'
                    : currentAnswer === answer
                      ? 'bg-blue-500/20 border border-blue-400 text-blue-300'
                      : 'bg-slate-800/30 border border-slate-700 text-white hover:bg-slate-800/50'
                }`}
              >
                {answer}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-4 rounded-lg mb-8 border ${isCorrect ? 'bg-green-500/10 border-green-400' : 'bg-orange-500/10 border-orange-400'}`}>
              <div className="flex gap-3">
                <Zap className={`w-5 h-5 flex-shrink-0 ${isCorrect ? 'text-green-400' : 'text-orange-400'}`} />
                <div>
                  <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-300' : 'text-orange-300'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-slate-300 mb-3">{currentQuestion.explanation}</p>
                  {currentQuestion.sourceText && (
                    <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                      <p className="text-xs text-slate-400 mb-1">Source Material:</p>
                      <p className="text-sm text-slate-300">{currentQuestion.sourceText}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

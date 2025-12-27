'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import { quizData } from '@/data/quizData'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'
import { Card } from '@/components/Card'

export default function QuizMode() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem('quiz_progress')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setCurrentQuestion(parsed.question)
      setScore(parsed.score)
    }
  }, [])

  const question = quizData[currentQuestion]

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex)
    if (optionIndex === question.correctAnswer) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      const nextScore = score + (selectedAnswer === question.correctAnswer ? 1 : 0)
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      localStorage.setItem('quiz_progress', JSON.stringify({ question: currentQuestion + 1, score: nextScore }))
    } else {
      setCompleted(true)
      localStorage.removeItem('quiz_progress')
    }
  }

  if (!mounted) return null

  if (completed) {
    const percentage = Math.round((score / quizData.length) * 100)
    return (
      <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Card className="text-center" animate="fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Quiz Complete!</h1>
            <div className="text-6xl font-bold text-blue-400 mb-4">{score}/{quizData.length}</div>
            <p className="text-xl text-slate-300 mb-8">
              {percentage}% Correct
            </p>
            <div className="mb-8 text-slate-300">
              {percentage >= 80 && <p>Excellent work! You have mastered this material!</p>}
              {percentage >= 60 && percentage < 80 && <p>Good job! Keep practicing to improve further.</p>}
              {percentage < 60 && <p>Keep studying! Review the material and try again.</p>}
            </div>
            <Link href="/" className="inline-block glassmorphism px-8 py-3 rounded-xl hover:bg-slate-800/80 transition transform hover:scale-105">
              Return Home
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Header title="Quiz Mode" subtitle="Test your knowledge" />

        <ProgressBar current={currentQuestion + 1} total={quizData.length} label="Progress" />
        <div className="mb-8"></div>

        <Card className="animate-fade-in" animate="fade-in">
          <div className="mb-2">
            <span className="inline-block bg-green-500/20 px-3 py-1 rounded-full text-sm text-green-300">
              {question.topic}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">{question.question}</h2>

          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-xl text-left transition transform ${
                  selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'bg-green-500/20 border border-green-500'
                      : 'bg-red-500/20 border border-red-500'
                    : 'glassmorphism hover:bg-slate-800/80 hover:scale-105'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <div className="flex items-center gap-3">
                  {selectedAnswer === index && (
                    index === question.correctAnswer ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" aria-label="Correct answer" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" aria-label="Incorrect answer" />
                    )
                  )}
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-8 animate-fade-in">
              <p className="text-blue-300 font-semibold mb-2">Explanation:</p>
              <p className="text-blue-200">{question.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <Button
              onClick={handleNext}
              fullWidth
            >
              {currentQuestion < quizData.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          )}
        </Card>
      </div>
    </main>
  )
}

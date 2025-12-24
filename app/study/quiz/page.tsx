'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which neurotransmitter is primarily implicated in major depressive disorder?',
    options: ['Serotonin', 'Acetylcholine', 'GABA', 'Glutamate'],
    correctAnswer: 0,
    explanation: 'Serotonin dysregulation is the primary neurotransmitter implicated in MDD, which is why SSRIs are used as first-line treatment.'
  },
  {
    id: 2,
    question: 'What is the first step in a mental status examination?',
    options: ['Cognitive Assessment', 'Appearance and Behavior', 'Mood and Affect', 'Thought Content'],
    correctAnswer: 1,
    explanation: 'Appearance and behavior are observed first as they provide initial clinical impressions about the client.'
  },
]

export default function QuizMode() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const question = QUIZ_QUESTIONS[currentQuestion]

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex)
    if (optionIndex === question.correctAnswer) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
    }
  }

  if (completed) {
    return (
      <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="glassmorphism p-8 rounded-2xl text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Quiz Complete!</h1>
            <div className="text-6xl font-bold text-blue-400 mb-4">{score}/{QUIZ_QUESTIONS.length}</div>
            <p className="text-xl text-slate-300 mb-8">
              {Math.round((score / QUIZ_QUESTIONS.length) * 100)}% Correct
            </p>
            <Link href="/" className="inline-block glassmorphism px-8 py-3 rounded-xl hover:bg-slate-800/80 transition transform hover:scale-105">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition">
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Quiz Mode</h1>
        </div>

        {/* Progress */}
        <div className="mb-8 glassmorphism p-6 rounded-2xl animate-slide">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-slate-400">Progress</span>
            <span className="text-sm font-semibold text-blue-400">{currentQuestion + 1} / {QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8 glassmorphism p-8 rounded-2xl animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">{question.question}</h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-xl text-left transition transform hover:scale-105 ${
                  selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'bg-green-500/20 border border-green-500'
                      : 'bg-red-500/20 border border-red-500'
                    : 'glassmorphism hover:bg-slate-800/80'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  {selectedAnswer === index && (
                    index === question.correctAnswer ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    )
                  )}
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-8 animate-fade-in">
              <p className="text-blue-300">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <button
              onClick={handleNext}
              className="w-full glassmorphism px-6 py-3 rounded-xl hover:bg-slate-800/80 transition transform hover:scale-105 active:scale-95"
            >
              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

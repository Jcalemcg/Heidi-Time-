'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Clock } from 'lucide-react'

interface TimedQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const TIMED_QUESTIONS: TimedQuestion[] = [
  {
    id: 1,
    question: 'What is the DSM-5 definition of major depressive disorder?',
    options: ['One depressive episode', 'Two or more depressive episodes', 'Persistent depressive episodes lasting 2+ weeks', 'A single month of depressive symptoms'],
    correctAnswer: 2
  },
  {
    id: 2,
    question: 'How long should a depressive episode last to meet MDD criteria?',
    options: ['1 week', '2 weeks', 'One week or less', '1 month'],
    correctAnswer: 1
  },
]

export default function TimedMode() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [gameActive, setGameActive] = useState(true)

  const question = TIMED_QUESTIONS[currentQuestion]

  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive])

  const handleTimeUp = () => {
    if (currentQuestion < TIMED_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(30)
      setSelectedAnswer(null)
    } else {
      setGameActive(false)
    }
  }

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(optionIndex)
      if (optionIndex === question.correctAnswer) {
        setScore(score + 1)
      }
      setTimeout(() => {
        if (currentQuestion < TIMED_QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setTimeLeft(30)
          setSelectedAnswer(null)
        } else {
          setGameActive(false)
        }
      }, 1000)
    }
  }

  if (!gameActive) {
    return (
      <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="glassmorphism p-8 rounded-2xl text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Time's Up!</h1>
            <div className="text-6xl font-bold text-orange-400 mb-4">{score}/{TIMED_QUESTIONS.length}</div>
            <p className="text-xl text-slate-300 mb-8">
              Final Score: {Math.round((score / TIMED_QUESTIONS.length) * 100)}%
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Timed Mode</h1>
        </div>

        {/* Timer and Progress */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-slide">
          <div className="glassmorphism p-6 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-slate-400">Time Left</span>
            </div>
            <div className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-shake' : 'text-orange-400'}`}>
              {timeLeft}s
            </div>
          </div>
          <div className="glassmorphism p-6 rounded-2xl text-center">
            <div className="text-sm text-slate-400 mb-2">Score</div>
            <div className="text-4xl font-bold text-blue-400">{score}/{TIMED_QUESTIONS.length}</div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8 glassmorphism p-8 rounded-2xl animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">{question.question}</h2>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl text-left transition transform ${
                  selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'bg-green-500/20 border border-green-500 scale-105'
                      : 'bg-red-500/20 border border-red-500 scale-105'
                    : 'glassmorphism hover:bg-slate-800/80 hover:scale-105'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-lg">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

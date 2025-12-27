'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock } from 'lucide-react'
import { timedData } from '@/data/timedData'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import Link from 'next/link'

export default function TimedMode() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [gameActive, setGameActive] = useState(true)
  const [mounted, setMounted] = useState(false)

  const question = timedData[currentQuestion]

  const handleTimeUp = useCallback(() => {
    if (currentQuestion < timedData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(30)
      setSelectedAnswer(null)
    } else {
      setGameActive(false)
    }
  }, [currentQuestion])

  useEffect(() => {
    setMounted(true)
  }, [])

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
  }, [gameActive, handleTimeUp])

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(optionIndex)
      if (optionIndex === question.correctAnswer) {
        setScore(score + 1)
      }
      setTimeout(() => {
        if (currentQuestion < timedData.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setTimeLeft(30)
          setSelectedAnswer(null)
        } else {
          setGameActive(false)
        }
      }, 1000)
    }
  }

  if (!mounted) return null

  if (!gameActive) {
    const percentage = Math.round((score / timedData.length) * 100)
    return (
      <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Card className="text-center" animate="fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Time's Up!</h1>
            <div className="text-6xl font-bold text-orange-400 mb-4">{score}/{timedData.length}</div>
            <p className="text-xl text-slate-300 mb-8">
              Final Score: {percentage}%
            </p>
            <div className="mb-8 text-slate-300">
              {percentage >= 80 && <p>⚡ You're incredibly fast and accurate!</p>}
              {percentage >= 60 && percentage < 80 && <p>✓ Good speed and accuracy! Keep practicing.</p>}
              {percentage < 60 && <p>⏱️ Work on your speed and accuracy. Try again!</p>}
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
        <Header title="Timed Mode" subtitle="Answer questions under time pressure" />

        {/* Timer and Progress */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-slide">
          <div className="glassmorphism p-6 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-400" aria-label="Timer" />
              <span className="text-sm text-slate-400">Time Left</span>
            </div>
            <div className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-shake' : 'text-orange-400'}`}>
              {timeLeft}s
            </div>
          </div>
          <div className="glassmorphism p-6 rounded-2xl text-center">
            <div className="text-sm text-slate-400 mb-2">Progress</div>
            <div className="text-4xl font-bold text-blue-400">{currentQuestion + 1}/{timedData.length}</div>
          </div>
        </div>

        {/* Question */}
        <Card className="animate-fade-in" animate="fade-in">
          <div className="mb-4">
            <span className="inline-block bg-orange-500/20 px-3 py-1 rounded-full text-sm text-orange-300">
              {question.topic}
            </span>
          </div>
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
                aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <span className="text-lg">{option}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}

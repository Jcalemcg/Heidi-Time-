'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, RotateCcw, ChevronLeft } from 'lucide-react'
import { flashcardData } from '@/data/flashcardData'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'

export default function FlashcardMode() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedIndex = localStorage.getItem('flashcard_index')
    if (savedIndex) {
      setCurrentIndex(parseInt(savedIndex, 10))
    }
  }, [])

  useEffect(() => {
    setProgress(Math.round(((currentIndex + 1) / flashcardData.length) * 100))
    if (mounted) {
      localStorage.setItem('flashcard_index', currentIndex.toString())
    }
  }, [currentIndex, mounted])

  const handleNext = () => {
    if (currentIndex < flashcardData.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    localStorage.removeItem('flashcard_index')
  }

  if (!mounted) return null

  const currentCard = flashcardData[currentIndex]

  return (
    <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Header title="Flashcard Mode" subtitle="Master key concepts through interactive flashcards" />

        <ProgressBar current={currentIndex + 1} total={flashcardData.length} label="Progress" />
        <div className="mb-8"></div>

        <div className="mb-8 animate-fade-in">
          <span className="inline-block bg-blue-500/20 px-4 py-2 rounded-full text-sm text-blue-300">
            Topic: {currentCard.topic}
          </span>
        </div>

        <div
          className="h-96 mb-8 cursor-pointer animate-fade-in"
          onClick={() => setIsFlipped(!isFlipped)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setIsFlipped(!isFlipped)}
          aria-label={`Flashcard: ${currentCard.question}`}
        >
          <div className={`glassmorphism p-8 rounded-2xl h-full flex flex-col items-center justify-center transition-all duration-500 transform ${
            isFlipped ? 'scale-95 rotate-y-180' : ''
          }`}>
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">
                {isFlipped ? 'Answer' : 'Question'}
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-relaxed">
                {isFlipped ? currentCard.answer : currentCard.question}
              </p>
              <div className="mt-8 text-slate-400 text-sm">
                Click or press Enter to {isFlipped ? 'see question' : 'reveal answer'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            icon={<ChevronLeft className="w-5 h-5" />}
            aria-label="Previous flashcard"
          >
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <Button
            onClick={handleReset}
            icon={<RotateCcw className="w-5 h-5" />}
            aria-label="Reset to first flashcard"
          >
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex === flashcardData.length - 1}
            icon={<ChevronRight className="w-5 h-5" />}
            aria-label="Next flashcard"
          >
            <span className="hidden sm:inline">Next</span>
          </Button>
        </div>
      </div>
    </main>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

interface Flashcard {
  id: number
  question: string
  answer: string
}

const SAMPLE_CARDS: Flashcard[] = [
  {
    id: 1,
    question: 'What is the primary role of a PMHNP?',
    answer: 'A PMHNP provides comprehensive mental health and psychiatric nursing care including assessment, diagnosis, treatment planning, and pharmacological management.'
  },
  {
    id: 2,
    question: 'Describe the therapeutic relationship in psychiatric nursing.',
    answer: 'A collaborative partnership built on trust, respect, and clear communication where the nurse uses self and evidence-based interventions to support client recovery.'
  },
  {
    id: 3,
    question: 'What are the key principles of trauma-informed care?',
    answer: 'Safety, trustworthiness, choice, collaboration, and empowerment - recognizing trauma\'s impact and avoiding re-traumatization.'
  },
  {
    id: 4,
    question: 'How do antipsychotics work in treating schizophrenia?',
    answer: 'They block dopamine and serotonin receptors in the brain, reducing positive symptoms like hallucinations and delusions.'
  },
  {
    id: 5,
    question: 'What is the biopsychosocial model in psychiatry?',
    answer: 'An integrated approach recognizing that mental health is influenced by biological, psychological, and social factors.'
  }
]

export default function FlashcardMode() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(Math.round(((currentIndex + 1) / SAMPLE_CARDS.length) * 100))
  }, [currentIndex])

  const currentCard = SAMPLE_CARDS[currentIndex]

  const handleNext = () => {
    if (currentIndex < SAMPLE_CARDS.length - 1) {
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Study Mode</h1>
          <p className="text-slate-300 text-lg">Master key concepts through interactive flashcards</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 glassmorphism p-6 rounded-2xl animate-slide">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-slate-400">Progress</span>
            <span className="text-sm font-semibold text-blue-400">{currentIndex + 1} / {SAMPLE_CARDS.length}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div
          className="h-96 mb-8 cursor-pointer animate-fade-in"
          onClick={() => setIsFlipped(!isFlipped)}
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
                Click to {isFlipped ? 'see question' : 'reveal answer'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 glassmorphism px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800/80 transition transform hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 glassmorphism px-6 py-3 rounded-xl hover:bg-slate-800/80 transition transform hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === SAMPLE_CARDS.length - 1}
            className="flex items-center gap-2 glassmorphism px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800/80 transition transform hover:scale-105 active:scale-95"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  )
}

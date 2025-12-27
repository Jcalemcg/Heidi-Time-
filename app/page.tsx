'use client'

import { BookOpen, Brain, Clock, Zap } from 'lucide-react'
import { ModeCard } from '@/components/ModeCard'
import { StatsCard } from '@/components/StatsCard'

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
            Heidi NP
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8">
            Quiz Master Edition!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12 animate-slide">
          <ModeCard
            href="/study/flashcard"
            title="Flashcard Mode"
            description="Learn through interactive flashcards with spaced repetition and progress tracking."
            icon={<BookOpen className="w-8 h-8" />}
            buttonText="Start Studying"
            color="blue"
          />

          <ModeCard
            href="/study/quiz"
            title="Quiz Mode"
            description="Test your knowledge with comprehensive quizzes and immediate feedback."
            icon={<Brain className="w-8 h-8" />}
            buttonText="Take Quiz"
            color="green"
          />

          <ModeCard
            href="/study/timed"
            title="Timed Mode"
            description="Challenge yourself with timed questions to build speed and accuracy."
            icon={<Clock className="w-8 h-8" />}
            buttonText="Beat the Clock"
            color="orange"
          />

          <ModeCard
            href="/study/review"
            title="Review Mode"
            description="Review your progress, weak areas, and master difficult concepts."
            icon={<Zap className="w-8 h-8" />}
            buttonText="Review Progress"
            color="purple"
          />
        </div>

        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <StatsCard value="100+" label="Study Questions" color="blue" />
          <StatsCard value="8" label="Core Topics" color="green" />
          <StatsCard value="6" label="Study Modes" color="orange" />
          <StatsCard value="24/7" label="Available" color="purple" />
        </div>
      </div>
    </main>
  )
}

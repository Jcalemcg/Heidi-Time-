'use client'

import Link from 'next/link'
import { BookOpen, Brain, Clock, Zap, Sparkles } from 'lucide-react'
import MaterialsManager from '@/app/components/MaterialsManager'
import { useState } from 'react'

export default function Home() {
  const [showMaterials, setShowMaterials] = useState(false)

  return (
    <main className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
            Heidi NP
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8">
            Quiz Master Edition!
          </p>
          <button
            onClick={() => setShowMaterials(!showMaterials)}
            className="mb-8 px-6 py-2 bg-slate-700/50 hover:bg-slate-700/80 rounded-lg text-slate-300 font-semibold transition"
          >
            {showMaterials ? 'Hide Materials' : 'Manage Materials'}
          </button>
        </div>

        {showMaterials && (
          <div className="w-full mb-12 animate-fade-in">
            <MaterialsManager />
          </div>
        )}

        {/* Study Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12 animate-slide">
          {/* Flashcard Mode */}
          <Link href="/study/flashcard">
            <div className="glassmorphism p-8 rounded-2xl cursor-pointer transform transition-all hover:scale-105 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Flashcard Mode</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base">
                Learn through interactive flashcards with spaced repetition and progress tracking.
              </p>
              <div className="mt-4 flex items-center gap-2 text-blue-400 font-semibold">
                <span>Start Studying</span>
                <span className="group-hover:translate-x-2 transition">→</span>
              </div>
            </div>
          </Link>

          {/* Quiz Mode */}
          <Link href="/study/quiz">
            <div className="glassmorphism p-8 rounded-2xl cursor-pointer transform transition-all hover:scale-105 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition">
                  <Brain className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Quiz Mode</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base">
                Test your knowledge with comprehensive quizzes and immediate feedback.
              </p>
              <div className="mt-4 flex items-center gap-2 text-green-400 font-semibold">
                <span>Take Quiz</span>
                <span className="group-hover:translate-x-2 transition">→</span>
              </div>
            </div>
          </Link>

          {/* Timed Mode */}
          <Link href="/study/timed">
            <div className="glassmorphism p-8 rounded-2xl cursor-pointer transform transition-all hover:scale-105 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition">
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Timed Mode</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base">
                Challenge yourself with timed questions to build speed and accuracy.
              </p>
              <div className="mt-4 flex items-center gap-2 text-orange-400 font-semibold">
                <span>Beat the Clock</span>
                <span className="group-hover:translate-x-2 transition">→</span>
              </div>
            </div>
          </Link>

          {/* Review Mode */}
          <Link href="/study/review">
            <div className="glassmorphism p-8 rounded-2xl cursor-pointer transform transition-all hover:scale-105 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Review Mode</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base">
                Review your progress, weak areas, and master difficult concepts.
              </p>
              <div className="mt-4 flex items-center gap-2 text-purple-400 font-semibold">
                <span>Review Progress</span>
                <span className="group-hover:translate-x-2 transition">→</span>
              </div>
            </div>
          </Link>

          {/* AI-Powered Quiz Mode */}
          <Link href="/study/dynamic-quiz">
            <div className="glassmorphism p-8 rounded-2xl cursor-pointer transform transition-all hover:scale-105 group md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition">
                  <Sparkles className="w-8 h-8 text-pink-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">AI-Powered Quiz</h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base">
                Upload your curriculum materials and get AI-generated questions grounded in your content. 100% accurate, sourced-based learning.
              </p>
              <div className="mt-4 flex items-center gap-2 text-pink-400 font-semibold">
                <span>Start AI Quiz</span>
                <span className="group-hover:translate-x-2 transition">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <div className="glassmorphism p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">250+</div>
            <div className="text-sm text-slate-400">Study Questions</div>
          </div>
          <div className="glassmorphism p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">8</div>
            <div className="text-sm text-slate-400">Core Topics</div>
          </div>
          <div className="glassmorphism p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
            <div className="text-sm text-slate-400">Success Rate</div>
          </div>
          <div className="glassmorphism p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-sm text-slate-400">Available</div>
          </div>
        </div>
      </div>
    </main>
  )
}

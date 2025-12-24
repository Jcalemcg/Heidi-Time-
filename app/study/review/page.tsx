'use client'

import Link from 'next/link'
import { ChevronLeft, TrendingUp, Target, Award } from 'lucide-react'

interface StudyStats {
  topic: string
  correct: number
  total: number
  accuracy: number
}

const STATS: StudyStats[] = [
  { topic: 'Depression & Anxiety Disorders', correct: 18, total: 20, accuracy: 90 },
  { topic: 'Psychotic Disorders', correct: 16, total: 20, accuracy: 80 },
  { topic: 'Bipolar Disorder', correct: 19, total: 20, accuracy: 95 },
  { topic: 'Substance Use Disorders', correct: 14, total: 20, accuracy: 70 },
  { topic: 'Personality Disorders', correct: 17, total: 20, accuracy: 85 },
  { topic: 'Cognitive Disorders', correct: 20, total: 20, accuracy: 100 },
  { topic: 'Therapeutic Techniques', correct: 15, total: 20, accuracy: 75 },
  { topic: 'Pharmacology', correct: 18, total: 20, accuracy: 90 },
]

export default function ReviewMode() {
  const totalCorrect = STATS.reduce((sum, stat) => sum + stat.correct, 0)
  const totalQuestions = STATS.reduce((sum, stat) => sum + stat.total, 0)
  const overallAccuracy = Math.round((totalCorrect / totalQuestions) * 100)

  return (
    <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition">
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Review Mode</h1>
          <p className="text-slate-300 text-lg">Track your progress and identify weak areas</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide">
          <div className="glassmorphism p-8 rounded-2xl text-center">
            <Award className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-sm text-slate-400 mb-2">Overall Accuracy</div>
            <div className="text-4xl font-bold text-blue-400">{overallAccuracy}%</div>
          </div>
          <div className="glassmorphism p-8 rounded-2xl text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-sm text-slate-400 mb-2">Questions Correct</div>
            <div className="text-4xl font-bold text-green-400">{totalCorrect}/{totalQuestions}</div>
          </div>
          <div className="glassmorphism p-8 rounded-2xl text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-sm text-slate-400 mb-2">Topics Studied</div>
            <div className="text-4xl font-bold text-purple-400">{STATS.length}</div>
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Topic Performance</h2>
          <div className="space-y-4">
            {STATS.map((stat, index) => (
              <div key={index} className="glassmorphism p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{stat.topic}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-400">
                        {stat.correct}/{stat.total} correct
                      </span>
                      <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            stat.accuracy >= 90 ? 'bg-green-500' :
                            stat.accuracy >= 75 ? 'bg-blue-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${stat.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      stat.accuracy >= 90 ? 'text-green-400' :
                      stat.accuracy >= 75 ? 'text-blue-400' :
                      'text-orange-400'
                    }`}>
                      {stat.accuracy}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12 glassmorphism p-8 rounded-2xl animate-fade-in">
          <h3 className="text-xl font-bold mb-4">📚 Study Recommendations</h3>
          <ul className="space-y-3 text-slate-300">
            <li>• Focus on <strong>Substance Use Disorders</strong> (70%) - weakest area</li>
            <li>• Review <strong>Therapeutic Techniques</strong> (75%) to improve</li>
            <li>• Congratulations on mastering <strong>Cognitive Disorders</strong> (100%)</li>
            <li>• Continue regular practice to maintain <strong>Bipolar Disorder</strong> performance</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

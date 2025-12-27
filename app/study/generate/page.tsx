'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { GenerationPanel } from '@/components/GenerationPanel'
import { Card } from '@/components/Card'
import { CheckCircle } from 'lucide-react'

interface ContentInfo {
  id: string
  title: string
}

interface GeneratedQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface GeneratedFlashcard {
  question: string
  answer: string
}

function GenerateContent() {
  const searchParams = useSearchParams()
  const contentId = searchParams.get('content')
  const [contentInfo, setContentInfo] = useState<ContentInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [flashcards, setFlashcards] = useState<GeneratedFlashcard[]>([])

  useEffect(() => {
    if (!contentId) {
      setError('No content selected. Please upload content first.')
      setIsLoading(false)
      return
    }

    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${contentId}`)
        if (!response.ok) throw new Error('Content not found')
        const data = await response.json()
        setContentInfo(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [contentId])

  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-8 text-slate-400">Loading...</div>
      </Card>
    )
  }

  if (error || !contentInfo) {
    return (
      <Card className="p-6 border-red-500/30 bg-red-500/10">
        <p className="text-red-300">{error || 'Failed to load content'}</p>
        <a href="/study/library" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Back to Library
        </a>
      </Card>
    )
  }

  return (
    <>
      <Header
        title="Generate Study Materials"
        subtitle={`Creating content from: ${contentInfo.title}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Generation Panel */}
        <div className="lg:col-span-2">
          <GenerationPanel
            contentId={contentId!}
            onQuestionsGenerated={setQuestions}
            onFlashcardsGenerated={setFlashcards}
          />
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card animate="fade-in" className="sticky top-8">
            <h3 className="text-lg font-bold mb-4">Generated Content</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${questions.length > 0 ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {questions.length > 0 && <CheckCircle className="w-5 h-5 text-green-400" />}
                  <span className="font-semibold">Quiz Questions</span>
                </div>
                <p className="text-sm text-slate-400">{questions.length} generated</p>
              </div>

              <div className={`p-4 rounded-lg ${flashcards.length > 0 ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {flashcards.length > 0 && <CheckCircle className="w-5 h-5 text-green-400" />}
                  <span className="font-semibold">Flashcards</span>
                </div>
                <p className="text-sm text-slate-400">{flashcards.length} generated</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <a href="/study/library" className="text-blue-400 hover:text-blue-300 text-sm">
          ← Back to Library
        </a>
      </div>
    </>
  )
}

export default function GeneratePage() {
  return (
    <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <GenerateContent />
        </Suspense>
      </div>
    </main>
  )
}

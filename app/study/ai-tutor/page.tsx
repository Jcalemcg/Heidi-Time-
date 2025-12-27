'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { ChatBox } from '@/components/ChatBox'
import { Card } from '@/components/Card'

interface ContentInfo {
  id: string
  title: string
}

function AITutorContent() {
  const searchParams = useSearchParams()
  const contentId = searchParams.get('content')
  const [contentInfo, setContentInfo] = useState<ContentInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        title="AI Study Assistant"
        subtitle={`Asking questions about: ${contentInfo.title}`}
      />

      <div className="h-screen max-h-96">
        <ChatBox contentId={contentId!} contentTitle={contentInfo.title} />
      </div>

      <div className="mt-8 text-center">
        <a href="/study/library" className="text-blue-400 hover:text-blue-300 text-sm">
          ← Back to Library
        </a>
      </div>
    </>
  )
}

export default function AITutorPage() {
  return (
    <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <AITutorContent />
        </Suspense>
      </div>
    </main>
  )
}

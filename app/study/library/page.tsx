'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { ContentUploader } from '@/components/ContentUploader'
import { ContentLibrary } from '@/components/ContentLibrary'
import Link from 'next/link'
import { Button } from '@/components/Button'

export default function LibraryPage() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = (contentId: string) => {
    setSelectedContentId(contentId)
    setRefreshKey((k) => k + 1)
  }

  return (
    <main className="min-h-screen w-full py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Header
          title="Content Library"
          subtitle="Upload and manage your study materials"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card animate="fade-in" className="h-full">
              <h2 className="text-xl font-bold mb-6">Upload New Content</h2>
              <ContentUploader onUploadSuccess={handleUploadSuccess} />
            </Card>
          </div>

          {/* Library Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Your Materials</h2>
            <ContentLibrary key={refreshKey} onSelectContent={setSelectedContentId} />
          </div>
        </div>

        {/* Action Buttons */}
        {selectedContentId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <Link href={`/study/ai-tutor?content=${selectedContentId}`}>
              <Button fullWidth className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="w-5 h-5" />
                Ask Questions
              </Button>
            </Link>
            <Link href={`/study/generate?content=${selectedContentId}`}>
              <Button fullWidth className="bg-green-600 hover:bg-green-700">
                <BookOpen className="w-5 h-5" />
                Generate Study Materials
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

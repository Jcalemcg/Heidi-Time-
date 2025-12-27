'use client'

import { useEffect, useState } from 'react'
import { Trash2, FileText, Calendar, HardDrive } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

interface ContentItem {
  id: string
  title: string
  fileType: string
  uploadedAt: string
  size: number
}

interface ContentLibraryProps {
  onSelectContent?: (id: string) => void
}

export function ContentLibrary({ onSelectContent }: ContentLibraryProps) {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/content/list')
      if (!response.ok) throw new Error('Failed to load content')
      const data = await response.json()
      setContents(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteContent = async (id: string) => {
    if (!confirm('Delete this content?')) return

    try {
      const response = await fetch(`/api/content/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      setContents(contents.filter((c) => c.id !== id))
    } catch (err) {
      alert((err as Error).message)
    }
  }

  if (isLoading) {
    return <div className="text-center text-slate-400">Loading content...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
        {error}
      </div>
    )
  }

  if (contents.length === 0) {
    return (
      <Card animate="fade-in">
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-300 mb-4">No content uploaded yet</p>
          <p className="text-slate-500 text-sm">Upload study material to get started</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {contents.map((content) => (
        <Card key={content.id} animate="fade-in" className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-3">{content.title}</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(content.uploadedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  {(content.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onSelectContent?.(content.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Use
              </Button>
              <Button
                onClick={() => deleteContent(content.id)}
                className="bg-red-600 hover:bg-red-700"
                icon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Loader } from 'lucide-react'
import { Button } from './Button'

interface ContentUploaderProps {
  onUploadSuccess?: (contentId: string) => void
}

export function ContentUploader({ onUploadSuccess }: ContentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onUploadSuccess?.(data.id)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
        isDragging
          ? 'border-blue-400 bg-blue-500/10'
          : 'border-slate-400 bg-slate-900/20'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-blue-400" />
      <h3 className="text-xl font-bold mb-2">Upload Study Material</h3>
      <p className="text-slate-400 mb-6">
        Drag and drop your files here or click to browse
      </p>
      <p className="text-sm text-slate-500 mb-6">
        Supported: TXT, Markdown, PDF (up to 10MB)
      </p>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg mb-6 text-red-300">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        disabled={isLoading}
        accept=".txt,.md,.pdf,.markdown"
        className="hidden"
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        icon={isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
      >
        {isLoading ? 'Uploading...' : 'Choose File'}
      </Button>
    </div>
  )
}

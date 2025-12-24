'use client'

import { useState, useEffect } from 'react'
import { Upload, Trash2, FileText, AlertCircle } from 'lucide-react'

interface Material {
  id: number
  title: string
  description?: string
  status: string
  chunkCount: number
  questionCount: number
  uploadedAt: string
  fileSize: number
}

export default function MaterialsManager() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', file: null as File | null })

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/materials')
      const data = await response.json()
      if (data.success) {
        setMaterials(data.materials)
      }
    } catch (err) {
      setError('Failed to fetch materials')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, file })
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.file || !formData.title) {
      setError('Please select a file and enter a title')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const form = new FormData()
      form.append('file', formData.file)
      form.append('title', formData.title)
      form.append('description', formData.description)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      })

      const data = await response.json()

      if (data.success) {
        setFormData({ title: '', description: '', file: null })
        setShowUploadForm(false)
        fetchMaterials()
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Failed to upload file')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (materialId: number) => {
    if (!confirm('Are you sure you want to delete this material?')) {
      return
    }

    try {
      const response = await fetch(`/api/materials?id=${materialId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchMaterials()
      } else {
        setError('Failed to delete material')
      }
    } catch (err) {
      setError('Failed to delete material')
      console.error(err)
    }
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Upload Section */}
      <div className="glassmorphism p-8 rounded-2xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Upload className="w-6 h-6 text-blue-400" />
            Curriculum Materials
          </h2>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 font-semibold transition"
          >
            {showUploadForm ? 'Cancel' : 'Upload Material'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {showUploadForm && (
          <form onSubmit={handleUpload} className="space-y-4 mb-6 p-6 bg-slate-800/30 rounded-lg">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Chamberlain PMHNP Chapter 5"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Description (Optional)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add notes about this material"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">File (PDF or Text)</label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.txt"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white file:text-blue-400 file:bg-blue-500/20 file:border-0 file:rounded file:px-3 file:py-1 file:mr-4 focus:outline-none focus:border-blue-400"
                required
              />
              {formData.file && <p className="text-sm text-slate-400 mt-1">Selected: {formData.file.name}</p>}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 rounded-lg text-white font-semibold transition"
            >
              {uploading ? 'Processing...' : 'Upload'}
            </button>
          </form>
        )}

        {/* Materials List */}
        {loading ? (
          <div className="text-center text-slate-400">Loading materials...</div>
        ) : materials.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No materials uploaded yet. Upload your first curriculum document!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="p-4 bg-slate-800/30 rounded-lg flex items-center justify-between hover:bg-slate-800/50 transition">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{material.title}</h3>
                  {material.description && <p className="text-sm text-slate-400 mb-2">{material.description}</p>}
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>
                      {material.chunkCount} chunks
                    </span>
                    <span>
                      {material.questionCount} questions
                    </span>
                    <span>
                      {(material.fileSize / 1024).toFixed(1)} KB
                    </span>
                    <span className="text-blue-400">
                      {material.status === 'processing' ? 'Processing...' : 'Ready'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="ml-4 p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { BookOpen, AlertCircle } from 'lucide-react'

interface Material {
  id: number
  title: string
  description?: string
  status: string
  chunkCount: number
  questionCount: number
}

interface MaterialSelectorProps {
  onSelectMaterial: (materialId: number) => void
  selectedMaterialId?: number
}

export default function MaterialSelector({ onSelectMaterial, selectedMaterialId }: MaterialSelectorProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/materials')
        const data = await response.json()
        if (data.success) {
          setMaterials(data.materials.filter((m: Material) => m.status === 'ready'))
        }
      } catch (err) {
        setError('Failed to fetch materials')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  if (loading) {
    return <div className="text-center text-slate-400">Loading materials...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-red-300">{error}</p>
      </div>
    )
  }

  if (materials.length === 0) {
    return (
      <div className="p-6 bg-slate-800/30 rounded-lg text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-slate-400 mb-4">No materials available yet.</p>
        <p className="text-sm text-slate-500">Upload curriculum documents to get started with AI-generated questions.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => (
        <button
          key={material.id}
          onClick={() => onSelectMaterial(material.id)}
          className={`w-full p-4 rounded-lg text-left transition ${
            selectedMaterialId === material.id
              ? 'bg-blue-500/20 border border-blue-400'
              : 'bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700'
          }`}
        >
          <h3 className="font-semibold text-white mb-1">{material.title}</h3>
          {material.description && <p className="text-sm text-slate-400 mb-2">{material.description}</p>}
          <div className="flex gap-3 text-xs text-slate-500">
            <span>{material.chunkCount} chunks</span>
            <span>{material.questionCount} questions</span>
          </div>
        </button>
      ))}
    </div>
  )
}

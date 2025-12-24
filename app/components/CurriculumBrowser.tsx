'use client'

import { useState } from 'react'
import { Search, BookOpen, Download, AlertCircle, Loader } from 'lucide-react'

interface CurriculumResult {
  title: string
  course: string
  topic: string
  summary: string
  keyTerms: string[]
}

interface CurriculumContent {
  title: string
  course: string
  topic: string
  content: string
  learningObjectives: string[]
  keyTerms: string[]
  relatedTopics: string[]
}

export default function CurriculumBrowser() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CurriculumResult[]>([])
  const [selectedContent, setSelectedContent] = useState<CurriculumContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError(null)
    setSelectedContent(null)

    try {
      const response = await fetch(`/api/curriculum/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.results)
        if (data.results.length === 0) {
          setError('No results found. Try different keywords.')
        }
      } else {
        setError(data.error || 'Search failed')
      }
    } catch (err) {
      setError('Failed to search curriculum')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectResult = async (result: CurriculumResult) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/curriculum/get?topic=${encodeURIComponent(result.topic)}`)
      const data = await response.json()

      if (data.success) {
        setSelectedContent(data.content)
      } else {
        setError(data.error || 'Failed to load content')
      }
    } catch (err) {
      setError('Failed to load curriculum content')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImportToMaterials = async () => {
    if (!selectedContent) return

    try {
      // Create a text file from the curriculum content
      const content = `${selectedContent.title}
Course: ${selectedContent.course}
Topic: ${selectedContent.topic}

LEARNING OBJECTIVES:
${selectedContent.learningObjectives.map((obj) => `- ${obj}`).join('\n')}

KEY TERMS: ${selectedContent.keyTerms.join(', ')}

RELATED TOPICS: ${selectedContent.relatedTopics.join(', ')}

CONTENT:
${selectedContent.content}

SOURCES:
Chamberlain University PMHNP Curriculum
`

      // Create FormData with the content as a file
      const blob = new Blob([content], { type: 'text/plain' })
      const file = new File([blob], `${selectedContent.topic.replace(/\s+/g, '-')}.txt`, { type: 'text/plain' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', `Chamberlain PMHNP: ${selectedContent.title}`)
      formData.append('description', `Course: ${selectedContent.course} | Topic: ${selectedContent.topic}`)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        alert(`Material imported successfully! Created ${data.material.chunks} chunks for processing.`)
        setSelectedContent(null)
        setSearchResults([])
        setQuery('')
      } else {
        setError(data.error || 'Failed to import material')
      }
    } catch (err) {
      setError('Failed to import curriculum to materials')
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="glassmorphism p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          Chamberlain PMHNP Curriculum Browser
        </h2>
        <p className="text-slate-400 mb-6">
          Search and browse official Chamberlain PMHNP curriculum materials. Import topics directly to your study materials.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics: anxiety, depression, antipsychotics, mood stabilizers..."
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 pr-12"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 disabled:opacity-50"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Results */}
        <div className="lg:col-span-1">
          <div className="glassmorphism p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-4">
              Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h3>

            {searchResults.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Search for curriculum topics to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      selectedContent?.title === result.title
                        ? 'bg-blue-500/20 border border-blue-400'
                        : 'bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white text-sm">{result.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{result.course}</div>
                    <div className="text-xs text-slate-500 mt-2 line-clamp-2">{result.summary}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Preview */}
        <div className="lg:col-span-2">
          {selectedContent ? (
            <div className="glassmorphism p-6 rounded-2xl space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedContent.title}</h3>
                <p className="text-slate-400 text-sm">
                  {selectedContent.course} | {selectedContent.topic}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Learning Objectives:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  {selectedContent.learningObjectives.slice(0, 3).map((obj, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                  {selectedContent.learningObjectives.length > 3 && (
                    <li className="text-slate-500 text-xs">
                      +{selectedContent.learningObjectives.length - 3} more objectives
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-400 mb-2">Key Terms:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContent.keyTerms.slice(0, 6).map((term, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                      {term}
                    </span>
                  ))}
                  {selectedContent.keyTerms.length > 6 && (
                    <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-500">
                      +{selectedContent.keyTerms.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-4 line-clamp-4">{selectedContent.content.substring(0, 300)}...</p>

                <button
                  onClick={handleImportToMaterials}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  {loading ? 'Importing...' : 'Import to Study Materials'}
                </button>
              </div>
            </div>
          ) : (
            <div className="glassmorphism p-12 rounded-2xl text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-slate-400">Select a curriculum topic to view details and import</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

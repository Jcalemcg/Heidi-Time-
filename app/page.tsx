'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Lightbulb, ClipboardList } from 'lucide-react';

export default function Home() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gradient">
            Chamberlain PMHNP
          </div>
          <div className="text-sm text-slate-400">Study App</div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-slideUp">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Master Your <span className="text-gradient">PMHNP Certification</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Interactive study modes, AI-generated content, and smart caching for efficient learning
          </p>
        </div>

        {/* Study Modes Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Study Mode */}
          <Link href="/study">
            <div
              className="glassmorphism card-gradient rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-indigo-500/50"
              onMouseEnter={() => setIsHovered('study')}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-indigo-500/20 rounded-lg">
                  <BookOpen className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-center">Study Mode</h2>
              <p className="text-slate-300 text-center mb-4">
                Browse all 9 Chamberlain PMHNP courses with credits, clinical hours, and AI-generated content summaries
              </p>
              <div className="text-center text-indigo-400 font-semibold">
                {isHovered === 'study' ? 'Start Studying →' : 'Explore Courses'}
              </div>
            </div>
          </Link>

          {/* Flashcard Mode */}
          <Link href="/flashcards">
            <div
              className="glassmorphism card-gradient rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-pink-500/50"
              onMouseEnter={() => setIsHovered('flashcards')}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-pink-500/20 rounded-lg">
                  <Lightbulb className="w-8 h-8 text-pink-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-center">Flashcard Mode</h2>
              <p className="text-slate-300 text-center mb-4">
                High-yield flashcards with flip animations, progress tracking, and smart spacing algorithm
              </p>
              <div className="text-center text-pink-400 font-semibold">
                {isHovered === 'flashcards' ? 'Learn Now →' : 'Review Cards'}
              </div>
            </div>
          </Link>

          {/* Practice Test Mode */}
          <Link href="/test">
            <div
              className="glassmorphism card-gradient rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-emerald-500/50"
              onMouseEnter={() => setIsHovered('test')}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-emerald-500/20 rounded-lg">
                  <ClipboardList className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-center">Practice Test</h2>
              <p className="text-slate-300 text-center mb-4">
                ANCC-style questions with 60-second timer, domain attribution, and clinical rationales
              </p>
              <div className="text-center text-emerald-400 font-semibold">
                {isHovered === 'test' ? 'Take Test →' : 'Start Testing'}
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="glassmorphism rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6">✨ Key Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="text-green-400 font-bold">✓</div>
              <div>
                <p className="font-semibold">AI-Generated Content</p>
                <p className="text-sm text-slate-400">
                  Hugging Face powered questions, flashcards, and rationales
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-green-400 font-bold">✓</div>
              <div>
                <p className="font-semibold">Smart Caching</p>
                <p className="text-sm text-slate-400">
                  SQLite database stores generated content for instant access
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-green-400 font-bold">✓</div>
              <div>
                <p className="font-semibold">Web Scraping Ready</p>
                <p className="text-sm text-slate-400">
                  Cheerio-based scraper integrates Chamberlain & ANCC content
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-green-400 font-bold">✓</div>
              <div>
                <p className="font-semibold">Responsive Design</p>
                <p className="text-sm text-slate-400">
                  Mobile-first Tailwind CSS with smooth animations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center glassmorphism rounded-xl p-12">
          <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
          <p className="text-slate-300 mb-6">
            Choose a study mode above or visit the admin dashboard to manage cache
          </p>
          <Link href="/admin">
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
              Admin Dashboard →
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>
            Built for Chamberlain University PMHNP students • Powered by Next.js
            & Hugging Face
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, RefreshCw, Trash2 } from 'lucide-react';

interface CacheStatus {
  coursesCount: number;
  flashcardsCount: number;
  questionsCount: number;
  databaseSize: string;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<CacheStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/cache/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setScrapeLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: 'https://www.chamberlain.edu',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✓ Scraping completed! Cache updated with fresh content.');
        fetchStatus();
      } else {
        setMessage('✗ Scraping failed. Check console for details.');
      }
    } catch (error) {
      console.error('Error scraping:', error);
      setMessage('✗ Network error during scraping.');
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Clear all cached data? This cannot be undone.')) return;

    setClearLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/cache/status', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage('✓ Cache cleared successfully!');
        fetchStatus();
      } else {
        setMessage('✗ Failed to clear cache.');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      setMessage('✗ Network error.');
    } finally {
      setClearLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Status Card */}
        {loading ? (
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-slate-400">Loading cache status...</p>
          </div>
        ) : status ? (
          <>
            <div className="glassmorphism rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Cache Status</h2>
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400">Courses</p>
                  <p className="text-4xl font-bold text-indigo-400">{status.coursesCount}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400">Flashcards</p>
                  <p className="text-4xl font-bold text-pink-400">{status.flashcardsCount}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400">Questions</p>
                  <p className="text-4xl font-bold text-emerald-400">{status.questionsCount}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400">DB Size</p>
                  <p className="text-lg font-bold text-yellow-400">{status.databaseSize}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Last updated: {new Date(status.lastUpdated).toLocaleString()}
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-8 p-4 rounded-lg ${
                message.startsWith('✓')
                  ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                  : 'bg-red-500/20 text-red-300 border border-red-500/50'
              }`}>
                {message}
              </div>
            )}

            {/* Controls */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Scrape Section */}
              <div className="glassmorphism rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Web Scraping</h3>
                <p className="text-slate-300 mb-6">
                  Fetch latest content from Chamberlain and ANCC websites using Cheerio.
                </p>
                <button
                  onClick={handleScrape}
                  disabled={scrapeLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
                >
                  <RefreshCw className={`w-5 h-5 ${scrapeLoading ? 'animate-spin' : ''}`} />
                  {scrapeLoading ? 'Scraping...' : 'Start Scrape'}
                </button>
              </div>

              {/* Clear Cache Section */}
              <div className="glassmorphism rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Cache Management</h3>
                <p className="text-slate-300 mb-6">
                  Clear all cached data and reset the database to defaults.
                </p>
                <button
                  onClick={handleClearCache}
                  disabled={clearLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  {clearLoading ? 'Clearing...' : 'Clear All Cache'}
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-12 glassmorphism rounded-xl p-8">
              <h3 className="text-xl font-bold mb-6">System Information</h3>
              <div className="space-y-4 text-slate-300">
                <div>
                  <p className="font-semibold text-slate-400">HF API Model</p>
                  <p className="font-mono text-sm bg-slate-700/30 p-3 rounded mt-1">
                    mistral-7b-instruct-v0.1
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400">Database</p>
                  <p className="font-mono text-sm bg-slate-700/30 p-3 rounded mt-1">
                    SQLite (./data/cache.db)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400">Cache TTL</p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Courses: 24 hours</li>
                    <li>Questions: 12 hours</li>
                    <li>Flashcards: 12 hours</li>
                    <li>Scraped content: 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-400">
            Failed to load cache status. Try refreshing.
          </div>
        )}
      </div>
    </div>
  );
}

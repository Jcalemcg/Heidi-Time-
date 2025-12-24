'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, RefreshCw, Trash2, Download, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface CacheStatus {
  coursesCount: number;
  flashcardsCount: number;
  questionsCount: number;
  databaseSize: string;
  lastUpdated: string;
}

interface AlertMessage {
  type: 'success' | 'error' | 'info';
  text: string;
  id: string;
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<CacheStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh status every 30 seconds if enabled
  useEffect(() => {
    fetchStatus();

    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (alerts.length === 0) return;

    const timers = alerts.map((alert) =>
      setTimeout(() => {
        removeAlert(alert.id);
      }, 5000)
    );

    return () => timers.forEach(clearTimeout);
  }, [alerts]);

  const addAlert = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { type, text, id }]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/cache/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data);
      } else {
        addAlert('error', 'Failed to fetch cache status');
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      addAlert('error', 'Network error while fetching status');
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setScrapeLoading(true);
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
        addAlert('success', 'Scraping completed! Cache updated with fresh content.');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        fetchStatus();
      } else {
        addAlert('error', 'Scraping failed. Check console for details.');
      }
    } catch (error) {
      console.error('Error scraping:', error);
      addAlert('error', 'Network error during scraping');
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleClearCache = async () => {
    setClearLoading(true);
    setShowClearConfirm(false);
    try {
      const res = await fetch('/api/cache/status', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addAlert('success', 'Cache cleared successfully!');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        fetchStatus();
      } else {
        addAlert('error', 'Failed to clear cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      addAlert('error', 'Network error');
    } finally {
      setClearLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Create a JSON export of the current status
      const exportData = {
        exportedAt: new Date().toISOString(),
        status: status,
        systemInfo: {
          model: 'mistral-7b-instruct-v0.1',
          database: 'SQLite (./data/cache.db)',
          ttl: {
            courses: '24 hours',
            questions: '12 hours',
            flashcards: '12 hours',
            scraped: '24 hours',
          },
        },
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cache-status-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addAlert('success', 'Cache status exported successfully');
    } catch (error) {
      console.error('Error exporting:', error);
      addAlert('error', 'Failed to export cache status');
    } finally {
      setExportLoading(false);
    }
  };

  const calculateMetrics = () => {
    if (!status) return { totalItems: 0, avgItemSize: 0, hitRate: 0 };

    const totalItems = status.coursesCount + status.flashcardsCount + status.questionsCount;
    const dbSizeStr = status.databaseSize.replace(' KB', '');
    const dbSize = parseFloat(dbSizeStr);
    const avgItemSize = totalItems > 0 ? (dbSize / totalItems).toFixed(2) : 0;

    return { totalItems, avgItemSize, dbSize };
  };

  const metrics = calculateMetrics();
  const timeUntilRefresh = '30s';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Back to App
          </Link>
          <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh status"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Alerts */}
      <div className="fixed top-20 right-6 z-40 space-y-3 max-w-md">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border backdrop-blur-md animate-slideUp ${
              alert.type === 'success'
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : alert.type === 'error'
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-blue-500/20 border-blue-500/50 text-blue-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {alert.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{alert.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading cache status...</p>
          </div>
        ) : status ? (
          <>
            {/* Quick Stats */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quick Stats</h2>
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Auto-refresh every 30s
                </label>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="glassmorphism rounded-lg p-6 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20">
                  <p className="text-sm text-slate-400 mb-2">Courses</p>
                  <p className="text-4xl font-bold text-indigo-400">{status.coursesCount}</p>
                  <p className="text-xs text-slate-500 mt-2">9 available</p>
                </div>

                <div className="glassmorphism rounded-lg p-6 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
                  <p className="text-sm text-slate-400 mb-2">Flashcards</p>
                  <p className="text-4xl font-bold text-pink-400">{status.flashcardsCount}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {status.flashcardsCount > 0
                      ? `${(status.flashcardsCount / 50).toFixed(1)}x coverage`
                      : 'Generate on demand'}
                  </p>
                </div>

                <div className="glassmorphism rounded-lg p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                  <p className="text-sm text-slate-400 mb-2">Test Questions</p>
                  <p className="text-4xl font-bold text-emerald-400">{status.questionsCount}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {status.questionsCount > 0
                      ? `${(status.questionsCount / 50).toFixed(1)}x coverage`
                      : 'Generate on demand'}
                  </p>
                </div>

                <div className="glassmorphism rounded-lg p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
                  <p className="text-sm text-slate-400 mb-2">Database Size</p>
                  <p className="text-4xl font-bold text-yellow-400">{status.databaseSize}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Avg {metrics.avgItemSize} KB/item
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                Last updated: {new Date(status.lastUpdated).toLocaleString()}
                {autoRefresh && ` • Next refresh in ${timeUntilRefresh}`}
              </p>
            </div>

            {/* Cache Management */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Scrape Section */}
              <div className="glassmorphism rounded-xl p-8 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-xl font-bold">Web Scraping</h3>
                </div>
                <p className="text-slate-300 mb-6">
                  Fetch latest Chamberlain & ANCC content via Cheerio. Cached for 24 hours to avoid rate limiting.
                </p>
                <button
                  onClick={handleScrape}
                  disabled={scrapeLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
                >
                  <RefreshCw className={`w-5 h-5 ${scrapeLoading ? 'animate-spin' : ''}`} />
                  {scrapeLoading ? 'Scraping...' : 'Start Web Scrape'}
                </button>
              </div>

              {/* Clear Cache Section */}
              <div className="glassmorphism rounded-xl p-8 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold">Cache Management</h3>
                </div>
                <p className="text-slate-300 mb-6">
                  Clear all cached data. Students will trigger regeneration on demand.
                </p>
                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg hover:shadow-red-500/50 rounded-lg font-semibold transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear All Cache
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-300 p-3 bg-red-500/20 rounded-lg border border-red-500/50">
                      ⚠️ This will delete all cached data. Continue?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleClearCache}
                        disabled={clearLoading}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg font-semibold transition-all"
                      >
                        {clearLoading ? 'Clearing...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        disabled={clearLoading}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export & Settings */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Export Section */}
              <div className="glassmorphism rounded-xl p-8 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold">Export Data</h3>
                </div>
                <p className="text-slate-300 mb-6">
                  Export cache status as JSON for backup or analysis.
                </p>
                <button
                  onClick={handleExport}
                  disabled={exportLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
                >
                  <Download className={`w-5 h-5 ${exportLoading ? 'animate-spin' : ''}`} />
                  {exportLoading ? 'Exporting...' : 'Export as JSON'}
                </button>
              </div>

              {/* Settings */}
              <div className="glassmorphism rounded-xl p-8 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">Configuration</h3>
                </div>
                <p className="text-slate-300 mb-6">
                  View and manage cache TTL settings.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-slate-700/20 rounded">
                    <span>Courses TTL</span>
                    <span className="font-mono text-cyan-400">24h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/20 rounded">
                    <span>Questions TTL</span>
                    <span className="font-mono text-cyan-400">12h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/20 rounded">
                    <span>Flashcards TTL</span>
                    <span className="font-mono text-cyan-400">12h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/20 rounded">
                    <span>Rationale TTL</span>
                    <span className="font-mono text-cyan-400">30d</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="glassmorphism rounded-xl p-8 border border-slate-700/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Information
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="font-semibold text-slate-400 mb-3">AI & NLP</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Model:</span>
                      <span className="font-mono text-slate-300">mistral-7b-instruct</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Provider:</span>
                      <span className="font-mono text-slate-300">Hugging Face API</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max tokens:</span>
                      <span className="font-mono text-slate-300">1500 (questions)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-slate-400 mb-3">Infrastructure</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database:</span>
                      <span className="font-mono text-slate-300">SQLite 3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Path:</span>
                      <span className="font-mono text-slate-300">./data/cache.db</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Framework:</span>
                      <span className="font-mono text-slate-300">Next.js 16</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-slate-400 mb-3">Scraping</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Parser:</span>
                      <span className="font-mono text-slate-300">Cheerio</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Timeout:</span>
                      <span className="font-mono text-slate-300">10s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cache TTL:</span>
                      <span className="font-mono text-slate-300">24h</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-slate-400 mb-3">Endpoints</p>
                  <div className="space-y-2 text-sm">
                    <div>/api/courses</div>
                    <div>/api/questions</div>
                    <div>/api/flashcards</div>
                    <div>/api/rationale</div>
                    <div>/api/scrape</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 glassmorphism rounded-xl p-8 border border-slate-700/50">
              <h3 className="text-lg font-bold mb-4">📚 Admin Guide</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                <div>
                  <p className="font-semibold text-slate-400 mb-2">Web Scraping</p>
                  <p>
                    Triggers Cheerio-based scraper to fetch content from Chamberlain & ANCC websites. Results are cached for 24 hours to avoid rate limits.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400 mb-2">Cache Management</p>
                  <p>
                    Clears all cached data (questions, flashcards, rationales). New content will be generated on-demand via Hugging Face API.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400 mb-2">Auto-Refresh</p>
                  <p>
                    When enabled, the dashboard updates every 30 seconds to show real-time cache statistics without requiring manual refresh.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400 mb-2">Export Data</p>
                  <p>
                    Exports current cache status as JSON file for backup, auditing, or integration with external analytics tools.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Failed to load cache status</p>
            <button
              onClick={fetchStatus}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, RotateCw, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

function FlashcardContent() {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('course');

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const url = courseCode
          ? `/api/flashcards?courseCode=${courseCode}`
          : '/api/flashcards';
        const res = await fetch(url);
        const data = await res.json();
        setFlashcards(data.flashcards || []);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [courseCode]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMastered = () => {
    setProgress({
      ...progress,
      [flashcards[currentIndex].id]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setProgress({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-slate-400">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gradient">Flashcard Mode</h1>
            <div className="w-20"></div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-slate-400 mb-4">No flashcards available yet.</p>
          <Link href="/">
            <button className="px-6 py-2 bg-indigo-500 rounded-lg font-semibold hover:bg-indigo-600">
              Go Back Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const masteredCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = (masteredCount / flashcards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gradient">Flashcard Mode</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-400">Progress: {masteredCount} of {flashcards.length} mastered</p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-all"
            >
              <RotateCw className="w-4 h-4" />
              Reset
            </button>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Card Container */}
        <div className="flex flex-col items-center justify-center min-h-96">
          {/* Flashcard */}
          <div
            onClick={handleFlip}
            className={`w-full max-w-2xl h-80 glassmorphism rounded-xl p-8 cursor-pointer flex flex-col items-center justify-center transition-all transform ${
              isFlipped ? 'scale-95' : ''
            } hover:border-pink-500/50`}
          >
            <p className="text-sm text-slate-400 mb-4">{currentIndex + 1} / {flashcards.length}</p>
            <div className="text-center">
              {!isFlipped ? (
                <>
                  <p className="text-sm text-slate-400 mb-4">QUESTION</p>
                  <p className="text-3xl font-bold leading-relaxed">{currentCard.front}</p>
                  <p className="text-slate-400 mt-8 text-sm">Click to reveal answer</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-400 mb-4">ANSWER</p>
                  <p className="text-2xl font-semibold leading-relaxed text-pink-300">{currentCard.back}</p>
                  <p className="text-slate-400 mt-8 text-sm">Click to hide answer</p>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-12 flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={handleMastered}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 rounded-lg font-semibold transition-all"
            >
              ✓ Mastered
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 glassmorphism rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Today's Stats</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-400">Total Cards</p>
              <p className="text-3xl font-bold">{flashcards.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400">Mastered</p>
              <p className="text-3xl font-bold text-green-400">{masteredCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400">Remaining</p>
              <p className="text-3xl font-bold text-blue-400">{flashcards.length - masteredCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-slate-400">Loading flashcards...</p>
        </div>
      </div>
    }>
      <FlashcardContent />
    </Suspense>
  );
}

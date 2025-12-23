'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, Clock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  domain: string;
  rationale?: string;
}

function TestContent() {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('course');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const url = courseCode
          ? `/api/questions?courseCode=${courseCode}`
          : '/api/questions?courseCode=NR601';
        const res = await fetch(url);
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseCode]);

  // Timer countdown
  useEffect(() => {
    if (!testStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, showResults]);

  const handleStartTest = () => {
    setTestStarted(true);
    setTimeLeft(60);
  };

  const handleAnswer = (optionIndex: number) => {
    if (showResults) return;

    setAnswers({
      ...answers,
      [currentIndex]: optionIndex,
    });

    // Auto advance
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const handleRetakeTest = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(60);
    setTestStarted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-slate-400">Loading test questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gradient">Practice Test</h1>
            <div className="w-20"></div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-slate-400 mb-4">No test questions available yet.</p>
          <Link href="/">
            <button className="px-6 py-2 bg-indigo-500 rounded-lg font-semibold hover:bg-indigo-600">
              Go Back Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gradient">Practice Test</h1>
            <div className="w-20"></div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="glassmorphism rounded-xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">ANCC-Style Practice Test</h2>
            <p className="text-slate-300 text-lg mb-8">
              {questions.length} questions • 60-second timer • Immediate feedback
            </p>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <span className="text-slate-300">ANCC domain-based questions</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <span className="text-slate-300">Timed test with countdown timer</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <span className="text-slate-300">AI-generated rationales for each answer</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <span className="text-slate-300">Score calculation by domain</span>
              </div>
            </div>

            <button
              onClick={handleStartTest}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-lg hover:shadow-emerald-500/50 rounded-lg font-bold text-lg transition-all"
            >
              Start Test →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctCount = Object.entries(answers).filter(
      ([idx, answerIdx]) =>
        parseInt(idx) < questions.length &&
        questions[parseInt(idx)].correctAnswer === answerIdx
    ).length;

    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gradient">Test Results</h1>
            <div className="w-20"></div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Score Card */}
          <div className="glassmorphism rounded-xl p-12 text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Score</h2>
            <div className="text-7xl font-bold text-gradient mb-4">{score}%</div>
            <p className="text-xl text-slate-300 mb-8">
              {correctCount} correct out of {questions.length} questions
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glassmorphism rounded-lg p-4">
                <p className="text-sm text-slate-400">Correct</p>
                <p className="text-2xl font-bold text-green-400">{correctCount}</p>
              </div>
              <div className="glassmorphism rounded-lg p-4">
                <p className="text-sm text-slate-400">Incorrect</p>
                <p className="text-2xl font-bold text-red-400">{questions.length - correctCount}</p>
              </div>
              <div className="glassmorphism rounded-lg p-4">
                <p className="text-sm text-slate-400">Unanswered</p>
                <p className="text-2xl font-bold text-slate-400">
                  {questions.length - Object.keys(answers).length}
                </p>
              </div>
            </div>

            <button
              onClick={handleRetakeTest}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/50 rounded-lg font-semibold transition-all"
            >
              Retake Test
            </button>
          </div>

          {/* Review Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Review Answers</h3>
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer !== undefined && q.correctAnswer === userAnswer;

              return (
                <div key={q.id} className="glassmorphism rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 mb-2">
                        Question {idx + 1} • {q.domain}
                      </p>
                      <p className="font-semibold">{q.question}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                      isCorrect
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          optIdx === q.correctAnswer
                            ? 'bg-green-500/20 border border-green-500/50'
                            : optIdx === userAnswer && !isCorrect
                            ? 'bg-red-500/20 border border-red-500/50'
                            : 'bg-slate-700/30'
                        }`}
                      >
                        <span className="font-semibold mr-3">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {option}
                        {optIdx === q.correctAnswer && ' ✓'}
                      </button>
                    ))}
                  </div>

                  {q.rationale && (
                    <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm text-slate-400 mb-1">Rationale:</p>
                      <p className="text-slate-300">{q.rationale}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-slate-400 text-sm">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <h1 className="text-2xl font-bold text-gradient">Practice Test</h1>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-400" />
            <span className={`font-bold ${timeLeft < 20 ? 'text-red-400' : 'text-slate-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-400 text-sm">{Object.keys(answers).length} answered</p>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="glassmorphism rounded-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-slate-400 mb-2">
                Domain: <span className="text-indigo-400">{currentQuestion.domain}</span>
              </p>
              <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedAnswer === idx
                    ? 'bg-indigo-500/30 border-2 border-indigo-500'
                    : 'bg-slate-700/30 border border-slate-600 hover:border-slate-500'
                }`}
              >
                <span className="font-bold mr-3 text-indigo-400">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
          >
            ← Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-lg hover:shadow-emerald-500/50 rounded-lg font-semibold transition-all"
            >
              Finish Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-slate-400">Loading test questions...</p>
        </div>
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}

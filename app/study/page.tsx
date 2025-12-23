'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Course {
  code: string;
  name: string;
  credits: number;
  clinicalHours: number;
}

export default function StudyMode() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gradient">Study Mode</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-slate-400">Loading courses...</p>
          </div>
        ) : (
          <>
            {!selectedCourse ? (
              // Course List View
              <div>
                <h2 className="text-3xl font-bold mb-2">Chamberlain PMHNP Program</h2>
                <p className="text-slate-400 mb-8">
                  {courses.length} courses • {courses.reduce((sum, c) => sum + c.credits, 0)} total credits
                </p>

                <div className="grid gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.code}
                      className="glassmorphism card-gradient rounded-lg p-6 cursor-pointer hover:border-indigo-500/50 transition-all group"
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">
                            {course.code}
                          </h3>
                          <p className="text-slate-300 mt-1">{course.name}</p>
                        </div>
                        <div className="text-right text-sm text-slate-400">
                          <p>{course.credits} credits</p>
                          {course.clinicalHours > 0 && (
                            <p>{course.clinicalHours} clinical hours</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Course Detail View
              <div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="mb-6 text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Courses
                </button>

                <div className="glassmorphism card-gradient rounded-lg p-8">
                  <div className="mb-6">
                    <h2 className="text-4xl font-bold mb-2">{selectedCourse.code}</h2>
                    <h3 className="text-2xl text-slate-300 mb-4">{selectedCourse.name}</h3>
                    <div className="flex gap-6">
                      <div className="glassmorphism rounded-lg p-4">
                        <p className="text-sm text-slate-400">Credits</p>
                        <p className="text-2xl font-bold">{selectedCourse.credits}</p>
                      </div>
                      {selectedCourse.clinicalHours > 0 && (
                        <div className="glassmorphism rounded-lg p-4">
                          <p className="text-sm text-slate-400">Clinical Hours</p>
                          <p className="text-2xl font-bold">
                            {selectedCourse.clinicalHours}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-8">
                    <h4 className="text-xl font-bold mb-4">Learning Objectives</h4>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Understand and apply theoretical concepts</li>
                      <li>• Develop clinical assessment skills</li>
                      <li>• Evaluate evidence-based interventions</li>
                      <li>• Synthesize knowledge in practice</li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-600">
                    <h4 className="text-xl font-bold mb-4">Next Steps</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link href={`/flashcards?course=${selectedCourse.code}`}>
                        <button className="w-full px-6 py-3 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 rounded-lg font-semibold transition-all">
                          Practice Flashcards →
                        </button>
                      </Link>
                      <Link href={`/test?course=${selectedCourse.code}`}>
                        <button className="w-full px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-lg font-semibold transition-all">
                          Take Practice Test →
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

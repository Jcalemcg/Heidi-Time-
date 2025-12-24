import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chamberlain PMHNP',
  description: 'Study Mode for Psychiatric Mental Health Nursing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white min-h-screen relative overflow-hidden">
        {/* Background blur elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}

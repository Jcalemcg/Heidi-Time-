import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
}

export function Header({
  title,
  subtitle,
  showBackButton = true,
  backHref = '/'
}: HeaderProps) {
  return (
    <div className="mb-8 animate-fade-in">
      {showBackButton && (
        <Link href={backHref} className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition">
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>
      )}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-slate-300 text-lg">{subtitle}</p>}
    </div>
  )
}

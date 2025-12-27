import Link from 'next/link'
import React from 'react'

interface ModeCardProps {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  color: 'blue' | 'green' | 'orange' | 'purple'
}

const colorMap = {
  blue: { bg: 'bg-blue-500/20', hover: 'hover:bg-blue-500/30', text: 'text-blue-400', icon: 'text-blue-400' },
  green: { bg: 'bg-green-500/20', hover: 'hover:bg-green-500/30', text: 'text-green-400', icon: 'text-green-400' },
  orange: { bg: 'bg-orange-500/20', hover: 'hover:bg-orange-500/30', text: 'text-orange-400', icon: 'text-orange-400' },
  purple: { bg: 'bg-purple-500/20', hover: 'hover:bg-purple-500/30', text: 'text-purple-400', icon: 'text-purple-400' }
}

export function ModeCard({ href, title, description, icon, buttonText, color }: ModeCardProps) {
  const colors = colorMap[color]

  return (
    <Link href={href}>
      <div className="glassmorphism p-8 rounded-2xl cursor-pointer transform transition-all hover:scale-105 group">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 ${colors.bg} rounded-lg ${colors.hover} transition`}>
            <div className={colors.icon}>{icon}</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        </div>
        <p className="text-slate-300 text-sm sm:text-base">{description}</p>
        <div className={`mt-4 flex items-center gap-2 ${colors.text} font-semibold`}>
          <span>{buttonText}</span>
          <span className="group-hover:translate-x-2 transition">→</span>
        </div>
      </div>
    </Link>
  )
}

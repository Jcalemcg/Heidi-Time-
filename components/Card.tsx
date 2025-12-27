import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  animate?: 'fade-in' | 'slide' | 'none'
}

export function Card({ children, className = '', animate = 'fade-in' }: CardProps) {
  const animateClass = animate !== 'none' ? `animate-${animate}` : ''
  return (
    <div className={`glassmorphism p-8 rounded-2xl ${animateClass} ${className}`}>
      {children}
    </div>
  )
}

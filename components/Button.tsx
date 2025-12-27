import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  icon,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'glassmorphism px-6 py-3 rounded-xl transition transform hover:scale-105 active:scale-95'
  const widthClass = fullWidth ? 'w-full' : ''
  const disabledClass = disabled ? 'disabled:opacity-50 disabled:cursor-not-allowed hover:scale-100' : ''

  return (
    <button
      className={`${baseClasses} ${widthClass} ${disabledClass} hover:bg-slate-800/80 flex items-center gap-2 justify-center`}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

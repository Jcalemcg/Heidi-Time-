interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const progress = Math.round((current / total) * 100)

  return (
    <div className="glassmorphism p-6 rounded-2xl animate-slide">
      <div className="flex justify-between items-center mb-3">
        {label && <span className="text-sm text-slate-400">{label}</span>}
        <span className="text-sm font-semibold text-blue-400">
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

interface StatsCardProps {
  value: string | number
  label: string
  color?: 'blue' | 'green' | 'orange' | 'purple'
}

const colorMap = {
  blue: 'text-blue-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  purple: 'text-purple-400'
}

export function StatsCard({ value, label, color = 'blue' }: StatsCardProps) {
  return (
    <div className="glassmorphism p-6 rounded-xl text-center">
      <div className={`text-3xl font-bold ${colorMap[color]} mb-2`}>{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  )
}

type StatsCardProps = {
  icon: string
  value: string | number
  label: string
  trend?: 'up' | 'down' | 'neutral'
  highlight?: boolean
}

export default function StatsCard({ icon, value, label, highlight = false }: StatsCardProps) {
  return (
    <div
      className={[
        'flex flex-col gap-2 rounded-xl border p-4 transition-all duration-200',
        highlight
          ? 'bg-primary-500/10 border-primary-500/30 hover:border-primary-500/50'
          : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700',
      ].join(' ')}
    >
      <span className="text-2xl leading-none select-none">{icon}</span>
      <span
        className={[
          'text-2xl font-bold leading-none tabular-nums',
          highlight ? 'text-primary-300' : 'text-neutral-50',
        ].join(' ')}
      >
        {value}
      </span>
      <span className="text-xs text-neutral-500 leading-tight">{label}</span>
    </div>
  )
}

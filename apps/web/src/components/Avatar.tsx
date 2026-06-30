const colors = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || parts[0] === '') return '#'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

function colorForId(id: number): string {
  return colors[Math.abs(id) % colors.length]!
}

interface AvatarProps {
  id: number
  name: string
  size?: 'sm' | 'md'
}

const sizeClass = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
}

export function Avatar({ id, name, size = 'md' }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${colorForId(id)} ${sizeClass[size]}`}
      title={name}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  )
}

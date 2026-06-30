import type { ReactNode } from 'react'

type Variant = 'neutral' | 'warning' | 'info' | 'success'

const variants: Record<Variant, string> = {
  neutral:
    'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
}

interface BadgeProps {
  variant?: Variant
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

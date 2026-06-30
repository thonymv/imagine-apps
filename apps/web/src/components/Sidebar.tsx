import { Ticket, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type View = 'customers' | 'tickets'

interface SidebarProps {
  current: View
  onChange: (view: View) => void
}

const items: { id: View; label: string; icon: LucideIcon }[] = [
  { id: 'customers', label: 'Clientes', icon: Users },
  { id: 'tickets', label: 'Tickets', icon: Ticket },
]

export function Sidebar({ current, onChange }: SidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-6 dark:border-neutral-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
          IA
        </div>
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          Imagine Apps
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map(({ id, label, icon: Icon }) => {
          const active = id === current
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-neutral-200 p-4 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        v1.0 · CRM demo
      </div>
    </aside>
  )
}

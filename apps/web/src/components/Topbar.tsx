import { Avatar } from './Avatar'

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-8 dark:border-neutral-800 dark:bg-neutral-950">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Sistema
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            admin@imagine-apps
          </p>
        </div>
        <Avatar id={0} name="Sistema" size="sm" />
      </div>
    </header>
  )
}

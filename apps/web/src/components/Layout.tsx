import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import type { View } from './Sidebar'
import { Topbar } from './Topbar'

interface LayoutProps {
  view: View
  onViewChange: (view: View) => void
  title: string
  subtitle?: string
  children: ReactNode
}

const subtitleByView: Record<View, string> = {
  customers: 'Gestiona tus clientes y contactos',
  tickets: 'Tickets de soporte y su estado',
}

export type { View }

export function Layout({
  view,
  onViewChange,
  title,
  subtitle,
  children,
}: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Sidebar current={view} onChange={onViewChange} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} subtitle={subtitle ?? subtitleByView[view]} />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className:
            '!bg-white !text-neutral-900 !shadow-lg !rounded-lg !border !border-neutral-200 dark:!bg-neutral-900 dark:!text-neutral-100 dark:!border-neutral-800',
        }}
      />
    </div>
  )
}

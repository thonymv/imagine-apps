import { useMemo } from 'react'
import { Plus, Users } from 'lucide-react'
import type { Customer } from '../../api/types'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'

interface CustomerListProps {
  customers: Customer[]
  onNew: () => void
}

export function CustomerList({ customers, onNew }: CustomerListProps) {
  const sorted = useMemo(
    () => [...customers].sort((a, b) => b.id - a.id),
    [customers],
  )

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12" />}
        title="Aún no hay clientes"
        description="Empieza creando tu primer cliente para poder registrar tickets."
        action={
          <Button icon={<Plus className="h-4 w-4" />} onClick={onNew}>
            Nuevo cliente
          </Button>
        }
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Clientes
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {sorted.length} en total
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={onNew}>
          Nuevo cliente
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-950/40">
            <tr>
              <th className="px-6 py-3 font-medium">Cliente</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Empresa</th>
              <th className="px-6 py-3 font-medium">Miembro desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {sorted.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar id={c.id} name={c.name} size="sm" />
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {c.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 text-neutral-600 dark:text-neutral-400">
                  {c.email}
                </td>
                <td className="px-6 py-3 text-neutral-600 dark:text-neutral-400">
                  {c.company ?? '—'}
                </td>
                <td className="px-6 py-3 text-neutral-500">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

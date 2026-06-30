import { useMemo } from 'react'
import { Plus, Ticket as TicketIcon } from 'lucide-react'
import type {
  Customer,
  Ticket,
  TicketStatus,
} from '../../api/types'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { StatusMenu } from '../../components/StatusMenu'

interface TicketListProps {
  tickets: Ticket[]
  customers: Customer[]
  onNew: () => void
  onStatusChange: (id: number, status: TicketStatus) => Promise<void>
}

export function TicketList({
  tickets,
  customers,
  onNew,
  onStatusChange,
}: TicketListProps) {
  const customerById = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers],
  )
  const sorted = useMemo(
    () => [...tickets].sort((a, b) => b.id - a.id),
    [tickets],
  )
  const hasCustomers = customers.length > 0

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<TicketIcon className="h-12 w-12" />}
        title="Aún no hay tickets"
        description={
          hasCustomers
            ? 'Crea tu primer ticket asociándolo a un cliente existente.'
            : 'Necesitas al menos un cliente para poder crear tickets.'
        }
        action={
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={onNew}
            disabled={!hasCustomers}
          >
            Nuevo ticket
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
            Tickets
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {sorted.length} en total
          </p>
        </div>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={onNew}
          disabled={!hasCustomers}
        >
          Nuevo ticket
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-950/40">
            <tr>
              <th className="px-6 py-3 font-medium">#</th>
              <th className="px-6 py-3 font-medium">Cliente</th>
              <th className="px-6 py-3 font-medium">Título</th>
              <th className="px-6 py-3 font-medium">Descripción</th>
              <th className="px-6 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {sorted.map((t) => {
              const customer = customerById.get(t.customer_id)
              return (
                <tr
                  key={t.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
                >
                  <td className="px-6 py-3 font-mono text-xs text-neutral-500">
                    #{t.id}
                  </td>
                  <td className="px-6 py-3">
                    {customer ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          id={customer.id}
                          name={customer.name}
                          size="sm"
                        />
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {customer.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-neutral-400">#{t.customer_id}</span>
                    )}
                  </td>
                  <td className="max-w-xs truncate px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    {t.title}
                  </td>
                  <td className="max-w-md px-6 py-3 text-neutral-600 dark:text-neutral-400">
                    <p className="line-clamp-2">{t.description}</p>
                  </td>
                  <td className="px-6 py-3">
                    <StatusMenu
                      value={t.status}
                      onChange={(s) => void onStatusChange(t.id, s)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

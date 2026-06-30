import {
  TICKET_STATUS_LABEL,
  type Customer,
  type Ticket,
  type TicketStatus,
} from '../../api/types'
import { StatusSelect } from './StatusSelect'

interface TicketListProps {
  tickets: Ticket[]
  customers: Customer[]
  busyId: number | null
  onStatusChange: (id: number, status: TicketStatus) => Promise<void>
}

export function TicketList({
  tickets,
  customers,
  busyId,
  onStatusChange,
}: TicketListProps) {
  if (tickets.length === 0) {
    return <p className="muted">No hay tickets registrados.</p>
  }
  const customerName = (id: number) =>
    customers.find((c) => c.id === id)?.name ?? `#${id}`

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{customerName(t.customer_id)}</td>
            <td>{t.title}</td>
            <td className="data-table__desc">{t.description}</td>
            <td>
              <StatusSelect
                value={t.status}
                disabled={busyId === t.id}
                onChange={(s) => void onStatusChange(t.id, s)}
              />
              <span className="data-table__sr-label">
                {' '}
                ({TICKET_STATUS_LABEL[t.status]})
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

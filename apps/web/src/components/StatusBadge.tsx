import { Badge } from './Badge'
import {
  TICKET_STATUS_LABEL,
  type TicketStatus,
} from '../api/types'

const variantByStatus: Record<TicketStatus, 'warning' | 'info' | 'success'> = {
  pendiente: 'warning',
  en_progreso: 'info',
  finalizado: 'success',
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Badge variant={variantByStatus[status]}>{TICKET_STATUS_LABEL[status]}</Badge>
}

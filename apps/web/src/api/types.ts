export interface Customer {
  id: number
  name: string
  email: string
  company: string | null
  created_at: string
}

export interface CustomerCreate {
  name: string
  email: string
  company?: string
}

export type TicketStatus = 'pendiente' | 'en_progreso' | 'finalizado'

export const TICKET_STATUSES: readonly TicketStatus[] = [
  'pendiente',
  'en_progreso',
  'finalizado',
] as const

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  finalizado: 'Finalizado',
}

export interface Ticket {
  id: number
  customer_id: number
  title: string
  description: string
  status: TicketStatus
  created_at: string
  updated_at: string
}

export interface TicketCreate {
  customer_id: number
  title: string
  description: string
  status?: TicketStatus
}

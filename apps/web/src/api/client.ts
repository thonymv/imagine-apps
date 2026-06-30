import type {
  Customer,
  CustomerCreate,
  Ticket,
  TicketCreate,
  TicketStatus,
} from './types'

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:8000/api/v1'

interface ApiErrorBody {
  detail?: string
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as ApiErrorBody
      if (body.detail) detail = body.detail
    } catch {
      // ignore json parse failure
    }
    throw new ApiError(res.status, detail)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

export const api = {
  listCustomers: () => request<Customer[]>('/customers'),
  createCustomer: (data: CustomerCreate) =>
    request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listTickets: () => request<Ticket[]>('/tickets'),
  createTicket: (data: TicketCreate) =>
    request<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTicketStatus: (id: number, status: TicketStatus) =>
    request<Ticket>(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}

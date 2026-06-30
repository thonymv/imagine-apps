import { useCallback, useEffect, useState } from 'react'

import { api } from '../api/client'
import type { Ticket, TicketCreate, TicketStatus } from '../api/types'

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTickets(await api.listTickets())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (data: TicketCreate) => {
    const created = await api.createTicket(data)
    setTickets((prev) => [...prev, created])
    return created
  }, [])

  const updateStatus = useCallback(
    async (id: number, status: TicketStatus) => {
      const updated = await api.updateTicketStatus(id, status)
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)))
      return updated
    },
    [],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  return { tickets, loading, error, refresh, create, updateStatus }
}

import { useCallback, useEffect, useState } from 'react'

import { api, ApiError } from '../api/client'
import type { Customer, CustomerCreate } from '../api/types'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setCustomers(await api.listCustomers())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (data: CustomerCreate) => {
    const created = await api.createCustomer(data)
    setCustomers((prev) => [...prev, created])
    return created
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  return { customers, loading, error, refresh, create, ApiError }
}

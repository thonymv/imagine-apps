import { useState } from 'react'
import type { FormEvent } from 'react'

import { ApiError } from '../../api/client'
import {
  TICKET_STATUSES,
  TICKET_STATUS_LABEL,
  type Customer,
  type TicketCreate,
  type TicketStatus,
} from '../../api/types'

interface TicketFormProps {
  customers: Customer[]
  busy: boolean
  onSubmit: (data: TicketCreate) => Promise<void>
}

export function TicketForm({ customers, busy, onSubmit }: TicketFormProps) {
  const [customerId, setCustomerId] = useState<number | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TicketStatus>('pendiente')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (customerId === '') {
      setError('Selecciona un cliente.')
      return
    }
    try {
      await onSubmit({
        customer_id: Number(customerId),
        title,
        description,
        status,
      })
      setTitle('')
      setDescription('')
      setStatus('pendiente')
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('El cliente seleccionado ya no existe.')
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      }
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Nuevo ticket</h3>
      <label className="field">
        <span>Cliente</span>
        <select
          value={customerId}
          onChange={(e) =>
            setCustomerId(e.target.value === '' ? '' : Number(e.target.value))
          }
          required
        >
          <option value="">— Selecciona —</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} — {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Título</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Descripción</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
        />
      </label>
      <label className="field">
        <span>Estado</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TicketStatus)}
        >
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {TICKET_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={busy || customers.length === 0}>
        {busy ? 'Creando…' : 'Crear'}
      </button>
    </form>
  )
}
